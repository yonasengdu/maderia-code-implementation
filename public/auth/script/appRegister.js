import { App, UserAccount, HotelAccount } from "./app.js";

const toggleBox = document.querySelector(".toggle-box-in");
const fromInputs = document.querySelectorAll(".form-input");
const toggles = [...document.querySelectorAll(".toggle")];
const fromUserLabel = document.querySelector(".form-user-label");
const inputName = document.querySelector(".form-input--user-name");
const inputEmail = document.querySelector(".form-input--email");
const inputPassword = document.querySelector(".form-input--password");
const btnRegister = document.querySelector(".btn-register");
const passwordValidation = document.querySelector(".form-Validation-password");
const nameValidation = document.querySelector(".form-Validation-name");
const emailValidation = document.querySelector(".form-Validation-email");
const overlay = document.querySelector(".overlay");
const popupClose = document.querySelector(".popup-close");
const form = document.querySelector(".form");
const locationBox = document.querySelector(".location");
const sectionRegistration = document.querySelector(".section-registration");
const lat = document.querySelector(".location-input-lat");
const long = document.querySelector(".location-input-long");
const btnGps = document.querySelector(".btn-coord-gps");
const btnMap = document.querySelector(".btn-coord-map");
const mapinstruction = document.querySelector(".map-instruction");

class AppRegister extends App {
  constructor() {
    super();
    toggleBox.addEventListener("click", this.toggleUser.bind(this));
    overlay.addEventListener("click", this.removePopup);
    popupClose.addEventListener("click", this.removePopup);
    btnGps.addEventListener("click", this.renderLocation.bind(this));
    btnMap.addEventListener("click", this.renderMap.bind(this));
  }
  // createAccount(e) {
  //   // e.preventDefault();
  //   const userName = inputUsername.value;
  //   const email = inputEmail.value;
  //   const password = inputPassword.value;
  //   nameValidation.textContent =
  //     emailValidation.textContent =
  //     passwordValidation.textContent =
  //       "";
  //   const validateEmail = (email) =>
  //     email
  //       .toLowerCase()
  //       .match(
  //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //       );
  //   const repeatedUsername = this.userAccounts.some(
  //     (acc) => acc.userName === userName
  //   );
  //   const repeatedHotelname = this.hotelAccounts.some(
  //     (acc) => acc.userName === userName
  //   );
  //   const repeatedEmail = this.userAccounts.some((acc) => acc.email === email);
  //   const repeatedEmailH = this.hotelAccounts.some(
  //     (acc) => acc.email === email
  //   );

  //   if (userName === "") {
  //     nameValidation.textContent = "this field is required";
  //     return;
  //   }
  //   if (repeatedUsername && this.togglePoint === "user") {
  //     nameValidation.textContent = "name already used";
  //     return;
  //   }
  //   if (repeatedHotelname && this.togglePoint === "hotel") {
  //     nameValidation.textContent = "name already used";
  //     return;
  //   }
  //   if (email === "") {
  //     emailValidation.textContent = "this field is required";
  //     return;
  //   }
  //   if (!validateEmail(email)) {
  //     emailValidation.textContent = "invalid email";
  //     return;
  //   }

  //   if (repeatedEmail && this.togglePoint === "user") {
  //     emailValidation.textContent = "email already used";
  //     return;
  //   }

  //   if (repeatedEmailH && this.togglePoint === "hotel") {
  //     emailValidation.textContent = "email already used";
  //     return;
  //   }
  //   if (password === "") {
  //     passwordValidation.textContent = "this field is required";
  //     return;
  //   }
  //   if (password.length < 8) {
  //     passwordValidation.textContent = " password show be 8 or more characters";
  //     return;
  //   }
  //   if (this.togglePoint === "user") {
  //     const newUser = new UserAccount(userName, email, password);
  //     newUser.role = this.togglePoint;
  //     this.userAccounts.push(newUser);
  //   }
  //   if (this.togglePoint === "hotel") {
  //     const newHotel = new HotelAccount(userName, email, password);
  //     newHotel.role = this.togglePoint;
  //     this.hotelAccounts.push(newHotel);
  //   }
  //   this.showPopup();
  //   inputEmail.value = inputUsername.value = inputPassword.value = "";
  // }
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
      locationBox.classList.add("hidden");
      sectionRegistration.classList.remove("hotel");
      this.togglePoint = "user";
      form.setAttribute("action","/auth/userSignUp");
      inputName.setAttribute("name", "full_name");
    }
    if (activeEl.classList.contains("toggle--hotel")) {
      fromUserLabel.textContent = "Hotel name";
      locationBox.classList.remove("hidden");
      sectionRegistration.classList.add("hotel");
      this.togglePoint = "hotel";
      form.setAttribute("action","/auth/hotelSignUp");
      inputName.setAttribute("name", "hotel_name");
    }
    console.log(inputName)
  }
  showPopup() {
    document.body.classList.add("showPopup");
  }
  removePopup() {
    document.body.classList.remove("showPopup");
  }

  Getlocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((location, err) => {
        const { latitude: lat, longitude: lng } = location.coords;
        console.log("a");
        resolve([lat, lng]);
        reject(err);
      });
    });
  }

  async renderLocation() {
    try {
      mapinstruction.classList.add("hidden");
      if (this.map) {
        this.map.remove();
      }
      const coords = await this.Getlocation();
      lat.value = coords[0];
      long.value = coords[1];
      this.map = L.map("map").setView(coords, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      L.marker(coords)
        .addTo(this.map)
        .bindPopup(
          L.popup({
            autoClose: false,
            // className: "mapPopupH",
            closeOnClick: false,
          })
        )
        .setPopupContent(
          `<div><i class="fa-solid fa-location-dot"></i>
        <p>Your location</p></div>`
        )
        .openPopup();
    } catch (err) {
      console.error(err);
    }
  }
  async renderMap() {
    try {
      mapinstruction.classList.remove("hidden");
      if (this.map) {
        this.map.remove();
      }
      const coords = await this.Getlocation();
      this.map = L.map("map").setView(coords, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    } catch (err) {
      console.error(err);
    }
    this.map.on("click", this.pickCoordsOnmap.bind(this));
  }
  async pickCoordsOnmap(e) {
    const coords = e.latlng;
    lat.value = coords.lat;
    long.value = coords.lng;
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = new L.marker([coords.lat, coords.lng])
      .addTo(this.map)
      .bindPopup(
        L.popup({
          autoClose: false,
          className: "mapPopupH",
          closeOnClick: false,
        })
      )
      .setPopupContent(
        `<div><i class="fa-solid fa-location-dot"></i>
    <p>Hotel's Location</p></div>`
      )
      .openPopup();
  }
}

new AppRegister();
