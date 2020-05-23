//BUGS
//if prestige[1] == 0 don't show boss gauges
//GetNextHeroLevel could be problematic for large range 
	//could adjust or base off of leaderPoint.
//enable new minion spawn when unlocked

//Features
//TODO: autobuy T[n-1] checkboxes in Options
//TODO: adjust hero 'home' based on type templar front line;prophet/cleric backline
//0.8.2

//TODO: add projectile effects (UnitEffects)
//TODO: rename [unitType]Research as it isn't really research.
//0.8.3

//TODO: add tower types 
		//aoe blast 
		//slow
		//flame thrower
//0.8.4

//TODO: option to only draw frame very x cycles
//0.8.5

//TODO: more misc T2 upgrades:
		//Max upgrade++ (initially start at 10)
		//Reduce globalSpawnDelay.
		//boss abilityDelay--
		//boss abilityDuration++
//0.8.7
		
		
//TODO: equipment - drops from hero, equip on bosses
		//put on boss tab
			//attributes:
				//persistent = remain after T2reset
				//+boss core stats (hp,dmg,rate,speed,range)
				//+boss enchancements (aura range/power, ability cooldown/duration)
				//+resource gain
				//+max minions
				//specials (overkill bonus, bonus vs hero, bonus vs tower, aura)
			//sets with special effects/auras/abilites??

//0.9.0

//TODO: achievements
//		Total Minons Spawned: Boss boost
//		Total Towers killed: resource.a++
//		Total Heroes killed: resource.b++
//		Total Regroups: cost resource.a--
//		Total Promotes: cost resource.b--
//		Max Hero Level killed: Equip rarity drop boost
//TODO: new hero symbol in info tab
//TODO: unit type symbols for colorblind mode
//TODO: team indication (#/color?) in header on info page
//TODO: hide boss gauge checkboxes until bosses are unlocked
//TODO: display more details on info page (hover/click/idk)
//0.9.5

//TODO: T2 prestige to gain some type of stat multiplier (team1 -level or team0 +level).
//TODO: balance config.js
//TODO: get secret testers/balance game.
	//Adjust help tab based on feedback
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
	Quality = GetQuality();
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
	
	updateAutosave();
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
	
	var qPercent = lastGlobalSpawn * 100 / getGlobalSpawnDelay();
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
			document.getElementById("div{0}SpawnBackground".format(bossType)).style.display = null;
			
			var delay = getBossSpawnDelay(bossType)
			var lastSpawn = bossResearch[bossType].lastSpawn;
			var percent = (lastSpawn / delay) * 100;
			percent = Math.min(100, percent);
			document.getElementById("div{0}SpawnProgress".format(bossType)).style.width = percent + "%";
		}
		else{
			document.getElementById(unlockId).style.display = null;
			document.getElementById(selectId).style.display = "none";
			document.getElementById(selectId+"Label").style.display = "none";
			document.getElementById("div{0}SpawnBackground".format(bossType)).style.display = "none";
			
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
	
	var p = 0;
	var btn = document.getElementById("divBossActiveAbility")
	var prog = document.getElementById("divBossActiveAbilityProgress")

	if(boss.remainingDuration >= 0){
		boss.remainingDuration = Math.max(boss.remainingDuration, 0);
		p = 100 * boss.remainingDuration / boss.abilityDuration;

		btn.classList.add('bossButtonActive'); 
		btn.classList.remove('bossButtonAvailable'); 
		btn.classList.remove('bossButtonUnavailable'); 
	}
	else{
		boss.lastActiveAbility = Math.min(boss.lastActiveAbility, boss.abilityCooldown)
		p = 100 * boss.lastActiveAbility / boss.abilityCooldown;

		if(p == 100){
			btn.classList.add('bossButtonAvailable'); 
			btn.classList.remove('bossButtonUnavailable'); 
		}
		else{
			btn.classList.add('bossButtonUnavailable'); 
			btn.classList.remove('bossButtonAvailable'); 
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

