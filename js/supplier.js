import { Entity } from "./entity.js";

export class Supplier extends Entity {
  constructor(id, name) {
    super(id);
    this.name = name;
  }

  showMe() {
    console.log(`I am Supplier object`);
  }
}
