"use strict";
//https://www.desmos.com/calculator
const minionUpgradeTypes = [
	[statTypes.health,statTypes.damage],
	[statTypes.attackDelay,statTypes.moveSpeed],
	[statTypes.attackRange,statTypes.impactRadius],
	[statTypes.minionsPerDeploy,statTypes.spawnDelay]
];

function getUpgradeTier(type){
	for(let i=0;i<minionUpgradeTypes.length;i++){
		if(minionUpgradeTypes[i].includes(type)){
			return i;
		}
	}
	return -1;
}
function getMoneyPitCost(){
	const discount = getDiscount(0);
	return Math.max(0,((2**moneyPitLevel))-discount);
}
function getMaxMinionCost(){
	const discount = getDiscount(1);
	const cost = 10*maxMinions**3+10*maxMinions**2+10*maxMinions;
	return Math.max(0, cost - discount);
}
function getMaxUpgradeLevelCost(){
	const upgrades = maxUpgradeLevel;
	const discount = getDiscount(2);
	const cost = (2**upgrades)*(upgrades/4)+64;
	return  Math.max(0, cost - discount);
}
function getGlobalSpawnDelayReductionCost(){
	const discount = getDiscount(3);
	return  Math.max(0, (globalSpawnDelayReduction**2) - discount);
}
function getAutoSellCost(){
	const discount = getDiscount(4);
	const count = (maxAutosellLimit/100);
	return Math.max(0, (count<<(2+count))-discount);
}
function getAutoForgeCost(){
	const discount = getDiscount(4);
	const count = (maxAutoForgeLimit/100);
	return Math.max(0, (count<<(1+count))-discount);
}
function getRestartLevelCost(){
	const discount = getDiscount(4);
	const x = maxResetLevel+1;
	const maxX = Math.min(achievements.maxLevelCleared.count+1, 10);
	if(x>maxX){return Infinity;}
	return Math.max(0, (2**x)+(x**2)+61);
}
function getStoreChestCost(){
	const level = +getUIElement("numStoreTier").value;
	const discount = getDiscount(5);
	const cost = (level+1)**2;
	return Math.max(1, cost-discount);
}

function getAutobuyCost(tier){
	const x = tier+1;
	const discount = getDiscount(x);
	return Math.max(0,(8*x) - discount);
}

function getPotencies(){
	const output = {};
	for(let i=0;i<4;i++){
		output[i] = getUpgradePotency(i);
	}
	return output;
}
function getUpgradePotency(tier){
	return tierMisc["t"+tier]?.upgradePotency||1;
}
function getPotencyCost(tier){
	const discount = getDiscount(tier + 1);
	const x = getUpgradePotency(tier);
	return Math.max(0, ( (4*(x**4)) + (2*(x**2)) + 40) - discount);
}
function getUpgradeCost(key, type){
	const purchased = minionUpgrades[key][type];
	if(purchased == null){ return -1; }
	if(purchased >= maxUpgradeLevel){return Infinity; }
	
	const tier = getUpgradeTier(type);
	const discount = getDiscount(tier);
	return  Math.max(0, (2**Math.floor(purchased)) - discount);
}
function getEnhanceCost(key, type){
	const purchased = bossUpgrades[key][type];
	if(purchased == null){ return -1; }
	if(purchased >= maxUpgradeLevel){return Infinity; }
	
	const discount = getDiscount(3);
	
	return Math.max(0, (2**Math.floor(purchased+2)) - discount);
}
function getPrestigeCost(tier){
	const a = ((achievements["prestige"+tier].count+1)**.5);
	const b = (tier<<1)+1;
	const c = 16;
	const discount = getDiscount(tier);
	return Math.max(0, Math.floor(a*b*c) - discount);
}

