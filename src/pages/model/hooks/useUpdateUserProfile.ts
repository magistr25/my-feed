import { useMutation } from "@apollo/client";
import UPDATE_USER_PROFILE from "@/pages/api/mutations/updateUserProfile.ts";
import { userVar } from "@/app/apollo/client.ts";

export const useUpdateUserProfile = (setNotification: any) => {
    const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
        update: (cache, { data }) => {
            if (!data?.updateUserProfile) return;

            cache.modify({
                fields: {
                    userMe(existingUserRef = {}) {
                        return { ...existingUserRef, ...data.updateUserProfile };
                    },
                },
            });
        },
        optimisticResponse: ({ input }) => ({
            updateUserProfile: {
                __typename: "User",
                id: userVar()?.id ?? "",
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName,
                birthDate: input.birthDate,
                gender: input.gender,
                email: input.email,
                phone: input.phone,
                country: input.country,
                avatarUrl: input.avatarUrl,
            },
        }),
        onError: (error) => {
            console.error("Ошибка при обновлении профиля:", error);
            setNotification({ message: "Ошибка при обновлении профиля", type: "error" });
        },
    });

    return { updateUserProfile };
};
