

import { loadHeaderFooter } from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";


loadHeaderFooter().then(() => {
  shoppingCart(); // only runs on cart page

 // Add event listener for checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Check if cart is not empty
      const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
      if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items before checkout.");
        return;
      }
      window.location.href = "/checkout/";
    });
  }
});
