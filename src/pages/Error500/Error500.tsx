import './Error500.scss';

import React from 'react';

import err500 from '@/assets/images/err_500.png';

const Error500: React.FC = () => {

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


