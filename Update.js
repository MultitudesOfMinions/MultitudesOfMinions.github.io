//BUGS:
//Boss info doesn't have some upgrades/ product is NaN
//Show Boss Boost from achievements in Boss info

//MISC:

//TEST

//FEATURES:
//TODO: Upload to github
//0.8.7

//TODO: item db
//TODO: equipment - drops from hero, equip on bosses
		//put equiped on boss tab
		//Forge: 
			//upgrade stat
			//re-roll stat
			//scrap to get Womba 
				//Used to upgrade rarity
			//upgrade Rarity
				//need Womba
//TODO: Max Hero Level killed: Equip rarity drop boost
//0.9.0

//TODO: adjust minion/tower colors
	//bomber/water
	//mite/earth
	//harpy/air
	//ram/fire
//0.9.2

//TODO: balance config.js
//TODO: get some testers/balance game.
	//Adjust help tab based on feedback
//0.9.5

//TODO: look into high quality graphics??
//1.0.0

//TODO: link on r/incrementalgames or some such.



function setElementText(id, text)  {
	if(id == null) {
		console.error("id cannot be null");
		return;
	}
	var e = document.getElementById(id);
	if(e == null){
		console.error(id + " element not found");
		return;
	}
	if(text == null){
		console.error(id, text);
	}
	text = text.fixString();
	//possibly: innerText, text, value, textContent
	if(e.textContent != text)
		e.textContent = text;
}
String.prototype.fixString = function() {
	var temp = this.charAt(0).toUpperCase() + this.slice(1);
	return temp.replace(/([A-Z])/g, " $1").trim();
}

function setButtonAffordableClass(id, isAffordable){
	var e = document.getElementById(id);
	if(e == null){
		console.error(id + " element not found");
		return;
	}

	if(isAffordable){
		e.classList.add("affordableUpg"); 
		e.classList.remove("upg"); 
	}
	else{ 
		e.classList.add("upg"); 
		e.classList.remove("affordableUpg"); 
	}
}

var frameCount = 0;
function update(){
	Quality = GetQuality();
	toggleHilite();
	
	manageMinions();
	manageBoss();
	setMinionOrder(); 
	setTeam0Order();

	manageHero();
	manageTowers();
	setTeam1Order();
	
	managePath();
	manageProjectiles();
	manageImpacts();
	
	followTheLeader();
	doAutobuy();
	updatePnl1();
	updateResourceDisplay();

	//Draw all the stuffs in the correct order.
	if(skippedFrames >= skipFrames()){
		skippedFrames = 0;
		draw();
	}
	else{ skippedFrames++; }
	updateAutosave();
	fps();
}

function updateResourceDisplay(){
	var resourceDisplay = "{0}:{1}{2}".format(resources.a.name, Math.floor(resources.a.amt), resources.a.symbol);
	setElementText("divT0Resource", resourceDisplay);

	var resourceDisplay = "{0}:{1}{2}".format(resources.b.name, Math.floor(resources.b.amt), resources.b.symbol);
	setElementText("divT1Resource", resourceDisplay);

	var resourceDisplay = "{0}:{1}{2}".format(resources.c.name, Math.floor(resources.c.amt), resources.c.symbol);
	setElementText("divT2Resource", resourceDisplay);

	var resourceDisplay = "{0}:{1}{2}".format(resources.d.name, Math.floor(resources.d.amt), resources.d.symbol);
	setElementText("divT3Resource", resourceDisplay);

	var resourceDisplay = "{0}:{1}{2}".format(resources.e.name, Math.floor(resources.e.amt), resources.e.symbol);
	setElementText("divT4Resource", resourceDisplay);
}

var fCount = 0;
var lastFps = 0;
var s = 0;
var averageFps = 0;
function fps(){
	fCount++;
	if(new Date() % 1000 <= defaultInterval){
		lastFps = fCount;
		averageFps *= s/(s+1);
		s++;
		averageFps += lastFps/s;
		fCount = 0;
	}
	if(showFPS()){
		ctx.beginPath();
		ctx.fillStyle="#FFF";
		ctx.font = "10pt Helvetica"
		ctx.fillText("FPS:{0} {1}".format(Math.floor(averageFps*100)/100, lastFps),10,10);
		ctx.closePath();
	}
}

