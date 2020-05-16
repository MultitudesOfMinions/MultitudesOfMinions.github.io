//BUGS
//zoom breaks drawing.

//Features
//TODO: switch from xRange/yRange to just attackRange. with fixed width/height ratio it should just be a circle
//TODO: make auras circular-ish
//TODO: progress bar for minion q.
//TODO: bosses 
	//Boss tab create
		//aggression slider = 0-25
			//(x-aggression)*pathL behind leader
			//minX = pathL

		//Active ability button

	//Boss.js
		//Active ability
		//Passive ability
		
	//Test bosses
//0.8.0

//TODO: auto-buy T(n-1) upgrade in options after promote. will buy any Tn-1 upgrade as it is affordable.
		//Cheap, T0 autobuy resets when gauges reset.
//TODO: Make quality drop down:
	//high = current
	//med = only draw color (skip color2)/draw simple path, don't draw impacts.
	//low = don't draw canvas
//TODO: make 'clear Q' button
//TODO: max Q size = 10
//TODO: unit boon/condition timers for attribute, duration, strength.
//TODO: projectile color based on team/type. 
		//Team0: all blue
		//Team1: based on projectile type red/yellow/orange 
		//projectile type object in config
//0.8.5

//TODO: equipment - drops from hero, equip on bosses
		//put on boss tab
//TODO: add minion types: 
		//Each one specialize in 1 of upgradeType 
		//ground: Mite(suck, spawnTime), minotaur(moveSpeed), Catapault (slow, long range), Golem(high hp)
		//flying: Manticore(damage), Vampire(attackRate), Bomber(slow, large aoe)
//TODO: add tower types 
		//aoe blast 
		//slow
		//flame thrower
//TODO: more misc T2 upgrades:
		//Max upgrade++ (initially start at 10?)
		//Reduce globalSpawnDelay.
		//boss abilityDelay--
		//boss abilityDuration++
//0.9.0

//TODO: achievements
//		Total Minons Spawned: Boss boost
//		Total Towers killed: resource.a++
//		Total Heroes killed: resource.b++
//		Total Regroups: cost resource.a--
//		Total Promotes: cost resource.b--
//		Max Hero Level killed: Equip rarity drop boost
//TODO: accept cookies bottom banner over save.
		//only allow save if they accept. else they can just export.
//TODO: unit type symbols for colorblind mode
//TODO: team indication (#/color?) in header on info page
//TODO: redo offline resource gain 
//0.9.5

//TODO: T2 prestige to gain some type of stat multiplier (team1 -level or team0 +level).
//TODO: balance config.js
//TODO: get secret testers/balance game.
//1.0.0

//TODO: announce on r/incrementalgames or some such.

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
	return temp.replace(/([A-Z])/g, ' $1').trim();
}

function setButtonAffordableClass(id, isAffordable){
	var e = document.getElementById(id);
	if(e == null){
		console.error(id + " element not found");
		return;
	}

	if(isAffordable){
		e.classList.add('affordableUpg'); 
		e.classList.remove('upg'); 
	}
	else{ 
		e.classList.add('upg'); 
		e.classList.remove('affordableUpg'); 
	}
}

function update(){
	updatePnl1();
	

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
	
	//Draw all the stuffs in the correct order.
	draw();
	
	if(autoSave){
		lastSave++;
		var saveTime = 3000;
		if(lastSave > saveTime){//approx 1 minute
			saveData();
		}
		document.getElementById("divAutoSaveProgress").style.width = (lastSave / saveTime) * 100 + "%"; 
	}
}

function updatePnl1(){
	var resourceDisplay = "{0}:{1}{2}".format(resources.a.name , Math.floor(resources.a.amt), resources.a.symbol);
	setElementText("divT0Resource", resourceDisplay);
	toggleTierItems();
	if(document.getElementById("divMinionDashboard").style.display != 'none'){
		updateMinionSpawns();
		updateMinionDashboard();
	}
	else if(document.getElementById("divT0Upgrades").style.display != 'none'){
		updateT0Upgrades();
	}
	else if(document.getElementById("divT1Upgrades").style.display != 'none'){
		updateT1Upgrades();
	}
	else if(document.getElementById("divT2Upgrades").style.display != 'none'){
		updateT2Upgrades();
	}
	else if(document.getElementById("divBossArea").style.display != 'none'){
		updateBossTab();
	}
	else if(document.getElementById("divInfo").style.display != 'none'){}
	else if(document.getElementById("divOptions").style.display != 'none'){
		updateGaugesTable();
	}
}
function toggleTierItems(){
	var t1Elements = document.getElementsByClassName("t1");
	var t2Elements = document.getElementsByClassName("t2");

	if(prestigeCounts[0] || prestigeCounts[1]){
		for(var i=0;i<t1Elements.length;i++){
			t1Elements[i].style.display=null;
		}

		var resourceDisplay = "{0}:{1}{2}".format(resources.b.name, Math.floor(resources.b.amt), resources.b.symbol);
		setElementText("divT1Resource", resourceDisplay);
	}
	else{
		for(var i=0;i<t1Elements.length;i++){
			t1Elements[i].style.display="none";
		}
	}
	
	if(prestigeCounts[1]){
		for(var i=0;i<t2Elements.length;i++){
			t2Elements[i].style.display=null;
		}

		var resourceDisplay = "{0}:{1}{2}".format(resources.c.name, Math.floor(resources.c.amt), resources.c.symbol);
		setElementText("divT2Resource", resourceDisplay);
	}
	else{
		for(var i=0;i<t2Elements.length;i++){
			t2Elements[i].style.display="none";
		}
	}
}

