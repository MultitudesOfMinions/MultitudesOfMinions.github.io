"use strict";

const pnl0 = document.getElementById("pnl0");
const pnl1 = document.getElementById("pnl1");
const reshowP1 = document.getElementById("btnReshowP1");
let ctx = document.getElementById("unitLayer").getContext("2d");
let mctx = document.getElementById("mapLayer").getContext("2d", {alpha: false});

function setMinionOrder(){
	minionOrder = unitArrayOrderByLocationX(minions) || [];
}
function setTeam0(){
	if(boss == null){
		team0 = [...underlings, ...minions] || [];
	}
	else{
		team0 = [...underlings, ...minions, boss] || [];
	}
}
function setTeam1(){
	team1 = [...towers];
	if(hero != null){
		team1.push(hero);
	}
	if(squire != null){
		team1.push(squire);
	}
	if(page != null){
		team1.push(page);
	}
	
}
function isTeam1(type){
	return baseTower[type] != undefined || baseHero[type] != undefined;
}
function isTeam0(type){
	return baseMinion[type] != undefined || baseBoss[type] != undefined;
}

function setLeadInvader(){
	if(team0.length==0){leadInvader = null;return;}
	leadInvader = team0.reduce((a,b) => (a.Location?.x > b.Location?.x) ? a : b);
}
const getLeaderDelta=(a,b)=>{
	const special = ["Ram", "Air", "Earth", "Water", "Underling"];
	const m = leaderPoint;
	const n = m*1.7;
	const x = b.Location?.x-(special.includes(b.type)?n:m);
	return a > x  ? a : x;
}
function followTheLeader(){
	if(leadInvader === null){return;}
	let delta = team0.reduce(getLeaderDelta,0);
	
	if(delta>0){
		if(Quality<2){delta=pathL;}
		levelEndX -= delta;
		levelStartX -= delta;
		path.forEach(a=>a.x-= delta);
		minions.forEach(a=>a.Recenter(delta));
		underlings.forEach(a=>a.Recenter(delta));
		towers.forEach(a=>a.Recenter(delta));
		projectiles.forEach(a=>a.Recenter(delta));
		impacts.forEach(a=>a.Recenter(delta));
		accents.forEach(a=>a.Recenter(delta));
		if(hero){ hero.Recenter(delta); }
		if(squire){ squire.Recenter(delta); }
		if(page){ page.Recenter(delta); }
		if(boss){ boss.Recenter(delta); }
		addTower();
		
		drawMap();
	}
}
function managePath(){
	
	//Remove past path points
	while(path[0].x < pathL*-3){
		path.splice(0,1);
		addPathPoint(false);
	}
}
function addPathPoint(isInit){
	while(path.length > 0 && path.length< 100){
		const lastPoint = path[path.length - 1];
		const skew = (halfH - lastPoint.y)/16;//Keep path towards center.
		
		const delta = getRandomInt((-gameH/32) + 1, (gameH/32)) + skew;
		const newX = lastPoint.x + pathL;
		const newY = lastPoint.y + delta;
		
		path.push(new point(newX, newY)); //Add a new point
		if(!isInit){
			totalPaths++;//measures paths created
			buildAccents();
		}
	}
}

function endZoneStartX(){
	return levelEndX - endZoneW();
}
function endZoneW(){
	return pathL*12;
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
	deleteSaveData();
	cookiesEnabled=0;
	window.location.reload(false);
}
function resetWorld(){
	level = +resetLevel;
 	totalPaths = PathsPerLevel*level;
 	path.length = 0;
	
	hero = null;
	squire = null;
	page = null;
	towers.length = 0;
	
	boss = null;
	underlings.length = 0;
	minions.length = 0;
	minionOrder.length = 0;
	addMinionQ.length = 0;
	deployList.length = 0;
	lastGlobalSpawn = 0;
	
	impacts.length = 0;
	projectiles.length = 0;
	
	stats.pushReset();
	ticksSinceReset=0;
	
	team0.length=0;
	team1.length=0;
	accents.length=0;
	
	buildWorld();
}

function resetT0(){//Armory
	moneyPitLevel = 0;
	resources.a.amt = 0;
	
	for(let minionType in minionUpgrades)
	{
		//reset health/dmg upgrades
		for(let i=0;i<minionUpgradeTypes[0].length;i++){
			minionUpgrades[minionType][minionUpgradeTypes[0][i]]=0;
		}
	}
	for(let type in minionResearch)
	{
		if(minionResearch[type].unlockT == 0){
			minionResearch[type].isUnlocked = 0;
			minionResearch[type].lastSpawn = 0;
		}
	}
	
	resetWorld();
}
function resetT1(){//Gym
	resources.b.amt = 0;
	maxMinions=0;
	tierMisc.t0.upgradePotency=1;
	
	for(let key in minionUpgrades)
	{
		//reset speed/rate upgrades
		for(let i=0;i<minionUpgradeTypes[1].length;i++){
			minionUpgrades[key][minionUpgradeTypes[1][i]]=0;
		}
	}
	
	for(let type in minionResearch)
	{
		if(minionResearch[type].unlockT == 1){
			minionResearch[type].isUnlocked = 0;
			minionResearch[type].lastSpawn = 0;
		}
	}
	
	resetWorld();
}
function resetT2(){//Lab
	resources.c.amt = 0;
	maxUpgradeLevel = defaultMaxUpgradeLevel;
	tierMisc.t1.upgradePotency=1;
	
	for(let key in minionUpgrades)
	{
		//reset range/radius upgrades
		for(let i=0;i<minionUpgradeTypes[2].length;i++){
			minionUpgrades[key][minionUpgradeTypes[2][i]]=0;
		}
	}
	
	
	for(let type in minionResearch)
	{
		if(minionResearch[type].unlockT == 2){
			minionResearch[type].isUnlocked = 0;
			minionResearch[type].lastSpawn = 0;
		}
	}
	
	resetWorld();
}
function resetT3(){//Office
	totalPaths = 0;
	level = 0;
	resources.d.amt = 0;
	globalSpawnDelayReduction = 0;
	tierMisc.t2.upgradePotency=1;
	
	//clear boss upgrades.
	for(let bossType in bossUpgrades)
	{
		for(let upgradeType in bossUpgrades[bossType])
		{
			bossUpgrades[bossType][upgradeType]=0;
		}
	}
	
	for(let bossType in bossResearch)
	{
		for(let upgradeType in bossResearch[bossType])
		{
			bossResearch[bossType].isUnlocked=0;
		}
	}
	
	for(let key in minionUpgrades)
	{
		//reset range/radius upgrades
		for(let i=0;i<minionUpgradeTypes[3].length;i++){
			minionUpgrades[key][minionUpgradeTypes[3][i]]=0;
		}
	}
	
	for(let type in minionResearch)
	{
		if(minionResearch[type].unlockT == 3){
			minionResearch[type].isUnlocked = 0;
			minionResearch[type].lastSpawn = 0;
		}
	}
	
	resetSelectedBoss();
	
	resetWorld();
}
function remain(){
	toggleUIElementByID("confirmModal", true);
	resetWorld();
	start();
}
function advance(){
	toggleUIElementByID("confirmModal", true);
	achievements.maxLevelCleared.count=0;
	achievements.maxLevelCleared.maxCount++;
	
	resetLevel=0;
	maxResetLevel=1;
	setElementTextById("startingLevelSelection", "0");
	const e = getUIElement("startingLevelSelector");
	e.value = 0;
	e.max = 1;
	
	resetWorld();
	start();
}

