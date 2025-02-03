import { useQuery } from '@apollo/client';
import { useState } from 'react';

import GET_FAVOURITE_POSTS from '@/features/posts/api/queries/getFavouritePosts';
import GET_POSTS from '@/features/posts/api/queries/getPosts';
import { PageInfo, Post } from '@/features/posts/model/types/types';

interface UsePostsQueryResult {
    posts: Post[];
    pageInfo: PageInfo | null;
    loading: boolean;
    error: any;
    hasMore: boolean; // Флаг наличия дополнительных постов
    loadMore: () => void; // Функция для загрузки дополнительных постов
}

export const usePostsQuery = (type: 'NEW' | 'TOP' | 'LIKE'): UsePostsQueryResult => {
    const [hasMore, setHasMore] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);

    const query = type === 'LIKE' ? GET_FAVOURITE_POSTS : GET_POSTS;

    const { data, loading, error, fetchMore } = useQuery(query, {
        variables: {
            input: {
                limit: 10,
                type: type !== 'LIKE' ? type : undefined, // Убираем type для избранных постов
                afterCursor: null, // Изначально курсор отсутствует
            },
        },
        notifyOnNetworkStatusChange: true,
    });

    // Функция для загрузки дополнительных постов
    const loadMore = async () => {
        const pageInfo = type === 'LIKE' ? data?.favouritePosts?.pageInfo : data?.posts?.pageInfo;
        if (!pageInfo?.afterCursor || !hasMore || localLoading) return;

        setLocalLoading(true);

        try {
            const result = await fetchMore({
                variables: {
                    input: {
                        limit: 10,
                        type: type !== 'LIKE' ? type : undefined, // Убираем type для избранных постов
                        afterCursor: pageInfo.afterCursor,
                    },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

                    return type === 'LIKE'
                        ? {
                            favouritePosts: {
                                ...fetchMoreResult.favouritePosts,
                                data: [...prev.favouritePosts.data, ...fetchMoreResult.favouritePosts.data],
                            },
                        }
                        : {
                            posts: {
                                ...fetchMoreResult.posts,
                                data: [...prev.posts.data, ...fetchMoreResult.posts.data],
                            },
                        };
                },
            });

            // Проверяем, есть ли еще посты для загрузки
            if (!result.data?.favouritePosts?.pageInfo?.afterCursor && type === 'LIKE') {
                setHasMore(false);
            } else if (!result.data?.posts?.pageInfo?.afterCursor && type !== 'LIKE') {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Ошибка при загрузке дополнительных постов:', err);
        } finally {
            setLocalLoading(false); // Сбрасываем локальное состояние загрузки
        }
    };

    return {
        posts: type === 'LIKE' ? data?.favouritePosts?.data || [] : data?.posts?.data || [],
        pageInfo: type === 'LIKE' ? data?.favouritePosts?.pageInfo || null : data?.posts?.pageInfo || null,
        loading: loading || localLoading,
        error,
        hasMore,
        loadMore,
    };
};