function toggleHilite(){
	for(var i=0;i<hilites.length;i++){
		hilites[i].count++;
		if(hilites[i].count > hilites[i].limit){
			var id = hilites[i].id
			var e = document.getElementById(id);
			if(e == null || hilites[i].blinks <= 0){
				delHilite(hilites[i].id);
				i--;
				continue;
			}
			e.classList.toggle("mnuHilite");
			hilites[i].count = 0;
			hilites[i].blinks--;
		}
	}
}
function addHilite(id, blinks){
	if(hilites.filter(x => x.id == id) > 0){return;}
	
	hilites.push({count:0,limit:8,id:id,blinks:blinks*2});
}
function delHilite(id){
	var h = hilites.filter(x => x.id == id);
	if(h.length > 0){
		var index = hilites.indexOf(h[0]);
		hilites.splice(index,1);
		var e = document.getElementById(id);
		if(e != null){
			e.classList.remove("mnuHilite");
		}
	}
}

function doAutobuy(){
	var lowestLevel = 99;
	for(var key in tierMisc){
		if(!tierMisc[key].autobuy.isUnlocked){continue;}
		if(!isAutoBuy(key)){continue;}
		
		var upgrades = minionUpgradeTypes[tierMisc[key].tier];
		for(var minion in minionResearch){
			if(!minionResearch[minion].isUnlocked){continue;}
			
			for(var upgrade in upgrades){
				lowestLevel = Math.min(lowestLevel, minionUpgrades[minion][upgrades[upgrade]])
			}
		}
	}
	//get cheapest cost;
	
	for(var key in tierMisc){
		if(!tierMisc[key].autobuy.isUnlocked){continue;}
		if(!isAutoBuy(key)){continue;}
		
		var upgrades = minionUpgradeTypes[tierMisc[key].tier];
		for(var minion in minionResearch){
			if(!minionResearch[minion].isUnlocked){continue;}
			
			for(var upgrade in upgrades){
				if(minionUpgrades[minion][upgrades[upgrade]] > lowestLevel){continue;}
				buyUpgrade(minion, upgrades[upgrade]);
			}
		}
	}
}

function updateAutosave(){
	if(cookiesEnabled == 0){
		document.getElementById("divAutoSave").style.display = "none";
		return;
	}
	
	document.getElementById("divAutoSave").style.display = null;
	if(autoSave()){
		lastSave++;
		var saveTime = 1000;
		if(lastSave > saveTime){//approx 1 minutes
			saveData();
		}
		document.getElementById("divAutoSaveProgress").style.width = (lastSave / saveTime) * 100 + "%"; 
	}
}

function updatePnl1(){
	var resourceDisplay = "{0}:{1}{2}".format(resources.a.name , Math.floor(resources.a.amt), resources.a.symbol);
	setElementText("divT0Resource", resourceDisplay);
	toggleTierItems();
	if(document.getElementById("divMinionDashboard").style.display != "none"){
		updateMinionSpawns();
		updateMinionDashboard();
	}
	else if(document.getElementById("divBossArea").style.display != "none"){
		updateBossTab();
	}
	else if(document.getElementById("divArmory").style.display != "none"){
		updateT0Upgrades();
	}
	else if(document.getElementById("divGym").style.display != "none"){
		updateT1Upgrades();
	}
	else if(document.getElementById("divLab").style.display != "none"){
		updateT2Upgrades();
	}
	else if(document.getElementById("divOffice").style.display != "none"){
		updateT3Upgrades();
	}
	else if(document.getElementById("divAchievements").style.display != "none"){
		updateAchievements();
	}
	else if(document.getElementById("divInfo").style.display != "none"){}
	else if(document.getElementById("divOptions").style.display != "none"){
		updateOptionsTab();
	}
}
function toggleTierItems(){
	for(var i=0;i<5;i++){
		var elements = document.getElementsByClassName("t"+i);
		var unlocked = tierUnlocked(i);
		
		for(var j=0;j<elements.length;j++){
			elements[j].style.display = unlocked ? null : "none";
		}
	}
	
	for(var key in tierMisc){
		var btn = document.getElementById("btnUnlockAutobuy" + key);
		var chk = document.getElementById("divAutobuy" + key);
		if(btn == null || chk == null){continue;}
		if(tierMisc[key].autobuy.isUnlocked){
			btn.style.display = "none";
			chk.style.display = null;
		}
		else{
			btn.style.display = null;
			chk.style.display = "none";
			setButtonAffordableClass("btnUnlockAutobuy" + key, tierMisc[key].autobuy.cost <= resources[tierMisc[key].autobuy.resource].amt)
		}
	}
}

