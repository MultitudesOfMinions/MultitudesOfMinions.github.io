
function createNewElement(type, id, parent, cssClasses, textContent){
	if(!parent){
		console.error("parent is null for " + id);
		return null;
	}
	let e = document.getElementById(id);
	if(e){
		if(textContent){ setElementTextById(id, textContent, true); }
		return e;
	}
	
	e = document.createElement(type);
	e.id = id;
	
	for(let i = 0; i < cssClasses.length;i++){
		e.classList.add(cssClasses[i]);
	}
	
	if(textContent) { e.textContent = textContent; }
	
	parent.appendChild(e);
	return e;
}

function addOnclick(element, onclick){
	if(element === null || onclick === null){
		return;
	}
	
	element.onclick = onclick;
}

function initialize_components(){
	try{
		initialSize();
		populateInfo();
		
		populateResourceNames();
		createTierUpgrades();
		createGaugesTable();
		createBossTab();
		createStoreStock();
		createAchievemetsTab();
		
		resetInputs();
		if(!loadURL()){
			loadCookieData();
		}
		
		createMinionSpawns();
		
		buildWorld();
		
		updateT0();
		updateT1();
		updateT2();
		updateT3();
		updateT4();
		updateBossTab();
		toggleTierItems();
		
		setColorblind();
		
		if(!cookiesEnabled){
			getUIElement("btnMnuArmory").click();
			document.getElementById("introModal").classList.remove('hide');
		}
		window.addEventListener("beforeunload", (event) => {
			if(cookiesEnabled && mainCycle>0 && autoSave()){
				saveData();
			}
		});
		window.addEventListener("focus", (event) => {
			drawMap();
		});
		
		drawMap();
	}
	catch(x){
		console.trace();
		console.error(x);
		alert("Init Error, see console for details. Game not initialized.");
		return;
	}
	start(defaultInterval);
}
function initialSize(){
	//Resize panels
	const ch= Math.max(document.documentElement.clientHeight);
	const a = Math.max(document.documentElement.clientWidth);
	const b = ch*2.4;

	const maxD = Math.min(a, b) - 10;
	gameW = maxD;
	gameH = maxD/4;
	langoliers = -(gameW>>3);
	halfH = gameH/2;
	leaderPoint = gameW/2;
	pathL = (gameW>>6);
	pathW = (gameH>>2);
	
	const drawArea = document.getElementById("unitLayer");
	drawArea.style.width = gameW;
	drawArea.style.height = gameH;
	drawArea.width = gameW;
	drawArea.height = gameH;
	
	const mapArea = getUIElement("mapLayer");
	mapArea.style.width = gameW;
	mapArea.style.height = gameH;
	mapArea.width = gameW;
	mapArea.height = gameH;
	
	pnl0.style.height = gameH+"px";
	pnl1.style.top = (gameH+5) +"px";
	pnl1.style.height = (ch-gameH-15) +"px";
	getUIElement("resourceBox").style.top = (gameH+5)+"px";
}

function buildWorld(){
	minions.length = 0;
	minionOrder.length = 0;
	boss = null;
	path.length = 0;
	towers.length = 0;
	hero = null;
	squire = null;
	page = null;
	totalPaths = totalPaths || 0;
	level = level || 0;
	
	buildPath();
	initialMinions()
	initialTowers();
	
	levelStartX = getEndOfLevelX(level - 1);
	levelEndX = getEndOfLevelX(level);
	
	initialQuid();
	addHero();
	drawMap();
}
function buildPath(){
	path[0] = new point(-(pathL*2), halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + (pathL*2)){
		addPathPoint(true);
	}
	buildAccents();
}
function buildAccents(){
	addAccent();
	while(accents.length > 0 && accents[accents.length-1].loc.x < gameW + (pathL*2)){
		addAccent();
	}
}

