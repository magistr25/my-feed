import './LoginPage.scss';

import { FC } from 'react';

import {useAuth} from "@/features/auth/model/hooks/useAuth.ts";
import AuthTabs from "@/shared/ui/AuthTabs/AuthTabs.tsx";
import Button from "@/shared/ui/Button/Button.tsx";
import FormHeader from "@/shared/ui/FormHeader/FormHeader.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";


const LoginPage: FC = () => {
    const {
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
    } = useAuth();

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
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Введите пароль"
                            register={{
                                ...register('password', {
                                    validate: validatePassword,
                                    onBlur: () => validatePassword(watch('password')),
                                }),
                            }}
                            error={errors.password?.message}
                            isPassword={true}
                            isPasswordVisible={isPasswordVisible}
                            onTogglePasswordVisibility={togglePasswordVisibility}
                            inputValue={watch('password')}
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
