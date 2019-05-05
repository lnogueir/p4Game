/* eslint-disable no-console */
var form = document.getElementById("userInfo");

form.onsubmit = function(event) {
    event.preventDefault();
    console.log(form.gamename.value);
}

document.getElementById("login").onclick = function() {
    event.preventDefault();
    console.log(form.password.value);
}