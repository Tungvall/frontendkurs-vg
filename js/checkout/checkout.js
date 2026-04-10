import { state } from "../states.js";
import { pattern } from "./patterns.js";
import { getCartTotal } from "./cart.js";
import { initClickEvents } from "../events.js";
import { renderReceipt } from "./receiptView.js";
import { getProductImage, formatPrice, getStorage } from "../shared.js";

const checkoutProduct = document.getElementById("checkout-product");
const checkoutForm = document.getElementById("checkout-form");
const submitCartButton = document.getElementById("submitCart");
const formMessage = document.getElementById("form-message");
const userInformation = document.getElementById("user-information");

const formState = {
  name: false,
  email: false,
  phone: false,
  street: false,
  postal: false,
  city: false,
};
const messageState = {
  name: "Fel namn",
  email: "Fel epost",
  phone: "Fel nummer",
  street: "Fel street",
  postal: "Fel postal",
  city: "Fel city",
};

let selectedProduct = null;

const renderProductMessage = (message) => {
  if (!checkoutProduct) {
    return;
  }

  checkoutProduct.replaceChildren();

  const text = document.createElement("p");
  text.className = "border-2 border-black bg-yellow-100 p-4 font-bold";
  text.textContent = message;

  checkoutProduct.appendChild(text);
};

const renderFormMessage = (message, success = false) => {
  if (!formMessage) {
    return;
  }

  formMessage.textContent = message;
  formMessage.className = [
    "mt-4 border-2 border-black p-4 font-bold ",
    success ? "bg-green-200 text-black" : "bg-pink-100 text-black",
  ].join(" ");
};

const renderProduct = (product) => {
  if (!checkoutProduct) {
    return;
  }

  checkoutProduct.replaceChildren();

  const article = document.createElement("article");
  article.className = "border-2 border-black bg-blue-100 p-5 ";

  const imageUrl = getProductImage(product);

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = product.title ?? "Produktbild";
    img.className = "mb-4 h-56 w-full object-contain";
    article.appendChild(img);
  }

  const title = document.createElement("h3");
  title.className = "mt-2 text-xl font-black";
  title.textContent = product.title ?? "Okänd produkt";

  const category = document.createElement("p");
  category.className = "text-xs font-black uppercase text-red-600";
  category.textContent = product.category ?? "okänd";

  const description = document.createElement("p");
  description.className = "mt-3 text-sm leading-6 text-gray-700";
  description.textContent =
    product.description ?? "Ingen beskrivning tillgänglig.";

  const price = document.createElement("div");
  price.className = "text-md";
  price.textContent = formatPrice(product.price);

  const quantity = document.createElement("div");
  quantity.className = "text-md";
  quantity.textContent = `Antal produkter: ${product.quantity}`;

  const totalPrice = document.createElement("div");
  totalPrice.className = "font-black mt-4 text-lg";

  const totalSum = formatPrice(getCartTotal());
  totalPrice.textContent = `Totalt att betala: ${totalSum}`;

  const summary = document.createElement("div");

  summary.append(quantity, price, totalPrice);

  article.appendChild(category);
  article.appendChild(title);
  article.appendChild(description);

  checkoutProduct.appendChild(article);
  checkoutProduct.appendChild(summary);
};

