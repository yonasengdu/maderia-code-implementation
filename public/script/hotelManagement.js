"use strict";
const cardBox = document.querySelector(".cards");

class HotelManagement {
  constructor() {
    this.renderHotelTypeCards();
  }

  async renderHotelTypeCards() {
    const response = await fetch("http://127.0.0.1:3000/client/hotelRoomTypes");
    const cards = await response.json();
    let cardHtml = "";
    cards.forEach((card) => {
      cardHtml += `
      <div class="card" data-id="${card.id}">
              <div class="card-head-box">
                <h2 class="heading-secondary">${card.name}</h2>
                <button class="btn btn-blue btn-delete">Delete</button>
              </div>
              <table>
                <tr>
                  <td>Room type</td>
                  <td>${card.roomTypeName}</td>
                </tr>
                <tr>
                  <td>Lifetime</td>
                  <td>${card.reservationLifetime}</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td class="total-room" >${card.totalNumber}</td>
                </tr>
                <tr>
                  <td>Reserved</td>
                  <td>${card.reservedNumber}</td>
                </tr>
                <tr>
                  <td>Occupied</td>
                  <td>${card.occupiedNumber}</td>
                </tr>
              </table>
              <div class="decription">
              <h2>Description</h2>
              <p>
                ${card.description}
              </p>
              </div>
              <div class="buttons">
                <button class="btn btn-blue btn-add-room">Add Room</button>
                <button class="btn btn-blue" btn-remove-room>Remove Room</button>
              </div>
            </div>
      `;
    });

    cardBox.innerHTML = cardHtml;
    const btnDelete = document.querySelector(".btn-delete");
    const btnAddRoom = document.querySelector(".btn-add-room");
    const btnRmoveRoom = document.querySelector(".btn-remove-room");

    btnDelete.addEventListener("click", this.deleteRoomTypeCard.bind(this));
    btnAddRoom.addEventListener("click", this.addRoom.bind(this));
    btnRmoveRoom.addEventListener("click", this.removeRoom.bind(this));
  }

  async deleteRoomTypeCard(e) {
    const id = e.target.closest(".card").dataset.id;
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

  async addRoom(e) {
    const id = e.target.closest(".card").dataset.id;
    const totalRoom = +e.target.closest(".card").querySelector(".total-room")
      .textContent;
    const data = {
      id: id,
      numberOfRooms: totalRoom + 1,
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

  async removeRoom(e) {
    const id = e.target.closest(".card").dataset.id;
    const totalRoom = +e.target.closest(".card").querySelector(".total-room")
      .textContent;
    const data = {
      id: id,
      numberOfRooms: totalRoom - 1,
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
