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
import Careers from "./_components/admin/Pages/Careers";
import AddJob from "./_components/admin/Pages/AddJob";
import JobDetails from "./_components/admin/Pages/JobDetails";
import CareerHome from "./_components/customers/Careers/Careers";
import JobInfo from "./_components/customers/Careers/JobInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <AnimatedLoginForm />,
  },
  {
    path: "/careers",
    element: <CareerHome />,
  },
  {
    path: "/careers/:id",
    element: <JobInfo />,
  },
  {
    path: "/ui/",
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
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/",
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
        path: "careers",
        element: <Careers />,
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
        path: "careerregister",
        element: <AddJob />,
      },
      {
        path: "career/:id",
        element: <JobDetails />,
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
