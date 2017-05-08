var gameW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
var gameH = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30)/3;
var halfW = gameW>>1;
var halfH = gameH>>1;
var drawArea = document.getElementById('canvasArea');

drawArea.width = gameW;
drawArea.height = gameH;
var ctx = drawArea.getContext('2d');
var path = [];
var pathInc = gameW>>6;
var pathW = gameH>>4;
var minions = [];
var towers = [];
var projectiles = [];
var mainCycle;
var totalD = 0;

function init(){
	//Resize panels
	var pnl1 = document.getElementById('pnl1');
	pnl1.style.minHeight = gameH;
	pnl1.style.width=gameW;
	var pnl2 = document.getElementById('pnl2');
	pnl2.style.minHeight = gameH;
	pnl2.style.width=gameW;
	
	//Build path
	path[0] = new point(-100, halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		addPathPoint();
	}
	
	mainCycle = setInterval(update, 20);
	
	//build special minion movement cos/sin tables based on the pathInc.
	for(var i=(-gameH>>5)-10; i<(gameH>>5)+11;i++){
		minionMoveSin[minionMoveSin.length]=new point(i,-Math.sin(i/pathInc));
		minionMoveCos[minionMoveCos.length]=new point(i,Math.cos(i/pathInc));
	}
	
	//build 0-359deg sin/cos tables for projectile movement 
	for(var i=0; i<360;i++){
		sin[sin.length]=new point(i,-Math.sin(i/57.2957795131));
		cos[cos.length]=new point(i,Math.cos(i/57.2957795131));
	}
	
	//TESTING AREA	
	minions[0] = new MinionFactory(baseMinions.pete);
}

function update(){
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	//Add more path if needed.
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		addPathPoint();
	}
	
	//Remove past path points
	while(path[0].x < -(gameW<<2)){
		path.splice(0,1);
		totalD++;//measures how far we've come.
	}
	//Remove past minions
	for(var i=0; i< minions.length;i++){
		if(minions[i].Location.x < -(gameW<<2)){
			minions.splice(i,1);
		}
	}
	
	//Recenter path on furthest minion beyond half
	var maxX = 0;
	for(var i=0;i<minions.length;i++){ maxX = Math.max(maxX, minions[i].Location.x); }
	if(maxX > halfW){
		var deltaX = maxX - halfW;
		for(var i=0; i < path.length; i++){ path[i].x -= deltaX; }
		for(var i=0; i < minions.length; i++){ minions[i].Location.x -= deltaX; }
		for(var i=0; i < towers.length; i++){ towers[i].Location.x -= deltaX; }
		for(var i=0; i < projectiles.length; i++){ projectiles[i].Location.x -= deltaX; }
	}
	
	//TODO: generate towers, frequency/level based on totalD;
	
	//move minions
	for(var i=0;i<minions.length;i++){ minions[i].Move(); }
	//TODO: minions attack
	//TODO: towers attack
	//TODO: move projectiles
	
	//Draw all the stuffs.
	drawPath();
	drawMinions();
	drawTowers();
	drawProjectiles();
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
	var r = pathW * .7;
	for(var i=1;i<path.length;i++){
		ctx.beginPath();
		//ctx.arc(path[i].x, path[i].y, r, 0, 7);
		ctx.ellipse(path[i].x, path[i].y, pathW, r, 0, 0, Math.PI*2)
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

function drawTowers() {
	for(var i=0;i<towers.length;i++){ 
		towers[i].Draw(); 
	}	
}

function drawProjectiles() {
	for(var i=0;i<projectiles.length;i++){ 
		projectiles[i].Draw(); 
	}
}


init();
update();