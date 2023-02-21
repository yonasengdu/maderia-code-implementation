"use strict";
const cardBox = document.querySelector(".cards");
const reviewcardBox = document.querySelector(".cards-review");

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

  hotelRating(rate){
    let stars = [];
      for(let i = 1;i<= 5;i++){
        if(i <= rate){
          stars.push('<i class="fa-solid fa-star"></i>')
        }
        else{
          stars.push("<i class='icon-star fa-light fa-star'></i>")
        }
      }
      return stars.join("")
  }
  async renderReview(id){
    console.log("see")
    const request = await fetch(`http://localhost:3000/review/getReview/${id}`);
    const reviews = await request.json();
    console.log(reviews,"review")
    let reviewHtml = "";
     const obj = this;
      reviewcardBox.innerHTML =  reviewHtml
    reviews.forEach(async function(review){
      const username = await obj.getUserById(review.authorId)
      reviewHtml += ` <div class="card card-review">
      <div class="rating-box">
        <p>Rating</p>
        <div class="rating">
          <p>${review.rating}</p>
          <div>
           ${obj.hotelRating(review.rating)}
          </div>
        </div>
      </div>
      <blockquote>
      ${review.text}
      </blockquote>
      <p>${username}</p>
    </div>`

    console.log(reviewHtml,"html")
    reviewcardBox.insertAdjacentHTML("beforeend",reviewHtml)
    })
    
  }


  async getUserById(userId){
    const user = await fetch(`http://localhost:3000/review/getUserById/${userId}`);
    const username  = await user.json();
    console.log({username:username.full_name})
    return await username.full_name;
    

  }
}

const hotelDetail = new HotelDetails();
