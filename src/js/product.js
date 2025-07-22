
/*Import in the code we need from our modules. Then we get the id of our product using our helper 
function getParams. Then we use the function from productDetails with the productId to 
finish setting everything up. */
// import { setLocalStorage, getLocalStorage} from "./utils.mjs";
import { getParam } from "./utils.mjs";
// import { findProductById } from "./productData.mjs";
import productDetails from "./productDetails.mjs";
import {updateCartIconCount } from "./utils.mjs";

const productId = getParam("product");
productDetails(productId);

updateCartIconCount(); 





// function addProductToCart(product) {
//   let currentCart = getLocalStorage("so-cart") || [];
//   currentCart.push(product);
//   setLocalStorage("so-cart", currentCart);
// }

// add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);

 
  
  