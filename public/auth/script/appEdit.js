import { App, UserAccount, HotelAccount } from "./app.js";
const username = document.querySelectorAll(".username");
const inputUsername = document.querySelector(".form-input--user-name");
const inputEmail = document.querySelector(".form-input--email");
const inputPasswordCurrent = document.querySelector(
  ".form-input--password--current"
);
const inputPasswordNew = document.querySelector(".form-input--password--new");
const btnSaveChangesProfile = document.querySelector(
  ".btn-save-changes-profile"
);
const btnSaveChangesPasssword = document.querySelector(
  ".btn-save-changes-password"
);
const changeToPasswordFrom = document.querySelector(".password-form-link");
const changeToProfileForm = document.querySelector(".profile-form-link");

const passwordValidation = document.querySelector(".form-Validation-password");
const passwordNewValidation = document.querySelector(
  ".form-Validation-password-new"
);
const passwordCurrentValidation = document.querySelector(
  ".form-Validation-password-current"
);

const nameValidation = document.querySelector(".form-Validation-name");
const emailValidation = document.querySelector(".form-Validation-email");
const passwordFrom = document.querySelector(".password-form");
const profileForm = document.querySelector(".profile-form");
const overlay = document.querySelector(".overlay");
const popupClose = document.querySelector(".popup-close");

class AppEdit extends App {
  constructor() {
    super();
    changeToPasswordFrom.addEventListener("click", this.movetoPasswordForm);
    changeToProfileForm.addEventListener("click", this.movetoProfileForm);
    overlay.addEventListener("click", this.removePopup);
    popupClose.addEventListener("click", this.removePopup);
  }
  movetoPasswordForm() {
    profileForm.classList.add("hidden");
    passwordFrom.classList.remove("hidden");
  }
  movetoProfileForm() {
    profileForm.classList.remove("hidden");
    passwordFrom.classList.add("hidden");
  }

  showPopup() {
    document.body.classList.add("showPopup");
  }
  removePopup() {
    document.body.classList.remove("showPopup");
  }
}
new AppEdit();
