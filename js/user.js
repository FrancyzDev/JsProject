import { Entity } from "./entity.js";

export class User extends Entity {
  constructor(id, login, password) {
    super(id);
    this.login = login;
    this.password = password;
  }

  showMe() {
    console.log(`I am User object`);
  }
}
