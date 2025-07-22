const baseURL = import.meta.env.VITE_SERVER_URL;

// Helper to convert fetch response to JSON and handle errors
async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

// Get products by category
export async function getProductsByCategory(category) {
  const response = await fetch(`${baseURL}products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

// Get product by ID
export async function findProductById(id) {
  const response = await fetch(`${baseURL}product/${id}`);
  const product = await convertToJson(response);
  return product.Result;
}

// Checkout
export async function checkout(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
  return await fetch(`${baseURL}checkout`, options).then(convertToJson);
}

// Login
export async function loginRequest(user) {
  const options = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(user),
  };
  const response = await fetch(`${baseURL}login`, options).then(convertToJson);
  return response.accessToken;
}

// Get orders
export async function getOrders(token) {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${baseURL}orders`, options).then(convertToJson);
  return response;
}
