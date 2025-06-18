import { useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';
import { GraphQLFormattedError } from 'graphql';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { COMPLETE_PROFILE } from '@/features/auth/api/mutations/completeProfile.ts';
import { REGISTER_USER } from '@/features/auth/api/mutations/registerUser.ts';

interface RegisterFormInputs {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    middleName: string;
    gender?: string;
    birthDate?: string;
    phone?: string;
    placeholder: string;
    country?: string;
    avatar?: string;

}

export const useRegistration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [isEmailIconVisible, setIsEmailIconVisible] = useState(false);
    const [isPasswordIconVisible, setIsPasswordIconVisible] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setError, reset, trigger, clearErrors, setValue } = useForm<RegisterFormInputs>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [registerUser, { loading: registering }] = useMutation(REGISTER_USER);
    const [completeProfile, { loading: completing }] = useMutation(COMPLETE_PROFILE);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const validateEmail = (value: string): string | true => {
        setIsEmailIconVisible(true);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!value.length) {
            return 'Email обязателен';
        }
        if (!emailRegex.test(value)) {
            return 'Неверный формат email';
        }
        return true;
    };

    const validatePassword = (value: string): string | true => {
        setIsPasswordIconVisible(true);
        if (!value.length) {
            return 'Пароль обязателен';
        }
        if (value.length < 6) {
            return 'Пароль должен содержать минимум 8 символов';
        }
        if (!/^[A-Za-z0-9]*$/.test(value)) {
            return 'Пароль должен содержать только латинские буквы и цифры';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Пароль должен содержать хотя бы одну заглавную букву';
        }
        if (!/[a-z]/.test(value))
            return 'Пароль должен содержать хотя бы одну строчную букву';
        if (!/[0-9]/.test(value)) {
            return 'Пароль должен содержать хотя бы одну цифру';
        }
        return true;
    };

    const handleGraphQLErrors = (e: unknown) => {
        console.error("🚨 GraphQL Ошибка:", e);

        if (e instanceof ApolloError) {
            e.graphQLErrors.forEach((graphQLError: GraphQLFormattedError) => {
                console.error("🛑 GraphQL Response Error:", graphQLError);

                if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
                    setNotification({ message: 'Этот email уже используется. Необходима авторизация.', type: 'error' });
                    localStorage.removeItem('authToken');
                } else {
                    const field = graphQLError.extensions?.field as keyof RegisterFormInputs;
                    if (field) {
                        setError(field, { message: graphQLError.message });
                    }
                }
            });
        } else {
            console.error("❌ Неизвестная ошибка:", e);
            setNotification({ message: 'Произошла неизвестная ошибка. Пожалуйста, попробуйте снова.', type: 'error' });
            // УБИРАЕМ редирект на страницу 500
            // navigate('/error-500');
        }
    };


    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        if (step === 1) {
            try {
                const response = await registerUser({
                    variables: {
                        input: {
                            email: data.email,
                            password: data.password,
                            passwordConfirm: data.confirmPassword,
                        },
                    },
                });
                const token = response.data?.userSignUp?.token;

                if (token) {
                    localStorage.setItem('authToken', token);
                    console.log('Токен успешно сохранён:', token);
                } else {
                    console.warn('Токен не получен, предыдущий токен не изменён.');
                }
                console.log('Первый шаг успешен:', response.data);
                setEmail(data.email);

                setStep(2);
                reset({
                    firstName: '',
                    lastName: '',
                    middleName: '',
                });
            } catch (e) {
                console.error("🚨 Ошибка при отправке запроса:", e);
                handleGraphQLErrors(e);
            }
        } else {
            try {
                setValue("firstName", watch("firstName") || "");
                setValue("lastName", watch("lastName") || "");
                setValue("middleName", watch("middleName") || "");
                const token = localStorage.getItem("authToken");
                console.log("📤 Данные перед отправкой:", {
                    email: email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    middleName: data.middleName,
                });

                const response = await completeProfile({
                    variables: {
                        input: {
                            email: email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            middleName: data.middleName,
                        },
                    },
                    context: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                });
                console.log('Второй шаг успешен:', response.data);
                setNotification({ message: 'Регистрация завершена!', type: 'success' });
            } catch (e) {
                handleGraphQLErrors(e);
            }
        }
    };

    return {
        step,
        email,
        isEmailIconVisible,
        isPasswordIconVisible,
        isPasswordVisible,
        notification,
        register,
        handleSubmit,
        errors,
        watch,
        setError,
        reset,
        togglePasswordVisibility,
        validateEmail,
        validatePassword,
        onSubmit,
        registering,
        completing,
        setNotification,
        navigate,
        trigger,
        clearErrors,
        setValue,
    };
};
