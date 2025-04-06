import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import { Product } from "../../models";
import { ProductRepository } from "../../repositories/ProductRepository";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import Badge from "../common/Badge";
import Spinner from "../common/Spinner";
import { formatCurrency } from "../../utils/formatters";
import { SHOPPING } from "../../utils/constants";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const productRepository = new ProductRepository();
  const categoryRepository = new CategoryRepository();

  useEffect(() => {
    const fetchProductDetails = () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Product ID is missing");
          return;
        }

        const productId = parseInt(id, 10);
        const productData = productRepository.findById(productId);

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);

        // Fetch category name if product has a category
        if (productData.category_id) {
          const category = categoryRepository.findById(productData.category_id);
          if (category) {
            setCategoryName(category.name);
          }
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      addToCart(product.id, quantity);
      showToast(`${product.name} added to cart`, "success");
    } catch (err) {
      showToast("Failed to add item to cart", "error");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-secondary-900">
            {error || "Product not found"}
          </h1>
          <p className="mb-6 text-secondary-600">
            The product you're looking for could not be found.
          </p>
          <button onClick={handleGoBack} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxQuantity = Math.min(product.stock, SHOPPING.MAX_QUANTITY);

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-6 text-sm text-secondary-500">
        <Link to="/" className="hover:text-primary-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600">
          Products
        </Link>
        {categoryName && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/categories/${product.category_id}`}
              className="hover:text-primary-600"
            >
              {categoryName}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-secondary-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Product Image */}
        <div className="md:col-span-1">
          <div className="relative overflow-hidden rounded-lg bg-secondary-100 aspect-square">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="object-cover object-center w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-secondary-400">No image available</span>
              </div>
            )}

            {/* Stock badges */}
            {isOutOfStock && (
              <Badge variant="error" className="absolute top-4 right-4">
                Out of Stock
              </Badge>
            )}

            {isLowStock && (
              <Badge variant="warning" className="absolute top-4 right-4">
                Low Stock: Only {product.stock} left
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:col-span-1 lg:col-span-2">
          <h1 className="mb-2 text-3xl font-bold text-secondary-900">
            {product.name}
          </h1>

          {categoryName && (
            <div className="mb-4">
              <Link
                to={`/categories/${product.category_id}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                {categoryName}
              </Link>
            </div>
          )}

          <div className="mb-6 text-2xl font-bold text-secondary-900">
            {formatCurrency(product.price)}
          </div>

          {product.description && (
            <div className="mb-6 prose text-secondary-700 max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="p-6 border rounded-lg border-secondary-200 bg-secondary-50">
            {!isOutOfStock ? (
              <>
                <div className="flex items-center mb-4">
                  <span className="mr-4 font-medium text-secondary-700">
                    Quantity:
                  </span>
                  <select
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="py-2 pl-3 pr-10 border rounded-md form-input border-secondary-300"
                    disabled={isOutOfStock}
                  >
                    {[...Array(maxQuantity)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3 font-medium text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                {isLowStock && (
                  <p className="mt-2 text-sm text-secondary-600">
                    Hurry! Only {product.stock} items left in stock.
                  </p>
                )}
              </>
            ) : (
              <div className="text-center">
                <p className="mb-4 font-medium text-red-600">Out of Stock</p>
                <button
                  onClick={() =>
                    showToast(
                      "We'll notify you when this item is back in stock",
                      "info"
                    )
                  }
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  Notify me when available
                </button>
              </div>
            )}
          </div>

          {/* Additional Product Details */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-medium text-secondary-900">
              Product Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-md border-secondary-200">
                <h3 className="font-medium text-secondary-700">Product ID</h3>
                <p className="text-secondary-900">{product.id}</p>
              </div>
              <div className="p-4 border rounded-md border-secondary-200">
                <h3 className="font-medium text-secondary-700">Availability</h3>
                <p className="text-secondary-900">
                  {isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                    ? `Low Stock (${product.stock} remaining)`
                    : "In Stock"}
                </p>
              </div>
            </div>
          </div>

          {/* Back to Products Button */}
          <div className="mt-8">
            <button
              onClick={handleGoBack}
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
