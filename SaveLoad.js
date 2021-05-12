"use strict";
//https://www.base64decode.org/
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
	
	const ul = document.getElementById("gainsList");
	for(let g in totalGains){
		const text = "\n{0}: {1}{2}".format(resources[g].name, totalGains[g], resources[g].symbol);
		createNewElement("li", "gains"+g, ul, [], text);
	}
	const modal = document.getElementById("gainsModal");
	modal.style.display="block";
}

const year = 525600;

function loadCookieData(){
	const saveData = getCookie("gs");
	if(!saveData || saveData == null){ return; }//if no saveData shouldn't have inventory either
	loadDataFromString(atob(saveData));

	const inventory = getCookie("inv");
	if(!inventory || inventory == null){ return; }
	loadDataFromString(atob(inventory));
}
function loadDataFromString(saveString){
	let saveData = {};
	try{
		saveData = JSON.parse(saveString);
	}
	catch{
	  console.error(saveString, saveData);
		console.error("Error loading JSON");
		console.trace();
	}
	
	loadMinionResearch(saveData);
	loadMinionUpgrades(saveData);
	loadBossResearch(saveData);
	loadBossUpgrades(saveData);
	loadGauges(saveData);
	loadResources(saveData);
	loadTierMisc(saveData);
	loadAchievements(saveData);
	loadMisc(saveData);
	loadInventory(saveData);
	loadTime(saveData);
	
	buildWorld();
}
function loadTime(saveData){
	if(!saveData.hasOwnProperty("t")){return;}
	const now = getTimeSave();
	const t = saveData.t;
	
	let gains = now - t;
	while(gains < 0){ gains += year; }
	
	offlineGains(gains);
}
function loadMinionResearch(saveData){
	if(!saveData.hasOwnProperty("mr")){return;}
	
	for(let m in saveData.mr){
		const minion = slMap.toLoad(m);
		if(!minionResearch.hasOwnProperty(minion)){ continue; }
		
		minionResearch[minion].isUnlocked = 1;
		minionResearch[minion].lastSpawn = saveData.mr[m];
		const e = document.getElementById("chkSpawn" + minion);
		if(e != null){
			e.checked = true;
		}
	}
}
function loadMinionUpgrades(saveData){
	if(!saveData.hasOwnProperty("mu")){return;}
	
	for(let m in saveData.mu){
		const minion = slMap.toLoad(m);
		if(!minionUpgrades.hasOwnProperty(minion)){ continue; }
		
		for(let u in saveData.mu[m]){
			const upgrade = slMap.toLoad(u);
			if(!minionUpgrades[minion].hasOwnProperty(upgrade)){continue;}
			
			minionUpgrades[minion][upgrade] = saveData.mu[m][u];
		}
	}
}
function loadBossResearch(saveData){
	if(!saveData.hasOwnProperty("br")){return;}
	
	for(let b in saveData.br){
		const boss = slMap.toLoad(b);
		if(!bossResearch.hasOwnProperty(boss)){ continue; }
		
		bossResearch[boss].isUnlocked = 1;
		bossResearch[boss].lastSpawn = saveData.br[b];
	}
}
function loadBossUpgrades(saveData){
	if(!saveData.hasOwnProperty("bu")){return;}
	
	for(let b in saveData.bu){
		const boss = slMap.toLoad(b);
		if(!bossUpgrades.hasOwnProperty(boss)){ continue; }
		
		for(let u in saveData.bu[b]){
			const upgrade = slMap.toLoad(u);
			if(!bossUpgrades[boss].hasOwnProperty(upgrade)){continue;}
			
			bossUpgrades[boss][upgrade] = saveData.bu[b][u];
		}
	}}
