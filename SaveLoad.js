"use strict";
//eyJ0IjoyNjIyOTgsInIiOnsiYSI6MTE1LCJiIjo0LCJjIjoxMywiZCI6Mn0sIm1yIjp7Im0iOjEyNywiYiI6MzUzLCJjIjo2MjUsImciOjY0NSwiaCI6MzMwLCJyIjo1MDgsInYiOjI1MiwiYSI6NDQsImUiOjEzMDQsImYiOjI4MSwidyI6M30sIm11Ijp7Im0iOnsibXMiOjQsImF0Ijo0LCJzciI6NCwiYWciOjEsInNkIjoxLCJpIjoxfSwiYiI6eyJtcyI6NCwiYXQiOjQsInNyIjo0fSwiYyI6eyJtcyI6NCwiYXQiOjQsInNyIjo0LCJhZyI6MX0sImciOnsibXMiOjQsImF0Ijo0LCJzciI6NH0sImgiOnsibXMiOjQsImF0Ijo0LCJzciI6NH0sInIiOnsibXMiOjQsImF0Ijo0LCJzciI6NH0sInYiOnsibXMiOjQsImF0Ijo0LCJzciI6NH0sImEiOnsibXMiOjQsImF0Ijo0LCJzciI6NCwiYWciOjEsInNkIjoxfSwiZSI6eyJtcyI6MiwiYXQiOjIsInNyIjoyLCJhZyI6MX0sImYiOnsibXMiOjIsImF0IjoyLCJzciI6Mn0sInciOnsibXMiOjIsImF0IjoyLCJzciI6Mn19LCJiciI6eyJkZSI6MH0sImciOlsiUmEiLCJSZSIsIkhQIiwiRCJdLCJhIjp7IkFtIjoyNjQsIkF0IjoxMTEzLCJBayI6MTU4LCJBMCI6NCwiQTEiOjQsIkEyIjoxLCJBbCI6N30sInRtIjp7InQwIjp7ImFiIjoxLCJwIjoyfSwidDEiOnsiYWIiOjEsInAiOjF9LCJ0MiI6eyJhYiI6MX19LCJtIjp7ImwiOjQsIm1tIjo0LCJ1bCI6OSwiZ3NyIjo1fX0=

//https://stackoverflow.com/a/47227198
function isEmpty(item){
	return Object.keys(item).length === 0;
}
function isObject(item) {
  return (item && typeof item === "object" && !Array.isArray(item));
}
function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (!isObject(target) || !isObject(source)) {
		return mergeDeep(target, ...sources);
	}

	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key]) 
			{
				Object.assign(target, { [key]: {} });
			}
			mergeDeep(target[key], source[key]);
		} else {
			Object.assign(target, { [key]: source[key] });
		}
	}

	return mergeDeep(target, ...sources);
}
function cleanObject(expected, input){
	if (!isObject(expected) || !isObject(input)){return;}
	
	for(let key in input){
		if(!(key in expected)){
			console.warn("Unexpected property '{0}' with value '{1}' on {1}.".format(key, input[key], input));
			delete input[key];
		}
		else if(isObject(expected[key]) && isObject(input[key])){
			cleanObject(expected[key], input[key]);
		}
		
	}
}
function offlineGains(gains){
	if(gains == 0){return;}
	const totalGains = {};
	for(let i=0;i<5;i++){
		if(tierUnlocked(i)){
			switch(i){
				case 0:
					resources.a.amt += gains;
					totalGains.a = gains;
					break;
				case 1:
					resources.b.amt += gains;
					totalGains.b = gains;
					break;
				case 2:
					resources.c.amt += gains;
					totalGains.c = gains;
					break;
				case 3:
					resources.d.amt += gains;
					totalGains.d = gains;
					break;
				case 4:
					resources.e.amt += gains;
					totalGains.e = gains;
					break;
			}
		}
		gains=Math.floor(gains/128);
	}
	
	const text = "Offline Gains:"
	
	setElementText("gainsModalHeader", "Offline Gains:");
	const ul = document.getElementById("gainsList");
	for(let g in totalGains){
		const text = "\n{0}: {1}{2}".format(resources[g].name, totalGains[g], resources[g].symbol);
		createNewElement("li", "gains"+g, ul, [], text);
	}
	const modal = document.getElementById("gainsModal");
	modal.style.display="block";
}

