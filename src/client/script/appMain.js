import { App, UserAccount, HotelAccount } from "./app.js";

const userNames = document.querySelectorAll(".username");
const profileIcon = document.querySelector(".profile-icon");
const getLocation = document.querySelector(".getlocation");
class AppMain extends App {
  coords;
  constructor() {
    super();
    this.renderUser();
    profileIcon.addEventListener("click", this.editAccount.bind(this));
    // getLocation.addEventListener("click", this.getLocations);
    getLocation.addEventListener("click", this.renderMap.bind(this));
  }

  renderUser() {
    this.currentUser = this.userAccounts.find(
      (acc) => acc.onlineStatus === "on"
    );
    if (!this.currentUser) {
      this.currentUser = this.hotelAccounts.find(
        (acc) => acc.onlineStatus === "on"
      );
      getlocation;
    }
    userNames.forEach((el) => (el.textContent = this.currentUser.userName));
  }

  editAccount() {
    if (this.currentUser.role === "user") {
      location = "./user-profile.html";
    }
    if (this.currentUser.role === "hotel") {
      location = "./hotel-profile.html";
    }
  }
}

new AppMain();
