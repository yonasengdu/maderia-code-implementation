const data = [
  {
    id: 1,
    name: "Sheraton",
    address: "miskle addbabay avenue,170 s232",
    coords: [9.03504, 38.7661],
    rating: 4.8,
    rooms: 200,
    description: "",
  },
  {
    id: 2,
    name: "paradlize",
    address: "germen avenue,170 s232",
    coords: [9.035508, 38.7652],
    rating: 3.8,
    rooms: 200,
    description: "",
  },
  {
    id: 3,
    name: "Rozario santo",
    address: "sengal avenue,170 s232",
    coords: [9.035, 38.7669],
    rating: 4.9,
    rooms: 200,
    description: "",
  },
  {
    id: 4,
    name: "pelagrimo",
    address: "sent michael avenue,170 s232",
    coords: [9.03555, 38.7641],
    rating: 6.8,
    rooms: 200,
    description: "",
  },
  {
    id: 5,
    name: "marcone decorazza",
    address: "Sent mesalemia avenue,170 s232",
    coords: [9.03544, 38.7678],
    rating: 7.8,
    rooms: 200,
    description: "",
  },
  {
    id: 6,
    name: "the last hotel",
    address: "Sent aaa avenue,170 s232",
    coords: [9.03543, 38.7688],
    rating: 4.8,
    rooms: 200,
    description: "",
  },
];
const hotelmap = document.querySelector(".hmap");
const bntGetNearHotels = document.querySelector(".btn-getNear-hotels");
const hotelListContainer = document.querySelector(".hmap-list__ul");
const locationBtn = document.querySelector(".hmap-location");

class NearHotel {
  map;
  constructor() {
    this.renderMap.bind(this)();
    hotelListContainer.addEventListener(
      "click",
      this.renderHotelOnmap.bind(this)
    );
    locationBtn.addEventListener("click", this.renderLocation.bind(this));
  }
  Getlocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((location, err) => {
        const { latitude: lat, longitude: lng } = location.coords;
        resolve([lat, lng]);
      });
    });
  }

  async renderMap() {
    try {
      hotelmap.classList.remove("hidden");
      const coords = await this.Getlocation();
      this.map = L.map("map").setView(coords, 18);
      console.log(coords);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.renderHotelList();
      this.renderHotelsOnMap.bind(this)();
      const locationMarker = L.marker(coords)
        .addTo(this.map)
        .bindPopup(
          L.popup({
            autoClose: false,
            className: "mapPopupL",
            closeOnClick: false,
          })
        )
        .setPopupContent(
          `<div><i class="location fa-solid fa-location-dot"></i>
        <p>Your Location</p></div>`
        )
        .openPopup();
      locationMarker._icon.classList.add("map-icon-color");
    } catch (err) {
      console.log(err.message);
    }
  }

  renderHotelsOnMap() {
    const currentObject = this;
    data.forEach(function (data) {
      L.marker(data.coords)
        .addTo(currentObject.map)
        .bindPopup(
          L.popup({
            autoClose: false,
            className: "mapPopupH",
            closeOnClick: false,
          })
        )
        .setPopupContent(
          `<div><i class="fa-solid fa-hotel"></i>
        <p>${data.name}</p></div>`
        )
        .openPopup();
    });
  }

  renderHotelList() {
    data.forEach(function (data) {
      const html = ` <li class="hmap-item btn btn-blue" data-id = "${data.id}">
    <span class="hmap-item__desc"
      ><p class="hmap-item__name">${data.name}</p>
      <p class="hmap-item__address">${data.address}</p>
    </span>
    <span class="hmap-item-rate">
      <div class="hmap-item-rate_star">
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
      </div>
      <p>${data.rating} Rating</p>
    </span>
    <a class="hmap-item__reserve btn btn-blue" href="#">Reserve</a>
  </li>
    `;
      hotelListContainer.insertAdjacentHTML("beforeend", html);
    });
  }

  renderHotelOnmap(e) {
    const clicked = e.target.closest(".hmap-item");
    if (clicked) {
      console.log("ok");
      const id = +clicked.dataset.id;
      const hotel = data.find((data) => data.id === id);
      this.map.setView(hotel.coords, 24, { animate: true, duration: 1 });
    }
  }
  async renderLocation() {
    const coords = await this.Getlocation();
    this.map.setView(coords, 24, { animate: true, duration: 1 });
  }
}

const nearhotels = new NearHotel();
