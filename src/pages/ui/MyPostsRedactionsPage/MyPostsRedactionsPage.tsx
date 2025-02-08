import './MyPostsRedactionsPage.scss';

import { FC, useEffect, useRef, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button.tsx";
import uploadIcon from "@/assets/images/upload.png";
import usePostHandlers from "@/features/posts/model/hooks/usePostHandlers";
import {descriptionVar, imageVar, titleVar} from "@/app/apollo/client.ts";
import UploadProgressBar from "@/shared/ui/UploadProgressBar/UploadProgressBar.tsx";
import useFileUpload from "@/pages/model/hooks/useFileUpload.ts";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const MyPostsRedactionsPage: FC = () => {
    const location = useLocation();
    const postData = location.state || {}; // Получаем переданные данные
    const oldPostId = postData.postId || "";
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const { register, handleSubmit, setValue, reset, trigger } = useForm<FormData>();
    const { handleCancel, onSubmit  } = usePostHandlers({
        setValue,
        reset,
        trigger,
        oldPostId});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(postData.image || null);

    const [title, setTitle] = useState(titleVar() || "");
    const [description, setDescription] = useState(descriptionVar() || "");
    const { uploadProgress, isUploading, handleFileUpload } = useFileUpload();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (postData.title) {
            setTitle(postData.title);
            titleVar(postData.title);
        }
        if (postData.description) {
            setDescription(postData.description);
            descriptionVar(postData.description);
        }
    }, [postData]);

    useEffect(() => {
        if (postData.title) {
            setValue("title", postData.title);
            titleVar(postData.title);
        }
        if (postData.description) {
            setValue("description", postData.description);
            descriptionVar(postData.description); // Обновляем глобальное состояние Apollo
        }
        if (postData.image) {
            setPreviewImage(postData.image);
            imageVar(postData.image);
        }

        console.log("Обновлённое состояние descriptionVar():", descriptionVar());
    }, [postData, setValue]);
    const adjustHeight = () => {
        if (textAreaRef.current) {
            const maxHeight = window.innerWidth > 823 ? 110 : 198;
            textAreaRef.current.style.height = "auto"; // Сбрасываем высоту
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, maxHeight)}px`;
        }
    };

// Устанавливаем начальную высоту сразу после монтирования
    useEffect(() => {
        adjustHeight();
    }, []);

// Обновляем высоту при изменении текста
    useEffect(() => {
        adjustHeight();
    }, [description]);

    useEffect(() => {
        return () => {
            reset({ title: "", description: "", image: null }); // Очищаем форму
            titleVar(""); // Очищаем глобальные переменные
            descriptionVar("");
            imageVar(null);
        };
    }, []);


    return (
        <div className="update-posts__wrapper">
            <div className="update-posts__navigate-wrapper">
                <Link className="update-posts__navigate" to="/my-posts/view">← Мои посты</Link>
            </div>
            <div className="update-posts__page">
                <Link className="add-posts__navigate_mobile" to="/my-posts/view">← Мои посты</Link>
                <form className="update-posts__container" onSubmit={handleSubmit(() => onSubmit('Изменения успешно сохранены'))}>
                    <div className="update-posts__container-title">
                        {postData.title ? "Редактирование поста" : "Создание поста"}
                    </div>

                    <div className="update-posts__container-add-title">
                        <p className="update-posts__label">Заголовок</p>
                        <input
                            type="text"
                            className="update-posts__input"
                            placeholder="Придумайте название для своего поста"
                            {...register("title", { required: true })}
                            value={title}  // Используем локальное состояние
                            onChange={(e) => {
                                setTitle(e.target.value); // Обновляем `useState`
                                titleVar(e.target.value); // Обновляем Apollo Cache
                            }}
                        />
                    </div>

                    <div
                        className="update-posts__container-add-photo"
                        onDragOver={(e) => {
                            e.preventDefault(); // Убираем дефолтное поведение браузера
                            e.stopPropagation();
                            e.dataTransfer.dropEffect = "copy";
                        }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (e.dataTransfer.files.length > 0) {
                                const file = e.dataTransfer.files[0];

                                setPreviewImage(null); // Очищаем превью перед загрузкой
                                await handleFileUpload(file); // Ждём завершения загрузки
                                setPreviewImage(URL.createObjectURL(file)); // Показываем загруженное изображение
                            }
                        }}
                    >
                        <label className={`update-posts__photo-label ${isUploading ? "uploading" : ""}`}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="update-posts__photo-input"
                                onChange={async (e) => {
                                    if (!e.target.files) return;

                                    // Начинаем загрузку, скрываем превью
                                    const file = e.target.files[0];
                                    setPreviewImage(null);
                                    await handleFileUpload(file); // Дожидаемся завершения загрузки

                                    // Показываем изображение после загрузки
                                    setPreviewImage(URL.createObjectURL(file));
                                }}
                            />

                            <div className="update-posts__photo-placeholder">
                                {isUploading ? (
                                    <div className="upload-placeholder">
                                        <img src={uploadIcon} alt="Upload" className="update-posts__photo-icon" />
                                        <div className="update-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                        <div className="update-posts__photo-placeholder__caption-big">
                                            <div className="update-posts__photo-placeholder__caption-gray">
                                                Перетащите фото сюда
                                            </div>
                                            <div className="update-posts__photo-placeholder__caption-bottom">
                                                <span className="update-posts__photo-placeholder__caption-gray">или </span>
                                                <span>выберите фото с вашего устройства</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : previewImage ? (
                                    <img src={previewImage} alt="Preview" className="update-posts__photo-preview" />
                                ) : (
                                    <>
                                        <img src={uploadIcon} alt="Upload" className="update-posts__photo-icon" />
                                        <div className="update-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                        <div className="update-posts__photo-placeholder__caption-big">
                                            <div className="update-posts__photo-placeholder__caption-gray">
                                                Перетащите фото сюда
                                            </div>
                                            <div className="update-posts__photo-placeholder__caption-bottom">
                                                <span className="update-posts__photo-placeholder__caption-gray">или </span>
                                                <span>выберите фото с вашего устройства</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </label>
                        <UploadProgressBar progress={uploadProgress} isVisible={isUploading} />
                    </div>

                    <div className="update-posts__textarea-wrapper">
                        <p className="update-posts__label_description">Описание</p>
                        <textarea
                            className="update-posts__input"
                            placeholder="Придумайте описание для своего поста"
                            {...register("description", { required: true })}
                            ref={textAreaRef}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setValue("description", e.target.value);
                                descriptionVar(e.target.value);
                                adjustHeight(); // Корректируем высоту при каждом изменении
                            }}
                        />
                    </div>

                    <div className="update-posts__buttons">
                        <Button type="button" text="Отменить" variant="secondary" size="small" onClick={handleCancel} />
                        <Button type="submit" text="Сохранить" variant="primary" size="small" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyPostsRedactionsPage;
