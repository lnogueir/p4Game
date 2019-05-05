/* eslint-disable no-console */
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

for(var i = 0; i < 10; i++)
{
    var newName = document.createElement("TD");
    var userName = document.createTextNode(data[i].username);
    newName.appendChild(userName);

    document.getElementById("r" + i).appendChild(newName);

    var newScore = document.createElement("TD");
    var score = document.createTextNode(data[i].best_score);
    newScore.appendChild(score);

    document.getElementById("r" + i).appendChild(newScore);
}
