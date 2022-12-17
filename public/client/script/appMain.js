import { App, UserAccount, HotelAccount } from "./app.js";

const userNames = document.querySelectorAll(".username");
const profileIcon = document.querySelector(".profile-icon");
class AppMain extends App {
  constructor() {
    super();
    this.renderUser();
    profileIcon.addEventListener("click", this.editAccount.bind(this));
  }
  renderUser() {
    console.log(this.userAccounts);
    console.log(this.hotelAccounts);
    this.currentUser = this.userAccounts.find(
      (acc) => acc.onlineStatus === "on"
    );
    if (!this.currentUser) {
      this.currentUser = this.hotelAccounts.find(
        (acc) => acc.onlineStatus === "on"
      );
    }
    userNames.forEach((el) => (el.textContent = this.currentUser.userName));
  }

  editAccount() {
    console.log(this.currentUser);
    if (this.currentUser.role === "user") {
      location = "./user-profile.html";
    }
    if (this.currentUser.role === "hotel") {
      location = "./hotel-profile.html";
    }
  }
}

new AppMain();