function addQuid(){
	const s = ((Math.random()**.3) * -1) + 1;
	const x = s * gameW;
	const y = (Math.random() - .5) * pathW;
	const py = getPathYatX(x);
	quid.push(new point(x,py+y));	
}
function initialQuid(){
	sinceQuid=0;
	quid.length = 0;
	const initQ = achievements.prestige0.count**.4 + 4;
	for(let i=0;i<initQ;i++){
		addQuid();
	}
}

function populateResourceNames(){
	
	setElementTextById("spnResourceAName", resources.a.name, false);
	setElementTextById("spnResourceBName", resources.b.name, false);
	setElementTextById("spnResourceCName", resources.c.name, false);
	setElementTextById("spnResourceDName", resources.d.name, false);
	setElementTextById("spnResourceEName", resources.e.name, false);
	setElementTextById("spnResourceFName", resources.f.name, false);
	
	setElementTextById("spnResourceASymbol", resources.a.symbol, false);
	setElementTextById("spnResourceBSymbol", resources.b.symbol, false);
	setElementTextById("spnResourceCSymbol", resources.c.symbol, false);
	setElementTextById("spnResourceDSymbol", resources.d.symbol, false);
	setElementTextById("spnResourceESymbol", resources.e.symbol, false);
	setElementTextById("spnResourceFSymbol", resources.f.symbol, false);
	
}

function initialMinions(){
	for(let minion in minionUpgrades){
		let minions = minionUpgrades[minion].initialMinions;
		for(let i=0;i<minions;i++){
			addMinionQ.push(minion);
		}
	}
}
function initialTowers(){
	let count = -1;
	let limit = 0;
	
	while(towers.length!=count && limit++<50)
	{
		count=towers.length;
		addTower();
	}
}

function createMinionSpawns(){
	const spawnPool = document.getElementById("divSpawnPool");
	
	for(let minionType in minionResearch){
		const baseId=`div${minionType}Spawn`;
		const chkId = `chkSpawn${minionType}`;
		const progressId = baseId+"Progress";
		
		const base = createNewElement("div", baseId, spawnPool, ["spawnPoolRow"], null);
		
		const chk = createNewElement("input", chkId, base, [], null);
		chk.type = "checkbox";
		chk.checked = minionResearch[minionType].isUnlocked;
		
		const bg = createNewElement("div", baseId+"Back", base, ["progressBackground"], null);
		bg.style.backgroundColor = "#777"
		
		const progress = createNewElement("div", progressId, bg, ["progressBar"], minionType);
		progress.style.backgroundColor = baseMinion[minionType].color;
		progress.style.color = baseMinion[minionType].color2 || "#000";

		createNewElement("span", baseId+'HK', base, ["HK"], `[${minionResearch[minionType].hotkey}]`);
		
		//const pText = minionType;
		//setElementText(progress, pText, false);
		
		minionSpawns[minionType] = new MinionSpawnChildren(base, chk, progress);
	}
}

function createBossTab(){
	const bossSelect = document.getElementById("ulBossSelectList");
	const bossActive = document.getElementById("divActiveData");
	
	const baseUnlockCost = unlockBossCost();
	for(let bossType in baseBoss){
		//select
		const li = createNewElement("li", "li"+bossType, bossSelect, ["bossListItem"], null)
		
		const divSpawnBack = createNewElement("div", `div${bossType}SpawnBackground`, li, ["progressBackground", "bossProgressBackground"], null);
		const divProgress = createNewElement("div", `div${bossType}SpawnProgress`, divSpawnBack, ["progressBar"], null);
		
		const rdoId = `select${bossType}`;
		const rdo = createNewElement("input", rdoId, divProgress, [], null);
		rdo.type = "radio";
		rdo.name = "bossSelect";
		rdo.value = bossType;
		
		const label = createNewElement("label", rdoId+"Label", divProgress, ["bossSelectLabel"], bossType+" ");
		label.for = rdoId;
		
		addOnclick(li, function() {rdo.checked=true;});
		
		
		bossUIs.push(new BossUIElements(bossType, rdo, label, divProgress, divSpawnBack));
		
	}
}

