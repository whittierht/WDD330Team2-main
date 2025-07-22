import { productList } from "./productList.mjs";
import { loadHeaderFooter, updateCartIconCount, getCurrentUser } from "./utils.mjs";
import { showWelcomeModal } from "./welcomeBanner.js";



productList(".product-list", "tents");

loadHeaderFooter().then(() => {
  updateCartIconCount(); 
  showUserGreeting();
});

function showUserGreeting() {
  const user = getCurrentUser();
  const greetingElement = document.getElementById("user-greeting");
  const loginLink = document.getElementById("login");
  const signupLink = document.getElementById("signup");
  
  if (user) {
    if (greetingElement) {
      greetingElement.textContent = `Hello, ${user.firstName}!`;
    }
    if (loginLink) {
      loginLink.textContent = "Logout";
      loginLink.href = "#";
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("so-user");
        window.location.href = "/";
      });
    }
    if (signupLink) {
      signupLink.style.display = "none";
    }
  } else {
    if (greetingElement) {
      greetingElement.textContent = "";
    }
    if (loginLink) {
      loginLink.textContent = "Login";
      loginLink.href = "/login/";
    }
    if (signupLink) {
      signupLink.style.display = "inline";
    }
  }
}

const form = document.getElementById("newsletter-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    // TODO: send `email` to your newsletter backend
    const email = document.getElementById("newsletter-email").value;
    alert(`Thanks for subscribing, ${email}!`);
    form.reset();
  });
}


// Show Modal
showWelcomeModal();
