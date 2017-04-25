var gameW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
var gameH = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30)>>1;
var halfW = gameW>>1;
var halfH = gameH>>1;
var drawArea = document.getElementById('canvasArea');
drawArea.width = gameW;
drawArea.height = gameH;
var ctx = drawArea.getContext('2d');
var path = [];
var sin = [];
var cos = [];
var pathInc = gameW>>6;
var minions = [];
var mainCycle;

function init(){
	path[0] = new point(-100, halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		addPathPoint();
	}
	
	mainCycle = setInterval(update, 20);
	minions[0] = new Minion(10, 10 ,1, path[0].x, path[0].y);
	
	//build cos/sin look up tables to speed up minion movement later.
	for(var i=(-gameH>>5)-5; i<(gameH>>5)+6;i++){
		sin[sin.length]=new point(i,-Math.sin(i/pathInc));
		cos[cos.length]=new point(i,Math.cos(i/pathInc));
	}
}

function update(){
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	//Add more path if needed.
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		addPathPoint();
	}
	
	//Remove past path points
	while(path[0].x < -100){
		path.splice(0,1);
	}
	
	var maxX = 0;
	for(var i=0;i<minions.length;i++){ maxX = Math.max(maxX, minions[i].Location.x); }
	if(maxX > halfW){
		var deltaX = maxX - halfW;
		for(var i=0; i < path.length; i++){ path[i].x -= deltaX; }
		for(var i=0; i < minions.length; i++){ minions[i].Location.x -= deltaX; }
	}
	
	for(var i=0;i<minions.length;i++){ minions[i].Move(); }
	
	drawPath();
	drawMinions();
	drawTowers();
}

function addPathPoint(){
	var lastPoint = path[path.length - 1];
	var skew = (halfH - lastPoint.y) >> 4;//Keep path towards center.
	
	var delta = getRandomInt((-gameH>>5) + 1, (gameH>>5)) + skew;
	var newX = lastPoint.x + pathInc;
	var newY = lastPoint.y + delta;
	
	path[path.length] = new point(newX, newY); //Add a new point
}

function drawPath(){
	var pathW = gameH>>3;
	
	var r = pathW * .7;
	for(var i=1;i<path.length;i++){
		ctx.beginPath();
		ctx.arc(path[i].x, path[i].y, r, 0, 7);
		ctx.fillStyle='#999';
		ctx.fill();
	}
	
	ctx.beginPath();
	ctx.lineWidth = pathW;
	ctx.strokeStyle = '#FFF';
	ctx.moveTo(path[0].x, path[0].y);
	for(var i=1;i<path.length;i++){
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.stroke();
}

function drawMinions(){ 
	for(var i=0;i<minions.length;i++){ 
		minions[i].Draw(); 
	}
}

function drawTowers() {}

init();
update();
