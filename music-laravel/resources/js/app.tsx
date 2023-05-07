import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '/resources/css/music.css';

import {Root, About, Playlists, ErrorPage, RegisterPage} from "./routes";
import { UserContext } from './what/login';

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from './routes/Dashboard';

const rootElems = {
  "/": {
    element: <Dashboard />,
  },

  "about": {
    element: <About />,
  },

  "playlists": {
    element: <Playlists />
  },
}

var rootChildren: (Object)[] = [];

for (var path in rootElems) {
  rootChildren.push({
    path: path,
    element: rootElems[path].element
  });
}

const arr = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: rootChildren,
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

  {
    path: "register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter(arr);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);