import './HomePage.scss';

import { useReactiveVar } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { isInProfileVar, loadingStateVar } from '@/app/apollo/client';
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu.tsx';
import { toggleLike } from '@/features/posts/lib/postService';
import { usePostsQuery } from '@/features/posts/model/hooks/UsePostsQuery';
import PostList from "@/features/posts/ui/PostList/PostList.tsx";
import LoadingSelectDropdown from "@/shared/ui/LoadingSelectDropdown/LoadingSelectDropdown.tsx";
import SelectDropdown from "@/shared/ui/SelectDropdown/SelectDropdown.tsx";

const options = [
    { value: 'NEW', label: 'Новые' },
    { value: 'TOP', label: 'Популярные' },
];

const HomePage: FC = () => {
    const isInProfile = useReactiveVar(isInProfileVar);
    const isLoading = useReactiveVar(loadingStateVar);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [type, setType] = useState<'NEW' | 'TOP'>('NEW');
    const { posts, loading, hasMore, loadMore } = usePostsQuery(type);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const client = useApolloClient();
    const [localPosts, setLocalPosts] = useState(posts);

    useEffect(() => {
        if (!loading && isPageLoading) {
            const timer = window.setTimeout(() => setIsPageLoading(false), 1000);
            return () => window.clearTimeout(timer);
        }
    }, [loading, isPageLoading]);

    useEffect(() => {
        const newState = isPageLoading;
        if (loadingStateVar() !== newState) {
            loadingStateVar(newState);
        }
    }, [isPageLoading]);

    useEffect(() => {
        if (JSON.stringify(localPosts) !== JSON.stringify(posts)) {
            setLocalPosts(posts);
        }
    }, [posts, localPosts]);

    useEffect(() => {
        if (!isInProfile) {
            setDropdownOpen(true);
        }
    }, [isInProfile]);


    const handleSelect = (value: string) => {
        console.log('Выбрано:', value);
        if (value === 'NEW' || value === 'TOP') {
            setType(value as 'NEW' | 'TOP');
        } else {
            console.warn('Некорректное значение для типа постов:', value);
        }
    };

    // Обработчик закрытия мобильного меню
    const handleMenuClose = () => {
        setDropdownOpen(false); // Закрыть меню
    };

    const handleLike = async (postId: string) => {
        try {
            const post = localPosts.find((p) => p.id === postId);
            if (!post) return;

            const updatedPost = await toggleLike(client, postId, post.isLiked);

            // Обновляем локальное состояние
            const updatedPosts = localPosts.map((p) =>
                p.id === postId ? { ...p, isLiked: updatedPost.isLiked } : p
            );
            setLocalPosts(updatedPosts);

            // Обновляем кэш Apollo
            client.cache.modify({
                id: client.cache.identify({ __typename: 'PostModel', id: postId }),
                fields: {
                    isLiked() {
                        return updatedPost.isLiked;
                    },
                },
            });
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);
        }
    };

    if (!isInProfile) {
        return (
            <div className="homepage-wrapper">
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose} />}
            </div>
        );
    }

    // Состояние загрузки
    if (isLoading) {
        return (
            <div className="homepage-wrapper">
                <div className="homepage">
                    <header className="homepage__header__loading">
                        <nav className="homepage__nav">
                            <div className="homepage__nav__loadingSelectDropdown">
                                <LoadingSelectDropdown />
                            </div>
                        </nav>
                    </header>
                    <main className="homepage__content">
                        <PostList isLoading={true} onLike={handleLike} />
                    </main>
                </div>
            </div>
        );
    }

    // Основной рендер с бесконечной прокруткой
    return (
        <div className="homepage-wrapper">
            <div className="homepage">
                <header className="homepage__header">
                    <nav className="homepage__nav">
                        <SelectDropdown options={options} onSelect={handleSelect} defaultLabel="Новые" />
                    </nav>
                </header>
                <main className="homepage__content">
                    <InfiniteScroll
                        dataLength={localPosts.length} // Текущее количество загруженных постов
                        next={loadMore} // Функция для загрузки следующих постов
                        hasMore={hasMore} // Есть ли еще посты для загрузки
                        loader={<h4>Загрузка...</h4>} // Индикатор загрузки
                        endMessage={<p>Постов больше нет</p>} // Сообщение, когда посты закончились
                    >
                        <PostList posts={localPosts} isLoading={false} onLike={handleLike} />
                    </InfiniteScroll>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
