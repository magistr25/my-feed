import './HomePage.scss';

import { useReactiveVar } from '@apollo/client';
import { FC, useEffect, useState } from 'react';

import { isInProfileVar } from '@/app/apollo/client';
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu.tsx';
import { usePostsQuery } from '@/features/posts/model/hooks/UsePostsQuery'; // Импортируем хук
import PostList from "@/features/posts/ui/PostList/PostList.tsx";
import SelectDropdown from "@/shared/ui/SelectDropdown/SelectDropdown.tsx";

const options = [
    { value: 'NEW', label: 'Новые' },
    { value: 'TOP', label: 'Популярные' },
];

const HomePage: FC = () => {
    const isInProfile = useReactiveVar(isInProfileVar);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [type, setType] = useState<'NEW' | 'TOP'>('NEW');
    const { posts, loading } = usePostsQuery(type);

    useEffect(() => {
        if (!isInProfile) {
            setDropdownOpen(true);
        }
    }, [isInProfile]);

    const handleSelect = (value: string) => {
        console.log('Выбрано:', value);

        // Обновляем тип постов
        if (value === 'NEW' || value === 'TOP') {
            setType(value as 'NEW' | 'TOP'); // Меняем тип постов
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
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose} />}
            </div>
        );
    }

    // Отображаем состояние загрузки
    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="homepage-wrapper">
            <div className="homepage">
                <header className="homepage__header">
                    <nav className="homepage__nav">
                        <SelectDropdown options={options} onSelect={handleSelect} defaultLabel="Новые" />
                    </nav>
                </header>
                <main className="homepage__content">
                    {/* Передаем посты в компонент PostList */}
                    <PostList posts={posts} />
                </main>
            </div>
        </div>
    );
};

export default HomePage;


