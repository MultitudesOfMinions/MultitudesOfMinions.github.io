function createNewElement(type, id, parent, cssClasses, textContent){
	if(!parent){
		console.error("parent is null for " + id);
		return;
	}
	var e = document.getElementById(id);
	if(e){
		if(textContent){ setElementText(id, textContent); }
		return e;
	}
	
	e = document.createElement(type);
	e.id = id;

	for(var i = 0; i < cssClasses.length;i++){
		e.classList.add(cssClasses[i]);
	}
	
	if(textContent) { e.textContent = textContent; }
	
	parent.appendChild(e);
	return e;
}
function addOnclick(id, onclick){
	var e = document.getElementById(id);
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
}
function initialSize(){
		//Resize panels
	var pnl0 = document.getElementById("pnl0");
	var pnl1 = document.getElementById("pnl1");
	
	var a = Math.max(document.documentElement.clientWidth);
	var b = Math.max(document.documentElement.clientHeight)*2.4;
	var maxD = Math.min(a, b) - 10;
	gameW = maxD;
	gameH = maxD/6;
	halfH = gameH>>1;
	leaderPoint = gameW * 2 / 5;
	pathL = (gameW>>6);
	pathW = (gameH>>4);
	langoliers = pathL*-2;
	
	var drawArea = document.getElementById("canvasArea");
	drawArea.style.width = gameW;
	drawArea.style.height = gameH;
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext("2d");

	pnl0.style.height = gameH;
}

function buildWorld(){
	minions = [];
	minionOrder =[];
	path = [];
	towers = [];
	totalPaths = totalPaths || 0;
	
	//Build path
	path[0] = new point(-(pathL*2), halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + (pathL*2)){
		addPathPoint(true);
	}

	initialMinions()
	initialTowers();
}

