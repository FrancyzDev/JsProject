import { Entity } from "./entity.js";

export class Order extends Entity {
  constructor(id, orderProducts, status) {
    super(id);
    this.orderProducts = orderProducts;
    this.status = status;
    this.orderDate = Date.now();
  }

  showMe() {
    console.log(`I am Order object`);
  }
}
