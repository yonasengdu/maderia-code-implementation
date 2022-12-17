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
  }

  getLocalStorage(name) {
    // if (name === "userAccounts" && this.userAccounts.length === 0) {
    //   return;
    // }
    // if (name === "hotelAccounts" && this.hotelAccounts.length === 0) {
    //   return;
    // }
    const data = JSON.parse(localStorage.getItem(name));
    if (name === "userAccounts" && data) {
      this.userAccounts = data;
    }
    if (name === "hotelAccounts" && data) {
      this.hotelAccounts = data;
    }
  }

}
// new App().clearLocalStorage();
export { App, UserAccount, HotelAccount };
