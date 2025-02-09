import { uploadToS3 } from "@/shared/utils/uploadToS3.ts";
import { avatarFileVar, avatarUrlVar, showActionBarVar, userVar } from "@/app/apollo/client.ts";
import { UserProfileData } from "@/pages/model/types/UserProfileData.ts";
import { ApolloCache, DefaultContext, MutationFunctionOptions } from "@apollo/client";
import GET_USER_DATA from "@/pages/api/queries/getUserData.ts";

class ProfileUtils {
    constructor() {
        this.handleFocusIn = this.handleFocusIn.bind(this); // Привязываем контекст
    }

    // Изменение аватара
    handleAvatarChange(file: File) {
        avatarFileVar(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            avatarUrlVar(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    // Обновление профиля + обновление userVar
    async handleUpdateProfile(
        formData: UserProfileData,
        setNotification: (msg: any) => void,
        updateUserProfile: (
            options?: MutationFunctionOptions<any, DefaultContext>
        ) => Promise<any>
    ) {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setNotification({ message: "Ошибка: Вы не авторизованы!", type: "error" });
                return;
            }

            let finalAvatarUrl = avatarUrlVar();

            if (avatarFileVar()) {
                try {
                    const uploadedUrl = await uploadToS3(avatarFileVar()!);
                    if (!uploadedUrl) throw new Error("Ошибка загрузки файла");
                    finalAvatarUrl = uploadedUrl;
                    avatarUrlVar(finalAvatarUrl);
                } catch (uploadError) {
                    console.error("Ошибка загрузки файла:", uploadError);
                    setNotification({ message: "Ошибка загрузки файла на сервер", type: "error" });
                    return;
                }
            }

            const userProfileData: Partial<UserProfileData> = {
                firstName: formData.firstName ?? undefined,
                lastName: formData.lastName ?? undefined,
                middleName: formData.middleName ?? undefined,
                birthDate: this.formatBirthDate(formData.birthDate ?? undefined, setNotification),
                gender: formData.gender?.toUpperCase() ?? undefined,
                email: formData.email,
                phone: this.formatPhoneNumber(formData.phone ?? undefined),
                country: formData.country ?? undefined,
                avatarUrl: finalAvatarUrl ?? undefined,
            };

            const response = await updateUserProfile({
                variables: { input: userProfileData },
                context: {
                    headers: { Authorization: `Bearer ${token}` },
                },
                optimisticResponse: {
                    userEditProfile: {
                        __typename: "EditProfileResponse",
                        problem: null,
                        user: {
                            __typename: "UserModel",
                            id: userVar()?.id ?? "temp-id",
                            ...userProfileData,
                        },
                    },
                },
                update: (cache: ApolloCache<any>, { data }: { data?: { userEditProfile: { user: UserProfileData } } }) => {
                    if (!data?.userEditProfile?.user) return;

                    const existingData = cache.readQuery<{ userMe: UserProfileData }>({
                        query: GET_USER_DATA,
                    });

                    if (existingData?.userMe) {
                        cache.writeQuery({
                            query: GET_USER_DATA,
                            data: {
                                userMe: {
                                    ...existingData.userMe,
                                    ...data.userEditProfile.user, // Обновляем измененные данные
                                },
                            },
                        });
                    }
                },
            });

            if (response?.data?.userEditProfile?.user) {
                // Обновляем userVar после успешного обновления профиля
                userVar({
                    ...userVar() ?? {}, // Гарантия, что userVar не null
                    ...response.data.userEditProfile.user,
                    updatedAt: Date.now(), // Принудительное обновление
                });
            }

            setNotification({ message: "Изменения успешно сохранены!", type: "success" });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("Ошибка обновления профиля:", error);
            setNotification({
                message: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
                type: "error",
            });
        }
    }

    // Форматирование даты перед отправкой
    formatBirthDate(birthDate: string | undefined, setNotification: (msg: any) => void): string | undefined {
        if (!birthDate) return undefined;
        try {
            const [day, month, year] = birthDate.split(".");
            const parsedDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(parsedDate.getTime())) throw new Error("Неверный формат даты");
            return parsedDate.toISOString().split("T")[0];
        } catch (error) {
            console.error("Ошибка обработки даты:", error);
            setNotification({ message: "Ошибка формата даты. Используйте ДД.ММ.ГГГГ", type: "error" });
            return undefined;
        }
    }

    // Форматирование номера телефона
    formatPhoneNumber(phone: string | undefined): string | undefined {
        if (!phone) return undefined;
        return phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;
    }

    // Скролл вверх
    scrollToTop() {
        const target = document.querySelector(".profile-page") || document.documentElement || document.body;
        target.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Скролл вниз
    scrollToBottom() {
        const target = document.querySelector(".profile-page") || document.documentElement || document.body;
        target.scrollTo({ top: target.scrollHeight, behavior: "smooth" });
    }

    // Обработчик показа MobileActionBar
    handleFocusIn(event: FocusEvent) {
        const target = event.target as HTMLElement;
        if (target?.matches("input, textarea")) {
            showActionBarVar(true);
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 200);
        }
    }
}

export default new ProfileUtils();
