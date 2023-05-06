import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '/resources/css/music.css';

import {Root, About, Playlists, ErrorPage, RegisterPage} from "./routes";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "about",
    element: <About />,
    errorElement: <ErrorPage />,
  },
  {
    path: "playlists",
    element: <Playlists />,
    errorElement: <ErrorPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    loader: async() => {
      return {
        openLogin: true,
      };
    },
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);