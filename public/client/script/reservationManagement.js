'use strict';
const reservationCards = document.querySelector('.reservationCards');
const occupancyCards = document.querySelector('.occupancyCards');
const overlay = document.querySelector('.overlay');
const popupClose = document.querySelector('.popup-close');
const promote = document.querySelector('.promote');
const searchReservationBtn = document.querySelector('#search-reservation');
const searchOccupancyBtn = document.querySelector('#search-occupancy');
const searchInputOccupancy = document.querySelector('.search-input-occupancy');
const searchInputReservation = document.querySelector(
  '.search-input-reservation',
);
console.log({ searchInputOccupancy, searchInputReservation });
overlay.addEventListener('click', function () {
  document.body.classList.remove('reservationPopup');
});

// promote.addEventListener("click", function () {
//   console.log("see")
//   document.body.classList.add("reservationPopup");
// });

class ReservationManagement {
  cards = {};
  constructor() {
    this.renderData();
    overlay.addEventListener('click', this.overlays.bind(this));
    
    
  }
  async renderData() {
    const response = await fetch(
      'http://localhost:3000/client/reservationManagement',
    );
    this.cards = await response.json();
    console.log(this.cards);
    this.renderReservationData();
    this.renderOccupancyData();
    searchReservationBtn.addEventListener('click', function () {
      this.searchRearrage(searchInputReservation.value, true);
    }.bind(this));
    searchOccupancyBtn.addEventListener('click', function () {
      this.searchRearrage(searchInputOccupancy.value, false);
    }.bind(this));
    console.log("--" + this.cards.reservations);
  }

  renderReservationData() {
    let cardHtml = '';
    this.cards.reservations.forEach((card) => {
      cardHtml += ` <div class="card" data-id="${card.id}">
      <div class="room">${card.roomType}</div>
      <div class="card-head-box">
        <h2 class="heading-tertiary">${card.username}</h2>
        <button class="btn btn-blue" onclick = "reservationManagement.promote(${card.id})">Promote</button>
      </div>
    </div>`;
    });

    reservationCards.innerHTML = cardHtml;
  }

  renderOccupancyData() {
    let cardHtml = '';
    this.cards.occupancies.forEach((card) => {
      let expiry = new Date(card.expiryTime);
      cardHtml += `  <div class="card" data-id="${card.id}">
      <table>
        <tr>
          <td>User</td>
          <td class="heading-tertiary">${card.username}</td>
        </tr>
        <tr>
          <td>Room type</td>
          <td>${card.roomType}</td>
        </tr>
        <tr>
          <td>Expiry time</td>
          <td>${expiry.toDateString()}</td>
        </tr>
      </table>
    </div>`;
    });
    occupancyCards.innerHTML = cardHtml;
  }
  promote(id) {
    document.body.classList.add('reservationPopup');
    document.querySelector('.input-id').value = id;
  }
  overlays() {
    document.body.classList.remove('reservationPopup');
  }

  // we use this algorithm to find the magnitude of similarity between strings.
  longest_common_subsequence(strOne, strTwo) {
    const matrix = []; // the grid

    function getItem(row, col) {
      if (row == -1 || col == -1) {
        return 0;
      }
      return matrix[row][col];
    }

    // we're populating the grid

    for (let row = 0; row < strTwo.length; row++) {
      matrix[row] = [];
      for (let col = 0; col < strOne.length; col++) {
        if (strOne[col] == strTwo[row]) {
          matrix[row][col] = getItem(row - 1, col - 1) + 1;
        } else {
          let temp = getItem(row - 1, col) >= getItem(row, col - 1);
          matrix[row][col] = temp
            ? getItem(row - 1, col)
            : getItem(row, col - 1);
        }
      }
    }
    return getItem(strTwo.length - 1, strOne.length - 1);
  }

  searchRearrage(searchString, reservation) {
    let list;
    if(reservation) {
      list = this.cards.reservations;
    } else {
      list = this.cards.occupancies;
    }
    for (let item of list) {
      let similarity = this.longest_common_subsequence(
        searchString,
        item.username,
      );
      item['similarity'] = similarity;
    }
    list.sort((a, b) => b.similarity - a.similarity)
    reservation ? this.renderReservationData() : this.renderOccupancyData();
  }
}

const reservationManagement = new ReservationManagement();
