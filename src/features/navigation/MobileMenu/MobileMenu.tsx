import './MobileMenu.scss';

import {useReactiveVar} from "@apollo/client";
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {isInProfileVar, userVar} from "@/app/apollo/client.ts";
import { selectTheme } from '@/app/store/ducks/theme';
import closeIcon from '@/assets/images/close.png';
import useProfileState from "@/shared/hooks/useProfileState.ts";
import DefaultAvatar from '@/shared/ui/DefaultAvatar/DefaultAvatar.tsx';
import Logo from '@/shared/ui/Logo/Logo.tsx';
import ThemeSwitcher from '@/shared/ui/ThemeSwitcher/ThemeSwitcher.tsx';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    const currentTheme = useSelector(selectTheme);
    const navigate = useNavigate();
    const { isInProfile } = useProfileState();
// Чтение данных пользователя
    const user = useReactiveVar(userVar);
    const handleLogOut = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isInProfile');
        userVar(null); // Очищаем данные пользователя в Apollo
        isInProfileVar(false); // Сбрасываем состояние профиля
        navigate('/');
    };
// Определение имени пользователя
    const displayName = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Гость'
        : 'Гость';

    const displayAvatar = user?.avatarUrl
        ? <img src={user.avatarUrl} alt="User avatar" />
        : <DefaultAvatar />;

    return (
        <div className={`mobile-menu ${isOpen ? 'mobile-menu_open' : ''}`}>
            <div className="mobile-menu__content" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu__content__header-container">
                    <div className="mobile-menu__content__header">
                        <div className="mobile-menu__content__header_up">
                            <svg width="219" height="28" viewBox="0 0 219 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 -2H219C216.894 -1.39731 215.418 0.495246 215.345 2.68446L215.317 3.5618C215.317 17.0587 204.375 28 190.878 28H28.1217C14.6249 28 3.68349 17.0587 3.68349 3.5618L3.65455 2.68447C3.58233 0.49525 2.10586 -1.39731 0 -2Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                        <div className="mobile-menu__content__header_down">
                            <button className="mobile-menu__close" onClick={onClose}>
                                <img src={closeIcon} alt="Close menu" />
                            </button>
                            <Logo />
                        </div>
                    </div>
                </div>
                <div className="mobile-menu__profile">
                    {displayAvatar}
                    <h2 className="mobile-menu__profile_h2"> {displayName} </h2>

                </div>
                <ul className="mobile-menu__list">
                    {isInProfile  ? (
                        <>
                            <li>
                                <Link className="mobile-menu__list_open-account" to="/" onClick={handleLogOut}>
                                    Выйти из аккаунта
                                </Link>

                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/profile" onClick={onClose}>
                                    Мой профиль
                                </Link>
                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/" onClick={onClose}>
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/my-posts" onClick={onClose}>
                                    Мои посты
                                </Link>
                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/favorites" onClick={onClose}>
                                    Избранное
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link className="mobile-menu__list_open-account" to="/login" onClick={onClose}>
                                    Войти в аккаунт
                                </Link>
                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/login" onClick={onClose}>
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/login" onClick={onClose}>
                                    Мои посты
                                </Link>
                            </li>
                            <li>
                                <Link className="mobile-menu__list_a" to="/login" onClick={onClose}>
                                    Избранное
                                </Link>
                            </li>

                        </>
                    )}

                </ul>

                <div className="mobile-menu__theme-switch">
                    <p className="mobile-menu__theme-switch__p">
                        {currentTheme === 'dark' ? 'Тёмная' : 'Светлая'} тема
                    </p>
                    <ThemeSwitcher/>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