function createStoreStock(){
	const parent = document.getElementById("divBombStock");
	const table = document.getElementById("storeDetailsBody")
	
	for (const [key, value] of Object.entries(bombTypes)) {
		createStoreButton(key, value.text, parent);
		buildBombRow(key, table);
	}
    
	createResourceConvertButton("a");
	createResourceConvertButton("b");
	createResourceConvertButton("c");
	createResourceConvertButton("d");
}

function createResourceConvertButton(resource){
	const r = resources[resource];
	
	const exchangeScale = 1;
	const value = 1;
	const parent = document.getElementById("divExchange")
	const text = value+" "+r.name;
	const id = "Exchange"+r.name;
	
	const btn = createMiscButton(id, parent, text, 1, resources.f.symbol)
	btn.value = value;
	btn.rType = resource;
	addOnclick(btn, function() {exchange(this);});
	
	setButtonAffordableClass(btn, true);
}

function createStoreButton(id, text, parent){
	const btn = createNewElement("button", "btnStore"+id, parent, ["storeButton"], text);
	const url = `./Images/${id}.png`;
	if(fileExists(url)){
		const img = createNewElement("img", "btnImg"+id, btn, ["storeButtonImg"], null);
		img.src = url;
		img.alt = text;
	}
	btn.value = id;
	addOnclick(btn, function() {buyBomb(id);});
}

function createUpgrades(tier, parentTable, tierList, resourceSymbol){
	const upgrades = minionUpgradeTypes[tier];
	
	for(let minionType in baseMinion)
	{
		const upgradeListId = `div${minionType}T${tier}UpgradeList`;
		const newUpgradeList = createNewElement("div", upgradeListId, parentTable, ["listBlock"], null);
		const upgradeList = new UpgradeList(minionType, upgradeListId, newUpgradeList);
		
		const headerText = minionType;
		createNewElement("div", upgradeListId + "Header", newUpgradeList, ["listBlockHeader"], headerText);
		
		for(let i in upgrades){
			const upgradeType = upgrades[i];
			const newId = `Upg${minionType}${upgradeType}`;
			
			const newButton = createUpgradeButton(newId, newUpgradeList, minionType, upgradeType, resourceSymbol, upgradeList);
		}
		tierList.push(upgradeList);
	}
	
}
const unitsByUnlockT =function(tier){
	if(tier == 3){
		return bossResearch;
	}
	
	const output = {};
	const types = Object.entries(minionResearch).filter(x => x[1].unlockT == tier);
	for(let index in types){
		const key = types[index][0];
		const value = types[index][1];
		output[key]=value;
	}
	
	return output;
}
function createUnlocks(tier, parent, resourceSymbol){
	
	const unlockList = new UnlockList(tier);
	const unlockTypes = unitsByUnlockT(tier);
	const unlockCategory = tier == 3?"Boss":"Minion";
	
	for(let type in unlockTypes){
		const newButton = createUnlockButton(parent, type, unlockCategory, resourceSymbol, unlockList);
	}
	
	unlockButtons.push(unlockList);
}
function createMiscBuy(tier, parent, resourceSymbol){
	//misc tier buttons
	const buyButtons = new TierMiscButtons(tier);
	const miscUpgrades = tierMisc["t"+tier].miscUpgrades;
	
	for(let upgrade in miscUpgrades){
		const newButton = createTierUpgradeButton(tier, upgrade, parent, miscUpgrades[upgrade], resourceSymbol, buyButtons);
	}
	miscTierButtons.push(buyButtons)
}
function createPrestige(tier, text, costSymbol, gainsSymbol){
	const divPrestige = document.getElementById("divPrestige"+tier);
	const newButton = createPrestigeButton(tier, divPrestige, text, costSymbol, prestigeButtons);
	newButton.setAttribute("tier", tier);
	
	const prestigeGainsSymbol = getUIElement(`divPrestige${tier}GainSymbol`);
	setElementText(prestigeGainsSymbol, gainsSymbol, false);
}

