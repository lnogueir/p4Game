/* eslint-disable no-console */
var form = document.getElementById("userInfo");

form.onsubmit = function(event) {
    event.preventDefault();
    // console.log(form.gamename.value);
    // console.log(form.email.value);
    // console.log(form.password.value);
}

const data = [
    {
      username:"micheltraveco",
      id:1,
      best_score:0
    },
    {
      username:"lucasFodao",
      id:2,
      best_score:1000
    },
    {
      username:"fingernocu",
      id:3,
      best_score:3
    },
    {
      username:"marcia",
      id: 4,
      best_score:50
    },
    {
        username:"flavia",
        id: 5,
        best_score: 70
    }
  ];