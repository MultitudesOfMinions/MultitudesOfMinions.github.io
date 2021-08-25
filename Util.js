"use strict";
const twoPi = Math.PI*2;
const halfPi = Math.PI/2;

function point(x, y){ this.x = x||0; this.y = y||0; }
point.prototype.plus = function(addend){
  const x = addend?.x || 0;
  const y = addend?.y || 0;
  
  return new point(this.x+x,this.y+y);
}
point.prototype.equals = function(rhs){
  const x = rhs?.x || 0;
  const y = rhs?.y || 0;

  return this.x===x && this.y===y;
}

function start(){
  document.getElementById("paused").style.display="none";
  paused = false;

  //Not sure how much it matters, but I used some cicada strategies to avoid all triggering at the same time.
  setAchievementInterval(503);//~2x per second
  setBuySellInterval(211);//~5x per second
  setSaveInterval(601);//~100x per minute
  requestAnimationFrame(drawUnits);

  setP1Rate();

	if(!mainCycle){
  	mainCycle = setInterval(update, 7);
	}
}

function setAchievementInterval(interval){
  if(interval <= 0){console.warn("Invalid achievement interval"); return;}
  if(achievementCycle){
  	clearInterval(achievementCycle);
  	achievementCycle=0;
  }
  achievementCycle = setInterval(updateAchievements, interval);
}
function setBuySellInterval(interval){
  if(interval <= 0){console.warn("Invalid buy/sell interval"); return;}
  if(autoBuySellCycle){
  	clearInterval(autoBuySellCycle);
  	autoBuySellCycle=0;
  }
  autoBuySellCycle = setInterval(autoBuySell, interval);
}
function setSaveInterval(interval){
  if(interval <= 0){console.warn("Invalid save interval"); return;}
  if(autoSaveCycle){
  	clearInterval(autoSaveCycle);
  	autoSaveCycle=0;
  }
  autoSaveCycle = setInterval(updateAutosave, interval);
}

function setP1Rate(){
  const rate = getP1Rate();
	clearInterval(p1Cycle);
	p1Cycle=0;

  if(rate===0){
	  pnl1.style.display = "none";
	  reshowP1.style.display = null;
  	return;
  }

  pnl1.style.display = null;
  reshowP1.style.display = "none";
  
  setP1Interval(rate);
}
function setP0Interval(interval){
  if(interval == 0){console.warn("Invalid p0 interval"); return;}
  if(p0Cycle){
  	clearInterval(p0Cycle);
  	p0Cycle=0;
  }
  p0Cycle = setInterval(updateP0, interval);
}
function setP1Interval(interval){
  if(interval == 0){console.warn("Invalid p1 interval"); return;}
  if(p1Cycle){
  	clearInterval(p1Cycle);
  	p1Cycle=0;
  }
  p1Cycle = setInterval(updateP1, interval);
}


function stop(){
  document.getElementById("paused").style.display=null;
  paused = true;

	clearInterval(achievementCycle);
	achievementCycle=0;

	clearInterval(autoBuySellCycle);
	autoBuySellCycle=0;

	clearInterval(autoSaveCycle);
	autoSaveCycle=0;

	clearInterval(p0Cycle);
	p0Cycle=0;

	clearInterval(p1Cycle);
	p1Cycle=0;

	clearInterval(mainCycle);
	mainCycle=0;
}

function getScale(){return (pathL+pathW)/2;}
function calcMove(speed, loc, dest) {
  if(loc.equals(dest)){return dest;}
  
	const distX = dest.x - loc.x;
	const distY = dest.y - loc.y;
	
	const dist = (distX**2+distY**2)**.5;

	const ratio = speed / dist;

	const moveX = distX * ratio;
	const moveY = distY * ratio;
	
	const targetX = loc.x + moveX;
	const targetY = loc.y + moveY;
	
	if(Math.abs(distX) <= Math.abs(moveX) && Math.abs(distY) <= Math.abs(moveY)){
		return dest;
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
function nanMult(a, b){
  if(isNaN(a)){return b;}
  if(isNaN(b)){return a;}
  return a*b;
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
function getRandomIntExclusions(min, max, exclusions){
  if(exclusions == null){return getRandomInt(min, max);}
  
  let totalExclusions=0;

  if(!Array.isArray(exclusions)){
    //only exclude numbers between min/max
    exclusions.min = Math.max(min, exclusions.min);
    exclusions.min = Math.min(max, exclusions.min);
    exclusions.max = Math.max(min, exclusions.max);
    exclusions.max = Math.min(max, exclusions.max);
    totalExclusions = exclusions.max - exclusions.min;
  }
  else{
    for(let i=0;i<exclusions.length;i++){
      //only exclude numbers between min/max
      exclusions[i].min = Math.max(min, exclusions[i].min);
      exclusions[i].min = Math.min(max, exclusions[i].min);
      exclusions[i].max = Math.max(min, exclusions[i].max);
      exclusions[i].max = Math.min(max, exclusions[i].max);
      
      totalExclusions += exclusions[i].max - exclusions.min;
    }
  }
  
  max -= totalExclusions;
  
  let rand = getRandomInt(min, max);
  
  if(!Array.isArray(exclusions)){
    if(rand > exclusions.min){
      rand += exclusions.max - exclusions.min;
    }
  }
  else{
    for(let i=0;i<exclusions.length;i++){
      if(rand > exclusions[i].min){
        rand += exclusions[i].max - exclusions[i].min;
      }
    }
  }
  
  return rand;
}

function fileExists(url){
    //try{
      var http = new XMLHttpRequest();
    try{
      http.open('HEAD', image_url, false);
      http.send();
    }catch{}
    //}catch(error){return false;}
    //return true;
    return http.status != 404;
    
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
String.prototype.unfixString = function(){
  const temp = this.charAt(0).toLowerCase() + this.slice(1);
  return temp.replace(/\s/g, '');
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
	//console.log(index, x1,x2,y1,y2);
	
	if(y1 == y2){return y1;}
	if(x == x1){return y1;}
	if(x == x2){return y2;}
	
	const m = (y1 - y2)/(x1 - x2);
	const dx = x - x1;
	const dy = dx * m;
	const y = y1 + dy;
	
	return y;
}
