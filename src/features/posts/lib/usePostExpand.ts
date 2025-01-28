import { useState } from 'react';

export const usePostExpand = (handleReadMore: () => Promise<void>, handleClosePost: () => void) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = async () => {
        const scrollPosition = window.scrollY;
        const scrollbarWidth = window.innerWidth - window.document.documentElement.clientWidth;

        // Устанавливаем фиксированные стили для body
        window.document.body.style.position = 'fixed';
        window.document.body.style.top = `-${scrollPosition}px`;
        window.document.body.style.left = '0';
        window.document.body.style.right = `${scrollbarWidth}px`;
        window.document.body.style.overflow = 'hidden';
        window.document.body.style.transition = `height 0.3s ease`;
        window.document.body.style.marginRight = `-15px`;

        setIsExpanded(true);

        try {
            await handleReadMore();
        } catch (error) {
            console.error("Ошибка при загрузке полного текста:", error);
        }
    };

    const handleClose = () => {
        const scrollPosition = parseInt(window.document.body.style.top || '0', 10) * -1;

        // Сбрасываем стили для body
       window.document.body.style.position = '';
       window.document.body.style.top = '';
       window.document.body.style.left = '';
       window.document.body.style.right = '';
       window.document.body.style.overflow = '';
       window.document.body.style.transition = '';
       window.document.body.style.marginRight = '';


        // Восстанавливаем прокрутку
        window.scrollTo({
            top: scrollPosition,
            behavior: 'instant',
        });

        setIsExpanded(false);
        handleClosePost();
    };

    return { isExpanded, handleExpand, handleClose };
};
