import './MyPostsPage.scss';

import {ChangeEvent, FC, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Button from "@/shared/ui/Button/Button.tsx";
import uploadIcon from "@/assets/images/upload.png";

const MyPostsPage: FC = () => {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);

        // Автоматическое изменение высоты
        if (textareaRef.current) {
            textareaRef.current.style.height = "44px";
            const newHeight = Math.min(textareaRef.current.scrollHeight, 198);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    };
    return (
        <div className="add-posts__wrapper">
            <div className="add-posts__navigate-wrapper">
                <Link className="add-posts__navigate" to="/my-posts">
                    ← Мои посты
                </Link>
            </div>
            <div className="add-posts__page">
                <Link className="add-posts__navigate_mobile" to="/my-posts">
                    ← Мои посты
                </Link>
                <div className="add-posts__container">
                    <div className="add-posts__container-title">
                        Создание поста
                    </div>

                    <div className="add-posts__container-add-title">
                        <p className="add-posts__label">Заголовок</p>
                        <input
                            type="text"
                            className="add-posts__input"
                            placeholder="Придумайте название для своего поста"
                        />
                    </div>

                    {/* Фото */}
                    <div className="add-posts__container-add-photo">
                        <label className="add-posts__photo-label">
                            <input type="file" className="add-posts__photo-input" accept="image/*"/>
                            <div className="add-posts__photo-placeholder">
                                <img src={uploadIcon} alt="Upload" className="add-posts__photo-icon"/>
                                <div
                                    className="add-posts__photo-placeholder__caption">Загрузите или сделайте фото
                                </div>
                                <div
                                    className="add-posts__photo-placeholder__caption-big">
                                    <div className="add-posts__photo-placeholder__caption-gray">
                                        Перетащите фото сюда
                                    </div>
                                    <div className="add-posts__photo-placeholder__caption-bottom">
                                        <span className="add-posts__photo-placeholder__caption-gray">или </span>
                                        <span>выберите фото с вашего компьютера</span>
                                        </div>
                                    </div>
                            </div>
                        </label>
                    </div>

                    {/* Описание */}
                    <div className="add-posts__textarea-wrapper">
                        <p className="add-posts__label_description">Описание</p>
                        <textarea
                            ref={textareaRef}
                            className="add-posts__input"
                            placeholder="Придумайте описание для своего поста"
                            value={text}
                            onChange={handleInput}
                        />
                    </div>
                </div>

                {/* Кнопки */}
                <div className="add-posts__buttons">
                    <Button
                        type="button"
                        text="Отменить"
                        variant="secondary"
                        size="small"
                        autoFocus={false}
                    />
                    <Button
                        type="submit"
                        onClick={() => {
                            console.log('qwerty')
                        }}
                        text="Сохранить"
                        variant="primary"
                        size="small"
                    />
                </div>
            </div>
        </div>
    );
};

export default MyPostsPage;
