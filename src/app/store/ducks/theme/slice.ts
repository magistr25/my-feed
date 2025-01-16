import { createSlice } from '@reduxjs/toolkit';

import { setTheme,toggleTheme } from './actions';

interface ThemeState {
    theme: 'light' | 'dark';
}

const initialState: ThemeState = {
    theme: localStorage.getItem('persist:root')
        ? JSON.parse(JSON.parse(localStorage.getItem('persist:root')!).theme).theme
        : 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleTheme, (state) => {
                state.theme = state.theme === 'light' ? 'dark' : 'light';
            })
            .addCase(setTheme, (state, action) => {
                state.theme = action.payload;
            });
    },
});

export default themeSlice.reducer;
