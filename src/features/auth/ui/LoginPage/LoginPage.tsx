import './LoginPage.scss';

import {useMutation} from "@apollo/client";
import {FC} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from "react-router-dom";

import {SIGN_IN_USER} from "@/features/auth/api/mutations/signInUser.ts";
import AuthTabs from "@/shared/ui/AuthTabs/AuthTabs.tsx";
import Button from "@/shared/ui/Button/Button.tsx";
import FormHeader from "@/shared/ui/FormHeader/FormHeader.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";

interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginPage: FC = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormInputs>();

    const navigate = useNavigate();
    const [signInUser] = useMutation(SIGN_IN_USER);

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

            const { userSignIn } = response.data;

            if (userSignIn.problem) {
                return;
            }

            // Сохраняем токен и перенаправляем пользователя
            localStorage.setItem('authToken', userSignIn.token);
            navigate('/');
        } catch (error) {
            console.error('Ошибка при входе:', error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <FormHeader title="Вход в аккаунт"/>
                <AuthTabs activeTab="login"/>
                <form onSubmit={handleSubmit(onSubmit)} className="login-form" autoComplete="off">
                    <p className="form-description">Введите Ваш Email и пароль, чтобы войти в аккаунт.</p>
                    <FormInputGroup
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="Введите email"
                        register={register('email', {required: 'Email обязателен'})}
                        error={errors.email?.message}
                    />
                    <FormInputGroup
                        label="Пароль"
                        id="password"
                        type="password"
                        placeholder="Введите пароль"
                        register={register('password', {required: 'Пароль обязателен'})}
                        error={errors.password?.message}
                    />
                    <div className="form-button">
                        <Button
                            text="Войти"
                            variant="primary"
                            size="large"
                            type="submit"
                            isDisabled={!!Object.keys(errors).length}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
