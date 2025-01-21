import './RegisterPage.scss';

import {useMutation} from '@apollo/client';
import {ApolloError} from '@apollo/client/errors';
import {GraphQLFormattedError} from 'graphql/index';
import {FC, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from "react-router-dom";

import {COMPLETE_PROFILE} from '@/features/auth/api/mutations/completeProfile.ts'; // Второй запрос
import {REGISTER_USER} from '@/features/auth/api/mutations/registerUser.ts';
import AuthTabs from "@/shared/ui/AuthTabs/AuthTabs.tsx";
import Button from "@/shared/ui/Button/Button.tsx";
import FormHeader from "@/shared/ui/FormHeader/FormHeader.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";
import Notification from '@/shared/ui/Notification/Notification';


interface RegisterFormInputs {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    middleName: string;
}

const RegisterPage: FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Управление шагами
    const [email, setEmail] = useState('');
    const [isEmailIconVisible, setIsEmailIconVisible] = useState(false);
    const [isPasswordIconVisible, setIsPasswordIconVisible] = useState(false);
    const {register, handleSubmit, formState: { errors }, watch, setError, reset} = useForm<RegisterFormInputs>({
        defaultValues: {
            firstName: '',
            lastName: '',
            middleName: '',
        },
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    // Мутации для первого и второго шагов
    const [registerUser, {loading: registering, error: registerError}] = useMutation(REGISTER_USER);
    const [completeProfile, {loading: completing, error: completeError}] = useMutation(COMPLETE_PROFILE);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        console.log("step = ", step)
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
                    // Сохраняем токен только если он не null
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
                handleGraphQLErrors(e);
            }
        } else {
            try {
                const response = await completeProfile({
                    variables: {
                        input: {
                            email: email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            middleName: data.middleName,
                        },
                    },
                });
                console.log('Второй шаг успешен:', response.data);
                setNotification({message: 'Регистрация завершена!', type: 'success'});
            } catch (e) {
                handleGraphQLErrors(e);
            }
        }
    };
    const validateEmail = (value: string): string | true => {
        setIsEmailIconVisible(true)
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
    const handleGraphQLErrors = (e: unknown) => {
        if (e instanceof ApolloError) {
            e.graphQLErrors.forEach((graphQLError: GraphQLFormattedError) => {
                if (graphQLError.extensions?.field === 'email') {
                    setError('email', {message: 'Этот email уже используется'});
                }
                if (graphQLError.extensions?.field === 'password') {
                    setError('password', {message: 'Неверный пароль'});
                }
                if (graphQLError.extensions?.field === 'firstName') {
                    setError('firstName', {message: 'Введите корректное имя'});
                }
                if (graphQLError.extensions?.field === 'lastName') {
                    setError('lastName', {message: 'Введите корректную фамилию'});
                }
                if (graphQLError.extensions?.field === 'middleName') {
                    setError('middleName', {message: 'Введите корректное отчество'});
                }
            });
        } else {
            console.error('Неизвестная ошибка:', e);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-page">
                <div className="register-container">
                    <FormHeader title={`Шаг ${step} из 2`}/>
                    <AuthTabs activeTab="register"/>
                    <div className="register-container__step-num">{`Шаг ${step} из 2`}</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="register-form" autoComplete="off" noValidate>
                        {step === 1 ? (
                            <>
                                <p className="form-description">Введите Ваш Email и пароль, чтобы
                                    зарегистрироваться.</p>
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
                                <FormInputGroup
                                    label="Введите пароль еще раз"
                                    id="confirmPassword"
                                    type="text"
                                    placeholder="Повторите пароль"
                                    register={register('confirmPassword', {
                                        validate: (value) =>
                                            value === watch('password') || 'Пароли не совпадают',
                                    })}
                                    error={errors.confirmPassword?.message}
                                />
                                <div className="form-button">
                                    <Button
                                        text="Далее"
                                        variant="primary"
                                        size="large"
                                        type="submit"
                                        isLoading={registering}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="form-description">Дополните свой профиль личной информацией.</p>
                                <FormInputGroup
                                    label="Имя"
                                    id="firstName"
                                    type="text"
                                    placeholder="Введите имя"
                                    register={register('firstName', {required: 'Имя обязательно'})}
                                    error={errors.firstName?.message}
                                    autoComplete="new-first-name"
                                />
                                <FormInputGroup
                                    label="Фамилия"
                                    id="lastName"
                                    type="text"
                                    placeholder="Введите фамилию"
                                    register={register('lastName', {required: 'Фамилия обязательна'})}
                                    error={errors.lastName?.message}
                                    autoComplete="new-last-name"
                                />
                                <FormInputGroup
                                    label="Отчество"
                                    id="middleName"
                                    type="text"
                                    placeholder="Введите отчество"
                                    register={register('middleName', {required: 'Отчество обязательно'})}
                                    error={errors.middleName?.message}
                                    autoComplete="new-middle-name"
                                />
                                <div className="form-button">
                                    <Button
                                        text="Создать аккаунт"
                                        variant="primary"
                                        size="large"
                                        type="submit"
                                        isLoading={completing}
                                    />
                                </div>
                            </>
                        )}
                    </form>
                    {(registerError || completeError) && (
                        <p className="error-message">{registerError?.message || completeError?.message}</p>
                    )}
                    {notification && (
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            onClose={() => {
                                setNotification(null);
                                navigate('/register');
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

