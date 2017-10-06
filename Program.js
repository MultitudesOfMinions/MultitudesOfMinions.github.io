//TODO: plan out prestige function/visibility
//TODO: make minion upgrades and implement them in the minion stats or some such.
//TODO: apply affordable class to button when can buy.
//TODO: make High Quality elements
//TODO: save player stats in cookies.
//TOOD: load player stats from cookies.
//TODO: make minion list
//TODO: make notification saying site uses cookies.
//TODO: get testers/balance game.

//future stuff: equipment, boss minions, heroes
//TODO: resize window redraws everything in the correct places.


/* prestige upgrades
-maxMinions
-unlock swarmer
-unlock tanker
-minion specific spawn timer
-unlock draw functions: range, attack timer, hp, dmg, ...
-normal resource gain
*/

/* normal upgrades
-minion specific
	-damage
	-range
	-speed
	-chain
	-splash
*/

function initialize_components(){
	loadData();
	
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
	
	addMinion('grunt');
	minions[0].Location.x = path[Math.floor(path.length/2)].x;
	minions[0].Location.y = path[Math.floor(path.length/2)].y;
	addTower();
}

function loadData(){
	//load minion upgrades
	for(var key in baseMinions)
	{
		if(minionUpgrades.hasOwnProperty(key)){
			for(var prop in baseMinions[key]){
				if(minionUpgrades[key].hasOwnProperty(prop))
					{baseMinions[key][prop] = minionUpgrades[key][prop];}
				
			}
		}
	}
	
	//load gameUpgrades
	if(gameUpgrades.indicators.range){
		document.getElementById("buyShowRange").style.display='none';
		document.getElementById("divShowRange").style.display='block';
	}
	if(gameUpgrades.indicators.reload){
		document.getElementById("buyShowReload").style.display='none';
		document.getElementById("divShowReload").style.display='block';
	}
	if(gameUpgrades.indicators.hp){
		document.getElementById("buyShowHP").style.display='none';
		document.getElementById("divShowHP").style.display='block';
	}
	if(gameUpgrades.indicators.dmg){
		document.getElementById("buyShowDMG").style.display='none';
		document.getElementById("divShowDMG").style.display='block';
	}
	maxMinions = gameUpgrades.maxMinions;
	
}

function update(){
	updatePnl1();
	updatePnl2();
	
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
	
	if(document.getElementById("divMinionDashboard").style.display == 'block'){
		drawMinionDashboard();
	}
}

function drawMinionDashboard(){
	document.getElementById("lblMinionCounter").innerHTML = minions.length + "/" + maxMinions + "<br />";
	
	//TODO: find a better way to do this
	var timers = "";
	for(var key in baseMinions)
	{
		if(baseMinions[key].isUnlocked){
			var percent = baseMinions[key].lastSpawn / baseMinions[key].spawnDelay * 100;
			timers += key + " : " + Math.min(100, Math.floor(percent)) + "%<br/>"
		}
	}
	document.getElementById("divTimerList").innerHTML = "<div class='Block' style='width:125px;'>" + timers + "<\div>";
	
	//TODO: find a good way to show list of current minion stats??
	
}

function updatePnl2(){
	//put some stuff here!
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
	
	//TODO: fix this.
	
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