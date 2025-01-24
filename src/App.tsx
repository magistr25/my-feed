import {useEffect} from "react";
import { Outlet, useLocation } from 'react-router-dom';

import { isInProfileVar,userVar } from '@/app/apollo/client';
import Header from '@/widgets/Header/Header';

const App = () => {
    const location = useLocation();
    const hideHeaderPaths = ['/login', '/register', '/error-500']; // Пути, где не нужно показывать Header
    useEffect(() => {
        // Восстанавливаем состояние при загрузке приложения
        const initializeState = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    userVar(JSON.parse(storedUser));
                }

                const storedIsInProfile = localStorage.getItem('isInProfile');
                isInProfileVar(storedIsInProfile === 'true');
            } catch (error) {
                console.error('Ошибка восстановления состояния:', error);
                userVar(null);
                isInProfileVar(false);
            }
        };

        initializeState();
    }, []);

    useEffect(() => {
        // Подписка на изменения `isInProfileVar`
        const unsubscribe = isInProfileVar.onNextChange((isInProfile) => {
            if (!isInProfile) {
                userVar(null); // Очищаем данные пользователя
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                localStorage.removeItem('isInProfile')
            }
        });
        return () => unsubscribe(); // Очистка подписки при размонтировании
    }, []);

    useEffect(() => {
        // Убираем старые классы
        window.document.body.className = '';
        // Добавляем класс на основе маршрута
        if (location.pathname === '/login' || location.pathname === '/error-500') {
            window.document.body.classList.add('body-login');
        } else if (location.pathname === '/register') {
            window.document.body.classList.add('body-register');
        }
    }, [location]);

    return (
        <div className="app">
            {!hideHeaderPaths.includes(location.pathname) && <Header />}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default App;


