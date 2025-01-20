import { useEffect, useState } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token); // Авторизован, если токен есть
    }, []);

    const logOut = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    };

    const logIn = (token: string) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    };

    return { isAuthenticated, logIn, logOut };
};

export default useAuth;
