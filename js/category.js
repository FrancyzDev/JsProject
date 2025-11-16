import { Entity } from "./entity.js"

export class Category extends Entity {
  constructor(id, name) {
    super(id);
    this.name = name;
  }

  showMe() {
    console.log(`I am Category object`);
  }
}
