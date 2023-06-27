const year = 525600;//minutes in 365 days.
const gameKey = "MOM_GS";
const invKey = "MOM_INV";
const optKey = "MOM_OPT";

//https://www.base64decode.org/
function deleteLocalStorage(){
	localStorage.removeItem(gameKey);
	localStorage.removeItem(invKey);
	localStorage.removeItem(optKey);
}
function deleteCookies(){
    setCookie("gs", "", new Date(0).toUTCString());
    setCookie("inv", "", new Date(0).toUTCString());
    setCookie("opt", "", new Date(0).toUTCString());
}

function deleteSaveData(){
	deleteLocalStorage();
	deleteCookies();
}
function getCookie(prefix) {
	const dc = document.cookie;
	
	prefix = prefix+"=";
	const begin = dc.indexOf(prefix);
	if(begin==-1){return null;}
	let end = dc.indexOf(";", begin);
	if(end == -1){end = dc.length;}
	
	const output = dc.substring(begin + prefix.length, end);
	return output;
}
function getLocalStorage(prefix){
	return localStorage.getItem(prefix);
}

function saveBeforeUnload(e) {
	if(mainCycle>0 && autoSave()){
		saveData();
	}
}

function setCookie(key, value, expire){
	document.cookie = `${key}=${value};expires=${expire};SameSite=Strict;domain=${document.domain};path=/`;
}

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
			console.warn(`Unexpected property '${key}' with value '${input[key]}' on ${input}.`);
			delete input[key];
		}
		else if(isObject(expected[key]) && isObject(input[key])){
			cleanObject(expected[key], input[key]);
		}
		
	}
}
function offlineGains(minutes){
	if(minutes == 0){return;}
	
	const hours = minutes / 60;
	const score = getAchievementScore();
	
	let gains = Math.floor(hours * score);
	
	const totalGains = {};
	for(let i=0;i<5;i++){
		if(!tierUnlocked(i)){ return; }
		
		gains=Math.floor(Math.max(gains**.5 - 1, 0));
		
		switch(i){
			case 0:{
				resources.a.amt += gains;
				totalGains.a = gains;
				break;
			}
			case 1:{
				resources.b.amt += gains;
				totalGains.b = gains;
				break;
			}
			case 2:{
				resources.c.amt += gains;
				totalGains.c = gains;
				break;
			}
			case 3:{
				resources.d.amt += gains;
				totalGains.d = gains;
				break;
			}
			case 4:{
				resources.e.amt += gains;
				totalGains.e = gains;
				break;
			}
		}
	}
	
	const text = "Offline Gains:"
	
	const ul = document.getElementById("gainsList");
	for(let g in totalGains){
		const text = `\n${resources[g].name}: ${totalGains[g]}${resources[g].symbol}`;
		createNewElement("li", "gains"+g, ul, [], text);
	}
	toggleUIElementByID("gainsModal", false);
}

