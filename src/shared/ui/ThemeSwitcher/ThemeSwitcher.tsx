import './ThemeSwitcher.scss';

import {FC, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectTheme,toggleTheme } from '@/app/store/ducks/theme';

const ThemeSwitcher: FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);
    useEffect(() => {
        window.document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    const handleToggle = () => {
        dispatch(toggleTheme());
        window.document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
    };

    return (
        <label className="theme-switcher">
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
