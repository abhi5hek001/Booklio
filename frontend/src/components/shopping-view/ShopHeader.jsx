import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";

function ShoppingHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Effect for checking auth
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");
        setIsLoggedIn(!!token && !!role);

        // Effect for scroll styling
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        toast.success("Logout successful!");
        navigate("/");
    };

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                ? "bg-backgroundContrast/90 backdrop-blur-md shadow-lg py-2" 
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

                {/* Navigation / Actions */}
                <nav className="flex items-center gap-4 sm:gap-6">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => navigate("/user")}
                                className="text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-full border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 active:scale-95"
                            >
                                My Account
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/auth/login")}
                            className="text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20 transition-all duration-200 active:scale-95"
                        >
                            Login Now
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default ShoppingHeader;