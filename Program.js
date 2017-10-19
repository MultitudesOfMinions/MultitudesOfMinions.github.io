//TODO: info page

//TODO: make notification saying site uses cookies.
//TODO: get secret testers/balance game.
//TODO: make High Quality elements

//future stuff: 
//TODO: favicon
//TODO: equipment, boss minions, heroes
//TODO: resize window redraws everything in the correct places.
//TODO: variable rebirth costs?

//TODO: anounce on reddit or some such.

function initialize_components(){
	loadData();
	
	//Resize panels
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
	totalD = 0;
	
	//Build path
	path[0] = new point(-100, halfH);
	while(path.length > 0 && path[path.length - 1].x < gameW + 100){
		addPathPoint();
	}
	
	addMinion('Grunt');
	minions[0].Location.x = path[Math.floor(path.length/3)].x;
	minions[0].Location.y = path[Math.floor(path.length/3)].y;
	addTower();
}

function loadData(){
	//load minion upgrades
	var cookie = getSaveCookie();
	if(cookie == null){
		return; }
	var gameState = JSON.parse(cookie);
	
	for(var key in baseMinions)
	{
		if(gameState.minionResearch.hasOwnProperty(key)){
			var prop = 'isUnlocked';
			if(gameState.minionResearch[key].hasOwnProperty(prop))
				{baseMinions[key][prop] = gameState.minionResearch[key][prop];}
		}
	}
	baseMinions['Grunt'].isUnlocked=1;//is always unlocked, even if someone hacks their save.
	
	for(var key in minionUpgrades)
	{
		if(gameState.minionUpgrades.hasOwnProperty(key)){
			for(var prop in minionUpgrades[key]){
				if(gameState.minionUpgrades[key].hasOwnProperty(prop))
					{minionUpgrades[key][prop] = gameState.minionUpgrades[key][prop];}
			}
		}
	}
	
	//load gameState
	if(gameState.indicators.range){
		document.getElementById("buyShowRange").style.display='none';
		document.getElementById("divShowRange").style.display='block';
	}
	if(gameState.indicators.reload){
		document.getElementById("buyShowReload").style.display='none';
		document.getElementById("divShowReload").style.display='block';
	}
	if(gameState.indicators.hp){
		document.getElementById("buyShowHP").style.display='none';
		document.getElementById("divShowHP").style.display='block';
	}
	if(gameState.indicators.dmg){
		document.getElementById("buyShowDMG").style.display='none';
		document.getElementById("divShowDMG").style.display='block';
	}
	maxMinions = gameState.maxMinions;
	resources = gameState.resources;
	totalD += LevelToTotalD(gameState.level);
	rebirthCount = gameState.rebirthCount;
	
	offlineTime = Math.floor(Date.now() / 60000) - gameState.time;
	//TODO: offline progress? possibly(maxMinions * hours)
	
	if(resources['rag'] > 0){document.getElementById('pnl2').style.display='block';}
}

function saveData() {
    var d = new Date();
    d.setDate(d.getTime() + 7);
	var c = "gameState={0};expires={1};path=/".format(buildGameState(), d.toUTCString());
    document.cookie = c;
	lastSave = 0;
}


function update(){
	updatePnl1();
	updatePnl2();
	
	manageMinions();
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
	var scraps = "Scraps:{0}µ".format(Math.floor(resources['scrap']*10)/10);
	if(document.getElementById("divResource").innerHTML != scraps){
		document.getElementById("divResource").innerHTML = scraps;
	}
	
	if(document.getElementById("divMinionDashboard").style.display == 'block'){
		drawMinionDashboard();
	}
	if(document.getElementById("divMinionUpgrades").style.display == 'block'){
		drawMinionUpgrades();
		
		if(resources['scrap'] >= getRebirthCost()){ //TODO: balance rebirth cost
			document.getElementById("btnPrestige").classList.add('affordableUpg'); 
			document.getElementById("btnPrestige").classList.remove('upg'); 
		}
		else{ 
			document.getElementById("btnPrestige").classList.add('upg'); 
			document.getElementById("btnPrestige").classList.remove('affordableUpg'); 
		}
	}
}

