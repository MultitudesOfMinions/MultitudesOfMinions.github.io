"use strict";
//eyJ0IjoyNzgyMTYsInIiOnsiYSI6Mjg3LCJjIjo5LCJkIjoyfSwibXIiOnsibSI6ODUsImMiOjM0OSwiaCI6MTcsInYiOjE0NiwiYSI6MjM4LCJlIjo1OTksImYiOjAsInciOjIxN30sIm11Ijp7Im0iOnsiaHAiOjQsImQiOjMsIm1zIjo2LCJhdCI6Niwic3IiOjMsImFnIjozLCJzZCI6MywiaSI6M30sImIiOnsibXMiOjMsImF0IjozLCJzciI6MywiYWciOjMsInNkIjozLCJpIjozfSwiYyI6eyJocCI6MywiZCI6MywibXMiOjMsImF0IjozLCJzciI6MywiYWciOjMsInNkIjozLCJpIjozfSwiZyI6eyJtcyI6MywiYXQiOjMsInNyIjozLCJhZyI6Mywic2QiOjMsImkiOjN9LCJoIjp7ImhwIjozLCJkIjozLCJtcyI6MywiYXQiOjMsInNyIjozLCJhZyI6Mywic2QiOjMsImkiOjN9LCJyIjp7Im1zIjozLCJhdCI6Mywic3IiOjMsImFnIjozLCJzZCI6MywiaSI6M30sInYiOnsiaHAiOjMsImQiOjMsIm1zIjozLCJhdCI6Mywic3IiOjMsImFnIjozLCJzZCI6MywiaSI6M30sImEiOnsiaHAiOjMsImQiOjMsIm1zIjozLCJhdCI6Mywic3IiOjMsImFnIjozLCJzZCI6MywiaSI6M30sImUiOnsiaHAiOjMsImQiOjMsIm1zIjozLCJhdCI6Mywic3IiOjMsImFnIjozLCJzZCI6MiwiaSI6Mn0sImYiOnsiaHAiOjMsImQiOjMsIm1zIjozLCJhdCI6Mywic3IiOjMsImFnIjoyLCJzZCI6MiwiaSI6Mn0sInciOnsiaHAiOjMsImQiOjMsIm1zIjozLCJhdCI6Mywic3IiOjMsImFnIjoyLCJzZCI6MiwiaSI6Mn19LCJiciI6eyJkZSI6MH0sImEiOnsiQW0iOjE5LCJBdCI6MjUyLCJBayI6NDg5OCwiQTAiOjEsIkExIjo2LCJBMiI6MSwiQWwiOjh9LCJ0bSI6eyJ0MCI6eyJhYiI6MX0sInQxIjp7ImFiIjoxLCJwIjoyfSwidDIiOnsiYWIiOjF9fSwibSI6eyJsIjoxLCJtbSI6MSwidWwiOjksImdzciI6OH19
//BUGS:

//MISC:
//optimize FF GC: https://stackoverflow.com/questions/18364175/best-practices-for-reducing-garbage-collector-activity-in-javascript

//TEST:
//attack Charges

//FEATURES:
//TODO: change how ruins are made a bit
	//add a bit of fire color
	//add some smoke blobs
	//make a bit jaggedy
	//tip over flag?
		//https://stackoverflow.com/questions/3167928/drawing-rotated-text-on-a-html5-canvas
		//context.save();
		//context.translate(newx, newy);
		//context.rotate(-Math.PI/2);
		//context.textAlign = "center";
		//context.fillText("Your Label Here", labelXposition, 0);
		//context.restore();
//0.8.9

//TODO: item db
//TODO: equipment - drops from hero, equip on bosses
		//put equiped effects on boss tab
		//Forge: 
			//use drag/drop:https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
			//upgrade stat
			//re-roll stat
			//scrap to get Womba 
				//Used to upgrade rarity: same type next tier
			//upgrade Rarity
				//need Womba
//TODO: show boss active blessing/curses
	//new panel with equipment effects
//0.9.0

//TODO: Mark boss Position target on path
	//put boss icon
//TODO: Mark leaderPoint on map
	//draw path darker before leaderPoint
//TODO: tower/hero/minion active effects
//0.9.1

