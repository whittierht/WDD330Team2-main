import { getOrders } from "./externalServices.mjs";

export default async function currentOrders(selector, token) {
  try {
    const orders = await getOrders(token);
    console.log("orders:", orders)
    const parent = document.querySelector(`${selector} tbody`);
    parent.innerHTML = orders.map(orderTemplate).join("");
  } catch (err) {
    console.log(err);
  }
}

function orderTemplate(order) {
  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
  const orderDate = new Date(order.orderDate).toLocaleDateString("en-US");
  const orderTotal = Number(order.orderTotal ?? 0).toFixed(2);

  return `<tr>
    <td>${order.id}</td>
    <td>${orderDate}</td>
    <td>${itemCount}</td>
    <td>$${orderTotal}</td>
  </tr>`;
}