function createPanelButtons(tier, costsSymbol, upgradesList, prestigeText, prestigeGainsSymbol){
	const upgradeTable = document.getElementById(`divMinionT${tier}UpgradeTable`);
	if(upgradeTable !== null){
		createUpgrades(tier, upgradeTable, upgradesList, costsSymbol);
	}
	
	const unlockTable = document.getElementById(`divMiscT${tier}Upgrades`);
	createMiscBuy(tier, unlockTable, costsSymbol);
	createUnlocks(tier, unlockTable, costsSymbol);
	
	if(prestigeText){
		createPrestige(tier, prestigeText, costsSymbol, prestigeGainsSymbol);
	}
	
	//put misc upgrades group at the end.
	unlockTable.parentNode.appendChild(unlockTable);
}

const buttonBase = function(id, parent, text, resourceSymbol){
	const btnId = "btn"+id;
	const divId = "div"+id+"cost";
	const costId = "lbl"+id+"cost";
	
	const newButton = createNewElement("button", btnId, parent, ["upg"], null);
	const costDiv = createNewElement("div", divId, newButton, ["upgCostDiv"], null);
	
	createNewElement("label", btnId+"Type", newButton, ["partialLabel"], text.fixString());
	const lblCost = createNewElement("label", costId, costDiv, ["partialLabel"], '-');
	createNewElement("label", btnId+"Unit", costDiv, ["partialLabel"], resourceSymbol);
	
	return {b:newButton, l:lblCost};
}
function createUpgradeButton(id, parent, unitType, upgradeType, resourceSymbol, referenceList){
	const btn = buttonBase(id, parent, upgradeType, resourceSymbol);
	const newButton = btn.b;
	const lblCost = btn.l;
	
	const divId = "div"+id+"Lvl";
	const lvlDiv = createNewElement("div", divId, newButton, [], null);
	const potency = createNewElement("label", "lbl"+id+"Potency", lvlDiv, ["partialLabel"], "x1");
	const lvl = createNewElement("label", "lbl"+id+"Lvl", lvlDiv, ["partialLabel"], "0");
	createNewElement("label", "lbl"+id+"S", lvlDiv, ["partialLabel"], '/');
	const maxLvl = createNewElement("label", "lbl"+id+"Maxlvl", lvlDiv, ["partialLabel"], "0");
	const perk = createNewElement("Label", "lbl"+id+"Perk", lvlDiv, ["partialLabel"], "0");
	
	referenceList.upgrades.push(new UpgradeIds(upgradeType, newButton, lblCost, lvl, maxLvl, potency, perk));
	addOnclick(newButton, function() { upgrade(this.id); });
	
	newButton.setAttribute("minionType", unitType);
	newButton.setAttribute("upgradeType", upgradeType);
	
	return newButton;
}
function createEnhancementButton(id, parent, unitType, upgradeType, resourceSymbol, referenceList){
	const btn = buttonBase(id, parent, upgradeType, resourceSymbol);
	const newButton = btn.b;
	const lblCost = btn.l;
	
	const divId = "div"+id+"Lvl";
	const lvlDiv = createNewElement("div", divId, newButton, [], null);
	const potency = createNewElement("label", "lbl"+id+"Potency", lvlDiv, ["partialLabel"], "x1");
	const lvl = createNewElement("label", "lbl"+id+"Lvl", lvlDiv, ["partialLabel"], "0");
	createNewElement("label", "lbl"+id+"S", lvlDiv, ["partialLabel"], '/');
	const maxLvl = createNewElement("label", "lbl"+id+"Maxlvl", lvlDiv, ["partialLabel"], "0");
	const perk = createNewElement("Label", "lbl"+id+"Perk", lvlDiv, ["partialLabel"], "0");
	
	referenceList.upgrades.push(new UpgradeIds(upgradeType, newButton, lblCost, lvl, maxLvl, potency, perk));
	addOnclick(newButton, function() { upgrade(this.id); });
	
	addOnclick(newButton, function() { enhance(this.id); });
	newButton.setAttribute("bossType", unitType);
	newButton.setAttribute("upgradeType", upgradeType);
	
	return newButton;
}
function createUnlockButton(parent, unitType, category, resourceSymbol, referenceList){
	const id = "Unlock"+unitType;
	const text = "Unlock "+unitType;
	const btn = buttonBase(id, parent, text, resourceSymbol);
	const newButton = btn.b;
	const lblCost = btn.l;
	
	referenceList.unlocks.push(new UnlockIds(unitType, newButton, lblCost));
	addOnclick(newButton, function() { unlock(this.id); });
	
	newButton.setAttribute("unlockType", unitType);
	newButton.setAttribute("unlockCategory", category);
	
	return newButton;
}
//tier, upgrade, parent, miscUpgrades[upgrade], resourceSymbol, buyButtons
function createTierUpgradeButton(tier, upgrade, parent, text, resourceSymbol, referenceList){
	const id = upgrade;
	const btn = buttonBase(id, parent, text, resourceSymbol);
	const newButton = btn.b;
	const lblCost = btn.l;
	
	referenceList.buttons.push(new MiscButton(id, newButton, lblCost));
	addOnclick(newButton, function() {  buy(this.id, tier); });
	
	newButton.setAttribute("purchaseType", upgrade);
	newButton.setAttribute("tier", tier);
	
	return newButton;
}

