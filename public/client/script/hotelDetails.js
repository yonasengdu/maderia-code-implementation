"use strict";
const cardBox = document.querySelector(".cards");
const hotelDetailSection = document.querySelector(".hotelDetail")
const inputId = document.querySelector(".input-id")


class HotelDetails {
  cards = []
  constructor() {
    ( async function (){
      await this.renderReservationCards();
      console.log(this.cards.length)
       if(this.cards.length >=1){
        console.log("ok")
        this.renderReview(this.cards[0].hotelId);
      }
    }.bind(this)())
  }

  async renderReservationCards() {
   const id =  hotelDetailSection.dataset.id
    const data = {
      id:id
    }
    const request = await fetch("http://localhost:3000/client/hotelRoomData", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
     this.cards = await request.json();
    if(this.cards[0]){
      inputId.value = this.cards[0].hotelId
    }
   let cardHtml = "";
    this.cards.forEach((card) => {
      cardHtml += `
      <div class="card" data-id="${card.id}">
      <h2 class="heading-secondary u-centering">${card.name}</h2>
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
          <td>Price</td>
          <td>$${card.price}</td>
        </tr>
      </table>
      <div class="decription">
        <h2>Description</h2>
        <p>
        ${card.description}
        </p>
      </div>
      <div class="u-centering">
        <button
        class="btn btn-blue btn-reserved"  ${
          !card.available ? "disabled" : ""
        } onClick="hotelDetail.reserve(${card.id})">Reserve</button>
      </div>
    </div>
      `;
    });
    cardBox.innerHTML = cardHtml;
  }

  async reserve(id) {
    const data = {
      roomTypeId: id,
    };

    const request = await fetch("http://localhost:3000/client/reservation", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    this.renderReservationCards();
    location = "http://localhost:3000/client/myReservationsPage"
  }


  async renderReview(id){
    console.log("see")
    const request = await fetch(`http://localhost:3000/review/getReview/${id}`);

    const reviews = await request.json();
    

    console.log(reviews,"review")

  }
}

const hotelDetail = new HotelDetails();
