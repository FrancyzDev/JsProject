import ProductService from '../js/services/ProductService.js';

document.addEventListener('DOMContentLoaded', () => {
  const productService = new ProductService(true);
  productService.init();
});
