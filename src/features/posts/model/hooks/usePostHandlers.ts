import { ChangeEvent, DragEvent } from "react";
import { UseFormReset, UseFormTrigger } from "react-hook-form";
import { ImageService } from "@/entities/image/model/ImageService";
import { descriptionVar, imageVar, previewVar, titleVar } from "@/app/apollo/client";
import { CREATE_POST } from "@/features/posts/api/mutations/createPost";
import PostUtils from "@/features/posts/model/utils/PostUtils";
import { useMutation} from "@apollo/client";
import {usePosts} from "@/pages/model/hooks/usePosts";

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

    const [createPostMutation] = useMutation(CREATE_POST);
    const { addNewPost } = usePosts("MY");
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

            const mediaUrl = await PostUtils.uploadImageAndGetUrl(imageVar()!);
            if (!mediaUrl) {
                console.error("Ошибка загрузки изображения.");
                return;
            }

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

            addNewPost(newPost);

            handleCancel();
        } catch (error) {
            console.error("Ошибка при отправке поста:", error);
        }
    };

    return { handleDrop, handleFileChange, handleCancel, onSubmit };
};

export default usePostHandlers;
