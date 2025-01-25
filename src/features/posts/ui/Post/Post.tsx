import './Post.scss';

import {FC, useEffect, useState} from 'react';

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

const Post: FC<PostProps> = ({ id, author, createdAt, title, description, mediaUrl, onLike, isLiked }) => {
    const [avatarError, setAvatarError] = useState(false); // Состояние для отслеживания ошибки загрузки аватарки
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        // Получаем день, месяц и год
        const day = String(date.getDate()).padStart(2, '0'); // Добавляем ведущий ноль, если нужно
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0, поэтому +1
        const year = date.getFullYear();

        // Возвращаем дату в формате дд.мм.гггг
        return `${day}.${month}.${year}`;
    };
    const formattedDescription = isLargeScreen
        ? description.length > 200
            ? description.slice(0, 197).replace(/.{3}$/, '…')
            : description.replace(/.{3}$/, '…')
        : description.replace(/.{3}$/, '…');
    return (
        <article className="post">
            <header className="post__header">
                {author.avatarUrl && !avatarError ? (
                    <img
                        className="post__avatar"
                        src={author.avatarUrl}
                        alt={`${author.firstName} ${author.lastName}`}
                        onError={() => setAvatarError(true)} // Обработчик ошибки загрузки
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
            <HeartIcon onClick={() => onLike(id)} isActive={isLiked} />
                <SharePopup />
            </div>
        </article>
    );
};

export default Post;
