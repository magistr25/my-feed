import { useEffect } from "react";
import { formatPhoneNumber } from "@/pages/ui/lib/formatPhoneNumber.ts";

export const usePrefillUserForm = (data: any, setValue: any, setBirthDate: any) => {
    useEffect(() => {
        if (data?.userMe) {
            setValue('gender', data.userMe.gender?.toLowerCase() || '');
            setValue('phone', formatPhoneNumber(data.userMe.phone || ''));
            setValue('birthDate', data.userMe.birthDate || '');
        }
    }, [data, setValue]);

    useEffect(() => {
        if (data?.userMe?.birthDate) {
            const parsedDate = new Date(data.userMe.birthDate);
            if (!isNaN(parsedDate.getTime())) {
                setBirthDate(parsedDate);
            }
        }
    }, [data]);
};
