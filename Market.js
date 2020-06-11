function getUpgradeTier(type){
	for(var i=0;i<minionUpgradeTypes.length;i++){
		if(minionUpgradeTypes[i].includes(type)){
			return i;
		}
	}
	
	return -1;
}

function getUpgradePotency(tier){
	return tierMisc["t"+tier].upgradePotency
}
function getMaxMinionCost(){return maxMinions**2 * 10;}
function getPotencyCost(tier){
	var p = getUpgradePotency(tier);
	return (((p**4)*4)+64)<<tier;
}
function getUpgradeCost(key, type){
	var purchased = minionUpgrades[key][type];
	if(purchased == null){ return -1; }

	var tier = getUpgradeTier(type);
	var discount = getDiscount(tier);
	var Potency = 1 + getUpgradePotency(tier);

	purchased /= Potency;
	purchased += tier<<1;
	if(purchased == null){ return -1; }
	if(purchased >= maxUpgradeLevel){return Infinity; }
	
	return  Math.max(0, (2**Math.floor(purchased)) - discount);
}
function getEnhanceCost(key, type){
	var purchased = bossUpgrades[key][type];
	var discount = getDiscount(3);
	if(purchased == null){ return -1; }
	return Math.max(0, (2**Math.floor(purchased+2)) - discount);
}
function getPrestigeCost(tier){
	var a = ((achievements["prestige" + tier].count+1)**.5);
	var b = (tier<<2)+1;
	var c = 16;
	var discount = getDiscount(tier);
	return Math.max(0, Math.floor(a*b*c) - discount);
}
function getMaxUpgradeLevelCost(){
	var upgrades = 9 - maxUpgradeLevel;
	var discount = getDiscount(2);

	return  Math.max(0, (upgrades**4) - discount);
}
function getGlobalSpawnDelayReductionCost(){
	var discount = getDiscount(2);
	return  Math.max(0, (globalSpawnDelayReduction**2) - discount);
}

