import { useQuery } from '@apollo/client';
import { useState } from 'react';

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

export const usePostsQuery = (type: 'NEW' | 'TOP'): UsePostsQueryResult => {
    const [hasMore, setHasMore] = useState(true); // Состояние для отслеживания наличия дополнительных постов
    const [localLoading, setLocalLoading] = useState(false); // Локальное состояние загрузки для fetchMore

    const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
        variables: {
            input: {
                limit: 10,
                type: type,
                afterCursor: null, // Изначально курсор отсутствует
            },
        },
        notifyOnNetworkStatusChange: true,
    });

    // Функция для загрузки дополнительных постов
    const loadMore = async () => {
        if (!data?.posts.pageInfo.afterCursor || !hasMore || localLoading) return;

        setLocalLoading(true); // Устанавливаем локальное состояние загрузки

        try {
            const result = await fetchMore({
                variables: {
                    input: {
                        limit: 10,
                        type: type,
                        afterCursor: data.posts.pageInfo.afterCursor, // Используем afterCursor для пагинации
                    },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

                    return {
                        posts: {
                            ...fetchMoreResult.posts,
                            data: [...prev.posts.data, ...fetchMoreResult.posts.data], // Объединяем старые и новые посты
                        },
                    };
                },
            });

            // Проверяем, есть ли еще посты для загрузки
            if (!result.data.posts.pageInfo.afterCursor) {
                setHasMore(false); // Если afterCursor отсутствует, значит, постов больше нет
            }
        } catch (err) {
            console.error('Ошибка при загрузке дополнительных постов:', err);
        } finally {
            setLocalLoading(false); // Сбрасываем локальное состояние загрузки
        }
    };

    return {
        posts: data?.posts.data || [], // Посты
        pageInfo: data?.posts.pageInfo || null, // Информация о пагинации
        loading: loading || localLoading, // Общее состояние загрузки (основной запрос или fetchMore)
        error, // Ошибка, если есть
        hasMore, // Флаг наличия дополнительных постов
        loadMore, // Функция для загрузки дополнительных постов
    };
};
