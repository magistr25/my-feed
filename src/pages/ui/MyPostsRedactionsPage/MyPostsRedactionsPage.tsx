import './MyPostsRedactionsPage.scss';

import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button";
import uploadIcon from "@/assets/images/upload.png";
import usePostHandlers from "@/features/posts/model/hooks/usePostHandlers";
import { descriptionVar, imageVar, titleVar } from "@/app/apollo/client";
import UploadProgressBar from "@/shared/ui/UploadProgressBar/UploadProgressBar";
import useFileUpload from "@/pages/model/hooks/useFileUpload.ts";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const MyPostsRedactionsPage: FC = () => {
    const location = useLocation();
    const postData = location.state || {};
    const oldPostId = postData.postId || "";
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const { register, handleSubmit, setValue, reset, trigger } = useForm<FormData>();
    const { handleCancel, onSubmit } = usePostHandlers({
        setValue,
        reset,
        trigger,
        oldPostId
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(postData.image || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState(titleVar() || "");
    const [description, setDescription] = useState(descriptionVar() || "");
    const { uploadProgress, isUploading, handleFileUpload } = useFileUpload();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 823);
    const [hasChanges, setHasChanges] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 823);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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
        if (postData.image) {
            setPreviewImage(postData.image);
            imageVar(postData.image);
        }
    }, [postData]);
    useEffect(() => {
        const titleChanged = title !== postData.title;
        const descriptionChanged = description !== postData.description;
        const imageChanged = previewImage !== postData.image;

        setHasChanges(titleChanged || descriptionChanged || imageChanged); // Разрешаем "Отменить", если изменилось хоть одно поле
        setIsFormValid(titleChanged && descriptionChanged && imageChanged); // Разрешаем "Сохранить", только если изменены ВСЕ поля
    }, [title, description, previewImage, postData]);


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
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                titleVar(e.target.value);
                            }}
                        />
                    </div>

                    <div className="update-posts__container-add-photo"
                         onDragOver={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             e.dataTransfer.dropEffect = "copy"; // Указываем, что можно перетащить файл
                         }}
                         onDragEnter={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             e.currentTarget.classList.add("drag-over"); // Добавляем класс для стилизации
                         }}
                         onDrop={async (e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             e.currentTarget.classList.remove("drag-over"); // Убираем класс при отпускании

                             if (e.dataTransfer.files.length > 0) {
                                 const file = e.dataTransfer.files[0];
                                 setPreviewImage(null); // Убираем текущее превью перед загрузкой
                                 await handleFileUpload(file);
                                 setPreviewImage(URL.createObjectURL(file)); // Показываем загруженное изображение
                             }
                         }}>
                        <label
                            className={`update-posts__photo-label ${isUploading ? "uploading" : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isMobile) {
                                    if (!previewImage) {
                                        fileInputRef.current?.click(); // Если фото нет → сразу открываем выбор файла
                                    } else {
                                        setIsModalOpen(true); // Если фото есть → показываем модальное окно
                                    }
                                } else {
                                    fileInputRef.current?.click(); // На ПК сразу открываем выбор файла
                                }
                            }}
                        >

                        <div className="update-posts__photo-placeholder">
                                {isUploading ? (
                                    <div className="upload-placeholder">
                                        <img src={uploadIcon} alt="Upload" className="update-posts__photo-icon" />
                                        <div className="update-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                        {!isMobile && (
                                            <div className="update-posts__photo-placeholder__caption-big">
                                                <div className="update-posts__photo-placeholder__caption-gray">
                                                    Перетащите фото сюда
                                                </div>
                                                <div className="update-posts__photo-placeholder__caption-bottom">
                                                    <span className="update-posts__photo-placeholder__caption-gray">или </span>
                                                    <span>выберите фото с вашего устройства</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : previewImage ? (
                                    <img src={previewImage} alt="Preview" className="update-posts__photo-preview" />
                                ) : (
                                    <>
                                        <img src={uploadIcon} alt="Upload" className="update-posts__photo-icon" />
                                        <div className="update-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                        {!isMobile && (
                                            <div className="update-posts__photo-placeholder__caption-big">
                                                <div className="update-posts__photo-placeholder__caption-gray">
                                                    Перетащите фото сюда
                                                </div>
                                                <div className="update-posts__photo-placeholder__caption-bottom">
                                                    <span className="update-posts__photo-placeholder__caption-gray">или </span>
                                                    <span>выберите фото с вашего устройства</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </label>


                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            className="update-posts__photo-input"
                            onChange={async (e) => {
                                if (!e.target || !e.target.files || e.target.files.length === 0) return;

                                const file = e.target.files[0];
                                setPreviewImage(null); // Скрываем предыдущее изображение
                                await handleFileUpload(file); // Загружаем новое изображение
                                setPreviewImage(URL.createObjectURL(file)); // Показываем загруженное изображение
                            }}
                        />

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
                            }}
                        />
                    </div>

                    <div className="update-posts__buttons">
                        <Button type="button" text="Отменить" variant="secondary" size="small" onClick={handleCancel} isDisabled={!hasChanges}/>
                        <Button type="submit" text="Сохранить" variant="primary" size="small" isDisabled={!isFormValid}/>

                    </div>
                </form>
            </div>

            {isModalOpen && isMobile && (
                <div className="update-posts__modal-overlay">
                    <div className="update-posts__modal">
                        <div className="update-posts__modal-header">
                            <span>Изображение поста</span>
                            <button className="update-posts__modal-close" onClick={() => setIsModalOpen(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="update-posts__modal-content">
                            <button
                                onClick={() => {
                                    imageVar(null);
                                    setPreviewImage(null);
                                    setIsModalOpen(false);
                                }}
                            >
                                Удалить фото
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    fileInputRef.current?.click();
                                }}
                            >
                                Загрузить фото
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPostsRedactionsPage;
