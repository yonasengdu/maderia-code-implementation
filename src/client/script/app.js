"use strict";
class Account {
  userName;
  password;
  email;
  role;
  onlineStatus = "off";
  constructor(username, email, password) {
    this.userName = username;
    this.password = password;
    this.email = email;
  }
}

class UserAccount extends Account {
  constructor(userName, email, password) {
    super(userName, email, password);
  }
}
class HotelAccount extends Account {
  constructor(userName, email, password) {
    super(userName, email, password);
  }
}

class App {
  userAccounts = [];
  hotelAccounts = [];
  currentUser;
  togglePoint = "user";
  constructor() {
    this.getLocalStorage("userAccounts");
    this.getLocalStorage("hotelAccounts");
  }

  getLocalStorage(name) {
    const data = JSON.parse(localStorage.getItem(name));
    if (name === "userAccounts" && data) {
      this.userAccounts = data;
    }
    if (name === "hotelAccounts" && data) {
      this.hotelAccounts = data;
    }
  }

  setLocalStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  }
}
// new App().clearLocalStorage();
export { App, UserAccount, HotelAccount };
