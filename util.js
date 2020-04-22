function point(x, y){ this.x = x||0; this.y = y||0; }

function loadData(){
	//load minion upgrades
	var cookie = getSaveCookie();
	if(cookie == null){
		return; }
	var gameState = JSON.parse(cookie);
	
	for(var key in minionResearch)
	{
		if(gameState.minionResearch.hasOwnProperty(key)){
			var prop = 'isUnlocked';
			if(gameState.minionResearch[key].hasOwnProperty(prop))
				{minionResearch[key][prop] = gameState.minionResearch[key][prop];}
		}
	}
	minionResearch['Drone'].isUnlocked=1;//is always unlocked, even if someone hacks their save.
	
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
	if(gameState.gauges.range){
		document.getElementById("buyShowRange").style.display='none';
		document.getElementById("divShowRange").style.display='block';
		gauges['range']=1;
	}
	if(gameState.gauges.reload){
		document.getElementById("buyShowReload").style.display='none';
		document.getElementById("divShowReload").style.display='block';
		gauges['reload']=1;
	}
	if(gameState.gauges.hp){
		document.getElementById("buyShowHP").style.display='none';
		document.getElementById("divShowHP").style.display='block';
		gauges['hp']=1;
	}
	if(gameState.gauges.dmg){
		document.getElementById("buyShowDMG").style.display='none';
		document.getElementById("divShowDMG").style.display='block';
		gauges['dmg']=1;
	}
	maxMinions = gameState.maxMinions;
	document.getElementById("btnBuyMaxMinions").innerHTML = "Max Minions++ ({0}{1})".format(maxMinions**2 * 10, resources[1]['symbol']);
	
	for(var key in resources)
	{
		if(gameState.resources.hasOwnProperty(key)){
			resources[key]['amt'] = gameState.resources[key];
		}
		else{
			resources[key]['amt'] = 0;
		}
	}

	totalPaths += LevelToTotalPaths(gameState.level);
	prestigeCount = gameState.prestigeCount;
	
	offlineTime = Math.floor(Date.now() / 60000) - gameState.time;
	resources[0]['amt'] += offlineGains(offlineTime/60, maxMinions);
	
	if(prestigeCount > 0){document.getElementById('pnl2').style.display='block';}
}

function saveData() {
    var d = new Date();
    d.setDate(d.getTime() + 7);
	var c = "gameState={0};expires={1};path=/".format(buildGameState(), d.toUTCString());
    document.cookie = c;
	lastSave = 0;
}

function offlineGains(offlineMinutes, maxMinions){
	return Math.floor(Math.min(offlineMinutes, 24*7)**(maxMinions**.5));
}

function hardReset(){
	resetT0();
	resetT1();
	resetT2();
	
	saveData();
	buildWorld();
}

function resetT0(){
	resources[0]['amt'] = 0;
	for(var key in minionUpgrades)
	{
		//reset hp/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[0].length;i++){
			minionUpgrades[key][minionUpgradeTypes[0][i]]=0;
		}
	}
	hero = null;
}
function resetT1(){
	resources[1]['amt'] = 0;
	maxMinions=0;
	prestigeCount=0;

	for(var key in minionUpgrades)
	{
		//reset hp/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[1].length;i++){
			minionUpgrades[key][minionUpgradeTypes[1][i]]=0;
		}
	}
	
	for(var type in minionResearch)
	{
		for(var key in minionResearch[type]){
			minionResearch[type][key]=0;
		}
	}
		
	for(var type in gauges){
		gauges[type]=0;
	}
	
	minionResearch['Drone'].isUnlocked=1;//is always unlocked, even if someone hacks their save.
}
function resetT2(){
	resources[2]['amt'] = 0;
	
	for(var key in minionUpgrades)
	{
		//reset hp/dmg upgrades
		for(var i=0;i<minionUpgradeTypes[2].length;i++){
			minionUpgrades[key][minionUpgradeTypes[2][i]]=0;
		}
	}
}

