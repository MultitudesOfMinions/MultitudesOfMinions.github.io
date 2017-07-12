var gameW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
var gameH = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30)/3;
var halfW = gameW>>1;
var halfH = gameH>>1;
var langoliers = -(gameW<<1);
var drawArea = document.getElementById('canvasArea');

drawArea.width = gameW;
drawArea.height = gameH;
var ctx = drawArea.getContext('2d');
var path = [];
var pathL = gameW>>6;
var pathW = gameH>>4;
var minions = [];
var minionOrder = [];
var towers = [];
var projectiles = [];
var mainCycle;
var totalD = 0;//Use for tower levels and prestige resource gain.
var lastUpdate = Date.now();//used in FPS calculation.
var maxFPS = 0; 
var minFPS = 100;

var showRange = 1;
var showNextShot = 1;
var showHP = 1;
var showFPS = 1;

//TODO: work out a resourceShift calculations.
var resource = 0; //normal resource
var pResource = 0; //prestige resource

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
	var RecenterDelta = 0;
	
	//Manage Minions
	if(minions.length == 0){
		minionOrder = [];
	}
	else{
		for(var i=0;i<minions.length;i++){ 
			minions[i].lastAttack++;
			var isAttacking = false;
			
			if(minions[i].hp <= 0){
				resource += minions[i].deathValue;
				minions.splice(i,1);
				for(var j=0;j<minionOrder;j++){
					if(minionOrder[j]>i){minionOrder[j]--;}
					if(minionOrder[j]==i){minionOrder.splice(j,1);}
				}
				i--;
				continue;
			}
			
			for(var j=0;j<towers.length;j++){
				//cheap check
				if(Math.abs(towers[j].Location.x - minions[i].Location.x) < minions[i].xRange())
				{
					//fancy check
					if(isInEllipse(towers[j].Location, minions[i].Location, minions[i].xRange(), minions[i].yRange())){
						minions[i].Attack(towers[j]);
						isAttacking=true;
					}
				}
			}
			if(!isAttacking){
				minions[i].Move(); 
			}
		}
		
		//Get minion Order
		minionOrder = [0];
		for(var i=1; i<minions.length;i++){
			var newX = minions[i].Location.x;
			for(var j=0; j<minionOrder.length; j++){
				if(newX > minions[minionOrder[j]].Location.x){
					minionOrder.splice(j,0,i);
					break;
				}
			}
			if(i==minionOrder.length){
				minionOrder[minionOrder.length]=i;
			}
		}
		
		//TODO: generate towers, frequency/level based on totalD/towers.length;
		if(towers.length <= totalD>>5){
			addTower(baseTowers.shooter);
		}
		
		//Add more path if needed.
		while(path.length > 0 && path[path.length - 1].x < gameW + 100){
			addPathPoint();
		}
		
		//Remove past path points
		while(path[0].x < langoliers){
			path.splice(0,1);
			totalD++;//measures how far we've come.
		}
		//Remove past minions
		for(var i=minionOrder.length-1; i>0;i--){
			if(minions[minionOrder[i]].Location.x < langoliers){
				minions.splice(minionOrder[i],1);
				
				//update order indexes above removed minion.
				for(var j=0; j <minionOrder.length;j++){ if(minionOrder[j] > minionOrder[i]){ minionOrder[j]--; } }
				minionOrder.splice(i,1);
			}
			else{
				break;
			}
		}

		//Recenter path on furthest minion beyond half
		minion = minions[minionOrder[0]];
		if(minion){
			var maxX = minion.Location.x;
			if(maxX > halfW){
				RecenterDelta = maxX - halfW;
				for(var i=0; i < path.length; i++){ path[i].x -= RecenterDelta; }
				for(var i=0; i < minions.length; i++){ minions[i].Location.x -= RecenterDelta; }
				for(var i=0; i < towers.length; i++){ towers[i].Location.x -= RecenterDelta; }
				for(var i=0; i < projectiles.length; i++){ projectiles[i].Location.x -= RecenterDelta; }
			}
		}
	}
	
	//Manage Towers
	if(towers.length > 0){
		for(var i=0; i< towers.length;i++){
			towers[i].lastAttack++;
			if(towers[i].hp <= 0){
				resource += towers[i].deathValue;
				towers.splice(i,1);
				i--;
				continue;
			}
			
			//Remove past towers
			if(towers[i].Location.x < langoliers){
				towers.splice(i,1);
				i--;
				continue;
			}
			
			for(var j=0; j<minionOrder.length;j++){
				var minion = minions[minionOrder[j]];
				//cheap check
				if(minion && Math.abs(towers[i].Location.x - minion.Location.x) < towers[i].xRange())
				{
					//fancy check
					if(isInEllipse(minion.Location, towers[i].Location, towers[i].xRange(), towers[i].yRange())){
						towers[i].Attack(minion);
						isAttacking=true;
					}
				}
			}
		}
	}
		
	//Spawn minions!
	for(var key in baseMinions)
	{
		if(baseMinions.hasOwnProperty(key) && minionUpgrades.hasOwnProperty(key)){
			if(baseMinions[key].isUnlocked){
				if(RecenterDelta == 0){
					baseMinions[key].lastSpawn++;
				}
				else{
					//increase lastSpawn by a % based on RecenterDelta, but never less than 0;
					baseMinions[key].lastSpawn+= Math.max(0, (baseMinions[key].moveSpeed-RecenterDelta)/baseMinions[key].moveSpeed);
				}

				if(minions.length < maxMinions && baseMinions[key].lastSpawn > baseMinions[key].spawnDelay){
					addMinion(baseMinions[key]);
					baseMinions[key].lastSpawn=0;
				}
			}
		}
	}
	
	//TODO: move projectiles
	

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

function addPathPoint(){
	var lastPoint = path[path.length - 1];
	var skew = (halfH - lastPoint.y) >> 4;//Keep path towards center.
	
	var delta = getRandomInt((-gameH>>5) + 1, (gameH>>5)) + skew;
	var newX = lastPoint.x + pathL;
	var newY = lastPoint.y + delta;
	
	path[path.length] = new point(newX, newY); //Add a new point
}

function addMinion(type){
	minions[minions.length] =  new MinionFactory(type);
}

function addTower(type){
	var newTowerY = 0;
	var newTowerX = path[path.length - 1].x; 
	
	if(towers.length % 2 == 0){//above path
		var r1 = getRandomInt(0, (path[path.length - 1].y>>1) - pathW);
		var r2 = getRandomInt(0, (path[path.length - 1].y>>1) - pathW);
		newTowerY = r1 + r2;
	}
	else{//below path
		var r1 = getRandomInt(0, (gameH - (path[path.length - 1].y)>>1) - pathW);
		var r2 = getRandomInt(0, (gameH - (path[path.length - 1].y)>>1) - pathW);
		newTowerY = path[path.length - 1].y + pathW + r1 + r2;
	}
	
	towers[towers.length] = new TowerFactory(type, 1, newTowerX, newTowerY);
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