//BUGS
//Show range is reset on reload/regroup but checkbox is not.
//Unlock Dart/Dozer buttons exist on reload if they are already unlocked.

//Features
//TODO: different checkboxes for minion/tower/boss/hero display toggles
//TODO: hero effects

//TODO: export/import

//TODO: additional researches: starting minions
//TODO: additional upgrades: T(n-1) cost reduction, T(n-1) resource gain
//TODO: weight tower spawn (.5,.25,.25)

//TODO: indicate minionType in dashboard

//TODO: chain hits

//TODO: favicon
//TODO: show how much Resource you get for prestige.

//TODO: level 2 rebirth: resets scraps and T1 research
//TODO: bosses - one active at a time; upgrades on third resource from level 2 rebirth
//TODO: equipment - drops from hero, equip on bosses

//TODO: clean up upg/affordable class toggling with a util function.
//TODO: base info colors off of config colors

//TODO: balance config.js
//TODO: resize window redraws everything in the correct places.


//TODO: reset button.

//future stuff: 
//TODO: make notification saying site uses cookies.
//TODO: get secret testers/balance game.
//TODO: make High Quality elements

//TODO: announce on reddit or some such.

function initialize_components(){
	loadData();
	
	//Resize panels
	var pnl0 = document.getElementById('pnl0');
	pnl0.style.minHeight = gameH;
	pnl0.style.width=gameW;
	var pnl1 = document.getElementById('pnl1');
	pnl1.style.minHeight = gameH;
	pnl1.style.width=gameW;
	var pnl2 = document.getElementById('pnl2');
	pnl2.style.minHeight = gameH;
	pnl2.style.width=gameW;
	
	buildWorld();
	mainCycle = setInterval(update, 20);
}

function buildWorld(){
	document.getElementById("divMinionList").style.width = gameW - 240;
	
	minions = [];
	minionOrder =[];
	path = [];
	towers = [];
	totalPaths = 0;
	
	//Build path
	path[0] = new point(-(pathL*2), halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + (pathL*2)){
		addPathPoint();
	}
	totalPaths = 0;
	
	addMinion('Drone');
	baseMinions['Drone'].lastSpawn = baseMinions['Drone'].spawnDelay / 2;
	addTower();
	while(towers[towers.length-1].Location.x < getLevelSpan())
	{
		addTower();
	}
}

function update(){
	updatePnl1();
	updatePnl2();
	
	manageMinions();
	manageHero();
	manageTowers();
	managePath();
	manageProjectiles();
	manageImpacts();
	
	//Draw all the stuffs in the correct order.
	draw();
	
	if(autoSave){
		lastSave++;
		if(lastSave > (3000)){//approx 1 minute
			saveData();
		}
		document.getElementById("lblAutoSaveTimer").style.width = 75 * lastSave / 3000;
	}
}

function updatePnl1(){
	var resourceDisplay = "{0}:{1}{2}".format(resources[0]['name'] , Math.floor(resources[0]['amt']*10)/10, resources[0]['symbol']);
	if(document.getElementById("divResource").innerHTML != resourceDisplay){
		document.getElementById("divResource").innerHTML = resourceDisplay;
	}
	
	if(document.getElementById("divMinionDashboard").style.display == 'block'){
		drawMinionDashboard();
	}
	if(document.getElementById("divMinionUpgrades").style.display == 'block'){
		drawMinionUpgrades();
		document.getElementById("btnRefine0").innerHTML = "Regroup ({0}{1})".format(getPrestigeCost(), resources[0]['symbol']);
		if(resources[0]['amt'] >= getPrestigeCost()){
			document.getElementById("btnRefine0").classList.add('affordableUpg'); 
			document.getElementById("btnRefine0").classList.remove('upg'); 
		}
		else{ 
			document.getElementById("btnRefine0").classList.add('upg'); 
			document.getElementById("btnRefine0").classList.remove('affordableUpg'); 
		}
	}
}