function initialMinions(){
	if(!achievements.prestige0.count && !resources.a.amt){
		addMinionQ[addMinionQ.length] = "Mite";
		minionResearch.Mite.lastSpawn = getMinionBaseStats("Mite").spawnDelay / 2;
	}
	else{
		for(var minion in minionUpgrades){
			var minions = minionUpgrades[minion].initialMinions;
			for(var i=0;i<minions;i++){
				addMinionQ[addMinionQ.length] = minion;
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
	var spawnPool = document.getElementById("divSpawnPool");

	for(var minionType in minionResearch){
		var id="div{0}Spawn".format(minionType);
		var spawnRow = createNewElement("div", id, spawnPool, [], null);
		
		var chk = createNewElement("input", "chkSpawn{0}".format(minionType), spawnRow, [], null);
		chk.type = "checkbox";
		chk.checked = minionResearch[minionType].isUnlocked;
		
		var id="divSpawn{0}".format(minionType);
		var bg = createNewElement("div", id+"Back", spawnRow, ["progressBackground"], null);
		
		createNewElement("div", id+"Progress", bg, ["progressBar"], null);
		setElementText(id+"Progress", minionType);
	}
}

function createBossTab(){
	var bossSelect = document.getElementById("ulBossSelectList");
	var bossActive = document.getElementById("divActiveData");
	
	var baseUnlockCost = unlockBossCost();
	for(var bossType in baseBoss){
		//select
		var li = createNewElement("li", "li"+bossType, bossSelect, [], null)
		var rdoId = "select{0}".format(bossType);
		var rdo = createNewElement("input", rdoId, li, [], null);
		rdo.type = "radio";
		rdo.name = "bossSelect";
		rdo.value = bossType;
		var label = createNewElement("label", rdoId+"Label", li, [], bossType+" ");
		label.for = rdoId;
		
		var divSpawnBack = createNewElement("div", "div{0}SpawnBackground".format(bossType), li, ["progressBackground"], null);
		createNewElement("div", "div{0}SpawnProgress".format(bossType), divSpawnBack, ["progressBar"], null);
		
	}
}

function createT0Upgrades(){
	var t0UpgradeTable = document.getElementById("divMinionT0UpgradeTable");
	var t0Upgrades = minionUpgradeTypes[0];
	
	var divPrestige = document.getElementById("divPrestige0");
	var newButton = createNewElement("button", "btnPrestige0", divPrestige, ["upg"], text);
	newButton.setAttribute("purchaseType", "Prestige0");
	addOnclick("btnPrestige0", function() { buy(this); });

	for(var minionType in baseMinion)
	{
		var t0UpgradeListId = "div{0}T0UpgradeList".format(minionType);
		var t0UpgradeList = createNewElement("div", t0UpgradeListId, t0UpgradeTable, ["listBlock"], null);
		
		var headerText = "{0} Equipment".format(minionType);
		createNewElement("div", t0UpgradeListId + "Header", t0UpgradeList, ["listBlockHeader"], headerText);

		for(var i=0;i<t0Upgrades.length; i++){
			var upgradeType = t0Upgrades[i]
			var cost = getUpgradeCost(minionType, upgradeType);
			var newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.a.symbol);
			
			var newButton = createNewElement("button", newId, t0UpgradeList, ["upg"], text);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);

			var onclick = function() { upgrade(this); }
			addOnclick(newId, onclick);
		}
	}
}
function createT1Upgrades(){
	var t1UpgradeTable = document.getElementById("divMinionT1UpgradeTable");
	var divMiscT1Upgrades = document.getElementById("divMiscT1Upgrades");
	var t1Upgrades = minionUpgradeTypes[1];

	var divPrestige = document.getElementById("divPrestige1");
	var newButton = createNewElement("button", "btnPrestige1", divPrestige, ["upg"], text);
	newButton.setAttribute("purchaseType", "Prestige1");
	addOnclick("btnPrestige1", function() { buy(this); });
	
	for(var minionType in minionResearch)
	{

		if(minionResearch[minionType].unlockT == 1){
			//Create unlock button
			var newBtnId = "btnUnlock{0}".format(minionType);
			var cost = unlockMinionCost(minionType);
			var unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.b.symbol);

			var newButton = createNewElement("button", newBtnId, divMiscT1Upgrades, ["upg"], unlockText);
			newButton.setAttribute("unlockType", minionType);
		
			var onclick = function() { unlock(this); }
			addOnclick(newBtnId, onclick);
		}

		//Creat other upgrade buttons
		var t1UpgradeListId = "div{0}T1UpgradeList".format(minionType);
		var t1UpgradeList = createNewElement("div", t1UpgradeListId, t1UpgradeTable, ["listBlock"], null);
		
		var headerText = "{0} Training".format(minionType);
		createNewElement("div", t1UpgradeListId + "Header", t1UpgradeList, ["listBlockHeader"], headerText);

		for(var i=0;i<t1Upgrades.length; i++){
			var upgradeType = t1Upgrades[i]
			var cost = getUpgradeCost(minionType, upgradeType);
			var newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.b.symbol);
			var onclick = function() { upgrade(this); }
			
			var newButton = createNewElement("button", newId, t1UpgradeList, ["upg"], text);
			addOnclick(newId, onclick);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
	}

	var maxMinionsCost = getMaxMinionCost();
	var maxMinionsText = "Max Minions++ ({0}{1})".format(maxMinionsCost, resources.b.symbol);
	var maxMinionsBtn = createNewElement("button", "btnBuyMaxMinions", divMiscT1Upgrades, ["upg"], maxMinionsText);
	maxMinionsBtn.setAttribute("purchaseType", "MaxMinions");

	onclick = function() { buy(this); }
	addOnclick("btnBuyMaxMinions", onclick);
	
	var t0UpgradePotencyCost = getPotencyCost(0);
	var t0UpgradePotencyText = "Armory Effectiveness ({0}{1})".format(t0UpgradePotencyCost, resources.b.symbol);
	var t0UpgradePotency = createNewElement("button", "btnBuyT0UpgradePotency", divMiscT1Upgrades, ["upg"], t0UpgradePotencyText)
	t0UpgradePotency.setAttribute("purchaseType", "T0UpgradePotency");

	onclick = function() { buy(this); }
	addOnclick("btnBuyT0UpgradePotency", onclick);
	
	//put misc upgrades at the end.
	divMiscT1Upgrades.parentNode.appendChild(divMiscT1Upgrades);
	
}
function createT2Upgrades(){
	var t2UpgradeTable = document.getElementById("divMinionT2UpgradeTable");
	var divMiscT2Upgrades = document.getElementById("divMiscT2Upgrades");
	var t2Upgrades = minionUpgradeTypes[2];
	
	var divPrestige = document.getElementById("divPrestige2");
	var newButton = createNewElement("button", "btnPrestige2", divPrestige, ["upg"], "Promote");
	newButton.setAttribute("purchaseType", "Prestige2");
	addOnclick("btnPrestige2", function() { buy(this); });

	for(var minionType in minionResearch)
	{
		if(minionResearch[minionType].unlockT == 2){
			//Create unlock button
			var newBtnId = "btnUnlock{0}".format(minionType);
			var cost = unlockMinionCost(minionType);
			var unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.c.symbol);

			var newButton = createNewElement("button", newBtnId, divMiscT2Upgrades, ["upg"], unlockText);
			newButton.setAttribute("unlockType", minionType);
		
			var onclick = function() { unlock(this); }
			addOnclick(newBtnId, onclick);
		}
		
		var t2UpgradeListId = "div{0}T2UpgradeList".format(minionType);
		var t2UpgradeList = createNewElement("div", t2UpgradeListId, t2UpgradeTable, ["listBlock"], null);
		
		var headerText = "{0} Experiments".format(minionType);
		createNewElement("div", t2UpgradeListId + "Header", t2UpgradeList, ["listBlockHeader"], headerText);
		
		for(var i=0;i<t2Upgrades.length; i++){
			var upgradeType = t2Upgrades[i]
			var cost = getUpgradeCost(minionType, upgradeType);
			var newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.c.symbol);
			var onclick = function() { upgrade(this); }
			
			var newButton = createNewElement("button", newId, t2UpgradeList, ["upg"], "Ascend");
			addOnclick(newId, onclick);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
	}
	
	onclick = function() { buy(this); }
	var t1UpgradePotencyCost = getPotencyCost(1);
	var t1UpgradePotencyText = "Gym Effectiveness ({0}{1})".format(t1UpgradePotencyCost, resources.c.symbol);
	var t1UpgradePotency = createNewElement("button", "btnBuyT1UpgradePotency", divMiscT2Upgrades, [], t1UpgradePotencyText)
	t1UpgradePotency.setAttribute("purchaseType", "T1UpgradePotency");
	addOnclick("btnBuyT1UpgradePotency", onclick);
	
	var maxUpgradeLevelCost = getMaxUpgradeLevelCost();
	var maxUpgradeLevelText = "Upgrade Limit++ ({0}{1})".format(maxUpgradeLevelCost, resources.c.symbol);
	var maxUpgradeLevel = createNewElement("button", "btnBuyMaxUpgradeLevel", divMiscT2Upgrades, [], maxUpgradeLevelText);
	maxUpgradeLevel.setAttribute("purchaseType", "BuyMaxUpgradeLevel");
	addOnclick("btnBuyMaxUpgradeLevel", onclick);
	
	var globalSpawnDelayCost = getGlobalSpawnDelayReductionCost();
	var globalSpawnDelayText = "Reduce Deploy Time ({0}{1})".format(globalSpawnDelayCost, resources.c.symbol);
	var globalSpawnDelay = createNewElement("button", "btnBuyGlobalSpawnDelay", divMiscT2Upgrades, [], globalSpawnDelayText);
	globalSpawnDelay.setAttribute("purchaseType", "BuyGlobalSpawnDelay");
	addOnclick("btnBuyGlobalSpawnDelay", onclick);

	
	//put misc upgrades at the end.
	divMiscT2Upgrades.parentNode.appendChild(divMiscT2Upgrades);
}
function createT3Upgrades(){
	
	var onclick = function() { buy(this); }
	var t2UpgradePotencyCost = getPotencyCost(2);
	var t2UpgradePotencyText = "Gym Effectiveness ({0}{1})".format(t2UpgradePotencyCost, resources.d.symbol);
	var t2UpgradePotency = createNewElement("button", "btnBuyT2UpgradePotency", divMiscT3Upgrades, [], t2UpgradePotencyText)
	t2UpgradePotency.setAttribute("purchaseType", "T2UpgradePotency");
	addOnclick("btnBuyT1UpgradePotency", onclick);
	
	var divPrestige = document.getElementById("divPrestige3");
	var newButton = createNewElement("button", "btnPrestige3", divPrestige, ["upg"], text);
	newButton.setAttribute("purchaseType", "Prestige3");
	addOnclick("btnPrestige3", function() { buy(this); });

	
	var bossUnlock = document.getElementById("divMiscT3Upgrades");
	var baseUnlockCost = unlockBossCost();
	for(var bossType in baseBoss){
		//unlock
		var cost = baseUnlockCost + baseBoss[bossType].unlockCost;
		var unlockId = "btnUnlock{0}".format(bossType);
		var unlockText = "Unlock {0} ({1}{2})".format(bossType, cost, resources.c.symbol);
		
		var newButton = createNewElement("button", unlockId, bossUnlock, ["upg"], unlockText);
		newButton.setAttribute("unlockType", bossType);
		var onclick = function() {unlock(this);}
		addOnclick(unlockId, onclick);
	}
	
	var divBossEnhancements = document.getElementById("divBossEnhancements");
	for(var bossType in baseBoss){
		var upgrades = bossUpgrades[bossType];
		
		var enhanceListId = "div{0}EnhanceList".format(bossType);
		var enhanceList = createNewElement("div", enhanceListId, divBossEnhancements, ["listBlock"], null);

		var headerText = "{0} Enhancements".format(bossType);
		createNewElement("div", enhanceListId + "Header", enhanceList, ["listBlockHeader"], headerText);
		
		for(var upgradeType in upgrades){
			var cost = getEnhanceCost(bossType, upgradeType);
			var newId = "btnUpg{0}{1}".format(bossType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.d.symbol);
			var onclick = function() { enhance(this); }
			
			var newButton = createNewElement("button", newId, enhanceList, [], text);
			addOnclick(newId, onclick);
			newButton.setAttribute("bossType", bossType);
			newButton.setAttribute("upgradeType", upgradeType);
			
		}
	}

	var t3MinionUpgrades = document.getElementById("divT3MinionUpgrades");
	var t3Upgrades = minionUpgradeTypes[3];

	for(var minionType in baseMinion){
		for(var i=0;i<t3Upgrades.length; i++){
			var upgradeType = t3Upgrades[i];
			var cost = getUpgradeCost(minionType, upgradeType);
			var newId = "btnUpg{0}{1}".format(minionType, upgradeType);
			var text = "{0}({2}{3})".format(minionType, cost,resources.d.symbol);
			var onclick = function() { upgrade(this); }
			
			var newButton = createNewElement("button", newId, t3MinionUpgrades, ["upg"], text);
			addOnclick(newId, onclick);
			newButton.setAttribute("minionType", minionType);
			newButton.setAttribute("upgradeType", upgradeType);
		}
	}
}
function createGaugesTable(){
	var tblGauges = document.getElementById("tblGauges");

	//header row.
	var header = tblGauges.createTHead();
	var colHeaderRow = header.insertRow();
	colHeaderRow.insertCell();
	for(var unitType in unitTypes){
		var th = document.createElement("th");
		th.textContent = unitType;
		colHeaderRow.appendChild(th);
		if(unitType == "Boss"){
			th.classList.add("t3");
		}
	}
	
	for(var gaugeType in gauges){
		//Unlock row
		var rowUnlock = tblGauges.insertRow();
		rowUnlock.id = "rowUnlock" + gaugeType;
		
		var thUnlock = document.createElement("th");
		thUnlock.textContent = gaugeType;
		rowUnlock.appendChild(thUnlock);

		var td = rowUnlock.insertCell();
		td.colSpan = 4;
		
		var newBtnId = "btnUnlock" + gaugeType;
		var unlockText = "Unlock ({0}{1})".format(gauges[gaugeType].cost, resources.b.symbol);
		var newButton = createNewElement("button", newBtnId, td, ["upg"], unlockText);
		newButton.setAttribute("unlockType", gaugeType);
	
		var onclick = function() { unlock(this); }
		addOnclick(newBtnId, onclick);
		
		//Checkboxes row
		var row = tblGauges.insertRow();
		row.id = "row" + gaugeType;
		
		var th = document.createElement("th");
		th.textContent = gaugeType;
		row.appendChild(th);
		
		for(var unitType in unitTypes){
			var td = document.createElement("td");
			row.appendChild(td);
			if(unitType == "Boss"){
				td.classList.add("t3");
			}
			
			var id = "chk{0}{1}".format(gaugeType, unitType);
			
			var chk = createNewElement("input", id, td, [], null);
			chk.setAttribute("unitType", unitType);
			chk.setAttribute("gaugeType", gaugeType);
			chk.type = "checkbox";
		}
	}
}

