import { state } from "../main.js";
import { setStorage } from "../shared.js";

export function incrementItem(id) {
  const product = state.products.find((p) => p.id === Number(id));
  if (!product) return;

  const added = state.cart.find((p) => p.id === Number(id));

  if (added) {
    added.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  console.log("CART STATE:", state.cart);

  setStorage("cart", state.cart);
}

export function decrementItem(id) {
  const item = state.cart.find((p) => p.id === Number(id));
  if (!item) return;

  if (item.quantity > 1) return;
  item.quantity -= 1;

  console.log("CART STATE:", state.cart);
  setStorage("cart", state.cart);
}

export function removeItem(id) {
  console.log(`Removed id: ${id}`);
  setStorage("cart", state.cart);
}

export function setItem(id, number) {
  console.log(`Set item id: ${id}`);
  setStorage("cart", state.cart);
}