//TODO: change skip frames to target fps
	//adjust movement based on delay
	//adjust spawn based on delay
	//adjust attack rate based on delay
//0.9.2

//Store
	//unlocks when get Womba
	//buy transient blessings/bombs
		//drag onto canvas??
	//item chests
//0.10.0

//TODO: get some testers/balance game.
	//Adjust help tab based on feedback
	//Adjust config based on feedback
//TODO: look into high quality graphics??
//1.0.0

//TODO: link on r/incrementalgames or some such.

//https://youtu.be/33MVXDXyMFY?t=280

function setElementText(id, text)  {
	if(id == null) {
		console.error("id cannot be null");
		return;
	}
	const e = document.getElementById(id);
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
	const temp = this.charAt(0).toUpperCase() + this.slice(1);
	return temp.replace(/([A-Z])/g, " $1").trim();
}

function setButtonAffordableClass(id, isAffordable){
	const e = document.getElementById(id);
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

const frameCount = 0;
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
	checkLevelComplete();

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

function checkLevelComplete(){
	if(hero === null && squire === null && page === null){
		achievements.maxLevelCleared.count = Math.max(achievements.maxLevelCleared.count, level);
		level++;
		levelStartX = getEndOfLevelX(level-1);
		levelEndX = getEndOfLevelX(level);
		addHero();
	}
}

function updateResourceDisplay(){
	const a = "{0}:{1}{2}".format(resources.a.name, Math.floor(resources.a.amt), resources.a.symbol);
	setElementText("divT0Resource", a);

	const b = "{0}:{1}{2}".format(resources.b.name, Math.floor(resources.b.amt), resources.b.symbol);
	setElementText("divT1Resource", b);

	const c = "{0}:{1}{2}".format(resources.c.name, Math.floor(resources.c.amt), resources.c.symbol);
	setElementText("divT2Resource", c);

	const d = "{0}:{1}{2}".format(resources.d.name, Math.floor(resources.d.amt), resources.d.symbol);
	setElementText("divT3Resource", d);

	const e = "{0}:{1}{2}".format(resources.e.name, Math.floor(resources.e.amt), resources.e.symbol);
	setElementText("divT4Resource", e);
}

let fCount = 0;
let lastFps = 0;
let s = 0;
let averageFps = 0;
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
	for(let i=0;i<hilites.length;i++){
		hilites[i].count++;
		if(hilites[i].count > hilites[i].limit){
			const id = hilites[i].id
			const e = document.getElementById(id);
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
	const h = hilites.filter(x => x.id == id);
	if(h.length > 0){
		const index = hilites.indexOf(h[0]);
		hilites.splice(index,1);
		const e = document.getElementById(id);
		if(e != null){
			e.classList.remove("mnuHilite");
		}
	}
}

function doAutobuy(){
	for(let key in tierMisc){
		if(!tierMisc[key].autobuy.isUnlocked){continue;}
		if(!isAutoBuy(key)){continue;}
		let lowestLevel = 9999;
		
		const upgrades = minionUpgradeTypes[tierMisc[key].tier];
		for(let minion in minionResearch){
			if(key == "t0" && !minionResearch[minion].isUnlocked){continue;}
			
			for(let upgrade in upgrades){
				lowestLevel = Math.min(lowestLevel, minionUpgrades[minion][upgrades[upgrade]])
			}
		}
		
		for(let minion in minionResearch){
			if(key == "t0" && !minionResearch[minion].isUnlocked){continue;}
			
			for(let upgrade in upgrades){
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
		const saveTime = 1000;
		if(lastSave > saveTime){//approx 1 minutes
			saveData();
		}
		document.getElementById("divAutoSaveProgress").style.width = (lastSave / saveTime) * 100 + "%"; 
	}
}

function updatePnl1(){
	const resourceDisplay = "{0}:{1}{2}".format(resources.a.name , Math.floor(resources.a.amt), resources.a.symbol);
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
	for(let i=0;i<5;i++){
		const elements = document.getElementsByClassName("t"+i);
		const unlocked = tierUnlocked(i);
		
		for(let j=0;j<elements.length;j++){
			elements[j].style.display = unlocked ? null : "none";
		}
	}
	
	for(let key in tierMisc){
		const btn = document.getElementById("btnUnlockAutobuy" + key);
		const chk = document.getElementById("divAutobuy" + key);
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
	const qPercent = Math.min(100, lastGlobalSpawn / getGlobalSpawnDelay() * 100);
	document.getElementById("divQProgress").style.width = qPercent + "%";
	
	for(let minionType in minionResearch){
		if(minionResearch[minionType].isUnlocked){
			const spawn = document.getElementById("div{0}Spawn".format(minionType));
			spawn.style.display = null;

			const lastSpawn = minionResearch[minionType].lastSpawn;
			const spawnDelay = getMinionSpawnDelay(minionType);

			const percent = Math.min(100, Math.floor(lastSpawn / spawnDelay * 100));
			const e = document.getElementById("div{0}SpawnProgress".format(minionType));
			if(e != null){
				e.style.width = percent + "%";
			}
		}
		else{
			const e = document.getElementById("div{0}Spawn".format(minionType));
			e.style.display = "none";
		}
	}
}
function updateMinionDashboard(){
	const minionCounter = "{0}/{1}".format(getMinionCount(), getMaxMinions());
	setElementText("lblMinionCounter", minionCounter);
	
	const minionQ = "Baracks ({0}/10): {1}".format(addMinionQ.length, addMinionQ.join(", "));
	setElementText("lblMinionQ", minionQ);
	
	//check if is changed before updating minion info
	const minionList = document.getElementById("divMinionList");
	const minionListCount = minionList.childNodes.length;
	for(let i=0; i< minionOrder.length; i++){
		//build div html
		const minionInfo = "#{2}|HP:{0}|DMG:{1}"
				.format(Math.ceil(minions[minionOrder[i]].health), 
						Math.floor(minions[minionOrder[i]].damage),
						i);

		//check if it exists
		const minionCard = document.getElementById("divMinionListItem" + i);
		if(minionCard == null){
			const newMinion = createNewElement("div", "divMinionListItem" + i, minionList, ["minionBlock"], minionInfo);
			newMinion.style.color = minions[minionOrder[i]].color;
			newMinion.style.backgroundColor = minions[minionOrder[i]].color2
			
		}
		else {
			
			if(isColorblind()){
				document.getElementById("divMinionListItem" + i).style.color = GetColorblindColor();
				document.getElementById("divMinionListItem" + i).style.backgroundColor = GetColorblindBackgroundColor();
			}
			else{
				document.getElementById("divMinionListItem" + i).style.color = minions[minionOrder[i]].color;
				document.getElementById("divMinionListItem" + i).style.backgroundColor = minions[minionOrder[i]].color2;
			}
			setElementText("divMinionListItem" + i, minionInfo);
		}
		
	}
	
	//remove extra minion cards
	while(minionList.childNodes.length > minionOrder.length){
		minionList.removeChild(minionList.lastChild)
	}
}
function updateBossTab(){
	
	const baseUnlockCost = unlockBossCost();
	for(let bossType in baseBoss){
		const selectId = "select{0}".format(bossType);
		if(bossResearch[bossType].isUnlocked){
			document.getElementById(selectId).style.display = null;
			document.getElementById(selectId+"Label").style.display = null;
			document.getElementById("div{0}SpawnBackground".format(bossType)).style.display = null;
			
			const delay = getBossSpawnDelay(bossType)
			const lastSpawn = bossResearch[bossType].lastSpawn;
			const percent = Math.min(100, (lastSpawn / delay) * 100);
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
		document.getElementById("divBossActiveAbilityProgress").style.width = "0%";
		document.getElementById("chkAutocast").disabled = "true";
		document.getElementById("divBossActiveAbility").classList.add("bossButtonDisabled");
		return;
	}
	document.getElementById("ulBossStats").style.display = null;
	document.getElementById("chkAutocast").removeAttribute("disabled");
	document.getElementById("divBossActiveAbility").classList.remove("bossButtonDisabled");
	
	let p = 0;
	const btn = document.getElementById("divBossActiveAbility")
	const prog = document.getElementById("divBossActiveAbilityProgress")

	if(boss.remainingDuration >= 0){
		boss.remainingDuration = Math.max(boss.remainingDuration, 0);
		p = 100 * boss.remainingDuration / boss.abilityDuration;

		btn.classList.add("bossButtonActive"); 
		btn.classList.remove("bossButtonAvailable"); 
		btn.classList.remove("bossButtonUnavailable"); 
	}
	else{
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
	
	const bossInfoItems = [statTypes.health, statTypes.damage, statTypes.attackRate, statTypes.attackRange, statTypes.moveSpeed, statTypes.auraRange, statTypes.auraPower, "auraInfo", "passiveAbilityInfo", "activeAbilityInfo" ];
	for(let i=0;i<bossInfoItems.length;i++){
		const id = "spanBoss"+bossInfoItems[i];
		switch(bossInfoItems[i]){
			case statTypes.health:
			case statTypes.damage:
			case statTypes.attackRate:
			case statTypes.attackRange:
			case statTypes.moveSpeed:
			case statTypes.auraRange:
			case statTypes.auraPower:{
				const rounded = Math.floor(boss[bossInfoItems[i]]*100)/100;
				const text = "{0}: {1}".format(bossInfoItems[i], rounded);
				setElementText(id, text);
				break;
			}
			case "auraInfo":
			case "passiveAbilityInfo":
			case "activeAbilityInfo":{
				const text = baseBoss[boss.type][bossInfoItems[i]];
				setElementText(id, text);
				break;
			}
		}
	}
	
}
function updateT0Upgrades(){
	const prestigeGain = getPrestigeGain(0) + resources.b.symbol;
	setElementText("divPrestige0Gain", prestigeGain);
		
	const prestigeCost = getPrestigeCost(0)
	setElementText("btnPrestige0", "Regroup ({0}{1})".format(prestigeCost, resources.a.symbol));
	setButtonAffordableClass("btnPrestige0", resources.a.amt >= prestigeCost)
	
	const t0UpgradeTable = document.getElementById("divMinionT0UpgradeTable");
	const t0Upgrades = minionUpgradeTypes[0];

	for(let minionType in baseMinion)
	{
		const t0UpgradeListId = "div{0}T0UpgradeList".format(minionType);
		const t0UpgradeList = document.getElementById(t0UpgradeListId);

		if(!minionResearch[minionType].isUnlocked){ 
			t0UpgradeList.style.display = "none";
			continue; 
		}
		t0UpgradeList.style.display = null;
		
		for(let i=0;i<t0Upgrades.length; i++){
			const upgradeType = t0Upgrades[i]
			const cost = getUpgradeCost(minionType, upgradeType);
			let text = "{0} ({1}{2})".format(upgradeType,cost,resources.a.symbol);
			if(cost == Infinity){
				text = "{0} (Max Level )".format(upgradeType)
			}
			
			const btnId = "btnUpg{0}{1}".format(minionType, upgradeType);

			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.a.amt);
		}
		
	}
}
function updateT1Upgrades(){
	const prestigeGain = getPrestigeGain(1) + resources.c.symbol;
	setElementText("divPrestige1Gain", prestigeGain);
	
	const prestigeCost = getPrestigeCost(1)
	setElementText("btnPrestige1", "Evolve ({0}{1})".format(prestigeCost, resources.b.symbol));
	setButtonAffordableClass("btnPrestige1", resources.b.amt >= prestigeCost)

	
	const t1Upgrades = minionUpgradeTypes[1];

	const maxMinionsCost = getMaxMinionCost();
	const maxMinionsText = "Max Minions++ ({0}{1})".format(maxMinionsCost, resources.b.symbol);
	setElementText("btnBuyMaxMinions", maxMinionsText);
	setButtonAffordableClass("btnBuyMaxMinions", resources.b.amt >= maxMinionsCost);
	
	const t0UpgradePotencyCost = getPotencyCost(0);
	const t0UpgradePotencyText = "Armory Effectiveness ({0}{1})".format(t0UpgradePotencyCost, resources.b.symbol);
	setElementText("btnBuyT0UpgradePotency", t0UpgradePotencyText)
	setButtonAffordableClass("btnBuyT0UpgradePotency", resources.b.amt >= t0UpgradePotencyCost);


	for(let minionType in baseMinion)
	{
		if(minionResearch[minionType].isUnlocked){
			if(minionResearch[minionType].unlockT == 1){
				const unlockBtn = document.getElementById("btnUnlock{0}".format(minionType));
				unlockBtn.style.display = "none";
			}
			
			const t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
			t1UpgradeList.style.display = null;
			
			for(let i=0;i<t1Upgrades.length; i++){
				const upgradeType = t1Upgrades[i]
				const cost = getUpgradeCost(minionType, upgradeType);
				let text = "{0} ({1}{2})".format(upgradeType,cost,resources.b.symbol);
				if(cost == Infinity){
					text = "{0} (Max Level )".format(upgradeType)
				}

				const btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
				
				setElementText(btnId, text);
				setButtonAffordableClass(btnId, cost <= resources.b.amt);
			}
		}
		else if(minionResearch[minionType].unlockT==1){
			const unlockBtnId = "btnUnlock{0}".format(minionType);
			const unlockBtn = document.getElementById(unlockBtnId);
			unlockBtn.style.display = null;
			
			const cost = unlockMinionCost(minionType);
			setButtonAffordableClass(unlockBtnId, cost <= resources.b.amt);

			const unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.b.symbol);
			setElementText(unlockBtnId, unlockText)
			
			const t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
			t1UpgradeList.style.display = "none";
		}
	}
}
function updateT2Upgrades(){
	const prestigeGain = getPrestigeGain(2) + resources.d.symbol;
	setElementText("divPrestige2Gain", prestigeGain);
	
	const prestigeCost = getPrestigeCost(2)
	setElementText("btnPrestige2", "Promote ({0}{1})".format(prestigeCost, resources.c.symbol));
	setButtonAffordableClass("btnPrestige2", resources.c.amt >= prestigeCost)
	
	const t2Upgrades = minionUpgradeTypes[2];

	const t1UpgradePotencyCost = getPotencyCost(1);
	const t1UpgradePotencyText = "Gym Effectiveness ({0}{1})".format(t1UpgradePotencyCost, resources.c.symbol);
	setElementText("btnBuyT1UpgradePotency", t1UpgradePotencyText)
	setButtonAffordableClass("btnBuyT1UpgradePotency", resources.c.amt >= t1UpgradePotencyCost);
	
	const maxUpgradeLevelCost = getMaxUpgradeLevelCost();
	const maxUpgradeLevelText = "Upgrade Limit++ ({0}{1})".format(maxUpgradeLevelCost, resources.c.symbol);
	setElementText("btnBuyMaxUpgradeLevel", maxUpgradeLevelText);
	setButtonAffordableClass("btnBuyMaxUpgradeLevel", resources.c.amt >= maxUpgradeLevelCost);
	
	const globalSpawnDelayCost = getGlobalSpawnDelayReductionCost();
	const globalSpawnDelayText = "Reduce Deploy Time ({0}{1})".format(globalSpawnDelayCost, resources.c.symbol);
	setElementText("btnBuyGlobalSpawnDelay", globalSpawnDelayText);
	setButtonAffordableClass("btnBuyGlobalSpawnDelay", resources.c.amt >= globalSpawnDelayCost);

	for(let minionType in baseMinion)
	{
		for(let i=0;i<t2Upgrades.length; i++){
			const upgradeType = t2Upgrades[i]
			const cost = getUpgradeCost(minionType, upgradeType);
			const text = "{0} ({1}{2} )".format(upgradeType,cost,resources.c.symbol);
			if(cost == Infinity){
				text = "{0} (Max Level)".format(upgradeType)
			}
			
			const btnId = "btnUpg{0}{1}".format(minionType, upgradeType);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.c.amt);
		}
		
		if(minionResearch[minionType].unlockT==2){
			if(minionResearch[minionType].isUnlocked){
				const unlockBtn = document.getElementById("btnUnlock{0}".format(minionType));
				unlockBtn.style.display = "none";
			}
			else{
				const unlockBtnId = "btnUnlock{0}".format(minionType);
				const unlockBtn = document.getElementById(unlockBtnId);
				unlockBtn.style.display = null;
				
				const cost = unlockMinionCost(minionType);
				setButtonAffordableClass(unlockBtnId, cost <= resources.c.amt);

				const unlockText = "Unlock {0} ({1}{2})".format(minionType,cost,resources.c.symbol);
				setElementText(unlockBtnId, unlockText)
				
				const t1UpgradeList = document.getElementById("div{0}T1UpgradeList".format(minionType));
				t1UpgradeList.style.display = "none";
			}
		}
		
	}

}
function updateT3Upgrades(){

	const t2UpgradePotencyCost = getPotencyCost(2);
	const t2UpgradePotencyText = "Lab Effectiveness ({0}{1})".format(t2UpgradePotencyCost, resources.d.symbol);
	setElementText("btnBuyT2UpgradePotency", t2UpgradePotencyText)
	setButtonAffordableClass("btnBuyT2UpgradePotency", resources.d.amt >= t2UpgradePotencyCost);

	const prestigeGain = getPrestigeGain(3) + resources.e.symbol;
	setElementText("divPrestige3Gain", prestigeGain);
	
	const prestigeCost = getPrestigeCost(3)
	setElementText("btnPrestige3", "Ascend ({0}{1})".format(prestigeCost, resources.d.symbol));
	setButtonAffordableClass("btnPrestige3", resources.d.amt >= prestigeCost)

	const t3Upgrades = minionUpgradeTypes[3];
	for(let minionType in baseMinion){
		for(let i=0;i<t3Upgrades.length; i++){
			const btnId = "btnUpg{0}{1}".format(minionType, t3Upgrades[i]);
			const cost = getUpgradeCost(minionType, t3Upgrades[i]);
			const text = "{0} ({1}{2})".format(minionType, cost, resources.d.symbol);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, resources.d.amt >= cost);
		}
	}
	
	const baseUnlockCost = unlockBossCost();
	for(let bossType in baseBoss){
		const unlockId = "btnUnlock{0}".format(bossType);
		if(bossResearch[bossType].isUnlocked){
			document.getElementById(unlockId).style.display = "none";
		}
		else{
			document.getElementById(unlockId).style.display = null;
			const cost = baseUnlockCost + baseBoss[bossType].unlockCost;
			const unlockText = "Unlock {0} ({1}{2})".format(bossType, cost, resources.d.symbol);
			
			setElementText(unlockId, unlockText);
			setButtonAffordableClass(unlockId, resources.d.amt >= cost);
		}
	}
	
	for(let bossType in baseBoss){
		const enhanceListId = "div{0}EnhanceList".format(bossType);
		if(!bossResearch[bossType].isUnlocked){
			document.getElementById(enhanceListId).style.display = "none";
			continue;
		}
		document.getElementById(enhanceListId).style.display = null;
		const upgrades = bossUpgrades[bossType];
		for(let upgradeType in upgrades){
			const cost = getEnhanceCost(bossType, upgradeType);
			const btnId = "btnUpg{0}{1}".format(bossType, upgradeType);
			const text = "{0} ({1}{2})".format(upgradeType,cost,resources.d.symbol);
			
			setElementText(btnId, text);
			setButtonAffordableClass(btnId, cost <= resources.d.amt);
		}
	}
}
function updateAchievements(){
	for(let type in achievements){
		const id = "divAch"+type

		const lvl = getAchievementLevel(type);
		const next = getAchievementNext(type);
		const headerText = "{0} : {1}".format(achievements[type].name, lvl);
		setElementText(id+"Header", headerText);
		
		const bodyText = "{0}/{1}".format(achievements[type].count, next);
		setElementText(id+"Body", bodyText);
	}
}
function updateInfo(){
	if(isColorblind()){
		
	}else{
		
	}
}
function updateOptionsTab(){
	for(let gaugeType in gauges){
		if(!gauges[gaugeType].isUnlocked){
			setButtonAffordableClass("btnUnlock" + gaugeType, gauges[gaugeType].cost <= resources.b.amt)

			document.getElementById("rowUnlock" + gaugeType).style.display = null;
			document.getElementById("row" + gaugeType).style.display = "none";
		}
		else{
			document.getElementById("rowUnlock" + gaugeType).style.display = "none";
			document.getElementById("row" + gaugeType).style.display = null;

		}
	}
}

