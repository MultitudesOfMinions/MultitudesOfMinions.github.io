"use strict";

const pnl0 = document.getElementById("pnl0");
const pnl1 = document.getElementById("pnl1");
const reshowP1 = document.getElementById("btnReshowP1");
let ctx = document.getElementById("canvasArea").getContext("2d");

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
function setTeam0Order(){
	setTeam0();
	team0Order = unitArrayOrderByLocationX(team0) || [];
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
function setTeam1Order(){
	setTeam1();
	team1Order = unitArrayOrderByLocationX(team1) || [];
}
function isTeam1(type){
  return baseTower[type] != undefined || baseHero[type] != undefined;
}
function isTeam0(type){
  return baseMinion[type] != undefined || baseBoss[type] != undefined;
}

function getLeaderDelta(){
  let delta = 0;
  for(let i=0;i<team0.length;i++){
    const lm = Math.max(1, minionResearch[team0[i].type]?.unlockT||1);
    const d = team0[i].Location.x-(leaderPoint*lm);
    delta = Math.max(delta, d);
  }
  return delta;
}
function followTheLeader(){
	RecenterDelta = 0;

  const delta=getLeaderDelta();
	if(delta>0){
    RecenterDelta=delta;
		levelEndX -= RecenterDelta;
		levelStartX -= RecenterDelta;
		for(let i=0; i < path.length; i++){ path[i].x -= RecenterDelta}
		for(let i=0; i < minions.length; i++){ minions[i].Recenter(RecenterDelta); }
		for(let i=0; i < underlings.length; i++){ underlings[i].Recenter(RecenterDelta); }
		for(let i=0; i < towers.length; i++){ towers[i].Recenter(RecenterDelta); }
		for(let i=0; i < projectiles.length; i++){ projectiles[i].Recenter(RecenterDelta); }
		for(let i=0; i < impacts.length; i++){ impacts[i].Recenter(RecenterDelta); }
		if(hero){ hero.Recenter(RecenterDelta); }
		if(squire){ squire.Recenter(RecenterDelta); }
		if(page){ page.Recenter(RecenterDelta); }
		if(boss){ boss.Recenter(RecenterDelta); }
		addTower();
	}
}
function managePath(){

	//Remove past path points
	while(path[0].x < langoliers){
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
	hero = null;
	squire = null;
	page = null;
	boss = null;
	addMinionQ.length = 0;
	lastGlobalSpawn = 0;
	impacts.length = 0;
	projectiles.length = 0;
	towers.length = 0;
}

function resetT0(){//Armory
  moneyPitLevel = 0;
	resources.a.amt = 0;
	//achievements.minionsSpawned.count = 0;
	
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
	tierMisc.t0.upgradePotency=0;
	//achievements.prestige0.count=0;
	//achievements.towersDestroyed.count = 0;
	//tierMisc.t0.autobuy.isUnlocked=0;
	
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
		
	for(let type in gauges){
		//gauges[type].isUnlocked=0;
	}
	//resetGauges();
	resetMinionSpawns();
	//resetAutobuy(0);
	
	resetWorld();
}
function resetT2(){//Lab
	resources.c.amt = 0;
	maxUpgradeLevel = defaultMaxUpgradeLevel;
	tierMisc.t1.upgradePotency=0;
	//achievements.prestige1.count=0;
	//achievements.heroesKilled.count = 0;
	//tierMisc.t1.autobuy.isUnlocked=0;

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
	resetMinionSpawns();
	//resetAutobuy(1);
		
  resetWorld();
}
function resetT3(){//Office
	totalPaths = 0;
	level = 0;
	resources.d.amt = 0;
	globalSpawnDelayReduction = 0;
	tierMisc.t2.upgradePotency=0;
	//achievements.prestige2.count=0;
	//achievements.itemScrapped.count=0;
	//tierMisc.t2.autobuy.isUnlocked=0;

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
	
	resetSelectedBoss();
	//resetAutobuy(2);
		
  resetWorld();
}

