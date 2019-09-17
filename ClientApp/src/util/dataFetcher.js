export const getGifts = () =>
  fetch("/api/gifts").then(response => response.json());
export const getProducts = () =>
  fetch("/api/products").then(response => response.json());
export const getOrders = () =>
  fetch("/api/orders").then(response => response.json());
