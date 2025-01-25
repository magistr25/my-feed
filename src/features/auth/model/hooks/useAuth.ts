import { useMutation } from "@apollo/client";
import { useState } from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { isInProfileVar, userVar } from "@/app/apollo/client.ts";
import { SIGN_IN_USER } from "@/features/auth/api/mutations/signInUser.ts";

interface LoginFormInputs {
    email: string;
    password: string;
}

export const useAuth = () => {
    const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<LoginFormInputs>({
        mode: 'onSubmit',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEmailIconVisible, setIsEmailIconVisible] = useState(false);
    const navigate = useNavigate();
    const [signInUser] = useMutation(SIGN_IN_USER);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const response = await signInUser({
                variables: {
                    input: {
                        email: data.email,
                        password: data.password,
                    },
                },
            });

            if (!response.data) {
                console.error('Ошибка: ответ сервера не содержит данных');
                setError('email', { message: 'Ошибка сервера. Попробуйте позже.' });
                return;
            }

            const { userSignIn } = response.data;

            if (!userSignIn) {
                console.error('Ошибка: ответ сервера не содержит userSignIn');
                setError('email', { message: 'Ошибка сервера. Попробуйте позже.' });
                return;
            }

            if (userSignIn.problem) {
                if (userSignIn.problem.message === 'Email or password are incorrect') {
                    setError('email', { message: 'Почта не найдена' });
                    setError('password', { message: 'Введён неверный пароль' });
                }
                return;
            }

            const { token, user } = userSignIn;
            if (token && user) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('isInProfile', String(true));
                }
                console.log('Токен успешно сохранён:', token);

                userVar({
                    id: user.id || 'unknown-id',
                    firstName: user.firstName || 'Гость',
                    lastName: user.lastName || '',
                    middleName: user.middleName || '',
                    avatarUrl: user.avatarUrl || '',
                    email: user.email || 'unknown-email',
                });
                isInProfileVar(true);
            } else {
                console.warn('Токен или данные пользователя не получены.');
            }

            navigate('/');
        } catch (e) {
            console.error('Ошибка при входе:', e);
            navigate('/error-500');
            setError('email', { message: 'Ошибка сервера. Попробуйте позже.' });
        }
    };

    const validateEmail = (value: string): string | true => {
        setIsEmailIconVisible(true);
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
        if (!value.length) {
            return 'Пароль обязателен';
        }
        if (value.length < 6) {
            return 'Пароль должен содержать минимум 6 символов';
        }
        if (!/^[A-Za-z0-9]*$/.test(value)) {
            return 'Пароль должен содержать только латинские буквы и цифры';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Пароль должен содержать хотя бы одну заглавную букву';
        }
        if (!/[0-9]/.test(value)) {
            return 'Пароль должен содержать хотя бы одну цифру';
        }
        return true;
    };

    return {
        register,
        handleSubmit,
        errors,
        watch,
        isPasswordVisible,
        isEmailIconVisible,
        togglePasswordVisibility,
        onSubmit,
        validateEmail,
        validatePassword,
    };
};
