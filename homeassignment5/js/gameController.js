let gameStarted = false;
let currentSec = 10;

const score = {};

// Add Listener to Start Object
$("#playerBoard").on('click','#startBtn',function(){
  pb2.sendJson({
    type: "startGame",
  });

  onGameStart();
});

$("#gameBoard").on('mouseover','.tile',function(e){
  pb2.sendJson({
    type: "tileClicked",
    color:id,
    tileId:e.target.id
  });
})

function onGameStart(){
  if(!gameStarted) {
    //Notify all player that we are starting!


    gameStarted = true;

    for(let i=0;i<=1000;i++){
      $("#gameBoard").append('<div id="tile'+i+'" class="tile"></div>');
      tileColorLog.push('#ffffff');
    }

    //Time out here
    if(isHost)
      setTimeout(()=>{
        pb2.sendJson({
          type: "gameEnd",
        });
      }, 5000);
  }
}

function onGameEnd(){
  // Find the winner.
  let winPlayer = playerList[0];
  for(let i=0; i<playerList; i++){
    const challenger = playerList[i];
    if(challenger.score>winPlayer.score) winPlayer = challenger
  }
  alert(winPlayer.name+" won with "+winPlayer.score+" tiles!");
  alert("Closing the browser. See you later.");
  window.close();
}

function updateTile(tileId,color){
  const numberId = tileId.substring(4,tileId.length)
  const tileColor = tileColorLog[numberId];

  $("#" + tileId).css('background-color', color);
  tileColorLog[numberId] = color;
  //If the changing color
  if(tileColor!== color) score[color] = score[color] ? score[color] + 1 : 1;
  // If there are other color and the color is not our own color
  if(tileColor!== '#ffffff') score[tileColor] = score[tileColor] - 1;
  updateScore();

}

function loadTilesFromLog(LoadedTileColorLog){
  for(let i=0; i<LoadedTileColorLog.length; i++){
    const tileColor = LoadedTileColorLog[i];
    updateTile("tile"+i,tileColor);
    if(tileColor!=='#ffffff')
      score[tileColor] = score[tileColor] ? score[tileColor] + 1 : 1;
  }
  updateScore();
}

function updateScore(){
  // Search playerList with this color
  for(let i=0;i<playerList.length;i++){
    const curPlayer = playerList[i];
    for(let key in score){
      if(key===curPlayer.id){
        curPlayer.score = score[key];
      }
    }
  }
  updatePlayerList();

}