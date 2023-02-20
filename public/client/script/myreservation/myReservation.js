"use strict";
const cardsbox = document.querySelector(".cards");

class MyReservations {
  constructor() {
    this.renderMyReservation();
  }

  timefunction(el, timeInMinute) {
    let timeInSecond = timeInMinute * 60;
    let hour = `${Math.trunc(timeInSecond / 3600)}`.padStart(2, "0");
    let second = `${timeInSecond % 60}`.padStart(2, "0");
    let minute = `${Math.trunc(timeInSecond / 60) % 60}`.padStart(2, "0");
    el.textContent = `${hour}:${minute}:${second}`;
    setInterval(function () {
      timeInSecond--;
      second = `${timeInSecond % 60}`.padStart(2, "0");
      minute = `${Math.trunc(timeInSecond / 60) % 60}`.padStart(2, "0");
      hour = `${Math.trunc(timeInSecond / 3600)}`.padStart(2, "0");
      el.textContent = `${hour}:${minute}:${second}`;
    }, 1000);
  }

  async renderMyReservation() {
    const response = await fetch("http://localhost:3000/client/myReservations");
    const cards = await response.json();
    let cardHtml = "";
    cardsbox.innerHTML = "";
    cards.forEach((card) => {
      cardHtml = `<div class="card" data-id="${card.id}">
      <div class="card-head-box">
        <h2 class="heading-secondary">${card.hotelName}</h2>
      </div>
      <div class="time-heading">Expiry Time</div>
      <div class="time timeDiv${card.id}">00:00:00</div>
      <table>
        <tr>
          <td>Hotel</td>
          <td>${card.hotelName}</td>
        </tr>
        <tr>
          <td>RoomType</td>
          <td>${card.roomTypeName}</td>
        </tr>
      </table>
      <div class="buttons">
        <button class="btn btn-blue onclick="myReservations.cancel(${card.id})">Cancel</button>
      </div>
    </div>
      `;
      cardsbox.insertAdjacentHTML("beforeend", cardHtml);
      const el = document.querySelector(`.timeDiv${card.id}`);
      this.timefunction(el, card.minutesLeft);
    });
  }

  async cancel(id) {
    const data = {
      roomTypeId: id,
    };
    const request = await fetch("http://localhost:3000/client/reservations", {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    this.renderMyReservation();
  }
}

const myReservations = new MyReservations();
