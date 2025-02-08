import './Error500.scss';

import React, {useEffect} from 'react';

import err500 from '@/assets/images/err_500.png';
import {useSelector} from "react-redux";
import {RootState} from "@/app/store/store.ts";

const Error500: React.FC = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);
    useEffect(() => {
        window.document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
    return (
        <div className="error-page">
            <div className="error-page__content">
                <img src={err500} alt="Ошибка 500" className="error-page__image"/>
                <div className="error-page__title">
                    <h2 className="error-page__title__subtitle">Ошибка сервера</h2>
                    <p className="error-page__title__description">
                        На сервере произошла непредвиденная ошибка. Пожалуйста, подождите, она вскоре будет исправлена.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Error500;


