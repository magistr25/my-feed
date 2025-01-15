import { createSlice } from '@reduxjs/toolkit';

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
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
