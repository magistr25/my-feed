import './RegisterPage.scss';

import { FC } from 'react';

import { useRegistration } from '@/features/auth/model/hooks/useRegistration.ts';
import AuthTabs from "@/shared/ui/AuthTabs/AuthTabs.tsx";
import Button from "@/shared/ui/Button/Button.tsx";
import FormHeader from "@/shared/ui/FormHeader/FormHeader.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";
import Notification from '@/shared/ui/Notification/Notification';

const RegisterPage: FC = () => {
    const {
        step,
        isEmailIconVisible,
        isPasswordIconVisible,
        isPasswordVisible,
        notification,
        register,
        handleSubmit,
        errors,
        watch,
        togglePasswordVisibility,
        onSubmit,
        registering,
        completing,
        setNotification,
        navigate,
        validateEmail,
        validatePassword,
    } = useRegistration();

    return (
        <div className="register-wrapper">
            <div className="register-page">
                <div className="register-container">
                    <FormHeader title={`Шаг ${step} из 2`} />
                    <AuthTabs activeTab="register" />
                    <div className="register-container__step-num">{`Шаг ${step} из 2`}</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="register-form" autoComplete="off" noValidate>
                        {step === 1 ? (
                            <>
                                <p className="form-description">Введите Ваш Email и пароль, чтобы зарегистрироваться.</p>
                                <FormInputGroup
                                    label="Email"
                                    id="email"
                                    type="text"
                                    placeholder="Введите email"
                                    register={{
                                        ...register('email', {
                                            validate: (value: string) => validateEmail(value),
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
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="Введите пароль"
                                    register={{
                                        ...register('password', {
                                            validate: (value: string) => validatePassword(value),
                                            onBlur: () => validatePassword(watch('password')),
                                        }),
                                    }}
                                    error={errors.password?.message}
                                    isIconVisible={isPasswordIconVisible}
                                    statusIcon={!watch('password') ? null : !errors.password}
                                    isPassword={true}
                                    isPasswordVisible={isPasswordVisible}
                                    onTogglePasswordVisibility={togglePasswordVisibility}
                                />
                                <FormInputGroup
                                    label="Введите пароль еще раз"
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Повторите пароль"
                                    register={register('confirmPassword', {
                                        validate: (value: string) =>
                                            value === watch('password') || 'Пароли не совпадают',
                                    })}
                                    error={errors.confirmPassword?.message}
                                    isPassword={true}
                                    isPasswordVisible={isPasswordVisible}
                                    onTogglePasswordVisibility={togglePasswordVisibility}
                                    inputValue={watch('confirmPassword')}
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
                                    register={register('firstName', { required: 'Имя обязательно' })}
                                    error={errors.firstName?.message}
                                    autoComplete="new-first-name"
                                />
                                <FormInputGroup
                                    label="Фамилия"
                                    id="lastName"
                                    type="text"
                                    placeholder="Введите фамилию"
                                    register={register('lastName', { required: 'Фамилия обязательна' })}
                                    error={errors.lastName?.message}
                                    autoComplete="new-last-name"
                                />
                                <FormInputGroup
                                    label="Отчество"
                                    id="middleName"
                                    type="text"
                                    placeholder="Введите отчество"
                                    register={register('middleName', { required: 'Отчество обязательно' })}
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
                    {notification && (
                        <div className="register-container__notification">
                            <Notification
                                message={notification.message}
                                type={notification.type}
                                onClose={() => {
                                    setNotification(null);
                                    navigate('/login');
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
