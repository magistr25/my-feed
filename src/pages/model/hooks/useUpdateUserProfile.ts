import { useMutation } from "@apollo/client";


import { userVar } from "@/app/apollo/client.ts";
import EDIT_USER_PROFILE from "../../api/mutations/updateUserProfile";

export const useUpdateUserProfile = (setNotification: any) => {
    const [userEditProfile] = useMutation(EDIT_USER_PROFILE, {
        update: (cache, { data }) => {
            if (!data?.userEditProfile?.user) return;
            cache.modify({
                fields: {
                    userMe(existingUserRef = {}) {
                        return { ...existingUserRef, ...data.userEditProfile.user };
                    },
                },
            });
        },
        optimisticResponse: ({ input }) => ({
            userEditProfile: {
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

    return { userEditProfile };
};
