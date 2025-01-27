import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store/store";

const LoadingPost: React.FC = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);

    // Цвета для тем
    const colors = {
        light: {
            gradientStart: "#E0E0E0",
            gradientMiddle: "#F5F5F5",
            gradientEnd: "#E0E0E0",
        },
        dark: {
            gradientStart: "#3A3A3A",
            gradientMiddle: "#555555",
            gradientEnd: "#3A3A3A",
        },
    };

    const currentColors = theme === "dark" ? colors.dark : colors.light;

    // Мобильная версия
    const isMobile = window.innerWidth <= 630;

    return (
        <>
            {isMobile ? (
                <svg
                    width="100%"
                    viewBox="0 0 343 474"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    style={{ height: "auto", maxHeight: "584px" }}
                >
                    {/* Круг (аватар) */}
                    <circle
                        cx="40"
                        cy="40"
                        r="20"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                        strokeWidth="0.786885"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Прямоугольники (заголовок и текст) */}
                    <rect x="68" y="25" width="126" height="14" rx="7" fill="url(#youtubeGradient)"/>
                    <rect x="68" y="48" width="68" height="12.25" rx="6.125" fill="url(#youtubeGradient)"/>
                    <rect x="16" y="84" width="296" height="14" rx="7" fill="url(#youtubeGradient)"/>

                    {/* Основной блок поста (адаптивный) */}
                    <rect
                        x="16.5"
                        y="116.5"
                                                rx="17.5"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                        style={{ width: "calc(100% - 33px)", height: "calc(40%)" }} // Адаптивная ширина
                    />

                    {/* Текстовые блоки под постом */}
                    <rect x="16" y="340" width="311" height="14" rx="7" fill="url(#youtubeGradient)"/>
                    <rect x="16" y="360" width="311" height="14" rx="7" fill="url(#youtubeGradient)"/>

                    {/* Иконки (лайк, комментарий, репост) */}
                    <rect
                        x="16.5"
                        y="426.5"
                        width="23"
                        height="23"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                    />
                    <rect
                        x="51"
                        y="426.5"
                        width="23"
                        height="23"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                    />


                    <defs>
                        {/* Градиент с переливами */}
                        <linearGradient id="youtubeGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor={currentColors.gradientStart}/>
                            <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                                <animate
                                    attributeName="offset"
                                    values="0%;100%"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </stop>
                            <stop offset="100%" stopColor={currentColors.gradientEnd}/>
                        </linearGradient>

                        {/* Градиент для обводки */}
                        <linearGradient id="youtubeGradientStroke" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor={currentColors.gradientStart}/>
                            <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                                <animate
                                    attributeName="offset"
                                    values="0%;100%"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </stop>
                            <stop offset="100%" stopColor={currentColors.gradientEnd}/>
                        </linearGradient>
                    </defs>
                </svg>
            ) : (
                // Версия SVG для больших экранов
                <svg
                    width="100%"
                    viewBox="0 0 743 625"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    style={{ height: "auto" }}
                >
                    {/* Круг (аватар) */}
                    <circle
                        cx="60"
                        cy="44"
                        r="19.6066"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                        strokeWidth="0.786885"
                    />

                    {/* Прямоугольники (заголовок и текст) */}
                    <rect x="92" y="24.5" width="126" height="14" rx="7" fill="url(#youtubeGradient)"/>
                    <rect x="92" y="47.5" width="68" height="12.25" rx="6.125" fill="url(#youtubeGradient)"/>
                    <rect x="40" y="88" width="333" height="15.75" rx="7.875" fill="url(#youtubeGradient)"/>

                    {/* Основной блок поста */}
                    <rect
                        x="40.5"
                        y="125.5"
                        width="662"
                        height="345"
                        rx="17.5"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                    />

                    {/* Текстовые блоки под постом */}
                    <rect x="40" y="487" width="663" height="14" rx="7" fill="url(#youtubeGradient)"/>
                    <rect x="40" y="507" width="663" height="14" rx="7" fill="url(#youtubeGradient)"/>
                    <rect x="40" y="527" width="663" height="14" rx="7" fill="url(#youtubeGradient)"/>

                    {/* Иконки (лайк, комментарий, репост) */}
                    <rect
                        x="40.5"
                        y="569.5"
                        width="23"
                        height="23"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                    />
                    <rect
                        x="101"
                        y="569.5"
                        width="23"
                        height="23"
                        fill="url(#youtubeGradient)"
                        stroke="url(#youtubeGradientStroke)"
                    />

                    <defs>
                        {/* Градиент с переливами */}
                        <linearGradient id="youtubeGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor={currentColors.gradientStart}/>
                            <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                                <animate
                                    attributeName="offset"
                                    values="0%;100%"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </stop>
                            <stop offset="100%" stopColor={currentColors.gradientEnd}/>
                        </linearGradient>

                        {/* Градиент для обводки */}
                        <linearGradient id="youtubeGradientStroke" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor={currentColors.gradientStart}/>
                            <stop offset="50%" stopColor={currentColors.gradientMiddle}>
                                <animate
                                    attributeName="offset"
                                    values="0%;100%"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </stop>
                            <stop offset="100%" stopColor={currentColors.gradientEnd}/>
                        </linearGradient>
                    </defs>
                </svg>
            )}
        </>
    );
};

export default LoadingPost;


