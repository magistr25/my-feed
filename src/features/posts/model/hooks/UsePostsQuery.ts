import { useQuery } from '@apollo/client';
import { useState } from 'react';

import GET_FAVOURITE_POSTS from '@/features/posts/api/queries/getFavouritePosts';
import GET_POSTS from '@/features/posts/api/queries/getPosts';
import { PageInfo, Post } from '@/features/posts/model/types/types';
import {GET_MY_POSTS} from "@/features/posts/api/queries/getMyPost.ts";

interface UsePostsQueryResult {
    posts: Post[];
    pageInfo: PageInfo | null;
    loading: boolean;
    error: any;
    hasMore: boolean;
    loadMore: () => void;
}

export const usePostsQuery = (type: 'NEW' | 'TOP' | 'LIKE' | 'MY'): UsePostsQueryResult => {
    const [hasMore, setHasMore] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);

    // Выбираем нужный запрос
    const query =
        type === 'LIKE' ? GET_FAVOURITE_POSTS
            : type === 'MY' ? GET_MY_POSTS
                : GET_POSTS;

    const { data, loading, error, fetchMore } = useQuery(query, {
        variables: {
            input: {
                limit: 10,
                type: type !== "LIKE" && type !== "MY" ? type : undefined,
                afterCursor: null,
            },
        },
        notifyOnNetworkStatusChange: true,
    });


    // Функция для загрузки дополнительных постов
    const loadMore = async () => {
        const pageInfo =
            type === 'LIKE' ? data?.favouritePosts?.pageInfo
                : type === 'MY' ? data?.myPosts?.pageInfo
                    : data?.posts?.pageInfo;

        if (!pageInfo?.afterCursor || !hasMore || localLoading) return;

        setLocalLoading(true);

        try {
            const result = await fetchMore({
                variables: {
                    input: {
                        limit: 10,
                        type: type !== 'LIKE' && type !== 'MY' ? type : undefined,
                        afterCursor: pageInfo.afterCursor,
                    },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

                    const mergeUniquePosts = (existingPosts: Post[], newPosts: Post[]) => {
                        const allPosts = [...existingPosts, ...newPosts];

                        // Убираем дубликаты по id
                        return allPosts.filter(
                            (post, index, arr) => arr.findIndex(p => p.id === post.id) === index
                        );
                    };

                    return type === 'LIKE'
                        ? {
                            favouritePosts: {
                                ...fetchMoreResult.favouritePosts,
                                data: mergeUniquePosts(prev.favouritePosts.data, fetchMoreResult.favouritePosts.data),
                            },
                        }
                        : type === 'MY'
                            ? {
                                myPosts: {
                                    ...fetchMoreResult.myPosts,
                                    data: mergeUniquePosts(prev.myPosts.data, fetchMoreResult.myPosts.data),
                                },
                            }
                            : {
                                posts: {
                                    ...fetchMoreResult.posts,
                                    data: mergeUniquePosts(prev.posts.data, fetchMoreResult.posts.data),
                                },
                            };
                }

            });

            // Проверяем, есть ли еще посты для загрузки
            if (!result.data?.favouritePosts?.pageInfo?.afterCursor && type === 'LIKE') {
                setHasMore(false);
            } else if (!result.data?.myPosts?.pageInfo?.afterCursor && type === 'MY') {
                setHasMore(false);
            } else if (!result.data?.posts?.pageInfo?.afterCursor && type !== 'LIKE' && type !== 'MY') {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Ошибка при загрузке дополнительных постов:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    return {
        posts:
            type === 'LIKE' ? data?.favouritePosts?.data || []
                : type === 'MY' ? data?.myPosts?.data || []
                    : data?.posts?.data || [],
        pageInfo:
            type === 'LIKE' ? data?.favouritePosts?.pageInfo || null
                : type === 'MY' ? data?.myPosts?.pageInfo || null
                    : data?.posts?.pageInfo || null,
        loading: loading || localLoading,
        error,
        hasMore,
        loadMore,
    };
};