function loadGauges(saveData){
	if(!saveData.hasOwnProperty("g")){return;}
	for(let g in saveData.g){
		const gauge = slMap.toLoad(saveData.g[g]);
		if(gauges.hasOwnProperty(gauge)){
			gauges[gauge].isUnlocked = 1;
		}
	}
}
function loadResources(saveData){
	if(!saveData.hasOwnProperty("r")){return;}

	for(let r in saveData.r){
		if(!resources.hasOwnProperty(r)){ continue; }
		
		resources[r].amt = saveData.r[r];
	}
}
function loadTierMisc(saveData){
	if(!saveData.hasOwnProperty("tm")){return;}
	const tm = saveData.tm;
	
	for(let t in tm){
		if(tm[t].hasOwnProperty("ab")){
			tierMisc[t].autobuy.isUnlocked = 1;
		}
		if(tm[t].hasOwnProperty("p")){
			tierMisc[t].upgradePotency = tm[t].p;
		}
	}
}
function loadAchievements(saveData){
	if(!saveData.hasOwnProperty("a")){return;}
	for(let a in saveData.a){
		const ach = slMap.toLoad(a);
		if(!achievements.hasOwnProperty(ach)){ continue; }
		
		achievements[ach].count = saveData.a[a];
	}
}
function loadMisc(saveData){
	if(!saveData.hasOwnProperty("m")){return;}
	const m = saveData.m;
	
	if(m.hasOwnProperty("l")){
		totalPaths = LevelToTotalPaths(m.l);
		level = m.l;
	}
	if(m.hasOwnProperty("mm")){
		maxMinions = m.mm;
	}
	if(m.hasOwnProperty("ul")){
		maxUpgradeLevel = m.ul;
	}
	if(m.hasOwnProperty("gsr")){
		globalSpawnDelayReduction = m.gsr;
	}
	if(m.hasOwnProperty("MP")){
	  moneyPitLevel = m.MP;
	}
	if(m.hasOwnProperty("al")){
	  maxAutosellLimit = m.al;
	  getUIElement("autoSellLimit").max=maxAutosellLimit;
	  setElementTextById("maxAutosell", maxAutosellLimit);
	}
	if(m.hasOwnProperty("R")){
	  maxResetLevel = m.R;
	  getUIElement("startingLevelSelector").max=m.R;
	}
}
function loadInventory(saveData){
  if(!saveData.hasOwnProperty("i")){return;}
  inventory.length=0;
  const inv = saveData.i;
  
  for(let i=0;i<inv.length;i++){
    loadItem(inv[i]);
  }
  setElementTextById("inventoryCount", inventory.length);
}

function saveData() {
  const d = new Date();
  d.setDate(d.getTime() + 7);
  
	const game = buildGameState(true, false);
  const inv = buildGameState(false, true);
  const full = buildGameState(true, true);

	const saveGame = btoa(game);
	const saveInv = btoa(inv);
	const saveFull = btoa(full);

	const c1 = "gs={0};expires={1};SameSite=Strict;path=/".format(saveGame, d.toUTCString());
  document.cookie = c1;

  const c2 = "inv={0};expires={1};SameSite=Strict;path=/".format(saveInv, d.toUTCString());
  document.cookie = c2;

	//console.log("save data:", saveFull.length, saveFull);
	lastSave = 0;
	
	document.getElementById("txtExport").value = null;
}
function buildGameState(game, inventory){
	const gameState = {
		t:getTimeSave()
	};
	
	if(game){
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
	}
	
	if(inventory){
  	const invSave = getInventorySave();
  	if(!isEmpty(invSave)){
  	  gameState.i = invSave;
  	}
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
				if(!upgraded.hasOwnProperty(b)){
					upgraded[b] = {};
				}
				
				const a = slMap.toSave(upgrade);
				const x = bossUpgrades[boss][upgrade];
				
				upgraded[b][a] = x;
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
	
	if(level > 0){
		m.l = level;
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
	
	if(moneyPitLevel > 0){
	  m.MP = moneyPitLevel;
	}
	
	if(maxAutosellLimit>100){
	  m.al=maxAutosellLimit;
	}
	if(maxResetLevel>0){
	  m.R = maxResetLevel;
	}
	
	return m;
}
function getInventorySave(){
  const I = [];
  for(let i=0;i<inventory.length;i++){
    I.push(inventory[i].buildSave());
  }
  return I;
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
	al:"maxAutosellLimit",
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
	I:"Imp",
	l:"lastSpawn",
	m:"Mite",
	mp:statTypes.minionsPerDeploy,
	MP:"MoneyPitLevel",
	ms:statTypes.moveSpeed,
	P:"Pestilence",
	ps:statTypes.projectileSpeed,
	pt:"projectileType",
	r:"Ram",
	R:"resetLevel",
	Ra:"Range",
	Re:"Reload",
	sd:statTypes.spawnDelay,
	sr:statTypes.splashRadius,
	tc:statTypes.targetCount,
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

function getCookie(prefix) {
  const dc = document.cookie;

  prefix = prefix+"=";
  const begin = dc.indexOf(prefix);
  let end = dc.indexOf(";", begin);
  if(end == -1){end = dc.length;}
  
  const output = dc.substring(begin + prefix.length, end);
  return output;
}
function getExport(){
	saveData();
	
	const gameState = buildGameState(true, true);
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

