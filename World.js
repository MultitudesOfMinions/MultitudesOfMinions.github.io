var gameW = 1200;
var gameH = 600;
var halfH = 300;
var leaderPoint = 120;

var ctx = document.getElementById('canvasArea').getContext('2d');

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
var prestigeCounts = [0,0];
var heroKills = 0;
var minionsSpawned = 0;
var globalSpawnDelay = 100;

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
	addPathPoint();

	//Remove past path points
	while(path[0].x < langoliers){
		path.splice(0,1);
	}
}
function addPathPoint(){
	while(path.length > 0 && path.length< 100){
		var lastPoint = path[path.length - 1];
		var skew = (halfH - lastPoint.y) >> 4;//Keep path towards center.
		
		var delta = getRandomInt((-gameH>>5) + 1, (gameH>>5)) + skew;
		var newX = lastPoint.x + pathL;
		var newY = lastPoint.y + delta;
		
		path[path.length] = new point(newX, newY); //Add a new point
		totalPaths++;//measures how far we've come.
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

function draw(){
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	drawHeroAura();
	drawBossAura();
	drawPath();
	drawTowers();
	drawBoss();
	drawMinions();
	drawHero();
	drawProjectiles();
	drawImpacts();
	
	ctx.fillStyle='#FFF';
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	maxFPS = Math.max(fps, maxFPS);
	minFPS = Math.min(fps, minFPS);
	ctx.font = "10pt Helvetica"
	if(showFPS){ctx.fillText("FPS:{0} MAX:{1} MIN:{2}".format(Math.floor(fps), Math.floor(maxFPS), Math.floor(minFPS)),10,10);}
	lastUpdate = now;
}

//Check gauge/unit type bool[x,y] array.
function GetGaugesCheckedForUnitType(unitType){
	return gaugesCheckedBools[unitType];
}
function GetGaugeChecked(unitType, gaugeType){
	return gaugesCheckedBools[unitType][gaugeType];
}
function setGaugeCheckedFromElement(element){
	var unitType = element.getAttribute("unitType");
	var gaugeType = element.getAttribute("gaugeType");
	var isChecked = element.checked;
	SetGaugeChecked(unitType, gaugeType, isChecked);
}
function SetGaugeChecked(unitType, gaugeType, isChecked){
	gaugesCheckedBools[unitType][gaugeType] = isChecked;
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
	for(var key in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[0].length;i++){
			minionUpgrades[key][minionUpgradeTypes[0][i]]=0;
		}
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
}
