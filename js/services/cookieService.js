export default class CookieService {
  constructor() {};

  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/; SameSite=Lax";
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        const cookieValue = cookie.substring(nameEQ.length);
        return JSON.parse(cookieValue);
      }
    }
  }

  deleteCookie(name) {
    this.setCookie(name, "", -1);
  }
}
