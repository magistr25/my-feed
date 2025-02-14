import './Header.scss';

import {FC, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';

import MobileMenu from "@/features/navigation/ui/MobileMenu/MobileMenu.tsx";
import Logo from "@/shared/ui/Logo/Logo.tsx";
import ThemeSwitcher from "@/shared/ui/ThemeSwitcher/ThemeSwitcher.tsx";
import DropdownProfile from "@/widgets/Header/ui/ DropdownProfile/DropdownProfile.tsx";
import HomeHeader from "@/widgets/HomeHeader/HomeHeader.tsx";

interface HeaderProps {
    onSelect: (value: string) => void;
    isLoading?: boolean;
}

const Header: FC<HeaderProps> = ({ onSelect, isLoading }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const renderSVG = () => {
        return (
            <svg
                height="28"
                viewBox="0 0 219 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="header__svg"
            >
                <path
                    d="M0 -2H219C216.894 -1.39731 215.418 0.495246 215.345 2.68446L215.317 3.5618C215.317 17.0587 204.375 28 190.878 28H28.1217C14.6249 28 3.68349 17.0587 3.68349 3.5618L3.65455 2.68447C3.58233 0.49525 2.10586 -1.39731 0 -2Z"
                    fill="black"
                />
            </svg>
        );
    };

    return (
        <header className="header">
            {renderSVG()}

            <div className="header__left">
                <Logo className="header__logo" />
                <button className="header__burger" onClick={() => setMenuOpen(!menuOpen)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M3 8.75C3 8.33579 3.33579 8 3.75 8H20.25C20.6642 8 21 8.33579 21 8.75C21 9.16421 20.6642 9.5 20.25 9.5H3.75C3.33579 9.5 3 9.16421 3 8.75ZM3 15.5C3 15.0858 3.33579 14.75 3.75 14.75H20.25C20.6642 14.75 21 15.0858 21 15.5C21 15.9142 20.6642 16.25 20.25 16.25H3.75C3.33579 16.25 3 15.9142 3 15.5Z"
                        />
                    </svg>
                </button>
            </div>

            {/* Рендерим HomeHeader только на главной странице */}
            {isActive("/") && <HomeHeader onSelect={onSelect} isLoading={isLoading}/>}

            <nav className="header__nav">
                <Link to="/" className={`header__link ${isActive('/') ? 'header__link--active' : ''}`}>
                    Главная
                </Link>
                <Link to="/my-posts" className={`header__link ${isActive('/my-posts') ? 'header__link--active' : ''}`}>
                    Мои посты
                </Link>
                <Link to="/favorites" className={`header__link ${isActive('/favorites') ? 'header__link--active' : ''}`}>
                    Избранное
                </Link>
            </nav>
            {/* Активная вкладка в мобильной версии */}
            <div className="header__mobile-active-tab">
                {isActive("/") && "Главная"}
                {isActive("/favorites") && "Избранное"}
                {isActive("/profile") && "Мой профиль"}
                {isActive("/my-posts") && "Создание поста"}
                {isActive("/my-posts/view") && "Мои посты"}
                {isActive("/my-posts/redactions") && "Редактирование"}
            </div>

            <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            {/* Правый блок с переключателем темы и аватаром */}
            <div className="header__right">
                <ThemeSwitcher />
                <DropdownProfile />
            </div>
        </header>
    );
};

export default Header;
