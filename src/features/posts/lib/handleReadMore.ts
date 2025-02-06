import { useState } from 'react';

import  client from '@/app/apollo/client';
import { getFullPost } from '@/features/posts/model/services/postService';

export const useReadMore = (id: string) => {
    const [showFullPost, setShowFullPost] = useState(false);
    const [fullDescription, setFullDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReadMore = async () => {
        setLoading(true);
        setError(null);
        try {
            const fullPostData = await getFullPost(client, id);
            console.log('Полный пост:', fullPostData);
            setFullDescription(fullPostData.description);
            setShowFullPost(true);
        } catch (error) {
            console.error('Ошибка при загрузке полного текста:', error);
            setError('Не удалось загрузить полный текст.');
        } finally {
            setLoading(false);
        }
    };


    const handleClosePost = () => {
        setShowFullPost(false);
    };

    return { showFullPost, fullDescription, loading, error, handleReadMore, handleClosePost };
};