function getMaxMinions(){
	return 2**(maxMinions+1);
}

function calcMove(speed, loc, dest) {
	var x = dest.x - loc.x;
	var y = dest.y - loc.y;
	var s = (pathL + (pathW * 1.5))/2; //Scale
	
	var m = speed**2/(x**2+y**2);
	var a = m * x * s;
	var b = m * y * s;
	
	var dx = Math.abs(x);
	var dy = Math.abs(y);
	
	var da = Math.abs(a);
	var db = Math.abs(b);
	
	if(da > dx && db > dy){
		return new point(dest.x, dest.y);
	}
	return new point(loc.x + a, loc.y + b);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getUpgradeCost(key, type){
	var purchased = minionUpgrades[key][type];
	purchased += 3 * getResearchType(type);

	if(purchased == null){ return -1; }
	return 2**purchased;
}

function getResearchType(type){
	for(var i=0;i<minionUpgradeTypes.length;i++){
		if(minionUpgradeTypes[i].includes(type)){
			return i;
		}
	}
	
	return -1;
}

function getMaxMinionCost(){return maxMinions**2 * 10;}

function getUpgradeCount(){
	var total = 0;
	
	for(var key in minionUpgrades){
		for(var type in minionUpgrades[key]){
			total += minionUpgrades[key][type];
		}
	}

	return total;
}

levelScale = 64;
function getLevel(){
	return Math.floor(totalPaths/levelScale);
}

function getLevelAtPathCount (input){
	return Math.floor(input/levelScale)
}

function getLevelSpan(){
	return pathL * levelScale;
}

function LevelToTotalPaths(Level){
	return Level*levelScale;
}

function GetNextHeroX(){
	var level = getLevelAtPathCount(totalPaths + (levelScale>>1));
	var endOfLevel = LevelToTotalPaths(level+1) - 1;
	var x = (endOfLevel - totalPaths) * pathL;
	return x;
}

function getSpawnDelay(type){
	return baseMinions[type].spawnDelay * (minionUpgradeMultipliers[type].spawnDelay**minionUpgrades[type].spawnDelay);
}

function buildGameState(){
	var gameState = {
		"minionResearch":{
			"Dozer":{ isUnlocked:minionResearch['Dozer'].isUnlocked },
			"Dart":{ isUnlocked:minionResearch['Dart'].isUnlocked }
		},
		"minionUpgrades":{
			"Drone":{ "hp":minionUpgrades['Drone'].hp, "damage":minionUpgrades['Drone'].damage, "moveSpeed":minionUpgrades['Drone'].moveSpeed, "attackRate":minionUpgrades['Drone'].attackRate, "projectileSpeed":minionUpgrades['Drone'].projectileSpeed, "attackRange":minionUpgrades['Drone'].attackRange, "spawnDelay":minionUpgrades['Drone'].spawnDelay },
			"Dozer":{ "hp":minionUpgrades['Dozer'].hp, "damage":minionUpgrades['Dozer'].damage, "moveSpeed":minionUpgrades['Dozer'].moveSpeed, "attackRate":minionUpgrades['Dozer'].attackRate, "projectileSpeed":minionUpgrades['Dozer'].projectileSpeed, "attackRange":minionUpgrades['Dozer'].attackRange, "spawnDelay":minionUpgrades['Dozer'].spawnDelay },
			"Dart":{ "hp":minionUpgrades['Dart'].hp, "damage":minionUpgrades['Dart'].damage, "moveSpeed":minionUpgrades['Dart'].moveSpeed, "attackRate":minionUpgrades['Dart'].attackRate, "projectileSpeed":minionUpgrades['Dart'].projectileSpeed, "attackRange":minionUpgrades['Dart'].attackRange, "spawnDelay":minionUpgrades['Dart'].spawnDelay },
		},
		"gauges":{ "range":gauges['range'], "reload":gauges['reload'], "hp":gauges['hp'], "dmg":gauges['dmg'] },
		"maxMinions":maxMinions,
		"resources":{ 0:resources[0]['amt'], 1:resources[1]['amt']||0, 2:resources[2]['amt']||0 },
		"level":getLevel(),
		"prestigeCount":prestigeCount,
		"time":Math.floor(Date.now() / 60000)
	}
	
	return JSON.stringify(gameState);
}

function getSaveCookie() {
    var dc = document.cookie;
    var prefix = "gameState=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
} 

//P=point to check, C=center of ellipse, Rx is x radius, Ry is y radius
function isInEllipse(P, C, Rx, Ry){
	Rx = Rx**2;
	Ry = Ry**2;
	var a = Ry*((P.x - C.x)**2);
	var b = Rx*((P.y - C.y)**2);
	var c = Rx * Ry;
	return a+b<=c;
}

//fancy string format function
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };

