import { FC } from "react";
import { useSelector } from "react-redux";

import { selectTheme } from "@/app/store/ducks/theme";
import defaultAvatar from "@/assets/images/default_avatar.png";
import defaultAvatarDark from "@/assets/images/default_avatar_dark.png";
import profileDefaultAvatar from "@/assets/images/default_avatar_1.png";
import profileDefaultAvatarDark from "@/assets/images/profile_default_avatar_dark_1.png";

interface DefaultAvatarProps {
    variant?: "profile" | "general";
}

const DefaultAvatar: FC<DefaultAvatarProps> = ({ variant = "general" }) => {
    const currentTheme = useSelector(selectTheme);

    // Выбор аватара в зависимости от темы и типа компонента
    const avatarSrc =
        variant === "profile"
            ? currentTheme === "dark"
                ? profileDefaultAvatarDark
                : profileDefaultAvatar
            : currentTheme === "dark"
                ? defaultAvatarDark
                : defaultAvatar;

    return (
        <img
            src={avatarSrc}
            alt="Default avatar"
            width="40"
            height="40"
            style={{ borderRadius: "50%" }}
        />
    );
};

export default DefaultAvatar;

