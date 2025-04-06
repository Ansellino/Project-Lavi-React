import React from "react";
import { useCart } from "../../context/CartContext";
import { CartItem as CartItemType, Product } from "../../models";

interface CartItemProps {
  item: CartItemType & { product: Product };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center py-4 border-b border-secondary-200">
      <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-secondary-200 text-secondary-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 ml-4">
        <div className="flex justify-between text-base font-medium text-secondary-900">
          <h3>{product.name}</h3>
          <p className="ml-4">${product.price.toFixed(2)}</p>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <div className="flex items-center">
            <label
              htmlFor={`quantity-${item.id}`}
              className="mr-2 text-secondary-600"
            >
              Qty:
            </label>
            <select
              id={`quantity-${item.id}`}
              value={quantity}
              onChange={handleQuantityChange}
              className="py-1 text-base border rounded border-secondary-300"
            >
              {[...Array(Math.min(10, product.stock))].map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
