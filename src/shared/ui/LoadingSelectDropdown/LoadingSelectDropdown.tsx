import React from 'react';
import {useSelector} from 'react-redux';

import {RootState} from "@/app/store/store";

const LoadingSelectDropdown: React.FC = () => {
    // Получаем текущую тему из Redux
    const theme = useSelector((state: RootState) => state.theme.theme);

    // Цвета для светлой и тёмной темы
    const colors = {
        light: {
            gradientStart: '#E0E0E0',
            gradientMiddle: '#F5F5F5',
            gradientEnd: '#E0E0E0',
        },
        dark: {
            gradientStart: '#333333',
            gradientMiddle: '#555555',
            gradientEnd: '#333333',
        },
    };

    const currentColors = theme === 'light' ? colors.light : colors.dark;

    return (
        <svg width="82" height="24" viewBox="0 0 82 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Прямоугольник для основного поля */}
            <rect x="4" y="2" width="49" height="14" rx="7" fill="url(#dropdownGradient)"/>

            {/* Прямоугольник для иконки */}
            <rect
                x="58.5"
                y="0.5"
                width="23"
                height="23"
                fill="url(#dropdownGradient)"
                stroke="url(#dropdownGradientStroke)"
            />

            {/* Стрелка */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M65.2302 9.20938C65.5287 8.92228 66.0035 8.93159 66.2906 9.23017L70 13.1679L73.7094 9.23017C73.9965 8.93159 74.4713 8.92228 74.7698 9.20938C75.0684 9.49647 75.0777 9.97125 74.7906 10.2698L70.5406 14.7698C70.3992 14.9169 70.204 15 70 15C69.796 15 69.6008 14.9169 69.4594 14.7698L65.2094 10.2698C64.9223 9.97125 64.9316 9.49647 65.2302 9.20938Z"
                fill="url(#dropdownGradient)"
            />

            <defs>
                {/* Градиент с движением */}
                <linearGradient id="dropdownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={currentColors.gradientStart}>
                        <animate
                            attributeName="x1"
                            values="0%;100%;0%"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                        <animate
                            attributeName="x2"
                            values="0%;100%;0%"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="100%" stopColor={currentColors.gradientEnd}>
                        <animate
                            attributeName="x1"
                            values="0%;100%;0%"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </stop>
                </linearGradient>

                {/* Градиент для обводки */}
                <linearGradient id="dropdownGradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={currentColors.gradientStart}>
                        <animate
                            attributeName="x1"
                            values="0%;100%;0%"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                        <animate
                            attributeName="x2"
                            values="0%;100%;0%"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="100%" stopColor={currentColors.gradientEnd}>
                        <animate
                            attributeName="x1"
                            values="0%;100%;0%"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </stop>
                </linearGradient>
            </defs>
        </svg>
    );
};

export default LoadingSelectDropdown;
