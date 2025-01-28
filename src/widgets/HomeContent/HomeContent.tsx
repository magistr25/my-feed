import './HomeContent.scss';

import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostList from "@/features/posts/ui/PostList/PostList.tsx";
import LoadingPost from "@/shared/ui/LoadingPost/LoadingPost.tsx";

interface HomeContentProps {
    posts: any[];
    hasMore: boolean;
    loadMore: () => void;
    onLike: (postId: string) => void;
    isLoading?: boolean;
}

const HomeContent: FC<HomeContentProps> = ({ posts, hasMore, loadMore, onLike, isLoading }) => {
    return (
        <main className="homepage__content">
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h4><LoadingPost /></h4>}
                endMessage={<p>Постов больше нет</p>}
            >
                {isLoading ? (
                    <LoadingPost /> // Отображаем скелетон, если данные загружаются
                ) : (
                    <PostList posts={posts} isLoading={false} onLike={onLike} />
                )}
            </InfiniteScroll>
        </main>
    );
};

export default HomeContent;
