import Product from '../entities/Product.js';
import CookieService from './CookieService.js';
import CartService from './CartService.js';

export default class ProductService {
  constructor(isAdmin = false) {
    this.isAdmin = isAdmin;
    this.storageKey = 'products';
    this.products = [];
    this.cookieService = new CookieService();
    this.cartService = CartService.getInstance();
    this.initializeElements();
  }

  initializeElements() {
    this.addProductBtn = document.getElementById('addProductBtn');
    this.productImageUrlInput = document.getElementById('productImageUrlInput');
    this.productNameInput = document.getElementById('productName');
    this.productPriceInput = document.getElementById('productPrice');
    this.productsList = document.getElementById('productsList');
  }

  init() {
    this.loadProducts();
    this.cartService.init();
    this.bindEvents();
  }

  bindEvents() {
    if (this.addProductBtn) {
      this.addProductBtn.addEventListener('click', () => this.addProduct());
    }
  }

  addProduct() {
    try {
      const image_url = this.productImageUrlInput.value.trim();
      const name = this.productNameInput.value.trim();
      const priceStr = this.productPriceInput.value.trim();

      if (!image_url || !name || !priceStr) {
        this.showAlert('Будь ласка, заповніть всі поля коректно');
        return;
      }

      if (!this.isValidImageUrl(image_url)) {
        this.showAlert('Некорректный URL изображения');
        return;
      }

      const price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0) {
        this.showAlert('Цена должна быть положительным числом');
        return;
      }

      const id = this.generateUniqueId();

      const product = new Product(
        id,
        name,
        image_url,
        price
      );

      this.saveProduct(product);
      this.clearInputs();
      this.loadProducts();

      console.log(`Товар "${name}" добавлен с ID: ${id}`);

    } catch (error) {
      console.error('Ошибка добавления товара:', error);
      this.showAlert('Ошибка добавления товара');
    }
  }

  generateUniqueId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  isValidImageUrl(url) {
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const lowerUrl = url.toLowerCase();

      return imageExtensions.some(ext => lowerUrl.endsWith(ext));
    } catch {
      return false;
    }
  }

  saveProduct(product) {
    const currentProducts = this.cookieService.getCookie(this.storageKey) || [];
    currentProducts.push(product);
    this.cookieService.setCookie(this.storageKey, currentProducts, 30);
    this.products = currentProducts;
  }

  loadProducts() {
    try {
      const data = this.cookieService.getCookie(this.storageKey) || [];
      this.products = data.map(item => Product.fromCookies(item));
      this.renderProducts();
      return true;
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      this.products = [];
      this.renderProducts();
      return false;
    }
  }

  renderProducts() {
    if (!this.productsList) {
      console.warn('Элемент productsList не найден');
      return;
    }

    if (this.products.length === 0) {
      this.productsList.innerHTML = '<p class="empty-message">Товарів ще немає</p>';
      return;
    }

    this.productsList.innerHTML = this.products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img
            alt="${product.name}"
            src="${product.image_url}"
            style="object-fit: contain"
          >
        </div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">${product.price} ₴</div>
        ${!this.isAdmin ? `
          <div class="size-selection" data-product-id="${product.id}">
            <p class="size-label">Оберіть розмір:</p>
            <div class="size-options">
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="36" class="size-input">
                <span class="size-value">36</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="37" class="size-input">
                <span class="size-value">37</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="38" class="size-input">
                <span class="size-value">38</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="39" class="size-input">
                <span class="size-value">39</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="40" class="size-input">
                <span class="size-value">40</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="41" class="size-input">
                <span class="size-value">41</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="42" class="size-input">
                <span class="size-value">42</span>
              </label>
              <label class="size-option">
                <input type="radio" name="size_${product.id}" value="43" class="size-input">
                <span class="size-value">43</span>
              </label>
            </div>
            <div class="size-error" id="sizeError_${product.id}" style="display: none; color: red; font-size: 14px; margin-top: 5px;">
              Будь ласка, оберіть розмір
            </div>
          </div>
        ` : ''}
        ${!this.isAdmin ? `
          <button class="add-to-cart" data-id="${product.id}" disabled>
            Додати до кошика
          </button>
        ` : ''}
        ${this.isAdmin ? `
          <button class="remove-product" data-id="${product.id}">Видалити товар</button>
        ` : ''}
      </div>
    `).join('');

    this.bindProductEvents();

    if (!this.isAdmin) {
      this.bindSizeSelectionEvents();
    }
  }

  bindProductEvents() {
    if (this.isAdmin) {
      document.querySelectorAll('.remove-product').forEach(button => {
        button.addEventListener('click', (e) => {
          const productId = parseInt(e.target.dataset.id);
          this.removeProduct(productId);
        });
      });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(e.target.dataset.id);
        this.addProductToCartWithSize(productId);
      });
    });
  }

  bindSizeSelectionEvents() {
    document.querySelectorAll('.size-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const sizeInput = e.target;
        const productCard = sizeInput.closest('.product-card');
        const productId = productCard ? parseInt(productCard.dataset.id) : null;
        const addToCartBtn = productCard ? productCard.querySelector('.add-to-cart') : null;
        const sizeError = productCard ? productCard.querySelector('.size-error') : null;

        if (sizeInput.checked && productId && addToCartBtn) {
          addToCartBtn.disabled = false;
          addToCartBtn.style.opacity = '1';
          addToCartBtn.style.cursor = 'pointer';

          if (sizeError) {
            sizeError.style.display = 'none';
          }
        }
      });
    });
  }

  removeProduct(productId) {
    try {
      const product = this.getProductById(productId);

      if (!product) {
        console.error('Товар не найден');
        return;
      }

      if (!confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
        return;
      }

      this.cartService.removeFromCart(productId);

      const currentProducts = this.cookieService.getCookie(this.storageKey) || [];
      const updatedProducts = currentProducts.filter(p => p.id !== productId);

      this.cookieService.setCookie(this.storageKey, updatedProducts, 30);

      this.products = updatedProducts;
      this.renderProducts();

      console.log(`Товар "${product.name}" удален`);

    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      alert('Ошибка удаления товара');
    }
  }

  addProductToCartWithSize(productId) {
    try {
      const product = this.getProductById(productId);

      if (!product) {
        console.error('Товар не найден');
        return;
      }

      const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
      if (!productCard) {
        console.error('Карточка товара не найдена');
        return;
      }

      const selectedSizeInput = productCard.querySelector('.size-input:checked');
      if (!selectedSizeInput) {
        const sizeError = productCard.querySelector('.size-error');
        if (sizeError) {
          sizeError.style.display = 'block';
          sizeError.style.animation = 'fadeIn 0.3s';
        }
        return;
      }

      const selectedSize = selectedSizeInput.value;

      this.cartService.addToCart(product, selectedSize);

      this.showNotification(`Додано до кошика: ${product.name} (розмір: ${selectedSize})`);

      console.log(`Товар "${product.name}" (размер: ${selectedSize}) добавлен в корзину`);

      selectedSizeInput.checked = false;
      const addToCartBtn = productCard.querySelector('.add-to-cart');
      if (addToCartBtn) {
        addToCartBtn.disabled = true;
      }

    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      this.showNotification('Помилка додавання до кошика', true);
    }
  }

  clearInputs() {
    this.productImageUrlInput.value = '';
    this.productNameInput.value = '';
    this.productPriceInput.value = '';
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  showAlert(message) {
    alert(message);
  }

  showNotification(message, isError = false) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification' + (isError ? ' notification-error' : '');
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}
