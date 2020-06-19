"use strict";
function toggleP1(btn, input){
	const e = document.getElementsByClassName("mnuSelected");
	for(let i=0;i<e.length; i++){e[i].classList.remove("mnuSelected");}

	const pnls = document.getElementsByClassName("p1BlockChild");
	for(let i=0;i<pnls.length; i++){pnls[i].style.display="none";}

	btn.classList.add("mnuSelected");
	document.getElementById(input).style.display="flex";
	
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
	const ddlColors = document.getElementById(id);
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
	return "#" + document.getElementById("ddlColors").value; 
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
	document.getElementById("chkShowFPS").checked = false;
	document.getElementById("chkColorblind").checked = false;
	document.getElementById("skipFrames").value = 0;
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
	document.getElementById("selectNone").checked = true;
}

function showRangeMinion(){ return document.getElementById("chkRangeMinion").checked; }
function showRangeBoss(){ return document.getElementById("chkRangeBoss").checked; }
function showRangeTower(){ return document.getElementById("chkRangeTower").checked; }
function showRangeHero(){ return document.getElementById("chkRangeHero").checked; }
function showReloadMinion(){ return document.getElementById("chkReloadMinion").checked; }
function showReloadBoss(){ return document.getElementById("chkRangeBoss").checked; }
function showReloadTower(){ return document.getElementById("chkRangeTower").checked; }
function showReloadHero(){ return document.getElementById("chkRangeHero").checked; }
function showHealthMinion(){ return document.getElementById("chkHealthMinion").checked; }
function showHealthBoss(){ return document.getElementById("chkHealthBoss").checked; }
function showHealthTower(){ return document.getElementById("chkHealthTower").checked; }
function showHealthHero(){ return document.getElementById("chkHealthHero").checked; }
function showDamageMinion(){ return document.getElementById("chkDamageMinion").checked; }
function showDamageBoss(){ return document.getElementById("chkDamageBoss").checked; }
function showDamageTower(){ return document.getElementById("chkDamageTower").checked; }
function showDamageHero(){ return document.getElementById("chkDamageHero").checked; }

function setShowRangeMinion(input){ document.getElementById("chkRangeMinion").checked = input; }
function setShowRangeBoss(input){ document.getElementById("chkRangeBoss").checked = input; }
function setShowRangeTower(input){ document.getElementById("chkRangeTower").checked = input; }
function setShowRangeHero(input){ document.getElementById("chkRangeHero").checked = input; }
function setShowReloadMinion(input){ document.getElementById("chkReloadMinion").checked = input; }
function setShowReloadBoss(input){ document.getElementById("chkRangeBoss").checked = input; }
function setShowReloadTower(input){ document.getElementById("chkRangeTower").checked = input; }
function setShowReloadHero(input){ document.getElementById("chkRangeHero").checked = input; }
function setShowHealthMinion(input){ document.getElementById("chkHealthMinion").checked = input; }
function setShowHealthBoss(input){ document.getElementById("chkHealthBoss").checked = input; }
function setShowHealthTower(input){ document.getElementById("chkHealthTower").checked = input; }
function setShowHealthHero(input){ document.getElementById("chkHealthHero").checked = input; }
function setShowDamageMinion(input){ document.getElementById("chkDamageMinion").checked = input; }
function setShowDamageBoss(input){ document.getElementById("chkDamageBoss").checked = input; }
function setShowDamageTower(input){ document.getElementById("chkDamageTower").checked = input; }
function setShowDamageHero(input){ document.getElementById("chkDamageHero").checked = input; }

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

function autobuyT0(){ return document.getElementById("chkAutoBuy0").checked; }
function autobuyT1(){ return document.getElementById("chkAutoBuy1").checked; }
function autobuyT2(){ return document.getElementById("chkAutoBuy2").checked; }
function autobuyT3(){ return document.getElementById("chkAutoBuy3").checked; }
function setAutobuyT0(input){ document.getElementById("chkAutoBuy0").checked = input; }
function setAutobuyT1(input){ document.getElementById("chkAutoBuy1").checked = input; }
function setAutobuyT2(input){ document.getElementById("chkAutoBuy2").checked = input; }
function setAutobuyT3(input){ document.getElementById("chkAutoBuy3").checked = input; }

function showFPS(){ return document.getElementById("chkShowFPS").checked; }
function skipFrames(){ return document.getElementById("skipFrames").value; }
function GetQuality(){ return document.getElementById("ddlQuality").value; }
function autoSave(){ return document.getElementById("chkAutoSave").checked; }
function isColorblind(){ return document.getElementById("chkColorblind").checked; }

function yesCookies(){
	cookiesEnabled = 1;
	document.getElementById("divCookies").style.display = "none";
}
function noCookies(){
	cookiesEnabled = 0;
	document.getElementById("divCookies").style.display = "none";
}

let resizerDelay;
function resize(){
	clearTimeout(resizerDelay);
	resizerDelay = setTimeout(calcSize, 200);
}
function calcSize(){
	stop();
	
	const a = Math.max(document.documentElement.clientWidth);
	const b = Math.max(document.documentElement.clientHeight)*2.4;
	const maxD = Math.min(a, b) - 10;
	//breaks if it gets too small.
	maxD = Math.max(maxD, 200);
	
	//get canvas new size
	const newGameW = maxD;
	const newGameH = maxD/6;
	
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
		
	//set canvas new size
	gameW = newGameW;
	gameH = newGameH;
	halfH = gameH>>1;
	langoliers = -(gameW<<1);
	pathL = (gameW>>6)*1;
	pathW = (gameH>>4)*1;
	
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


	//Resize other panels.	
	document.getElementById("pnl0").style.height = gameH;
	
	start();
}
