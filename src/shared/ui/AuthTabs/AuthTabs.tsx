import './AuthTabs.scss'

import { FC } from 'react';
import { Link } from 'react-router-dom';

interface AuthTabsProps {
    activeTab: "login" | "register";
}

const AuthTabs: FC<AuthTabsProps> = ({ activeTab }) => (
    <div className="auth-tabs">
        <Link className={`auth-tab ${activeTab === "login" ? "active" : ""}`} to="/login">
            Авторизация
        </Link>
        <Link className={`auth-tab ${activeTab === "register" ? "active" : ""}`} to="/register">
            Регистрация
        </Link>
    </div>
);

export default AuthTabs;
