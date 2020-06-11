var twoPi = Math.PI*2;
var halfPi = Math.PI/2;

function point(x, y){ this.x = x||0; this.y = y||0; }

function start(interval){
	if(mainCycle){return;}
	mainCycle = setInterval(update, interval||defaultInterval);
}
function stop(){
	clearInterval(mainCycle); 
	mainCycle=0;
}

function getScale(){return (pathL + (pathW * 1.6))/2;}
function calcMove(speed, loc, dest) {
	var distX = dest.x - loc.x;
	var distY = dest.y - loc.y;
	
	var dist = (distX**2+distY**2)**.5;

	var ratio = speed / dist;

	var moveX = distX * ratio;
	var moveY = distY * ratio;
	
	var targetX = loc.x + moveX;
	var targetY = loc.y + moveY;
	
	if(Math.abs(distX) < Math.abs(moveX) && Math.abs(distY) < Math.abs(moveY)){
		return new point(dest.x, dest.y);
	}
	
	return new point(targetX, targetY);
}

function calcDistance(a, b){
	var deltaX = a.x-b.x;
	var deltaY = a.y-b.y;
	
	return (deltaX**2+deltaY**2)**.5;
}

function inRange(a, b, range){
	var deltaX = a.x-b.x;
	var deltaY = a.y-b.y;
	
	return (deltaX**2+deltaY**2)<=range**2;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

PathsPerLevel = 64;
function getLevel(){
	return Math.floor( ( (totalPaths + (PathsPerLevel/4)) ) / PathsPerLevel );
}
function getLevelAtPathCount (input){
	return Math.floor(input/PathsPerLevel)
}
function getLevelSpan(){
	return pathL * PathsPerLevel;
}
function LevelToTotalPaths(Level){
	return Level*PathsPerLevel;
}

function unitArrayOrderByLocationX(input){
	var len = input.length;
	var indicies = new Array(len);
	for (var i = 0; i < len; ++i) indicies[i] = i;
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
	var a = Ry*((P.x - C.x)**2);
	var b = Rx*((P.y - C.y)**2);
	var c = Rx * Ry;
	return a+b<=c;
}

//fancy string format function
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != "undefined"
        ? args[number]
        : match
      ;
    });
  };

function getPathYatX(x){
	var index = 0;
	while(path[index].x < x && index < path.length-1){
		index++;
	}
	var x1 = path[index-1].x;
	var x2 = path[index].x;
	var y1 = path[index].y;
	var y2 = path[index-1].y;
	
	if(y1 == y2){return y1;}
	
	var m = (y1 - y2)/(x1 - x2);
	var dx = x - x1;
	var dy = dx * m;
	var y = y1 + dy;
	
	return y;
}