function createAchievemetsTab(){
	var achRoot = document.getElementById("divAchievementTable");
	
	for(var type in achievements){
		var id = "divAch"+type
		var div = createNewElement("div", id, achRoot, ["listBlock", "t" + achievements[type].unlockT], null);
		
		var lvl = getAchievementLevel(type);
		var next = getAchievementNext(type);
		var headerText = "{0} : {1}".format(achievements[type].name, lvl);
		createNewElement("div", id+"Header", div, ["listBlockHeader"], headerText);
		var bodyText = "{0}/{1}".format(achievements[type].count, next);
		createNewElement("div", id+"Body", div, [], bodyText);
		
		var footerText = "Perk: {0}".format(achievements[type].bonus);
		createNewElement("div", id+"Footer", div, [], footerText);
	}
}

//fancy html decode used in populateInfo
var htmlDecode = (function () {
        //create a new html document (not execute script tags in child elements)
        var doc = document.implementation.createHTMLDocument("");
        var element = doc.createElement("div");

        function getText(str) {
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = "";
            return str;
        }

        function decodeHTMLEntities(str) {
            if (str && typeof str === "string") {
                var x = getText(str);
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
	var divInfo = document.getElementById("divInfo");

	//fix boss symbol
	for(var bossType in baseBoss) {
		baseBoss[bossType].symbol = htmlDecode(baseBoss[bossType].symbol);
	}		
	//fix hero symbol
	for(var heroType in baseHero) {
		baseHero[heroType].symbol = htmlDecode(baseHero[heroType].symbol);
	}		

	
	for(var unitType in unitTypes){
		teamDivId = "divInfoTeam{0}".format(unitTypes[unitType].team);
		teamDiv = createNewElement("div", teamDivId, divInfo, [], null);

		var tblUnitGroup = document.getElementById("tbl{0}Info".format(unitType));
		if(tblUnitGroup == null){
			tblUnitGroupId = "tbl{0}Info".format(unitType);
			tblUnitGroup = createNewElement("table", tblUnitGroupId, teamDiv, ["infoTable"], null );
			
			var headerCell = tblUnitGroup.insertRow().insertCell();
			headerCell.colSpan = 3;
			headerCell.style.fontWeight="bold";
			headerCell.style.textAlign="center";
			headerCell.textContent = "{0} Info".format(unitType);
		
			if(window.hasOwnProperty("base{0}".format(unitType))){
				var unitInfo = window["base{0}".format(unitType)];
				
				for(var unit in unitInfo){
					var unitRow = tblUnitGroup.insertRow();
					if(unitType == "Minion" && unit != "Mite"){
						unitRow.classList.add("t" + minionResearch[unit].unlockT );
					}
					
					var nameCell = unitRow.insertCell(0);
					nameCell.id = unitType+"_"+unit;
					nameCell.textContent = unit;
					nameCell.setAttribute("unitType", unitType);
					nameCell.setAttribute("unit", unit);
					nameCell.classList.add("pointer");
					addOnclick(nameCell.id, function(){unitDetails(this);})

					var colorCell = unitRow.insertCell(1);
					
					var symbol = htmlDecode(unitTypes[unitType].infoSymbol)
					if(unitTypes[unitType].uniqueSymbol){
						if(unitType == "Boss"){
							symbol = baseBoss[unit].symbol
						}
						if(unitType == "Hero"){
							symbol = baseHero[unit].symbol
						}
					}
					colorCell.textContent = symbol;
					colorCell.style.color = unitInfo[unit].color;
					colorCell.style.backgroundColor = unitInfo[unit].color2;
					colorCell.style.fontWeight = "bold";
					
					var descCell = unitRow.insertCell(2);
					descCell.textContent = unitInfo[unit].info;
				}
			}
		}
	}
	
	var bossTable = document.getElementById("tblBossInfo");
	if(bossTable){bossTable.classList.add("t3");}
}
function unitDetails(input){
	var unitType = input.getAttribute("unitType");
	var unit = input.getAttribute("unit");
	var modal = document.getElementById("infoModal");
	modal.style.display="block";

	document.getElementById("infoModalHeader").textContent = unitType+": " +unit;
	stats = [];
	switch(unitType){
		case "Minion":
			stats = getMinionUpgradedStats(unit);
			break;
		case "Boss":
			stats = getBossUpgradedStats(unit);
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
	var tbl = document.getElementById("tblInfoBody");
	while( tbl.firstChild ){ tbl.removeChild( tbl.firstChild ); }

	for(var i=0;i<stats.length;i++){
		var tr = document.createElement("tr");
		
		var tdStat = document.createElement("td");
		var tdBase = document.createElement("td");
		var tdMult = document.createElement("td");
		var tdUpg = document.createElement("td");
		var tdProd = document.createElement("td");
		tdStat.textContent = stats[i].stat.fixString();
		tdBase.textContent = stats[i].base;
		tdMult.textContent = stats[i].mult;
		tdUpg.textContent = stats[i].upg;
		tdProd.textContent = stats[i].prod;
		
		tr.appendChild(tdStat);
		tr.appendChild(tdBase);
		tr.appendChild(tdMult);
		tr.appendChild(tdUpg);
		tr.appendChild(tdProd);
		
		tbl.appendChild(tr);
	}
}

initialize_components();
