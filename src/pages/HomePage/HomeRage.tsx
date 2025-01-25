import './HomePage.scss';

import { useReactiveVar } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { isInProfileVar, loadingStateVar } from '@/app/apollo/client';
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu.tsx';
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
    const isLoading = useReactiveVar(loadingStateVar); // Получаем глобальное состояние загрузки
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [type, setType] = useState<'NEW' | 'TOP'>('NEW');
    const { posts, loading, hasMore, loadMore } = usePostsQuery(type);
    const [isRendering, setIsRendering] = useState(true);

    useEffect(() => {
        if (!isInProfile) {
            setDropdownOpen(true);
        }
    }, [isInProfile]);

    // Управление глобальным состоянием загрузки
    useEffect(() => {
        loadingStateVar(loading || isRendering);
    }, [loading, isRendering]);

    // Снимаем состояние рендера после завершения отрисовки
    useEffect(() => {
        const timer = window.setTimeout(() => setIsRendering(false), 1000);
        return () => window.clearTimeout(timer);
    }, [loading]);

    // Обработчик выбора типа постов
    const handleSelect = (value: string) => {
        console.log('Выбрано:', value);

        // Обновляем тип постов
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

    // Если пользователь не в профиле, отображаем только мобильное меню
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
                        <PostList isLoading={true} />
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
                        dataLength={posts.length} // Текущее количество загруженных постов
                        next={loadMore} // Функция для загрузки следующих постов
                        hasMore={hasMore} // Есть ли еще посты для загрузки
                        loader={<h4>Загрузка...</h4>} // Индикатор загрузки
                        endMessage={<p>Постов больше нет</p>} // Сообщение, когда посты закончились
                    >
                        <PostList posts={posts} isLoading={false} />
                    </InfiniteScroll>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