function loadLocalStorage(){
	let dataLoaded = false;
	const saveData = getLocalStorage(gameKey);
	if(saveData && saveData != null){
		//if save data exists don't ask again.
		dataLoaded = true;
		toggleUIElementByID("introModal", true);
		loadDataFromString(atob(saveData));
	}
	
	const options = getLocalStorage(optKey);
	if(options && options !== null){
		dataLoaded = true;
		loadDataFromString(atob(options));
	}
	
	const inventory = getLocalStorage(invKey);
	if(inventory && inventory != null){
		dataLoaded = true;
		loadDataFromString(atob(inventory));
	}
	return dataLoaded;
}
function loadCookieData(){
	const saveData = getCookie("gs");
	if(saveData && saveData != null){
		toggleUIElementByID("introModal", true);
		loadDataFromString(atob(saveData));
	}
	
	const options = getCookie("opt");
	if(options && options !== null){
		loadDataFromString(atob(options));
	}
	
	const inventory = getCookie("inv");
	if(inventory && inventory != null){
		loadDataFromString(atob(inventory));
	}
}
function loadData(){
	//if local storage exists
	if(!loadLocalStorage()){ //if local storage fails, try cookies.
		loadCookieData();
	}
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
	loadOptions(saveData);
	loadTime(saveData);
}
function loadTime(saveData){
	if(!saveData.hasOwnProperty("t")){return;}
	const now = getTimeSave();
	const t = saveData.t;
	
	let minutes = now - t;
	while(minutes < 0){ minutes += year; }
	minutes=Math.max(0,minutes-30);
	
	offlineGains(minutes);
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
	}
}
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
		
		//old save compatibility
		if(!saveData.a[a].hasOwnProperty("c")){
			achievements[ach].count = saveData.a[a]||0;
			continue;
		}
		
		achievements[ach].count = saveData.a[a].c||0;
		achievements[ach].maxCount = saveData.a[a].m||0;
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
	if(m.hasOwnProperty("af")){
		maxAutoForgeLimit = m.af;
		getUIElement("autoForgeLimit").max=maxAutoForgeLimit;
		setElementTextById("maxAutoForge", maxAutoForgeLimit);
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
function loadOptions(saveData){
	if(!saveData.hasOwnProperty("o")){return;}
	const o = saveData.o;
	
	if(o.hasOwnProperty("fps")){
		document.getElementById("chkShowFPS").checked=o.fps;
	}
	if(o.hasOwnProperty("simple")){
		document.getElementById("chkSmipleMinions").checked=o.simple;
	}
	if(o.hasOwnProperty("compact")){
		document.getElementById("chkCompactMinions").checked=o.compact;
	}
	if(o.hasOwnProperty("p1Rate")){
		document.getElementById("ddlP1Rate").value=o.p1Rate;
	}
	if(o.hasOwnProperty("quality")){
		document.getElementById("ddlQuality").value=o.quality;
	}
	if(o.hasOwnProperty("style")){
		document.getElementById("ddlColors").value=o.style;
	}
	if(o.hasOwnProperty("blind")){
		document.getElementById("chkColorblind").checked=o.blind;
	}
	
	if(o.hasOwnProperty("boss")){
		document.querySelector("input[name='bossSelect'][value='"+o.boss+"']").checked = true;
	}
	if(o.hasOwnProperty("bPos")){
		document.getElementById("bossPosition").value=o.bPos;
	}
	
	if(o.hasOwnProperty("p0B")){
		document.getElementById("chkAutoBuy0").checked=o.p0B;
	}
	if(o.hasOwnProperty("p0P")){
		document.getElementById("chkAutoPrestige0").checked=o.p0P;
	}
	if(o.hasOwnProperty("p1B")){
		document.getElementById("chkAutoBuy1").checked=o.p1B;
	}
	if(o.hasOwnProperty("p1P")){
		document.getElementById("chkAutoPrestige1").checked=o.p1P;
	}
	if(o.hasOwnProperty("p2B")){
		document.getElementById("chkAutoBuy2").checked=o.p2B;
	}
	if(o.hasOwnProperty("p2P")){
		document.getElementById("chkAutoPrestige2").checked=o.p2P;
	}
	if(o.hasOwnProperty("p3B")){
		document.getElementById("chkAutoBuy3").checked=o.p3B;
	}
	if(o.hasOwnProperty("p3P")){
		document.getElementById("chkAutoPrestige3").checked=o.p3P;
	}
	
	if(o.hasOwnProperty("p4A")){
		document.getElementById("chkAutoSell").checked=o.p4A;
	}
	if(o.hasOwnProperty("p4L")){
		document.getElementById("autoSellLimit").value=o.p4L;
		autoSellLimit=+o.p4L;
		getUIElement("autoSellLimitSelection").textContent = autoSellLimit;
	}
	if(o.hasOwnProperty("p4F")){
		document.getElementById("chkAutoForge").checked=o.p4F;
		onChangeChkAutoForge();
	}
	if(o.hasOwnProperty("p4U")){
		document.getElementById("autoForgeLimit").value=o.p4U;
		autoForgeLimit=+o.p4U;
		getUIElement("autoForgeLimitSelection").textContent = autoForgeLimit;
	}
	if(o.hasOwnProperty("p4S")){
		document.getElementById("startingLevelSelector").value=o.p4S;
		document.getElementById("startingLevelSelection").textContent=o.p4S;
		resetLevel = o.p4S;
	}
}


//used to test old cookie saves, shouldn't be used.
function saveDataOLD(){
	const d = new Date();
	d.setDate(d.getDate() + 7);
	
	const game = buildGameState(true, false, false);
	const inv = buildGameState(false, true, false);
	const opt = buildGameState(false, false, true);
	//const full = buildGameState(true, true, true);
	
	const saveGame = btoa(game);
	const saveInv = btoa(inv);
	const saveOpt = btoa(opt);
	//const saveFull = btoa(full);
	
	localStorage.setItem(gameKey, saveGame);
	localStorage.setItem(invKey, saveInv);
	localStorage.setItem(optKey, saveOpt);
	
	//console.log("save data:", saveFull.length, saveFull);
	lastSave = 0;
	
	document.getElementById("txtExport").value = null;
}

function saveData() {
	const game = buildGameState(true, false, false);
	const inv = buildGameState(false, true, false);
	const opt = buildGameState(false, false, true);
	//const full = buildGameState(true, true, true);
	
	const saveGame = btoa(game);
	const saveInv = btoa(inv);
	const saveOpt = btoa(opt);
	//const saveFull = btoa(full);
	
	localStorage.setItem(gameKey, saveGame);
	localStorage.setItem(invKey, saveInv);
	localStorage.setItem(optKey, saveOpt);
	
	//console.log("save data:", saveFull.length, saveFull);
	lastSave = 0;
	
	document.getElementById("txtExport").value = null;
}
function buildGameState(game, inventory, options){
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
	
	if(options){
		const optSave = getOptionsSave();
		if(!isEmpty(optSave)){
			gameState.o = optSave;
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
		if(tierMisc[key].upgradePotency > 1){
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
		if(achievements[a].count>0||achievements[a].maxCount>0){
			counts[slMap.toSave(a)] = {c:achievements[a].count,m:achievements[a].maxCount};
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
	if(maxAutoForgeLimit>100){
		m.af=maxAutoForgeLimit;
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
function getOptionsSave(){
	const o={};
	
	//save options tabs
	o.fps = document.getElementById("chkShowFPS")?.checked;
	o.simple = document.getElementById("chkSmipleMinions").checked;
	o.compact = document.getElementById("chkCompactMinions").checked;
	o.p1Rate = document.getElementById("ddlP1Rate").value;
	o.quality = document.getElementById("ddlQuality").value;
	o.style = document.getElementById("ddlColors").value;
	o.blind = document.getElementById("chkColorblind").checked;
	
	//save other tab options
	o.boss = document.querySelector("input[name='bossSelect']:checked")?.value;
	o.bPos = document.getElementById("bossPosition").value;
	
	o.p0B = document.getElementById("chkAutoBuy0").checked;
	o.p0P = document.getElementById("chkAutoPrestige0").checked;
	o.p1B = document.getElementById("chkAutoBuy1").checked;
	o.p1P = document.getElementById("chkAutoPrestige1").checked;
	o.p2B = document.getElementById("chkAutoBuy2").checked;
	o.p2P = document.getElementById("chkAutoPrestige2").checked;
	o.p3B = document.getElementById("chkAutoBuy3").checked;
	o.p3P = document.getElementById("chkAutoPrestige3").checked;
	
	o.p4A = document.getElementById("chkAutoSell").checked;
	o.p4L = document.getElementById("autoSellLimit").value;
	o.p4F = document.getElementById("chkAutoForge").checked;
	o.p4U = document.getElementById("autoForgeLimit").value;
	o.p4S = document.getElementById("startingLevelSelector").value;
	
	return o;
}

const saveLoadDictionary={
	a:"Air",
	Ab:"bossesSummoned",
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
	Ao:"boostsPurchased",
	Ap:"itemPrestiged",
	As:"itemScrapped",
	At:"towersDestroyed",
	al:"maxAutosellLimit",
	af:"maxAutoForgeLimit",
	ac:statTypes.attackCharges,
	ap:statTypes.auraPower,
	ar:statTypes.auraRange,
	at:statTypes.attackDelay,
	ag:statTypes.attackRange,
	b:"Bomber",
	c:"Catapult",
	cr:statTypes.chainReduction,
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
	sr:statTypes.impactRadius,
	tc:statTypes.targetCount,
	u:"isUnlocked",
	v:"Vampire",
	w:"Water",
	W:"War",
	wr:statTypes.regen
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
	buildWorld();
	
	txtImport.value = null;
	document.getElementById("txtExport").value = null;
}

