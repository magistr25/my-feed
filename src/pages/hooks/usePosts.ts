import { useApolloClient } from '@apollo/client';
import { useEffect,useState } from 'react';

import { toggleLike } from '@/features/posts/lib/postService.ts';
import { usePostsQuery } from '@/features/posts/model/hooks/UsePostsQuery.ts';

export const usePosts = (type: 'NEW' | 'TOP') => {
    const { posts, loading, hasMore, loadMore } = usePostsQuery(type);
    const [localPosts, setLocalPosts] = useState(posts);
    const client = useApolloClient();

    useEffect(() => {
        if (JSON.stringify(localPosts) !== JSON.stringify(posts)) {
            setLocalPosts(posts);
        }
    }, [posts, localPosts]);

    const handleLike = async (postId: string) => {
        try {
            const post = localPosts.find((p) => p.id === postId);
            if (!post) return;

            const updatedPost = await toggleLike(client, postId, post.isLiked);

            const updatedPosts = localPosts.map((p) =>
                p.id === postId ? { ...p, isLiked: updatedPost.isLiked } : p
            );
            setLocalPosts(updatedPosts);

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
        loading,
        hasMore,
        loadMore,
        handleLike,
    };
};
