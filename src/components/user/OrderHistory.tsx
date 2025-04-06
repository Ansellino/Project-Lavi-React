import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Order, OrderItem, Product } from "../../models";
import { OrderRepository } from "../../repositories/OrderRepository";
import { formatDate, formatOrderNumber } from "../../utils/formatters";
import { SHOPPING, PAGINATION } from "../../utils/constants";
import Spinner from "../common/Spinner";
import SelectInput from "../forms/SelectInput";

interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
  totalItems: number;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const { user, isAuthenticated } = useAuth();
  const orderRepository = new OrderRepository();
  const itemsPerPage = PAGINATION.DEFAULT_PAGE_SIZE;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userOrders = orderRepository.findByUserId(user.id);

        // Enhance orders with items and total count
        const ordersWithItems = userOrders.map((order) => {
          const items = orderRepository.getOrderItemsWithProducts(order.id);
          const totalItems = items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return { ...order, items, totalItems };
        });

        setOrders(ordersWithItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  // Sort orders based on selected option
  const getSortedOrders = () => {
    const ordersCopy = [...orders];
    switch (sortBy) {
      case "oldest":
        return ordersCopy.sort(
          (a, b) =>
            new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
        );
      case "highest":
        return ordersCopy.sort((a, b) => b.total_amount - a.total_amount);
      case "lowest":
        return ordersCopy.sort((a, b) => a.total_amount - b.total_amount);
      case "newest":
      default:
        return ordersCopy.sort(
          (a, b) =>
            new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
        );
    }
  };

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case SHOPPING.ORDER_STATUS.DELIVERED:
        return "bg-green-100 text-green-800";
      case SHOPPING.ORDER_STATUS.SHIPPED:
        return "bg-blue-100 text-blue-800";
      case SHOPPING.ORDER_STATUS.PROCESSING:
        return "bg-yellow-100 text-yellow-800";
      case SHOPPING.ORDER_STATUS.CANCELLED:
        return "bg-red-100 text-red-800";
      case SHOPPING.ORDER_STATUS.PENDING:
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  // Toggle order details expansion
  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Pagination logic
  const sortedOrders = getSortedOrders();
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-secondary-600">Loading your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl p-6 mx-auto border border-red-200 rounded-lg bg-red-50">
        <h3 className="mb-2 text-lg font-medium text-red-700">
          Error loading orders
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-secondary-900">
          Sign In to View Your Orders
        </h2>
        <p className="mb-6 text-secondary-600">
          Please sign in to access your order history
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg border-secondary-200">
        <h2 className="mb-4 text-2xl font-bold text-secondary-900">
          No Orders Yet
        </h2>
        <p className="mb-6 text-secondary-600">
          You haven't placed any orders yet.
        </p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
        <h1 className="mb-4 text-2xl font-bold text-secondary-900 sm:mb-0">
          Order History
        </h1>

        <div className="w-full sm:w-48">
          <SelectInput
            name="sortOrders"
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "highest", label: "Highest Amount" },
              { value: "lowest", label: "Lowest Amount" },
            ]}
            className="mb-0"
          />
        </div>
      </div>

      <div className="space-y-6">
        {paginatedOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden border rounded-lg border-secondary-200"
          >
            {/* Order Header */}
            <div className="grid grid-cols-1 p-6 bg-secondary-50 sm:grid-cols-2 lg:grid-cols-4 gap-y-4">
              <div>
                <h3 className="text-sm text-secondary-500">Order Number</h3>
                <p className="text-lg font-medium text-secondary-900">
                  {formatOrderNumber(order.id)}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-secondary-500">Date Placed</h3>
                <p className="text-lg font-medium text-secondary-900">
                  {formatDate(order.order_date)}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-secondary-500">Total Amount</h3>
                <p className="text-lg font-medium text-secondary-900">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-secondary-500">Status</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Summary - always visible */}
            <div className="p-6 border-t border-secondary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-700">
                    {order.totalItems}{" "}
                    {order.totalItems === 1 ? "item" : "items"}
                  </p>
                </div>

                <button
                  onClick={() => toggleOrderExpand(order.id)}
                  className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  {expandedOrders.includes(order.id)
                    ? "Hide Details"
                    : "View Details"}
                  <svg
                    className={`w-5 h-5 ml-1 transform ${
                      expandedOrders.includes(order.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Order Details - expandable */}
              {expandedOrders.includes(order.id) && (
                <div className="pt-6 mt-6 border-t border-secondary-200">
                  {/* Order Items */}
                  <h4 className="mb-4 text-lg font-medium text-secondary-900">
                    Order Items
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start p-4 border rounded-md border-secondary-200"
                      >
                        <div className="flex-shrink-0 w-16 h-16 overflow-hidden border rounded-md border-secondary-200">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="object-cover object-center w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-secondary-100">
                              <span className="text-xs text-secondary-400">
                                No image
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 ml-4">
                          <Link
                            to={`/products/${item.product_id}`}
                            className="font-medium text-secondary-900 hover:text-primary-600"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex justify-between mt-1">
                            <div className="text-sm text-secondary-500">
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: ${item.price.toFixed(2)}</p>
                            </div>
                            <div className="text-sm font-medium text-secondary-900">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-6">
                      <h4 className="mb-2 text-lg font-medium text-secondary-900">
                        Shipping Address
                      </h4>
                      <div className="p-4 border rounded-md border-secondary-200">
                        <p className="whitespace-pre-line text-secondary-700">
                          {order.shipping_address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="pt-6 mt-6 border-t border-secondary-200">
                    <h4 className="mb-4 text-lg font-medium text-secondary-900">
                      Order Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Subtotal:</span>
                        <span className="text-secondary-900">
                          ${(order.total_amount * 0.93).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Tax (7%):</span>
                        <span className="text-secondary-900">
                          ${(order.total_amount * 0.07).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Shipping:</span>
                        <span className="text-secondary-900">
                          {order.total_amount >= 100 ? "Free" : "$10.00"}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 text-base font-medium border-t border-secondary-200">
                        <span className="text-secondary-900">Total:</span>
                        <span className="text-secondary-900">
                          ${order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm isolate"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-l-md border-secondary-300 text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-secondary-300 ${
                  currentPage === index + 1
                    ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                    : "bg-white text-secondary-500 hover:bg-secondary-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-r-md border-secondary-300 text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
