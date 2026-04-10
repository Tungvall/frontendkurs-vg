import { state } from "../state.js";
import { getCartTotal } from "./cart.js";

export function renderReceipt(customer) {
  const date = new Intl.DateTimeFormat("sv-SE").format(new Date());
  const cartTotalCost = getCartTotal();
  const itemCard = state.cart
    .map(
      (item) => `
        <div class="flex flex-row m-2 border-2 border-solid mt-8>
            <div class="w-5/6 flex flex-row" >
                <div class="basis-12"><img src=${item.image} class="w-16 h-16 place-content-center"></div>
                <div class=" place-content-center ml-6">${item.price} kr</div>
                <div class="basis-64 place-content-center ml-6">${item.title}</div>
                <div class="basis 64 place-content-center ml-6">${item.category}</diV>
                <div class="basis-64 place-content-center mr-5 text-right">Artikel ID: ${item.id}</div>
            </div>
            </div>
            </div>
            `,
    )
    .join();
  state.cart = [];
  localStorage.clear();
  return `
          <div class="bg-white">
          <h2 class="text-2xl font-black text-red-600">Kvitto</h2>
          
          <div class="mr-40 mb-8 text-sm leading-tight flex flex-col gap-0.5 justify-self-end" >
          <div>${date}</div>
          <div>${customer.name}</div>
          <div>${customer.email}</div>
          <div>${customer.phone}</div>
          <div>${customer.street}</div>
          <div>${customer.postal} ${customer.city}</div>
          </div>
          
          ${itemCard}
          
          <div>Summa totalt: ${cartTotalCost} kr</div>
  `;
}