function drawMinionDashboard(){
	var minionCounter = "{0}/{1}".format(minions.length, getMaxMinions());
	if(document.getElementById("lblMinionCounter").innerHTML != minionCounter){
		document.getElementById("lblMinionCounter").innerHTML = minionCounter;
	}
	
	//Timers change enough to just constantly update.
	for(var key in baseMinions)
	{
		if(minionResearch[key].isUnlocked){
			document.getElementById("timerBar{0}".format(key)).style.display = "Block"
			var timer = document.getElementById("timer{0}".format(key));
			
			var percent = baseMinions[key].lastSpawn / getSpawnDelay(key) * 100;
			var text = key + ":" + Math.min(100, Math.floor(percent)) + "%";
			
			if(timer.innerHTML !== text){
				timer.style.width = percent;
				timer.innerHTML = text
				
				document.getElementById("bg{0}".format(key)).innerHTML = text;
			}
		}
		else{
			document.getElementById("timerBar{0}".format(key)).style.display = "none"
		}
	}
	
	//check if is changed before updating minion info
	var minionList = document.getElementById("divMinionList");
	var minionListCount = minionList.childNodes.length;
	for(var i=0; i< minionOrder.length; i++){
		//build div html
		var minionInfo = "&nbsp;HP:{0}&nbsp; &nbsp;DMG:{1}".format(Math.ceil(minions[minionOrder[i]].hp)
																	, Math.floor(minions[minionOrder[i]].damage));
		
		//check if it changed
		var minionCard = document.getElementById("divMinionListItem" + i);
		if(minionCard == null){
			var newCard = document.createElement('div');
			
			newCard.id = "divMinionListItem" + i;
			newCard.classList.toggle('minionBlock');;
			newCard.innerHTML = minionInfo;
			
			minionList.appendChild(newCard);
		}
		else if(minionCard.innerHTML != minionInfo){
			minionCard.innerHTML = minionInfo;
		}
	}
	
	//remove extra minion cards
	while(minionList.childNodes.length > minionOrder.length){
		minionList.removeChild(minionList.lastChild)
	}
}

function drawMinionUpgrades(){
	var prestigeGain = document.getElementById("divPrestigeGain");
	prestigeGain.innerHTML = getPrestigeGain() + resources[1]['symbol'];
	
	var upgradeTable = document.getElementById("divMinionUpgradeTable");
	
	for(var key in baseMinions)
	{
		if(minionResearch[key].isUnlocked){
			
			var hpCost = getUpgradeCost(key, 'hp');
			var dmgCost = getUpgradeCost(key, 'damage');
			
			var upgList = key + "T0 Upgrades:"
			
			if(hpCost <= resources[0]['amt']){ upgList += "<button id=\"btnUpg{0}hp\" class=\"affordableUpg\" onclick=\"buy('{0}_hp')\">HP ({1}{2})</button>".format(key, hpCost, resources[0]['symbol']); }
			else{ upgList += "<button id=\"btnUpg{0}hp\" class=\"upg\" onclick=\"buy('{0}_hp')\">HP ({1}{2})</button>".format(key, hpCost, resources[0]['symbol']); }
			
			if(dmgCost <= resources[0]['amt']){ upgList += "<button id=\"btnUpg{0}dmg\" class=\"affordableUpg\" onclick=\"buy('{0}_damage')\">Damage ({1}{2})</button>".format(key, dmgCost, resources[0]['symbol']); }
			else{ upgList += "<button id=\"btnUpg{0}dmg\" class=\"upg\" onclick=\"buy('{0}_damage')\">Damage ({1}{2})</button>".format(key, dmgCost, resources[0]['symbol']); }
			
			var upgCard = document.getElementById("divMinionUpgradeList" + key);
			if(upgCard == null){
				var newCard = document.createElement('div');
				
				newCard.id = "divMinionUpgradeList" + key;
				newCard.classList.toggle('minionBlock');
				newCard.innerHTML = upgList;
				
				upgradeTable.appendChild(newCard);
			}
			else if(upgCard.innerHTML != upgList){
				upgCard.innerHTML = upgList;
			}
		}
	}
}

