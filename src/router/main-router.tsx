import { createBrowserRouter } from "react-router-dom";



import AdminLayout from "../layout/admin-layout";
import HomeAdmin from "../pages/home";
import ProductPage from "../pages/product";
import Order from "../pages/order";
import Team from "../pages/team";
import User from "../pages/user";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "", element: <HomeAdmin /> },
      { path: "/user", element: <User /> },
      { path: "/order", element: <Order /> },
      { path: "/team", element: <Team /> },
      { path: "/product", element: <ProductPage /> },
    ],
  },
]);

export default router;
