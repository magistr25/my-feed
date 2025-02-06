import { ChangeEvent, DragEvent } from "react";
import { UseFormReset, UseFormTrigger } from "react-hook-form";
import { ImageService } from "@/entities/image/model/ImageService";
import { descriptionVar, imageVar, previewVar, titleVar } from "@/app/apollo/client";
import { CREATE_POST } from "@/features/posts/api/mutations/createPost";
import PostUtils from "@/features/posts/model/utils/PostUtils";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "@/features/posts/api/mutations/deletePost";


interface FormData {
    title: string;
    description: string;
    image: File | null;
}

interface UsePostHandlersParams {
    reset: UseFormReset<FormData>;
    trigger: UseFormTrigger<FormData>;
    setValue?: (name: keyof FormData, value: any) => void;
    oldPostId?: string; // Добавляем старый ID поста
}

export const usePostHandlers = ({ reset, trigger, setValue, oldPostId = "" }: UsePostHandlersParams) => {

    const [createPostMutation] = useMutation(CREATE_POST);
    const [deletePostMutation] = useMutation(DELETE_POST);

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        ImageService.handleDrop(event, async (file) => {
            imageVar(file);
            ImageService.generatePreview(file, (preview) => previewVar(preview));

            try {
                if (setValue) { // Проверяем, что setValue определён
                    setValue("image", file); // Устанавливаем файл в useForm
                    const isValid = await trigger("image");
                    if (!isValid) console.error("Валидация изображения не прошла.");
                } else {
                    console.warn("setValue не передан в usePostHandlers");
                }
            } catch (error) {
                console.error("Ошибка при вызове trigger:", error);
            }
        });
    };


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        ImageService.handleFileChange(event, (file) => {
            if (!file) {
                console.error("Ошибка: Файл не был получен.");
                return;
            }
            imageVar(file);
            previewVar(URL.createObjectURL(file));
        });
    };

    const handleCancel = () => {
        reset({ title: "", description: "", image: null });
        imageVar(null);
        previewVar(null);
        titleVar("");
        descriptionVar("");
    };

    const onSubmit = async () => {
        try {
            if (!imageVar()) {
                console.error("Ошибка: изображение не загружено.");
                return;
            }

            if (descriptionVar().length < 40) {
                console.error("Ошибка: Описание должно содержать минимум 40 символов.");
                return;
            }

            // 1. Удаляем старый пост, если есть
            if (oldPostId) {

                const { data: deleteResponse } = await deletePostMutation({
                    variables: { input: { id: oldPostId } },
                });

                if (!deleteResponse?.postDelete?.ok) {
                    console.error("Ошибка: Не удалось удалить старый пост. Сервер вернул:", deleteResponse);
                    return;
                }

            }

            // 2. Загружаем новое изображение
            const mediaUrl = await PostUtils.uploadImageAndGetUrl(imageVar()!);

            if (!mediaUrl) {
                console.error("Ошибка загрузки изображения.");
                return;
            }

            // 3. Создаём новый пост
            const { data } = await createPostMutation({
                variables: {
                    input: {
                        title: titleVar(),
                        description: descriptionVar(),
                        mediaUrl,
                    },
                },
            });

            if (!data?.postCreate) {
                console.error("Ошибка: Пост не был создан.");
                return;
            }

            // 4. Очищаем форму после успешного создания
            handleCancel();
        } catch (error) {
            console.error("Ошибка при отправке поста:", error);
        }
    };

    return { handleDrop, handleFileChange, handleCancel, onSubmit };
};

export default usePostHandlers;
