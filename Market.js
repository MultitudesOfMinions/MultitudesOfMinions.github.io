function getUpgradeTier(type){
	for(var i=0;i<minionUpgradeTypes.length;i++){
		if(minionUpgradeTypes[i].includes(type)){
			return i;
		}
	}
	
	return -1;
}

function getMaxMinionCost(){return maxMinions**2 * 10;}
function getCostPotencyCost(tier){return (minionUpgradePotency[tier]+1)<<(2*(tier+3)); }
function getUpgradeCost(key, type){
	var purchased = minionUpgrades[key][type];
	if(purchased == null){ return -1; }

	var researchType = getUpgradeTier(type);
	var Potency = 1 + minionUpgradePotency[researchType];

	purchased /= Potency;
	purchased += researchType<<1;
	if(purchased == null){ return -1; }
	
	return 2**Math.floor(purchased);
}
function getEnhanceCost(key, type){
	var purchased = bossUpgrades[key][type];
	if(purchased == null){ return -1; }
	return 2**Math.floor(purchased+2);
}
function getPrestigeCost(tier){
	var a = ((prestigeCounts[tier]+1)**.5);
	var b = (tier<<2)+1;
	var c = 16;
	return Math.floor(a*b*c);
}

function getPrestigeGain(tier){
	if(tier==0){
		return getUpgradeCount(0) + (totalPaths>>6);
	}
	else if(tier == 1){
		return getUpgradeCount(1);
	}
}
function getUpgradeCount(tier){
	var total = 0;
	var upgrades = minionUpgradeTypes[tier];
	
	if(tier==0)
	{
		for(var minion in minionUpgrades){
			for(var id in upgrades){
				var upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
	}
	if(tier==1){
		for(var minion in minionUpgrades){
			for(var id in upgrades){
				var upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		total += maxMinions;
		
		for(var gauge in gauges){
			total += gauges[gauge].isUnlocked;
		}
	}

	return total;
}

function unlockMinionCost(){
	var unlocked = 0;
	for(var minionType in minionResearch){
		if(minionResearch[minionType].isUnlocked){unlocked++;}
	}
	
	return 32 * unlocked;
}
function unlockBossCost(){
	var unlocked = 0;
	for(var bossType in bossResearch){
		if(bossResearch[bossType].isUnlocked){unlocked++;}
	}
	
	return 16 * unlocked;
}
function getUnlockCategory(type){
	if(baseMinion[type]){return "Minion";}
	if(baseBoss[type]){return "Boss";}
	if(gauges[type]){return "Gauge";}
	console.error("unknown type of: " + type);
}

function unlock(btn){
	var type = btn.getAttribute("unlockType");
	var category = getUnlockCategory(type);
	
	switch(category){
		case "Minion":
			unlockMinion(type);
			break;
		case "Boss":
			unlockBoss(type);
			break;
		case "Gauge":
			unlockGauge(type);
			break;
		default:
			console.warn("Unknown category:" + category);
			break;
	}	
}
function unlockMinion(type){
	var cost = getMinionBaseStats(type).unlockCost + unlockMinionCost();

	switch(type){
		case 'Mite':
			if(!minionResearch.Mite.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				minionResearch.Mite.isUnlocked=1;
			}
			break;
		case 'Catapult':
			if(!minionResearch.Catapult.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				minionResearch.Catapult.isUnlocked=1;
			}
			break;
		case 'Manticore':
			if(!minionResearch.Manticore.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				minionResearch.Manticore.isUnlocked=1;
			}
			break;
		case 'Minotaur':
			if(!minionResearch.Minotaur.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				minionResearch.Minotaur.isUnlocked=1;
			}
			break;
		default:
			console.warn("Unknown unlock minion:'" + type + "'");
			break;
	}
}
function unlockBoss(type){
	switch(type){
		case 'War':
			var cost = baseBoss.War.unlockCost + unlockBossCost();
			if(!bossResearch.War.isUnlocked && resources.c.amt >= cost){
				resources.c.amt -= cost;
				bossResearch.War.isUnlocked=1;
			}
			break;
		case 'Famine':
			var cost = baseBoss.Famine.unlockCost + unlockBossCost();
			if(!bossResearch.Famine.isUnlocked && resources.c.amt >= cost){
				resources.c.amt -= cost;
				bossResearch.Famine.isUnlocked=1;
			}
			break;
		case 'Death':
			var cost = baseBoss.Death.unlockCost + unlockBossCost();
			if(!bossResearch.Death.isUnlocked && resources.c.amt >= cost){
				resources.c.amt -= cost;
				bossResearch.Death.isUnlocked=1;
			}
			break;
		default:
			console.warn("Unknown unlock minion:'" + type + "'");
			break;
	}
}
function unlockGauge(type){
	switch(type){
		case 'Range':
			var cost = gauges.Range.cost;
			if(!gauges.Range.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Range.isUnlocked=1;
			}
			break;
		case 'Reload':
			var cost = gauges.Reload.cost;
			if(!gauges.Reload.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Reload.isUnlocked=1;
			}
			break;
		case 'Health':
			var cost = gauges.Health.cost;
			if(!gauges.Health.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Health.isUnlocked=1;
			}
			break;
		case 'Damage':
			var cost = gauges.Damage.cost;
			if(!gauges.Damage.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Damage.isUnlocked=1;
			}
			break;
		default:
			console.warn("Unknown unlock gauge:'" + type + "'");
			break;
	}
}

function buy(btn){
	var type = btn.getAttribute("purchaseType");
	switch(type){
		case 'Prestige0':
			var cost = getPrestigeCost(0);
			if(resources.a.amt >= cost){
				resources.b.amt += getPrestigeGain(0);
				resetT0();
				prestigeCounts[0]++;
				boss=null;
				buildWorld();
			}
			break;
		case 'Prestige1':
			var cost = getPrestigeCost(1);
			if(resources.b.amt >= cost){
				resources.c.amt += getPrestigeGain(1);
				resetT0();
				resetT1();
				prestigeCounts[1]++;
				buildWorld();
			}
			break;
		case 'MaxMinions':
			var cost = getMaxMinionCost();
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				maxMinions++;
			}
			break;
		case 'T0UpgradePotency':
			var cost = getCostPotencyCost(0);
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				minionUpgradePotency[0]++;
			}
			break;
		case 'T1UpgradePotency':
			var cost = getCostPotencyCost(1);
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				minionUpgradePotency[1]++;
			}
			break;
		default:
			console.warn("Unknown buy:'" + type + "'");
			break;

	}
}
function upgrade(btn){
	var unit = btn.getAttribute("minionType");
	var type = btn.getAttribute("upgradeType");
	var cost = getUpgradeCost(unit, type);
	
	if(cost <= 0){ 
		console.error("Invalid upgrade cost:{0}:{1}".format(unit, type)); 
	}
	var upgradeTier = getUpgradeTier(type);
	
	Potency = minionUpgradePotency[upgradeTier] + 1;
	if(upgradeTier == 0){
		if(resources.a.amt >= cost){
			resources.a.amt-=cost;
			minionUpgrades[unit][type]+=Potency;
		}
	}
	else if(upgradeTier == 1){
		if(resources.b.amt >= cost){
			resources.b.amt-=cost;
			minionUpgrades[unit][type]+=Potency;
		}
	}
	else if(upgradeTier == 2){
		if(resources.c.amt >= cost){
			resources.c.amt -= cost;
			minionUpgrades[unit][type]+=Potency;
		}
	}
}
function enhance(btn){
	var unit = btn.getAttribute("bossType");
	var type = btn.getAttribute("upgradeType");
	var cost = getEnhanceCost(unit, type);

	if(resources.c.amt >= cost){
		resources.c.amt -= cost;
		bossUpgrades[unit][type]++;
	}
}
