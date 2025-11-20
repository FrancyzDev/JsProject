import { Entity } from "./entity.js";

export class Product extends Entity {
  constructor(id, name, image_url, description, price, category, supplier) {
    super(id);
    this.name = name;
    this.image_url = image_url;
    this.description = description;
    this.price = price;
    this.category = category;
    this.supplier = supplier;
  }

  showMe() {
    console.log(`I am Product object`);
  }
}
