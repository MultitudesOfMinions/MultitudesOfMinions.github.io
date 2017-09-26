function point(x, y){ this.x = x||0; this.y = y||0; }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
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

