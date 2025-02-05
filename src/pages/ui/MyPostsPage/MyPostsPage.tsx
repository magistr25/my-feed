import './MyPostsPage.scss';

import {FC, useRef, useState, useEffect, DragEvent, ChangeEvent} from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button.tsx";
import uploadIcon from "@/assets/images/upload.png";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const MAX_WIDTH = 663;
const MAX_HEIGHT = 346;

const MyPostsPage: FC = () => {
    const { register, handleSubmit, watch, setValue, trigger, reset } = useForm<FormData>({
        defaultValues: {
            title: "",
            description: "",
            image: null,
        }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const imageFile = watch("image") as File | null;
    const isFormValid = watch("title") && watch("description") && imageFile;

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        let width = img.width;
                        let height = img.height;
                        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                        width *= ratio;
                        height *= ratio;

                        canvas.width = width;
                        canvas.height = height;
                        ctx?.drawImage(img, 0, 0, width, height);
                        setPreview(canvas.toDataURL("image/png"));
                    } else {
                        setPreview(img.src);
                    }
                };
            };
            reader.readAsDataURL(imageFile);
        }
    }, [imageFile]);


    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        let file: File | null = null;

        // Используем dataTransfer.files (Opera иногда не поддерживает items)
        if (event.dataTransfer.files.length > 0) {
            file = event.dataTransfer.files[0];
        }

        // Если файл не получен, пробуем через dataTransfer.items
        if (!file && event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            const item = event.dataTransfer.items[0];

            if (item.kind === "file") {
                file = item.getAsFile();
            }
        }

        if (!file) {
            console.error("Opera блокирует доступ к файлу!");
            return;
        }

        if (!file.type.startsWith("image/")) {
            console.error("Выбранный файл не является изображением.");
            return;
        }

        // Устанавливаем в useForm
        setValue("image", file, { shouldValidate: true, shouldDirty: true });

        // Обновляем превью
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);

        await trigger("image");
    };


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];

            if (!file.type.startsWith("image/")) {
                console.error("Выбранный файл не является изображением.");
                return;
            }

            // Устанавливаем значение в useForm
            setValue("image", file, { shouldValidate: true, shouldDirty: true });

            // Обновляем превью
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);

        }
    };

    const handleCancel = () => {
        // Очищаем форму полностью
        reset({
            title: "",
            description: "",
            image: null
        });

        // Убираем превью
        setPreview(null);
    };


    const onSubmit = (data: FormData) => {
        console.log("Отправка поста: ", data);
        // Логика отправки данных на сервер
    };

    return (
        <div className="add-posts__wrapper">
            <div className="add-posts__navigate-wrapper">
                <Link className="add-posts__navigate" to="/my-posts">← Мои посты</Link>
            </div>
            <div className="add-posts__page">
                <Link className="add-posts__navigate_mobile" to="/my-posts">← Мои посты</Link>
                <form className="add-posts__container" onSubmit={handleSubmit(onSubmit)}>
                    <div className="add-posts__container-title">Создание поста</div>

                    <div className="add-posts__container-add-title">
                        <p className="add-posts__label">Заголовок</p>
                        <input type="text" className="add-posts__input" placeholder="Введите название поста"
                               {...register("title", { required: true })} />
                    </div>

                    <div className="add-posts__container-add-photo"
                         onDragOver={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             e.dataTransfer.dropEffect = "copy";
                         }}

                         onDrop={handleDrop}>
                        <label className="add-posts__photo-label">
                            <input type="file" ref={fileInputRef} accept="image/*" className="add-posts__photo-input"
                                   onChange={handleFileChange}   capture="environment" />
                            <div className="add-posts__photo-placeholder">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="add-posts__photo-preview" />
                                ) : (
                                    <>
                                        <img src={uploadIcon} alt="Upload" className="add-posts__photo-icon" />
                                        <div className="add-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                        <div className="add-posts__photo-placeholder__caption-big">
                                            <div className="add-posts__photo-placeholder__caption-gray">
                                                Перетащите фото сюда
                                            </div>
                                            <div className="add-posts__photo-placeholder__caption-bottom">
                                                <span className="add-posts__photo-placeholder__caption-gray">или </span>
                                                <span>выберите фото с вашего компьютера</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </label>

                    </div>

                    <div className="add-posts__textarea-wrapper">
                        <p className="add-posts__label_description">Описание</p>
                        <textarea className="add-posts__input" placeholder="Введите описание"
                                  {...register("description", { required: true })} />
                    </div>

                    <div className="add-posts__buttons">
                        <Button type="button" text="Отменить" variant="secondary" size="small" onClick={handleCancel}/>
                        <Button type="submit" text="Сохранить" variant="primary" size="small" isDisabled={!isFormValid} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyPostsPage;
