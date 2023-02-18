"use strict";
console.log("attached")
const cardBox = document.querySelector(".cards");

class HotelManagement {
  constructor() {
    this.renderHotelTypeCards();
  }

  async renderHotelTypeCards() {
    console.log("in renderHotelTypes")
    const response = await fetch("http://127.0.0.1:3000/client/hotelRoomTypes", {credentials: "same-origin"});
    const cards = await response.json();
    console.log({cards,})
    let cardHtml = "";
    cards.forEach((card,i) => {
      cardHtml += `
      <div class="card" data-id="${card.id}">
              <div class="card-head-box">
                <h2 class="heading-secondary">${card.name}</h2>
                <button class="btn btn-blue btn-delete" onclick="hotelManagement.deleteRoomTypeCard(${card.id})">Delete</button>
              </div>
              <table>
                <tr>
                  <td>Room type</td>
                  <td>${card.name}</td>
                </tr>
                <tr>
                  <td>Lifetime</td>
                  <td>${card.reservationLifetime}</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td class="total-room" id="rt-${card.id}-total" >${card.totalNumber}</td>
                </tr>
                <!-- <tr>
                  <td>Reserved</td>
                  <td>${card.reservedNumber}</td>
                </tr>
                <tr>
                  <td>Occupied</td>
                  <td>${card.occupiedNumber}</td>
                </tr> -->
              </table>
              <div class="decription">
              <h2>Description</h2>
              <p>
                ${card.description}
              </p>
              </div>
              <div class="buttons">
                <button class="btn btn-blue btn-add-room" onclick="hotelManagement.addRoom(${card.id})">Add Room</button>
                <button class="btn btn-blue btn-remove-room" onclick="hotelManagement.removeRoom(${card.id})">Remove Room</button>
              </div>
            </div>
      `;
    });


    cardBox.innerHTML = cardHtml;
    // const btnDelete = document.querySelector(".btn-delete");
    // const btnAddRoom = document.querySelector(".btn-add-room");
    // const btnRmoveRoom = document.querySelector(".btn-remove-room");

    // btnDelete.addEventListener("click", this.deleteRoomTypeCard.bind(this));
    // btnAddRoom.addEventListener("click", this.addRoom.bind(this));
    // btnRmoveRoom.addEventListener("click", this.removeRoom.bind(this));
  }

  async deleteRoomTypeCard(id) {
    const data = {
      id: id,
    };

    const request = await fetch("http://127.0.0.1:3000/client/hotelRoomTypes", {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    this.renderHotelTypeCards();
  }

  async addRoom(id) {
    // const id = e.target.closest(".card").dataset.id;
    // const totalRoom = +e.target.closest(".card").querySelector(".total-room")
    const totalRoom = +document.querySelector(`#rt-${id}-total`).textContent;
    const data = {
      id: id,
      noOfRooms: totalRoom + 1,
    };

    const request = await fetch("http://127.0.0.1:3000/client/hotelRoomTypes", {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    this.renderHotelTypeCards();
  }

  async removeRoom(id) {
    // const id = e.target.closest(".card").dataset.id;
    // const totalRoom = +e.target.closest(".card").querySelector(".total-room")
    //   .textContent;
    const totalRoom = +document.querySelector(`#rt-${id}-total`).textContent
    const data = {
      id: id,
      noOfRooms: totalRoom - 1,
    };

    const request = await fetch("http://127.0.0.1:3000/client/hotelRoomTypes", {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    this.renderHotelTypeCards();
  }
}

const hotelManagement = new HotelManagement();
