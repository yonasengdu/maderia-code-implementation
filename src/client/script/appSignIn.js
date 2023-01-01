import { App, UserAccount, HotelAccount } from "./app.js";

const toggleBox = document.querySelector(".toggle-box-in");
const fromInputs = document.querySelectorAll(".form-input");
const toggles = [...document.querySelectorAll(".toggle")];
const fromUserLabel = document.querySelector(".form-user-label");
const inputPassword = document.querySelector(".form-input--password");
const signinEmail = document.querySelector(".form-signin-email");
const singinPassword = document.querySelector(".form-signin-password");
const btnsignIn = document.querySelector(".btn-signIn");
const passwordValidation = document.querySelector(".form-Validation-password");
const emailValidation = document.querySelector(".form-Validation-email");

class AppSignIn extends App {
  constructor() {
    super();
    toggleBox.addEventListener("click", this.toggleUser.bind(this));
    btnsignIn.addEventListener("click", this.signin.bind(this));
  }

  toggleUser() {
    emailValidation.textContent = passwordValidation.textContent = "";
    fromInputs.forEach((el) => {
      el.value = "";
    });
    toggles.forEach((el) => el.classList.toggle("toggle--active"));
    const activeEl = toggles.find((el) =>
      el.classList.contains("toggle--active")
    );
    if (activeEl.classList.contains("toggle--user")) {
      this.togglePoint = "user";
    }
    if (activeEl.classList.contains("toggle--hotel")) {
      this.togglePoint = "hotel";
    }
  }

  signin(e) {
    e.preventDefault();
    const email = signinEmail.value;
    const password = singinPassword.value;
    emailValidation.textContent = passwordValidation.textContent = "";
    const user = this.userAccounts.find((acc) => acc.email === email);
    const hotel = this.hotelAccounts.find((acc) => acc.email === email);
    console.log(user);
    if (email === "") {
      emailValidation.textContent = "this field is required";
      return;
    }
    if (!user && this.togglePoint === "user") {
      emailValidation.textContent = "the email is not register";
      return;
    }
    if (!hotel && this.togglePoint === "hotel") {
      emailValidation.textContent = "the email is not register";
      return;
    }
    if (password === "") {
      passwordValidation.textContent = "this field is required";
      return;
    }

    if (this.togglePoint === "user") {
      if (user.password !== password) {
        passwordValidation.textContent = "incorrect password";
        return;
      }
    }
    if (this.togglePoint === "hotel") {
      if (hotel.password !== password) {
        passwordValidation.textContent = "incorrect password";
        return;
      }
    }
    // this.currentUser = this.togglePoint === "user" ? user : hotel;

    this.userAccounts.forEach((acc) => (acc.onlineStatus = "off"));
    this.hotelAccounts.forEach((acc) => (acc.onlineStatus = "off"));
    if (this.togglePoint === "user") {
      user.onlineStatus = "on";
    }
    console.log(this.togglePoint);
    if (this.togglePoint === "hotel") {
      hotel.onlineStatus = "on";
    }
    this.setLocalStorage("userAccounts", this.userAccounts);
    this.setLocalStorage("hotelAccounts", this.hotelAccounts);
    location = "../pages/app.html";
  }
}

new AppSignIn();
