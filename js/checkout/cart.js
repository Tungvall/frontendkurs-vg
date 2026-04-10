import { state } from "../states.js";
import { setStorage } from "../shared.js";
import { renderCart } from "./checkout.js";

export function incrementItem(id) {
  console.log("increment function runs");
  const product = state.products.find((p) => p.id === Number(id));
  if (!product) return;

  const added = state.cart.find((p) => p.id === Number(id));

  if (added) {
    added.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  console.log("CART STATE:", state.cart);
  console.log("Cart length:", state.cart.length);
  renderCart();
  setStorage("cart", state.cart);
}

export function decrementItem(id) {
  console.log("decrement function runs");
  const item = state.cart.find((p) => p.id === Number(id));
  if (!item) return;

  if (item.quantity > 1) return;
  item.quantity -= 1;

  console.log("CART STATE:", state.cart);
  setStorage("cart", state.cart);
}

export function removeItem(id) {
  console.log("removeItem function runs");
  console.log(`Removed id: ${id}`);
  setStorage("cart", state.cart);
}

export function setItem(id, number) {
  console.log("setItem function runs");
  console.log(`Set item id: ${id}`);
  setStorage("cart", state.cart);
}

export const getCartTotal = () => {
  return state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};
