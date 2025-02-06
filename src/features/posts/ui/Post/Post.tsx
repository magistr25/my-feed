import './Post.scss';

import {useReactiveVar} from '@apollo/client';
import {FC} from 'react';

import {likeVar} from "@/app/apollo/client.ts";
import closeIcon from '@/assets/images/close.png';
import {formatDate} from '@/features/posts/lib/formatDate';
import { formatDescription } from '@/features/posts/lib/formatDescription';
import {useAvatarError} from '@/features/posts/lib/handleAvatarError';
import {useLikePost} from '@/features/posts/lib/handleLike';
import {useReadMore} from '@/features/posts/lib/handleReadMore';
import { usePostExpand } from '@/features/posts/lib/usePostExpand';
import {useScreenSize} from '@/features/posts/lib/useScreenSize';
import {PostProps} from '@/features/posts/model/types/types';
import DefaultAvatar from '@/shared/ui/DefaultAvatar/DefaultAvatar.tsx';
import HeartIcon from '@/shared/ui/HeartIcon/HeartIcon.tsx';
import SharePopup from '@/shared/ui/SharePopup/SharePopup.tsx';
import EditButton from "@/shared/ui/EditButton/EditButton.tsx";
import {useLocation} from "react-router-dom";

const Post: FC<PostProps> = ({id, author, createdAt, title, description, mediaUrl, isLiked}) => {
    const {avatarError, setAvatarError} = useAvatarError();
    const {isLargeScreen} = useScreenSize();
    const {showFullPost, fullDescription, loading, error, handleReadMore, handleClosePost} = useReadMore(id);
    const {handleLike} = useLikePost(id, isLiked);
    const isLikedState = useReactiveVar(likeVar)[id] ?? isLiked;
    const { isExpanded, handleExpand, handleClose } = usePostExpand(handleReadMore, handleClosePost);
    const formattedDescription = formatDescription(description, fullDescription, showFullPost, isLargeScreen);
    const location = useLocation();
    const isViewMode = location.pathname === "/my-posts/view";
    return (
        <>
            <div className={`overlay ${isExpanded ? 'overlay--visible' : ''}`} onClick={handleClose} />
            <article className={`post ${isExpanded ? 'post--expanded' : ''}`}>
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
                        <h3 className="post__author">{`${author.firstName} ${author.lastName}`}</h3>
                        <time className="post__date">{formatDate(createdAt)}</time>
                    </div>
                    {showFullPost && (
                        <button className="post__close-button" onClick={handleClose}>
                            <img src={closeIcon} alt="Close" />
                        </button>
                    )}
                </header>
                <h2 className="post__title">{title}</h2>
                <img className="post__image" src={mediaUrl} alt="" />
                <p className="post__content">
                    <span className={`post__content__description ${showFullPost ? 'post__content__description_full' : ''}`}>
                        {formattedDescription}
                        {!showFullPost && !loading && !error && (
                            <button className="post__read-more_max" onClick={handleExpand}>Читать больше</button>
                        )}
                    </span>
                    {!showFullPost && !loading && !error && (
                        <button className="post__read-more_min" onClick={handleExpand}>Читать больше</button>
                    )}
                    {loading && <span className="post__loading"></span>}
                    {error && <span className="post__error">{error}</span>}
                </p>

                <div className="post__actions">
                    <HeartIcon onClick={handleLike} isActive={isLikedState} />
                    <SharePopup isExpanded={showFullPost} />
                    {isViewMode && (
                        <EditButton
                            postId={String(id)}
                            title={title}
                            description={description}
                            image={mediaUrl}
                        />
                    )}
                </div>
            </article>
        </>
    );
};

export default Post;
