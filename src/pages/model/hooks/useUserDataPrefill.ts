import { useEffect } from "react";

export const useUserDataPrefill = (data: any, setValue: any) => {
    useEffect(() => {
        if (data?.userMe) {
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
};
