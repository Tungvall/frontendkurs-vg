import { saveStoredProducts, formatPrice, getStorage } from "./shared.js";
import { render, ui } from "./render.js";
import { renderCart } from "./checkout/checkout.js";
import { state } from "./state.js";
import {
  decrementItem,
  incrementItem,
  removeItem,
  addToCart,
} from "./checkout/cart.js";

state.cart = getStorage("cart") || [];

const PRODUCTS_API = "https://fakestoreapi.samuelsson.sh/products";

async function loadItems() {
  if (ui.productList) {
    ui.productList.innerHTML =
      '<p class="border-2 border-black bg-white p-4 font-bold ">Laddar produkter...</p>';
  }

  try {
    const response = await fetch(PRODUCTS_API);

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    const result = await response.json();

    const products = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : [];

    state.products = products.map((product) => ({
      ...product,
      id: Number(product.id),
      price: Number(product.price),
    }));

    saveStoredProducts(state.products);
    render(state);
  } catch (error) {
    console.error("Error loading items:", error);

    if (ui.productList) {
      ui.productList.innerHTML =
        '<p class="border-2 border-black bg-white p-4 font-bold ">Could not load products.</p>';
    }
  }
}

function setupPageEvents() {
  ui.categoryList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) {
      return;
    }

    state.selectedCategory = button.dataset.category;
    render(state);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const { action, id } = button.dataset;

    actions[action]?.(id);
    console.log("DATASET:", button.dataset);
  });
}

const actions = {
  addToCart: (id) => addToCart(id),
  increment: (id) => incrementItem(id),
  decrement: (id) => decrementItem(id),
  remove: (id) => removeItem(id),
  set: (id, number) => setItem(id, number),
  checkout: (id) => renderCart(),
};

setupPageEvents();
loadItems();
