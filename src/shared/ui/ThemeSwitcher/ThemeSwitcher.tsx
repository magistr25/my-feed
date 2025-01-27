import './ThemeSwitcher.scss';

import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectTheme, toggleTheme } from '@/app/store/ducks/theme';

const ThemeSwitcher: FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState<number | null>(null);
    const [currentX, setCurrentX] = useState<number | null>(null);

    useEffect(() => {
        window.document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setStartX(x);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || startX === null) return;

        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setCurrentX(x);
    };

    const handleMouseUp = () => {
        if (!isDragging || startX === null || currentX === null) {
            setIsDragging(false);
            setStartX(null);
            setCurrentX(null);
            return;
        }

        const delta = currentX - startX;

        // Если перемещение значительное, переключить тему
        if (Math.abs(delta) > 10) {
            handleToggle();
        }

        // Сброс значений
        setIsDragging(false);
        setStartX(null);
        setCurrentX(null);
    };

    return (
        <label
            className={`theme-switcher ${isDragging ? 'theme-switcher--dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
        >
            <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={handleToggle}
            />
            <span className="theme-switcher__slider" />
        </label>
    );
};

export default ThemeSwitcher;
