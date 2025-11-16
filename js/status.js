import { Entity } from "./entity.js";

export class Status extends Entity {
  constructor(id, name) {
    super(id);
    this.name = name;
  }

  showMe() {
    console.log(`I am Status object`);
  }
}
