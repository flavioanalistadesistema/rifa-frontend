import { createBrowserRouter } from "react-router-dom";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { PublicRafflePage } from "../pages/PublicRafflePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRafflePage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <p>Dashboard admin</p>,
  }
]);