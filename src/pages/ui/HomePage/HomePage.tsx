import './HomePage.scss';

import { useReactiveVar } from '@apollo/client';
import { FC, useEffect, useState } from 'react';

import { isInProfileVar, loadingStateVar } from '@/app/apollo/client.ts';
import MobileMenu from '@/features/navigation/ui/MobileMenu/MobileMenu.tsx';
import { usePosts } from '@/pages/model/hooks/usePosts.ts';
import Header from '@/widgets/Header/Header.tsx';
import HomeContent from '@/widgets/HomeContent/HomeContent.tsx';

const HomePage: FC = () => {
    const isInProfile = useReactiveVar(isInProfileVar);
    const isLoading = useReactiveVar(loadingStateVar);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [type, setType] = useState<'NEW' | 'TOP'>('NEW');
    const { localPosts, loading, hasMore, loadMore, handleLike } = usePosts(type);
    const [isPageLoading, setIsPageLoading] = useState(true);

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

    const handleSelect = (value: string) => {
        if (value === 'NEW' || value === 'TOP') {
            setType(value as 'NEW' | 'TOP');
        } else {
            console.warn('Некорректное значение для типа постов:', value);
        }
    };

    if (!isInProfile) {
        return (
            <div className="homepage-wrapper">
                {isMobile && <MobileMenu isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />}
            </div>
        );
    }

    return (
        <div className="homepage-wrapper">
            <Header onSelect={handleSelect} isLoading={isLoading} />
            <div className="homepage">
                <HomeContent
                    posts={localPosts}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    onLike={handleLike}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default HomePage;