const year = 525600;

function loadData(){
	const cookie = getSaveCookie();
	if(!cookie || cookie == null){ return; }
	
	loadDataFromString(cookie);
}
function loadDataFromString(gameStateText){
	let gameState = {};
	try{
		gameState = JSON.parse(gameStateText);
	}
	catch{
		console.error("Bad JSON");
	}
	
	loadMinionResearch(gameState);
	loadMinionUpgrades(gameState);
	loadBossResearch(gameState);
	loadBossUpgrades(gameState);
	loadGauges(gameState);
	loadResources(gameState);
	loadTierMisc(gameState);
	loadAchievements(gameState);
	loadMisc(gameState);
	loadTime(gameState);
}
function loadTime(gameState){
	if(!gameState.hasOwnProperty("t")){return;}
	const now = getTimeSave();
	const t = gameState.t;
	
	const gains = now - t;
	while(gains < 0){ gains += year; }
	
	offlineGains(gains);
}
function loadMinionResearch(gs){
	if(!gs.hasOwnProperty("mr")){return;}
	
	for(let m in gs.mr){
		const minion = slMap.toLoad(m);
		if(!minionResearch.hasOwnProperty(minion)){ continue; }
		
		minionResearch[minion].isUnlocked = 1;
		minionResearch[minion].lastSpawn = gs.mr[m];
		const e = document.getElementById("chkSpawn" + minion);
		if(e != null){
			e.checked = true;
		}
	}

	minionResearch.Mite.isUnlocked=1;//is always unlocked, even if someone hacks their save.
}
function loadMinionUpgrades(gs){
	if(!gs.hasOwnProperty("mu")){return;}
	
	for(let m in gs.mu){
		const minion = slMap.toLoad(m);
		if(!minionUpgrades.hasOwnProperty(minion)){ continue; }
		
		for(let u in gs.mu[m]){
			const upgrade = slMap.toLoad(u);
			if(!minionUpgrades[minion].hasOwnProperty(upgrade)){continue;}
			
			minionUpgrades[minion][upgrade] = gs.mu[m][u];
		}
	}
}
function loadBossResearch(gs){
	if(!gs.hasOwnProperty("br")){return;}
	
	for(let b in gs.br){
		const boss = slMap.toLoad(b);
		if(!bossResearch.hasOwnProperty(boss)){ continue; }
		
		bossResearch[boss].isUnlocked = 1;
		bossResearch[boss].lastSpawn = gs.br[b];
	}
}
function loadBossUpgrades(gs){
	if(!gs.hasOwnProperty("bu")){return;}
	
	for(let b in gs.bu){
		const boss = slMap.toLoad(b);
		if(!bossUpgrades.hasOwnProperty(boss)){ continue; }
		
		for(let u in gs.bu[b]){
			const upgrade = slMap.toLoad(u);
			if(!bossUpgrades[boss].hasOwnProperty(upgrade)){continue;}
			
			bossUpgrades[boss][upgrade] = gs.bu[b][u];
		}
	}}
function loadGauges(gs){
	if(!gs.hasOwnProperty("g")){return;}
	for(let g in gs.g){
		const gauge = slMap.toLoad(gs.g[g]);
		if(gauges.hasOwnProperty(gauge)){
			gauges[gauge].isUnlocked = 1;
		}
	}
}
function loadResources(gs){
	if(!gs.hasOwnProperty("r")){return;}
	const r = gs.r;
	
	for(let r in gs.r){
		if(!resources.hasOwnProperty(r)){ continue; }
		
		resources[r].amt = gs.r[r];
	}
}
function loadTierMisc(gs){
	if(!gs.hasOwnProperty("tm")){return;}
	const tm = gs.tm;
	
	for(let t in tm){
		if(tm[t].hasOwnProperty("ab")){
			tierMisc[t].autobuy.isUnlocked = 1;
		}
		if(tm[t].hasOwnProperty("p")){
			tierMisc[t].upgradePotency = tm[t].p;
		}
	}
}
function loadAchievements(gs){
	if(!gs.hasOwnProperty("a")){return;}
	const a = gs.a;
	
	for(let a in gs.a){
		const ach = slMap.toLoad(a);
		if(!achievements.hasOwnProperty(ach)){ continue; }
		
		achievements[ach].count = gs.a[a];
	}
}
function loadMisc(gs){
	if(!gs.hasOwnProperty("m")){return;}
	const m = gs.m;
	
	if(m.hasOwnProperty("l")){
		totalPaths = LevelToTotalPaths(m.l);
	}
	if(m.hasOwnProperty("mm")){
		maxMinions = m.mm;
	}
	if(m.hasOwnProperty("l")){
		totalPaths = LevelToTotalPaths(m.l);
	}
	if(m.hasOwnProperty("ul")){
		maxUpgradeLevel = m.ul;
	}
	if(m.hasOwnProperty("gsr")){
		globalSpawnDelayReduction = m.gsr;
	}
}

