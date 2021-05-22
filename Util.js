"use strict";
const twoPi = Math.PI*2;
const halfPi = Math.PI/2;

function point(x, y){ this.x = x||0; this.y = y||0; }

function start(interval){
	if(mainCycle){return;}
	mainCycle = setInterval(update, interval||defaultInterval);
}
function stop(){
	clearInterval(mainCycle);
	mainCycle=0;
}

function getScale(){return (pathL+pathW)/2;}
function calcMove(speed, loc, dest) {
	const distX = dest.x - loc.x;
	const distY = dest.y - loc.y;
	
	const dist = (distX**2+distY**2)**.5;

	const ratio = speed / dist;

	const moveX = distX * ratio;
	const moveY = distY * ratio;
	
	const targetX = loc.x + moveX;
	const targetY = loc.y + moveY;
	
	if(Math.abs(distX) < Math.abs(moveX) && Math.abs(distY) < Math.abs(moveY)){
		return new point(dest.x, dest.y);
	}
	
	return new point(targetX, targetY);
}

function buildDictionary(array, key, value){
  const output = {};
  for(let i=0;i<array.length;i++){
    output[array[i][key]] = array[i][value];
  }
  
  return output;
}

function clearChildren(parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}

function calcDistance(a, b){
	const deltaX = a.x-b.x;
	const deltaY = a.y-b.y;
	
	return (deltaX**2+deltaY**2)**.5;
}
function nanAdd(a, b){
  if(isNaN(a)){return b;}
  if(isNaN(b)){return a;}
  return a+b;
}
function nanMax(a, b){
  if(isNaN(a)){return b;}
  if(isNaN(b)){return a;}
  return Math.max(a,b);
}

function inRange(a, b, range){
	const deltaX = a.x-b.x;
	const deltaY = a.y-b.y;
	
	return (deltaX**2+deltaY**2)<=range**2;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function pickAKey(input){
	  const keys = Object.keys(input);
	  const index = getRandomInt(0, keys.length)
		const option = input[keys[index]];
		return option;
}
function pickOne(array){
	  const index = getRandomInt(0, array.length)
		const option = array[index];
		return option;
}

const PathsPerLevel = 64;
function getLevelAtPathCount (input){
	return Math.floor(input/PathsPerLevel)
}
function getLevelSpan(){
	return pathL * PathsPerLevel;
}
function LevelToTotalPaths(Level){
	return Level*PathsPerLevel;
}
function getEndOfLevelX(Level){
	const paths = ((+Level+1)*PathsPerLevel) - totalPaths;
	return paths * pathL;
}

function unitArrayOrderByLocationX(input){
	const len = input.length;
	const indicies = new Array(len);
	for(let i = 0; i < len; ++i) indicies[i] = i;
	indicies.sort(function (a, b) {
			return input[a].Location.x < input[b].Location.x ? 1 :
					input[a].Location.x > input[b].Location.x ? -1 : 0; }
			);
	return indicies;
}

//P=point to check, C=center of ellipse, Rx is x radius, Ry is y radius
function isInEllipse(P, C, Rx, Ry){
	Rx = Rx**2;
	Ry = Ry**2;
	const a = Ry*((P.x - C.x)**2);
	const b = Rx*((P.y - C.y)**2);
	const c = Rx * Ry;
	return a+b<=c;
}

//fancy string format function
String.prototype.format = function() {
    const args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != "undefined"
        ? args[number]
        : match
      ;
    });
  };
String.prototype.fixString = function() {
	const temp = this.charAt(0).toUpperCase() + this.slice(1);
	return temp.replace(/([A-Z])/g, " $1").trim();
}


function getPathYatX(x){
	let index = 1;
	while(path[index].x < x && index < path.length-1){
		index++;
	}
	const x1 = path[index-1].x;
	const x2 = path[index].x;
	const y1 = path[index-1].y;
	const y2 = path[index].y;
	
	if(y1 == y2){return y1;}
	if(x == x1){return y1;}
	if(x == x2){return y2;}
	
	const m = (y1 - y2)/(x1 - x2);
	const dx = x - x1;
	const dy = dx * m;
	const y = y1 + dy;
	
	return y;
}
