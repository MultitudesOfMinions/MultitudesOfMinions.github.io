"use strict";
function UpgradeList(unitType, listId, listElement){
  this.unitType = unitType;
  this.listId = listId;
  this.listElement = listElement;
  this.upgrades = [];
}
function UpgradeIds(upgradeType, button, cost, lvl, maxLvl, potency, perk){
  this.upgradeType = upgradeType
  this.button = button;
  this.cost = cost;
  this.lvl = lvl;
  this.maxLvl = maxLvl;
  this.potency = potency;
  this.perk = perk;
}
function UnlockIds(upgradeType, button, cost){
  this.upgradeType = upgradeType
  this.button = button;
  this.cost = cost;
}
function UnlockList(tier){
  this.tier = tier;
  this.unlocks = [];
}
function PrestigeButton(tier, button, cost, gains){
  this.tier = tier;
  this.button = button;
  this.cost = cost;
  this.gains = gains;
}
function TierMiscButtons(tier){
  this.tier = tier;
  this.buttons = []
}
function MiscButton(type, button, cost){
  this.type = type;
  this.button = button;
  this.cost = cost;
}
function AcheivementElement(type, level, maxCount, count, goal){
  this.type = type;
  this.level = level;
  this.maxCount = maxCount;
  this.count = count;
  this.goal = goal;
}
function BossUIElements(type, select, selectLabel, progress, progressBackground){
  this.type = type;
  this.select = select;
  this.selectLabel = selectLabel;
  this.progress = progress;
  this.progressBackground = progressBackground;
}

const t0Upgrades = [];
const t1Upgrades = [];
const t2Upgrades = [];
const t3Upgrades = [];
const t4Upgrades = [];
const t3BossUpgrades = [];
const unlockButtons = [];
const miscTierButtons = [];
const prestigeButtons = [];
const achievementElements = [];
const bossUIs = [];
const forgeItemButtons = [];

const UIElements = {}
function getUIElement(name){
  if(UIElements[name] === undefined){
    const e = document.getElementById(name);
  	if(e === null){
  	  console.error("UI Element Not Found" + name);
  	  //console.trace();
  		return null;
  	}

    UIElements[name] = e;
  }
  return UIElements[name];
}
function removeUIElement(name){
  const e = getUIElement(name);
  if(e===null){return;}
  e.parentNode.removeChild(e);
}

function MinionSpawnChildren(base, chk, progress){
  this.base = base;
  this.chk = chk;
  this.progress = progress;
}
const minionSpawns = {};

function toggleP1(btn, input){
	const e = document.getElementsByClassName("mnuSelected");
	for(let i=0;i<e.length; i++){e[i].classList.remove("mnuSelected");}

	const pnls = document.getElementsByClassName("p1BlockChild");
	for(let i=0;i<pnls.length; i++){pnls[i].style.display="none";}

	btn.classList.add("mnuSelected");
	getUIElement(input).style.display="flex";
	
	if(btn.id=="btnMnuGym"){
	  if(resources.b.amt > getAutobuyCost(0) && !tierMisc.t0.autobuy.isUnlocked){
	   addHilite("btnautoBuy_1", 3);
	  }
	}
	else if(btn.id=="btnMnuLab"){
	  if(resources.c.amt > getAutobuyCost(1) && !tierMisc.t1.autobuy.isUnlocked){
	   addHilite("btnautoBuy_2", 3);
	  }
	}
	else if(btn.id=="btnMnuOffice"){
	  if(resources.d.amt > getAutobuyCost(2) && !tierMisc.t2.autobuy.isUnlocked){
	   addHilite("btnautoBuy_3", 3);
	  }
	}
	else if(btn.id=="btnMnuForge"){
	  if(resources.e.amt > getAutobuyCost(3) && !tierMisc.t3.autobuy.isUnlocked){
	   addHilite("btnautoBuy_4", 3);
	  }
	  
	  populateForgeItems();
	}
	else if(btn.id=="btnMnuStore"){
	  updateChestStore();
	}
	else if(btn.id=="btnMnuStatistics"){
	  setStats();
	}
	
	delHilite(btn.id);
}

