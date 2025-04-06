import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminCustomersPage from './pages/admin/CustomersPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import CategoryEditPage from './pages/admin/CategoryEditPage';
import { useAuth } from './context/AuthContext';

// Protected route component
const ProtectedRoute: React.FC<{ 
  element: React.ReactElement, 
  allowedRoles?: string[] 
}> = ({ element, allowedRoles = ['customer', 'admin'] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && allowedRoles.includes(user.role)) {
    return element;
  }
  
  return <Navigate to="/" replace />;
};

// Admin route component
const AdminRoute: React.FC<{ 
  element: React.ReactElement 
}> = ({ element }) => {
  return <ProtectedRoute element={element} allowedRoles={['admin']} />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="categories/:id" element={<CategoryPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      
      {/* Protected customer routes */}
      <Route path="/" element={<MainLayout />}>
        <Route 
          path="checkout" 
          element={<ProtectedRoute element={<CheckoutPage />} />} 
        />
        <Route 
          path="order-confirmation/:id" 
          element={<ProtectedRoute element={<OrderConfirmationPage />} />} 
        />
        <Route 
          path="account" 
          element={<ProtectedRoute element={<AccountPage />} />} 
        />
        <Route 
          path="orders" 
          element={<ProtectedRoute element={<OrdersPage />} />} 
        />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route 
          index 
          element={<AdminRoute element={<DashboardPage />} />} 
        />
        <Route 
          path="products" 
          element={<AdminRoute element={<AdminProductsPage />} />} 
        />
        <Route 
          path="products/:id/edit" 
          element={<AdminRoute element={<ProductEditPage />} />} 
        />
        <Route 
          path="categories" 
          element={<AdminRoute element={<AdminCategoriesPage />} />} 
        />
        <Route 
          path="categories/:id/edit" 
          element={<AdminRoute element={<CategoryEditPage />} />} 
        />
        <Route 
          path="orders" 
          element={<AdminRoute element={<AdminOrdersPage />} />} 
        />
        <Route 
          path="customers" 
          element={<AdminRoute element={<AdminCustomersPage />} />} 
        />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;