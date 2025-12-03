export default class Product {
  constructor(id, name, image_url, price) {
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.price = parseInt(price);
    this.created_at = new Date().toISOString();
  }

  static fromCookies(data) {
    return new Product(
      data.id,
      data.name,
      data.image_url,
      data.price
    );
  }
}
