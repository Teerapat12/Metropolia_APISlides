/**
 * @fileoverview Google map from lab 1
 * @author Teerapat
 */

'use strict';

/* global $ playerList */

function removePlayerFromList(id){
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i].id === id) {
      playerList.splice(i, 1);
      break;
    }
  }

}

function onNewPlayerEnter(receivedJson){
  // alert("A mystery typer has just entered!");
  playerList.push({
    name:"MysteryTyper"+playerList.length,
    id:receivedJson.id,
    isHost:false,
    score:0
  });
  console.log(receivedJson);
  if(isHost){
    pb2.sendJson({
      toId:receivedJson.id,
      type:"updateGame",
      subtype:"playerJoining",
      playerList:playerList,
      gameStarted,
      tileColorLog,
    });

  }

}

function updatePlayerList(){
  console.log("UPdating player list");
  console.log(playerList);
  $("#playerBoard").html ('Player Board');
  for(let i=0;i<playerList.length;i++){
    let isCurrent = '';
    if(playerList[i].id===id)
      isCurrent = ' activeItem';

    let img = ''

    if(playerList[i].isHost) img = '<img width="30" height="30" src="https://www.shareicon.net/data/2016/09/05/825195_miscellaneous_512x512.png"></img>';

    $("#playerBoard").append('<div class="playerItem'+isCurrent+'">'
      +' <div>Name: <span style="color:'+playerList[i].id+'">'+playerList[i].name+'</span></div>'
      +'<div class="score'+playerList[i].id.substring(1,playerList[i].id.length)+'">Score: '+playerList[i].score+'</div>'
      + img
      +'</div>');
  }



  $("#playerBoard").append('<button id="startBtn">Start</button>');
}

function onThisPlayerLeaving(){
  pb2.sendJson({
    type:"quitting",
    id
  });
  if(isHost){
    pb2.sendJson({
      type:"hostQuit",
      id
    });
  }
}

function onOtherPlayerLeaving(){

}