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
GameStats.prototype.incrementUnitCount=function(type){
  if(!stats.data.hasOwnProperty(type)){
    stats.data[type]=new UnitStats(type);
  }
  stats.data[type].incrementUnitCount();
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
  
  const parent = getUIElement("statsSelect");
  const key = "Reset #"+ parent.childNodes.length;
  createNewElement("option", "dataset"+key, parent, [], key);
  this.pastData[key] = {data:this.data, ticks:ticksSinceReset};
  this.data = {};
  setStats();
}
GameStats.prototype.getDataSet=function(key){
  if(key == "Current"){return {data:this.data, ticks:ticksSinceReset};}
  if(!this.pastData.hasOwnProperty(key)){return {data:{}, ticks:0};}
  return this.pastData[key];
}

function filterDataSet(dataSet, team){
  let types = [];
  if(team=="All"){
    types = [...Object.getOwnPropertyNames(baseMinion),
            ...Object.getOwnPropertyNames(baseBoss),
            ...Object.getOwnPropertyNames(baseTower),
            ...Object.getOwnPropertyNames(baseHero)];
  }
  if(team=="Invaders"){
    types = [...Object.getOwnPropertyNames(baseMinion),...Object.getOwnPropertyNames(baseBoss)];
  }
  if(team=="Defenders"){
    types = [...Object.getOwnPropertyNames(baseTower),...Object.getOwnPropertyNames(baseHero)]
  }
  
  const output = [];
  
  for(let [type, data] of Object.entries(dataSet)){
    if(types.includes(type)){
      output.push(data);
    }
  }
  
  return output;
}

function UnitStats(type){
  this.type = type;
  this.deployCount = 0;
  this.unitCount = 0;
  this.damageDone = 0;
  this.damageTaken = 0;
}
Object.defineProperties(UnitStats.prototype, {
    donePerUnit: {
      get: function getDamageDonePerUnit(){ return this.damageDone/this.deployCount; }
    },
    takenPerUnit:{
      get: function getDamageTakenPerUnit(){ return this.damageTaken/this.deployCount; }
    }
});
UnitStats.prototype.incrementDeployCount=function(){
  this.deployCount++;
}
UnitStats.prototype.incrementUnitCount=function(){
  this.unitCount++;
}
UnitStats.prototype.addDamageDone=function(value){
  this.damageDone+=Math.max(0,value);
}
UnitStats.prototype.addDamageTaken=function(value){
  this.damageTaken+=Math.max(0,value);
}
UnitStats.prototype.getDamageDone=function(){
  if(this.damageDone==-Infinity){return 0;}
  return Math.floor(this.damageDone*100)/100;
}
UnitStats.prototype.getDamageTaken=function(){
  if(this.damageDone==-Infinity){return 0;}
  return Math.floor(this.damageTaken*100)/100;
}
UnitStats.prototype.getDamageDonePerUnit=function(){
  if(this.damageDone==-Infinity){return 0;}
  return Math.floor(this.damageDone/this.deployCount*100)/100;
}
UnitStats.prototype.getDamageTakenPerUnit=function(){
  if(this.damageDone==-Infinity){return 0;}
  return Math.floor(this.damageTaken/this.deployCount*100)/100;
}

UnitStats.prototype.compare=function( a, p ) {
  if ( this[p] < a[p] ){
    return -1;
  }
  if ( this[p] > a[p] ){
    return 1;
  }
  return 0;
}

const formatDeployCount = function(deployCount, unitCount){
  if(deployCount>0&&unitCount>0){
    return "{0}({1})".format(deployCount, unitCount);
  }
  return Math.max(deployCount, unitCount);
}
UnitStats.prototype.buildHTMLRow=function(parent){
  const row = createNewElement("tr", "statsRow"+this.type, parent, [], null);
  createNewElement("td", "srType"+this.type, row, [], this.type);
  createNewElement("td", "srDeploy"+this.type, row, [], formatDeployCount(this.deployCount, this.unitCount));
  createNewElement("td", "srDone"+this.type, row, [], this.getDamageDone());
  createNewElement("td", "srTaken"+this.type, row, [], this.getDamageTaken());
  createNewElement("td", "srDonePerUnit"+this.type, row, [], this.getDamageDonePerUnit());
  createNewElement("td", "srTakenPerUnit"+this.type, row, [], this.getDamageTakenPerUnit());
}
UnitStats.prototype.updateHTMLRow=function(parent){
  if(document.getElementById("srType"+this.type)==null){
    this.buildHTMLRow(parent);
    return;
  }
  setElementTextById("srDeploy"+this.type, formatDeployCount(this.deployCount, this.unitCount));
  setElementTextById("srDone"+this.type, this.getDamageDone());
  setElementTextById("srTaken"+this.type, this.getDamageTaken());
  setElementTextById("srDonePerUnit"+this.type, this.getDamageDonePerUnit());
  setElementTextById("srTakenPerUnit"+this.type, this.getDamageTakenPerUnit());
}