function createPrestigeButton(tier, parent, text, resourceSymbol, referenceList){
	const id = "Prestige"+tier;
	const btn = buttonBase(id, parent, text, resourceSymbol);
	const newButton = btn.b;
	const lblCost = btn.l;
	
	const gains = document.getElementById(`divPrestige${tier}Gain`);
	referenceList.push(new PrestigeButton(tier, newButton, lblCost, gains))
	addOnclick(newButton, function() { prestige(this.id); });
	
	return newButton;
}

function createMiscButton(id, parent, text, cost, resourceSymbol){
	const btnId = "btn"+id;
	const divId = "div"+id+"cost";
	const costId = "lbl"+id+"cost";
	
	const newButton = createNewElement("button", btnId, parent, ["upg"], null);
	newButton.cost = cost;
	const costDiv = createNewElement("div", divId, newButton, ["upgCostDiv"], null);
	
	createNewElement("label", btnId+"Type", newButton, ["partialLabel"], text.fixString());
	createNewElement("label", costId, costDiv, ["partialLabel"], cost);
	createNewElement("label", btnId+"Unit", costDiv, ["partialLabel"], resourceSymbol);
	
	return newButton;
}

function createTierUpgrades(){
	createPanelButtons(0, resources.a.symbol, t0Upgrades, "Regroup", resources.b.symbol);
	createPanelButtons(1, resources.b.symbol, t1Upgrades, "Research", resources.c.symbol);
	createPanelButtons(2, resources.c.symbol, t2Upgrades, "Recruit", resources.d.symbol);
	createPanelButtons(3, resources.d.symbol, t3Upgrades, "Restructure", resources.e.symbol);
	createPanelButtons(4, resources.e.symbol, t4Upgrades, null, resources.f.symbol);
	createBossButtons();
}
function createBossButtons(){
	const divBossEnhancements = document.getElementById("divBossEnhancements");
	for(let bossType in baseBoss){
		const upgrades = bossUpgrades[bossType];
		
		const enhanceListId = `div${bossType}EnhanceList`;
		const enhanceList = createNewElement("div", enhanceListId, divBossEnhancements, ["listBlock"], null);
		
		const headerText = bossType;
		createNewElement("div", enhanceListId + "Header", enhanceList, ["listBlockHeader"], headerText);
		
		const upgradeList = new UpgradeList(bossType, enhanceListId, enhanceList);
		
		for(let upgradeType in upgrades){
			const cost = getEnhanceCost(bossType, upgradeType);
			const newId = `Upg${bossType}${upgradeType}`;
			
			createEnhancementButton(newId, enhanceList, bossType, upgradeType, resources.d.symbol, upgradeList)
		}
		t3BossUpgrades.push(upgradeList);
	}
}
function createGaugesTable(){
	const tblGauges = document.getElementById("tblGauges");
	
	//header row.
	const header = tblGauges.createTHead();
	const colHeaderRow = header.insertRow();
	colHeaderRow.insertCell();
	for(let unitType in unitTypes){
		const th = document.createElement("th");
		th.textContent = unitType;
		colHeaderRow.appendChild(th);
		if(unitType == "Boss"){
			th.classList.add("t3");
		}
	}
	
	const onclick = function() { unlock(this.id); }
	for(let gaugeType in gauges){
		//Checkboxes row
		const row = tblGauges.insertRow();
		row.id = "row" + gaugeType;
		
		const th = document.createElement("th");
		th.textContent = gaugeType;
		row.appendChild(th);
		
		for(let unitType in unitTypes){
			const td = document.createElement("td");
			row.appendChild(td);
			if(unitType == "Boss"){
				td.classList.add("t3");
			}
			
			const id = `chk${gaugeType}${unitType}`;
			
			const chk = createNewElement("input", id, td, [], null);
			chk.setAttribute("unitType", unitType);
			chk.setAttribute("gaugeType", gaugeType);
			chk.type = "checkbox";
		}
	}
}

