import { useApolloClient } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

import { likeVar } from "@/app/apollo/client.ts";
import GET_FAVOURITE_POSTS from "@/features/posts/api/queries/getFavouritePosts.ts";
import { usePostsQuery } from "@/features/posts/model/hooks/UsePostsQuery.ts";
import { Post } from "@/features/posts/model/types/types.ts";

export const usePosts = (type: "NEW" | "TOP" | "LIKE") => {
    const { posts, loading, hasMore, loadMore } = usePostsQuery(type);
    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [isFetchingLikes, setIsFetchingLikes] = useState(false); // для управления загрузкой лайков
    const client = useApolloClient();

    // Обновляем локальные посты при изменении данных
    useEffect(() => {
        if (posts.length > 0) {
            setLocalPosts(posts);
        }
    }, [posts]);

    // Функция для загрузки лайков
    const fetchLikes = useCallback(async () => {
        try {
            setIsFetchingLikes(true);
            const { data } = await client.query({
                query: GET_FAVOURITE_POSTS,
                variables: {
                    input: {
                        limit: 10,
                        afterCursor: null,
                    },
                },
                fetchPolicy: 'network-only',
            });

            if (data?.favouritePosts?.data) {
                setLocalPosts(data.favouritePosts.data);
            }
        } catch (error) {
            console.error('Ошибка при загрузке лайков:', error);
        } finally {
            setIsFetchingLikes(false);
        }
    }, [client, setLocalPosts]);

    // Функция обработки лайков
    const handleLike = async (postId: string) => {
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

            // Обновляем Apollo Cache
            client.cache.modify({
                id: client.cache.identify({ __typename: 'PostModel', id: postId }),
                fields: {
                    isLiked() {
                        return updatedPost.isLiked;
                    },
                },
            });
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);
        }
    };

    return {
        localPosts,
        loading: loading || isFetchingLikes,
        hasMore,
        loadMore,
        handleLike,
        fetchLikes,
    };
};
