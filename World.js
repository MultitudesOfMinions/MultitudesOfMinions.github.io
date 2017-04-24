var pageW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
var pageH = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30) / 4;
var halfW = pageW/2;
var halfH = pageH/2;
var drawArea = document.getElementById('canvasArea');
drawArea.width = pageW;
drawArea.height = pageH;
var ctx = drawArea.getContext('2d');
var path = [];
var interval;

function init(){
	path[0] = new point(-100, 0);
	while(path.length > 0 && path[path.length - 1].x < pageW + 100){
		addPathPoint();
	}
	
	interval = setInterval(update, 20);
}

function update(){
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, pageW, pageH);
	
	//Add more path if needed.
	while(path.length > 0 && path[path.length - 1].x < pageW + 100){ addPathPoint(); }
	
	//Remove past path points
	while(path[0].x < -100){ path.splice(0,1); }
	
	//Test infinite path. Remove later.
	for(var i=0; i < path.length; i++){ path[i].x -= 5; }
	
	drawPath();
	drawMinions();
	drawTowers();
}

function addPathPoint(){
	var lastPoint = path[path.length - 1];
	var skew = (halfH - lastPoint.y) >> 4;//Keep path towards center.
	var delta = getRandomInt((pageH/-20) + skew, (pageH/20) + skew);
	var newX = lastPoint.x + (pageW / 100);
	var newY = lastPoint.y + delta;
	
	path[path.length] = new point(newX, newY); //Add a new point
}

function drawPath(){
	var pathW = pageH / 15;
	
	ctx.beginPath();
	ctx.lineWidth = pathW + 5;
	ctx.strokeStyle = '#999';
	ctx.moveTo(path[0].x, path[0].y);
	for(var i=1;i<path.length;i++){
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = pathW;
	ctx.strokeStyle = '#FFF';
	ctx.moveTo(path[0].x, path[0].y);
	for(var i=1;i<path.length;i++){ ctx.lineTo(path[i].x, path[i].y); }
	ctx.stroke();
}

function drawMinions(){}

function drawTowers() {}

init();
update();
