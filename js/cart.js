class Product {
  constructor(name, price, purchased) {
    this.name = name;
    this.price = price;
  }
}

class CartProduct {
  constructor(product, quantity, purchased) {
    this.product = product;
    this.quantity = quantity;
    this.purchased = purchased;
  }
}

let cart = [];

function addToCart(productName, price) {
  const existingItem = cart.find(item => item.product.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(CartProduct(Product(productName, price), 1, false));
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
}

function displayShoppingList() {
  const sortedList = [...cart].sort((a, b) => {
    if (a.purchased === b.purchased) return 0;
    return a.purchased ? 1 : -1;
  });
  console.log("Список покупок:");
  sortedList.forEach((item, index) => {
    const status = item.purchased ? "Куплено" : "Очікує";
    console.log(`${index + 1}. ${item.product.name} - ${item.quantity} шт. - ${item.product.price} ₴ (${status})`);
  });
}

function addItem(name, price, quantity = 1) {
  const existingItem = cart.find(item => item.product.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
    console.log(`Оновлено: ${name} (+${quantity}), загалом: ${existingItem.quantity} шт.`);
  } else {
    const product = new Product(name, price);
    const cartProduct = new CartProduct(product, quantity, false);
    cart.push(cartProduct);
    console.log(`Додано: ${name} - ${quantity} шт.`);
  }
}

function purchaseItem(productName) {
  const item = cart.find(item => item.product.name === productName);
  if (item) {
    if (item.purchased) {
      console.log(`${productName} вже куплений`);
    } else {
      item.purchased = true;
      console.log(`${productName} позначено як куплений`);
    }
  } else {
    console.log(`Товар "${productName}" не знайдено`);
  }
}

function getTotalPrice() {
  return cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
}


addItem("ERD \"White 7.0\"", 8999, 3);
addItem("Chrome hearts", 48999, 1);

console.log("\nПочатковий список:");
displayShoppingList();

purchaseItem("Chrome hearts");

console.log("\nСписок після покупок:");
displayShoppingList();

console.log(`\nЗагальна вартість кошику: ${getTotalPrice()} ₴`);
