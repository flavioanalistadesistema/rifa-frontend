import { createBrowserRouter } from "react-router-dom";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { PublicRafflePage } from "../pages/PublicRafflePage";
import { RequireAdmin } from "./RequireAdmin";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminLayout } from "../components/AdminLayout";

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
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboardPage />,
          }
        ]
      }
    ]
  }
]);