function setColorblind(){
	setActiveStyleSheet("ddlColors");
	
	const elements = document.getElementsByClassName("cbh");
	if(isColorblind()){
		for(let i=0;i<elements.length;i++){
			elements[i].style.display="none";
		}
	}
	else{
		for(let i=0;i<elements.length;i++){
			elements[i].style.display=null;
		}
	}
	
}
function setActiveStyleSheet(id) {
	const ddlColors = getUIElement(id);
	const style = ddlColors.options[ddlColors.selectedIndex].text;
	
	const sheets = document.getElementsByTagName("link");
	for(let i=0;i<sheets.length; i++) {
		if(!sheets[i].getAttribute("rel").includes("stylesheet")){ continue; }
		if(sheets[i].getAttribute("href").includes("Colorblind")){
			sheets[i].disabled = !isColorblind() || !sheets[i].getAttribute("href").includes(style);
		}
		if(!sheets[i].getAttribute("style")){ continue; }

		sheets[i].disabled = sheets[i].getAttribute("style") != style;
	}
}
function GetStyleColor(){
	if(isColorblind()){
		return GetColorblindBackgroundColor();
	}
	return "#" + getUIElement("ddlColors").value;
}
function GetColorblindColor(){
	return window.getComputedStyle(document.body, null).getPropertyValue('color');
}
function GetColorblindBackgroundColor(){
	return window.getComputedStyle(document.body, null).getPropertyValue('background-color');
}

function resetInputs(){
	resetGauges();
	resetAllAutobuy();
	resetMinionSpawns();
	resetSelectedBoss();
	resetOptions();
}
function resetGauges(){
	setShowRangeMinion(false);
	setShowRangeBoss(false);
	setShowRangeTower(false);
	setShowRangeHero(false);
	setShowReloadMinion(false);
	setShowReloadBoss(false);
	setShowReloadTower(false);
	setShowReloadHero(false);
	setShowHealthMinion(false);
	setShowHealthBoss(false);
	setShowHealthTower(false);
	setShowHealthHero(false);
	setShowDamageMinion(false);
	setShowDamageBoss(false);
	setShowDamageTower(false);
	setShowDamageHero(false);
}
function resetAllAutobuy(){
	setAutobuyT0(false);
	setAutobuyT1(false);
	setAutobuyT2(false);
	setAutobuyT3(false);
}
function resetAutobuy(t){
	switch(t){
		case 0:
			setAutobuyT0(false);
			break;
		case 1:
			setAutobuyT1(false);
			break;
		case 2:
			setAutobuyT2(false);
			break;
		case 3:
			setAutobuyT3(false);
			break;
	}
}
function resetOptions(){
	document.getElementById("ddlColors").selectedIndex=0;
	document.getElementById("ddlQuality").selectedIndex=0;
	document.getElementById("ddlP0Rate").selectedIndex=0;
	document.getElementById("ddlP1Rate").selectedIndex = 0;
	document.getElementById("chkShowFPS").checked = false;
	document.getElementById("chkColorblind").checked = false;
	document.getElementById("chkSmipleMinions").checked = true;
	document.getElementById("chkCompactMinions").checked = false;
	document.getElementById("txtExport").value = null;
	document.getElementById("txtImport").value = null;
}

function resetMinionSpawns(){
	for(let minionType in minionResearch){
		if(minionResearch[minionType].isUnlocked){
			document.getElementById("chkSpawn" + minionType).checked = true;
		}
	}
}
function resetSelectedBoss(){
	getUIElement("selectNone").checked = true;
}

function autoCastAbility(){ return getUIElement("chkAutocast").checked; }
function setAutoCastAbility(input){ return getUIElement("chkAutocast").checked = input; }


function showRangeMinion(){ return getUIElement("chkRangeMinion").checked; }
function showRangeBoss(){ return getUIElement("chkRangeBoss").checked; }
function showRangeTower(){ return getUIElement("chkRangeTower").checked; }
function showRangeHero(){ return getUIElement("chkRangeHero").checked; }
function showReloadMinion(){ return getUIElement("chkReloadMinion").checked; }
function showReloadBoss(){ return getUIElement("chkRangeBoss").checked; }
function showReloadTower(){ return getUIElement("chkRangeTower").checked; }
function showReloadHero(){ return getUIElement("chkRangeHero").checked; }
function showHealthMinion(){ return getUIElement("chkHealthMinion").checked; }
function showHealthBoss(){ return getUIElement("chkHealthBoss").checked; }
function showHealthTower(){ return getUIElement("chkHealthTower").checked; }
function showHealthHero(){ return getUIElement("chkHealthHero").checked; }
function showDamageMinion(){ return getUIElement("chkDamageMinion").checked; }
function showDamageBoss(){ return getUIElement("chkDamageBoss").checked; }
function showDamageTower(){ return getUIElement("chkDamageTower").checked; }
function showDamageHero(){ return getUIElement("chkDamageHero").checked; }

