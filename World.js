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
var totalD = 0;
var showRange = 1;
var lastUpdate = Date.now();

//TODO: make minion upgrades
//TODO: save player stats in cookies.
//TOOD: load player stats from cookies.
//TODO: make notification saying site uses cookies.
//TODO: make projectiles

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
}

function update(){
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	if(minions.length == 0){
		minionOrder = [];
		var NOW = (new Date()).getTime();
		if(NOW - MinionStats.pete.lastSpawn > MinionStats.pete.spawnDelay){
			addMinion(baseMinions.pete);
			MinionStats.pete.lastSpawn = NOW;
		}
	}
	else{
		for(var i=0;i<minions.length;i++){ 
			var isAttacking = false;
			
			if(minions[i].hp <= 0){
				minions.splice(i,1);
				for(var j=0;j<minionOrder;j++){
					if(minionOrder[j]>i){minionOrder[j]--;}
					if(minionOrder[j]==i){minionOrder.splice(j,1);}
				}
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
		//TODO: randomize X a bit so the towers aren't in columns
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
		
		//towers attack
		for(var i=0; i< towers.length;i++){
			for(var j=0; j<minionOrder.length;j++){
				var minion = minions[minionOrder[j]];
				//cheap check
				if(Math.abs(towers[i].Location.x - minion.Location.x) < towers[i].xRange())
				{
					//fancy check
					if(isInEllipse(minion.Location, towers[i].Location, towers[i].xRange(), towers[i].yRange())){
						towers[i].Attack(minion);
						isAttacking=true;
					}
				}
			}
			
			if(towers[i].hp <= 0){
				towers.splice(i,1);
				continue;
			}
			
			//Remove past towers
			if(towers[i].Location.x < langoliers){
				towers.splice(i,1);
			}
		}
		
		//Recenter path on furthest minion beyond half
		var maxX = minions[minionOrder[0]].Location.x;
		if(maxX > halfW){
			var deltaX = maxX - halfW;
			for(var i=0; i < path.length; i++){ path[i].x -= deltaX; }
			for(var i=0; i < minions.length; i++){ minions[i].Location.x -= deltaX; }
			for(var i=0; i < towers.length; i++){ towers[i].Location.x -= deltaX; }
			for(var i=0; i < projectiles.length; i++){ projectiles[i].Location.x -= deltaX; }
		}
		else{
			//Spawn minions!
			for(var i=0;i<Object.keys(baseMinions).length;i++)
			{
				var NOW = (new Date()).getTime();
				if(minions.length < maxMinions){
					if(NOW - MinionStats.pete.lastSpawn > MinionStats.pete.spawnDelay){
						addMinion(baseMinions.pete);
						MinionStats.pete.lastSpawn = NOW;
					}
					if(NOW - MinionStats.swarmer.lastSpawn > MinionStats.swarmer.spawnDelay){
						addMinion(baseMinions.swarmer);
						MinionStats.swarmer.lastSpawn = NOW;
					}
					if(NOW - MinionStats.tanker.lastSpawn > MinionStats.tanker.spawnDelay){
						addMinion(baseMinions.tanker);
						MinionStats.tanker.lastSpawn = NOW;
					}
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
	
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	ctx.fillText(fps, 10, 10);
	ctx.fillText(minions.length, 10, 30);
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
update();