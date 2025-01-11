import './styles/main.scss';

import {ApolloProvider} from "@apollo/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";

import client from "./apollo/client.ts";
import App from "./App.tsx";

// eslint-disable-next-line no-undef
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ApolloProvider client={client}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<App />}>
                      {/*<Route index element={<HomePage />} />*/}
                      {/*<Route path="/login" element={<LoginPage />} />*/}
                  </Route>
              </Routes>
          </BrowserRouter>
      </ApolloProvider>
  </StrictMode>,
)