function updatePnl2(){
	if(!prestigeCount){
		document.getElementById('pnl2').style.display='none';
		return;
	}
	document.getElementById('pnl2').style.display='block';
	
	var resourceDisplay = "{0}:{1}{2}".format(resources[1]['name'], Math.floor(resources[1]['amt']), resources[1]['symbol']);
	if(document.getElementById("divpResource").innerHTML != resourceDisplay){
		document.getElementById("divpResource").innerHTML = resourceDisplay;
	}
	
	if(resources[1]['amt'] >= 10){
		if(document.getElementById("buyShowRange").style.display != "none"){
			document.getElementById("buyShowRange").classList.add('affordableUpg'); 
			document.getElementById("buyShowRange").classList.remove('upg'); 
		}
		if(document.getElementById("buyShowReload").style.display != "none"){
			document.getElementById("buyShowReload").classList.add('affordableUpg'); 
			document.getElementById("buyShowReload").classList.remove('upg'); 
		}
		if(document.getElementById("buyShowHP").style.display != "none"){
			document.getElementById("buyShowHP").classList.add('affordableUpg'); 
			document.getElementById("buyShowHP").classList.remove('upg'); 
		}
		if(document.getElementById("buyShowDMG").style.display != "none"){
			document.getElementById("buyShowDMG").classList.add('affordableUpg'); 
			document.getElementById("buyShowDMG").classList.remove('upg'); 
		}
	}
	else{ 
		if(document.getElementById("buyShowRange").style.display != "none"){
			document.getElementById("buyShowRange").classList.add('upg'); 
			document.getElementById("buyShowRange").classList.remove('affordableUpg'); 
		}
		if(document.getElementById("buyShowReload").style.display != "none"){
			document.getElementById("buyShowReload").classList.add('upg'); 
			document.getElementById("buyShowReload").classList.remove('affordableUpg'); 
		}
		if(document.getElementById("buyShowHP").style.display != "none"){
			document.getElementById("buyShowHP").classList.add('upg'); 
			document.getElementById("buyShowHP").classList.remove('affordableUpg'); 
		}
		if(document.getElementById("buyShowDMG").style.display != "none"){
			document.getElementById("buyShowDMG").classList.add('upg'); 
			document.getElementById("buyShowDMG").classList.remove('affordableUpg'); 
		}
	}
	
	if(resources[1]['amt'] >= getMaxMinionCost()){
		document.getElementById("btnBuyMaxMinions").classList.add('affordableUpg'); 
		document.getElementById("btnBuyMaxMinions").classList.remove('upg'); 
	}
	else{ 
		document.getElementById("btnBuyMaxMinions").classList.add('upg'); 
		document.getElementById("btnBuyMaxMinions").classList.remove('affordableUpg'); 
	}

	if(minionResearch['Dart'].isUnlocked){
		document.getElementById("btnUnlockDart").style.display = "none"
	}
	else if(resources[1]['amt'] >= baseMinions['Dart']['unlockCost']){
		document.getElementById("btnUnlockDart").classList.add('affordableUpg'); 
		document.getElementById("btnUnlockDart").classList.remove('upg'); 
	}
	else{
		document.getElementById("btnUnlockDart").classList.add('upg'); 
		document.getElementById("btnUnlockDart").classList.remove('affordableUpg'); 
	}

	if(minionResearch['Dozer'].isUnlocked){
		document.getElementById("btnUnlockDart").style.display = "none"
	}
	else if(resources[1]['amt'] >= baseMinions['Dozer']['unlockCost']){
		document.getElementById("btnUnlockDozer").classList.add('affordableUpg'); 
		document.getElementById("btnUnlockDozer").classList.remove('upg'); 
	}
	else{
		document.getElementById("btnUnlockDozer").classList.add('upg'); 
		document.getElementById("btnUnlockDozer").classList.remove('affordableUpg'); 
	}	
	drawT1Upgrades();
}

