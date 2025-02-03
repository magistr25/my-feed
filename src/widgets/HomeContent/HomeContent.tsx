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
    isLoading: boolean;
}

const HomeContent: FC<HomeContentProps> = ({ posts, hasMore, loadMore, onLike, isLoading }) => {
    const shouldStopLoading = !hasMore && posts.length > 0;

    return (
        <main className="homepage__content">
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMore}
                hasMore={!shouldStopLoading} // Прекращаем прокрутку, если больше данных нет
                loader={isLoading && !shouldStopLoading ? <h4><LoadingPost /></h4> : null} // Показываем скелетон только при загрузке
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
