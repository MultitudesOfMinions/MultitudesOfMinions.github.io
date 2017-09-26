//TODO: plan out prestige upgrades vs normal upgrades. (possibly similar/stacking with eachother)
//TODO: make minion upgrades and implement them in the minion stats or some such.
//TODO: save player stats in cookies.
//TOOD: load player stats from cookies.
//TODO: make notification saying site uses cookies.
//TODO: get testers/balance game.

//future stuff: equipment, hero minions

function initialize_components(){
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
	
	addMinion('pete');
	minions[0].Location.x = path[path.length/2].x;
	minions[0].Location.y = path[path.length/2].y;
	addTower();
}

function update(){
	updatePnl1();
	
	manageMinions();
	manageTowers();
	managePath();
	manageProjectiles();
	manageImpacts();
	
	//Draw all the stuffs in the correct order.
	draw();
}

function updatePnl1(){
	document.getElementById("divResource").innerHTML = "R:" + Math.floor(resource*10)/10;
}

function draw(){
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	drawPath();
	drawMinions();
	drawTowers();
	drawProjectiles();
	drawImpacts();
	
	ctx.fillStyle='#FFF';
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	maxFPS = Math.max(fps, maxFPS);
	minFPS = Math.min(fps, minFPS);
	if(showFPS){ctx.fillText("FPS:"+Math.floor(fps)+" MAX:"+Math.floor(maxFPS)+" MIN:"+Math.floor(minFPS),10,10);}
	lastUpdate = now;
}

function resize(){
	return;
	//TODO: fix this
	//get canvas new size
	var newGameW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
	var newGameH = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30)/3;

	//get x,y ratios
	var dy = newGameH / gameH;
	var dx = newGameW / gameW;
	
	//adjust all path x,y by ratios
	for(var i=0;i<path.length;i++) {
		path[i].x *= dx;
		path[i].y *= dy;
	}
	
	//adjust all minion x,y by ratios
	for(var i=0;i<minions.length;i++) {
		minions[i].Location.x *= dx;
		minions[i].Location.y *= dy;
	}

	//adjust all tower x,y by ratios
	for(var i=0;i<towers.length;i++) {
		towers[i].Location.x *= dx;
		towers[i].Location.y *= dy;
	}

	//adjust all projectile x,y by ratios
	for(var i=0;i<projectiles.length;i++) {
		projectiles[i].Location.x *= dx;
		projectiles[i].Location.y *= dy;

		projectiles[i].target.x *= dx;
		projectiles[i].target.y *= dy;
		
		projectiles[i].Resize();
	}
		
	for(var i=0; i<impacts.length;i++){
		impacts[i].Locationl.x *= dx
		impacts[i].Locationl.y *= dy
	}
		
	//set canvas new size
	gameW = newGameW;
	gameH = newGameH;
	halfW = gameW>>1;
	halfH = gameH>>1;
	langoliers = -(gameW<<1);
	drawArea = document.getElementById('canvasArea');
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext('2d');
	pathL = (gameW>>6)*1;
	pathW = (gameH>>4)*1;


	//Resize other panels.	
	pnl1.style.minHeight = gameH;
	pnl1.style.width=gameW;
	pnl2.style.minHeight = gameH;
	pnl2.style.width=gameW;

}

initialize_components();
