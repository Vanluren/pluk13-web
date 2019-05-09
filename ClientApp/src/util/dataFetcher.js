export const getGifts = () =>
  fetch("//localhost:5001/api/gifts").then(response => response.json());
export const getProducts = () =>
  fetch("//localhost:5001/api/products").then(response => response.json());
