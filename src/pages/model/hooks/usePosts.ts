import { useApolloClient } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import GET_FAVOURITE_POSTS from "@/features/posts/api/queries/getFavouritePosts.ts";
import { usePostsQuery } from "@/features/posts/model/hooks/UsePostsQuery.ts";
import { Post } from "@/features/posts/model/types/types.ts";
import GET_POSTS from "@/features/posts/api/queries/getPosts.ts";
import { GET_MY_POSTS } from "@/features/posts/api/queries/getMyPost.ts";
import {likeVar} from "@/app/apollo/client.ts";

export const usePosts = (type: "NEW" | "TOP" | "LIKE" | "MY") => {
    const { posts, loading, hasMore, loadMore } = usePostsQuery(type);
    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [isFetchingLikes, setIsFetchingLikes] = useState(false);
    const [isFetchingMyPosts, setIsFetchingMyPosts] = useState(false);
    const client = useApolloClient();

    // Читаем кэш для всех типов постов
    useEffect(() => {
        try {
            let cachedPosts: Post[];

            if (type === "MY") {
                cachedPosts = client.cache.readQuery<{ myPosts: Post[] }>({ query: GET_MY_POSTS })?.myPosts || [];
            } else if (type === "LIKE") {
                cachedPosts = client.cache.readQuery<{ favouritePosts: Post[] }>({ query: GET_FAVOURITE_POSTS })?.favouritePosts || [];
            } else {
                cachedPosts = client.cache.readQuery<{ posts: Post[] }>({ query: GET_POSTS })?.posts || [];
            }

            if (cachedPosts.length > 0) {
                setLocalPosts(cachedPosts);
            } else {
                loadMore(); //Если кэша нет, грузим с сервера
            }
        } catch (error) {
            loadMore();
        }
    }, [client, type]);

    useEffect(() => {
        if (posts.length > 0) {
            setLocalPosts(posts);
        }
    }, [posts]);


    // Функция для загрузки своих постов
    const fetchMyPosts = useCallback(async () => {
        try {
            setIsFetchingMyPosts(true);
            const { data } = await client.query({
                query: GET_MY_POSTS,
                variables: { input: { limit: 10, afterCursor: null } },
                fetchPolicy: "network-only",
            });

            if (data?.myPosts?.data) {
                client.cache.modify({
                    fields: {
                        myPosts(existingMyPosts = []) {
                            return [...(Array.isArray(existingMyPosts) ? existingMyPosts : []), ...data.myPosts.data];
                        },
                    },
                });

                setLocalPosts(data.myPosts.data);
            }
        } catch (error) {
            console.error("Ошибка при загрузке своих постов:", error);
        } finally {
            setIsFetchingMyPosts(false);
        }
    }, [client]);



    // Функция для загрузки лайков
    const fetchLikes = useCallback(async () => {
        try {
            setIsFetchingLikes(true); // Устанавливаем, что лайки загружаются
            const { data } = await client.query({
                query: GET_FAVOURITE_POSTS,
                variables: {
                    input: { limit: 10, afterCursor: null },
                },
                fetchPolicy: "network-only",
            });

            if (data?.favouritePosts?.data) {
                setLocalPosts(data.favouritePosts.data);
            }
        } catch (error) {
            console.error("Ошибка при загрузке лайков:", error);
        } finally {
            setIsFetchingLikes(false); // Загружаем ли лайки завершено
        }
    }, [client]);

    // Функция для добавления нового поста в кэш
    const addNewPost = useCallback((newPost: Post) => {
        try {
            client.cache.modify({
                fields: {
                    myPosts(existingMyPosts = []) {
                        return [newPost, ...(Array.isArray(existingMyPosts) ? existingMyPosts : [])];
                    },
                    posts(existingPosts = []) {
                        return [newPost, ...(Array.isArray(existingPosts) ? existingPosts : [])];
                    },
                },
            });

            setLocalPosts((prevPosts) => [newPost, ...prevPosts]);

            console.log("Пост добавлен в кэш:", newPost);
        } catch (error) {
            console.error("Ошибка при добавлении поста в кэш:", error);
        }
    }, [client]);



    // Функция обработки лайков
    const handleLike = useCallback(async (postId: string) => {
        try {
            const post = localPosts.find((p) => p.id === postId);
            if (!post) return;

            const updatedPost = { ...post, isLiked: !post.isLiked };
            const updatedPosts = localPosts.map((p) =>
                p.id === postId ? updatedPost : p
            );
            setLocalPosts(updatedPosts);

            // Обновляем глобальную переменную likeVar
            likeVar({
                ...likeVar(),
                [postId]: updatedPost.isLiked,
            });

            // Принудительно обновляем кэш favouritePosts
            client.cache.updateQuery({ query: GET_FAVOURITE_POSTS }, (existingData: any) => {
                if (!existingData?.favouritePosts) return { favouritePosts: [] };

                return {
                    favouritePosts: updatedPost.isLiked
                        ? [updatedPost, ...existingData.favouritePosts] // Добавляем
                        : existingData.favouritePosts.filter((p: Post) => p.id !== postId), // Удаляем
                };
            });

            // Обновляем isLiked в кэше для `posts` и `myPosts`
            client.cache.modify({
                id: client.cache.identify({ __typename: "PostModel", id: postId }),
                fields: {
                    isLiked() {
                        return updatedPost.isLiked;
                    },
                },
            });

        } catch (error) {
            console.error("Ошибка при обновлении лайка:", error);
        }
    }, [client, localPosts]);



    return {
        localPosts,
        loading: loading || isFetchingLikes || isFetchingMyPosts,
        hasMore,
        loadMore,
        fetchLikes,
        fetchMyPosts,
        addNewPost,
        handleLike
    };
};