function updateMinionSpawns(){
	var qPercent = lastGlobalSpawn / getGlobalSpawnDelay() * 100;
	var qPercent = Math.min(100, qPercent);
	document.getElementById("divQProgress").style.width = qPercent + "%";
	
	for(var minionType in minionResearch){
		if(minionResearch[minionType].isUnlocked){
			var spawn = document.getElementById("div{0}Spawn".format(minionType));
			spawn.style.display = null;

			var lastSpawn = minionResearch[minionType].lastSpawn;
			var spawnDelay = getMinionSpawnDelay(minionType);

			var percent = Math.min(100, Math.floor(lastSpawn / spawnDelay * 100));
			var e = document.getElementById("divSpawn{0}Progress".format(minionType));
			e.style.width = percent + "%";
		}
		else{
			var e = document.getElementById("div{0}Spawn".format(minionType));
			e.style.display = "none";
		}
	}
}
function updateMinionDashboard(){
	var minionCounter = "{0}/{1}".format(getMinionCount(), getMaxMinions());
	setElementText("lblMinionCounter", minionCounter);
	
	var minionQ = "Baracks ({0}/10): {1}".format(addMinionQ.length, addMinionQ.join(", "));
	setElementText("lblMinionQ", minionQ);
	
	//check if is changed before updating minion info
	var minionList = document.getElementById("divMinionList");
	var minionListCount = minionList.childNodes.length;
	for(var i=0; i< minionOrder.length; i++){
		//build div html
		var minionInfo = "#{2}|HP:{0}|DMG:{1}"
				.format(Math.ceil(minions[minionOrder[i]].health), 
						Math.floor(minions[minionOrder[i]].damage),
						i);

		//check if it exists
		var minionCard = document.getElementById("divMinionListItem" + i);
		if(minionCard == null){
			var newMinion = createNewElement("div", "divMinionListItem" + i, minionList, ["minionBlock"], minionInfo);
			newMinion.style.color = minions[minionOrder[i]].color;
			newMinion.style.backgroundColor = minions[minionOrder[i]].color2
			
		}
		else {
			document.getElementById("divMinionListItem" + i).style.color = minions[minionOrder[i]].color;
			document.getElementById("divMinionListItem" + i).style.backgroundColor = minions[minionOrder[i]].color2;
			setElementText("divMinionListItem" + i, minionInfo);
		}
		
	}
	
	//remove extra minion cards
	while(minionList.childNodes.length > minionOrder.length){
		minionList.removeChild(minionList.lastChild)
	}
}
function updateBossTab(){
	
	var baseUnlockCost = unlockBossCost();
	for(var bossType in baseBoss){
		var selectId = "select{0}".format(bossType);
		if(bossResearch[bossType].isUnlocked){
			document.getElementById(selectId).style.display = null;
			document.getElementById(selectId+"Label").style.display = null;
			document.getElementById("div{0}SpawnBackground".format(bossType)).style.display = null;
			
			var delay = getBossSpawnDelay(bossType)
			var lastSpawn = bossResearch[bossType].lastSpawn;
			var percent = (lastSpawn / delay) * 100;
			percent = Math.min(100, percent);
			document.getElementById("div{0}SpawnProgress".format(bossType)).style.width = percent + "%";
		}
		else{
			document.getElementById(selectId).style.display = "none";
			document.getElementById(selectId+"Label").style.display = "none";
			document.getElementById("div{0}SpawnBackground".format(bossType)).style.display = "none";
		}
	}
	
	if(boss == null){
		document.getElementById("ulBossStats").style.display = "none";
		document.getElementById("divBossControls").style.display = "none";
		return;
	}
	document.getElementById("ulBossStats").style.display = null;
	document.getElementById("divBossControls").style.display = null;
	
	var p = 0;
	var btn = document.getElementById("divBossActiveAbility")
	var prog = document.getElementById("divBossActiveAbilityProgress")

	if(boss.remainingDuration >= 0){
		boss.remainingDuration = Math.max(boss.remainingDuration, 0);
		p = 100 * boss.remainingDuration / boss.abilityDuration;

		btn.classList.add("bossButtonActive"); 
		btn.classList.remove("bossButtonAvailable"); 
		btn.classList.remove("bossButtonUnavailable"); 
	}
	else{
		boss.lastActiveAbility = Math.min(boss.lastActiveAbility, boss.abilityCooldown)
		p = 100 * boss.lastActiveAbility / boss.abilityCooldown;

		if(p == 100){
			btn.classList.add("bossButtonAvailable"); 
			btn.classList.remove("bossButtonUnavailable"); 
		}
		else{
			btn.classList.add("bossButtonUnavailable"); 
			btn.classList.remove("bossButtonAvailable"); 
		}
	}
	
	p = Math.min(100, p);
	prog.style.width = p+"%";
	
	
	var bossInfoItems = ["health", "damage", "attackRate", "attackRange", "moveSpeed", "auraRange", "auraPower", "auraInfo", "passiveAbilityInfo", "activeAbilityInfo" ];
	for(var i=0;i<bossInfoItems.length;i++){
		
		var text = null;
		var id = "spanBoss"+bossInfoItems[i];
		switch(bossInfoItems[i]){
			case "health":
			case "damage":
			case "attackRate":
			case "attackRange":
			case "moveSpeed":
			case "auraRange":
			case "auraPower":
				var rounded = Math.floor(boss[bossInfoItems[i]]*100)/100;
				text = "{0}: {1}".format(bossInfoItems[i], rounded);
				break;
			case "auraInfo":
			case "passiveAbilityInfo":
			case "activeAbilityInfo":
				text = baseBoss[boss.type][bossInfoItems[i]];
				break;
		}

		setElementText(id, text);
	}
	
}
function updateT0Upgrades(){
	var prestigeGain = getPrestigeGain(0) + resources.b.symbol;
	setElementText("divPrestige0Gain", prestigeGain);
		
	var prestigeCost = getPrestigeCost(0)
	setElementText("btnPrestige0", "Regroup ({0}{1})".format(prestigeCost, resources.a.symbol));
	setButtonAffordableClass("btnPrestige0", resources.a.amt >= prestigeCost)
	
	var t0UpgradeTable = document.getElementById("divMinionT0UpgradeTable");
	var t0Upgrades = minionUpgradeTypes[0];

	for(var minionType in baseMinion)
	{
		var t0UpgradeListId = "div{0}T0UpgradeList".format(minionType);
		var t0UpgradeList = document.getElementById(t0UpgradeListId);

		if(!minionResearch[minionType].isUnlocked){ 
			t0UpgradeList.style.display = "none";
			continue; 
		}
		t0UpgradeList.style.display = null;
		
		for(var i=0;i<t0Upgrades.length; i++){
			var upgradeType = t0Upgrades[i]
			var cost = getUpgradeCost(minionType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.a.symbol);
			if(cost == Infinity){
				text = "{0} (Max Level )".format(upgradeType)
			}
			
			var btnId = "btnUpg{0}{1}".format(minionType, upgradeType);

			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.a.amt);
		}
		
	}
}
function updateT1Upgrades(){
	var prestigeGain = getPrestigeGain(1) + resources.c.symbol;
	setElementText("divPrestige1Gain", prestigeGain);
	
	var prestigeCost = getPrestigeCost(1)
	setElementText("btnPrestige1", "Evolve ({0}{1})".format(prestigeCost, resources.b.symbol));
	setButtonAffordableClass("btnPrestige1", resources.b.amt >= prestigeCost)

	
	var t1Upgrades = minionUpgradeTypes[1];

	var maxMinionsCost = getMaxMinionCost();
	var maxMinionsText = "Max Minions++ ({0}{1})".format(maxMinionsCost, resources.b.symbol);
	setElementText("btnBuyMaxMinions", maxMinionsText);
	setButtonAffordableClass("btnBuyMaxMinions", resources.b.amt >= maxMinionsCost);
	
	var t0UpgradePotencyCost = getPotencyCost(0);
	var t0UpgradePotencyText = "Armory Effectiveness ({0}{1})".format(t0UpgradePotencyCost, resources.b.symbol);
	setElementText("btnBuyT0UpgradePotency", t0UpgradePotencyText)
	setButtonAffordableClass("btnBuyT0UpgradePotency", resources.b.amt >= t0UpgradePotencyCost);


	for(var minionType in baseMinion)
	{
		if(minionResearch[minionType].isUnlocked){
			if(minionResearch[minionType].unlockT == 1){
				var unlockBtn = document.getElementById("btnUnlock{0}".format(minionType));
				unlockBtn.style.display = "none";
			}
			
			var t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
			t1UpgradeList.style.display = null;
			
			for(var i=0;i<t1Upgrades.length; i++){
				var upgradeType = t1Upgrades[i]
				var cost = getUpgradeCost(minionType, upgradeType);
				var text = "{0} ({1}{2})".format(upgradeType,cost,resources.b.symbol);
				if(cost == Infinity){
					text = "{0} (Max Level )".format(upgradeType)
				}

				var btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
				
				setElementText(btnId, text);
				setButtonAffordableClass(btnId, cost <= resources.b.amt);
			}
		}
		else if(minionResearch[minionType].unlockT==1){
			var unlockBtnId = "btnUnlock{0}".format(minionType);
			var unlockBtn = document.getElementById(unlockBtnId);
			unlockBtn.style.display = null;
			
			var cost = unlockMinionCost(minionType);
			setButtonAffordableClass(unlockBtnId, cost <= resources.b.amt);

			var unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.b.symbol);
			setElementText(unlockBtnId, unlockText)
			
			var t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
			t1UpgradeList.style.display = "none";
		}
	}
}
function updateT2Upgrades(){
	var prestigeGain = getPrestigeGain(2) + resources.d.symbol;
	setElementText("divPrestige2Gain", prestigeGain);
	
	var prestigeCost = getPrestigeCost(2)
	setElementText("btnPrestige2", "Promote ({0}{1})".format(prestigeCost, resources.c.symbol));
	setButtonAffordableClass("btnPrestige2", resources.c.amt >= prestigeCost)
	
	var t2Upgrades = minionUpgradeTypes[2];

	var t1UpgradePotencyCost = getPotencyCost(1);
	var t1UpgradePotencyText = "Gym Effectiveness ({0}{1})".format(t1UpgradePotencyCost, resources.c.symbol);
	setElementText("btnBuyT1UpgradePotency", t1UpgradePotencyText)
	setButtonAffordableClass("btnBuyT1UpgradePotency", resources.c.amt >= t1UpgradePotencyCost);
	
	var maxUpgradeLevelCost = getMaxUpgradeLevelCost();
	var maxUpgradeLevelText = "Upgrade Limit++ ({0}{1})".format(maxUpgradeLevelCost, resources.c.symbol);
	setElementText("btnBuyMaxUpgradeLevel", maxUpgradeLevelText);
	setButtonAffordableClass("btnBuyMaxUpgradeLevel", resources.c.amt >= maxUpgradeLevelCost);
	
	var globalSpawnDelayCost = getGlobalSpawnDelayReductionCost();
	var globalSpawnDelayText = "Reduce Deploy Time ({0}{1})".format(globalSpawnDelayCost, resources.c.symbol);
	setElementText("btnBuyGlobalSpawnDelay", globalSpawnDelayText);
	setButtonAffordableClass("btnBuyGlobalSpawnDelay", resources.c.amt >= globalSpawnDelayCost);

	for(var minionType in baseMinion)
	{
		for(var i=0;i<t2Upgrades.length; i++){
			var upgradeType = t2Upgrades[i]
			var cost = getUpgradeCost(minionType, upgradeType);
			var text = "{0} ({1}{2} )".format(upgradeType,cost,resources.c.symbol);
			if(cost == Infinity){
				text = "{0} (Max Level)".format(upgradeType)
			}
			
			var btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.c.amt);
		}
		
		if(minionResearch[minionType].unlockT==2){
			if(minionResearch[minionType].isUnlocked){
				var unlockBtn = document.getElementById("btnUnlock{0}".format(minionType));
				unlockBtn.style.display = "none";
			}
			else{
				var unlockBtnId = "btnUnlock{0}".format(minionType);
				var unlockBtn = document.getElementById(unlockBtnId);
				unlockBtn.style.display = null;
				
				var cost = unlockMinionCost(minionType);
				setButtonAffordableClass(unlockBtnId, cost <= resources.c.amt);

				var unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.c.symbol);
				setElementText(unlockBtnId, unlockText)
				
				var t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
				t1UpgradeList.style.display = "none";
			}
		}
		
	}

}
function updateT3Upgrades(){

	var t2UpgradePotencyCost = getPotencyCost(2);
	var t2UpgradePotencyText = "Gym Effectiveness ({0}{1})".format(t2UpgradePotencyCost, resources.d.symbol);
	setElementText("btnBuyT2UpgradePotency", t2UpgradePotencyText)
	setButtonAffordableClass("btnBuyT2UpgradePotency", resources.d.amt >= t2UpgradePotencyCost);

	var prestigeGain = getPrestigeGain(3) + resources.e.symbol;
	setElementText("divPrestige3Gain", prestigeGain);
	
	var prestigeCost = getPrestigeCost(3)
	setElementText("btnPrestige3", "Ascend ({0}{1})".format(prestigeCost, resources.d.symbol));
	setButtonAffordableClass("btnPrestige3", resources.d.amt >= prestigeCost)

	var t3Upgrades = minionUpgradeTypes[3];
	for(var minionType in baseMinion){
		for(var i=0;i<t3Upgrades.length; i++){
			var btnId = "btnUpg{0}{1}".format(minionType, t3Upgrades[i]);
			var cost = getUpgradeCost(minionType, t3Upgrades[i]);
			var text = "{0} ({1}{2})".format(minionType, cost, resources.d.symbol);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, resources.d.amt >= cost);
		}
	}
	
	var baseUnlockCost = unlockBossCost();
	for(var bossType in baseBoss){
		var unlockId = "btnUnlock{0}".format(bossType);
		if(bossResearch[bossType].isUnlocked){
			document.getElementById(unlockId).style.display = "none";
		}
		else{
			document.getElementById(unlockId).style.display = null;
			var cost = baseUnlockCost + baseBoss[bossType].unlockCost;
			var unlockText = "Unlock {0} ({1}{2})".format(bossType, cost, resources.d.symbol);
			
			setElementText(unlockId, unlockText);
			setButtonAffordableClass(unlockId, resources.d.amt >= cost);
		}
	}
	
	for(var bossType in baseBoss){
		var enhanceListId = "div{0}EnhanceList".format(bossType);
		if(!bossResearch[bossType].isUnlocked){
			document.getElementById(enhanceListId).style.display = "none";
			continue;
		}
		document.getElementById(enhanceListId).style.display = null;
		var upgrades = bossUpgrades[bossType];
		for(var upgradeType in upgrades){
			var cost = getEnhanceCost(bossType, upgradeType);
			var btnId = "btnUpg{0}{1}".format(bossType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.d.symbol);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.d.amt);
		}
	}
}
function updateAchievements(){
	for(var type in achievements){
		var id = "divAch"+type

		var lvl = getAchievementLevel(type);
		var next = getAchievementNext(type);
		var headerText = "{0} : {1}".format(achievements[type].name, lvl);
		setElementText(id+"Header", headerText);
		
		var bodyText = "{0}/{1}".format(achievements[type].count, next);
		setElementText(id+"Body", bodyText);
	}
}
function updateOptionsTab(){
	for(var gaugeType in gauges){
		if(!gauges[gaugeType].isUnlocked){
			setButtonAffordableClass("btnUnlock" + gaugeType, gauges[gaugeType].cost <= resources.b.amt)

			var row = document.getElementById("rowUnlock" + gaugeType);
			row.style.display = null;

			var row = document.getElementById("row" + gaugeType);
			row.style.display = "none";

		}
		else{
			var row = document.getElementById("rowUnlock" + gaugeType);
			row.style.display = "none";

			var row = document.getElementById("row" + gaugeType);
			row.style.display = null;

		}
	}
}