function getPrestigeGain(tier){
	var bonus = getPrestigeBonus(tier)
	if(tier == 0){
		return getUpgradeCount(0) + bonus;
	}
	else if(tier == 1){
		return getUpgradeCount(1) + bonus;
	}
	else if(tier == 2){
		return getUpgradeCount(2) + bonus;
	}
	else if(tier == 3){
		return getUpgradeCount(3) + bonus;
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
	else if(tier==1){
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
	else if(tier==2){
		for(var minion in minionUpgrades){
			for(var id in upgrades){
				var upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		total += globalSpawnDelayReduction;
		total += maxUpgradeLevel-10;
	}
	else if(tier==3){
		for(var minion in minionUpgrades){
			for(var id in upgrades){
				var upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		for(var boss in bossUpgrades){
			for(var id in bossUpgrades[boss]){
				total += bossUpgrades[boss][id];
			}
		}
	}

	return total;
}

function unlockMinionCost(minionType){
	var unlocked = 0;
	var unlockT = minionResearch[minionType].unlockT;
	
	for(var minionType in minionResearch){
		if(minionType == "Mite"){continue;}
		if(!minionResearch[minionType].isUnlocked){continue;}
		if(minionResearch[minionType].unlockT != unlockT){continue;}
		
		unlocked++;
	}
	
	return (32 * unlocked) + getMinionBaseStats(minionType).unlockCost;
}
function unlockBossCost(){
	var unlocked = 0;
	for(var bossType in bossResearch){
		if(bossResearch[bossType].isUnlocked){unlocked++;}
	}
	
	return 16 * unlocked;
}
function getUnlockCategory(type){
	//TODO: fix this; addAttribute or something.
	if(baseMinion[type]){return "Minion";}
	if(baseBoss[type]){return "Boss";}
	if(gauges[type]){return "Gauge";}
	if(type.startsWith("autobuy")){ return "Autobuy"; }
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
		case "Autobuy":
			unlockAutobuy(type)
			break;
		default:
			console.warn("Unknown category:" + category);
			break;
	}	
}
function unlockMinion(type){
	var cost = unlockMinionCost(type);
	if(minionResearch[type].isUnlocked){return;}
	
	if(minionResearch[type].unlockT == 1){
		if(resources.b.amt >= cost){
			resources.b.amt -= cost;
			minionResearch[type].isUnlocked = 1;
			document.getElementById("chkSpawn" + type).checked = true;
		}
	}
	else if(minionResearch[type].unlockT == 2){
		if(resources.c.amt >= cost){
			resources.c.amt -= cost;
			minionResearch[type].isUnlocked = 1;
			document.getElementById("chkSpawn" + type).checked = true;
		}
	}
}
function unlockBoss(type){
	switch(type){
		case "War":
			var cost = baseBoss.War.unlockCost + unlockBossCost();
			if(!bossResearch.War.isUnlocked && resources.d.amt >= cost){
				resources.d.amt -= cost;
				bossResearch.War.isUnlocked=1;
			}
			break;
		case "Famine":
			var cost = baseBoss.Famine.unlockCost + unlockBossCost();
			if(!bossResearch.Famine.isUnlocked && resources.d.amt >= cost){
				resources.d.amt -= cost;
				bossResearch.Famine.isUnlocked=1;
			}
			break;
		case "Death":
			var cost = baseBoss.Death.unlockCost + unlockBossCost();
			if(!bossResearch.Death.isUnlocked && resources.d.amt >= cost){
				resources.d.amt -= cost;
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
		case "Range":
			var cost = gauges.Range.cost;
			if(!gauges.Range.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Range.isUnlocked=1;
			}
			break;
		case "Reload":
			var cost = gauges.Reload.cost;
			if(!gauges.Reload.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Reload.isUnlocked=1;
			}
			break;
		case "Health":
			var cost = gauges.Health.cost;
			if(!gauges.Health.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				gauges.Health.isUnlocked=1;
			}
			break;
		case "Damage":
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
function unlockAutobuy(type){
	switch(type){
		case "autobuy0":
			var cost = tierMisc.t0.autobuy.cost;
			if(!tierMisc.t0.autobuy.isUnlocked && resources.b.amt >= cost){
				resources.b.amt -= cost;
				tierMisc.t0.autobuy.isUnlocked=1;
			}
			break;
		case "autobuy1":
			var cost = tierMisc.t1.autobuy.cost;
			if(!tierMisc.t1.autobuy.isUnlocked && resources.c.amt >= cost){
				resources.c.amt -= cost;
				tierMisc.t1.autobuy.isUnlocked=1;
			}
			break;
		case "autobuy2":
			var cost = tierMisc.t2.autobuy.cost;
			if(!tierMisc.t2.autobuy.isUnlocked && resources.d.amt >= cost){
				resources.d.amt -= cost;
				tierMisc.t2.autobuy.isUnlocked=1;
			}
			break;
		default:
			console.warn("Unknown unlock autobuy:'" + type + "'");
			break;
	}
}

function buy(btn){
	var type = btn.getAttribute("purchaseType");
	switch(type){
		case "Prestige0":
			var cost = getPrestigeCost(0);
			if(resources.a.amt >= cost){
				if(achievements.prestige0.count == 0){
					addHilite("btnMnuGym", 10);
					addHilite("btnMnuOptions", 10);
					addHilite("btnMnuHelp", 10);
					addHilite("divT1Resource", 10);
				}
				
				resources.b.amt += getPrestigeGain(0);
				resetT0();
				achievements.prestige0.count++;
				boss=null;
				buildWorld();
			}
			break;
		case "Prestige1":
			var cost = getPrestigeCost(1);
			if(resources.b.amt >= cost){
				if(achievements.prestige1.count == 0){
					addHilite("btnMnuLab", 10);
					addHilite("btnMnuHelp", 10);
					addHilite("divT2Resource", 10);
				}
				
				resources.c.amt += getPrestigeGain(1);
				resetT0();
				resetT1();
				achievements.prestige1.count++;
				buildWorld();
			}
			break;
		case "Prestige2":
			var cost = getPrestigeCost(2);
			if(resources.c.amt >= cost){
				if(achievements.prestige2.count == 0){
					addHilite("btnMnuBosses", 10);
					addHilite("btnMnuOffice", 10);
					addHilite("btnMnuHelp", 10);
					addHilite("divT3Resource", 10);
				}
				
				resources.d.amt += getPrestigeGain(2);
				resetT0();
				resetT1();
				resetT2();
				achievements.prestige2.count++;
				buildWorld();
			}
			break;
		case "Prestige3":
			var cost = getPrestigeCost(3);
			if(resources.d.amt >= cost){
				if(achievements.prestige3.count == 0){
					addHilite("btnMnuForge", 10);
					addHilite("btnMnuHelp", 10);
					addHilite("divT4Resource", 10);
				}
				
				resources.e.amt += getPrestigeGain(3);
				resetT0();
				resetT1();
				resetT2();
				resetT3();
				achievements.prestige3.count++;
				buildWorld();
			}
			break;
		case "MaxMinions":
			var cost = getMaxMinionCost();
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				maxMinions++;
			}
			break;
		case "T0UpgradePotency":
			var cost = getPotencyCost(0);
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				tierMisc.t0.upgradePotency++;
			}
			break;
		case "T1UpgradePotency":
			var cost = getPotencyCost(1);
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				tierMisc.t1.upgradePotency++;
			}
			break;
		case "T2UpgradePotency":
			var cost = getPotencyCost(2);
			if(resources.d.amt >= cost){
				resources.d.amt -= cost;
				tierMisc.t2.upgradePotency++;
			}
			break;
		case "T3UpgradePotency":
			var cost = getPotencyCost(3);
			if(resources.e.amt >= cost){
				resources.e.amt -= cost;
				tierMisc.t3.upgradePotency++;
			}
			break;
		case "BuyMaxUpgradeLevel":
			var cost = getMaxUpgradeLevelCost();
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				maxUpgradeLevel++;
			}
			break;
		case "BuyGlobalSpawnDelay":
			var cost = getGlobalSpawnDelayReductionCost();
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				globalSpawnDelayReduction++;
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
	buyUpgrade(unit,type);
}
function buyUpgrade(unit, type){

	var cost = getUpgradeCost(unit, type);
	
	if(cost < 0){ 
		console.error("Unable to upgrade:{0}:{1}".format(unit, type)); 
	}
	var upgradeTier = getUpgradeTier(type);
	
	Potency = getUpgradePotency(upgradeTier) + 1;
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

	if(resources.d.amt >= cost){
		resources.d.amt -= cost;
		bossUpgrades[unit][type]++;
	}
}
