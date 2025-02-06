import './FavoritesPage.scss';

import { useReactiveVar } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { isInProfileVar, loadingStateVar } from '@/app/apollo/client';
import noPostsImage from "@/assets/images/no_posts_image.png";
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu';
import { usePosts } from '@/pages/model/hooks/usePosts.ts';
import NoPostsBanner from "@/shared/ui/NoPostsBanner/NoPostsBanner";
import HomeContent from '@/widgets/HomeContent/HomeContent';
import { Post } from "@/features/posts/model/types/types";

const FavoritesPage: FC = () => {
    const location = useLocation();
    const isInProfile = useReactiveVar(isInProfileVar);
    const isLoading = useReactiveVar(loadingStateVar);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const { localPosts = [], loading, hasMore, loadMore, fetchLikes, handleLike } = usePosts('LIKE');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
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

    // Фильтруем локальные посты, убирая удалённые лайки
    useEffect(() => {
        setFilteredPosts(localPosts.filter((post) => post?.isLiked));
    }, [localPosts]);

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

    if (!isInProfile) {
        return (
            <div className="favorites-wrapper">
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose} />}
            </div>
        );
    }

    // Если нет избранных постов
    if (!loading && !isPageLoading && dataLoaded && filteredPosts.length === 0) {
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
                    posts={filteredPosts} // Используем отфильтрованные посты
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
