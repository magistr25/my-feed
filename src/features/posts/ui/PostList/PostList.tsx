import { FC } from 'react';

import { PostData } from '@/features/posts/model/types/types';

import Post from '../Post/Post';

interface PostListProps {
    posts: PostData[];
}

const PostList: FC<PostListProps> = ({ posts }) => {
    return (
        <div className="post-list">
            {posts.map((post) => (
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