function updateMinionSpawns(){
	
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
	var minionCounter = "{0}/{1}".format(minions.length, getMaxMinions());
	setElementText("lblMinionCounter", minionCounter);
	
	if(addMinionQ.length == 0){
		setElementText("lblMinionQ", "");
	}
	else{
		var minionQ = "Queue: " + addMinionQ.join(", ");
		setElementText("lblMinionQ", minionQ);
	}
	
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
			
		}
		else {
			document.getElementById("divMinionListItem" + i).style.color = minions[minionOrder[i]].color;
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
		var unlockId = "btnUnlock{0}".format(bossType);
		var selectId = "select{0}".format(bossType);
		if(bossResearch[bossType].isUnlocked){
			document.getElementById(selectId).style.display = null;
			document.getElementById(selectId+"Label").style.display = null;
			document.getElementById(unlockId).style.display = "none";
			
			var delay = getBossSpawnDelay(bossType)
			var lastSpawn = bossResearch[bossType].lastSpawn;
			var percent = (lastSpawn / delay) * 100;
			document.getElementById("div{0}SpawnProgress".format(bossType)).style.width = percent + "%";
		}
		else{
			document.getElementById(unlockId).style.display = null;
			document.getElementById(selectId).style.display = "none";
			document.getElementById(selectId+"Label").style.display = "none";
			
			var cost = baseUnlockCost + baseBoss[bossType].unlockCost;
			var unlockText = "Unlock {0} ({1}{2})".format(bossType, cost, resources.c.symbol);
			
			setElementText(unlockId, unlockText);
			setButtonAffordableClass(unlockId, resources.c.amt >= cost);
		}
	}
	
	if(boss == null){
		document.getElementById("ulBossStats").style.display = "none";
		document.getElementById("divBossControls").style.display = "none";
		return;
	}
	document.getElementById("ulBossStats").style.display = null;
	document.getElementById("divBossControls").style.display = null;
	
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
				text = "{0}: {1}".format(bossInfoItems[i], boss[bossInfoItems[i]]);
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
			var btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.a.symbol);

			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.a.amt);
		}
		
	}
}
function updateT1Upgrades(){
	var prestigeGain = getPrestigeGain(1) + resources.c.symbol;
	setElementText("divPrestige1Gain", prestigeGain);
	
	var prestigeCost = getPrestigeCost(1)
	setElementText("btnPrestige1", "Promote ({0}{1})".format(prestigeCost, resources.b.symbol));
	setButtonAffordableClass("btnPrestige1", resources.b.amt >= prestigeCost)

	
	var t1Upgrades = minionUpgradeTypes[1];

	var maxMinionsCost = getMaxMinionCost();
	var maxMinionsText = "Max Minions++ ({0}{1})".format(maxMinionsCost, resources.b.symbol);
	setElementText("btnBuyMaxMinions", maxMinionsText);
	setButtonAffordableClass("btnBuyMaxMinions", resources.b.amt >= maxMinionsCost);
	
	var t0UpgradePotencyCost = getCostPotencyCost(0);
	var t0UpgradePotencyText = "T0 Upgrade Potency ({0}{1})".format(t0UpgradePotencyCost, resources.b.symbol);
	setElementText("btnBuyT0UpgradePotency", t0UpgradePotencyText)
	setButtonAffordableClass("btnBuyT0UpgradePotency", resources.b.amt >= t0UpgradePotencyCost);


	var baseUnlockMinionCost = unlockMinionCost();
	for(var minionType in baseMinion)
	{
		if(minionResearch[minionType].isUnlocked){
			var unlockBtn = document.getElementById("btnUnlock{0}".format(minionType));
			unlockBtn.style.display = "none";
			
			var t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
			t1UpgradeList.style.display = null;
			
			for(var i=0;i<t1Upgrades.length; i++){
				var upgradeType = t1Upgrades[i]
				var cost = getUpgradeCost(minionType, upgradeType);
				var btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
				var text = "{0} ({1}{2})".format(upgradeType,cost,resources.b.symbol);
				
				setElementText(btnId, text);
				setButtonAffordableClass(btnId, cost <= resources.b.amt);
			}
		}
		else{
			var unlockBtnId = "btnUnlock{0}".format(minionType);
			var unlockBtn = document.getElementById(unlockBtnId);
			unlockBtn.style.display = null;
			
			var cost = baseUnlockMinionCost + getMinionBaseStats(minionType).unlockCost
			setButtonAffordableClass(unlockBtnId, cost <= resources.b.amt);

			var unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.b.symbol);
			setElementText(unlockBtnId, unlockText)
			
			var t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
			t1UpgradeList.style.display = "none";
		}
	}
}
function updateT2Upgrades(){
	var t2Upgrades = minionUpgradeTypes[2];

	var t1UpgradePotencyCost = getCostPotencyCost(1);
	var t1UpgradePotencyText = "T1 Upgrade Potency ({0}{1})".format(t1UpgradePotencyCost, resources.c.symbol);
	setElementText("btnBuyT1UpgradePotency", t1UpgradePotencyText)
	setButtonAffordableClass("btnBuyT1UpgradePotency", resources.c.amt >= t1UpgradePotencyCost);

	for(var minionType in baseMinion)
	{
		for(var i=0;i<t2Upgrades.length; i++){
			var upgradeType = t2Upgrades[i]
			var cost = getUpgradeCost(minionType, upgradeType);
			var btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.c.symbol);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.c.amt);
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
			var text = "{0} ({1}{2})".format(upgradeType,cost,resources.c.symbol);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.c.amt);
		}
	}
}
function updateGaugesTable(){
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