function saveData() {
    const d = new Date();
    d.setDate(d.getTime() + 7);
	const gs = buildGameState();
	const json = btoa(gs);
	console.log(gs, gs.length, json, json.length);
	const c = "gs={0};expires={1};SameSite=Strict;path=/".format(gs, d.toUTCString());
    document.cookie = c;
	lastSave = 0;
	
	document.getElementById("txtExport").value = null;
}
function buildGameState(){
	const gameState = {
		t:getTimeSave()
	};
	
	const currentResources = getResourcesSave();
	if(!isEmpty(currentResources)){
		gameState.r = currentResources;
	}
	
	const minionResearchSave = getMinionResearchSave();
	if(!isEmpty(minionResearchSave)){
		gameState.mr = minionResearchSave;
	}
	
	const minionUpgradeSave = getMinionUpgradeSave();
	if(!isEmpty(minionUpgradeSave)){
		gameState.mu = minionUpgradeSave;
	}
	
	const bossResearchSave = getBossResearchSave();
	if(!isEmpty(bossResearchSave)){
		gameState.br = bossResearchSave;
	}
	
	const bossUpgradeSave = getBossUpgradeSave();
	if(!isEmpty(bossUpgradeSave)){
		gameState.bu = bossUpgradeSave;
	}

	const gaugesSave = getGaugesSave();
	if(!isEmpty(gaugesSave)){
		gameState.g = gaugesSave;
	}

	const achievementSave = getAchievementSave();
	if(!isEmpty(achievementSave)){
		gameState.a = achievementSave;
	}
	
	const tierMiscSave = getTierMiscSave();
	if(!isEmpty(tierMiscSave)){
		gameState.tm = tierMiscSave;
	}
	
	const miscSave = getMiscSave();
	if(!isEmpty(miscSave)){
		gameState.m = miscSave;
	}
	
	return JSON.stringify(gameState);
}
function getTimeSave(){
	return Math.floor(Date.now() / 60000) % year;
}
function getMinionResearchSave(){
	const unlocked = {};
	for(let minion in minionResearch){
		if(minionResearch[minion].isUnlocked){
			unlocked[slMap.toSave(minion)] = minionResearch[minion].lastSpawn;
		}
	}
	return unlocked;
}
function getMinionUpgradeSave(){
	const upgraded = {};

	for(let minion in minionUpgrades){
		for(let upgrade in minionUpgrades[minion]){
			if(minionUpgrades[minion][upgrade] > 0){
				const m = slMap.toSave(minion);
				if(!upgraded.hasOwnProperty(m)){
					upgraded[m] = {};
				}
				
				upgraded[m][slMap.toSave(upgrade)] = minionUpgrades[minion][upgrade];
			}
		}
	}
	return upgraded;
}
function getBossResearchSave(){
	const unlocked = {};
	for(let boss in bossResearch){
		if(bossResearch[boss].isUnlocked){
			unlocked[slMap.toSave(boss)] = bossResearch[boss].lastSpawn;
		}
	}
	return unlocked;
}
function getBossUpgradeSave(){
	const upgraded = {};

	for(let boss in bossUpgrades){
		for(let upgrade in bossUpgrades[boss]){
			if(bossUpgrades[boss][upgrade] > 0){
				const b = slMap.toSave(boss);
				if(!upgraded.hasOwnProperty(boss)){
					upgraded[b] = {};
				}
				
				upgraded[b][slMap.toSave(upgrade)] = bossUpgrades[boss][upgrade];
			}
		}
	}
	return upgraded;
}
function getGaugesSave(){
	const unlocked = [];
	for(let gauge in gauges){
		if(gauges[gauge].isUnlocked){
			unlocked.push(slMap.toSave(gauge));
		}
	}
	
	return unlocked;
}
function getResourcesSave(){
	const r = {};
	
	for(let resource in resources){
		if(resources[resource].amt > 0){
			r[resource] = resources[resource].amt
		}
	}
	
	return r;
}
function getTierMiscSave(){
	const r = {};
	
	for(let key in tierMisc){
		if(tierMisc[key].autobuy.isUnlocked){
			if(!r.hasOwnProperty(key)){
				r[key] = {};
			}
			r[key].ab = 1;
		}
		if(tierMisc[key].upgradePotency > 0){
			if(!r.hasOwnProperty(key)){
				r[key] = {};
			}
			r[key].p = tierMisc[key].upgradePotency;
		}
	}
	
	return r;
}
function getAchievementSave(){
	const counts = {};
	for(let a in achievements){
		if(achievements[a].count>0){
			counts[slMap.toSave(a)] = achievements[a].count;
		}
	}
	return counts;
}
function getMiscSave(){
	const m = {};
	
	const currentLevel = getLevel();
	if(currentLevel > 0){
		m.l = currentLevel;
	}

	if(maxMinions > 0){
		m.mm = maxMinions;
	}

	if(maxUpgradeLevel > defaultMaxUpgradeLevel){
		m.ul = maxUpgradeLevel;
	}
	
	if(globalSpawnDelayReduction > 0){
		m.gsr = globalSpawnDelayReduction;
	}
	
	return m;
}


