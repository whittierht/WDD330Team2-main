import { loginRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const tokenKey = "so-token";

function isTokenValid(token) {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      console.warn("No valid token structure.");
      return false;
    }

    const decoded = jwtDecode(token);
    const currentDate = new Date();

    if (decoded.exp * 1000 < currentDate.getTime()) {
      console.log("Token expired.");
      return false;
    } else {
      console.log("Valid token.");
      return true;
    }
  } catch (e) {
    console.error("Token decoding failed:", e);
    return false;
  }
}

export function checkLogin() {
  const token = getLocalStorage(tokenKey);
  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.removeItem(tokenKey);
    const location = window.location;

    if (!location.pathname.includes("/login")) {
      window.location = `/login/index.html?redirect=${location.pathname}`;
    } else {
      window.location = "/login/index.html";
    }
  } else {
    return token;
  }
}

export async function login(creds, redirect = "/") {
  try {
    const token = await loginRequest(creds);
    console.log("Token received from loginRequest:", token);

    if (!token || typeof token !== "string" || !token.includes(".")) {
      throw new Error("Received malformed token.");
    }

    setLocalStorage(tokenKey, token);
    console.log("Saved token:", getLocalStorage(tokenKey));

    setTimeout(() => {
      window.location = redirect;
    }, 100);
  } catch (error) {
    console.error("Login failed:", error);
    alertMessage(error.message?.message || error.message || "Login failed.");
  }
}
