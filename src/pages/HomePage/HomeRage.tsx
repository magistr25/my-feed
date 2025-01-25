import './HomePage.scss';

import {useReactiveVar} from '@apollo/client';
import {FC, useEffect, useState} from 'react';

import {isInProfileVar, loadingStateVar} from '@/app/apollo/client';
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu.tsx';
import {usePostsQuery} from '@/features/posts/model/hooks/UsePostsQuery';
import PostList from "@/features/posts/ui/PostList/PostList.tsx";
import LoadingSelectDropdown from "@/shared/ui/LoadingSelectDropdown/LoadingSelectDropdown.tsx";
import SelectDropdown from "@/shared/ui/SelectDropdown/SelectDropdown.tsx";

const options = [
    {value: 'NEW', label: 'Новые'},
    {value: 'TOP', label: 'Популярные'},
];

const HomePage: FC = () => {
    const isInProfile = useReactiveVar(isInProfileVar);
    const isLoading = useReactiveVar(loadingStateVar); // Получаем глобальное состояние загрузки
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [type, setType] = useState<'NEW' | 'TOP'>('NEW');
    const {posts, loading} = usePostsQuery(type);
    const [isRendering, setIsRendering] = useState(true);

    useEffect(() => {
        if (!isInProfile) {
            setDropdownOpen(true);
        }
    }, [isInProfile]);

    // Управление глобальным состоянием загрузки
    useEffect(() => {
        loadingStateVar(loading || isRendering); // Обновляем глобальное состояние загрузки
    }, [loading, isRendering]);

    // Снимаем состояние рендера после завершения отрисовки
    useEffect(() => {
        const timer = window.setTimeout(() => setIsRendering(false), 1000);
        return () => window.clearTimeout(timer);
    }, [loading]);

    const handleSelect = (value: string) => {
        console.log('Выбрано:', value);

        // Обновляем тип постов
        if (value === 'NEW' || value === 'TOP') {
            setType(value as 'NEW' | 'TOP');
        } else {
            console.warn('Некорректное значение для типа постов:', value);
        }
    };

    const handleMenuClose = () => {
        setDropdownOpen(false); // Закрыть меню
    };

    if (!isInProfile) {
        return (
            <div className="homepage-wrapper">
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose}/>}
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
                                <LoadingSelectDropdown/>
                            </div>
                        </nav>
                    </header>
                    <main className="homepage__content">
                        <PostList isLoading={true}/>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-wrapper">
            <div className="homepage">
                <header className="homepage__header">
                    <nav className="homepage__nav">
                        <SelectDropdown options={options} onSelect={handleSelect} defaultLabel="Новые"/>
                    </nav>
                </header>
                <main className="homepage__content">
                    {/* Передаем посты в компонент PostList */}
                    <PostList posts={posts} isLoading={false}/>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
