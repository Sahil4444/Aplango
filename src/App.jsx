import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget the CSS
import Home from "./_components/Home";
import AnimatedLoginForm from "./_components/customers/Login/Login";
import UiHome from "./_components/customers/UI/Home";
import About from "./_components/customers/UI/_components/About";
import Contact from "./_components/customers/UI/_components/Contact";
import Front from "./_components/customers/UI/_components/Front";
import PagesLayout from "./_components/admin/PagesLayout";
import Dashboard from "./_components/admin/Pages/Dashboard";
import Account from "./_components/admin/Pages/Account";
import Users from "./_components/admin/Pages/Users";
import Brands from "./_components/admin/Pages/Brands";
import History from "./_components/admin/Pages/History";
import Notifications from "./_components/admin/Pages/Notifications";
import Help from "./_components/admin/Pages/Help";
import Admins from "./_components/admin/Pages/Admins";
import ManageCards from "./_components/admin/Pages/ManageCards";
import RegisterAdmin from "./_components/admin/Pages/RegisterAdmin";
import CardRegister from "./_components/admin/Pages/CardRegister";
import BrandRegister from "./_components/admin/Pages/BrandRegister";
import Offers from "./_components/admin/Pages/Offers";
import AdminLogin from "./_components/admin/Pages/AdminLogin";
import CouponRegister from "./_components/admin/Pages/CouponRegister";

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
        element: <Front />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/Aplango/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/Aplango/admin/",
    element: <PagesLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "admins",
        element: <Admins />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "cards",
        element: <ManageCards />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "offers",
        element: <Offers />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "redemptions",
        element: <Notifications />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "register",
        element: <RegisterAdmin />,
      },
      {
        path: "cardregister",
        element: <CardRegister />,
      },
      {
        path: "brandregister",
        element: <BrandRegister />,
      },
      {
        path: "couponregister",
        element: <CouponRegister />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
