import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import "./AvatarUpload.scss";
import DefaultAvatar from "@/shared/ui/DefaultAvatar/DefaultAvatar.tsx";
import ReactDOM from "react-dom";

interface AvatarUploadProps {
    userAvatarUrl?: string | null;
    onAvatarChange: (file: File | null) => void;
}

const AvatarUpload: FC<AvatarUploadProps> = ({ userAvatarUrl, onAvatarChange }) => {
    const [preview, setPreview] = useState<string | null>(userAvatarUrl ?? null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setPreview(userAvatarUrl ?? null);
    }, [userAvatarUrl]);

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Сразу отображаем локальное превью
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);

            // Передаём файл родителю
            onAvatarChange(file);
        }
    };

    return (
        <div className="avatar-upload">
            <div className="avatar-upload__preview" onClick={() => setIsModalOpen(true)}>
                {preview ? <img src={preview} alt="User avatar" /> : <DefaultAvatar variant="profile" />}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
            />

            {isModalOpen &&
                ReactDOM.createPortal(
                    <div className="modal-overlay-profile" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-overlay-profile__content" onClick={(e) => e.stopPropagation()}>
                            <h2 className="modal-overlay-profile__title">Аватар профиля</h2>
                            <button onClick={() => {
                                setPreview(null);
                                onAvatarChange(null);
                            }}>Удалить фото</button>
                            <button className="last-button" onClick={openFileDialog}>Загрузить фото</button>
                            <button className="modal-overlay-profile__close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                    </div>,
                    document.getElementById("modal-root")!
                )}
        </div>
    );
};

export default AvatarUpload;

