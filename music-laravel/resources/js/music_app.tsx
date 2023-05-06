import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '/resources/css/music.css';

import {Root, About, ErrorPage, Register} from "./routes";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Playlists from './routes/Playlists';

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
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);