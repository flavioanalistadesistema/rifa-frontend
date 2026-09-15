import { createBrowserRouter } from "react-router-dom";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { PublicRafflePage } from "../pages/PublicRafflePage";
import { RequireAdmin } from "./RequireAdmin";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

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
    element: <RequireAdmin />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardPage />,
      }
    ]
  }
]);