import './shared/styles/main.scss';

import {ApolloProvider} from "@apollo/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";

import client from "./app/apollo/client.ts";
import App from "./App.tsx";
import HomePage from "./pages/HomePage/HomeRage.tsx";

createRoot(window.document.getElementById('root')!).render(
  <StrictMode>
      <ApolloProvider client={client}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<App />}>
                      <Route index element={<HomePage />} />
                      <Route path="/login" element={''} />
                      <Route path="/my-posts" element={''} />
                      <Route path="/favorites" element={''} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </ApolloProvider>
  </StrictMode>,
)
