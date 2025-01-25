import { useQuery } from '@apollo/client';

import GET_POSTS from '@/features/posts/api/queries/getPosts';
import { PageInfo,Post } from '@/features/posts/model/types/types';

interface UsePostsQueryResult {
    posts: Post[];
    pageInfo: PageInfo | null;
    loading: boolean;
    error: any;
    loadMore: () => void;
}

export const usePostsQuery = (type: 'NEW' | 'TOP'): UsePostsQueryResult => {
    const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
        variables: {
            input: {
                limit: 10,
                type: type,
                afterCursor: null,
            },
        },
        notifyOnNetworkStatusChange: true,
    });

    const loadMore = async () => {
        if (!data?.posts.pageInfo.afterCursor) return;

        try {
            await fetchMore({
                variables: {
                    input: {
                        limit: 10,
                        type: type,
                        afterCursor: data.posts.pageInfo.afterCursor,
                    },
                },
            });
        } catch (err) {
            console.error('Ошибка при загрузке дополнительных постов:', err);
        }
    };

    return {
        posts: data?.posts.data || [],
        pageInfo: data?.posts.pageInfo || null,
        loading,
        error,
        loadMore,
    };
};
