import './ProfilePage.scss';
import "react-datepicker/dist/react-datepicker.css";

import  {FC, useState} from 'react';

import {useRegistration} from '@/features/auth/model/hooks/useRegistration.ts';
import {formatPhoneNumber} from "@/pages/ui/lib/formatPhoneNumber.ts";
import CustomDatePicker from "@/shared/ui/CustomDatePicker/CustomDatePicker.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";
import Notification from '@/shared/ui/Notification/Notification';

const ProfilePage: FC = () => {
    const {
        notification,
        register,
        handleSubmit,
        errors,
        watch,
        onSubmit,
        trigger,
        clearErrors,
        setValue,
        setNotification,
        navigate,
    } = useRegistration();

    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="profile-container">
            <div className="register-container__avatar">фото</div>
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form" autoComplete="off" noValidate>
                <FormInputGroup
                    label="Имя"
                    id="firstName"
                    type="text"
                    placeholder="Введите имя"
                    register={register('firstName', {required: ''})}
                    error={errors.firstName?.message}
                    autoComplete="new-first-name"
                    className={`input-field ${isFocused ? "input-focused" : ""}`}
                    onFocus={() => setIsFocused(true)}
                />
                <FormInputGroup
                    label="Фамилия"
                    id="lastName"
                    type="text"
                    placeholder="Введите фамилию"
                    register={register('lastName', {required: ''})}
                    error={errors.lastName?.message}
                    autoComplete="new-last-name"
                />
                <FormInputGroup
                    label="Отчество"
                    id="middleName"
                    type="text"
                    placeholder="Введите отчество"
                    register={register('middleName', {required: ''})}
                    error={errors.middleName?.message}
                    autoComplete="new-middle-name"
                />

                <div className="date-picker-container">
                    <h2 className="date-picker-container__title">Дата рождения</h2>
                    <CustomDatePicker selectedDate={birthDate} onChange={setBirthDate} />
                </div>

                <div className="form-group">
                    <label>Выберите пол</label>
                    <div className="form-radio-group">
                        <label className="form-radio">
                            <input
                                type="radio"
                                value="male"
                                {...register("gender", {required: "Пол обязателен"})}
                            />
                            Мужской
                        </label>
                        <label className="form-radio">
                            <input
                                type="radio"
                                value="female"
                                {...register("gender", {required: "Пол обязателен"})}
                            />
                            Женский
                        </label>
                    </div>
                    {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                </div>

                <FormInputGroup
                    label="Email"
                    id="email"
                    type="text"
                    placeholder="Введите email"
                    register={{
                        ...register('email', {
                            validate: (value: string) => {
                                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                                return emailRegex.test(value) || "Неверный формат email";
                            },
                            onChange: async (e) => {
                                setValue("email", e.target.value);
                                await trigger("email");
                            },
                            onBlur: async () => {
                                await trigger("email");
                                if (!errors.email) clearErrors("email");
                            },
                        }),
                    }}
                    error={errors.email?.message}
                    isIconVisible={true}
                    statusIcon={!watch('email') ? null : !errors.email}
                />

                <FormInputGroup
                    label="Номер телефона"
                    id="phone"
                    type="text"
                    placeholder="(999) 999 99 99"
                    register={{
                        ...register("phone", {
                            required: "Введите номер телефона",
                            pattern: {
                                value: /^\(\d{3}\) \d{3} \d{2} \d{2}$/,
                                message: "Номер телефона введен неверно",
                            },
                        }),
                        onChange: async (e) => {
                            const formattedValue = formatPhoneNumber(e.target.value);
                            setValue("phone", formattedValue);
                            return await trigger("phone");
                        },
                        onBlur: async () => {
                            const isValid = await trigger("phone");
                            if (isValid) clearErrors("phone");
                        },
                    }}
                    error={errors.phone?.message}
                    isIconVisible={true}
                    statusIcon={!watch('phone') ? null : !errors.phone}
                />

                <FormInputGroup
                    label="Страна"
                    id="country"
                    type="text"
                    placeholder="Введите страну"
                    register={register("country")}
                    error={undefined}
                />


            </form>

            {notification && (
                <div className="profile-container__notification">
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
    );
};

export default ProfilePage;
