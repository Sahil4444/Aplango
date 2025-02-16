import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./_components/Home";
import AnimatedLoginForm from "./_components/customers/Login/Login";
import UiHome from "./_components/customers/UI/Home";
import About from "./_components/customers/UI/_components/About";
import Contact from "./_components/customers/UI/_components/Contact";
import Front from "./_components/customers/UI/_components/Front";

const router = createBrowserRouter([
  {
    path: "/Aplango/",
    element: <Home />,
  },
  {
    path: "/Aplango/login",
    element: <AnimatedLoginForm />,
  },
  {
    path: "/Aplango/ui/",
    element: <UiHome />,
    children: [
      {
        index: true,
        element: <Front />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
    ]
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
