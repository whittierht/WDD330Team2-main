import { loadHeaderFooter, getLocalStorage, setLocalStorage, getCurrentUser, updateCartIconCount } from "./utils.mjs";

export default function wishlist() {
  loadHeaderFooter().then(() => {
    renderWishlist();
    updateCartIconCount(); 
  });
}

function renderWishlist() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "/login/";
    return;
  }

  const wishlist = getLocalStorage(`so-wishlist-${user.id}`) || [];
  const wishlistContainer = document.querySelector(".wish-list");

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlistContainer.innerHTML = wishlist.map(item => `
    <li class="wish-card divider">
      <a href="/product_pages/index.html?product=${item.Id}" class="wish-card__image">
        <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
      </a>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="wish-card__price">$${item.FinalPrice}</p>
      <div class="wish-card__actions">
        <button class="add-to-cart" data-id="${item.Id}">Add to Cart</button>
        <button class="remove-from-wishlist" data-id="${item.Id}">Remove</button>
      </div>
    </li>
  `).join("");

  // Set up event listeners
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      moveToCart(productId);
    });
  });

  document.querySelectorAll(".remove-from-wishlist").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      removeFromWishlist(productId);
    });
  });
}

function moveToCart(productId) {
  const user = getCurrentUser();
  if (!user) return;

  let wishlist = getLocalStorage(`so-wishlist-${user.id}`) || [];
  let cart = getLocalStorage("so-cart") || [];

  const itemIndex = wishlist.findIndex(item => item.Id === productId);
  if (itemIndex === -1) return;

  const item = wishlist[itemIndex];
  
  // Add to cart
  const existingCartItem = cart.find(cartItem => cartItem.Id === productId);
  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    item.quantity = 1;
    cart.push(item);
  }

  // Remove from wishlist
  wishlist.splice(itemIndex, 1);

  // Update storage
  setLocalStorage("so-cart", cart);
  setLocalStorage(`so-wishlist-${user.id}`, wishlist);

  // Re-render
  renderWishlist();
}

function removeFromWishlist(productId) {
  const user = getCurrentUser();
  if (!user) return;

  let wishlist = getLocalStorage(`so-wishlist-${user.id}`) || [];
  wishlist = wishlist.filter(item => item.Id !== productId);

  setLocalStorage(`so-wishlist-${user.id}`, wishlist);
  renderWishlist();
}

// Initialize wishlist
wishlist();
