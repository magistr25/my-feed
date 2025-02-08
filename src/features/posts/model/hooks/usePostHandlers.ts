import { ChangeEvent, DragEvent } from "react";
import { UseFormReset, UseFormTrigger } from "react-hook-form";
import { ImageService } from "@/entities/image/model/ImageService";
import {descriptionVar, imageVar, notificationVar, previewVar, titleVar} from "@/app/apollo/client";
import { CREATE_POST } from "@/features/posts/api/mutations/createPost";
import PostUtils from "@/features/posts/model/utils/PostUtils";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "@/features/posts/api/mutations/deletePost";
import {useNavigate} from "react-router-dom";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

interface UsePostHandlersParams {
    reset: UseFormReset<FormData>;
    trigger: UseFormTrigger<FormData>;
    setValue?: (name: keyof FormData, value: any) => void;
    oldPostId?: string;
}

export const usePostHandlers = ({ reset, trigger, setValue, oldPostId = "" }: UsePostHandlersParams) => {
    const [createPostMutation] = useMutation(CREATE_POST);
    const [deletePostMutation] = useMutation(DELETE_POST);
    const navigate = useNavigate();

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        ImageService.handleDrop(event, async (file) => {
            imageVar(file);
            ImageService.generatePreview(file, (preview) => previewVar(preview));

            if (setValue) {
                setValue("image", file);
                await trigger("image");
            }
        });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        ImageService.handleFileChange(event, (file) => {
            if (!file) return;
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

    const onSubmit = async (message: string) => {
        try {
            if (!imageVar()) {
                console.error("Ошибка: изображение не загружено.");
                return;
            }

            if (descriptionVar().length < 40) {
                console.error("Ошибка: Описание должно содержать минимум 40 символов.");
                return;
            }

            // Удаляем старый пост, если редактируем
            if (oldPostId) {
                await deletePostMutation({
                    variables: { input: { id: oldPostId } },
                    update(cache) {
                        cache.modify({
                            fields: {
                                posts(existingPosts = []) {  // Гарантируем, что existingPosts - это массив
                                    if (!Array.isArray(existingPosts)) return [];
                                    return existingPosts.filter((post: any) => post.__ref !== `Post:${oldPostId}`);
                                },
                            },
                        });
                    },
                });
            }

            // Загружаем новое изображение
            const mediaUrl = await PostUtils.uploadImageAndGetUrl(imageVar()!);
            if (!mediaUrl) {
                console.error("Ошибка загрузки изображения.");
                return;
            }

            // Создаём оптимистичный пост
            const optimisticPost = {
                __typename: "Post",
                id: `temp-${Date.now()}`,
                title: titleVar(),
                description: descriptionVar(),
                mediaUrl,
            };

            // Отправляем мутацию создания поста
            await createPostMutation({
                variables: {
                    input: {
                        title: titleVar(),
                        description: descriptionVar(),
                        mediaUrl,
                    },
                },
                optimisticResponse: {
                    __typename: "Mutation",
                    postCreate: optimisticPost,
                },
                update(cache, { data }) {
                    if (data?.postCreate) {
                        cache.modify({
                            fields: {
                                posts(existingPosts = []) {  // Проверяем, что это массив
                                    if (!Array.isArray(existingPosts)) return [data.postCreate];
                                    return [...existingPosts, data.postCreate];
                                },
                            },
                        });
                    }
                },
            });

            // Уведомление об успешном сохранении
            notificationVar({ message: message, type: "success" });

            // Даем время на отображение уведомления
            setTimeout(() => {
                navigate("/my-posts/view");
                handleCancel();
            }, 300);

        } catch (error) {
            console.error("Ошибка при отправке поста:", error);
            notificationVar({ message: "Ошибка при сохранении", type: "error" });
        }
    };





    return { handleDrop, handleFileChange, handleCancel, onSubmit };
};

export default usePostHandlers;
