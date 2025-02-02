import './ProfilePage.scss';
import "react-datepicker/dist/react-datepicker.css";

import {FC, useEffect, useRef, useState} from 'react';

import {useRegistration} from '@/features/auth/model/hooks/useRegistration.ts';
import {formatPhoneNumber} from "@/pages/ui/lib/formatPhoneNumber.ts";
import CustomDatePicker from "@/shared/ui/CustomDatePicker/CustomDatePicker.tsx";
import FormInputGroup from "@/shared/ui/FormInputGroup/FormInputGroup.tsx";
import Notification from '@/shared/ui/Notification/Notification';
import AvatarUpload from "@/shared/ui/AvatarUpload/AvatarUpload.tsx";
import Button from "@/shared/ui/Button/Button.tsx";
import CalendarIcon from "@/shared/ui/CalendarIcon/CalendarIcon.tsx";
import MobileActionBar from "@/shared/ui/MobileActionBar/MobileActionBar.tsx";
import {useMutation, useQuery, useReactiveVar} from "@apollo/client";
import {mobileActionBarVar, mobileMenuVar, profileVar} from "@/app/apollo/client.ts";
import GET_USER_DATA from "@/pages/api/queries/getUserData.ts";
import UPDATE_USER_PROFILE from "@/pages/api/mutations/updateUserProfile.ts";
import {UserProfileData} from "@/pages/model/types/UserProfileData .ts";


const ProfilePage: FC = () => {
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const user = {avatarUrl: "/path-to-user-avatar.jpg"}; // Данные о пользователе
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 824);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 824);
    const pageRef = useRef<HTMLDivElement | null>(null);

    // Запрос для получения данных пользователя
    const { data, loading, error } = useQuery(GET_USER_DATA);
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
        setValue
    } = useRegistration();
    // Заполнение формы после получения данных
    useEffect(() => {
        if (data && data.userMe) {
            setValue('firstName', data.userMe.firstName || '');
            setValue('lastName', data.userMe.lastName || '');
            setValue('middleName', data.userMe.middleName || '');
            setValue('birthDate', data.userMe.birthDate || '');
            setValue('gender', data.userMe.gender || '');
            setValue('email', data.userMe.email || '');
            setValue('phone', data.userMe.phone || '');
            setValue('country', data.userMe.country || '');
        }
    }, [data, setValue]);

    const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
        refetchQueries: [{ query: GET_USER_DATA }],
        onError: (error) => {
            console.error("Ошибка при обновлении профиля:", error);
            setNotification({ message: "Ошибка при обновлении профиля", type: "error" });
        },
    });


    const isMobileMenuOpen = useReactiveVar(mobileMenuVar);
    const isMobileActionBarOpen = useReactiveVar(mobileActionBarVar);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 824);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const handleAvatarChange = (newAvatar: string) => {
        setValue("avatar", newAvatar);
    };

    const avatarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (avatarRef.current) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    avatarRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
                });
            }, 100);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 824);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const inputs = document.querySelectorAll("input, textarea");
        if (inputs.length > 0) {
            const lastInput = inputs[inputs.length - 1] as HTMLElement;

            if (isMobileActionBarOpen) {
                lastInput.style.marginBottom = "50px";
            } else {
                lastInput.style.marginBottom = "";
            }
        }
    }, [isMobileActionBarOpen]);

    useEffect(() => {
        if (isMobileActionBarOpen) {
            const activeElement = document.activeElement as HTMLElement;
            if (
                activeElement &&
                (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") &&
                activeElement.closest(".profile-wrapper-down")
            )  {
                setTimeout(() => {
                    activeElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        }
    }, [isMobileActionBarOpen]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    const scrollToTop = () => {
        const target = document.querySelector(".profile-page") || document.documentElement || document.body;
        target.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = () => {
        const target = document.querySelector(".profile-page") || document.documentElement || document.body;
        target.scrollTo({ top: target.scrollHeight, behavior: "smooth" });
    };

    const handleUpdateProfile = async (formData: UserProfileData) => {
        try {
            await updateUserProfile({
                variables: {
                    input: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        middleName: formData.middleName,
                        birthDate: formData.birthDate
                            ? new Date(formData.birthDate).toISOString().split("T")[0]
                            : null,
                        gender: formData.gender?.toUpperCase(), // Приведение пола к MALE/FEMALE
                        email: formData.email,
                        phone: formData.phone ? `+${formData.phone.replace(/\D/g, "")}` : null,
                        country: formData.country,
                        avatarUrl: formData.avatarUrl,
                    },
                },
            });
            profileVar(formData);
            setNotification({ message: "Профиль обновлен успешно", type: "success" });
        } catch (error) {
            if (error instanceof Error) {
                setNotification({ message: error.message, type: "error" });
            } else {
                setNotification({ message: "Произошла неизвестная ошибка", type: "error" });
            }
        }
    };

    return (
        <div className="profile-wrapper" ref={pageRef}>
            <div className="profile-page">
                <div className="profile-page-container">
                    <h1 className="profile-page__title">Мой профиль</h1>
                    <form onSubmit={handleSubmit(handleUpdateProfile)} className="profile-form" autoComplete="off" noValidate>
                        <div ref={avatarRef}>
                            <AvatarUpload userAvatarUrl={user.avatarUrl} onAvatarChange={handleAvatarChange}/>
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
                                <CustomDatePicker selectedDate={birthDate || null}  onChange={setBirthDate} />
                            ) : (
                                <FormInputGroup
                                    label=""
                                    id="birthDate"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{2}\.\d{2}\.\d{4}"
                                    placeholder="дд.мм.гггг"
                                    defaultValue={data?.userMe?.birthDate || ''}
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
                                        defaultChecked={data?.userMe?.gender?.toUpperCase() === "MALE"}
                                        {...register("gender", { required: "Выберите пол" })}
                                    />
                                    Мужской
                                </label>
                                <label className="form-radio">
                                    <input
                                        className="input-radio"
                                        type="radio"
                                        value="female"
                                        defaultChecked={data?.userMe?.gender?.toUpperCase() === "FEMALE"}
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
                            />
                        </div>
                        {!isMobileActionBarOpen && (<div className="profile-form__actions">
                            <Button
                                type="button"
                                onClick={() => navigate(-1)}
                                text="Отменить"
                                variant="secondary"
                                size="small"
                            />
                            <Button
                                type="submit"
                                text="Сохранить"
                                variant="primary"
                                size="small"
                            />
                        </div>
                        )}
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
            </div>
            {/* Показываем MobileActionBar только на мобильных */}
            {isMobile && !isMobileMenuOpen && <MobileActionBar onSave={handleSubmit(handleUpdateProfile)} onScrollTop={scrollToTop} onScrollBottom={scrollToBottom}/>}
        </div>
    );
};

export default ProfilePage;
