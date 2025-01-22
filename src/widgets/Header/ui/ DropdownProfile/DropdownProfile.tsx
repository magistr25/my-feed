import './DropdownProfile.scss';

import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {isInProfileVar, userVar} from '@/app/apollo/client.ts';
import useProfileState from '@/shared/hooks/useProfileState.ts';
import DefaultAvatar from "@/shared/ui/DefaultAvatar/DefaultAvatar.tsx";

const DropdownProfile = () => {
    const navigate = useNavigate();

    const { isInProfile } = useProfileState();

    // Чтение данных пользователя
    const user = useReactiveVar(userVar);

    // Переключение состояния выпадающего меню
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    // Обработчик для выхода
    const handleLogOut = () => {
        localStorage.removeItem('authToken'); // Удаляем токен
        localStorage.removeItem('user'); // Удаляем данные пользователя
        localStorage.removeItem('isInProfile'); // Удаляем состояние профиля
        userVar(null); // Очищаем данные пользователя в Apollo
        isInProfileVar(false); // Сбрасываем состояние профиля
        navigate('/');
    };

    // Обработчик для входа
    const handleLogin = () => {
        navigate('/login');
    };


    // Определение имени пользователя
    const displayName = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Гость'
        : 'Гость';

    const displayAvatar = user?.avatarUrl
        ? <img src={user.avatarUrl} alt="User avatar" />
        : <DefaultAvatar />;

    return (
        <div className="dropdown-profile">
            {/* Аватар пользователя */}
            <div className="dropdown-profile__avatar">
                {displayAvatar}
            </div>

            {/* Имя пользователя */}
            <div className="dropdown-profile__username">
                {displayName}
            </div>

            {/* Кнопка открытия/закрытия меню */}
            <button className="dropdown-profile__btn" onClick={toggleDropdown}>
                {dropdownOpen ? (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.7698 14.7906C16.4713 15.0777 15.9965 15.0684 15.7094 14.7698L12 10.8321L8.29062 14.7698C8.00353 15.0684 7.52875 15.0777 7.23017 14.7906C6.93159 14.5035 6.92228 14.0287 7.20937 13.7302L11.4594 9.23017C11.6008 9.08311 11.796 9 12 9C12.204 9 12.3992 9.08311 12.5406 9.23017L16.7906 13.7302C17.0777 14.0287 17.0684 14.5035 16.7698 14.7906Z"
                            fill="currentColor"
                        />
                    </svg>
                ) : (
                    <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.73017 9.20938C8.02875 8.92228 8.50353 8.93159 8.79063 9.23017L12.5 13.1679L16.2094 9.23017C16.4965 8.93159 16.9713 8.92228 17.2698 9.20938C17.5684 9.49647 17.5777 9.97125 17.2906 10.2698L13.0406 14.7698C12.8992 14.9169 12.704 15 12.5 15C12.296 15 12.1008 14.9169 11.9594 14.7698L7.70938 10.2698C7.42228 9.97125 7.43159 9.49647 7.73017 9.20938Z"
                            fill="currentColor"
                        />
                    </svg>
                )}
            </button>

            {/* Выпадающее меню */}
            {dropdownOpen && (
                <div className="dropdown-profile__menu">
                    {isInProfile ? (
                        <>
                            <button className="dropdown-profile__menu-item" onClick={() => navigate('/profile')}>
                                Мой профиль
                            </button>
                            <button className="dropdown-profile__menu-item" onClick={handleLogOut}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <button className="dropdown-profile__menu-item" onClick={handleLogin}>
                            Войти
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownProfile;
