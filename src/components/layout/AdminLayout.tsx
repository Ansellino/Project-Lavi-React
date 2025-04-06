import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AUTH } from "../../utils/constants";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Verify user is admin, redirect if not
  React.useEffect(() => {
    if (!user || user.role !== AUTH.ROLES.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-secondary-100">
      {/* Sidebar */}
      <div
        className={`bg-secondary-800 text-white ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-width duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary-700">
          <h1 className={`font-semibold ${isSidebarOpen ? "block" : "hidden"}`}>
            Admin Dashboard
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-1 text-white rounded-md hover:bg-secondary-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive ? "bg-primary-600" : "hover:bg-secondary-700"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive ? "bg-primary-600" : "hover:bg-secondary-700"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Products
            </span>
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive ? "bg-primary-600" : "hover:bg-secondary-700"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Categories
            </span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive ? "bg-primary-600" : "hover:bg-secondary-700"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Orders
            </span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive ? "bg-primary-600" : "hover:bg-secondary-700"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Customers
            </span>
          </NavLink>

          <div className="px-4 py-3 mt-auto hover:bg-secondary-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Logout
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-secondary-200">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-secondary-800">
              Admin Panel
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="text-sm font-medium text-secondary-700">
                Welcome, {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
