var gameW = 1200;
var gameH = 600;
var halfH = 300;
var leaderPoint = 120;

var ctx = document.getElementById("canvasArea").getContext("2d");
var defaultInterval = 45;
var path = [];
var pathL = (gameW>>6);
var pathW = (gameH>>4);
var langoliers = pathL*-2;
var projectiles = [];
var impacts = [];
var mainCycle;
var totalPaths = 0;//Use for levels
var maxFPS = 0; 
var minFPS = 100;
var RecenterDelta = 0;
var maxMinions = 0;
var lastSave = 0;
var cookiesEnabled = 0;
var Quality = 2;
var hilites = [];
var skippedFrames = 0;

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
			for(var i=0; i < path.length; i++){ path[i].x -= RecenterDelta}
			for(var i=0; i < minions.length; i++){ minions[i].Recenter(RecenterDelta); }
			for(var i=0; i < towers.length; i++){ towers[i].Recenter(RecenterDelta); }
			for(var i=0; i < projectiles.length; i++){ projectiles[i].Recenter(RecenterDelta); }
			for(var i=0; i < impacts.length; i++){ impacts[i].Recenter(RecenterDelta); }
			if(hero){ hero.Recenter(RecenterDelta); }
			if(boss){ boss.Recenter(RecenterDelta); }
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
			totalPaths++;//measures paths created
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
			ctx.fillStyle="#999";
			ctx.fill();
		}
	}
	
	ctx.beginPath();
	ctx.lineWidth = pathW;
	ctx.strokeStyle = "#FFF";
	ctx.moveTo(path[0].x, path[0].y);
	for(var i=1;i<path.length;i++){
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#AAA";
	ctx.fillStyle = "#A52";
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
	var y1 = pathW*1.5;
	var y2 = gameH - y1;
	var level = getLevel();
	
	var width = pathW*2;

	ctx.lineWidth = width;

	drawVWall(width, x1, y1, y2, "#555", "#333");
	drawHWall(width, y1, x1, x2, "#777", "#555");
	drawHWall(width, y2, x1, x2, "#777", "#555");
	drawVWall(width, x2, y1, y2, "#999", "#777");
	
	var gateY = getPathYatX(x1+width);
	drawGate(width*2, x1-width, gateY, "#555", "#333");

	drawParapet(x1,y1,width,"#666","#444");
	drawParapet(x1,y2,width,"#666","#444");
	drawParapet(x2,y1,width,"#888","#666");
	drawParapet(x2,y2,width,"#888","#666");
	
	var flagColor = hero == null ? "#777": hero.color;
	drawLevelFlag(x1+width/2-1,y2-width,level, flagColor, "#000");
	if(Quality<2){return;}
	drawLevelFlag(x1+width/2-1,y1-width,level, flagColor, "#000");
	drawLevelFlag(x2+width/2-1,y1-width,level, flagColor, "#000");
	drawLevelFlag(x2+width/2-1,y2-width,level, flagColor, "#000");


}
function drawVWall(width, x, y1, y2, color1, color2){
	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x, y1);
	ctx.lineTo(x, y2);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality<2){return;}
	
	var brickWidth = width / 8;
	var brickHeight = brickWidth * 1.625;
	var wallX = x - brickWidth * 5;
	var brickY = y1;
	ctx.beginPath();
	ctx.fillStyle = color2;
	while(brickY < y2){
		ctx.fillRect(wallX+brickWidth*0, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*2, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*4, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*6, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*8, brickY, brickWidth, brickHeight);

		ctx.fillRect(wallX-brickWidth+1, brickY-brickHeight/4, brickWidth, brickHeight*1.5);

		brickY += brickHeight;
		if(brickY > y2){ break;}

		ctx.fillRect(wallX+brickWidth*1, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*3, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*5, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*7, brickY, brickWidth, brickHeight);
		brickY += brickHeight;
	}
}
function drawHWall(width, y, x1, x2, color1, color2){
	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x1, y);
	ctx.lineTo(x2, y);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality<2){return;}
	
	var brickHeight = width / 8;
	var brickWidth = brickHeight * 1.625;
	var wallY = y + brickHeight * 3;
	var brickX = x1;
	ctx.beginPath();
	ctx.fillStyle = "#222";
	while(brickX < x2){
		ctx.fillRect(brickX, wallY-brickHeight*0, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*2, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*4, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*6, brickWidth, brickHeight);

		brickX += brickWidth;
		if(brickX > x2){ break;}
		ctx.fillRect(brickX, wallY-brickHeight*1, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*3, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*5, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*7, brickWidth, brickHeight);
		brickX += brickWidth;
	}
}
function drawParapet(x, y, r, color1, color2){
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.arc(x,y,r,0,twoPi);
	ctx.fill();
	
	if(Quality<2){return;}

	var width = r/8;
	ctx.lineWidth = width;
	ctx.strokeStyle = color2;
	ctx.moveTo(x+width,y);
	ctx.arc(x,y,width*1,0,twoPi);
	ctx.moveTo(x+width*3,y);
	ctx.arc(x,y,width*3,0,twoPi);
	ctx.moveTo(x+width*5,y);
	ctx.arc(x,y,width*5,0,twoPi);
	ctx.moveTo(x+width*7,y);
	ctx.arc(x,y,width*7,0,twoPi);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x,y+r);
	ctx.lineTo(x,y-r);
	ctx.moveTo(x+r,y);
	ctx.lineTo(x-r,y);
	ctx.stroke();
	
	var r1 = r * 3 / 4;
	var r2 = r1 / 2;
	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x+r1,y+r1);
	ctx.lineTo(x+r2,y+r2);
	
	ctx.moveTo(x+r1,y-r1);
	ctx.lineTo(x+r2,y-r2);

	ctx.moveTo(x-r1,y+r1);
	ctx.lineTo(x-r2,y+r2);

	ctx.moveTo(x-r1,y-r1);
	ctx.lineTo(x-r2,y-r2);
	ctx.stroke();
	
	
}
function drawGate(width, x, y, color1, color2){
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.fillRect(x,y-width/2,width,width);
	
	if(Quality>=2){
		
		var brickWidth = width / 8;
		var brickHeight = brickWidth * 1.625;
		var wallX = x - brickWidth;
		var y1 = y-width/2
		var y2 = y1 + width;

		var brickY = y1;
		ctx.beginPath();
		ctx.fillStyle = color2;
		while(brickY < y2){
			ctx.fillRect(wallX+brickWidth*0, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*2, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*4, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*6, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*8, brickY, brickWidth, brickHeight);

			ctx.fillRect(wallX-brickWidth+1, brickY-brickHeight/4, brickWidth, brickHeight*1.5);

			brickY += brickHeight;
			if(brickY > y2){ break;}
			ctx.fillRect(wallX+brickWidth*1, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*3, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*5, brickY, brickWidth, brickHeight);
			ctx.fillRect(wallX+brickWidth*7, brickY, brickWidth, brickHeight);
			brickY += brickHeight;
		}
	}
	
	ctx.beginPath();
	ctx.fillStyle = "#000";
	var doorW = width*.5;
	ctx.fillRect(x+width-doorW,y-doorW/2,doorW,doorW);
	ctx.arc(x+width-doorW+1,y,doorW/2,halfPi,-halfPi);
	ctx.fill();
	
}
function drawLevelFlag(x,y,level,color1,color2){
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.font = "bold 12pt Arial"
	var height = 16;
	var size = ctx.measureText("L"+level);
	ctx.fillRect(x-size.width/2, y-height/2, size.width, height);

	var pennonX = x-size.width/2;
	var pennonY = y-10;
	var pennonL = size.width*1.5;
	var pennonH = height * 1.25;
	ctx.beginPath();
	ctx.fillStyle = color1
	ctx.moveTo(pennonX,pennonY);
	ctx.lineTo(pennonX+pennonL,pennonY+pennonH/4)
	ctx.lineTo(pennonX,pennonY+pennonH/2)
	ctx.lineTo(pennonX+pennonL,pennonY+pennonH*3/4)
	ctx.lineTo(pennonX,pennonY+pennonH)
	ctx.fill();
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000";
	ctx.moveTo(x-size.width/2-2, y-(height*3/4));
	ctx.lineTo(x-size.width/2-2, y+height*1.75);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle= color2;
	ctx.fillText("L"+level, x-size.width/2, y+height/2-1);
	ctx.closePath();
}

