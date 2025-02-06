import { ChangeEvent, DragEvent } from "react";
import { UseFormReset, UseFormTrigger } from "react-hook-form";
import { ImageService } from "@/entities/image/model/ImageService";
import { descriptionVar, imageVar, previewVar, titleVar } from "@/app/apollo/client";
import { useApolloClient, useMutation } from "@apollo/client";
import { CREATE_POST } from "@/features/posts/api/mutations/createPost.ts";
import PostUtils from "@/features/posts/model/utils/PostUtils.ts";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

interface UsePostHandlersParams {
    reset: UseFormReset<FormData>;
    trigger: UseFormTrigger<FormData>;
}

export const usePostHandlers = ({ reset, trigger }: UsePostHandlersParams) => {
    const client = useApolloClient(); // Доступ к Apollo Cache
    const [createPostMutation] = useMutation(CREATE_POST);

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        ImageService.handleDrop(event, async (file) => {
            imageVar(file);
            ImageService.generatePreview(file, (preview) => previewVar(preview));

            try {
                const isValid = await trigger("image");
                if (!isValid) console.error("Валидация изображения не прошла.");
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

            console.log("📸 Загружаем изображение:", imageVar()?.name);

            const mediaUrl = await PostUtils.uploadImageAndGetUrl(imageVar()!);
            if (!mediaUrl) {
                console.error("Ошибка загрузки изображения.");
                return;
            }

            // Отправляем мутацию создания поста
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

            const newPost = data.postCreate;

            // Обновляем кеш Apollo после создания поста
            client.cache.modify({
                fields: {
                    posts(existingPosts = []) { // Если undefined, заменяем пустым массивом
                        if (!Array.isArray(existingPosts)) {
                            return [newPost]; // Создаем новый массив с одним постом
                        }
                        return [newPost, ...existingPosts]; // Добавляем новый пост в начало списка
                    },
                },
            });
            handleCancel();
        } catch (error) {
            console.error("Ошибка при отправке поста:", error);
        }
    };

    return { handleDrop, handleFileChange, handleCancel, onSubmit };
};

export default usePostHandlers;
