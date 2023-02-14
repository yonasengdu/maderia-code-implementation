"use strict";
const cards = document.querySelector(".cards");

class HotelDetails {
  constructor() {
    this.renderReservationCards();
  }

  async renderReservationCards() {
    const response = await fetch(
      "http://127.0.0.1:3000/client/hotelReservations"
    );
    const cards = await response.json();
    let cardHtml = "";
    cards.forEach((card) => {
      cardHtml += `
      <div class="card" data-id="${card.roomTypeId}">
      <h2 class="heading-secondary u-centering">${card.roomTypeName}</h2>
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
          <td>Price</td>
          <td>$${card.roomTypePrice}</td>
        </tr>
      </table>
      <div class="decription">
        <h2>Description</h2>
        <p>
        ${card.roomTypeDesc}
        </p>
      </div>
      <div class="u-centering">
        <button class="btn btn-blue btn-reserved"  ${
          !card.available ? "disabled" : ""
        }>Reserve</button>
      </div>
    </div>
      `;
    });

    cards.innerHTML = cardHtml;
    const btnReserved = document.querySelector(".btn-reserved");

    btnReserved.addEventListener("click", this.reserve.bind(this));
  }

  async reserve(e) {
    const id = e.target.closest(".card").dataset.id;
    const data = {
      roomTypeId: id,
    };

    const request = await fetch("http://127.0.0.1:3000/client/hotelRoomTypes", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    this.renderReservationCards();
  }
}

const hotelManagement = new HotelDetails();
