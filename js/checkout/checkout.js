import { getProductImage, getStoredProducts } from "../shared.js";
import { pattern } from "./patterns.js";
import { renderReceipt } from "./receiptView.js";
import { state } from "../main.js";

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

  const category = document.createElement("p");
  category.className = "text-xs font-black uppercase text-red-600";
  category.textContent = product.category ?? "okänd";

  const title = document.createElement("h3");
  title.className = "mt-2 text-xl font-black";
  title.textContent = product.title ?? "Okänd produkt";

  const description = document.createElement("p");
  description.className = "mt-3 text-sm leading-6 text-gray-700";
  description.textContent =
    product.description ?? "Ingen beskrivning tillgänglig.";

  const price = document.createElement("p");
  price.className = "mt-4 text-lg font-black text-blue-700";
  price.textContent = product.price;
  const quantity = document.createElement("p");
  quantity.className = "mt-4 text-lg font-black text-blue-700";
  quantity.textContent = product.quantity;

  article.appendChild(category);
  article.appendChild(title);
  article.appendChild(description);
  checkoutProduct.appendChild(price);
  checkoutProduct.appendChild(quantity);

  checkoutProduct.appendChild(article);
};

const init = () => {
  document.title = `Checkout - Grupp 10`;
  if (!state.cart.length) {
    document.title = "Ingen produkt vald - Grupp 10";
    renderProductMessage("Inga produkter i din varukorg");
    return;
  }
  console.table(state.cart);
  if (state.cart.length === 1) {
    renderProduct(state.cart[0]);
  } else if (state.cart.length > 1) {
    renderCart(customer);
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
