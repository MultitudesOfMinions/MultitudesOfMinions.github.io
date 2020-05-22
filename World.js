var gameW = 1200;
var gameH = 600;
var halfH = 300;
var leaderPoint = 120;

var ctx = document.getElementById('canvasArea').getContext('2d');
var defaultInterval = 50;
var path = [];
var pathL = (gameW>>6)*1;
var pathW = (gameH>>4)*1;
var langoliers = pathL*-2;
var projectiles = [];
var impacts = [];
var mainCycle;
var totalPaths = 0;//Use for tower levels and reqroup resource gain.
var lastUpdate = Date.now();//used in FPS calculation.
var maxFPS = 0; 
var minFPS = 100;
var RecenterDelta = 0;
var maxMinions = 0;
var lastSave = 0;
var cookiesEnabled = 0;
var prestigeCounts = [0,0];
var heroKills = 0;
var minionsSpawned = 0;
var Quality = 2;

var minions = [];
var minionOrder = [];
var towers = [];
var hero = null;
var boss = null;

var team0 = [];
var team0Order = [];
var team1 = [];
var team1Order = [];

function setMinionOrder(){
	minionOrder = unitArrayOrderByLocationX(minions) || [];
}
function setTeam0(){
	if(boss == null){
		team0 = [...minions] || [];
	}
	else{
		team0 = [...minions, boss] || [];
	}
}
function setTeam0Order(){
	setTeam0();
	team0Order = unitArrayOrderByLocationX(team0) || [];
}
function setTeam1(){
	if(hero == null){
		team1 = [...towers] || [];
	}else{
		team1 = [...towers, hero] || [];
	}
}
function setTeam1Order(){
	setTeam1();
	team1Order = unitArrayOrderByLocationX(team1) || [];
}

function followTheLeader(){
	RecenterDelta = 0;

	leader = team0[team0Order[0]];
	if(leader){
		var maxX = leader.Location.x;
		if(maxX > leaderPoint){
			RecenterDelta = maxX - leaderPoint;
			for(var i=0; i < path.length; i++){ path[i].x -= RecenterDelta; }
			for(var i=0; i < minions.length; i++){ minions[i].Location.x -= RecenterDelta; }
			for(var i=0; i < towers.length; i++){ towers[i].Location.x -= RecenterDelta; }
			for(var i=0; i < projectiles.length; i++){ projectiles[i].Location.x -= RecenterDelta; projectiles[i].target.x -= RecenterDelta; }
			for(var i=0; i < impacts.length; i++){ impacts[i].Location.x -= RecenterDelta; }
			if(hero){ hero.Location.x -= RecenterDelta; hero.home.x -= RecenterDelta; }
			if(boss){ boss.Location.x -= RecenterDelta; }
			addTower(totalPaths);
		}
	}
}
function managePath(){
	//Add more path if needed.
	addPathPoint(false);

	//Remove past path points
	while(path[0].x < langoliers){
		path.splice(0,1);
	}
}
function addPathPoint(isInit){
	while(path.length > 0 && path.length< 100){
		var lastPoint = path[path.length - 1];
		var skew = (halfH - lastPoint.y) >> 4;//Keep path towards center.
		
		var delta = getRandomInt((-gameH>>5) + 1, (gameH>>5)) + skew;
		var newX = lastPoint.x + pathL;
		var newY = lastPoint.y + delta;
		
		path[path.length] = new point(newX, newY); //Add a new point
		if(!isInit){
			totalPaths++;//measures how far we've come.
		}
	}
}
function drawPath(){
	if(Quality>=2){
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
	ctx.closePath();
	
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#AAA';
	ctx.fillStyle = '#A52';
	for(var i=1;i<path.length;i++){
		ctx.fillRect(path[i].x-1, path[i].y-1, 2, 2);
	}
	ctx.closePath();
}

function levelEndX(){
	if(hero == null){return gameW;}
	return hero.home.x + (pathL*4);
}
function endZoneStartX(){
	return levelEndX() - endZoneW();
}
function endZoneW(){
	return pathL*8;
}
function drawLevelEnd(){
	if(hero == null){return;}
	var x1 = endZoneStartX();
	var x2 = levelEndX();
	var level = getLevel();
	
	var width = pathW;

	ctx.lineWidth = width;

	ctx.beginPath();
	ctx.strokeStyle = "#444";
	ctx.moveTo(x1, 0);
	ctx.lineTo(x1, gameH);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality>=2){
		var brickWidth = width / 4;
		var brickHeight = brickWidth * 1.625;
		var wallX = x1 - brickWidth * 3;
		var brickY = 0;
		ctx.beginPath();
		ctx.fillStyle = "#222";
		while(brickY < gameH){
			ctx.fillRect(wallX, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*2, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*4, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX-brickWidth, brickY-brickHeight/4, brickWidth, brickHeight*1.5);
			brickY += brickHeight;
			ctx.fillRect(wallX+brickWidth, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*3, brickY, brickWidth, brickHeight);
			brickY += brickHeight;
		}
	}


	ctx.beginPath();
	ctx.strokeStyle = '#999';
	ctx.moveTo(x2, 0);
	ctx.lineTo(x2, gameH);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality>=2){
		var brickWidth = width / 4;
		var brickHeight = brickWidth * 1.625;
		var wallX = x2 - brickWidth * 3;
		var brickY = 0;
		ctx.beginPath();
		ctx.fillStyle = "#444";
		while(brickY < gameH){
			ctx.fillRect(wallX, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*2, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*4, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX-brickWidth, brickY-brickHeight/4, brickWidth, brickHeight*1.5);
			brickY += brickHeight;
			ctx.fillRect(wallX+brickWidth, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*3, brickY, brickWidth, brickHeight);
			brickY += brickHeight;
		}
	}

	
	var lvlX = x2 - width;
	ctx.beginPath();
	ctx.fillStyle = "#999";
	ctx.font = "bold 12pt Arial"
	var size = ctx.measureText("L"+level);
	ctx.fillRect(lvlX-size.width, 0, size.width, 16);

	ctx.fillStyle= "#000";
	ctx.fillText("L"+level, lvlX-size.width,14);
	ctx.closePath();

}

