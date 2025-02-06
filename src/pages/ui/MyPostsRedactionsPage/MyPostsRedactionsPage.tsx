import './MyPostsRedactionsPage.scss';

import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button.tsx";
import uploadIcon from "@/assets/images/upload.png";
import usePostHandlers from "@/features/posts/model/hooks/usePostHandlers";
import {descriptionVar, imageVar, titleVar} from "@/app/apollo/client.ts";

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const MyPostsRedactionsPage: FC = () => {
    const location = useLocation();
    const postData = location.state || {}; // Получаем переданные данные
    const oldPostId = postData.postId || "";

    const { register, handleSubmit, setValue, reset, trigger } = useForm<FormData>();
    const { handleDrop, handleFileChange, handleCancel, onSubmit  } = usePostHandlers({
        setValue,
        reset,
        trigger,
        oldPostId});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string>(postData.image || "");
    const [title, setTitle] = useState(titleVar() || "");
    const [description, setDescription] = useState(descriptionVar() || "");

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


    return (
        <div className="update-posts__wrapper">
            <div className="update-posts__navigate-wrapper">
                <Link className="update-posts__navigate" to="/my-posts/view">← Мои посты</Link>
            </div>
            <div className="update-posts__page">
                <form className="update-posts__container" onSubmit={handleSubmit(onSubmit)}>
                    <div className="update-posts__container-title">
                        {postData.title ? "Редактирование поста" : "Создание поста"}
                    </div>

                    <div className="update-posts__container-add-title">
                        <p className="update-posts__label">Заголовок</p>
                        <input
                            type="text"
                            className="update-posts__input"
                            placeholder="Введите название поста"
                            {...register("title", { required: true })}
                            value={title}  // Используем локальное состояние
                            onChange={(e) => {
                                setTitle(e.target.value); // Обновляем `useState`
                                titleVar(e.target.value); // Обновляем Apollo Cache
                            }}
                        />
                    </div>

                    <div
                        className="update__container-add-photo"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.dataTransfer.dropEffect = "copy";
                        }}
                        onDrop={(e) => {
                            handleDrop(e);
                        }}
                    >
                        <label className="update-posts__photo-label">
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="update-posts__photo-input"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    e.target.files && setPreviewImage(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                            <div className="update-posts__photo-placeholder">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="update-posts__photo-preview" />
                                ) : (
                                    <>
                                        <img src={uploadIcon} alt="Upload" className="update-posts__photo-icon" />
                                        <div className="update-posts__photo-placeholder__caption">Загрузите или сделайте фото</div>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className="update__textarea-wrapper">
                        <p className="update-posts__label_description">Описание</p>
                        <textarea
                            className="update-posts__input"
                            placeholder="Введите описание"
                            {...register("description", { required: true })}
                            value={description}  // Используем локальное состояние
                            onChange={(e) => {
                                setDescription(e.target.value); // Обновляем `useState`
                                descriptionVar(e.target.value); // Обновляем Apollo Cache
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
