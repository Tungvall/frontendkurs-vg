import { pattern } from "./patterns.js";
import { getCartTotal } from "./cart.js";
import { renderReceipt } from "./receiptView.js";
import { getProductImage, formatPrice, getStorage } from "../shared.js";
import { state } from "../state.js";

const checkoutProduct = document.getElementById("checkout-product");
const checkoutForm = document.getElementById("checkout-form");
const submitCartButton = document.getElementById("submitCart");
const formMessage = document.getElementById("form-message");
const userInformation = document.getElementById("user-information");
const container = document.getElementById("product-list");

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
  decrement.dataset.id = item.id;
  decrement.textContent = "-";

  const input = document.createElement("input");
  input.className =
    "text-center w-9 h-10 text-center border-1 border-gray-700 focus:border-pink-600";
  input.dataset.action = "input";
  input.dataset.id = item.id;
  input.value = item.quantity;

  const increment = document.createElement("div");
  increment.className =
    "py-2 w-9 flex-center hover:bg-sky-400 text-black rounded text-center cursor-pointer";
  increment.dataset.action = "increment";
  increment.dataset.id = item.id;
  increment.textContent = "+";

  quantity.appendChild(decrement);
  quantity.appendChild(input);
  quantity.appendChild(increment);

  const remove = document.createElement("div");
  remove.className =
    "w-6 h-6 flex-right justify-ceneter bg-red-400 text-black rounded text-center cursor-pointer";
  remove.dataset.action = "remove";
  remove.dataset.id = item.id;
  remove.textContent = "x";

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(quantity);
  card.appendChild(remove);

  return card;
};

export function renderCart() {
  container.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "mx-auto w-full max-w-5xl grid gap-8  items-start";

  const left = document.createElement("div");
  left.id = "checkout-left";

  state.cart.forEach((item) => {
    left.appendChild(createCartItem(item));
  });

  const right = document.createElement("div");
  right.id = "checkout-right";

  right.innerHTML = `
    <h2 class="text-2xl font-black text-red-600">Dina uppgifter</h2>

    <form id="checkout-form" class="mt-4 flex flex-col gap-4">

      <div>
        <label class="mb-2 block text-sm font-black">Namn</label>
        <input name="name" data-validate="name"
          class="w-full rounded-2xl border-4 border-black bg-yellow-500/20 px-4 py-3 font-medium outline-none" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-black">E-post</label>
        <input name="email" data-validate="email"
          class="w-full rounded-2xl border-4 border-black bg-yellow-500/20 px-4 py-3 font-medium outline-none" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-black">Telefon</label>
        <input name="phone" data-validate="phone"
          class="w-full rounded-2xl border-4 border-black bg-yellow-500/20 px-4 py-3 font-medium outline-none" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-black">Gatuadress</label>
        <input name="street" data-validate="street"
          class="w-full rounded-2xl border-4 border-black bg-yellow-500/20 px-4 py-3 font-medium outline-none" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-black">Postnummer</label>
        <input name="postal" data-validate="postal"
          class="w-full rounded-2xl border-4 border-black bg-yellow-500/20 px-4 py-3 font-medium outline-none" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-black">Ort</label>
        <input name="city" data-validate="city"
          class="w-full rounded-2xl border-4 border-black bg-yellow-500/20 px-4 py-3 font-medium outline-none" />
      </div>

      <button id="submitCart" type="submit" disabled
        class="inline-flex w-fit items-center rounded-2xl border-4 border-black bg-green-500 px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#000] disabled:opacity-50">
        Slutför köp
      </button>

    </form>

    <p id="form-message" class="mt-4"></p>
  `;
  layout.append(left, right);

  container.className =
    "mx-auto w-full max-w-6xl grid gap-10 lg:grid-cols-2 items-start";
  container.appendChild(layout);
}

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
