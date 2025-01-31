import './shared/styles/main.scss';

import {ApolloProvider} from "@apollo/client";
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PersistGate} from 'redux-persist/integration/react';

import {persistor, store} from "@/app/store/store";
import LoginPage from "@/features/auth/ui/LoginPage/LoginPage.tsx";
import RegisterPage from "@/features/auth/ui/RegisterPage/RegisterPage.tsx";
import Error500 from "@/pages/ui/Error500/Error500.tsx";
import FavoritesPage from "@/pages/ui/FavoritesPage/FavoritesPage.tsx";
import HomePage from "@/pages/ui/HomePage/HomePage.tsx";
import ProfilePage from "@/pages/ui/ProfilePage/ProfilePage.tsx";

import App from "./App.tsx";
import client from "./app/apollo/client.ts";

createRoot(window.document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<App/>}>
                                <Route index element={<HomePage/>}/>
                                <Route path="/my-posts" element={''}/>
                                <Route path="/favorites" element={<FavoritesPage/>}/>
                                <Route path="/profile" element={<ProfilePage/>}/>
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/register" element={<RegisterPage/>}/>
                                <Route path="/error-500" element={<Error500 />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ApolloProvider>
    </StrictMode>,
)
