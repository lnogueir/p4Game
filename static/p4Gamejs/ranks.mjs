/* eslint-disable no-console */

const update_ranks =  function(){
  let data = {
  game_name:'P4Golden',
  username:'Pica'
  }
  let rank=[]
  let url = 'http://127.0.0.1:5000/api/game'
  fetch(url,{
          method:"POST",
          headers: {
            "Accept":"application/json",
            "Content-Type":"application/json",
          },
          body: JSON.stringify(data)
      })
  .then(response=>response.json())
  .then(responseJson=>{
    console.log(responseJson)
    // game_name=responseJson.game_name
    rank = responseJson.best_players
    for(var i = 0; i < rank.length; i++){
      // console.log(rank[0])
        var newName = document.createElement("TD");
        var userName = document.createTextNode(rank[i].username);
        newName.appendChild(userName);

        document.getElementById("r" + i).appendChild(newName);

        var newScore = document.createElement("TD");
        var score = document.createTextNode(rank[i].score);
        newScore.appendChild(score);

        document.getElementById("r" + i).appendChild(newScore);
    }
  })
}

update_ranks()


export {update_ranks}




