import { App, UserAccount, HotelAccount } from "./app.js";

const toggleBox = document.querySelector(".toggle-box-in");
const fromInputs = document.querySelectorAll(".form-input");
const toggles = [...document.querySelectorAll(".toggle")];
const fromUserLabel = document.querySelector(".form-user-label");
const inputUsername = document.querySelector(".form-input--user-name");
const inputEmail = document.querySelector(".form-input--email");
const inputPassword = document.querySelector(".form-input--password");
const btnRegister = document.querySelector(".btn-register");
const passwordValidation = document.querySelector(".form-Validation-password");
const nameValidation = document.querySelector(".form-Validation-name");
const emailValidation = document.querySelector(".form-Validation-email");
const overlay = document.querySelector(".overlay");
const popupClose = document.querySelector(".popup-close");

class AppRegister extends App {
  constructor() {
    super();
    toggleBox.addEventListener("click", this.toggleUser.bind(this));
    btnRegister.addEventListener("click", this.createAccount.bind(this));
    overlay.addEventListener("click", this.removePopup);
    popupClose.addEventListener("click", this.removePopup);
  }
  createAccount(e) {
    e.preventDefault();
    const userName = inputUsername.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    nameValidation.textContent =
      emailValidation.textContent =
      passwordValidation.textContent =
        "";
    const validateEmail = (email) =>
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    const repeatedUsername = this.userAccounts.some(
      (acc) => acc.userName === userName
    );
    const repeatedHotelname = this.hotelAccounts.some(
      (acc) => acc.userName === userName
    );
    const repeatedEmail = this.userAccounts.some((acc) => acc.email === email);
    const repeatedEmailH = this.hotelAccounts.some(
      (acc) => acc.email === email
    );

    if (userName === "") {
      nameValidation.textContent = "this field is required";
      return;
    }
    if (repeatedUsername && this.togglePoint === "user") {
      nameValidation.textContent = "name already used";
      return;
    }
    if (repeatedHotelname && this.togglePoint === "hotel") {
      nameValidation.textContent = "name already used";
      return;
    }
    if (email === "") {
      emailValidation.textContent = "this field is required";
      return;
    }
    if (!validateEmail(email)) {
      emailValidation.textContent = "invalid email";
      return;
    }

    if (repeatedEmail && this.togglePoint === "user") {
      emailValidation.textContent = "email already used";
      return;
    }

    if (repeatedEmailH && this.togglePoint === "hotel") {
      emailValidation.textContent = "email already used";
      return;
    }
    if (password === "") {
      passwordValidation.textContent = "this field is required";
      return;
    }
    if (password.length < 8) {
      passwordValidation.textContent = " password show be 8 or more characters";
      return;
    }
    if (this.togglePoint === "user") {
      const newUser = new UserAccount(userName, email, password);
      newUser.role = this.togglePoint;
      this.userAccounts.push(newUser);
    }
    if (this.togglePoint === "hotel") {
      const newHotel = new HotelAccount(userName, email, password);
      newHotel.role = this.togglePoint;
      this.hotelAccounts.push(newHotel);
    }
    this.showPopup();
    this.setLocalStorage("userAccounts",this.userAccounts)
    this.setLocalStorage("hotelAccounts",this.userAccounts)
    inputEmail.value = inputUsername.value = inputPassword.value = "";
  }
  toggleUser() {
    nameValidation.textContent =
      emailValidation.textContent =
      passwordValidation.textContent =
        "";
    fromInputs.forEach((el) => {
      el.value = "";
    });
    toggles.forEach((el) => el.classList.toggle("toggle--active"));
    const activeEl = toggles.find((el) =>
      el.classList.contains("toggle--active")
    );
    if (activeEl.classList.contains("toggle--user")) {
      fromUserLabel.textContent = "Full name";
      this.togglePoint = "user";
    }
    if (activeEl.classList.contains("toggle--hotel")) {
      fromUserLabel.textContent = "Hotel name";
      this.togglePoint = "hotel";
    }
  }
  showPopup() {
    document.body.classList.add("showPopup");
  }
  removePopup() {
    document.body.classList.remove("showPopup");
  }
}

new AppRegister();
