import { ChangeEvent, DragEvent } from "react";
import { UseFormReset, UseFormTrigger } from "react-hook-form";
import { ImageService } from "@/entities/image/model/ImageService";
import { descriptionVar, imageVar, previewVar, titleVar } from "@/app/apollo/client.ts";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

interface UsePostHandlersParams {
    reset: UseFormReset<FormData>;
    trigger: UseFormTrigger<FormData>;
}

// Хук с обработчиками событий для страницы постов
export const usePostHandlers = ({ reset, trigger }: UsePostHandlersParams) => {

    // Обработчик Drag & Drop
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        ImageService.handleDrop(event, async (file) => {
            imageVar(file);

            // Генерация превью и сохранение в Apollo Cache
            ImageService.generatePreview(file, (preview) => {
                previewVar(preview);
            });

            try {
                const isValid = await trigger("image");
                if (!isValid) {
                    console.error("Ошибка: Валидация изображения не прошла.");
                }
            } catch (error) {
                console.error("Ошибка при вызове trigger:", error);
            }
        });
    };

    // Обработчик загрузки файла через input
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        ImageService.handleFileChange(event, (file) => {
            imageVar(file);
            ImageService.generatePreview(file, (preview) => {
                previewVar(preview);
            });
        });
    };

    // Очистка формы
    const handleCancel = () => {
        reset({
            title: "",
            description: "",
            image: null
        });
        imageVar(null);
        previewVar(null); // Очищаем preview при сбросе формы
        titleVar("");
        descriptionVar("");
    };

    // Отправка формы
    const onSubmit = (data: FormData) => {
        console.log("Отправка поста: ", data);
        // Логика отправки данных на сервер
    };

    return { handleDrop, handleFileChange, handleCancel, onSubmit };
};
