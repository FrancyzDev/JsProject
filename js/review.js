import { Entity } from "./entity.js";

export class Review extends Entity {
  constructor(id, product, user, rating, comment) {
    super(id);
    this.product = product;
    this.user = user;
    this.rating = rating;
    this.comment = comment;
  }

  showMe() {
    console.log(`I am Review object`);
  }
}
