import { state } from "../state.js";
import { setStorage } from "../shared.js";
import { renderCart } from "./checkout.js";

export function addToCart(id) {
  console.log("Add to cart function runs");
  const product = state.products.find((p) => p.id === Number(id));
  if (!product) return;

  const added = state.cart.find((p) => p.id === Number(id));

  if (added) {
    added.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  setStorage("cart", state.cart);
}

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

  renderCart();
  setStorage("cart", state.cart);
}

export function decrementItem(id) {
  const item = state.cart.find((p) => p.id === Number(id));
  if (!item) return;

  if (item.quantity <= 1) {
    state.cart = state.cart.filter((p) => p.id !== Number(id));
  } else {
    item.quantity -= 1;
  }

  renderCart();
  setStorage("cart", state.cart);
}

export function removeItem(id) {
  state.cart = state.cart.filter((item) => item.id !== Number(id));

  renderCart();
  setStorage("cart", state.cart);
}

export function setItem(id, number) {
  console.log("setItem function runs");
  console.log(`Set item id: ${id}`);
  setStorage("cart", state.cart);
  renderCart();
}

export const getCartTotal = () => {
  return state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};