function getPrestigeCost(){
	return Math.floor(16  * ((prestigeCount+1)**.5));
}

function getPrestigeGain(){
	return getUpgradeCount() + (totalPaths>>6);
}

function buy(type){
	switch(type){
		case 'Refine0':
			var cost = getPrestigeCost();
			if(resources[0]['amt'] >= cost){
				resources[1]['amt'] += getPrestigeGain();
				resetT0();
				prestigeCount++;
				buildWorld();
			}
			break;
		case 'MaxMinions':
			var cost = getMaxMinionCost();
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;
				maxMinions++;
				
				document.getElementById("btnBuyMaxMinions").innerHTML = "Max Minions++ (" + (maxMinions**2 * 10) + "τ)";
			}
			break;
		case 'UnlockDart':
			var cost = 100;
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;
				
				minionResearch['Dart'].isUnlocked=1;
				document.getElementById("btnUnlockDart").style.display='none';
			}
			break;
		case 'UnlockDozer':
			var cost = 100;
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;

				minionResearch['Dozer'].isUnlocked=1;
				document.getElementById("btnUnlockDozer").style.display='none';
			}
			break;
		case 'ShowRange':
			var cost = 10;
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;
				document.getElementById("buyShowRange").style.display='none';
				document.getElementById("divShowRange").style.display='block';
				gauges['range']=1;
			}
			break;
		case 'ShowReload':
			var cost = 10;
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;
				document.getElementById("buyShowReload").style.display='none';
				document.getElementById("divShowReload").style.display='block';
				gauges['reload']=1;
			}
			break;
		case 'ShowHP':
			var cost = 10;
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;
				document.getElementById("buyShowHP").style.display='none';
				document.getElementById("divShowHP").style.display='block';
				gauges['hp']=1;
			}
			break;
		case 'ShowDMG':
			var cost = 10;
			if(resources[1]['amt'] >= cost){
				resources[1]['amt'] -= cost;
				document.getElementById("buyShowDMG").style.display='none';
				document.getElementById("divShowDMG").style.display='block';
				gauges['dmg']=1;
			}
			break;
		case '':
			break;
		default: //minion upgrades
			var key = type.split('_')[0];
			type = type.split('_')[1];
			var cost = getUpgradeCost(key, type);
			
			
			if(getResearchType(type) == 0){
				if(cost > 0 && resources[0]['amt'] >= cost){
					resources[0]['amt']-=cost;
					minionUpgrades[key][type]++;
				}
			}
			else if(getResearchType(type) == 1){
				if(cost > 0 && resources[1]['amt'] >= cost){
					resources[1]['amt']-=cost;
					minionUpgrades[key][type]++;
				}
			}
			break;
	}
}

function getPathYatX(x){
	var index = 0;
	while(path[index].x < x && index < path.length-1){
		index++;
	}
	return path[index].y;
}

function getLastTower(){
	if(!towers || !towers.length){
		return null;
	}
	
	return towers[towers.length -1]
}
