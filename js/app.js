import { Category } from "./category.js"
import { Entity } from "./entity.js"
import { Status } from "./status.js"
import { User } from "./user.js"

let category = new Category(new Entity(1), "test123");
category.showName();
