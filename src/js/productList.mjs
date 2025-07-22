import { getProductsByCategory } from "./externalServices.mjs";
import { renderListWithTemplate } from "./utils.mjs";

let currentSelector = null;
let currentCategory = null;

function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
    <img
      src="${product.Images.PrimaryMedium}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
    <p class="product-card__suggestedprice">$${product.SuggestedRetailPrice.toFixed(2)}</p></a>
    <button class="quick-look" data-id="${product.Id}">🔍</button>

  </li>`
}  

export async function productList(selector, category) {
    
    currentSelector = selector;
    currentCategory = category;
    // get the element we will insert the list into from the selector
    const elem = document.querySelector(selector);
    // get the list of products 
    const products = await getProductsByCategory(category);
    console.log(products);
    // const limited = products.slice(0, 4);
    // render out the product list to the element
    // renderListWithTemplate(productCardTemplate, elem, limited);
    renderListWithTemplate(productCardTemplate, elem, products);
    document.querySelector(".title").innerHTML = category;
    initQuickLook(products);
}

//alphabetical sort
const sortButton = document.querySelector(".sort-btn")

async function handleSortedAlphabetList(selector, category) {
    const elem = document.querySelector(selector);
    const products = await getProductsByCategory(category);

    products.sort((a,b) =>
      a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
    );
    console.log(products);

    elem.innerHTML = "";
    renderListWithTemplate(productCardTemplate, elem, products);
    document.querySelector(".title").innerHTML = category;
    initQuickLook(products);
}

if (sortButton) {
  sortButton.addEventListener("click", () => {
    handleSortedAlphabetList(currentSelector, currentCategory);
  });
}

const sortButton4 = document.querySelector(".sort-btn4")

async function handleSortedAlphabetZList(selector, category) {
    const elem = document.querySelector(selector);
    const products = await getProductsByCategory(category);

    products.sort((a,b) =>
      b.NameWithoutBrand.localeCompare(a.NameWithoutBrand)
    );
    console.log(products);

    elem.innerHTML = "";
    renderListWithTemplate(productCardTemplate, elem, products);
    document.querySelector(".title").innerHTML = category;
    initQuickLook(products);
}

if (sortButton4) {
  sortButton4.addEventListener("click", () => {
    handleSortedAlphabetZList(currentSelector, currentCategory);
  });
}


//lowest price sort
const sortButton2 = document.querySelector(".sort-btn2")

async function handleSortedPriceList(selector, category) {
    const elem = document.querySelector(selector);
    const products = await getProductsByCategory(category);

    products.sort((a,b) =>
      a.FinalPrice- b.FinalPrice
    );
    console.log(products);

    elem.innerHTML = "";
    renderListWithTemplate(productCardTemplate, elem, products);
    document.querySelector(".title").innerHTML = category;
    initQuickLook(products);
}

if (sortButton2) {
  sortButton2.addEventListener("click", () => {
    handleSortedPriceList(currentSelector, currentCategory);
  });
}

const sortButton3 = document.querySelector(".sort-btn3")

async function handleSortedHighPriceList(selector, category) {
    const elem = document.querySelector(selector);
    const products = await getProductsByCategory(category);

    products.sort((a,b) =>
      a.FinalPrice + b.FinalPrice
    );
    console.log(products);

    elem.innerHTML = "";
    renderListWithTemplate(productCardTemplate, elem, products);
    document.querySelector(".title").innerHTML = category;
    initQuickLook(products);
}

if (sortButton3) {
  sortButton3.addEventListener("click", () => {
    handleSortedHighPriceList(currentSelector, currentCategory);
  });
}

//highest price sort

function initQuickLook(products) {
  const modal     = document.querySelector(".modal");
  const closeBtn  = modal.querySelector(".modal-close2");
  
  document.querySelectorAll(".quick-look").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const prod = products.find(p => p.Id === id);
      if (!prod) return;
      
      renderProductDetails(prod);
      modal.classList.remove("hidden");

      const viewLink = modal.querySelector("#viewDetails");
      viewLink.href = `/product_pages/index.html?product=${prod.Id}`;

      modal.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

//this is for the modal for quicklook
function renderProductDetails(product) {
  const discountPercentage = 
    ((product.SuggestedRetailPrice - product.ListPrice)
      / product.SuggestedRetailPrice) * 100;

  document.querySelector("#productName").textContent = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").textContent = 
    product.NameWithoutBrand;
  document.querySelector("#productImage").src = 
    product.Images.PrimaryLarge;
  document.querySelector("#productImage").alt = product.Name;
  document.querySelector("#productSuggestedRetailPrice").textContent = 
    "$" + product.SuggestedRetailPrice.toFixed(2);
  document.querySelector("#productFinalPrice").textContent = 
    "$" + product.FinalPrice;
  document.querySelector("#productDiscountPercent").textContent = 
    "Save " + discountPercentage.toFixed(0) + "%!";
  document.querySelector("#productColorName").textContent =
    "Colors: " + product.Colors[0].ColorName;
  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;
}

