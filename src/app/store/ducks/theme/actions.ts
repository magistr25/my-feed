import { createAction } from '@reduxjs/toolkit';

export const toggleTheme = createAction('theme/toggleTheme');
export const setTheme = createAction<'light' | 'dark'>('theme/setTheme');

