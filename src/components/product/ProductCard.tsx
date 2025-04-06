import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../models";
import AddToCartButton from "../cart/AddToCartButton";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/formatters";
import { truncateText } from "../../utils/formatters";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      className={`card group transition duration-200 hover:shadow-md ${className}`}
    >
      {/* Product image with badges */}
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/products/${product.id}`}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-secondary-100">
              <span className="text-secondary-400">No image available</span>
            </div>
          )}
        </Link>

        {/* Stock badges */}
        {isOutOfStock && (
          <Badge variant="error" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}

        {isLowStock && (
          <Badge variant="warning" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
      </div>

      {/* Product details */}
      <div className="p-4">
        <Link
          to={`/products/${product.id}`}
          className="block mb-1 text-lg font-medium transition text-secondary-800 hover:text-primary-600"
        >
          {product.name}
        </Link>

        <div className="mb-2 text-xl font-bold text-secondary-900">
          {formatCurrency(product.price)}
        </div>

        {product.description && (
          <p className="mb-4 text-sm text-secondary-600">
            {truncateText(product.description, 100)}
          </p>
        )}

        {/* Add to cart button */}
        <div className="mt-auto">
          <AddToCartButton
            productId={product.id}
            stock={product.stock}
            showQuantity={false}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
