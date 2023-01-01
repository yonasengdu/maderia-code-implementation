
const hotelmap = document.querySelector(".hmap");
const bntGetNearHotels = document.querySelector(".btn-getNear-hotels");
const hotelListContainer = document.querySelector(".hmap-list__ul");
const locationBtn = document.querySelector(".hmap-location");

class NearHotel {
  map;
  data;
  constructor() {
    this.getData.bind(this)();
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
        resolve({lat:lat,long:lng});
      });
    });
  }

  async getData(){
const coords = await this.Getlocation();
console.log(coords);
try{
const response = await fetch('/client/nearbyData', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({"location": coords}),
})
this.data = await response.json();
this.renderMap.bind(this)();
console.log(this.data)
}catch(err){
  console.error(err)
}
  }


  async renderMap() {
    try {
      hotelmap.classList.remove("hidden");
      const coords = await this.Getlocation();
      console.log(coords)
      this.map = L.map("map").setView([coords.lat,coords.long], 18);
      console.log(coords);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.renderHotelList();
      this.renderHotelsOnMap.bind(this)();
      const locationMarker = L.marker([coords.lat,coords.long])
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
      console.error(err);
    }
  }

  renderHotelsOnMap() {
    const currentObject = this;
    this.data.nearbyHotels.forEach(function (data) {
      L.marker([data.latitude,data.longitude])
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
        <p>${data.hotel_name}</p></div>`
        )
        .openPopup();
    });
  }

  renderHotelList() {
    this.data.nearbyHotels.forEach(function (data) {
      const html = ` <li class="hmap-item btn btn-blue" data-id = "${data.id}">
    <span class="hmap-item__desc"
      ><p class="hmap-item__name">${data.hotel_name}</p>
    </span>
    <span class="hmap-item-rate">
      <div class="hmap-item-rate_star">
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
        <i class="icon-star fa-light fa-star"></i>
      </div>
      <p>Rating</p>
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
      const hotel = this.data.nearbyHotels.find((data) => data.id === id);
      this.map.setView([hotel.latitude,hotel.longitude], 24, { animate: true, duration: 1 });
    }
  }
  async renderLocation() {
    const coords = await this.Getlocation();
    this.map.setView([coords.lat,coords.long], 24, { animate: true, duration: 1 });
  }
}

const nearhotels = new NearHotel();
