import './ProfilePage.scss';
import "react-datepicker/dist/react-datepicker.css";

import {FC, MouseEvent, useEffect, useRef, useState} from 'react';
import { useRegistration } from '@/features/auth/model/hooks/useRegistration';
import { formatPhoneNumber } from "@/pages/ui/lib/formatPhoneNumber";
import CustomDatePicker from "@/shared/ui/CustomDatePicker/CustomDatePicker";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup";
import Notification from '@/shared/ui/Notification/Notification';
import AvatarUpload from "@/shared/ui/AvatarUpload/AvatarUpload";
import Button from "@/shared/ui/Button/Button.tsx";
import CalendarIcon from "@/shared/ui/CalendarIcon/CalendarIcon";
import MobileActionBar from "@/shared/ui/MobileActionBar/MobileActionBar";

import { useQuery, useReactiveVar } from "@apollo/client";
import {
    avatarUrlVar,
    mobileActionBarVar,
    mobileMenuVar,
    showActionBarVar,
    User,
    userVar
} from "@/app/apollo/client.ts";

// ГрафQL-запросы
import GET_USER_DATA from "@/pages/api/queries/getUserData.ts";

// Хуки и утилиты, связанные с профилем
import profileUtils from "@/pages/model/hooks/profileUtils.ts";
import { useScreenSize } from "@/pages/model/hooks/useScreenSize.ts";
import { useMobileActionBarFocus } from "@/pages/model/hooks/useMobileActionBarFocus.ts";
import { useAutoScroll } from "@/pages/model/hooks/useAutoScroll.ts";
import { useUserDataPrefill } from "@/pages/model/hooks/useUserDataPrefill.ts";
import { useScrollToAvatar } from "@/pages/model/hooks/useScrollToAvatar.ts";
import { usePrefillUserForm } from "@/pages/model/hooks/usePrefillUserForm.ts";
import { useAutoScrollToInput } from "@/pages/model/hooks/useAutoScrollToInput.ts";
import { useFormattedBirthDate } from "@/pages/model/hooks/useFormattedBirthDate.ts";
import { useAvatarUrlSync } from "@/pages/model/hooks/useAvatarUrlSync.ts";
import { useUpdateUserProfile } from "@/pages/model/hooks/useUpdateUserProfile.ts";

