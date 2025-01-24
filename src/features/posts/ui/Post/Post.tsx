import './Post.scss';

import { FC} from 'react';

import HeartIcon from "@/shared/ui/HeartIcon/HeartIcon.tsx";
import SharePopup from "@/shared/ui/SharePopup/SharePopup.tsx";

interface PostProps {
    id: number;
    author: string;
    date: string;
    title: string;
    content: string;
    imageUrl: string;
    avatarUrl: string;
    onLike: (id: number) => void; // Функция для обработки лайков
    isLiked: boolean; // Состояние лайка
}

const Post: FC<PostProps> = ({ id, author, date, title, content, imageUrl, avatarUrl, onLike, isLiked }) => {

    return (
        <article className="post">
            <header className="post__header">
                <img className="post__avatar" src={avatarUrl} alt={`${author} avatar`} />
                <div className="post__meta">
                    <h3 className="post__author">{author}</h3>
                    <time className="post__date">{date}</time>
                </div>
            </header>
            <h2 className="post__title">{title}</h2>
            <img className="post__image" src={imageUrl} alt={title} />
            <p className="post__content">
                <span>{content}</span>
                <a href="#" className="post__read-more">Читать больше</a>
            </p>
            <div className="post__actions">
                <HeartIcon onClick={() => onLike(id)} isActive={isLiked} /> {/* Используем пропс isLiked */}
                <SharePopup />
            </div>
        </article>
    );
};

export default Post;