function drawMinionDashboard(){
	var minionCounter = "{0}/{1}".format(minions.length, maxMinions);
	if(document.getElementById("lblMinionCounter").innerHTML != minionCounter){
		document.getElementById("lblMinionCounter").innerHTML = minionCounter;
	}
	
	//Timers change enough to just constantly update.
	var timers = "Spawn Timers:";
	for(var key in baseMinions)
	{
		if(baseMinions[key].isUnlocked){
			var percent = baseMinions[key].lastSpawn / getSpawnDelay(key) * 100;
			var text = "&nbsp;" + key + ":" + Math.min(100, Math.floor(percent)) + "%";
			
			timers += "<div class=\"timerWrapper\" style=\"width:100px;\"><div class=\"timerBar\" style=\"width:{1}\">&nbsp;{0}</div><div class=\"timerBackground\">&nbsp;{0}</div></div>".format(text, percent);
			
			//timers += "<div>&nbsp;" + key + ": " + Math.min(100, Math.floor(percent)) + "%</div>"

		}
	}
	timers = "<div class=\"Block\" style=\"width:125px;\">{0}</div>".format(timers)
	if(document.getElementById("divTimerList").innerHTML != timers){
	  document.getElementById("divTimerList").innerHTML = timers;
	}
	
	//check if is changed before updating minion info
	var minionList = document.getElementById("divMinionList");
	var minionListCount = minionList.childNodes.length;
	for(var i=0; i< minionOrder.length; i++){
		//build div html
		var minionInfo = "&nbsp;HP:{0}&nbsp; &nbsp; &nbsp; &nbsp;DMG:{1}".format(Math.ceil(minions[minionOrder[i]].hp)
																	, Math.floor(minions[minionOrder[i]].damage)
																	, minions[minionOrder[i]].moveSpeed);
		
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
	var upgradeTable = document.getElementById("divMinionUpgradeTable");
	
	for(var key in baseMinions)
	{
		if(baseMinions[key].isUnlocked){
			
			var hpCost = getUpgradeCost(key, 'hp');
			var dmgCost = getUpgradeCost(key, 'damage');
			
			var upgList = key + " Upgrades:"
			
			if(hpCost <= resources['scrap']){ upgList += "<button id=\"btnUpg{0}hp\" class=\"affordableUpg\" onclick=\"buy('{0}_hp')\">HP ({1}µ)</button>".format(key, hpCost); }
			else{ upgList += "<button id=\"btnUpg{0}hp\" class=\"upg\" onclick=\"buy('{0}_hp')\">HP ({1}µ)</button>".format(key, hpCost); }
			
			if(dmgCost <= resources['scrap']){ upgList += "<button id=\"btnUpg{0}dmg\" class=\"affordableUpg\" onclick=\"buy('{0}_damage')\">Damage ({1}µ)</button>".format(key, dmgCost); }
			else{ upgList += "<button id=\"btnUpg{0}dmg\" class=\"upg\" onclick=\"buy('{0}_damage')\">Damage ({1}µ)</button>".format(key, dmgCost); }
			
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
	var rags = "Rags:{0}τ".format(Math.floor(resources['rag']));
	if(document.getElementById("divpResource").innerHTML != rags){
		document.getElementById("divpResource").innerHTML = rags;
	}

	
	if(resources['rag'] >= 10){
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
	
	if(resources['rag'] >= getMaxMinionCost()){
		document.getElementById("btnBuyMaxMinions").classList.add('affordableUpg'); 
		document.getElementById("btnBuyMaxMinions").classList.remove('upg'); 
	}
	else{ 
		document.getElementById("btnBuyMaxMinions").classList.add('upg'); 
		document.getElementById("btnBuyMaxMinions").classList.remove('affordableUpg'); 
	}
	
	//TODO: clean this up
	if(resources['rag'] >= baseMinions['Swarmer']['unlockCost']){
		if(document.getElementById("btnUnlockSwarmer").style.display != "none"){
			document.getElementById("btnUnlockSwarmer").classList.add('affordableUpg'); 
			document.getElementById("btnUnlockSwarmer").classList.remove('upg'); 
		}
	}
	else{
		if(document.getElementById("btnUnlockSwarmer").style.display != "none"){
			document.getElementById("btnUnlockSwarmer").classList.add('upg'); 
			document.getElementById("btnUnlockSwarmer").classList.remove('affordableUpg'); 
		}
	}

	if(resources['rag'] >= baseMinions['Tank']['unlockCost']){
		if(document.getElementById("btnUnlockTank").style.display != "none"){
			document.getElementById("btnUnlockTank").classList.add('affordableUpg'); 
			document.getElementById("btnUnlockTank").classList.remove('upg'); 
		}
	}
	else{
		if(document.getElementById("btnUnlockTank").style.display != "none"){
			document.getElementById("btnUnlockTank").classList.add('upg'); 
			document.getElementById("btnUnlockTank").classList.remove('affordableUpg'); 
		}
	}	
	drawEpicUpgrades();
}

function drawEpicUpgrades(){
	var upgradeTable = document.getElementById("divMinionEpicUpgradeTable");

	for(var key in baseMinions)
	{
		if(baseMinions[key].isUnlocked){
			var moveSpeedCost = getUpgradeCost(key, 'moveSpeed');
			var attackRateCost = getUpgradeCost(key, 'attackRate');
			var attackRangeCost = getUpgradeCost(key, 'attackRange');
			var attackRangeCost = getUpgradeCost(key, 'spawnDelay');
			
			var upgList = key + "Epic Upgrades:"

			if(moveSpeedCost <= resources['rag']){ upgList += "<button id=\"btnUpg{0}moveSpeed\" class=\"affordableUpg\" onclick=\"buy('{0}_moveSpeed')\">Move Speed ({1}τ)</button>".format(key, moveSpeedCost); }
			else{ upgList += "<button id=\"btnUpg{0}moveSpeed\" class=\"upg\" onclick=\"buy('{0}_moveSpeed')\">Move Speed ({1}τ)</button>".format(key, moveSpeedCost); }

			if(moveSpeedCost <= resources['rag']){ upgList += "<button id=\"btnUpg{0}attackRate\" class=\"affordableUpg\" onclick=\"buy('{0}_attackRate')\">Attack Rate ({1}τ)</button>".format(key, attackRateCost); }
			else{ upgList += "<button id=\"btnUpg{0}attackRate\" class=\"upg\" onclick=\"buy('{0}_attackRate')\">Attack Rate ({1}τ)</button>".format(key, attackRateCost); }

			if(moveSpeedCost <= resources['rag']){ upgList += "<button id=\"btnUpg{0}attackRange\" class=\"affordableUpg\" onclick=\"buy('{0}_attackRange')\">Attack Range ({1}τ)</button>".format(key, attackRangeCost); }
			else{ upgList += "<button id=\"btnUpg{0}attackRange\" class=\"upg\" onclick=\"buy('{0}_attackRange')\">Attack Range ({1}τ)</button>".format(key, attackRangeCost); }

			if(moveSpeedCost <= resources['rag']){ upgList += "<button id=\"btnUpg{0}spawnDelay\" class=\"affordableUpg\" onclick=\"buy('{0}_spawnDelay')\">Spawn Delay ({1}τ)</button>".format(key, attackRangeCost); }
			else{ upgList += "<button id=\"btnUpg{0}spawnDelay\" class=\"upg\" onclick=\"buy('{0}_spawnDelay')\">spawnDelay ({1}τ)</button>".format(key, attackRangeCost); }
			
			
			var upgCard = document.getElementById("divMinionEpicUpgradeList" + key);
			if(upgCard == null){
				var newCard = document.createElement('div');
				
				newCard.id = "divMinionEpicUpgradeList" + key;
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
	drawTowers();
	drawProjectiles();
	drawImpacts();
	
	ctx.fillStyle='#FFF';
	var now = Date.now();
	var fps = 1000/(now - lastUpdate)
	maxFPS = Math.max(fps, maxFPS);
	minFPS = Math.min(fps, minFPS);
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