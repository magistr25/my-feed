import {useEffect} from "react";
import { Outlet, useLocation } from 'react-router-dom';

import Header from '@/widgets/Header/Header';

const App = () => {
    const location = useLocation();
    const hideHeaderPaths = ['/login', '/register']; // Пути, где не нужно показывать Header

    useEffect(() => {
        // Убираем старые классы
        window.document.body.className = '';
        // Добавляем класс на основе маршрута
        if (location.pathname === '/login') {
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


