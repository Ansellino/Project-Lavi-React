import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { AUTH } from "../../utils/constants";

interface SidebarLink {
  path: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  adminOnly?: boolean;
}

interface SidebarProps {
  title?: string;
  links?: SidebarLink[];
  defaultOpen?: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  title = "Navigation",
  links,
  defaultOpen = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const defaultLinks: SidebarLink[] = [
    {
      path: "/products",
      label: "All Products",
      icon: (
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
      ),
      end: true,
    },
    {
      path: "/categories",
      label: "Categories",
      icon: (
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
      ),
    },
    {
      path: "/deals",
      label: "Special Offers",
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      path: "/account",
      label: "My Account",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      path: "/orders",
      label: "My Orders",
      icon: (
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
      ),
    },
    {
      path: "/admin",
      label: "Admin Panel",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      adminOnly: true,
    },
  ];

  const navLinks = links || defaultLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } h-screen transition-width duration-300 ease-in-out ${
        theme === "dark"
          ? "bg-secondary-800 text-white"
          : "bg-white text-secondary-800 border-r border-secondary-200"
      } ${className}`}
    >
      {/* Header with toggle button */}
      <div
        className={`flex items-center justify-between p-4 ${
          theme === "dark"
            ? "border-b border-secondary-700"
            : "border-b border-secondary-200"
        }`}
      >
        <h2 className={`font-semibold ${isOpen ? "block" : "hidden"}`}>
          {title}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded-md ${
            theme === "dark"
              ? "text-white hover:bg-secondary-700"
              : "text-secondary-500 hover:bg-secondary-100"
          }`}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
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

      {/* Navigation Links */}
      <nav className="mt-5">
        <ul className="space-y-2">
          {navLinks.map((link, index) => {
            // Skip admin-only links if user is not an admin
            if (link.adminOnly && (!user || user.role !== AUTH.ROLES.ADMIN)) {
              return null;
            }

            return (
              <li key={index}>
                <NavLink
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 ${
                      isActive
                        ? theme === "dark"
                          ? "bg-primary-600 text-white"
                          : "bg-primary-50 text-primary-700 border-r-4 border-primary-500"
                        : theme === "dark"
                        ? "hover:bg-secondary-700"
                        : "hover:bg-secondary-50"
                    }`
                  }
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <span className={`ml-3 ${isOpen ? "block" : "hidden"}`}>
                    {link.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      {isAuthenticated && (
        <div
          className={`absolute bottom-0 w-full p-4 ${
            theme === "dark"
              ? "border-t border-secondary-700"
              : "border-t border-secondary-200"
          }`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 ${
              theme === "dark"
                ? "hover:bg-secondary-700"
                : "hover:bg-secondary-50"
            }`}
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
            <span className={`ml-3 ${isOpen ? "block" : "hidden"}`}>
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
