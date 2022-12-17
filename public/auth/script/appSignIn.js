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
const form = document.querySelector(".form")

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
      form.setAttribute("action", "/auth/userSignIn")
    }
    if (activeEl.classList.contains("toggle--hotel")) {
      this.togglePoint = "hotel";
      form.setAttribute("action", "/auth/hotelSignIn")
    }
  }
}

new AppSignIn();
