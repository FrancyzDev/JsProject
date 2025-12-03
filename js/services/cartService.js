import CookieService from './CookieService.js';

let instance = null;

export default class CartService {
  constructor() {
    if (instance) {
      return instance;
    }

    this.cartKey = 'cart';
    this.cookieService = new CookieService();
    this.cartCountElement = null;
    this.isInitialized = false;

    instance = this;
    return this;
  }

  static getInstance() {
    if (!instance) {
      instance = new CartService();
    }
    return instance;
  }

  init() {
    if (this.isInitialized) return this;

    this.cartCountElement = document.getElementById('cartCount');
    if (!this.cartCountElement) {
      this.createCartCountElement();
    }

    this.updateCartCount();
    this.isInitialized = true;

    return this;
  }

  createCartCountElement() {
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
      this.cartCountElement = document.createElement('span');
      this.cartCountElement.id = 'cartCount';
      this.cartCountElement.className = 'cart-count';
      cartButton.appendChild(this.cartCountElement);
    }
  }

  updateCartCount() {
    try {
      const cart = this.getCart();
      const totalItems = cart.reduce((sum, item) => {
        return sum + (item.quantity || 1);
      }, 0);

      if (this.cartCountElement) {
        this.cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
          this.cartCountElement.style.display = 'inline-block';
          this.animateCartCount();
        } else {
          this.cartCountElement.style.display = 'none';
        }
      } else {
        console.warn('cartCountElement не найден');
      }

      return totalItems;

    } catch (error) {
      console.error('Ошибка обновления счетчика корзины:', error);
      return 0;
    }
  }

  animateCartCount() {
    if (!this.cartCountElement) return;
    this.cartCountElement.style.animation = 'pulse 0.5s';
    setTimeout(() => {
      if (this.cartCountElement) {
        this.cartCountElement.style.animation = '';
      }
    }, 500);
  }

  getCart() {
    return this.cookieService.getCookie(this.cartKey) || [];
  }

  addToCart(product, size) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id && item.size === size);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        size: size,
        quantity: 1
      });
    }

    this.cookieService.setCookie(this.cartKey, cart, 30);
    this.updateCartCount();

    return cart;
  }

  removeFromCart(productId, size) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    this.cookieService.setCookie(this.cartKey, cart, 30);
    this.updateCartCount();
    return cart;
  }

  updateQuantity(productId, quantity, size = null) {
    if (quantity <= 0) {
      return this.removeFromCart(productId, size);
    }

    const cart = this.getCart();

    let item;
    if (size) {
      item = cart.find(item => item.id === productId && item.size === size);
    } else {
      item = cart.find(item => item.id === productId);
    }

    if (item) {
      item.quantity = quantity;
      this.cookieService.setCookie(this.cartKey, cart, 30);
      this.updateCartCount();
    }

    return cart;
  }

  clearCart() {
    this.cookieService.deleteCookie(this.cartKey);
    this.updateCartCount();
    return [];
  }

  getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
  }

  getItemQuantity(productId) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    return item ? (item.quantity || 1) : 0;
  }

  hasItem(productId) {
    return this.getItemQuantity(productId) > 0;
  }

  static updateCartCount() {
    return CartService.getInstance().updateCartCount();
  }

  static addToCart(product) {
    return CartService.getInstance().addToCart(product);
  }

  static getCart() {
    return CartService.getInstance().getCart();
  }

  static getTotalPrice() {
    return CartService.getInstance().getTotalPrice();
  }

  static removeFromCart(productId) {
    return CartService.getInstance().removeFromCart(productId);
  }

  static clearCart() {
    return CartService.getInstance().clearCart();
  }
}
