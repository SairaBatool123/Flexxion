import { useState } from "react";


import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./assets/Pages/Home.jsx";
import { About } from "./assets/Pages/About.jsx";
import { Country } from "./assets/Pages/Country.jsx";
import { Contact } from "./assets/Pages/Contact.jsx";


import AppLayout from "./components/Layout/AppLayout.jsx";
import ErrorPage from "./assets/Pages/ErrorPage.jsx";
import CountryDetails from "./components/Layout/CountryDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "country",
        element: <Country />,
      },
      {
        // : dynamic route 
        path: "country/:id",
        element: <CountryDetails />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
