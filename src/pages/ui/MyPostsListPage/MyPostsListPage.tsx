import './MyPostsListPage.scss';

import { useReactiveVar } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { isInProfileVar, loadingStateVar } from '@/app/apollo/client.ts';
import noPostsImage from "@/assets/images/no_posts_image.png";
import NoPostsBanner from "@/shared/ui/NoPostsBanner/NoPostsBanner.tsx";
import {usePosts} from "@/pages/model/hooks/usePosts.ts";
import MobileMenu from "@/features/navigation/ui/MobileMenu/MobileMenu.tsx";
import HomeContent from "@/widgets/HomeContent/HomeContent.tsx";


const MyPostsPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isInProfile = useReactiveVar(isInProfileVar);
    const isLoading = useReactiveVar(loadingStateVar);
    const { handleLike } = usePosts('LIKE');
    const isMobile = window.innerWidth <= 768; // Определяем мобильное устройство
    const [dropdownOpen, setDropdownOpen] = useState(false); // Управляем меню

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Загружаем только свои посты
    const { localPosts = [], loading, hasMore, loadMore, fetchMyPosts } = usePosts('MY');

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    useEffect(() => {
        setIsPageLoading(true);
        setDataLoaded(false);

        fetchMyPosts()
            .then(() => setDataLoaded(true))
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    console.error('Ошибка при загрузке постов:', error.message);
                } else {
                    console.error('Неизвестная ошибка при загрузке постов:', error);
                }
            })
            .finally(() => setIsPageLoading(false));
    }, [fetchMyPosts, location.pathname]);


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

    // Фильтруем посты
    if (!loading && !isPageLoading && dataLoaded && localPosts.length === 0) {
        return (
            <div className="my-posts-wrapper">
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose} />}
                <div className="my-posts">
                    <NoPostsBanner
                        message="У вас пока нет созданных постов"
                        buttonText="Создать пост"
                        onButtonClick={() => navigate("/create-post")}
                        imageSrc={noPostsImage}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="my-posts-wrapper">
            {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={handleMenuClose} />}
            <div className="my-posts">
                <HomeContent
                    posts={localPosts}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    isLoading={isLoading}
                    onLike={handleLike}
                />
            </div>
        </div>
    );
};

export default MyPostsPage;
