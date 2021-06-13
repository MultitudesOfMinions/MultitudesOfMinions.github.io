"use strict";

const stats = new GameStats();

function GameStats(){
  this.data = {};
  this.pastData = {};
}

GameStats.prototype.incrementDeployCount=function(type){
  if(!stats.data.hasOwnProperty(type)){
    stats.data[type]=new UnitStats(type);
  }
  stats.data[type].incrementDeployCount();
}
GameStats.prototype.addDamageDone=function(type, value){
  if(!stats.data.hasOwnProperty(type)){
    stats.data[type]=new UnitStats(type);
  }
  stats.data[type].addDamageDone(value);
}
GameStats.prototype.addDamageTaken=function(type, value){
  if(!stats.data.hasOwnProperty(type)){
    stats.data[type]=new UnitStats(type);
  }
  stats.data[type].addDamageTaken(value);
}
GameStats.prototype.pushReset=function(){
  const key = new Date().getTime();
  this.pastData[key] = {data:this.data, ticks:ticksSinceReset};
  this.data = {};
}

function UnitStats(type){
  this.type = type;
  this.deployCount = 0;
  this.damageDone = 0;
  this.damageTaken = 0;
}
UnitStats.prototype.incrementDeployCount=function(){
  this.deployCount++;
}
UnitStats.prototype.addDamageDone=function(value){
  this.damageDone+=value;
}
UnitStats.prototype.addDamageTaken=function(value){
  this.damageTaken+=value;
}
UnitStats.prototype.getHTMLRow=function(parent){
  const row = createNewElement("tr", "statsRow"+this.type, parent, [], null);
  createNewElement("td", null, row, [], this.type);
  createNewElement("td", null, row, [], this.deployCount);
  createNewElement("td", null, row, [], this.damageDone);
  createNewElement("td", null, row, [], this.damageTaken);
}
