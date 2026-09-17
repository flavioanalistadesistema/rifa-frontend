import { createBrowserRouter } from "react-router-dom";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { PublicRafflePage } from "../pages/PublicRafflePage";
import { RequireAdmin } from "./RequireAdmin";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminRaffleDetailsPage } from "../pages/AdminRaffleDetailsPage";
import { AdminDrawPainelPage } from "../pages/AdminDrawPainelPage";
import { AdminPrizesPainelPage } from "../pages/AdminPrizesPainelPage";

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
          },
          {
            path: "/admin/raffles/:raffleId",
            element: <AdminRaffleDetailsPage />,
          },
          {
            path: "/admin/raffles/:raffleId/draw",
            element: <AdminDrawPainelPage />,
          },
          {
            path: "/admin/raffles/:raffleId/prizes",
            element: <AdminPrizesPainelPage />,
          }
        ]
      }
    ]
  }
]);