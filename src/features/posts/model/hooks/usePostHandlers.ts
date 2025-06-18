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
        const titleValue = titleVar() || "";
        const descriptionValue = descriptionVar() || "";

        if (!titleValue.trim() && !descriptionValue.trim() && oldPostId) {
            await deletePostMutation({ variables: { input: { id: oldPostId } } });
            return;
        }

        try {
            if (!imageVar()) {
                return;
            }

            if (descriptionVar().length < 40) {
                return;
            }

            if (oldPostId) {
                await deletePostMutation({
                    variables: { input: { id: oldPostId } },
                    update(cache) {
                        cache.modify({
                            fields: {
                                posts(existingPosts = []) {
                                    if (!Array.isArray(existingPosts)) return [];
                                    return existingPosts.filter((post: any) => post.__ref !== `Post:${oldPostId}`);
                                },
                            },
                        });
                    },
                });
            }

            const mediaUrl = await PostUtils.uploadImageAndGetUrl(imageVar()!);
            if (!mediaUrl) {
                console.error("Ошибка загрузки изображения.");
                return;
            }

            await createPostMutation({
                variables: {
                    input: {
                        title: titleVar(),
                        description: descriptionVar(),
                        mediaUrl,
                    },
                },
            });

            notificationVar({ message: message, type: "success" });

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