function createAchievement(type, name, parent){
	const id = "divAch"+type
	const div = createNewElement("div", id, parent, ["listBlock", "feat", "t" + achievements[type].unlockT], null);
	
	const lvl = getAchievementLevel(type);
	const next = getAchievementNext(type);
	
	const header = createNewElement("div", id+"Header", div, ["listBlockHeader"], null);
	createNewElement("label", header.id + "Name", header, ["partialLabel"], name.fixString() );
	const level = createNewElement("label", header.id + "Level", header, ["partialLabel", "upgCostDiv"], lvl||"0" );
	createNewElement("label", header.id + "Spacer", header, ["partialLabel", "upgCostDiv"], "-" );
	const maxCount = createNewElement("label", header.id + "MaxCount", header, ["partialLabel", "upgCostDiv"], achievements[type].maxCount||"0" );
	
	const body = createNewElement("div", id+"Body", div, [], null);
	const count = createNewElement("label", body.id + "Current", body, ["partialLabel"], achievements[type].count||"0" );
	createNewElement("label", body.id + "Slash", body, ["partialLabel"], "/" );
	const goal = createNewElement("label", body.id + "Target", body, ["partialLabel"], next );
	
	const footerText = `Perk: ${achievements[type].bonus}`;
	createNewElement("div", id+"Footer", div, [], footerText);
	
	achievementElements.push(new AchievementElement(type, level, maxCount, count, goal))
}
function createAchievemetsTab(){
	const achRoot = document.getElementById("divAchievementTable");
	
	for(let type in achievements){
		createAchievement(type, achievements[type].name, achRoot);
	}
}

