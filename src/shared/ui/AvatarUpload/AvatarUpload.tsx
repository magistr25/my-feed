import {ChangeEvent, FC, useState} from "react";
import "./AvatarUpload.scss";
import DefaultAvatar from "@/shared/ui/DefaultAvatar/DefaultAvatar.tsx";

interface AvatarUploadProps {
    userAvatarUrl?: string;
    onAvatarChange: (avatar: string) => void;
}

const AvatarUpload: FC<AvatarUploadProps> = ({ userAvatarUrl, onAvatarChange }) => {
    const [avatar, setAvatar] = useState<string | null>(userAvatarUrl || null);

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatar(base64String);
                onAvatarChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const displayAvatar = avatar ? (
        <img src={avatar} alt="User avatar" />
    ) : (
        <DefaultAvatar />
    );

    return (
        <div className="avatar-upload">
            <div className="avatar-upload__preview">
                {displayAvatar}
            </div>
            <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="avatar-upload__input"
                onChange={handleAvatarChange}
            />
        </div>
    );
};

export default AvatarUpload;
