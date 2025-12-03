import CartService from '../services/CartService.js';

export default class OrderService {
  constructor() {
    this.cartService = CartService.getInstance();
    this.orderCartItems = document.getElementById('orderCartItems');
    this.orderTotalAmount = document.getElementById('orderTotalAmount');
    this.orderForm = document.getElementById('orderForm');
    this.clearFormBtn = document.getElementById('clearForm');
  }

  init() {
    this.cartService.init();
    this.loadCartItems();
    this.bindEvents();
    this.setupFormValidation();
  }

  loadCartItems() {
    console.log('Загрузка товаров корзины...');
    const cart = this.cartService.getCart();
    const total = this.cartService.getTotalPrice();
    console.log('Товаров в корзине:', cart.length);
    console.log('Общая сумма:', total);
    if (cart.length === 0) {
      this.orderCartItems.innerHTML = `
        <div class="empty-cart-message">
          <p>😕 Ваш кошик порожній</p>
          <a href="index.html" class="btn btn-primary">Перейти до покупок</a>
        </div>
      `;
      this.orderTotalAmount.textContent = '0';
      return;
    }

    this.orderCartItems.innerHTML = cart.map(item => `
      <div class="order-cart-item" data-id="${item.id}" data-size="${item.size || ''}">
        <img src="${item.image_url}" alt="${item.name}" class="order-cart-item-image">
        <div class="order-cart-item-details">
          <div class="order-cart-item-title">${item.name}</div>
          <div class="order-cart-item-size">Розмір: ${item.size || 'Не вказано'}</div>
          <div class="order-cart-item-price">${item.price} ₴ × ${item.quantity}</div>
          <div class="order-cart-item-subtotal">${item.price * item.quantity} ₴</div>
        </div>
        <div class="order-cart-item-quantity">
          <button class="quantity-btn decrease" data-id="${item.id}" data-size="${item.size || ''}">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}" data-size="${item.size || ''}">+</button>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" data-size="${item.size || ''}">🗑️</button>
      </div>
    `).join('');

    this.orderTotalAmount.textContent = total;
  }

  bindEvents() {
    this.orderCartItems.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains('remove-item-btn')) {
        const productId = parseInt(target.dataset.id);
        const size = target.dataset.size || null;
        this.removeItemFromCart(productId, size);
      }

      if (target.classList.contains('decrease')) {
        const productId = parseInt(target.dataset.id);
        const size = target.dataset.size || null;
        this.decreaseQuantity(productId, size);
      }

