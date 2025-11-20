import { Category } from "./category.js"
import { Entity } from "./entity.js"
import { Status } from "./status.js"
import { User } from "./user.js"

class Product {
  constructor(name, category, cost) {
    this.name = name;
    this.category = category;
    this.cost = cost;
  }
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      const cookieValue = cookie.substring(nameEQ.length);
      return JSON.parse(cookieValue);
    }
  }
}

function getProducts() {
  const products = getCookie("items");
  console.log(products);
  return products ? products : [];
}

function displayProducts() {
  const products = getProducts();
  const productsList = document.getElementById("productsList");

  if (products.length === 0) {
    productsList.innerHTML = "<p>Немає товарів</p>";
    return;
  }

  let products_text = ''

  products.forEach(product => {
    products_text += `
      <div class="product">
        <div>Назва товару: ${product.name}</div>
        <div>Категорія: ${product.category}</div>
        <div>Ціна: ${product.cost} грн</div>
      </div>
    `;
  });

  productsList.innerHTML = products_text;
}

document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const cost = document.getElementById('cost').value;
  const newProduct = new Product(name, category, cost);
  const products = getProducts();
  products.push(newProduct);
  setCookie("items", products);
  displayProducts();
  this.reset();
});

displayProducts();
