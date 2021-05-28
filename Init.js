"use strict";
function createNewElement(type, id, parent, cssClasses, textContent){
	if(!parent){
		throw "parent is null for " + id;
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
  	window.addEventListener("beforeunload", (event) => {
  		if(cookiesEnabled){
  			saveData();
  		}
  	});
  	
  	initialSize();
  	populateInfo();
  
    populateResourceNames();
  	createTierUpgrades();
  	createGaugesTable();
  	createBossTab();
  	createStoreStock();
  	createAchievemetsTab();
  	
  	resetInputs();
    loadCookieData();
  
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
  	}

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
	const a = Math.max(document.documentElement.clientWidth);
	const b = Math.max(document.documentElement.clientHeight)*2.4;
	const maxD = Math.min(a, b) - 10;
	gameW = maxD;
	gameH = maxD/4;
	halfH = gameH/2;
	leaderPoint = gameW * 2 / 5;
	pathL = (gameW>>6);
	pathW = (gameH>>2);
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
		addTower();
	while(towers[towers.length-1].Location.x < getLevelSpan())
	{
		addTower();
	}
}

function createMinionSpawns(){
	const spawnPool = document.getElementById("divSpawnPool");

	for(let minionType in minionResearch){
		const baseId="div{0}Spawn".format(minionType);
		const chkId = "chkSpawn{0}".format(minionType)
		const progressId = baseId+"Progress";
		
		const base = createNewElement("div", baseId, spawnPool, [], null);
		
		const chk = createNewElement("input", chkId, base, [], null);
		chk.type = "checkbox";
		chk.checked = minionResearch[minionType].isUnlocked;
		
		const bg = createNewElement("div", baseId+"Back", base, ["progressBackground"], null);
		bg.style.backgroundColor = "#777"
		
		const progress = createNewElement("div", progressId, bg, ["progressBar"], null);
		progress.style.backgroundColor = baseMinion[minionType].color;
		progress.style.color = baseMinion[minionType].color2 || "#000";

    const pText = '['+minionResearch[minionType].hotkey +']'+minionType;
		setElementText(progress, pText, false);
		
		minionSpawns[minionType] = new MinionSpawnChildren(base, chk, progress);
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
		const divProgress = createNewElement("div", "div{0}SpawnProgress".format(bossType), divSpawnBack, ["progressBar"], null);
		
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
  
  const exchangeScale = 20;
  const value = exchangeScale**resources.f.value / exchangeScale**r.value;
  const parent = document.getElementById("divExchange")
  const text = value+" "+r.name;
  const id = "Exchange"+r.name;
  
  const btn = createMiscButton(id, parent, text, 1, resources.f.symbol)
  setButtonAffordableClass(btn, true);
}

function createStoreButton(id, text, parent){
  const btn = createNewElement("button", "btnStore"+id, parent, ["storeButton"], text);
  const url = "./Images/"+id+".png";
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
		const upgradeListId = "div{0}T{1}UpgradeList".format(minionType, tier);
		const newUpgradeList = createNewElement("div", upgradeListId, parentTable, ["listBlock"], null);
		const upgradeList = new UpgradeList(minionType, upgradeListId, newUpgradeList);

		const headerText = minionType;
		createNewElement("div", upgradeListId + "Header", newUpgradeList, ["listBlockHeader"], headerText);

		for(let i in upgrades){
		  const upgradeType = upgrades[i];
			const newId = "Upg{0}{1}".format(minionType, upgradeType);

			const newButton = createTierButton(tier, newId, newUpgradeList, upgradeType, resourceSymbol, 0, upgradeList);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
		tierList.push(upgradeList);
	}

}
function createUnlocks(tier, parent, resourceSymbol){
  
  const unlockList = new UnlockList(tier);
	for(let minionType in minionResearch)
	{
		if(minionResearch[minionType].unlockT == tier){
			//Create unlock button
			const newId = "Unlock{0}".format(minionType);

			const newButton = createTierButton(tier, newId, parent, "Unlock "+minionType, resourceSymbol, 1, unlockList);
			newButton.setAttribute("unlockType", minionType);
			newButton.setAttribute("unlockCategory", "Minion");
		}
  }
  if(tier === 3){
    for(let bossType in bossResearch){
			const newId = "Unlock{0}".format(bossType);

			const newButton = createTierButton(tier, newId, parent, "Unlock "+bossType, resourceSymbol, 1, unlockList);
			newButton.setAttribute("unlockType", bossType);
			newButton.setAttribute("unlockCategory", "Boss");
    }
  }
  
  unlockButtons.push(unlockList);
}
function createMiscBuy(tier, parent, resourceSymbol){
  //misc tier buttons
  const buyButtons = new TierMiscButtons(tier);
  const miscUpgrades = tierMisc["t"+tier].miscUpgrades;

  for(let upgrade in miscUpgrades){
			const newButton = createTierButton(tier, upgrade, parent, miscUpgrades[upgrade], resourceSymbol, 2, buyButtons);
			newButton.setAttribute("purchaseType", upgrade);
			newButton.setAttribute("tier", tier);
  }
  miscTierButtons.push(buyButtons)
}
function createPrestige(tier, text, costSymbol, gainsSymbol){
	const divPrestige = document.getElementById("divPrestige"+tier);
	const newButton = createTierButton(tier, "Prestige"+tier, divPrestige, text, costSymbol, 3, prestigeButtons);
	newButton.setAttribute("tier", tier);
	
	const prestigeGainsSymbol = getUIElement("divPrestige{0}GainSymbol".format(tier));
	setElementText(prestigeGainsSymbol, gainsSymbol, false);
}

function createPanelButtons(tier, costsSymbol, upgradesList, prestigeText, prestigeGainsSymbol){
	const upgradeTable = document.getElementById("divMinionT{0}UpgradeTable".format(tier));
	if(upgradeTable !== null){
	  createUpgrades(tier, upgradeTable, upgradesList, costsSymbol);
	}
	
	const unlockTable = document.getElementById("divMiscT{0}Upgrades".format(tier));
	createUnlocks(tier, unlockTable, costsSymbol);
	createMiscBuy(tier, unlockTable, costsSymbol);
	
	if(prestigeText){
	  createPrestige(tier, prestigeText, costsSymbol, prestigeGainsSymbol);
	}
	
	//put misc upgrades at the end.
	unlockTable.parentNode.appendChild(unlockTable);
}

//dirty hackish type: 0=upgrade, 1=unlock, 2=misc buy, 3=prestige
function createTierButton(tier, id, parent, text, resourceSymbol, buttonType, referenceList){
  const btnId = "btn"+id;
  const divId = "div"+id+"cost";
  const costId = "lbl"+id+"cost";

  const newButton = createNewElement("button", btnId, parent, ["upg"], null);
	const costDiv = createNewElement("div", divId, newButton, ["upgCostDiv"], null);

	createNewElement("label", btnId+"Type", newButton, ["partialLabel"], text.fixString());
	const lblCost = createNewElement("label", costId, costDiv, ["partialLabel"], '-');
	createNewElement("label", btnId+"Unit", costDiv, ["partialLabel"], resourceSymbol);

	if(buttonType === 0){
	  referenceList.upgrades.push(new UpgradeIds(text, newButton, lblCost));
    addOnclick(newButton, function() { upgrade(this.id); });
	}
	else if(buttonType === 1){
	  const unit = text.replace("Unlock ", "");
	  referenceList.unlocks.push(new UpgradeIds(unit, newButton, lblCost));
    addOnclick(newButton, function() { unlock(this.id); });
	}
	else if(buttonType === 2){
	  referenceList.buttons.push(new MiscButton(newButton, lblCost));
    addOnclick(newButton, function() { buy(this.id, tier); });
	}
	else if(buttonType === 3){
	  const gains = document.getElementById("divPrestige{0}Gain".format(tier));
	  referenceList.push(new PrestigeButton(tier, newButton, lblCost, gains))
    addOnclick(newButton, function() { prestige(this.id); });
	}

  return newButton
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
		
		const enhanceListId = "div{0}EnhanceList".format(bossType);
		const enhanceList = createNewElement("div", enhanceListId, divBossEnhancements, ["listBlock"], null);

		const headerText = "{0} Enhancements".format(bossType);
		createNewElement("div", enhanceListId + "Header", enhanceList, ["listBlockHeader"], headerText);
		
		const upgradeList = new UpgradeList(bossType, enhanceListId, enhanceList);
		
		for(let upgradeType in upgrades){
			const cost = getEnhanceCost(bossType, upgradeType);
			const newId = "Upg{0}{1}".format(bossType, upgradeType);
			const onclick = function() { enhance(this.id); }
			
			const newButton = createTierButton(3, newId, enhanceList, upgradeType, resources.d.symbol, 0, upgradeList);
			addOnclick(newButton, onclick);
			newButton.setAttribute("bossType", bossType);
			newButton.setAttribute("upgradeType", upgradeType);
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
		//Unlock row
//		const rowUnlock = tblGauges.insertRow();
//		rowUnlock.id = "rowUnlock" + gaugeType;
		
//		const thUnlock = document.createElement("th");
//		thUnlock.textContent = gaugeType;
//		rowUnlock.appendChild(thUnlock);

//		const td = rowUnlock.insertCell();
//		td.colSpan = 4;
		
//		const newBtnId = "Unlock" + gaugeType;

//		const newButton = createMiscButton(newBtnId, td, "Unlock", 1, resources.b.symbol);
//		newButton.setAttribute("unlockType", gaugeType);
//		newButton.setAttribute("unlockCategory", "Gauge");
		
//		addOnclick(newButton, onclick);
		
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

function createAchievement(type, name, parent){
		const id = "divAch"+type
		const div = createNewElement("div", id, parent, ["listBlock", "t" + achievements[type].unlockT], null);
		
		const lvl = getAchievementLevel(type);
		const next = getAchievementNext(type);

		const header = createNewElement("div", id+"Header", div, ["listBlockHeader"], null);
		createNewElement("label", header.id + "Name", header, ["partialLabel"], name.fixString() );
		const level = createNewElement("label", header.id + "Level", header, ["partialLabel", "upgCostDiv"], lvl||"0" );

		const body = createNewElement("div", id+"Body", div, [], null);
		const count = createNewElement("label", body.id + "Current", body, ["partialLabel"], achievements[type].count||"0" );
		createNewElement("label", body.id + "Slash", body, ["partialLabel"], "/" );
		const goal = createNewElement("label", body.id + "Target", body, ["partialLabel"], next );
		
		const footerText = "Perk: {0}".format(achievements[type].bonus);
		createNewElement("div", id+"Footer", div, [], footerText);
		
		achievementElements.push(new AcheivementElement(type, level, count, goal))
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

  setElementTextById("infoModalHeader", unitType +": " + unit, true);
  if(unitType == "Boss"){
    setElementTextById("infoFormula", "(base + items) * (upgrade mult ^ upgrade lvl) * achievement bonus = product");
  }
  else{
    setElementTextById("infoFormula", "(base + items) * (upgrade mult ^ upgrade lvl) = product");
  }
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
	clearChildren(tbl);

	const head = document.getElementById("tblInfoHead");
	clearChildren(head);

  //TODO: Build headers
		const th = createNewElement("tr", "infoHeader", head, []);
		
		createNewElement("th", "statHeader", th, [], "Stat");
		createNewElement("th", "baseHeader", th, [], "Base");
		createNewElement("th", "multHeader", th, [], "Mult");
		createNewElement("th", "upgHeader", th, [], "Lvl");
		if(unitType == "Boss"){
		  createNewElement("th", "bonusHeader", th, [], "Bonus");
		}
		createNewElement("th", "prodHeader", th, [], "Prod");

	for(let i=0;i<stats.length;i++){
	  if(isNaN(stats[i].base) || stats[i]==0){continue;}
	  
		const tr = createNewElement("tr", "infoRow"+i, tbl, []);

		createNewElement("td", "statRow"+i, tr, [], stats[i].stat.fixString());
		createNewElement("td", "baseRow"+i, tr, [], stats[i].base);
		createNewElement("td", "multRow"+i, tr, [], stats[i].mult);
		createNewElement("td", "upgRow"+i, tr, [], stats[i].upg);
		if(unitType == "Boss"){
		  createNewElement("td", "bonusRow"+i, tr, [], getBossBoost(stats[i].stat));
		}
		createNewElement("td", "prodRow"+i, tr, [], stats[i].prod);
	}
}

initialize_components();
