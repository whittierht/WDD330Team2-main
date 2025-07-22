
import { findProductById, getProductsByCategory } from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// three functions are recommended: productDetails(productId), addToCart() -moved from the 
// product.js, and renderProductDetails().

//This function will become the entrypoint into our module and will make sure that 
// everything happens in the right order. This function should be the default export.
let product = {};

export default async function productDetails(productId) {
    try {
      product = await findProductById(productId);
  
      if (!product || !product.Id) {
        throw new Error("Product not found.");
      }
  
      renderProductDetails();
      

      const addButton = document.getElementById("addToCart");
      if (addButton) {
        addButton.addEventListener("click", addToCart);
        addButton.style.display = "block";
      }
  
    } catch (error) {
      console.error("Error loading product:", error);
  
      const existingError = document.getElementById("dynamic-error");
      if (!existingError) {
        const errorMessage = document.createElement("p");
        errorMessage.id = "dynamic-error";
        errorMessage.textContent = "This item couldn’t be found. Please try again or select a different product.";
        errorMessage.style.color = "red";
        errorMessage.style.margin = "1em 0";
  
        const referenceNode = document.getElementById("addToCart");
        if (referenceNode && referenceNode.parentNode) {
          referenceNode.parentNode.insertBefore(errorMessage, referenceNode);
        }
      }
  
      // Hide  button
      const addButton = document.getElementById("addToCart");
      if (addButton) {
        addButton.style.display = "none";
      }
    }
  }


function addToCart() {
  let cart = getLocalStorage("so-cart") || [];
  const existingItem = cart.find(item => item.Id === product.Id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  setLocalStorage("so-cart", cart);
  alert(`${product.Brand.Name} was successfully added!`)
  window.location.reload();
  
}



// method to fill in the details for the current product in the HTML.
function renderProductDetails() {
  const discountPercentage = ((product.SuggestedRetailPrice - product.ListPrice) / product.SuggestedRetailPrice) * 100;
  document.querySelector("#productName").textContent = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").textContent = product.NameWithoutBrand;
   document.querySelector("#productImage").src = product.Images.PrimaryLarge;  
  document.querySelector("#productImage").alt = product.Name; 
  document.querySelector("#productSuggestedRetailPrice").textContent = "$" + product.SuggestedRetailPrice.toFixed(2);
  document.querySelector("#productFinalPrice").textContent = "$" + product.FinalPrice;
  document.querySelector("#productDiscountPercent").textContent = "Save " + discountPercentage.toFixed(0) + "%!";
  document.querySelector("#productColorName").textContent = "Color: " + product.Colors[0].ColorName;
  document.querySelector("#productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.querySelector("#addToCart").dataset.id = product.Id;

  renderColorSwatches(product.Colors);
}

/* product name,  product without brand, product image source, product image alt, productFinalPrice, productColorName, productDescriptionHtmlSimple, addToCart */

// Handles Add to Cart clicks

function getRandomProducts(products, count) {
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function displayRecommendedProducts() {
  const categories = ['tents', 'backpacks', 'sleepingbags', 'hammocks'];


  const productArrays = await Promise.all(categories.map(getProductsByCategory));


  const allProducts = productArrays.flat();


  const recommendedProducts = getRandomProducts(allProducts, 3);


  const recommendedDivs = document.querySelectorAll('.recommended-product');
  recommendedProducts.forEach((product, index) => {
    const container = recommendedDivs[index];
    container.querySelector('.rproductName').textContent = product.Brand.Name;
    container.querySelector('.rproductNameWithoutBrand').textContent = product.NameWithoutBrand;
    container.querySelector('.rproductImage').src = product.Images.PrimaryMedium;
    container.querySelector('.rproductImage').alt = `Image of ${product.Name}`;


    container.querySelector('.rproductLink').href = `/product_pages/index.html?product=${product.Id}`;
  });
}


function renderColorSwatches(colors) {
  const swatchContainer = document.getElementById("colorSwatches");
  swatchContainer.innerHTML = "";

  colors.forEach((color, index) => {
    const swatch = document.createElement("img");
    swatch.src = color.ColorChipImageSrc;
    swatch.alt = color.ColorName;

    if (index === 0) swatch.classList.add("selected");

    swatch.addEventListener("click", () => {
      swatchContainer.querySelectorAll("img").forEach(i => i.classList.remove("selected"));
      swatch.classList.add("selected");

      document.querySelector("#productColorName").textContent = "Color: " + color.ColorName;
    });

    swatchContainer.appendChild(swatch);

    if (index === 0) {
      setTimeout(() => swatch.click(), 0);
    }
  });
}





document.addEventListener('DOMContentLoaded', displayRecommendedProducts);