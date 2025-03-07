import logo from "../../../../assets/logo.png";
import {
  BellRing,
  CircleUserRound,
  CreditCard,
  HandCoins,
  HelpCircle,
  History,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  User2Icon,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL

  const navbarlinks = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/Aplango/admin/",
    },
    {
      label: "Admins",
      icon: <ShieldCheck />,
      path: "/Aplango/admin/admins",
    },
    {
      label: "Users",
      icon: <User2Icon />,
      path: "/Aplango/admin/users",
    },
    {
      label: "Manage Cards",
      icon: <CreditCard />,
      path: "/Aplango/admin/cards",
    },
    {
      label: "Brands",
      icon: <ShoppingBag />,
      path: "/Aplango/admin/brands",
    },
    {
      label: "Manage Offers",
      icon: <HandCoins />,
      path: "/Aplango/admin/offers",
    },
    {
      label: "History",
      icon: <History />,
      path: "/Aplango/admin/history",
    },
    {
      label: "Notifications",
      icon: <BellRing />,
      path: "/Aplango/admin/alerts",
    },

    {
      label: "Account",
      icon: <CircleUserRound />,
      path: "/Aplango/admin/account",
    },
    {
      label: "Help",
      icon: <HelpCircle />,
      path: "/Aplango/admin/help",
    },
  ];

  const handleScrollHome = () => {
    navigate("/Aplango/ui");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  // Check if the current path is in navbarlinks
  const isKnownPath = navbarlinks.some(
    (link) => link.path === location.pathname
  );

  // If it's not a known path or it's the root path, we'll consider Dashboard as active
  const isDashboardActive = !isKnownPath || location.pathname === "/";

  return (
    <div className="fixed z-[100] flex h-full w-[90px] md:w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white shadow-lg">
      <div className="gap-x-3 py-3 px-1 md:px-3">
        <div className="logo flex gap-1 items-center justify-center">
          <Link onClick={handleScrollHome}>
            <img src={logo} className="h-10 w-15" alt="Aplango" />
          </Link>

          <h1 className="text-red-500 text-xl font-bold hidden md:block">
            A<span className="text-blue-700">plan</span>go
          </h1>
        </div>

        <div className="flex flex-col w-full gap-y-4 overflow-y-auto mt-6 overflow-x-hidden py-5 px-4 md:px-3 [scrollbar-width:_thin]">
          <div className="flex flex-col gap-4">
            {navbarlinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`w-full hover:scale-105 transition-all text-md font-semibold rounded-lg flex items-center justify-center md:justify-start gap-0 md:gap-5 text-start px-3 py-4 
                                    ${
                                      (item.path === "/Aplango/dashboard/" &&
                                        isDashboardActive) ||
                                      location.pathname === item.path
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-indigo-600 hover:text-white"
                                    }`}
              >
                <h2 className="flex items-center text-start gap-4">
                  {item.icon}
                  <span className="hidden md:block">{item.label}</span>
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
