import './RegisterPage.scss';

import {FC} from "react";
import { SubmitHandler,useForm } from 'react-hook-form';

import Logo from "@/shared/ui/Logo/Logo.tsx";
import {Link} from "react-router-dom";

interface RegisterFormInputs {
    email: string;
    password: string;
}

const RegisterPage: FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
        console.log('Submitted data:', data);
        alert(`Email: ${data.email}, Password: ${data.password}`);
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-container-header">
                    <div className="register-container-header_top">
                        <svg width="219" height="28" viewBox="0 0 219 28" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 -2H219C216.894 -1.39731 215.418 0.495246 215.345 2.68446L215.317 3.5618C215.317 17.0587 204.375 28 190.878 28H28.1217C14.6249 28 3.68349 17.0587 3.68349 3.5618L3.65455 2.68447C3.58233 0.49525 2.10586 -1.39731 0 -2Z"
                                fill="black"/>
                        </svg>
                    </div>
                    <div className="register-container-header_bottom">
                        <Logo/>
                    </div>
                </div>

                <div className="register-tabs">
                    <Link className="register-tab" to="/login">
                        Авторизация
                    </Link>
                    <Link className="register-tab active" to="/register">
                        Регистрация
                    </Link>
                </div>
                <div className="registration-step">Шаг 1 из 2</div>
                <form onSubmit={handleSubmit(onSubmit)} className="register-form" autoComplete="off">
                    <p className="register-description">
                        Введите Ваш Email и пароль, чтобы войти в&nbsp;аккаунт.
                    </p>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Введите email"
                            {...register('email', { required: 'Email обязателен' })}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email.message}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Введите пароль"
                            {...register('password', { required: 'Пароль обязателен' })}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password.message}</span>}
                    </div>
                    <button type="submit" className="register-button" disabled={!!Object.keys(errors).length}>
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
