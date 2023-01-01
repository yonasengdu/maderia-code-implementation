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
    this.showProfile.bind(this)();
    btnSaveChangesProfile.addEventListener(
      "click",
      this.editProfile.bind(this)
    );
    btnSaveChangesPasssword.addEventListener(
      "click",
      this.editPassword.bind(this)
    );
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
  showProfile() {
    this.currentUser = this.userAccounts.find(
      (acc) => acc.onlineStatus === "on"
    );
    if (!this.currentUser) {
      this.currentUser = this.hotelAccounts.find(
        (acc) => acc.onlineStatus === "on"
      );
    }
    username.forEach((el) => (el.textContent = this.currentUser.userName));
    inputUsername.value = this.currentUser.userName;
    inputEmail.value = this.currentUser.email;
  }
  editProfile(e) {
    e.preventDefault();
    console.log(this.hotelAccounts);
    const userName = inputUsername.value;
    const email = inputEmail.value;
    nameValidation.textContent = emailValidation.textContent = "";
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
    if (
      repeatedUsername &&
      this.currentUser.role === "user" &&
      this.currentUser.userName !== userName
    ) {
      nameValidation.textContent = "name already used";
      return;
    }
    if (
      repeatedHotelname &&
      this.currentUser.role === "hotel" &&
      this.currentUser.userName !== userName
    ) {
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

    if (
      repeatedEmail &&
      this.currentUser.role === "user" &&
      this.currentUser.email !== email
    ) {
      emailValidation.textContent = "email already used";
      return;
    }

    if (
      repeatedEmailH &&
      this.currentUser.role === "hotel" &&
      this.currentUser.email !== email
    ) {
      emailValidation.textContent = "email already used";
      return;
    }

    this.currentUser.userName = userName;
    this.currentUser.email = email;
    this.showProfile();
    document.body.classList.add("showPopup");
    this.setLocalStorage("userAccounts", this.userAccounts);
    this.setLocalStorage("hotelAccounts", this.userAccounts);
  }
  editPassword(e) {
    e.preventDefault();
    passwordCurrentValidation.textContent = passwordNewValidation.textContent =
      "";
    const currentPassword = inputPasswordCurrent.value;
    const newPassword = inputPasswordNew.value;
    console.log(currentPassword, this.currentUser.password);
    if (currentPassword === "") {
      passwordCurrentValidation.textContent = "this field is required";
      return;
    }

    if (currentPassword !== this.currentUser.password) {
      passwordCurrentValidation.textContent = "passwords aren't the same";
      return;
    }
    if (newPassword === "") {
      passwordNewValidation.textContent = "this field is required";
      return;
    }
    if (newPassword.length < 8) {
      passwordNewValidation.textContent =
        " password show be 8 or more characters";
      return;
    }
    this.currentUser.password = newPassword;
    this.setLocalStorage("userAccounts", this.userAccounts);
    this.setLocalStorage("hotelAccounts", this.userAccounts);
    document.body.classList.add("showPopup");
  }
  showPopup() {
    document.body.classList.add("showPopup");
  }
  removePopup() {
    document.body.classList.remove("showPopup");
  }
}
new AppEdit();