const saveLoadDictionary={
	a:"Air",
	Ad:statTypes.abilityDuration,
	Ac:statTypes.abilityCooldown,
	Ak:"heroesKilled",
	Al:"maxLevelCleared",
	Am:"minionsSpawned",
	A0:"prestige0",
	A1:"prestige1",
	A2:"prestige2",
	A3:"prestige3",
	A4:"prestige4",
	Ar:"itemRarity",
	As:"itemScrapped",
	At:"towersDestroyed",
	ac:statTypes.attackCharges,
	ap:statTypes.auraPower,
	ar:statTypes.auraRange,
	at:statTypes.attackRate,
	ag:statTypes.attackRange,
	b:"Bomber",
	c:"Catapult",
	de:"Death",
	d:statTypes.damage,
	D:"Damage",
	e:"Earth",
	f:"Fire",
	F:"Famine",
	g:"Golem",
	h:"Harpy",
	hp:statTypes.health,
	HP:"Health",
	i:statTypes.initialMinions,
	l:"lastSpawn",
	m:"Mite",
	mp:statTypes.minionsPerSpawn,
	ms:statTypes.moveSpeed,	
	ps:statTypes.projectileSpeed,
	pt:"projectileType",
	r:"Ram",
	Ra:"Range",
	Re:"Reload",
	sd:statTypes.spawnDelay,
	sr:statTypes.splashRadius,	
	u:"isUnlocked",
	v:"Vampire",
	w:"Water",
	W:"War"
}
const slMap = new TwoWayMap(saveLoadDictionary)
function TwoWayMap(dictionary) {
   this.map = dictionary;
   this.reverseMap = {};
   for(let key in dictionary) {
      const value = dictionary[key];
      this.reverseMap[value] = key;   
   }
}
TwoWayMap.prototype.toLoad = function(key){ return this.map[key]; };
TwoWayMap.prototype.toSave = function(key){ return this.reverseMap[key]; };

function getSaveCookie() {
    const dc = document.cookie;
    const prefix = "gs=";
    let begin = dc.indexOf("; " + prefix);
	let end = -1;
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        end = document.cookie.indexOf(";", begin);
    }
	if (end == -1) { end = dc.length; }
    return decodeURI(dc.substring(begin + prefix.length, end));
} 
function getExport(){
	saveData();
	
	const gameState = buildGameState();
	const base64 = btoa(gameState);
	
	const txtExport = document.getElementById("txtExport");
	txtExport.value = base64;

	document.getElementById("txtImport").value = null;
}
function doImport(){
	const txtImport = document.getElementById("txtImport");
	const base64 = txtImport.value;
	
	const gameState = atob(base64);
	loadDataFromString(gameState);

	txtImport.value = null;
	document.getElementById("txtExport").value = null;
}

