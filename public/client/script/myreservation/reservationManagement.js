"use strict";
const cardsbox = document.querySelector(".cards");
const overlay = document.querySelector(".overlay");
const popupClose = document.querySelector(".popup-close");
const promote = document.querySelector(".promote");

overlay.addEventListener("click", function () {
  document.body.classList.remove("reservationPopup");
});

promote.addEventListener("click", function () {
  document.body.classList.add("reservationPopup");
});

class ReservationManagement {
  cards = [];
  constructor() {
    this.renderData();
  }
  async renderData() {
    const response = await fetch("http://localhost:3000/client/myReservations");
    this.cards = await response.json();
    this.renderReservationData();
    this.renderOccupationData();
  }

  renderReservationData() {
    let cardHtml = "";
    cardsbox.innerHTML = "";
    this.cards[0].forEach((card) => {
      cardHtml = ` <div class="card" data-id="${card.id}">
      <div class="room">${card.roomType}</div>
      <div class="card-head-box">
        <h2 class="heading-tertiary">${card.user}</h2>
        <button class="btn btn-blue" onclick = "reservationManagement.promote(${card.id})">Promote</button>
      </div>
    </div>`;
      cardsbox.innerHTML = cardHtml;
    });
  }
  renderOccupationData() {
    let cardHtml = "";
    cardsbox.innerHTML = "";
    this.cards[1].forEach((card) => {
      cardHtml = `  <div class="card" data-id="${card.id}">
      <table>
        <tr>
          <td>User</td>
          <td class="heading-tertiary">${card.user}</td>
        </tr>
        <tr>
          <td>Room type</td>
          <td>${card.roomType}</td>
        </tr>
        <tr>
          <td>Expiry time</td>
          <td>${card.expiryTime}"</td>
        </tr>
      </table>
    </div>`;
      cardsbox.innerHTML = cardHtml;
    });
  }
  promote(id) {
    document.body.classList.add("showPopup");
    document.querySelector(".input-id").value = id;
  }
}

const reservationManagement = new ReservationManagement();
