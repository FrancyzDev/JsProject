import { Entity } from "./entity.js";

export class OrderProduct extends Entity {
  constructor(id, product, quantity) {
    super(id);
    this.product = product;
    this.quantity = quantity;
  }

  showMe() {
    console.log(`I am OrderProduct object`);
  }
}
