//TODO: make projectiles
//TODO: make a formula for minion/tower value.
//TODO: plan out prestige upgrades vs normal upgrades. (possibly similar/stacking with eachother)
//TODO: make minion upgrades and implement them in the minion stats or some such.
//TODO: save player stats in cookies.
//TOOD: load player stats from cookies.
//TODO: make notification saying site uses cookies.

//future stuff: equipment, hero minions

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
	
	//build special minion movement cos/sin tables based on the pathL.
	for(var i=(-gameH>>5)-10; i<(gameH>>5)+11;i++){
		minionMoveSin[minionMoveSin.length]=new point(i,-Math.sin(i/pathL));
		minionMoveCos[minionMoveCos.length]=new point(i,Math.cos(i/pathL));
	}
	
	//build 0-359deg sin/cos tables for projectile movement 
	for(var i=0; i<360;i++){
		sin[sin.length]=new point(i,-Math.sin(i/57.2957795131));
		cos[cos.length]=new point(i,Math.cos(i/57.2957795131));
	}

	addMinion(baseMinions.pete);
}

function update(){
	document.getElementById("divResource").innerHTML = "R:" + Math.floor(resource*10)/10;
	
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	manageMinions();
	manageTowers();
	spawnMinions();

	//TODO: move projectiles

	//Add more path if needed.
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		addPathPoint();
	}
	
	//Remove past path points
	while(path[0].x < langoliers){
		path.splice(0,1);
		totalD++;//measures how far we've come.
	}
	
	//Draw all the stuffs.
	drawPath();
	drawMinions();
	drawTowers();
	drawProjectiles();
	
	ctx.fillStyle='#FFF';
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	maxFPS = Math.max(fps, maxFPS);
	minFPS = Math.min(fps, minFPS);
	if(showFPS){ctx.fillText("FPS:"+Math.floor(fps)+" MAX:"+Math.floor(maxFPS)+" MIN:"+Math.floor(minFPS),10,10);}
	lastUpdate = now;
}


init();