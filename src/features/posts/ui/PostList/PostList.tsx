import { FC } from 'react';

import { PostData } from '@/features/posts/model/types/types';
import LoadingPost from '@/shared/ui/LoadingPost/LoadingPost';

import Post from '../Post/Post';

interface PostListProps {
    posts?: PostData[];
    isLoading: boolean;
}

const PostList: FC<PostListProps> = ({ posts, isLoading }) => {
    // Если данные загружаются, отображаем "загрузочные" посты
    if (isLoading) {
        return (
            <div className="post-list">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="post-list__loading">
                        <LoadingPost />
                    </div>
                ))}
            </div>
        );
    }

    // Отображаем реальные посты, если загрузка завершена
    return (
        <div className="post-list">
            {posts?.map((post) => (
                <Post
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    mediaUrl={post.mediaUrl}
                    createdAt={post.createdAt}
                    author={{
                        avatarUrl: post.author.avatarUrl,
                        firstName: post.author.firstName,
                        lastName: post.author.lastName,
                    }}
                    onLike={() => {}} // Заглушка для onLike
                    isLiked={false} // Заглушка для isLiked
                />
            ))}
        </div>
    );
};

export default PostList;

