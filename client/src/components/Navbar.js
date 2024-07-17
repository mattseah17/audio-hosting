import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const showManageAccount = ["/dashboard", "/audio"].some((path) =>
    location.pathname.startsWith(path)
  );
  const showBackButton = ["/register", "/login"].includes(location.pathname);

  return (
    <nav className="bg-violet-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="text-white font-bold text-xl"
          >
            Audio Hosting App
          </Link>
        </div>
        <div className="flex space-x-4">
          {showBackButton && (
            <Link to="/" className="text-white hover:text-blue-200">
              Back
            </Link>
          )}
          {!isLoggedIn && location.pathname === "/" && (
            <>
              <Link to="/register" className="text-white hover:text-blue-200">
                Register
              </Link>
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              {location.pathname !== "/dashboard" && (
                <Link
                  to="/dashboard"
                  className="text-white hover:text-blue-200"
                >
                  My Dashboard
                </Link>
              )}
              {showManageAccount && (
                <Link to="/account" className="text-white hover:text-blue-200">
                  Manage Account
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
