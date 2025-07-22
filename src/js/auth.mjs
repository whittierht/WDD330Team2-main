import { loginRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const tokenKey = "so-token";

function isTokenValid(token) {
    if (token) {

        const decoded = jwtDecode(token);

        let currentDate = new Date();

        if (decoded.exp * 1000 < currentDate.getTime()) {

        console.log("Token expired.");
        return false;
        } else {

        console.log("Valid token");
        return true;
        }

    } else return false;
}

export function checkLogin() {
  const token = getLocalStorage(tokenKey);

  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.removeItem(tokenKey);

    const location = window.location;

    console.log(location);

    window.location = `/login/index.html?redirect=${location.pathname}`;
  } else return token; 
}

export async function login(creds, redirect = "/") {
  try {
    const token = await loginRequest(creds);
    console.log("Token received from loginRequest:", token);

    setLocalStorage(tokenKey, token);
    console.log("Saved token:", getLocalStorage(tokenKey));

   
    setTimeout(() => {
      window.location = redirect;
    }, 100); 

  } catch (error) {
    console.error("login failed:", error);
    alertMessage(error.message?.message || "Login failed.");
  }
}


