import './LoginPage.scss';

import { useMutation } from "@apollo/client";
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

import { SIGN_IN_USER } from "@/features/auth/api/mutations/signInUser.ts";
import AuthTabs from "@/shared/ui/AuthTabs/AuthTabs.tsx";
import Button from "@/shared/ui/Button/Button.tsx";
import FormHeader from "@/shared/ui/FormHeader/FormHeader.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";

interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginPage: FC = () => {
    const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<LoginFormInputs>({
        mode: 'onSubmit',
});

    const [isEmailIconVisible, setIsEmailIconVisible] = useState(false);
    const [isPasswordIconVisible, setIsPasswordIconVisible] = useState(false);
    const navigate = useNavigate();
    const [signInUser] = useMutation(SIGN_IN_USER);

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            // Выполняем запрос для входа пользователя
            const response = await signInUser({
                variables: {
                    input: {
                        email: data.email,
                        password: data.password,
                    },
                },
            });

            const { userSignIn } = response.data;

            // Проверяем наличие проблем в ответе сервера
            if (userSignIn.problem) {
                if (userSignIn.problem.message === 'Email or password are incorrect') {
                    // Устанавливаем ошибки для полей
                    setError('email', { message: 'Почта не найдена' });
                    setError('password', { message: 'Введён неверный пароль' });
                }
                return; // Останавливаем выполнение, если есть ошибки
            }

            // Сохраняем токен в localStorage, если вход выполнен успешно
            const token = userSignIn.token;
            if (token) {
                localStorage.setItem('authToken', token);
                console.log('Токен успешно сохранён:', token);
            } else {
                console.warn('Токен не получен, предыдущий токен не изменён.');
            }

            // Перенаправляем пользователя
            navigate('/');
        } catch (e) {
            console.error('Ошибка при входе:', e);

            // Устанавливаем общую ошибку сервера
            setError('email', { message: 'Ошибка сервера. Попробуйте позже.' });
        }
    };


    const validateEmail = (value: string): string | true => {
        setIsEmailIconVisible(true)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (value.length && !emailRegex.test(value)) {
            return 'Неверный формат email';
        }
        if (!value.length) {
            return 'Email обязателен';
        }

        return true;
    };

    const validatePassword = (value: string): string | true => {
        setIsPasswordIconVisible(true)
        if (!value.length) {
            return 'Пароль обязателен';
        }
        if (value.length < 6) {
            return 'Пароль должен содержать минимум 6 символов';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Пароль должен содержать хотя бы одну заглавную букву';
        }
        if (!/[0-9]/.test(value)) {
            return 'Пароль должен содержать хотя бы одну цифру';
        }
        return true;
    };

    return (
        <div className="login-wrapper">
            <div className="login-page">
                <div className="login-container">
                    <FormHeader title="Вход в аккаунт" />
                    <AuthTabs activeTab="login" />
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form" autoComplete="off">
                        <p className="form-description">Введите Ваш Email и пароль, чтобы войти в аккаунт.</p>
                        <FormInputGroup
                            label="Email"
                            id="email"
                            type="text"
                            placeholder="Введите email"
                            register={{
                                ...register('email', {
                                    validate: validateEmail,
                                    onBlur: () => validateEmail(watch('email')),
                                }),
                            }}
                            error={errors.email?.message}
                            isIconVisible={isEmailIconVisible}
                            statusIcon={!watch('email') ? null : !errors.email}
                        />
                        <FormInputGroup
                            label="Пароль"
                            id="password"
                            type="text"
                            placeholder="Введите пароль"
                            register={{
                                ...register('password', {
                                    validate: validatePassword,
                                    // onFocus: () => clearErrors('password'),
                                    onBlur: () => validatePassword(watch('password')),
                                }),
                            }}
                            error={errors.password?.message}
                            isIconVisible={isPasswordIconVisible}
                            statusIcon={!watch('password') ? null : !errors.password}
                        />
                        <div className="form-button">
                            <Button
                                text="Войти"
                                variant="primary"
                                size="large"
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