function setShowRangeMinion(input){ getUIElement("chkRangeMinion").checked = input; }
function setShowRangeBoss(input){ getUIElement("chkRangeBoss").checked = input; }
function setShowRangeTower(input){ getUIElement("chkRangeTower").checked = input; }
function setShowRangeHero(input){ getUIElement("chkRangeHero").checked = input; }
function setShowReloadMinion(input){ getUIElement("chkReloadMinion").checked = input; }
function setShowReloadBoss(input){ getUIElement("chkRangeBoss").checked = input; }
function setShowReloadTower(input){ getUIElement("chkRangeTower").checked = input; }
function setShowReloadHero(input){ getUIElement("chkRangeHero").checked = input; }
function setShowHealthMinion(input){ getUIElement("chkHealthMinion").checked = input; }
function setShowHealthBoss(input){ getUIElement("chkHealthBoss").checked = input; }
function setShowHealthTower(input){ getUIElement("chkHealthTower").checked = input; }
function setShowHealthHero(input){ getUIElement("chkHealthHero").checked = input; }
function setShowDamageMinion(input){ getUIElement("chkDamageMinion").checked = input; }
function setShowDamageBoss(input){ getUIElement("chkDamageBoss").checked = input; }
function setShowDamageTower(input){ getUIElement("chkDamageTower").checked = input; }
function setShowDamageHero(input){ getUIElement("chkDamageHero").checked = input; }

function isAutoBuy(id){
	switch(id){
		case "t0":
			return autobuyT0();
		case "t1":
			return autobuyT1();
		case "t2":
			return autobuyT2();
		case "t3":
			return autobuyT3();
	}
	return false;
}
function isAutoPrestige(id){
	switch(id){
		case "t0":
			return autoPrestigeT0();
		case "t1":
			return autoPrestigeT1();
		case "t2":
			return autoPrestigeT2();
		case "t3":
			return autoPrestigeT3();
	}
	return false;
}

function autobuyT0(){ return getUIElement("chkAutoBuy0").checked; }
function autobuyT1(){ return getUIElement("chkAutoBuy1").checked; }
function autobuyT2(){ return getUIElement("chkAutoBuy2").checked; }
function autobuyT3(){ return getUIElement("chkAutoBuy3").checked; }
function setAutobuyT0(input){ getUIElement("chkAutoBuy0").checked = input; }
function setAutobuyT1(input){ getUIElement("chkAutoBuy1").checked = input; }
function setAutobuyT2(input){ getUIElement("chkAutoBuy2").checked = input; }
function setAutobuyT3(input){ getUIElement("chkAutoBuy3").checked = input; }

function autoPrestigeT0(){ return getUIElement("chkAutoPrestige0").checked; }
function autoPrestigeT1(){ return getUIElement("chkAutoPrestige1").checked; }
function autoPrestigeT2(){ return getUIElement("chkAutoPrestige2").checked; }
function autoPrestigeT3(){ return getUIElement("chkAutoPrestige3").checked; }
function setAutoPrestigeT0(input){ getUIElement("chkAutoPrestige0").checked = input; }
function setAutoPrestigeT1(input){ getUIElement("chkAutoPrestige1").checked = input; }
function setAutoPrestigeT2(input){ getUIElement("chkAutoPrestige2").checked = input; }
function setAutoPrestigeT3(input){ getUIElement("chkAutoPrestige3").checked = input; }
function toggleTierAutoPrestige(tier, checked){
  switch(tier){
    case "t0":
      getUIElement("chkAutoPrestige0").checked = checked;
      break;
    case "t1":
      getUIElement("chkAutoPrestige1").checked = checked;
      break;
    case "t2":
      getUIElement("chkAutoPrestige2").checked = checked;
      break;
    case "t3":
      getUIElement("chkAutoPrestige3").checked = checked;
      break;
  }
}

function updateRestartLevel(sender){
  setElementTextById("startingLevelSelection", sender.value);
  resetLevel = sender.value;
}

