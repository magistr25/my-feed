import { FC, useState } from 'react';

import Post from '../Post/Post';

interface PostData {
    id: number;
    author: string;
    date: string;
    title: string;
    content: string;
    imageUrl: string;
    avatarUrl: string;
}

interface PostListProps {
    posts: PostData[];
}

const PostList: FC<PostListProps> = ({ posts }) => {
    const [likedPosts, setLikedPosts] = useState<number[]>([]); // Список ID лайкнутых постов

    const handleLike = (id: number) => {
        setLikedPosts((prevLikedPosts) =>
            prevLikedPosts.includes(id)
                ? prevLikedPosts.filter((postId) => postId !== id) // Убираем лайк
                : [...prevLikedPosts, id] // Добавляем лайк
        );
    };

    return (
        <div className="post-list">
            {posts.map((post, index) => (
                <Post
                    key={`${post.id}-${index}`}
                    {...post}
                    onLike={handleLike}
                    isLiked={likedPosts.includes(post.id)}
                />
            ))}

        </div>
    );
};

export default PostList;
