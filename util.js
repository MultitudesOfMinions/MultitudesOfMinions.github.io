function point(x, y){ this.x = x||0; this.y = y||0; }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getUpgradeCost(key, type){
	var purchased = minionUpgrades[key][type];
	
	purchased += 3 * getResearchLevel(type);

	if(purchased == null){ return -1; }
	return 2**purchased;
}

function getResearchLevel(type){
	if(type == 'hp' || type == 'damage'){return 0;}
	if(type == 'attackRange' || type == 'attackRate' || type == 'spawnDelay' || type == 'moveSpeed'){return 1;}
}

function getMaxMinionCost(){return maxMinions**2 * 10;}

function getRebirthCost(){
	return 100;//TODO: balance rebirth cost
}

function getUpgradeCount(){
	var total = 0;
	
	for(var key in minionUpgrades){
		for(var type in minionUpgrades[key]){
			total += minionUpgrades[key][type];
		}
	}

	return total;
}

function getLevel(){
	return Math.floor(totalD/64);
}

function LevelToTotalD(Level){
	return Level*64;
}

function getSpawnDelay(type){
	return baseMinions[type].spawnDelay * (minionUpgradeMultipliers**minionUpgrades[type].spawnDelay);
}

function buildGameState(){
	var gameState = {
		"minionResearch":{
			"Tank":{ isUnlocked:baseMinions['Tank'].isUnlocked },
			"Swarmer":{ isUnlocked:baseMinions['Swarmer'].isUnlocked }
		},
		"minionUpgrades":{
			"Grunt":{ "hp":minionUpgrades['Grunt'].hp, "damage":minionUpgrades['Grunt'].damage, "moveSpeed":minionUpgrades['Grunt'].moveSpeed, "attackRate":minionUpgrades['Grunt'].attackRate, "projectileSpeed":minionUpgrades['Grunt'].projectileSpeed, "attackRange":minionUpgrades['Grunt'].attackRange, "spawnDelay":minionUpgrades['Grunt'].spawnDelay },
			"Tank":{ "hp":minionUpgrades['Tank'].hp, "damage":minionUpgrades['Tank'].damage, "moveSpeed":minionUpgrades['Tank'].moveSpeed, "attackRate":minionUpgrades['Tank'].attackRate, "projectileSpeed":minionUpgrades['Tank'].projectileSpeed, "attackRange":minionUpgrades['Tank'].attackRange, "spawnDelay":minionUpgrades['Tank'].spawnDelay },
			"Swarmer":{ "hp":minionUpgrades['Swarmer'].hp, "damage":minionUpgrades['Swarmer'].damage, "moveSpeed":minionUpgrades['Swarmer'].moveSpeed, "attackRate":minionUpgrades['Swarmer'].attackRate, "projectileSpeed":minionUpgrades['Swarmer'].projectileSpeed, "attackRange":minionUpgrades['Swarmer'].attackRange, "spawnDelay":minionUpgrades['Swarmer'].spawnDelay },
		},
		"indicators":{ "range":indicators['range'], "reload":indicators['reload'], "hp":indicators['hp'], "dmg":indicators['dmg'] },
		"maxMinions":maxMinions,
		"resources":{ "scrap":resources['scrap'], "rag":resources['rag']||0 },
		"level":getLevel(),
		"rebirthCount":rebirthCount,
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

function buy(type){
	switch(type){
		case 'Prestige':
			var cost = 100;
			if(resources['scrap'] >= cost){
				document.getElementById('pnl2').style.display='block';
				resources['rag'] += getUpgradeCount() + (totalD>>6) - 1;
				resources['scrap'] = 0;
				
				for(var key in minionUpgrades)
				{
					//reset hp/dmg upgrades
					minionUpgrades[key]['hp']=0;
					minionUpgrades[key]['damage']=0;
				}
				buildWorld();
			}
			rebirthCount++;
			break;
		case 'MaxMinions':
			var cost = getMaxMinionCost();
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;
				maxMinions++;
				
				document.getElementById("btnBuyMaxMinions").innerHTML = "Max Minions++ (" + (maxMinions**2 * 10) + ")";
			}
			break;
		case 'UnlockSwarmer':
			var cost = 100;
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;
				
				baseMinions['Swarmer'].isUnlocked=1;
				document.getElementById("btnUnlockSwarmer").style.display='none';
			}
			break;
		case 'UnlockTank':
			var cost = 100;
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;

				baseMinions['Tank'].isUnlocked=1;
				document.getElementById("btnUnlockTank").style.display='none';
			}
			break;
		case 'ShowRange':
			var cost = 10;
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;
				document.getElementById("buyShowRange").style.display='none';
				document.getElementById("divShowRange").style.display='block';
				indicators['range']=1;
			}
			break;
		case 'ShowReload':
			var cost = 10;
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;
				document.getElementById("buyShowReload").style.display='none';
				document.getElementById("divShowReload").style.display='block';
				indicators['reload']=1;
			}
			break;
		case 'ShowHP':
			var cost = 10;
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;
				document.getElementById("buyShowHP").style.display='none';
				document.getElementById("divShowHP").style.display='block';
				indicators['hp']=1;
			}
			break;
		case 'ShowDMG':
			var cost = 10;
			if(resources['rag'] >= cost){
				resources['rag'] -= cost;
				document.getElementById("buyShowDMG").style.display='none';
				document.getElementById("divShowDMG").style.display='block';
				indicators['dmg']=1;
			}
			break;
		case '':
			break;
		default: //minion upgrades
			var key = type.split('_')[0];
			type = type.split('_')[1];
			var cost = getUpgradeCost(key, type);
			
			
			if(getResearchLevel(type) == 0){
				if(cost > 0 && resources['scrap'] >= cost){
					resources['scrap']-=cost;
					minionUpgrades[key][type]++;
				}
			}
			else if(getResearchLevel(type) == 1){
				if(cost > 0 && resources['rag'] >= cost){
					resources['rag']-=cost;
					minionUpgrades[key][type]++;
				}
			}
			break;
	}
	
	console.log(buildGameState());
}

