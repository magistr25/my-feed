import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store/store";

const AnimatedAvatar: React.FC = () => {

    const theme = useSelector((state: RootState) => state.theme.theme);

    const colors = {
        light: {
            gradientStart: "#E0E0E0",
            gradientMiddle: "#F5F5F5",
            gradientEnd: "#E0E0E0",
        },
        dark: {
            gradientStart: "#333333",
            gradientMiddle: "#555555",
            gradientEnd: "#333333",
        },
    };

    const currentColors = theme === "light" ? colors.light : colors.dark;

    return (
        <svg width="209" height="44" viewBox="0 0 209 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Круг (аватар) */}
            <circle
                cx="28"
                cy="22"
                r="18.6262"
                fill="url(#avatarGradient)"
            />
            {/* Квадрат */}
            <rect
                x="176.5"
                y="10.5"
                width="23"
                height="23"
                fill="url(#avatarGradient)"
            />
            {/* Прямоугольник */}
            <rect x="51" y="12" width="123" height="14" rx="7" fill="url(#avatarGradient)" />

            <defs>
                {/* Градиент для всех элементов */}
                <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={currentColors.gradientStart} />
                    <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                        <animate
                            attributeName="offset"
                            values="0%;100%"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="100%" stopColor={currentColors.gradientEnd} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default AnimatedAvatar;
