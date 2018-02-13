/**
 * @fileoverview Google map from lab 1
 * @author Teerapat
 */

'use strict';

/* global $ pb2 playerList isHost*/
const pb2Url = 'localhost:3000'
const pb2 = new PB2(pb2Url, 'teerapat_type_racer_421');
const id = '#'+Math.floor(Math.random()*16777215).toString(16);  //The id is also color in hex.

let isHost = true;
let playerList = [{
  name:"MysteryTyper0",
  id,
  isHost,
  score:0
}]; // Your self

const tileColorLog = [];

function init(){
  pb2.sendJson({
    type:"joining",
    id,
  });
  updatePlayerList();
  
}



$('#btn').click(function() {
  console.log($('#inputText').val());
  pb2.sendJson({
    message: $('#inputText').val(),
  });
});

window.onbeforeunload = function(e) {
  console.log('LEAVING');
  onThisPlayerLeaving();
};

function setupGame(receivedJson) {
  playerList = receivedJson.playerList;
  console.log(playerList);
  isHost = false;
  updatePlayerList();
}

pb2.setReceiver(function(data) {
  const receivedJson = data.json;
  console.log(data);
  if (receivedJson.type==='joining' && !data.me) {
    onNewPlayerEnter(receivedJson);
  } else if (receivedJson.type==='updateGame' && receivedJson.toId=== id) {
    if (receivedJson.subtype==='playerJoining') {
      setupGame(receivedJson);

      if(receivedJson.gameStarted){
        // Game already started. Also have to setup the game board.
        onGameStart();
        loadTilesFromLog(receivedJson.tileColorLog);
      }
    }
  } else if (receivedJson.type==='quitting') {
    removePlayerFromList(receivedJson.id);
  } else if(receivedJson.type==='hostQuit' && !data.me){
    alert("Host quitted. Exiting");
    window.close();
  } else if(receivedJson.type==='startGame') {
    onGameStart();
  }else if(receivedJson.type==='gameEnd') {
    onGameEnd();
  }
  else if(receivedJson.type==='tileClicked'){
    updateTile(receivedJson.tileId,receivedJson.color)
  }
  updatePlayerList();
});

init();
