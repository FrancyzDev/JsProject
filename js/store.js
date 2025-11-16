import { User } from "./user.js";
import { Product } from "./product.js";
import { Order } from "./order.js";
import { Category } from "./category.js";
import { Supplier } from "./supplier.js";
import { Review } from "./review.js";
import { Status } from "./status.js";
import { OrderProduct } from "./orderProduct.js";

export class Store {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.categories = new Map();
    this.suppliers = new Map();
    this.reviews = new Map();
    this.statuses = new Map();
  }

  showMe() {
    console.log(`I am Store object`);
  }
}