function showFPS(){ return getUIElement("chkShowFPS").checked; }
function isSimpleMinions(){ return getUIElement("chkSmipleMinions").checked; }
function isCompactMinions(){ return getUIElement("chkCompactMinions").checked; }
function isAdvancedTactics(){ return getUIElement("chkAdvancedTactics").checked; }
function GetQuality(){ return getUIElement("ddlQuality").value; }
function autoSave(){ return getUIElement("chkAutoSave").checked; }
function isColorblind(){ return getUIElement("chkColorblind").checked; }
function getP0Rate(){ return +getUIElement("ddlP0Rate").value; }
function getP1Rate(){ return +getUIElement("ddlP1Rate").value; }
function ShowP1(){
  getUIElement("ddlP1Rate").selectedIndex=0;
  setP1Rate();
}

function yesCookies(){
	cookiesEnabled = 1;
	getUIElement("divCookies").style.display = "none";
}
function noCookies(){
	cookiesEnabled = 0;
	getUIElement("divCookies").style.display = "none";
}

let resizerDelay;
function resize(){
	clearTimeout(resizerDelay);
	resizerDelay = setTimeout(calcSize, 200);
}
function calcSize(){
  const wasGoing = mainCycle>0;
	stop();
	
	const a = Math.max(document.documentElement.clientWidth);
	const b = Math.max(document.documentElement.clientHeight)*2.4;
	//breaks if it gets too small.
	const maxD = Math.max(200, Math.min(a, b) - 10);
	
	//get canvas new size
	const newGameW = maxD;
	const newGameH = maxD/4;
	
	//get x,y ratios
	const dy = newGameH / gameH;
	const dx = newGameW / gameW;
	
	//adjust all path x,y by ratios
	for(let i=0;i<path.length;i++) {
		path[i].x *= dx;
		path[i].y *= dy;
	}
	
	//adjust all minion x,y by ratios
	for(let i=0;i<minions.length;i++) {
		minions[i].Location.x *= dx;
		minions[i].Location.y *= dy;
	}
	
	for(let i=0;i<underlings.length;i++) {
		underlings[i].Location.x *= dx;
		underlings[i].Location.y *= dy;
	}
	
	if(boss){
	  boss.Location.x *= dx;
	  boss.Location.y *= dy;
	}

	//adjust all tower x,y by ratios
	for(let i=0;i<towers.length;i++) {
		towers[i].Location.x *= dx;
		towers[i].Location.y *= dy;
	}
	
	//fix hero home/current location.
	if(hero){
		hero.home.x *= dx;
		hero.home.y *= dy;
		hero.Location.x *= dx;
		hero.Location.y *= dy;
		hero.patrolX *= dx;
	}
	if(squire){
		squire.home.x *= dx;
		squire.home.y *= dy;
		squire.Location.x *= dx;
		squire.Location.y *= dy;
		squire.patrolX *= dx;
	}

	if(page){
		page.home.x *= dx;
		page.home.y *= dy;
		page.Location.x *= dx;
		page.Location.y *= dy;
		page.patrolX *= dx;
	}

	
	//adjust all projectile x,y by ratios
	for(let i=0;i<projectiles.length;i++) {
		projectiles[i].Location.x *= dx;
		projectiles[i].Location.y *= dy;

		projectiles[i].target.x *= dx;
		projectiles[i].target.y *= dy;
		
		projectiles[i].Resize(dx, dy);
	}
		
	for(let i=0; i<impacts.length;i++){
		impacts[i].Location.x *= dx
		impacts[i].Location.y *= dy
	}
		
  levelEndX *= dx;
  
	//set canvas new size
	gameW = newGameW;
	gameH = newGameH;
	langoliers = -(gameW>>3);

	halfH = gameH/2;
	leaderPoint = gameW * 2 / 5;
	pathL = (gameW>>6);
	pathW = (gameH>>2);

	const drawArea = getUIElement("canvasArea");
	drawArea.style.width = gameW;
	drawArea.style.height = gameH;
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext("2d");


	//Resize other panels.
	pnl0.style.height = gameH+"px";
	pnl1.style.top = (gameH+5) +"px";
	getUIElement("resourceBox").style.top = (gameH+5)+"px";

  if(wasGoing){
	  start();
  }
}
