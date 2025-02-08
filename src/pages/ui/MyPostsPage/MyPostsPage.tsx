import './MyPostsPage.scss';

import {ChangeEvent, FC, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button.tsx";
import uploadIcon from "@/assets/images/upload.png";
import { imageVar, titleVar, descriptionVar } from "@/app/apollo/client";
import usePostHandlers from "@/features/posts/model/hooks/usePostHandlers";
import useFileUpload from "@/pages/model/hooks/useFileUpload.ts";
import UploadProgressBar from "@/shared/ui/UploadProgressBar/UploadProgressBar.tsx";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const MyPostsPage: FC = () => {
    const { register, handleSubmit, reset, trigger, setValue } = useForm<FormData>();
    const { handleFileChange, handleCancel, onSubmit } = usePostHandlers({ reset, trigger });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageFile = useReactiveVar(imageVar);
    const title = useReactiveVar(titleVar);
    const description = useReactiveVar(descriptionVar);
    const isFormValid = title && description && imageFile;

    // Состояние для изменения фона
    const { uploadProgress, isUploading, handleFileUpload, previewUrl } = useFileUpload();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        return () => {
            reset({ title: "", description: "", image: null }); // Очищаем форму
            titleVar(""); // Очищаем глобальные переменные
            descriptionVar("");
            imageVar(null);
        };
    }, []);

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = "auto"; // Сброс высоты перед пересчётом
        textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем новую высоту
        setValue("description", textarea.value);
        descriptionVar(textarea.value);
    };

    const isFormEmpty = !title.trim() && !description.trim() && !imageFile;

    return (
        <div className="add-posts__wrapper">
            <div className="add-posts__navigate-wrapper">
                <Link className="add-posts__navigate" to="/my-posts/view">← Мои посты</Link>
            </div>
            <div className="add-posts__page">
                <Link className="add-posts__navigate_mobile" to="/my-posts/view">← Мои посты</Link>
                <form className="add-posts__container" onSubmit={handleSubmit(onSubmit)}>
                    <div className="add-posts__container-title">Создание поста</div>

                    <div className="add-posts__container-add-title">
                        <p className="add-posts__label">Заголовок</p>
                        <input type="text" className="add-posts__input" placeholder="Придумайте название для своего поста"
                               {...register("title", { required: true })}
                               value={title}
                               onChange={(e) => {
                                   setValue("title", e.target.value);
                                   titleVar(e.target.value); // Записываем в Apollo Cache
                               }} />
                    </div>

                    <div className="add-posts__container-add-photo"
                         onDragOver={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             e.dataTransfer.dropEffect = "copy";
                         }}
                         onDrop={async (e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             if (e.dataTransfer.files.length > 0) {
                                 await handleFileUpload(e.dataTransfer.files[0]); // Передаем `File`
                             }
                         }}>
                        <label className={`add-posts__photo-label ${isUploading ? "uploading" : ""}`}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="add-posts__photo-input"
                                onChange={async (e) => {
                                    handleFileChange(e);
                                    if (e.target.files) {
                                        await handleFileUpload(e); // Дожидаемся завершения загрузки
                                    }
                                }}
                                capture="environment"
                            />
                            <div className="add-posts__photo-placeholder">
                                {isUploading ? (
                                    <div className="upload-placeholder">
                                        <img src={uploadIcon} alt="Upload" className="add-posts__photo-icon" />
                                        <div className="add-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                        <div className="add-posts__photo-placeholder__caption-big">
                                            <div className="add-posts__photo-placeholder__caption-gray">
                                                Перетащите фото сюда
                                            </div>
                                            <div className="add-posts__photo-placeholder__caption-bottom">
                                                <span className="add-posts__photo-placeholder__caption-gray">или </span>
                                                <span>выберите фото с вашего устройства</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="add-posts__photo-preview" />
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
                                                <span>выберите фото с вашего устройства</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </label>
                        <UploadProgressBar progress={uploadProgress} isVisible={isUploading} />
                    </div>

                    <div className="add-posts__textarea-wrapper">
                        <p className="add-posts__label_description">Описание</p>
                        <textarea className="add-posts__input" placeholder="Придумайте описание для своего поста"
                                  {...register("description", { required: true })}
                                  value={description}
                                  onInput={handleInput} />
                    </div>

                    <div className="add-posts__buttons">
                        <Button type="button" text="Отменить" variant="secondary" size="small" onClick={handleCancel} isDisabled={isFormEmpty}/>
                        <Button type="submit" text="Сохранить" variant="primary" size="small" isDisabled={!isFormValid} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyPostsPage;