      if (target.classList.contains('increase')) {
        const productId = parseInt(target.dataset.id);
        const size = target.dataset.size || null;
        this.increaseQuantity(productId, size);
      }
    });

    if (this.clearFormBtn) {
      this.clearFormBtn.addEventListener('click', () => {
        this.orderForm.reset();
        this.clearErrors();
      });
    }

    if (this.orderForm) {
      this.orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }
  }

  removeItemFromCart(productId, size) {
    if (size) {
      this.cartService.removeFromCart(productId, size);
    } else {
      this.cartService.removeFromCart(productId);
    }
    this.loadCartItems();
    this.showNotification('Товар видалено з кошика');
  }

  decreaseQuantity(productId, size) {
    const cart = this.cartService.getCart();

    let item;
    if (size) {
      item = cart.find(item => item.id === productId && item.size === size);
    } else {
      item = cart.find(item => item.id === productId);
    }

    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateQuantity(productId, item.quantity, size);
      this.loadCartItems();
    } else if (item && item.quantity === 1) {
      this.removeItemFromCart(productId, size);
    }
  }

  increaseQuantity(productId, size) {
    const cart = this.cartService.getCart();

    let item;
    if (size) {
      item = cart.find(item => item.id === productId && item.size === size);
    } else {
      item = cart.find(item => item.id === productId);
    }

    if (item) {
      item.quantity += 1;
      this.cartService.updateQuantity(productId, item.quantity, size);
      this.loadCartItems();
    }
  }

  setupFormValidation() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const agreementCheckbox = document.getElementById('agreement');

    if (nameInput) nameInput.addEventListener('blur', () => {
      this.validateName(nameInput.value);
    });

    if (phoneInput) phoneInput.addEventListener('blur', () => {
      this.validatePhone(phoneInput.value);
    });

    if (addressInput) addressInput.addEventListener('blur', () => {
      this.validateAddress(addressInput.value);
    });

    if (agreementCheckbox) agreementCheckbox.addEventListener('change', () => {
      this.validateAgreement(agreementCheckbox.checked);
    });

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.formatPhoneNumber(e.target);
      });
    }
  }

  formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.startsWith('380')) {
      value = '+' + value;
    } else if (value.startsWith('80')) {
      value = '+3' + value;
    } else if (value.startsWith('0')) {
      value = '+38' + value;
    } else if (value && !value.startsWith('+')) {
      value = '+380' + value;
    }

    if (value.length > 13) {
      value = value.substring(0, 13);
    }

    if (value.length >= 4) {
      value = value.replace(/(\+\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }

    input.value = value;
  }

  validateName(name) {
    const errorElement = document.getElementById('nameError');
    if (!errorElement) return false;

    const namePattern = /^[A-Za-zА-Яа-яЄєІіЇїҐґ\s'-]{2,70}$/;

    if (!name.trim()) {
      errorElement.textContent = "Введіть ваше повне ім'я";
      return false;
    }

    if (!namePattern.test(name)) {
      errorElement.textContent = "Ім'я має містити 2-70 символів. Допустимі літери, пробіли, апостроф та дефіс";
      return false;
    }

    errorElement.textContent = "";
    return true;
  }

  validatePhone(phone) {
    const errorElement = document.getElementById('phoneError');
    if (!errorElement) return false;

    const phonePattern = /^\+380\d{9}$/;
    const cleanedPhone = phone.replace(/\s/g, '');

    if (!cleanedPhone) {
      errorElement.textContent = "Введіть номер телефону";
      return false;
    }

    if (!phonePattern.test(cleanedPhone)) {
      errorElement.textContent = "Введіть коректний номер телефону у форматі +380XXXXXXXXX";
      return false;
    }

    errorElement.textContent = "";
    return true;
  }

  validateAddress(address) {
    const errorElement = document.getElementById('addressError');
    if (!errorElement) return false;

    const addressPattern = /^[A-Za-zА-Яа-яЄєІіЇїҐґ0-9\s.,-]{5,100}$/;

    if (!address.trim()) {
      errorElement.textContent = "Введіть адресу доставки";
      return false;
    }

    if (!addressPattern.test(address)) {
      errorElement.textContent = "Адреса має містити 5-100 символів. Допустимі літери, цифри, пробіли, коми, крапки, дефіс";
      return false;
    }

    errorElement.textContent = "";
    return true;
  }

  validateAgreement(checked) {
    const errorElement = document.getElementById('agreementError');
    if (!errorElement) return false;

    if (!checked) {
      errorElement.textContent = "Необхідно погодитись з умовами обробки персональних даних";
      return false;
    }

    errorElement.textContent = "";
    return true;
  }

  clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
      el.textContent = "";
    });
  }

  async handleFormSubmit() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const agreement = document.getElementById('agreement').checked;

    const cart = this.cartService.getCart();

    if (cart.length === 0) {
      this.showNotification('Ваш кошик порожній. Додайте товари перед оформленням замовлення.', 'error');
      return;
    }

    const isNameValid = this.validateName(name);
    const isPhoneValid = this.validatePhone(phone);
    const isAddressValid = this.validateAddress(address);
    const isAgreementValid = this.validateAgreement(agreement);

    if (!isNameValid || !isPhoneValid || !isAddressValid || !isAgreementValid) {
      this.showNotification('Будь ласка, виправте помилки в формі', 'error');
      return;
    }

    try {
      this.showLoading(true);

      await this.submitOrder({ name, phone, address, cart });

      this.cartService.clearCart();
      this.showSuccessMessage();
      this.orderForm.reset();
      this.loadCartItems();

    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      this.showNotification('Сталася помилка при оформленні замовлення. Спробуйте ще раз.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async submitOrder(orderData) {
    const itemsList = orderData.cart.map(item => {
      const itemTotal = item.price * item.quantity;
      return `${item.name} (розмір: ${item.size || 'Не вказано'}) - ${item.quantity} шт. × ${item.price} ₴ = ${itemTotal} ₴`;
    }).join('\n');

    const totalAmount = orderData.cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const message = `
Iм'я: ${orderData.name}
Номер телефона: ${orderData.phone}
Адрес: ${orderData.address}

Сумма замовлення: ${totalAmount} ₴

Список товарiв:
${itemsList}
`;
    const telegramUrl = `https://api.telegram.org/bot8561113579:AAF1BJaY-0sJDmn24BI6kOVRmayJKxzl_f4/sendMessage?chat_id=954555739&text=${encodeURIComponent(message)}`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP помилка ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      console.log('Заказ отправлен в Telegram:', result);
      return result;

    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      throw error;
    }
  }

  showLoading(show) {
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) return;

    if (show) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Обробка замовлення...';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Підтвердити замовлення';
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showSuccessMessage() {
    const modal = document.createElement('div');
    modal.className = 'order-success-modal';
    modal.innerHTML = `
      <div class="order-success-content">
        <h3>✅ Замовлення успішно оформлено!</h3>
        <p>Дякуємо за ваше замовлення, <strong>${document.getElementById('name').value}</strong>!</p>
        <p>Наш менеджер зв'яжеться з вами за номером <strong>${document.getElementById('phone').value}</strong> найближчим часом.</p>
        <p>Адреса доставки: <strong>${document.getElementById('address').value}</strong></p>
        <p>Номер вашого замовлення: <strong>#${Math.floor(Math.random() * 10000)}</strong></p>
        <div class="success-actions">
          <a href="index.html" class="btn btn-primary">На головну</a>
          <button class="btn btn-secondary close-success">Закрити</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-success').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 10000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const orderService = new OrderService();
  orderService.init();
});
