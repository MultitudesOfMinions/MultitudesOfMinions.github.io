"use strict";
function createNewElement(type, id, parent, cssClasses, textContent){
	if(!parent){
		console.error("parent is null for " + id);
		return;
	}
	let e = document.getElementById(id);
	if(e){
		if(textContent){ setElementText(id, textContent); }
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
function addOnclick(id, onclick){
	const e = document.getElementById(id);
	if(e == null){
		console.error(id + " element not found");
		return;
	}
	
	if(onclick){
		e.onclick = onclick;
	}
}

function initialize_components(){
	window.addEventListener("beforeunload", (event) => {
		if(cookiesEnabled){
			saveData();
		}
	});
	
	initialSize();
	populateInfo();

	createT0Upgrades();
	createT1Upgrades();
	createT2Upgrades();
	createT3Upgrades();
	createGaugesTable();
	createBossTab();
	createAchievemetsTab();
	loadData();

	createMinionSpawns();
	
	start(defaultInterval);
	buildWorld();
	
	updateT0Upgrades();
	updateT1Upgrades();
	updateT2Upgrades();
	updateT3Upgrades();
	toggleTierItems();
	
	resetInputs();
	
	setColorblind();
}
function initialSize(){
		//Resize panels
	const pnl0 = document.getElementById("pnl0");
	const pnl1 = document.getElementById("pnl1");
	
	const a = Math.max(document.documentElement.clientWidth);
	const b = Math.max(document.documentElement.clientHeight)*2.4;
	const maxD = Math.min(a, b) - 10;
	gameW = maxD;
	gameH = maxD/6;
	halfH = gameH>>1;
	leaderPoint = gameW * 2 / 5;
	pathL = (gameW>>6);
	pathW = (gameH>>4);
	langoliers = pathL*-2;
	
	const drawArea = document.getElementById("canvasArea");
	drawArea.style.width = gameW;
	drawArea.style.height = gameH;
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext("2d");

	pnl0.style.height = gameH;
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
	
	//Build path
	path[0] = new point(-(pathL*2), halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + (pathL*2)){
		addPathPoint(true);
	}

	initialMinions()
	initialTowers();
	
	levelStartX = getEndOfLevelX(level - 1);
	levelEndX = getEndOfLevelX(level);

	addHero();
}

function initialMinions(){
	if(!achievements.prestige0.count && !resources.a.amt){
		addMinionQ.push("Mite");
		minionResearch.Mite.lastSpawn = getMinionBaseStats("Mite").spawnDelay / 2;
	}
	else{
		for(let minion in minionUpgrades){
			let minions = minionUpgrades[minion].initialMinions;
			for(let i=0;i<minions;i++){
				addMinionQ.push(minion);
			}
		}
	}
}
function initialTowers(){
		addTower();
	while(towers[towers.length-1].Location.x < getLevelSpan())
	{
		addTower();
	}
}

function createMinionSpawns(){
	const spawnPool = document.getElementById("divSpawnPool");

	for(let minionType in minionResearch){
		const id="div{0}Spawn".format(minionType);
		const spawnRow = createNewElement("div", id, spawnPool, [], null);
		
		const chk = createNewElement("input", "chkSpawn{0}".format(minionType), spawnRow, [], null);
		chk.type = "checkbox";
		chk.checked = minionResearch[minionType].isUnlocked;
		
		const bg = createNewElement("div", id+"Back", spawnRow, ["progressBackground"], null);
		
		createNewElement("div", id+"Progress", bg, ["progressBar"], null);
		setElementText(id+"Progress", minionType);
	}
}

function createBossTab(){
	const bossSelect = document.getElementById("ulBossSelectList");
	const bossActive = document.getElementById("divActiveData");
	
	const baseUnlockCost = unlockBossCost();
	for(let bossType in baseBoss){
		//select
		const li = createNewElement("li", "li"+bossType, bossSelect, [], null)
		const rdoId = "select{0}".format(bossType);
		const rdo = createNewElement("input", rdoId, li, [], null);
		rdo.type = "radio";
		rdo.name = "bossSelect";
		rdo.value = bossType;
		const label = createNewElement("label", rdoId+"Label", li, [], bossType+" ");
		label.for = rdoId;
		
		const divSpawnBack = createNewElement("div", "div{0}SpawnBackground".format(bossType), li, ["progressBackground"], null);
		createNewElement("div", "div{0}SpawnProgress".format(bossType), divSpawnBack, ["progressBar"], null);
		
	}
}

function createT0Upgrades(){
	const t0UpgradeTable = document.getElementById("divMinionT0UpgradeTable");
	const t0Upgrades = minionUpgradeTypes[0];
	
	const divPrestige = document.getElementById("divPrestige0");
	const newButton = createNewElement("button", "btnPrestige0", divPrestige, ["upg"], null);
	newButton.setAttribute("purchaseType", "Prestige0");
	addOnclick("btnPrestige0", function() { buy(this.id); });

	for(let minionType in baseMinion)
	{
		const t0UpgradeListId = "div{0}T0UpgradeList".format(minionType);
		const t0UpgradeList = createNewElement("div", t0UpgradeListId, t0UpgradeTable, ["listBlock"], null);
		
		const headerText = "{0} Equipment".format(minionType);
		createNewElement("div", t0UpgradeListId + "Header", t0UpgradeList, ["listBlockHeader"], headerText);

		for(let i=0;i<t0Upgrades.length; i++){
			const upgradeType = t0Upgrades[i]
			const cost = getUpgradeCost(minionType, upgradeType);
			const newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			const text = "{0} ({1}{2})".format(upgradeType,cost,resources.a.symbol);
			
			const newButton = createNewElement("button", newId, t0UpgradeList, ["upg"], text);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);

			const onclick = function() { upgrade(this.id); }
			addOnclick(newId, onclick);
		}
	}
}
function createT1Upgrades(){
	const t1UpgradeTable = document.getElementById("divMinionT1UpgradeTable");
	const divMiscT1Upgrades = document.getElementById("divMiscT1Upgrades");
	const t1Upgrades = minionUpgradeTypes[1];

	const divPrestige = document.getElementById("divPrestige1");
	const newButton = createNewElement("button", "btnPrestige1", divPrestige, ["upg"], null);
	newButton.setAttribute("purchaseType", "Prestige1");
	addOnclick("btnPrestige1", function() { buy(this.id); });
	
	for(let minionType in minionResearch)
	{

		if(minionResearch[minionType].unlockT == 1){
			//Create unlock button
			const newBtnId = "btnUnlock{0}".format(minionType);
			const cost = unlockMinionCost(minionType);
			const unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.b.symbol);

			const newButton = createNewElement("button", newBtnId, divMiscT1Upgrades, ["upg"], unlockText);
			newButton.setAttribute("unlockType", minionType);
			newButton.setAttribute("unlockCategory", "Minion");
		
			const onclick = function() { unlock(this.id); }
			addOnclick(newBtnId, onclick);
		}

		//Creat other upgrade buttons
		const t1UpgradeListId = "div{0}T1UpgradeList".format(minionType);
		const t1UpgradeList = createNewElement("div", t1UpgradeListId, t1UpgradeTable, ["listBlock"], null);
		
		const headerText = "{0} Training".format(minionType);
		createNewElement("div", t1UpgradeListId + "Header", t1UpgradeList, ["listBlockHeader"], headerText);

		for(let i=0;i<t1Upgrades.length; i++){
			const upgradeType = t1Upgrades[i]
			const cost = getUpgradeCost(minionType, upgradeType);
			const newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			const text = "{0} ({1}{2})".format(upgradeType,cost,resources.b.symbol);
			const onclick = function() { upgrade(this.id); }
			
			const newButton = createNewElement("button", newId, t1UpgradeList, ["upg"], text);
			addOnclick(newId, onclick);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
	}

	const maxMinionsCost = getMaxMinionCost();
	const maxMinionsText = "Max Minions++ ({0}{1})".format(maxMinionsCost, resources.b.symbol);
	const maxMinionsBtn = createNewElement("button", "btnBuyMaxMinions", divMiscT1Upgrades, ["upg"], maxMinionsText);
	maxMinionsBtn.setAttribute("purchaseType", "MaxMinions");

	const onclick = function() { buy(this.id); }
	addOnclick("btnBuyMaxMinions", onclick);
	
	const t0UpgradePotencyCost = getPotencyCost(0);
	const t0UpgradePotencyText = "Armory Effectiveness ({0}{1})".format(t0UpgradePotencyCost, resources.b.symbol);
	const t0UpgradePotency = createNewElement("button", "btnBuyT0UpgradePotency", divMiscT1Upgrades, ["upg"], t0UpgradePotencyText)
	t0UpgradePotency.setAttribute("purchaseType", "T0UpgradePotency");

	addOnclick("btnBuyT0UpgradePotency", onclick);
	
	//put misc upgrades at the end.
	divMiscT1Upgrades.parentNode.appendChild(divMiscT1Upgrades);
	
}
function createT2Upgrades(){
	const t2UpgradeTable = document.getElementById("divMinionT2UpgradeTable");
	const divMiscT2Upgrades = document.getElementById("divMiscT2Upgrades");
	const t2Upgrades = minionUpgradeTypes[2];
	
	const divPrestige = document.getElementById("divPrestige2");
	const newButton = createNewElement("button", "btnPrestige2", divPrestige, ["upg"], null);
	newButton.setAttribute("purchaseType", "Prestige2");
	addOnclick("btnPrestige2", function() { buy(this.id); });

	for(let minionType in minionResearch)
	{
		if(minionResearch[minionType].unlockT == 2){
			//Create unlock button
			const newBtnId = "btnUnlock{0}".format(minionType);
			const cost = unlockMinionCost(minionType);
			const unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.c.symbol);

			const newButton = createNewElement("button", newBtnId, divMiscT2Upgrades, ["upg"], unlockText);
			newButton.setAttribute("unlockType", minionType);
			newButton.setAttribute("unlockCategory", "Minion");

			const onclick = function() { unlock(this.id); }
			addOnclick(newBtnId, onclick);
		}
		
		const t2UpgradeListId = "div{0}T2UpgradeList".format(minionType);
		const t2UpgradeList = createNewElement("div", t2UpgradeListId, t2UpgradeTable, ["listBlock"], null);
		
		const headerText = "{0} Experiments".format(minionType);
		createNewElement("div", t2UpgradeListId + "Header", t2UpgradeList, ["listBlockHeader"], headerText);
		
		for(let i=0;i<t2Upgrades.length; i++){
			const upgradeType = t2Upgrades[i]
			const cost = getUpgradeCost(minionType, upgradeType);
			const newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			const text = "{0} ({1}{2})".format(upgradeType,cost,resources.c.symbol);
			const onclick = function() { upgrade(this.id); }
			
			const newButton = createNewElement("button", newId, t2UpgradeList, ["upg"], "Ascend");
			addOnclick(newId, onclick);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
	}
	
	const onclick = function() { buy(this.id); }
	const t1UpgradePotencyCost = getPotencyCost(1);
	const t1UpgradePotencyText = "Gym Effectiveness ({0}{1})".format(t1UpgradePotencyCost, resources.c.symbol);
	const t1UpgradePotency = createNewElement("button", "btnBuyT1UpgradePotency", divMiscT2Upgrades, [], t1UpgradePotencyText)
	t1UpgradePotency.setAttribute("purchaseType", "T1UpgradePotency");
	addOnclick("btnBuyT1UpgradePotency", onclick);
	
	const maxUpgradeLevelCost = getMaxUpgradeLevelCost();
	const maxUpgradeLevelText = "Upgrade Limit++ ({0}{1})".format(maxUpgradeLevelCost, resources.c.symbol);
	const maxUpgradeLevelBtn = createNewElement("button", "btnBuyMaxUpgradeLevel", divMiscT2Upgrades, [], maxUpgradeLevelText);
	maxUpgradeLevelBtn.setAttribute("purchaseType", "BuyMaxUpgradeLevel");
	addOnclick("btnBuyMaxUpgradeLevel", onclick);
	
	const globalSpawnDelayCost = getGlobalSpawnDelayReductionCost();
	const globalSpawnDelayText = "Reduce Deploy Time ({0}{1})".format(globalSpawnDelayCost, resources.c.symbol);
	const globalSpawnDelay = createNewElement("button", "btnBuyGlobalSpawnDelay", divMiscT2Upgrades, [], globalSpawnDelayText);
	globalSpawnDelay.setAttribute("purchaseType", "BuyGlobalSpawnDelay");
	addOnclick("btnBuyGlobalSpawnDelay", onclick);

	
	//put misc upgrades at the end.
	divMiscT2Upgrades.parentNode.appendChild(divMiscT2Upgrades);
}
function createT3Upgrades(){
	
	const onclick = function() { buy(this.id); }
	const t2UpgradePotencyCost = getPotencyCost(2);
	const t2UpgradePotencyText = "Lab Effectiveness ({0}{1})".format(t2UpgradePotencyCost, resources.d.symbol);
	const t2UpgradePotency = createNewElement("button", "btnBuyT2UpgradePotency", divMiscT3Upgrades, [], t2UpgradePotencyText)
	t2UpgradePotency.setAttribute("purchaseType", "T2UpgradePotency");
	addOnclick("btnBuyT1UpgradePotency", onclick);
	
	const divPrestige = document.getElementById("divPrestige3");
	const newButton = createNewElement("button", "btnPrestige3", divPrestige, ["upg"], null);
	newButton.setAttribute("purchaseType", "Prestige3");
	addOnclick("btnPrestige3", function() { buy(this.id); });

	
	const bossUnlock = document.getElementById("divMiscT3Upgrades");
	const baseUnlockCost = unlockBossCost();
	for(let bossType in baseBoss){
		//unlock
		const cost = baseUnlockCost + baseBoss[bossType].unlockCost;
		const unlockId = "btnUnlock{0}".format(bossType);
		const unlockText = "Unlock {0} ({1}{2})".format(bossType, cost, resources.c.symbol);
		
		const newButton = createNewElement("button", unlockId, bossUnlock, ["upg"], unlockText);
		newButton.setAttribute("unlockType", bossType);
		newButton.setAttribute("unlockCategory", "Boss");
		
		const onclick = function() {unlock(this.id);}
		addOnclick(unlockId, onclick);
	}
	
	const divBossEnhancements = document.getElementById("divBossEnhancements");
	for(let bossType in baseBoss){
		const upgrades = bossUpgrades[bossType];
		
		const enhanceListId = "div{0}EnhanceList".format(bossType);
		const enhanceList = createNewElement("div", enhanceListId, divBossEnhancements, ["listBlock"], null);

		const headerText = "{0} Enhancements".format(bossType);
		createNewElement("div", enhanceListId + "Header", enhanceList, ["listBlockHeader"], headerText);
		
		for(let upgradeType in upgrades){
			const cost = getEnhanceCost(bossType, upgradeType);
			const newId = "btnUpg{0}{1}".format(bossType, upgradeType);
			const text = "{0} ({1}{2})".format(upgradeType,cost,resources.d.symbol);
			const onclick = function() { enhance(this.id); }
			
			const newButton = createNewElement("button", newId, enhanceList, [], text);
			addOnclick(newId, onclick);
			newButton.setAttribute("bossType", bossType);
			newButton.setAttribute("upgradeType", upgradeType);
			
		}
	}

	const t3MinionUpgrades = document.getElementById("divT3MinionUpgrades");
	const t3Upgrades = minionUpgradeTypes[3];

	for(let minionType in baseMinion){
		for(let i=0;i<t3Upgrades.length; i++){
			const upgradeType = t3Upgrades[i];
			const cost = getUpgradeCost(minionType, upgradeType);
			const newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			const text = "{0}({2}{3})".format(minionType, cost,resources.d.symbol);
			const onclick = function() { upgrade(this.id); }
			
			const newButton = createNewElement("button", newId, t3MinionUpgrades, ["upg"], text);
			addOnclick(newId, onclick);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
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
	
	for(let gaugeType in gauges){
		//Unlock row
		const rowUnlock = tblGauges.insertRow();
		rowUnlock.id = "rowUnlock" + gaugeType;
		
		const thUnlock = document.createElement("th");
		thUnlock.textContent = gaugeType;
		rowUnlock.appendChild(thUnlock);

		const td = rowUnlock.insertCell();
		td.colSpan = 4;
		
		const newBtnId = "btnUnlock" + gaugeType;
		const unlockText = "Unlock ({0}{1})".format(gauges[gaugeType].cost, resources.b.symbol);
		const newButton = createNewElement("button", newBtnId, td, ["upg"], unlockText);
		newButton.setAttribute("unlockType", gaugeType);
		newButton.setAttribute("unlockCategory", "Gauge");

		const onclick = function() { unlock(this.id); }
		addOnclick(newBtnId, onclick);
		
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
			
			const id = "chk{0}{1}".format(gaugeType, unitType);
			
			const chk = createNewElement("input", id, td, [], null);
			chk.setAttribute("unitType", unitType);
			chk.setAttribute("gaugeType", gaugeType);
			chk.type = "checkbox";
		}
	}
}

function createAchievemetsTab(){
	const achRoot = document.getElementById("divAchievementTable");
	
	for(let type in achievements){
		const id = "divAch"+type
		const div = createNewElement("div", id, achRoot, ["listBlock", "t" + achievements[type].unlockT], null);
		
		const lvl = getAchievementLevel(type);
		const next = getAchievementNext(type);
		const headerText = "{0} : {1}".format(achievements[type].name, lvl);
		createNewElement("div", id+"Header", div, ["listBlockHeader"], headerText);
		const bodyText = "{0}/{1}".format(achievements[type].count, next);
		createNewElement("div", id+"Body", div, [], bodyText);
		
		const footerText = "Perk: {0}".format(achievements[type].bonus);
		createNewElement("div", id+"Footer", div, [], footerText);
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
	const tblUnitGroupId = "tbl{0}Info".format(unitType);
	const tblUnitGroup = createNewElement("table", tblUnitGroupId, teamDiv, ["infoTable"], null );
	
	const headerCell = tblUnitGroup.insertRow().insertCell();
	headerCell.colSpan = 3;
	headerCell.style.fontWeight="bold";
	headerCell.style.textAlign="center";
	headerCell.textContent = "{0} Info".format(unitType);
	
	for(let unit in data){
		const unitRow = tblUnitGroup.insertRow();
		if(unitType == "Minion" && unit != "Mite"){
			unitRow.classList.add("t" + minionResearch[unit].unlockT );
		}
		
		const nameCell = unitRow.insertCell(0);
		nameCell.id = unitType+"_"+unit;
		nameCell.textContent = unit;
		nameCell.setAttribute("unitType", unitType);
		nameCell.setAttribute("unit", unit);
		nameCell.classList.add("pointer");
		addOnclick(nameCell.id, function(){unitDetails(this.id);})

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
		
		const descCell = unitRow.insertCell(2);
		descCell.textContent = data[unit].info;
	}

}
function unitDetails(id){
	const input = document.getElementById(id)
	const unitType = input.getAttribute("unitType");
	const unit = input.getAttribute("unit");
	const modal = document.getElementById("infoModal");
	modal.style.display="block";

	document.getElementById("infoModalHeader").textContent = unitType+": " +unit;
	let stats = [];
	let bonus = "-";
	switch(unitType){
		case "Minion":
			stats = getMinionUpgradedStats(unit);
			break;
		case "Boss":
			stats = getBossUpgradedStats(unit);
			bonus = getBossBoost();
			break;
		case "Tower":
			stats = getTowerUpgradedStats(unit);
			break;
		case "Hero":
			stats = getHeroUpgradedStats(unit);
			break;
		default:
			console.warn("unkown unit type:" + unitType);
			break;
	}
	const tbl = document.getElementById("tblInfoBody");
	while( tbl.firstChild ){ tbl.removeChild( tbl.firstChild ); }

	for(let i=0;i<stats.length;i++){
		const tr = document.createElement("tr");
		
		const tdStat = document.createElement("td");
		const tdBase = document.createElement("td");
		const tdMult = document.createElement("td");
		const tdUpg = document.createElement("td");
		const tdBonus = document.createElement("td");
		const tdProd = document.createElement("td");
		tdStat.textContent = stats[i].stat.fixString();
		tdBase.textContent = stats[i].base;
		tdMult.textContent = stats[i].mult;
		tdUpg.textContent = stats[i].upg;
		tdBonus.textContent = stats[i].bonus || "-";
		tdProd.textContent = stats[i].prod;
		
		tr.appendChild(tdStat);
		tr.appendChild(tdBase);
		tr.appendChild(tdMult);
		tr.appendChild(tdUpg);
		tr.appendChild(tdBonus);
		tr.appendChild(tdProd);
		
		tbl.appendChild(tr);
	}
}

initialize_components();