function draw(){
	//Refresh black background
	ctx.fillStyle="#000";
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
	ctx.globalAlpha = .5;
	drawImpacts();
	ctx.globalAlpha = 1;
	
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
	resetT3();
	
	saveData();
	buildWorld();
}

function resetT0(){//Armory
	resources.a.amt = 0;
	achievements.minionsSpawned.count = 0;
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
	boss = null;
}
function resetT1(){//Gym
	resources.b.amt = 0;
	achievements.prestige0.count=0;
	achievements.towersDestroyed.count = 0;
	maxMinions=0;
	tierMisc.t0.upgradePotency=0;
	tierMisc.t0.autobuy.isUnlocked=0;
	
	for(var key in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[1].length;i++){
			minionUpgrades[key][minionUpgradeTypes[1][i]]=0;
		}
	}
	
	for(var type in minionResearch)
	{
		if(minionResearch[type].unlockT == 1){
			minionResearch[type].isUnlocked = 0;
			minionResearch[type].lastSpawn = 0;
		}
	}
		
	for(var type in gauges){
		gauges[type].isUnlocked=0;
	}
	resetGauges();
	resetMinionSpawns();
	resetAutobuy(0);
	
	minionResearch.Mite.isUnlocked=1;//is always unlocked
}
function resetT2(){//Lab
	resources.c.amt = 0;
	achievements.prestige1.count=0;
	achievements.heroesKilled.count = 0;
	globalSpawnDelayReduction = 0;
	maxUpgradeLevel = 10;
	tierMisc.t1.upgradePotency=0;
	tierMisc.t1.autobuy.isUnlocked=0;

	for(var key in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[2].length;i++){
			minionUpgrades[key][minionUpgradeTypes[2][i]]=0;
		}
	}
	
		
	for(var type in minionResearch)
	{
		if(minionResearch[type].unlockT == 2){
			minionResearch[type].isUnlocked = 0;
			minionResearch[type].lastSpawn = 0;
		}
	}
	resetMinionSpawns();
	resetAutobuy(1);
}
function resetT3(){//Office
	resources.d.amt = 0;
	achievements.prestige2.count=0;
	achievements.itemScrapped.count=0;
	tierMisc.t1.upgradePotency=0;
	tierMisc.t2.autobuy.isUnlocked=0;

	//clear boss upgrades.
	for(var bossType in bossUpgrades)
	{
		for(var upgradeType in bossUpgrades[bossType])
		{
			bossUpgrades[bossType][upgradeType]=0;
		}
	}
	
	for(var bossType in bossResearch)
	{
		for(var upgradeType in bossResearch[bossType])
		{
			bossResearch[bossType].isUnlocked=0;
		}
	}
	
	resetSelectedBoss();
	resetAutobuy(2);
}

