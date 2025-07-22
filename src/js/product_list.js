import { productList } from "./productList.mjs";
import { getParam, loadHeaderFooter, updateCartIconCount } from "./utils.mjs";

const category = getParam("category");

if (!category) {
  alert("Missing category in URL. Redirecting to home.");
  window.location.href = "/"; // or show an error message
} else {
  productList(".product-list", category);
}

loadHeaderFooter().then(() => {
  updateCartIconCount(); 
});



// import productList from "./productList.mjs";



