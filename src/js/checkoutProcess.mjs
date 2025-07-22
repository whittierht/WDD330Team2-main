import { getLocalStorage } from "./utils.mjs";
import { checkout as checkoutProccess } from "./externalServices.mjs";
import { alertMessage, removeAllAlerts } from "./utils.mjs";

function packageItems(items) {
  return items.map(item => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1
  }));
}

export default class checkoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = getLocalStorage(key) || [];
    this.itemTotal = 0;
    this.itemCount = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.calculateOrdertotal();
  }

  calculateItemSummary() {
    const cartItems = getLocalStorage("so-cart") || [];
    const orderItemsContainer = document.getElementById("order-items");
    const subtotalElement = document.getElementById("subtotal");

    if (cartItems.length === 0) {
      orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let subtotal = 0;
    const itemsHtml = cartItems
      .map((item) => {
        const itemTotal = item.FinalPrice * (item.quantity || 1);
        subtotal += itemTotal;

        return `
        <div class="order-item">
          <div class="item-info">
            <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
            <span>${item.Name} (x${item.quantity || 1})</span>
            <span>$${itemTotal.toFixed(2)}</span>
          </div>
        </div>
      `;
      })
      .join("");

    orderItemsContainer.innerHTML = itemsHtml;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  }

  calculateOrdertotal() {
    const subtotalText = document.getElementById("subtotal").textContent || "$0";
    const subtotalValue = parseFloat(subtotalText.replace("$", "")) || 0;

    this.shipping = 12;  // as required by the instructions example
    this.tax = parseFloat((subtotalValue * 0.08).toFixed(2));
    this.orderTotal = parseFloat(
      (subtotalValue + this.shipping + this.tax).toFixed(2)
    );

    document.getElementById("shipping").textContent = `$${this.shipping.toFixed(
      2
    )}`;
    document.getElementById("tax").textContent = `$${this.tax.toFixed(2)}`;
    document.getElementById("total").textContent = `$${this.orderTotal.toFixed(
      2
    )}`;
  }

  async checkout(form) {
    const formData = new FormData(form);
    const cartItems = getLocalStorage(this.key) || [];
    const packagedItems = packageItems(cartItems);

    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: formData.get("cardNumber"),
      expiration: formData.get("expiration"),
      code: formData.get("code"),
      items: packagedItems,
      orderTotal: document.getElementById("total").textContent.replace("$", ""),
      shipping: this.shipping,
      tax: document.getElementById("tax").textContent.replace("$", "")
    };

    console.log("Submitting order:", orderData);


    //checkoutProccess
    try {
      const response = await checkoutProccess(orderData);
      console.log("Order response:", response);
      //alert("Order placed successfully!");
      window.location.href = "/checkout/success.html";
      localStorage.removeItem(this.key);
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
    }
  }
}


