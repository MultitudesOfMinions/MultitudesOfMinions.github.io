function point(x, y){ this.x = x||0; this.y = y||0; }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function DistanceSquared(P1, P2){
	return (P1.y - P2.y)**2 - (P1.x - P2.x)**2;
}

var minionMoveSin = [];
var minionMoveCos = [];

var sin = [];
var cos = [];