function getPrestigeGain(tier){
	const exp = (5+(tier/2))/10;
	const b = ((getPrestigeBonus(tier)**exp) || 1);
	const r = Object.keys(resources)[tier+1];
	const ee = getEquippedEffect(r, "gain");
	const c = getUpgradeCount(tier);
	
	return Math.floor((c+ee.a)*b*ee.m);
}
function getUpgradeCount(tier){
	let total = 0;
	const upgrades = minionUpgradeTypes[tier];
	
	if(tier==0)
	{
		for(let minion in minionUpgrades){
			for(let id in upgrades){
				const upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		total += moneyPitLevel;
	}
	else if(tier==1){
		for(let minion in minionUpgrades){
			for(let id in upgrades){
				const upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		total += maxMinions;
	}
	else if(tier==2){
		for(let minion in minionUpgrades){
			for(let id in upgrades){
				const upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		total += globalSpawnDelayReduction;
		total += maxUpgradeLevel-defaultMaxUpgradeLevel;
	}
	else if(tier==3){
		for(let minion in minionUpgrades){
			for(let id in upgrades){
				const upgrade = upgrades[id];
				total += minionUpgrades[minion][upgrade];
			}
		}
		
		for(let boss in bossUpgrades){
			for(let id in bossUpgrades[boss]){
				total += bossUpgrades[boss][id];
			}
		}
		}else if(tier==4){
		total += maxAutosellLimit/100;
	}
	
	total *= getUpgradePotency(tier);
	return total;
}

function unlockMinionCost(minionType){
	const unlockT = minionResearch[minionType].unlockT;
	const discount = getDiscount(unlockT);
	
	let unlocked = 0;
	for(let minionType in minionResearch){
		if(!minionResearch[minionType].isUnlocked){continue;}
		if(minionResearch[minionType].unlockT != unlockT){continue;}
		
		unlocked++;
	}
	
	const cost = (16 * unlocked) + getMinionBaseStats(minionType).unlockCost - discount;
	return Math.max(0, cost);
}
function unlockBossCost(){
	const discount = getDiscount(3);
	const unlocked = Object.keys(bossResearch).reduce((a,c)=>a+(bossResearch[c].isUnlocked?1:0),0);
	const cost = baseBossDefault.unlockCost + (16 * unlocked) - discount;
	return Math.max(0, cost);
}

function unlock(id){
	const btn = document.getElementById(id);
	const type = btn.getAttribute("unlockType");
	const category = btn.getAttribute("unlockCategory");
	
	switch(category){
		case "Minion":{
			unlockMinion(type);
			break;
		}
		case "Boss":{
			unlockBoss(type);
			break;
		}
		case "Gauge":{
			unlockGauge(type);
			break;
		}
		default:{
			console.warn("Unknown category:" + category);
			break;
		}
	}
}
function unlockMinion(type){
	const cost = unlockMinionCost(type);
	if(minionResearch[type].isUnlocked){return;}
	
	let paid = false;
	if(minionResearch[type].unlockT == 0){
		if(resources.a.amt >= cost){
			resources.a.amt -= cost;
			paid = true;
			
			if(cost === 0 && achievements.prestige0.count === 0){
				addHilite("btnMnuMinions", Infinity);
			}
		}
	}
	if(minionResearch[type].unlockT == 1){
		if(resources.b.amt >= cost){
			resources.b.amt -= cost;
			paid = true;
		}
	}
	else if(minionResearch[type].unlockT == 2){
		if(resources.c.amt >= cost){
			resources.c.amt -= cost;
			paid = true;
		}
	}
	
	if(paid){
		minionResearch[type].isUnlocked = 1;
		if(getUIElement("chkAutoSpawnMinions").checked){
			getUIElement("chkSpawn" + type).checked = true;
		}
	}
}
function unlockBoss(type){
	const b = bossResearch[type];
	if(b == null){return;}
	if(b.isUnlocked){return;}
	
	const cost = unlockBossCost();
	if(resources.d.amt < cost){return;}
	resources.d.amt -= cost;
	b.isUnlocked=1;
}
function unlockGauge(type){
	const g = gauges[type];
	if(g == null){ return; }
	if(g.isUnlocked){return;}
	const cost = gauges.Range.cost;
	if(resources.b.amt < cost){ return; }
	
	resources.b.amt -= cost;
	g.isUnlocked=1;
}
function unlockAutobuy(tier, cost){
	
	if(tierMisc["t"+tier].autobuy.isUnlocked){return;}
	
	if(!cost){
    	cost = getAutobuyCost(tier);
	}
	
	switch(tier){
		case 0:{
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				tierMisc.t0.autobuy.isUnlocked=1;
			}
			break;
		}
		case 1:{
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				tierMisc.t1.autobuy.isUnlocked=1;
			}
			break;
		}
		case 2:{
			if(resources.d.amt >= cost){
				resources.d.amt -= cost;
				tierMisc.t2.autobuy.isUnlocked=1;
			}
			break;
		}
		case 3:{
			if(resources.e.amt >= cost){
				resources.e.amt -= cost;
				tierMisc.t3.autobuy.isUnlocked=1;
			}
			break;
		}
		default:{
			console.warn("Unknown unlock autobuy:'" + type + "'");
			break;
		}
	}
}
function upgradePotency(tier, cost){
	if(!cost){
		cost = getPotencyCost(tier)
	}
	switch(tier){
		case 0:{
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				tierMisc.t0.upgradePotency++;
			}
			break;
		}
		case 1:{
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				tierMisc.t1.upgradePotency++;
			}
			break;
		}
		case 2:{
			if(resources.d.amt >= cost){
				resources.d.amt -= cost;
				tierMisc.t2.upgradePotency++;
			}
			break;
		}
		case 3:{
			if(resources.e.amt >= cost){
				resources.e.amt -= cost;
				tierMisc.t3.upgradePotency++;
			}
			break;
		}
	}
}

function prestige(id){
	const btn = document.getElementById(id);
	const tier = Number(btn.getAttribute("tier"));
	
	prestigeTier(tier);
}
function prestigeTier(tier){
	switch(tier){
		case 0:{
			const cost = getPrestigeCost(0);
			if(resources.a.amt >= cost){
				if(achievements.prestige0.count == 0){
					addHilite("btnMnuGym", Infinity);
					addHilite("btnMnuAchievements", Infinity);
					addHilite("divT1Resource", 10);
				}
				
				resources.b.amt += getPrestigeGain(0);
				resetT0();
				achievements.prestige0.count++;
				boss=null;
			}
			break;
		}
		case 1:{
			const cost = getPrestigeCost(1);
			if(resources.b.amt >= cost){
				if(achievements.prestige1.count == 0){
					addHilite("btnMnuLab", Infinity);
					addHilite("btnMnuStatistics", Infinity);
					addHilite("divT2Resource", 10);
				}
				
				resources.c.amt += getPrestigeGain(1);
				resetT1();
				achievements.prestige1.count++;
			}
			break;
		}
		case 2:{
			const cost = getPrestigeCost(2);
			if(resources.c.amt >= cost){
				if(achievements.prestige2.count == 0){
					addHilite("btnMnuBosses", Infinity);
					addHilite("btnMnuOffice", Infinity);
					addHilite("divT3Resource", 10);
				}
				
				resources.d.amt += getPrestigeGain(2);
				resetT2();
				achievements.prestige2.count++;
			}
			break;
		}
		case 3:{
			const cost = getPrestigeCost(3);
			if(resources.d.amt >= cost){
				if(achievements.prestige3.count == 0){
					addHilite("btnMnuForge", Infinity);
					addHilite("divT4Resource", 10);
				}
				
				resources.e.amt += getPrestigeGain(3);
				resetT3();
				achievements.prestige3.count++;
			}
			break;
		}
		default:{
			console.warn("Unknown prestige:'" + tier + "'");
			break;
		}
	}
	
}

function GetMiscCost(type, tier){
	type = type.split("_")[0];
	switch(type){
		case "moneyPit":{
			return getMoneyPitCost();
		}
		case "maxMinions":{
			return getMaxMinionCost();
		}
		case "upgradePotency":{
			return getPotencyCost(tier-1);
		}
		case "autoBuy":{
			return getAutobuyCost(tier-1);
		}
		case "upgradeLimit":{
			return getMaxUpgradeLevelCost();
		}
		case "reduceDeployTime":{
			return getGlobalSpawnDelayReductionCost();
		}
		case "autoSell":{
			return getAutoSellCost();
		}
		case "autoForge":{
			return getAutoForgeCost();
		}
		case "startingLevel":{
			return getRestartLevelCost();
		}
		default:{
			console.warn("Unknown cost:'" + type + "'");
			console.trace();
			break;
		}
	}
	return -1
}

function buy(id, tier){
	const btn = document.getElementById(id);
	const type = btn.getAttribute("purchaseType").split("_")[0];
	const tierNumber = Number(btn.getAttribute("tier"));
	const cost = GetMiscCost(type, tierNumber);
	
	switch(type){
		case "moneyPit":{
			if(resources.a.amt >= cost){
				resources.a.amt -= cost;
				moneyPitLevel++;
			}
			break;
		}
		case "maxMinions":{
			if(resources.b.amt >= cost){
				resources.b.amt -= cost;
				maxMinions++;
			}
			break;
		}
		case "autoBuy":{
			unlockAutobuy(tierNumber-1, cost);
			break;
		}
		case "upgradePotency":{
			upgradePotency(tierNumber-1, cost);
			break;
		}
		case "upgradeLimit":{
			if(resources.c.amt >= cost){
				resources.c.amt -= cost;
				maxUpgradeLevel++;
			}
			break;
		}
		case "reduceDeployTime":{
			if(resources.d.amt >= cost){
				resources.d.amt -= cost;
				globalSpawnDelayReduction++;
			}
			break;
		}
		case "autoSell":{
			if(resources.e.amt >= cost){
				resources.e.amt -= cost;
				maxAutosellLimit+=100;
				getUIElement("autoSellLimit").max = maxAutosellLimit;
				setElementTextById("maxAutosell", maxAutosellLimit);
			}
			break;
		}
		case "autoForge":{
			if(resources.e.amt >= cost){
				resources.e.amt -= cost;
				maxAutoForgeLimit+=100;
				getUIElement("autoForgeLimit").max = maxAutoForgeLimit;
				setElementTextById("maxAutoForge", maxAutoForgeLimit);
			}
			break;
		}
		case "startingLevel":{
			if(resources.e.amt >= cost){
				resources.e.amt -= cost;
				maxResetLevel++;
				getUIElement("startingLevelSelector").max = maxResetLevel;
				if(maxResetLevel==10){
					resources.f.amt+=64;
				}
			}
			break;
		}
		default:{
			console.warn("Unknown buy:'" + type + "'" + tier);
			console.trace();
			break;
		}
	}
	updatePnl1();
}
function upgrade(id){
	const btn = document.getElementById(id);
	const unit = btn.getAttribute("minionType");
	const type = btn.getAttribute("upgradeType");
	buyUpgrade(unit,type);
}
function buyUpgrade(unit, type){
	const cost = getUpgradeCost(unit, type);
	
	if(cost < 0){
		console.error(`Unable to upgrade:${unit}:${type}`);
	}
	const upgradeTier = getUpgradeTier(type);
	
	if(upgradeTier == 0){
		if(resources.a.amt >= cost){
			resources.a.amt-=cost;
			minionUpgrades[unit][type]++;
		}
	}
	else if(upgradeTier == 1){
		if(resources.b.amt >= cost){
			resources.b.amt-=cost;
			minionUpgrades[unit][type]++;
		}
	}
	else if(upgradeTier == 2){
		if(resources.c.amt >= cost){
			resources.c.amt -= cost;
			minionUpgrades[unit][type]++;
		}
	}
	else if(upgradeTier == 3){
		if(resources.d.amt >= cost){
			resources.d.amt -= cost;
			minionUpgrades[unit][type]++;
		}
		
	}
}
function enhance(id){
	const btn = document.getElementById(id);
	const bossType = btn.getAttribute("bossType");
	const upgradeType = btn.getAttribute("upgradeType");
	enhanceBoss(bossType, upgradeType);
}
function enhanceBoss(bossType, upgradeType){
	const cost = getEnhanceCost(bossType, upgradeType);
	
	if(resources.d.amt >= cost){
		resources.d.amt -= cost;
		bossUpgrades[bossType][upgradeType]++;
	}
}


function upgradeItemAttr(id, index){
	const item = inventory.find(x => x.id == id);
	const attr = index == "stat"? item.stat : item.attributes[index];
	
	if(attr.power >= attr.range.max){return;}
	let cost = attr.range.upgradePrice();
	if(cost > resources.e.amt){return;}
	
	const step = attr.range.step();
	resources.e.amt -= cost;
	const newP = Math.floor((attr.power+step)*100)/100;
	attr.power = Math.min(attr.range.max, newP);
	
	if(attr.range.max == attr.power){
		if(!tierUnlocked(5)){
			addHilite("btnMnuStore", Infinity);
			addHilite("divT5Resource", 10);
		}
		
		const ee = getEquippedEffect("f", "gain");
		resources.f.amt+=(item.tier+1+ee.a)*ee.m;
	}
	
	populateForgeAttributes();
	
	item.updateHtml("inv");
	if(item.isEquipped()){
		item.updateHtml("eq");
	}
	const option = getUIElement("ddlForgeItems").selectedOptions[0];
	setElementText(option, item.toString());
}
function prestigeItemAttr(id, index){
	if(index == "stat"){return;}//can't prestige stat
	const item = inventory.find(x => x.id == id);
	const attr = item.attributes[index];
	const attrMax = Math.max(0, item.maxAttrIndex()+attr.indexAdjustment);
	
	if(attr.range.index >= attrMax){return;}
	
	const cost = attr.range.prestigePrice();
	if(cost > resources.e.amt){return;}
	
	attr.range.index++;
	resources.e.amt -= cost;
	
	attr.range.recalculate()
	populateForgeAttributes();
	
	item.updateHtml("inv");
	if(item.isEquipped()){
		item.updateHtml("eq");
	}
	const option = getUIElement("ddlForgeItems").selectedOptions[0];
	setElementText(option, item.toString());
}
function rerollItemAttr(id, index){
	if(index == "stat"){return;}//can't reroll stat
	if(index < 0){return;}//that index doesn't work
	
	const item = inventory.find(x => x.id == id);
	if(index > item.attributes.length -1){return;}//can't add more attributes
	
	const cost = item.rerollAttrCost();
	if(cost > resources.e.amt){return;}
	
	const A = attributeFactory(item.tier, item.type);
	item.attributes[index] = A;
	resources.e.amt -= cost;
	
	populateForgeAttributes();

	item.updateHtml("inv");
	if(item.isEquipped()){
		item.updateHtml("eq");
	}
	const option = getUIElement("ddlForgeItems").selectedOptions[0];
	setElementText(option, item.toString());
}
function prestigeItem(){
	const ddl = getUIElement("ddlForgeItems");
	const itemId = ddl?.value;
	if(itemId == null || itemId == "null"){return;}
	prestigeItemByID(itemId);
}

function prestigeItemByID(itemId){
	const item = inventory.find(x => x.id == itemId);
	if(!item.canPrestige()){return;}
	
	const discount = getDiscount(5);
	let cost = item.prestigeCost();
	cost = Math.max(1, cost-discount);
	if(cost > resources.f.amt){return;}
	
	const t = Math.min(7, item.tier+1);
	const options = items["t"+t][item.type];
	const name = getItem(t, item.type);
	while(itemTier["t"+t].attrCount>item.attributes.length){
		item.attributes.push(attributeFactory(t, item.type));
	}
	
	resources.f.amt -= cost;
	item.tier++;
	item.name = name;
	item.stat.range.index++;
	item.stat.range.recalculate();
	
	populateForgeItems();
	
	achievements.itemPrestiged.count++;
	
	item.updateHtml("inv");
	if(item.isEquipped()){
		item.updateHtml("eq");
	}
}

function getChestCost(){
	const level = +getUIElement("numStoreChestLevel").value;
	const msrp = (level+3)**2;
	const discount = getDiscount(5);
	return Math.max(1, msrp-discount);
}

function openChest(){
	const cost = getChestCost();
	
	if(cost > resources.f.amt){return;}
	resources.f.amt -= cost;
	const lvl = +getUIElement("numStoreChestLevel").value +getAchievementBonus("bossesSummoned");
	
	//if an item is already previewed sell it
	if(newItemPreview != null){
		sellNewItem();
	}
	
	const itemPreview = getUIElement("itemPreview");
	clearChildren(itemPreview);
	
	newItemPreview = itemFactory(lvl*4);
	newItemPreview.buildHtml(itemPreview, "preview");
	setElementTextById("newItemSellValue", newItemPreview.sellValue());
	toggleUIElementByID("divChestResult", false);
	toggleUIElementByID("fullInventory", inventory.length>=maxInventory);
	toggleUIElementByID("buyBackFullInventory", true);
}

function keepItem(){
	if(inventory.length >= 24){
		toggleUIElementByID("buyBackFullInventory", false);
		return;
	}
	
	newItemPreview.isLocked = true;
	inventory.push(newItemPreview);
	newItemPreview = null;
	const itemPreview = getUIElement("itemPreview");
	clearChildren(itemPreview);
	toggleUIElementByID("fullInventory", true);
	toggleUIElementByID("divChestResult", true);
}

function sellNewItem(){
	const gains = getEquippedEffect("e", "gain");
	resources.e.amt += (newItemPreview.sellValue() + gains.a)*gains.m;
	newItemPreview = null;
	const itemPreview = getUIElement("itemPreview");
	clearChildren(itemPreview);
	toggleUIElementByID("fullInventory", true);
	toggleUIElementByID("divChestResult", true);
}

function exchange(btn){
	if(resources.f.amt<1){return;}
	
	resources[btn.rType].amt += +btn.value;
	resources.f.amt--;
}
