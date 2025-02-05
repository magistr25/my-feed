import './MyPostsPage.scss';

import { FC, useRef } from "react";
import { Link } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button.tsx";
import uploadIcon from "@/assets/images/upload.png";
import { usePostHandlers } from "@/features/posts/model/hooks/usePostHandlers";
import { imageVar, titleVar, descriptionVar, previewVar } from "@/app/apollo/client";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const MyPostsPage: FC = () => {
    const { register, handleSubmit, reset, trigger } = useForm<FormData>({
        defaultValues: {
            title: titleVar(),
            description: descriptionVar(),
            image: imageVar(),
        }
    });

    const { handleDrop, handleFileChange, handleCancel, onSubmit } = usePostHandlers({ reset, trigger });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageFile = useReactiveVar(imageVar);
    const previewImage = useReactiveVar(previewVar);
    const title = useReactiveVar(titleVar);
    const description = useReactiveVar(descriptionVar);
    const isFormValid = title && description && imageFile;

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
                               {...register("title", { required: true })}
                               value={title}
                               onChange={(e) => titleVar(e.target.value)} />
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
                                   onChange={handleFileChange} capture="environment" />
                            <div className="add-posts__photo-placeholder">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="add-posts__photo-preview" />
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
                    </div>

                    <div className="add-posts__textarea-wrapper">
                        <p className="add-posts__label_description">Описание</p>
                        <textarea className="add-posts__input" placeholder="Введите описание"
                                  {...register("description", { required: true })}
                                  value={description}
                                  onChange={(e) => descriptionVar(e.target.value)} />
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
