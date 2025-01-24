import './HomePage.scss';

import { useReactiveVar } from '@apollo/client';
import {FC, useEffect, useState} from 'react';

import { isInProfileVar } from '@/app/apollo/client';
import MobileMenu from '@/features/navigation/MobileMenu/MobileMenu.tsx';
import PostList from "@/features/posts/ui/PostList/PostList.tsx";
import SelectDropdown from "@/shared/ui/SelectDropdown/SelectDropdown.tsx";

import avatar1 from '../../assets/images/avatar1.png';
import avatar2 from '../../assets/images/avatar2.png';
import post1 from '../../assets/images/post1.png';
import post2 from '../../assets/images/post2.png';


interface Post {
    id: number;
    author: string;
    date: string;
    title: string;
    content: string;
    imageUrl: string;
    avatarUrl: string;
}

const posts: Post[] = [
    {
        id: 1,
        author: 'Дарья Антонова',
        date: '20.09.2022',
        title: 'Как интерьер влияет на самочувствие',
        content: 'Мы сделали долгожданный ремонт в спальне в стиле 60-х! Сейчас эта мода вновь буквально врывается в окружающее нас пространство. При помощи ярких акцентов и скругленных элементов интерьера нам удалось придать... ',
        imageUrl: post1,
        avatarUrl: avatar1,
    },
    {
        id: 2,
        author: 'Юлия Александрова',
        date: '20.09.2022',
        title: 'Про первое издание VOGUE',
        content: 'Первый номер Vogue вышел в Америке в 1892 году. В 1909-м его приобрел издатель Конде Наст: количество страниц в журнале резко увеличилось, а акцент на моду для женщин — усилился. По сей день это один из самых популярных... ',
        imageUrl: post2,
        avatarUrl: avatar2,
    },
];

const options = [
    { value: 'new', label: 'Новое' },
    { value: 'popular', label: 'Лучшее' },
];

const HomePage: FC = () => {
    const isInProfile = useReactiveVar(isInProfileVar);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        if (!isInProfile) {
            setDropdownOpen(true);
        }
    }, [isInProfile]);


    const handleSelect = (value: string) => {
        console.log('Выбрано:', value);
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

    return (
        <div className="homepage-wrapper">
            <div className="homepage">
                <header className="homepage__header">
                    <nav className="homepage__nav">
                        <SelectDropdown options={options} onSelect={handleSelect} />
                    </nav>
                </header>
                <main className="homepage__content">
                    <PostList posts={posts} />
                </main>
            </div>
        </div>
    );
};

export default HomePage;


