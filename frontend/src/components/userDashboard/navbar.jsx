import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaArrowCircleRight, FaUserCircle } from "react-icons/fa";
import { MdLogout, MdOutlineShoppingBag } from "react-icons/md";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Navbar = ({ userData }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll logic to match Header.jsx
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload(); // Ensure state clears
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-backgroundContrast/80 backdrop-blur-xl shadow-2xl py-2"
        : "bg-backgroundContrast py-4"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        {/* Logo Section */}
        <Link to="/shop" className="group flex items-center gap-2">
          <p className="font-unbounded text-2xl md:text-3xl font-bold tracking-tighter text-white transition-colors group-hover:text-blue-400">
            Booklio<span className="text-blue-500">.</span>
          </p>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden xs:flex items-center gap-2 sm:gap-4">

            {/* Shop Link */}
            <Link
              to="/shop/listing"
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${isActive("/shop/listing")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <MdOutlineShoppingBag className="text-lg" />
              <span className="hidden sm:inline">Shop</span>
              <FaArrowCircleRight className={`transition-transform ${isActive("/shop/listing") ? "translate-x-1" : ""}`} />
            </Link>

            {/* My Account / Profile Link */}
            {location.pathname !== "/user" && (
              <Link
                to="/user"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <FaUserCircle className="text-lg" />
                <span className="hidden sm:inline">Account</span>
              </Link>
            )}
          </nav>

          {/* Replace your current Continue Shopping button with this responsive version */}
          <button
            onClick={() => navigate("/shop/listing")}
            className="group flex items-center gap-2 px-3 sm:px-6 py-3 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all duration-300"
          >
            <span className="relative hidden lg:inline"> {/* Only show full text on Large screens */}
              Continue Shopping
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </span>
            <MdOutlineShoppingBag className="text-xl group-hover:scale-110 transition-transform text-blue-500/50 group-hover:text-blue-500" />
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-xs font-bold text-white leading-none">{userData?.name || "User"}</span>
              <span className="text-[10px] text-slate-400 lowercase">{userData?.role || "Reader"}</span>
            </div>

            <Avatar className="h-9 w-9 border-2 border-blue-500/20">
              <AvatarImage src={userData?.avatarUrl} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {userData?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
              title="Logout"
            >
              <MdLogout className="text-xl group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  userData: PropTypes.shape({
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default Navbar;