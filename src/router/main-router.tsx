import { createBrowserRouter } from "react-router-dom";



import AdminLayout from "../layout/admin-layout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      // { path: "", element: <HomeAdmin /> },
      // { path: "/product", element: <ProductPage /> },
    ],
  },
]);

export default router;
