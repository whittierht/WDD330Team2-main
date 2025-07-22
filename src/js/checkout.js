import checkoutProcess from "./checkoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {

  const checkoutProcessInstance = new checkoutProcess("so-cart", "#order-summary");

  checkoutProcessInstance.init();

  const checkoutForm = document.getElementById("checkout-form");
  if (!checkoutForm) {
    console.warn("Could not find #checkout-form in the DOM.");
    return;
  }


  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var chk_status = checkoutForm.checkValidity();
    checkoutForm.reportValidity();
    if(chk_status) 
      checkoutProcessInstance.checkout(checkoutForm);
  });
});
