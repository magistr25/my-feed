import { RootState } from '../../store.ts';

export const selectTheme = (state: RootState) => state.theme.theme;