//fancy html decode used in populateInfo
const htmlDecode = (function () {
	//create a new html document (not execute script tags in child elements)
	const doc = document.implementation.createHTMLDocument("");
	const element = doc.createElement("div");
	
	function getText(str) {
		element.innerHTML = str;
		str = element.textContent;
		element.textContent = "";
		return str;
	}
	
	function decodeHTMLEntities(str) {
		if (str && typeof str === "string") {
			let x = getText(str);
			while (str !== x) {
				str = x;
				x = getText(x);
			}
			return x;
		}
	}
	return decodeHTMLEntities;
})();
function populateInfo(){
	const divInfo = document.getElementById("divInfo");
	
	const team0DivId = "divInfoTeam0";
	const team0Div = createNewElement("div", team0DivId, divInfo, [], null);
	
	const team1DivId = "divInfoTeam1";
	const team1Div = createNewElement("div", team1DivId, divInfo, [], null);
	
	//fix boss symbol
	for(let bossType in baseBoss) {
		baseBoss[bossType].symbol = htmlDecode(baseBoss[bossType].symbol);
	}
	//fix hero symbol
	for(let heroType in baseHero) {
		baseHero[heroType].symbol = htmlDecode(baseHero[heroType].symbol);
	}
	
	for(let minionType in baseMinion) {
		baseMinion[minionType].symbol = htmlDecode(baseMinion[minionType].symbol);
	}
	
	createInfoTable(team0Div, "Minion", baseMinion);
	createInfoTable(team0Div, "Boss", baseBoss);
	createInfoTable(team1Div, "Tower", baseTower);
	createInfoTable(team1Div, "Hero", baseHero);
	
	const bossTable = document.getElementById("tblBossInfo");
	if(bossTable){bossTable.classList.add("t3");}
}
function createInfoTable(teamDiv, unitType, data){
	const tblUnitGroupId = `tbl${unitType}Info`;
	const tblUnitGroup = createNewElement("table", tblUnitGroupId, teamDiv, ["infoTable"], null );
	
	const headerCell = tblUnitGroup.insertRow().insertCell();
	headerCell.colSpan = 4;
	headerCell.style.fontWeight="bold";
	headerCell.style.textAlign="center";
	headerCell.textContent = `${unitType} Info`;
	
	for(let unit in data){
		const unitRow = tblUnitGroup.insertRow();
		if(unitType == "Minion"){
			unitRow.classList.add("t" + minionResearch[unit].unlockT );
		}
		
		const nameCell = unitRow.insertCell(0);
		nameCell.id = unitType+"_"+unit;
		nameCell.textContent = unit;
		nameCell.setAttribute("unitType", unitType);
		nameCell.setAttribute("unit", unit);
		nameCell.classList.add("pointer");
		addOnclick(nameCell, function(){unitDetails(this.id);})
		
		const colorCell = unitRow.insertCell(1);
		let symbol = htmlDecode(unitTypes[unitType].infoSymbol)
		if(unitTypes[unitType].uniqueSymbol){
			symbol = data[unit].symbol || symbol;
		}
		colorCell.textContent = symbol;
		colorCell.style.color = data[unit].color;
		colorCell.style.backgroundColor = data[unit].color2 || "#000";
		colorCell.style.fontWeight = "bold";
		colorCell.classList.add("cbh");
		
		const imageCell = unitRow.insertCell(2);
		const url = `./Images/${unit}.png`;
		const imgId = `img${unit}`
		let img = createNewElement("img", imgId, imageCell, ["unitImg"], null );
		img.src = url;
		img.alt = unit + " Image";
		
		const descCell = unitRow.insertCell(3);
		descCell.textContent = data[unit].info;
	}
	
}
function unitDetails(id){
	const input = document.getElementById(id)
	const unitType = input.getAttribute("unitType");
	const unit = input.getAttribute("unit");
	toggleUIElementByID("infoModal", false);
	
	setElementTextById("infoModalHeader", `${unitType}: ${unit}`, true);
	let stats = [];
	switch(unitType){
		case "Minion":{
			stats = getMinionUpgradedStats(unit);
			break;
		}
		case "Boss":{
			stats = getBossUpgradedStats(unit);
			break;
		}
		case "Tower":{
			stats = getTowerUpgradedStats(unit);
			break;
		}
		case "Hero":{
			stats = getHeroUpgradedStats(unit);
			break;
		}
		default:{
			console.warn("unkown unit type:" + unitType);
			break;
		}
	}
	const tbl = document.getElementById("tblInfoBody");
	clearChildren(tbl);
	
	for(let i=0;i<stats.length;i++){
		if(isNaN(stats[i].base) || stats[i]==0){continue;}
		if(stats[i].stat !== statTypes.health && stats[i].stat !== statTypes.damage && stats[i].prod === 1){continue;}
		
		const op = stats[i].stat === statTypes.minionsPerDeploy?"x":"^";
		const tr = createNewElement("tr", "infoRow"+i, tbl, []);
		
		const s = createNewElement("td", "statRow"+i, tr, [], stats[i].stat.fixString());
		const v = createNewElement("td", "prodRow"+i, tr, [], stats[i].prod);
		s.title = statDescription[stats[i].stat];
		v.title = `Base:${stats[i].base}  Scale:${stats[i].mult}  Upgrades:${stats[i].upg}`;
	}
}

initialize_components();