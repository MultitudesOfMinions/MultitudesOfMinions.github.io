"use strict";
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
  	  document.getElementById("introModal").style.display="Block";
  	}
  	window.addEventListener("beforeunload", (event) => {
  		if(cookiesEnabled && mainCycle>0 && autoSave()){
  			saveData();
  		}
  	});


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
	const a = Math.max(window.innerHight||0, document.body.clientWidth||0);
	const b = Math.max(window.innerWidth||0, document.body.clientHeight||0)*2.4;
	const maxD = Math.min(a, b) - 10;
	gameW = maxD;
	gameH = maxD/4;
	langoliers = -(gameW>>3);
	halfH = gameH/2;
	leaderPoint = gameW * 2 / 5;
	pathL = (gameW>>6);
	pathW = (gameH>>2);

	const drawArea = document.getElementById("canvasArea");
	drawArea.style.width = gameW;
	drawArea.style.height = gameH;
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext("2d");

	pnl0.style.height = gameH+"px";
	pnl1.style.top = (gameH+5) +"px";
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

	addHero();
}
function buildPath(){
	path[0] = new point(-(pathL*2), halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + (pathL*2)){
		addPathPoint(true);
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
		const li = createNewElement("li", "li"+bossType, bossSelect, ["bossListItem"], null)
		
		const divSpawnBack = createNewElement("div", "div{0}SpawnBackground".format(bossType), li, ["progressBackground", "bossProgressBackground"], null);
		const divProgress = createNewElement("div", "div{0}SpawnProgress".format(bossType), divSpawnBack, ["progressBar"], null);
		
		const rdoId = "select{0}".format(bossType);
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
  const value = exchangeScale**resources.f.value / exchangeScale**r.value;
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
	
	const prestigeGainsSymbol = getUIElement("divPrestige{0}GainSymbol".format(tier));
	setElementText(prestigeGainsSymbol, gainsSymbol, false);
}

function createPanelButtons(tier, costsSymbol, upgradesList, prestigeText, prestigeGainsSymbol){
	const upgradeTable = document.getElementById("divMinionT{0}UpgradeTable".format(tier));
	if(upgradeTable !== null){
	  createUpgrades(tier, upgradeTable, upgradesList, costsSymbol);
	}
	
	const unlockTable = document.getElementById("divMiscT{0}Upgrades".format(tier));
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
  
  const gains = document.getElementById("divPrestige{0}Gain".format(tier));
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
		
		const enhanceListId = "div{0}EnhanceList".format(bossType);
		const enhanceList = createNewElement("div", enhanceListId, divBossEnhancements, ["listBlock"], null);

		const headerText = "{0}".format(bossType);
		createNewElement("div", enhanceListId + "Header", enhanceList, ["listBlockHeader"], headerText);
		
		const upgradeList = new UpgradeList(bossType, enhanceListId, enhanceList);
		
		for(let upgradeType in upgrades){
			const cost = getEnhanceCost(bossType, upgradeType);
			const newId = "Upg{0}{1}".format(bossType, upgradeType);
			
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
		
		const footerText = "Perk: {0}".format(achievements[type].bonus);
		createNewElement("div", id+"Footer", div, [], footerText);
		
		achievementElements.push(new AcheivementElement(type, level, maxCount, count, goal))
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
	let stats = [];
	switch(unitType){
		case "Minion":
			stats = getMinionUpgradedStats(unit);
			break;
		case "Boss":
			stats = getBossUpgradedStats(unit);
			break;
		case "Tower":
			stats = getTowerUpgradedStats(unit, level);
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

	for(let i=0;i<stats.length;i++){
	  if(isNaN(stats[i].base) || stats[i]==0){continue;}
	  if(stats[i].stat !== "health" && stats[i].stat !== "damage" && stats[i].prod === 1){continue;}
	  
		const tr = createNewElement("tr", "infoRow"+i, tbl, []);

		const s = createNewElement("td", "statRow"+i, tr, [], stats[i].stat.fixString());
		const v = createNewElement("td", "prodRow"+i, tr, [], stats[i].prod);
		s.title = statDescription[stats[i].stat];
		v.title = "Base:{0}  Multiplier:{1}".format(stats[i].base,stats[i].mult);
	}
}

initialize_components();
