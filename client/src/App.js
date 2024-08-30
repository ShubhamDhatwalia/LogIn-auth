import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";




//  Auth middleware --------------
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

/**Import all components */
import Username from "./components/Username";
import Password from "./components/Password";
import Reset from "./components/Reset";
import Recovery from "./components/Recovery";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";

/**  Root Routes */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },

  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/password",
    element: <ProtectRoute><Password /></ProtectRoute>,
  },
  {
    path: "/profile",
    element: <AuthorizeUser><Profile/></AuthorizeUser>,
  },
  {
    path: "/reset",
    element: <ProtectRoute><Reset /></ProtectRoute>,
  },
  {
    path: "/recovery",
    element: <ProtectRoute><Recovery /></ProtectRoute>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

export default function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
