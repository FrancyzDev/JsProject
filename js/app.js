let shoppingList = [
  { name: "Хліб", quantity: 1, purchased: false },
];

// 1. Виведення всього списку (спочатку не куплені, потім куплені)
function displayShoppingList() {
  const sortedList = [...shoppingList].sort((a, b) => a.purchased - b.purchased);

  console.log("Список покупок:");
  sortedList.forEach((item, index) => {
    const status = item.purchased ? "Куплено" : "Не куплено";
    console.log(`${index + 1}. ${item.name} - ${item.quantity} шт. (${status})`);
  });
}

// 2. Додавання покупки до списку
function addItem(name, quantity = 1) {
  const existingItem = shoppingList.find(item =>
    item.name.toLowerCase() === name.toLowerCase()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    console.log(`Оновлено: ${name} (+${quantity})`);
  } else {
    shoppingList.push({
      name: name,
      quantity: quantity,
      purchased: false
    });
    console.log(`Додано: ${name}`);
  }
}

// 3. Придбання товару
function purchaseItem(name) {
  const item = shoppingList.find(item =>
    item.name.toLowerCase() === name.toLowerCase()
  );

  if (item) {
    item.purchased = true;
    console.log(`${name} позначено як куплений`);
  } else {
    console.log(`Товар "${name}" не знайдено`);
  }
}

// Приклади використання
console.log("=== ПОЧАТКОВИЙ СПИСОК ===");
displayShoppingList();

console.log("\n=== ДОДАЄМО ТОВАРИ ===");
addItem("Банан", 3);
addItem("Хліб", 2);

console.log("\n=== ПОКУПКА ТОВАРІВ ===");
purchaseItem("Яблука");

console.log("\n=== ФІНАЛЬНИЙ СПИСОК ===");
displayShoppingList();
