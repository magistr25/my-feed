import { useMutation } from '@apollo/client';

import { likeVar } from '@/app/apollo/client.ts';

import { POST_LIKE} from '../api/mutations/postLike';
import { POST_UNLIKE } from '../api/mutations/postUnlike';

export const useLikePost = (id: string, isLiked: boolean) => {
    const [likePost] = useMutation(POST_LIKE, {
        update(cache, { data }) {
            if (data?.postLike) {
                cache.modify({
                    id: cache.identify({ __typename: 'PostModel', id }),
                    fields: {
                        isLiked() {
                            return data.postLike.isLiked;
                        },
                        likesCount(existing) {
                            return existing + 1;
                        },
                    },
                });
                likeVar({ ...likeVar(), [id]: data.postLike.isLiked });
            }
        },
    });

    const [unlikePost] = useMutation(POST_UNLIKE, {
        update(cache, { data }) {
            if (data?.postUnlike) {
                cache.modify({
                    id: cache.identify({ __typename: 'PostModel', id }),
                    fields: {
                        isLiked() {
                            return data.postUnlike.isLiked;
                        },
                        likesCount(existing) {
                            return existing - 1;
                        },
                    },
                });
                likeVar({ ...likeVar(), [id]: data.postUnlike.isLiked });
            }
        },
    });

    const handleLike = async () => {
        try {
            if (isLiked) {
                await unlikePost({ variables: { input: { id } } });
            } else {
                await likePost({ variables: { input: { id } } });
            }
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);
        }
    };

    return { handleLike };
};