const ProfilePage: FC = () => {
    // Состояние для даты рождения и фокуса ввода
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [initialValues, setInitialValues] =  useState<User | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);

    // Получение данных о размере экрана (мобильная/десктопная версия)
    const { isDesktop, isMobile } = useScreenSize();

    // Состояние реактивных переменных (открыто ли мобильное меню и ActionBar)
    const isMobileMenuOpen = useReactiveVar(mobileMenuVar);
    const isMobileActionBarOpen = useReactiveVar(mobileActionBarVar);
    const isShowActionBar = useReactiveVar(showActionBarVar);

    // Рефы для управления прокруткой
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const pageRef = useRef<HTMLDivElement | null>(null);

    // Подключение пользовательских хуков для автофокуса и автоскролла
    useMobileActionBarFocus();
    useAutoScroll(isMobileActionBarOpen);
    useScrollToAvatar(avatarRef);

    // Запрос данных пользователя
    const { data, loading, error } = useQuery(GET_USER_DATA);

    // Хук регистрации и управления формой
    const {
        notification,
        register,
        handleSubmit,
        errors,
        watch,
        trigger,
        clearErrors,
        setNotification,
        navigate,
        setValue, reset
    } = useRegistration();

    // Заполнение формы данными пользователя
    useUserDataPrefill(data, setValue);
    usePrefillUserForm(data, setValue, setBirthDate);

    // Использование хука для обновления профиля пользователя
    const { updateUserProfile } = useUpdateUserProfile(setNotification);

    // Автоматический скролл к активному полю при открытом ActionBar
    useAutoScrollToInput(isMobileActionBarOpen);

    // Форматирование даты перед отображением в инпуте
    useFormattedBirthDate(watch, setValue);

    // Синхронизация аватара пользователя
    useAvatarUrlSync(data);

    useEffect(() => {
        const user = userVar(); // Получаем актуальные данные пользователя
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [userVar()]);

    useEffect(() => {
        if (data?.userMe) {
            const userData: User = {
                id: data.userMe.id,
                firstName: data.userMe.firstName || "",
                lastName: data.userMe.lastName || "",
                middleName: data.userMe.middleName || "",
                birthDate: data.userMe.birthDate ? new Date(data.userMe.birthDate).toISOString().split("T")[0] : "",
                gender: data.userMe.gender ? data.userMe.gender.toLowerCase() : "",
                email: data.userMe.email || "",
                phone: formatPhoneNumber(data.userMe.phone || ""),
                country: data.userMe.country || "",
                avatarUrl: data.userMe.avatarUrl ?? null,
            };

            setInitialValues(userData);
            reset(userData);
            setBirthDate(data.userMe.birthDate ? new Date(data.userMe.birthDate) : null);
            setAvatar(userData.avatarUrl ?? null);

        }
    }, [data, reset, setValue]);

    const handleResetForm = (event?: MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault();

        if (!initialValues) return; // Если `initialValues` отсутствует, выходим из функции

        reset(initialValues);
        setBirthDate(initialValues.birthDate ? new Date(initialValues.birthDate) : null);
        setValue("gender", initialValues.gender);
        setAvatar(initialValues.avatarUrl ?? null);
    };


// После сброса формы явно обновляем `gender`, так как `reset` не всегда корректно обновляет radio-кнопки
    useEffect(() => {
        if (initialValues) {
            setValue("gender", initialValues.gender);
            setAvatar(initialValues.avatarUrl ?? null); // Теперь сброшенная аватарка обновляется
        }
    }, [initialValues, setValue]);


    // Проверка состояния загрузки данных
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div className="profile-wrapper" ref={pageRef}>
            <div className="profile-page">
                <div className="profile-page-container">
                    <h1 className="profile-page__title">Мой профиль</h1>
                    <form
                        onSubmit={handleSubmit(async (data) => {
                            await profileUtils.handleUpdateProfile(
                                { ...data, id: userVar()?.id ?? "", avatarUrl: avatarUrlVar() },
                                setNotification,
                                updateUserProfile
                            )
                        })}

                        className="profile-form"
                        autoComplete="off"
                        noValidate
                    >
                        <div ref={avatarRef}>
                            <AvatarUpload
                                userAvatarUrl={avatar}
                                onAvatarChange={(newAvatar) => {
                                    if (newAvatar instanceof File) {
                                        profileUtils.handleAvatarChange(newAvatar);
                                        setAvatar(URL.createObjectURL(newAvatar));
                                    } else {
                                        profileUtils.handleAvatarChange(null); // Если удаляем, передаём null
                                        setAvatar(null);
                                    }
                                }}
                            />

                        </div>
                        <FormInputGroup
                            label="Имя"
                            id="firstName"
                            type="text"
                            placeholder="Введите имя"
                            defaultValue={data?.userMe?.firstName || ''}
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
                            defaultValue={data?.userMe?.lastName || ''}
                            register={register('lastName', {required: ''})}
                            error={errors.lastName?.message}
                            autoComplete="new-last-name"
                        />
                        <FormInputGroup
                            label="Отчество"
                            id="middleName"
                            type="text"
                            placeholder="Введите отчество"
                            defaultValue={data?.userMe?.middleName || ''}
                            register={register('middleName', {required: ''})}
                            error={errors.middleName?.message}
                            autoComplete="new-middle-name"
                        />

                        <div className="date-picker-container">
                            <h2 className="date-picker-container__title">Дата рождения</h2>
                            {isDesktop ? (
                                <CustomDatePicker
                                    selectedDate={birthDate}
                                    onChange={async (date) => {
                                        if (!date || date.toISOString().split("T")[0] === watch("birthDate")) {
                                            return; // Не обновляем, если дата не изменилась
                                        }

                                        setBirthDate(date);
                                        setValue("birthDate", date.toISOString().split("T")[0]); // Приводим к строке (YYYY-MM-DD)
                                        await trigger("birthDate"); // Ожидаем завершения валидации
                                    }}
                                />

                            ) : (
                                <FormInputGroup
                                    label=""
                                    id="birthDate"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{2}\.\d{2}\.\d{4}"
                                    placeholder="дд.мм.гггг"
                                    defaultValue={data?.userMe?.birthDate ? new Date(data.userMe.birthDate).toLocaleDateString('ru-RU') : ''}
                                    register={register("birthDate")}
                                    error={errors.birthDate?.message}
                                    leftIcon={<CalendarIcon />}
                                />
                            )}
                        </div>

                        <div className="form-group form-group__radio">
                            <label>Выберите пол</label>
                            <div className="form-radio-group">
                                <label className="form-radio">
                                    <input
                                        className="input-radio"
                                        type="radio"
                                        value="male"
                                        checked={watch("gender") === "male"}
                                        {...register("gender", { required: "Выберите пол" })}
                                    />
                                    Мужской
                                </label>
                                <label className="form-radio">
                                    <input
                                        className="input-radio"
                                        type="radio"
                                        value="female"
                                        checked={watch("gender") === "female"}
                                        {...register("gender", { required: "Выберите пол" })}
                                    />
                                    Женский
                                </label>
                            </div>
                            {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                        </div>

                        <div className='profile-wrapper-down'>
                            <FormInputGroup
                                label="Email"
                                placeholder="Введите email"
                                id="email"
                                type="text"
                                defaultValue={data?.userMe?.email || ''}
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
                                className={showActionBarVar() ? "input-with-margin" : ""}
                            />
                        </div>
                        <div className="profile-form__actions"   style={{ display: isDesktop || !isShowActionBar ? "flex" : "none" }}>
                            <Button
                                type="button"
                                onClick={handleResetForm}
                                text="Отменить"
                                variant="secondary"
                                size="small"
                                autoFocus={false}
                            />
                        <Button
                            type="submit"
                            onClick={() => {
                                mobileActionBarVar(false);
                            }}
                            text="Сохранить"
                            variant="primary"
                            size="small"
                        />

                    </div>
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
                {/* Показываем MobileActionBar только на мобильных */}
                {isMobile && !isMobileMenuOpen && isShowActionBar && (
                    <MobileActionBar
                        onSave={() => showActionBarVar(false)}
                        onScrollTop={profileUtils.scrollToTop}
                        onScrollBottom={profileUtils.scrollToBottom}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
