var twoPi = Math.PI*2;
var halfPi = Math.PI/2;

function point(x, y){ this.x = x||0; this.y = y||0; }

function start(interval){
	if(mainCycle){return;}
	mainCycle = setInterval(update, interval||20);
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
	
	return new point(loc.x + moveX, loc.y + moveY);
}

function calcDistance(a, b){
	var deltaX = a.x-b.x;
	var deltaY = a.y-b.y;
	
	return (deltaX**2+deltaY**2)**.5;
}

function inRange(a, b, range){
	var deltaX = a.x-b.x;
	var deltaY = a.y-b.y;
	
	return (deltaX**2+deltaY**2)<range**2;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

levelScale = 64;
function getLevel(){
	return Math.floor(totalPaths/levelScale);
}
function getLevelAtPathCount (input){
	return Math.floor(input/levelScale)
}
function getLevelSpan(){
	return pathL * levelScale;
}
function LevelToTotalPaths(Level){
	return Level*levelScale;
}

function unitArrayOrderByLocationX(input){
	var order = [];
	for(var i=0; i<input.length;i++){
		if(input[i] == null || !input[i].hasOwnProperty("Location")){continue;}
		
		var newX = input[i].Location.x;
		if(input.length == 0){ return []; }
		for(var j=0; j<order.length; j++){
			if(newX > input[order[j]].Location.x){
				order.splice(j,0,i);
				break;
			}
		}
		order[order.length]=i;
	}
	return order;
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
      return typeof args[number] != 'undefined'
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
	return path[index].y;
}