function draw(){
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	if(Quality == 0){return;}
	
	
	drawPath();
	drawLevelEnd();
	
	drawTowers();
	drawBoss();
	drawMinions();
	drawHero();

	ctx.globalAlpha = .2;
	drawHeroAura();
	drawBossAura();
	ctx.globalAlpha = 1;


	drawProjectiles();
	drawImpacts();
	
	ctx.fillStyle='#FFF';
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	maxFPS = Math.max(fps, maxFPS);
	minFPS = Math.min(fps, minFPS);
	ctx.font = "10pt Helvetica"
	if(showFPS()){ctx.fillText("FPS:{0} MAX:{1} MIN:{2}".format(Math.floor(fps), Math.floor(maxFPS), Math.floor(minFPS)),10,10);}
	lastUpdate = now;
}

function GetGaugesCheckedForUnitType(unitType){
	return {
		Damage:document.getElementById("chkDamage"+unitType).checked,
		Health:document.getElementById("chkHealth"+unitType).checked,
		Range:document.getElementById("chkRange"+unitType).checked,
		Reload:document.getElementById("chkReload"+unitType).checked
	};
}
function GetGaugeChecked(unitType, gaugeType){
	return document.getElementById("chk"+gaugeType+unitType).checked
}

function isDeathAbilityActive(){
	return boss != null && boss.type == "Death" && boss.remainingDuration > 0;
}

function hardReset(){
	resetT0();
	resetT1();
	resetT2();
	
	saveData();
	buildWorld();
}

function resetT0(){
	resources.a.amt = 0;
	addMinionQ = [];
	lastGlobalSpawn = 0;
	totalPaths = 0;
	impacts = [];
	projectiles = [];
	
	for(var minionType in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[0].length;i++){
			minionUpgrades[minionType][minionUpgradeTypes[0][i]]=0;
		}
	}
	for(var minionType in minionResearch)
	{
		//reset health/dmg upgrades
		minionResearch[minionType].lastSpawn=0;
	}
	
	hero = null;
}
function resetT1(){
	resources.b.amt = 0;
	maxMinions=0;
	prestigeCounts[0]=0;
	minionUpgradePotency[0]=0;

	for(var key in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[1].length;i++){
			minionUpgrades[key][minionUpgradeTypes[1][i]]=0;
		}
	}
	
	for(var type in minionResearch)
	{
		for(var key in minionResearch[type]){
			minionResearch[type][key]=0;
		}
	}
		
	for(var type in gauges){
		gauges[type].isUnlocked=0;
	}
	gaugesCheckedBools = {};
	setupGauges();
	
	minionResearch.Mite.isUnlocked=1;//is always unlocked, even if someone hacks their save.
}
function resetT2(){
	resources.c.amt = 0;
	prestigeCounts[1]=0;
	minionUpgradePotency[1]=0;
	
	for(var key in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[2].length;i++){
			minionUpgrades[key][minionUpgradeTypes[2][i]]=0;
		}
	}

	//clear boss upgrades.
	for(var bossType in bossUpgrades)
	{
		for(var upgradeType in bossUpgrades[bossType])
		{
			bossUpgrades[bossType][upgradeType]=0;
		}
	}
}
