import './FavoritesPage.scss';

import { useReactiveVar } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { isInProfileVar, loadingStateVar } from '@/app/apollo/client.ts';
import noPostsImage from "@/assets/images/no_posts_image.png";
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu.tsx';
import { usePosts } from '@/pages/model/hooks/usePosts.ts';
import NoPostsBanner from "@/shared/ui/NoPostsBanner/NoPostsBanner.tsx";
import HomeContent from '@/widgets/HomeContent/HomeContent.tsx';

const FavoritesPage: FC = () => {
    const location = useLocation();
    const isInProfile = useReactiveVar(isInProfileVar);
    const isLoading = useReactiveVar(loadingStateVar);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const { localPosts = [], loading, hasMore, loadMore, handleLike, fetchLikes } = usePosts('LIKE');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false); // Флаг для предотвращения мигания
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);


    // Перезагрузка при изменении маршрута
    useEffect(() => {
        setIsPageLoading(true);
        setDataLoaded(false);

        fetchLikes()
            .then(() => {
                setDataLoaded(true);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            })
            .finally(() => {
                setIsPageLoading(false);
            });
    }, [fetchLikes, location.pathname]);


    useEffect(() => {
        if (!loading && isPageLoading) {
            const timer = window.setTimeout(() => setIsPageLoading(false), 1000);
            return () => window.clearTimeout(timer);
        }
    }, [loading, isPageLoading]);

    useEffect(() => {
        if (!isInProfile) {
            setDropdownOpen(true);
        }
    }, [isInProfile]);

    const handleMenuClose = () => {
        setDropdownOpen(false);
    };

    // Фильтруем лайкнутые посты
    const favoritePosts = localPosts
        .filter((post) => post?.isLiked)
        .map((post) => ({
            ...post,
        }));

    if (!isInProfile) {
        return (
            <div className="favorites-wrapper">
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose} />}
            </div>
        );
    }


    // Добавляем проверку `dataLoaded`, чтобы избежать мигания
    if (!loading && !isPageLoading && dataLoaded && favoritePosts.length === 0) {
        return (
            <div className="favorites-wrapper">
                <div className="favorites">
                    <NoPostsBanner
                        message="У вас пока нет избранных постов"
                        buttonText="На главную"
                        onButtonClick={() => navigate("/")}
                        imageSrc={noPostsImage}

                    />
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-wrapper">
            <div className="favorites">
                <HomeContent
                    posts={favoritePosts}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    onLike={handleLike}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default FavoritesPage;
