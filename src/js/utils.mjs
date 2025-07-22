// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector passed to qs(): "${selector}"`, error);
    return null;
  }
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value; 
  }
}
// save data to local storage
export function setLocalStorage(key, data) {
  const value = typeof data === "string" ? data : JSON.stringify(data);
  localStorage.setItem(key, value);
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function updateCartIconCount() {
  const count = getCartItemCount();
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true){
    if (clear) {
      parentElement.innerHTML = "";
    }
    const htmlStrings =  list.map(templateFn);
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
    } 

  export function getCartItemCount() {
  const cart = getLocalStorage("so-cart") || [];
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export async function renderWithTemplate(templateFn, parentElement, data, callback, position = "afterbegin", clear = true){
    if (clear) {
      parentElement.innerHTML = "";
    }

    const htmlStrings = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlStrings);

    if(callback) {
      callback(data)
    }
}

function loadTemplate(path) {

    return async function () {
        const res = await fetch(path);
        if (res.ok) {
        const html = await res.text();
        return html;
        }
    };
} 



export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    headerElement.innerHTML = ""; // <-- Clear static HTML if exists
    await renderWithTemplate(headerTemplateFn, headerElement);
  }
  if (footerElement) {
    footerElement.innerHTML = ""; // <-- Clear static HTML if exists
    await renderWithTemplate(footerTemplateFn, footerElement);
  }
}

// Add these to your existing utils.mjs

export function getCurrentUser() {
  return getLocalStorage("so-user");
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export function logout() {
  localStorage.removeItem("so-user");
  window.location.href = "/";
}


export function alertMessage(message, scroll = true) {
  // create element to hold our alert
  const main = document.querySelector("main");
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = ` <p>${message}</p>
  <button class="close-alert"><span>X</span></button>`

  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener("click", function(e) {
      if(e.target.tagName === "BUTTON" && e.target.classList.contains("close-alert") ) { // how can we tell if they clicked on our X or on something else?  hint: check out e.target.tagName or e.target.innerText
        main.removeChild(this);
      }
  })
  // add the alert to the top of main

  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if(scroll)
    window.scrollTo(0,0);

}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}
