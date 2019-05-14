/* eslint-disable no-console */



let url = 'http://127.0.0.1:5000/users'
fetch(url)
.then(response=>response.json())
.then(responseJson=>console.log(responseJson))


var form = document.getElementById("userInfo");

form.onsubmit = function(event) {
    event.preventDefault();
    const url = "http://127.0.0.1:5000/register";

    const user_info = {
        username: form.gamename.value,
        password: form.password.value
    }

    fetch(url, {
        method:"POST",
        headers: {
          "Accept":"application/json",
          "Content-Type":"application/json",
        },
        body: JSON.stringify(user_info)
    }).then(response => {
        console.log(response);
        if(response.status != 200)
        {
            alert("FUDEU");
        }
    });
}

document.getElementById("login").onclick = function() {
    event.preventDefault();
    const url = "http://127.0.0.1:5000/auth";

    const user_info = {
        username: form.gamename.value,
        password: form.password.value
    }

    fetch(url, {
        method:"POST",
        headers: {
          "Accept":"application/json",
          "Content-Type":"application/json",
        },
        body: JSON.stringify(user_info)
    }).then(response => {
        console.log(response);
        if(response.status != 200)
        {
            alert("User info is invalid or does not exist");
        }
    });
}

document.getElementById("guest").onclick = function() {
    event.preventDefault();
    
    window.location.assign("http://127.0.0.1:5000/home");
}