import './Post.scss';

import { useMutation } from '@apollo/client';
import { FC, useEffect, useState } from 'react';

import { POST_LIKE } from '@/features/posts/api/mutations/postLike';
import {  POST_UNLIKE } from '@/features/posts/api/mutations/postUnlike';
import DefaultAvatar from "@/shared/ui/DefaultAvatar/DefaultAvatar.tsx";
import HeartIcon from "@/shared/ui/HeartIcon/HeartIcon.tsx";
import SharePopup from "@/shared/ui/SharePopup/SharePopup.tsx";

interface PostProps {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    createdAt: string;
    author: {
        avatarUrl: string;
        firstName: string;
        lastName: string;
    };
    onLike: (id: string) => void;
    isLiked: boolean;
}

const Post: FC<PostProps> = ({ id, author, createdAt, title, description, mediaUrl, isLiked }) => {
    const [avatarError, setAvatarError] = useState(false); // Состояние для отслеживания ошибки загрузки аватарки
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
    const [localIsLiked, setLocalIsLiked] = useState(isLiked); // Локальное состояние лайков

    const [likePost] = useMutation(POST_LIKE);
    const [unlikePost] = useMutation(POST_UNLIKE);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const formattedDescription = isLargeScreen
        ? description.length > 200
            ? description.slice(0, 197).replace(/.{3}$/, '…')
            : description.replace(/.{3}$/, '…')
        : description.replace(/.{3}$/, '…');

    const handleLike = async () => {
        try {
            if (localIsLiked) {
                // Снятие лайка
                const { data } = await unlikePost({ variables: { input: { id } } });
                setLocalIsLiked(data.postUnlike.isLiked);

            } else {
                // Установка лайка
                const { data } = await likePost({ variables: { input: { id } } });
                setLocalIsLiked(data.postLike.isLiked);

            }
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);
        }
    };

    return (
        <article className="post">
            <header className="post__header">
                {author.avatarUrl && !avatarError ? (
                    <img
                        className="post__avatar"
                        src={author.avatarUrl}
                        alt={`${author.firstName} ${author.lastName}`}
                        onError={() => setAvatarError(true)}
                    />
                ) : (
                    <DefaultAvatar />
                )}
                <div className="post__meta">
                    <h3 className="post__author">{author.firstName} {author.lastName}</h3>
                    <time className="post__date">{formatDate(createdAt)}</time>
                </div>
            </header>
            <h2 className="post__title">{title}</h2>
            <img className="post__image" src={mediaUrl} alt={title} />
            <p className="post__content">
                <span className="post__content__description">{formattedDescription}</span>
                <a href="#" className="post__read-more">Читать больше</a>
            </p>
            <div className="post__actions">
                <HeartIcon onClick={handleLike} isActive={localIsLiked} />
                <SharePopup />
            </div>
        </article>
    );
};

export default Post;
