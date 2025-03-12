import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// Utility function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Navbar = ({ userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [randomColor, setRandomColor] = useState(getRandomColor());
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Generate a new random color every time the component mounts
    setRandomColor(getRandomColor());
  }, [userData]);

  return (
    <nav className="bg-backgroundContrast text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_1px_0_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center w-[80%] min-h-[--header-row-height]">
        <div className="flex items-center space-x-8">
          <a href="/shop" className="text-4xl font-unbounded font-bold text-white">
            Booklio
          </a>
        </div>
        <div className="relative flex justify-center items-center gap-4">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/user"
                className={`text-xs px-4 py-2 rounded cursor-pointer ${
                  isActive("/user/orders") ? "bg-blue-600" : "bg-blue-600"
                }`}
              >
                Account
              </a>
            </li>
            <li>
              <a
                href="/user/orders"
                className={`text-xs px-4 py-2 rounded cursor-pointer ${
                  isActive("/user/orders") ? "bg-blue-600" : "bg-blue-600"
                }`}
              >
                My Orders
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  userData: PropTypes.shape({
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default Navbar;