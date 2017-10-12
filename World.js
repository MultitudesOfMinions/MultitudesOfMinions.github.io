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
var pathL = (gameW>>6)*1;
var pathW = (gameH>>4)*1;
var minions = [];
var minionOrder = [];
var minionCards = []; //used to check what has changed for updating UI.
var towers = [];
var projectiles = [];
var impacts = [];
var mainCycle;
var totalD = 0;//Use for tower levels and prestige resource gain.
var lastUpdate = Date.now();//used in FPS calculation.
var maxFPS = 0; 
var minFPS = 100;
var RecenterDelta = 0;
var maxMinions = 1;
var lastSave = 0;

var resources = { scrap:0, refined:0 };
resources['refined']=0;


function manageMinions(){
	if(minions.length == 0){
		minionOrder = [];
	}
	else{
		//Get minion Order/remove stragglers
		getMinionOrder();
		
		for(var i=0;i<minions.length;i++){
			if(!minionAttack(i)){
				minions[i].Move(); 
			}
		}
		
		followTheLeader();
	}
	
	spawnMinions();
}

function spawnMinions(){
	if(minions.length >= maxMinions){return;}
	for(var key in baseMinions)
	{
		if(baseMinions.hasOwnProperty(key) && minionUpgrades.hasOwnProperty(key)){
			if(baseMinions[key].isUnlocked){
				if(RecenterDelta == 0){
					baseMinions[key].lastSpawn++;
				}
				else{
					//increase lastSpawn by a % based on RecenterDelta, but never less than 0.01;
					baseMinions[key].lastSpawn+= Math.max(0.01, (baseMinions[key].moveSpeed-RecenterDelta)/baseMinions[key].moveSpeed);
				}

				if(minions.length < maxMinions && baseMinions[key].lastSpawn > getSpawnDelay(key)){
					addMinion(key);
					baseMinions[key].lastSpawn=0;
				}
			}
		}
	}
}

function addMinion(type){
	minions[minions.length] =  new MinionFactory(type);
}

function minionAttack(i){//return bool (isInRange)
	minions[i].lastAttack++;
	for(var j=0;j<towers.length;j++){
		//cheap check
		if(Math.abs(towers[j].Location.x - minions[i].Location.x) < minions[i].xRange())
		{
			//fancy check
			if(isInEllipse(towers[j].Location, minions[i].Location, minions[i].xRange(), minions[i].yRange())){
				minions[i].Attack(towers[j]);
				return true;
			}
		}
	}
	return false;
}

function getMinionOrder(){
	minionOrder = [];
	for(var i=0; i<minions.length;i++){
		var newX = minions[i].Location.x;
		if(newX < langoliers || minions[i].hp <=0){
			if(minions[i].hp <= 0){ resources['scrap']+= minions[i].deathValue; }
			minions.splice(i,1);
			i--;
			continue;
		}
		
		if(minionOrder.length == 0){
			minionOrder = [0];
		}
		else{
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
	}
}

function followTheLeader(){
	RecenterDelta = 0;
	minion = minions[minionOrder[0]];
	if(minion){
		var maxX = minion.Location.x;
		if(maxX > halfW){
			RecenterDelta = maxX - halfW;
			for(var i=0; i < path.length; i++){ path[i].x -= RecenterDelta; }
			for(var i=0; i < minions.length; i++){ minions[i].Location.x -= RecenterDelta; }
			for(var i=0; i < towers.length; i++){ towers[i].Location.x -= RecenterDelta; }
			for(var i=0; i < projectiles.length; i++){ projectiles[i].Location.x -= RecenterDelta; projectiles[i].target.x -= RecenterDelta; }
			for(var i=0; i < impacts.length; i++){ impacts[i].Location.x -= RecenterDelta; }
		}
	}
}

function drawMinions(){ 
	for(var i=0;i<minions.length;i++){ 
		minions[i].Draw(); 
	}
}

function manageTowers(){
	addTower();
	
	if(towers.length > 0){
		for(var i=0; i< towers.length;i++){
			if(towers[i].Location.x < langoliers || towers[i].hp <= 0){
				if(towers[i].hp <= 0){ resources['scrap'] += towers[i].deathValue; }
				towers.splice(i,1);
				i--;
				continue;
			}

			towerAttack(i);
		}
	}
}
function towerAttack(i){
	towers[i].lastAttack++;
	if(towers[i].lastAttack < towers[i].attackRate){return;}
	for(var j=0; j<minionOrder.length;j++){
		var minion = minions[minionOrder[j]];
		
		//cheap check
		if(minion && Math.abs(towers[i].Location.x - minion.Location.x) < towers[i].xRange())
		{

			if(minion.isFlying && !towers[i].canHitAir){continue;}
			if(!minion.isFlying && !towers[i].canHitGround){continue;}

			//fancy check
			if(isInEllipse(minion.Location, towers[i].Location, towers[i].xRange(), towers[i].yRange())){
				towers[i].Attack(minion);
				isAttacking=true;
			}
		}
	}
}
function addTower(){
	var x = totalD / 64;
	var level = Math.floor(x);
	var towerSpacing = (1 - (x - level)) * pathL * 20;
	
	var deltaX = towerSpacing + 1;//if no towers auto-spawn one.
	if(towers.length > 0 && path.length > 0){ 
		deltaX = path[path.length -1].x - towers[towers.length - 1].Location.x; 
	}
	if(deltaX < towerSpacing){ return; }
	
	var index = getRandomInt(0, Object.keys(baseTowers).length);
	var type = Object.keys(baseTowers)[index];
	
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
	
	towers[towers.length] = new TowerFactory(type, level, newTowerX, newTowerY);
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
function manageProjectiles(){
	for(var i=0;i<projectiles.length;i++){ 
		if(projectiles[i].attackCharges < 0){//remove spent projectiles
			projectiles.splice(i,1);
			i--;
			continue;
		}
		projectiles[i].Move();
	}
}


function drawImpacts(){
	for(var i=0;i<impacts.length;i++){ 
		impacts[i].Draw(); 
	}

}
function manageImpacts(){
	for(var i=0;i<impacts.length;i++){ 
		if(impacts[i].lifeSpan < 0){//remove spent impacts
			impacts.splice(i,1);
			i--;
			continue;
		}
	}

}


function managePath(){
	//Add more path if needed.
	addPathPoint();

	//Remove past path points
	while(path[0].x < langoliers){
		path.splice(0,1);
	}
}

function addPathPoint(){
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		var lastPoint = path[path.length - 1];
		var skew = (halfH - lastPoint.y) >> 4;//Keep path towards center.
		
		var delta = getRandomInt((-gameH>>5) + 1, (gameH>>5)) + skew;
		var newX = lastPoint.x + pathL;
		var newY = lastPoint.y + delta;
		
		path[path.length] = new point(newX, newY); //Add a new point
		totalD++;//measures how far we've come.
	}
}

function drawPath(){
	if(HQ){
		var r = pathW * .7;
		for(var i=1;i<path.length;i++){
			ctx.beginPath();
			//ctx.arc(path[i].x, path[i].y, r, 0, 7);
			ctx.ellipse(path[i].x, path[i].y, pathW, r, 0, 0, Math.PI*2)
			ctx.fillStyle='#999';
			ctx.fill();
		}
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

