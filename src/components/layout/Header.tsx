import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import CartIcon from "../cart/CartIcon";
import { AUTH } from "../../utils/constants";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b shadow-sm border-secondary-200">
      {/* Top bar with promotions or announcements */}
      <div className="py-2 text-sm text-center text-white bg-primary-600">
        Free shipping on orders over $100 | Use code WELCOME10 for 10% off your first order
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              ShopSmart
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-primary-500 text-secondary-900"
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-primary-500 text-secondary-900"
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                }`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/deals"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-primary-500 text-secondary-900"
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                }`
              }
            >
              Deals
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-primary-500 text-secondary-900"
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right side - Search, User, Cart */}
          <div className="items-center hidden space-x-4 md:flex">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-56 py-1 pl-3 pr-10 text-sm rounded-md form-input border-secondary-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg
                  className="w-5 h-5 text-secondary-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User account */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="flex items-center text-sm font-medium text-secondary-700 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="mr-2">{user?.name || 'Account'}</span>
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute right-0 hidden w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="none">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        role="menuitem"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        role="menuitem"
                      >
                        Order History
                      </Link>
                      {user?.role === AUTH.ROLES.ADMIN && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                          role="menuitem"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-secondary-700 hover:bg-secondary-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-secondary-700 hover:text-secondary-900"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Shopping cart */}
            <Link
              to="/cart"
              className="relative p-1 rounded-full text-secondary-600 hover:text-secondary-800"
            >
              <span className="sr-only">View cart</span>
              <CartIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-primary-600">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link
              to="/cart"
              className="relative p-1 mr-4 rounded-full text-secondary-600 hover:text-secondary-800"
            >
              <span className="sr-only">View cart</span>
              <CartIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-primary-600">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 bg-white rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        {/* Search form */}
        <div className="px-4 pt-2 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full py-2 pl-3 pr-10 text-base rounded-md form-input border-secondary-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg
                className="w-5 h-5 text-secondary-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>

        <div className="pt-2 pb-3 space-y-1 border-t border-secondary-200">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? "border-primary-500 text-primary-700 bg-primary-50"
                  : "border-transparent text-secondary-600 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-800"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? "border-primary-500 text-primary-700 bg-primary-50"
                  : "border-transparent text-secondary-600 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-800"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Categories
          </NavLink>
          <NavLink
            to="/deals"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? "border-primary-500 text-primary-700 bg-primary-50"
                  : "border-transparent text-secondary-600 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-800"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Deals
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? "border-primary-500 text-primary-700 bg-primary-50"
                  : "border-transparent text-secondary-600 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-800"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>
        </div>

        {/* User authentication mobile */}
        <div className="pt-4 pb-3 border-t border-secondary-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-200">
                    <span className="font-medium text-primary-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-secondary-800">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-secondary-500">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-1 ml-auto rounded-full text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="px-2 mt-3 space-y-1">
                <Link
                  to="/account"
                  className="block px-3 py-2 text-base font-medium rounded-md text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-base font-medium rounded-md text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Order History
                </Link>
                {user?.role === AUTH.ROLES.ADMIN && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-base font-medium rounded-md text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-base font-medium text-left rounded-md text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="px-2 mt-3 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium rounded-md text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium rounded-md text-primary-600 hover:text-primary-800 hover:bg-secondary-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;