import { Entity } from "./entity.js";

export class Product extends Entity {
  constructor(id, name, description, price, category, supplier) {
    super(id);
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.supplier = supplier;
  }

  showMe() {
    console.log(`I am Product object`);
  }
}