function drawT1Upgrades(){
	var upgradeTable = document.getElementById("divMinionT1UpgradeTable");

	for(var key in baseMinions)
	{
		if(minionResearch[key].isUnlocked){
			var moveSpeedCost = getUpgradeCost(key, 'moveSpeed');
			var attackRateCost = getUpgradeCost(key, 'attackRate');
			var projectileSpeedCost = getUpgradeCost(key, 'projectileSpeed');
			var splashRadiusCost = getUpgradeCost(key, 'splashRadius');
			var attackRangeCost = getUpgradeCost(key, 'attackRange');
			var spawnDelayCost = getUpgradeCost(key, 'spawnDelay');
			
			var upgList = key + " T1 Upgrades:"

			if(moveSpeedCost <= resources[1]['amt']){ upgList += "<button id=\"btnUpg{0}moveSpeed\" class=\"affordableUpg\" onclick=\"buy('{0}_moveSpeed')\">Move Speed ({1}τ)</button>".format(key, moveSpeedCost); }
			else{ upgList += "<button id=\"btnUpg{0}moveSpeed\" class=\"upg\" onclick=\"buy('{0}_moveSpeed')\">Move Speed ({1}τ)</button>".format(key, moveSpeedCost); }

			if(attackRateCost <= resources[1]['amt']){ upgList += "<button id=\"btnUpg{0}attackRate\" class=\"affordableUpg\" onclick=\"buy('{0}_attackRate')\">Attack Rate ({1}τ)</button>".format(key, attackRateCost); }
			else{ upgList += "<button id=\"btnUpg{0}attackRate\" class=\"upg\" onclick=\"buy('{0}_attackRate')\">Attack Rate ({1}τ)</button>".format(key, attackRateCost); }

			if(projectileSpeedCost <= resources[1]['amt']){ upgList += "<button id=\"btnUpg{0}projectileSpeed\" class=\"affordableUpg\" onclick=\"buy('{0}_projectileSpeed')\">Projectile Speed ({1}τ)</button>".format(key, projectileSpeedCost); }
			else{ upgList += "<button id=\"btnUpg{0}projectileSpeed\" class=\"upg\" onclick=\"buy('{0}_projectileSpeed')\">Projectils Speed ({1}τ)</button>".format(key, projectileSpeedCost); }

			if(splashRadiusCost <= resources[1]['amt']){ upgList += "<button id=\"btnUpg{0}splashRadius\" class=\"affordableUpg\" onclick=\"buy('{0}_splashRadius')\">Splash Radius ({1}τ)</button>".format(key, attackRateCost); }
			else{ upgList += "<button id=\"btnUpg{0}splashRadius\" class=\"upg\" onclick=\"buy('{0}_splashRadius')\">Splash Radius ({1}τ)</button>".format(key, splashRadiusCost); }

			if(attackRangeCost <= resources[1]['amt']){ upgList += "<button id=\"btnUpg{0}attackRange\" class=\"affordableUpg\" onclick=\"buy('{0}_attackRange')\">Attack Range ({1}τ)</button>".format(key, attackRangeCost); }
			else{ upgList += "<button id=\"btnUpg{0}attackRange\" class=\"upg\" onclick=\"buy('{0}_attackRange')\">Attack Range ({1}τ)</button>".format(key, attackRangeCost); }

			if(spawnDelayCost <= resources[1]['amt']){ upgList += "<button id=\"btnUpg{0}spawnDelay\" class=\"affordableUpg\" onclick=\"buy('{0}_spawnDelay')\">Spawn Delay ({1}τ)</button>".format(key, spawnDelayCost); }
			else{ upgList += "<button id=\"btnUpg{0}spawnDelay\" class=\"upg\" onclick=\"buy('{0}_spawnDelay')\">spawnDelay ({1}τ)</button>".format(key, spawnDelayCost); }
			
			
			var upgCard = document.getElementById("divMinionT1UpgradeList" + key);
			if(upgCard == null){
				var newCard = document.createElement('div');
				
				newCard.id = "divMinionT1UpgradeList" + key;
				newCard.classList.toggle('minionBlock');
				newCard.innerHTML = upgList;
				
				upgradeTable.appendChild(newCard);
			}
			else if(upgCard.innerHTML != upgList){
				upgCard.innerHTML = upgList;
			}					
		}
	}
}

function draw(){
	//Refresh black background
	ctx.fillStyle='#000';
	ctx.fillRect(0,0, gameW, gameH);
	
	drawPath();
	drawMinions();
	drawHero();
	drawTowers();
	drawProjectiles();
	drawImpacts();
	
	ctx.fillStyle='#FFF';
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	maxFPS = Math.max(fps, maxFPS);
	minFPS = Math.min(fps, minFPS);
	ctx.font = "10pt Helvetica"
	if(showFPS){ctx.fillText("FPS:{0} MAX:{1} MIN:{2}".format(Math.floor(fps), Math.floor(maxFPS), Math.floor(minFPS)),10,10);}
	lastUpdate = now;
}

function resize(){
	return;
	
	//get canvas new size
	var newGameW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
	var newGameH = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30)/3;

	//get x,y ratios
	var dy = newGameH / gameH;
	var dx = newGameW / gameW;
	
	//adjust all path x,y by ratios
	for(var i=0;i<path.length;i++) {
		path[i].x *= dx;
		path[i].y *= dy;
	}
	
	//adjust all minion x,y by ratios
	for(var i=0;i<minions.length;i++) {
		minions[i].Location.x *= dx;
		minions[i].Location.y *= dy;
	}

	//adjust all tower x,y by ratios
	for(var i=0;i<towers.length;i++) {
		towers[i].Location.x *= dx;
		towers[i].Location.y *= dy;
	}

	//adjust all projectile x,y by ratios
	for(var i=0;i<projectiles.length;i++) {
		projectiles[i].Location.x *= dx;
		projectiles[i].Location.y *= dy;

		projectiles[i].target.x *= dx;
		projectiles[i].target.y *= dy;
		
		projectiles[i].Resize();
	}
		
	for(var i=0; i<impacts.length;i++){
		impacts[i].Locationl.x *= dx
		impacts[i].Locationl.y *= dy
	}
		
	//set canvas new size
	gameW = newGameW;
	gameH = newGameH;
	halfW = gameW>>1;
	halfH = gameH>>1;
	langoliers = -(gameW<<1);
	drawArea = document.getElementById('canvasArea');
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext('2d');
	pathL = (gameW>>6)*1;
	pathW = (gameH>>4)*1;


	//Resize other panels.	
	pnl1.style.minHeight = gameH;
	pnl1.style.width=gameW;
	pnl2.style.minHeight = gameH;
	pnl2.style.width=gameW;

}

initialize_components();