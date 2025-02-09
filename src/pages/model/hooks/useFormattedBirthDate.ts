import { useEffect } from "react";

export const useFormattedBirthDate = (watch: any, setValue: any) => {
    useEffect(() => {
        const rawDate = watch("birthDate"); // Получаем значение
        if (rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
            const [year, month, day] = rawDate.split("-");
            setValue("birthDate", `${day}.${month}.${year}`);
        }
    }, [watch("birthDate"), setValue]);
};
