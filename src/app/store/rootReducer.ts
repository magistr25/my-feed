import {combineReducers} from '@reduxjs/toolkit';

import {themeReducer} from "@/app/store/ducks/theme";


const rootReducer = combineReducers({
    theme: themeReducer,

});

export default rootReducer;
