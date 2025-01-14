import './HomePage.scss';

import React, { useState } from 'react';

import avatar1 from '../../assets/images/avatar1.png';
import avatar2 from '../../assets/images/avatar2.png';
import post1 from '../../assets/images/post1.png';
import post2 from '../../assets/images/post2.png';
import HeartIcon from "../../shared/ui/HeartIcon/HeartIcon";
import SelectDropdown from "../../shared/ui/SelectDropdown/SelectDropdown";
import SharePopup from "../../shared/ui/SharePopup/SharePopup.tsx";

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

const HomePage: React.FC = () => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        console.log('Лайкнут:', liked);
    };

    const handleSelect = (value: string) => {
        console.log('Выбрано:', value);
    };

    return (
        <div className="homepage">
            <header className="homepage__header">
                <nav className="homepage__nav">
                    <SelectDropdown options={options} onSelect={handleSelect} />
                </nav>
            </header>
            <main className="homepage__content">
                {posts.map((post) => (
                    <article key={post.id} className="post">
                        <header className="post__header">
                            <img className="post__avatar" src={post.avatarUrl} alt={`${post.author} avatar`} />
                            <div className="post__meta">
                                <h3 className="post__author">{post.author}</h3>
                                <time className="post__date">{post.date}</time>
                            </div>
                        </header>
                        <h2 className="post__title">{post.title}</h2>
                        <img className="post__image" src={post.imageUrl} alt={post.title} />
                        <p className="post__content">{post.content}</p>
                        <a href="#" className="post__read-more">Читать больше</a>
                        <div className="post__actions">
                            <HeartIcon onClick={handleLike} isActive={liked} />
                            <SharePopup />
                        </div>
                    </article>
                ))}
            </main>
        </div>
    );
};

export default HomePage;