const createCartItem = (item) => {
  const card = document.createElement("div");
  card.className = "flex items-center gap-3 p-2 h-20 border rounded-lg";
  card.dataset.id = item.id;

  const img = document.createElement("img");
  img.className = "w-16 h-16 bg gray-200 rounded-md";
  img.src = getProductImage(item);
  img.alt = item.title ?? "Bild saknas";

  const info = document.createElement("div");
  info.className = "flex flex-col justify-center flex-1";

  const title = document.createElement("div");
  title.className = "text-sm font-medium";
  title.textContent = item.title;

  const price = document.createElement("div");
  price.className = "text-sm text-gray-600";
  price.textContent = item.price;

  info.appendChild(title);
  info.appendChild(price);

  const quantity = document.createElement("div");
  quantity.className = "flex items-center gap-1";

  const decrement = document.createElement("div");
  decrement.className =
    "py-2 w-9 flex-center hover:bg-sky-400 text-black rounded text-center cursor-pointer";
  decrement.dataset.action = "decrement";
  decrement.textContent = "-";

  const input = document.createElement("input");
  input.className =
    "text-center w-9 h-10 text-center border-1 border-gray-700 focus:border-pink-600";
  input.dataset.action = "input";
  input.value = item.quantity;

  const increment = document.createElement("button");
  increment.className =
    "py-2 w-9 flex-center hover:bg-sky-400 text-black rounded text-center cursor-pointer";
  increment.dataset.action = "increment";
  increment.textContent = "+";

  quantity.appendChild(decrement);
  quantity.appendChild(input);
  quantity.appendChild(increment);

  const remove = document.createElement("div");
  remove.className =
    "w-6 h-6 flex-right justify-ceneter bg-red-400 text-black rounded text-center cursor-pointer";
  remove.dataset.action = "remove";
  remove.textContent = "x";

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(quantity);
  card.appendChild(remove);

  return card;
};

export function renderCart() {
  checkoutProduct.innerHTML = "";

  state.cart.forEach((item) => {
    checkoutProduct.appendChild(createCartItem(item));
  });

  // const totalPrice = document.createElement("div");
  // totalPrice.className = "font-black mt-4 text-lg";

  // const totalSum = formatPrice(getCartTotal());
  // totalPrice.textContent = `Totalt att betala: ${totalSum}`;

  // const summary = document.createElement("div");

  // summary.append(quantity, price, totalPrice);

  // article.appendChild(category);
  // article.appendChild(title);
  // article.appendChild(description);

  // checkoutProduct.appendChild(article);
  // checkoutProduct.appendChild(summary);
}

const init = () => {
  initClickEvents();
  state.cart = getStorage("cart") || [];

  document.title = `Checkout - Grupp 10`;
  console.log(state.cart.length);
  if (!state.cart.length) {
    document.title = "Ingen produkt vald - Grupp 10";
    renderProductMessage("Inga produkter i din varukorg");
    return;
  }
  console.table(state.cart);
  if (state.cart.length === 1) {
    renderProduct(state.cart[0]);
  } else if (state.cart.length > 1) {
    renderCart(state.cart);
  }
};

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customer = getCustomerData(checkoutForm);

    Object.keys(formState).forEach((key) => {
      formState[key] = false;

      userInformation.innerHTML = renderReceipt(customer);
      submitCartButton.disabled = true;
      // checkoutForm.reset();
    });
  });

  checkoutForm.addEventListener("input", (e) => {
    const input = e.target.closest("[data-validate]");
    if (!input) return;

    validate(input);
  });
}

function validate(input) {
  if (!input) return;

  const inputField = input.dataset.validate;
  const isValid = pattern[inputField].test(input.value);
  formState[inputField] = isValid;

  if (!isValid) {
    renderFormMessage(messageState[inputField]);
  } else {
    renderFormMessage("Fyll i dina uppgifter för att slutföra köpet.");
  }

  input.classList.toggle("bg-green-100", isValid);
  input.classList.toggle("bg-red-200", !isValid);

  updateButton();
}

function updateButton() {
  if (Object.values(formState).every(Boolean)) {
    submitCartButton.disabled = false;
  } else {
    submitCartButton.disabled = true;
  }
}

function getCustomerData(checkoutForm) {
  return {
    name: checkoutForm.name.value,
    email: checkoutForm.email.value,
    phone: checkoutForm.phone.value,
    street: checkoutForm.street.value,
    postal: checkoutForm.postal.value,
    city: checkoutForm.city.value,
  };
}

renderFormMessage("Fyll i dina uppgifter för att slutföra köpet.");
init();
