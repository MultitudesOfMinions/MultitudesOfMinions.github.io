"use strict";
function setElementText(element, text, fix)  {
  if(element == undefined || element == null){return;}
	if(text === 0){
	  text = "0";
	}

  if (typeof text === 'string' && fix){
  	text = text.fixString();
  }

	if(element.textContent != text)
		element.textContent = text;
}
function setElementTextById(id, text, fix)  {
	if(id === null) {
		console.error("id cannot be null");
		return;
	}
	const e = document.getElementById(id);
	if(e === null){
		console.error(id + " element not found");
		return;
	}
	if(text === null){
		console.error(id, text);
	}

  if (typeof text === 'string' && fix){
  	text = text.fixString();
  }

	if(e.textContent != text)
		e.textContent = text;
}

function setButtonAffordableClass(element, isAffordable){
	if(isAffordable){
	  if(!element.classList.contains("affordableUpg")){
		  element.classList.add("affordableUpg");
	  }
	}
	else{
	  if(element.classList.contains("affordableUpg")){
  		element.classList.remove("affordableUpg");
	  }
	}
}

const frameCount = 0;
let lastUpdateP0 = 0;
let lastUpdateP1 = 0;
function updateTeam0(){
  	manageUnderlings();
  	manageMinions();
  	manageBoss();
  	setTeam0();
  	followTheLeader();
  	setLeadInvader();
}
function updateTeam1(){
  	manageHero();
  	manageTowers();
  	setTeam1();
}
function updateWorld(){
  	managePath();
  	manageProjectiles();
  	manageImpacts();
  	
  	checkLevelComplete();
}
let nextUpdate=0;
function update(){
  try{
    switch(nextUpdate){
      case 0:
        updateTeam0();
        nextUpdate=1;
        break;
      case 1:
        updateTeam1();
        nextUpdate=2;
        break;
      case 2:
        updateWorld();
        nextUpdate=0;
        break;
    }

  	consecutiveMainCylceErrors = 0;
  	ticksSinceReset++;
  }
  catch(x){
    console.error(x);
    consecutiveMainCylceErrors++;
    if(consecutiveMainCylceErrors>20){
      stop();
      alert("Too many main cycle errors, see console for details. Game paused.");
    }
    
  }
}

function autoBuySell(){
  try{
  	doAutobuy();
  	doAutoSell();
  	
  	consecutiveBuySellErrors=0;
  }
  catch(x){
    console.error(x);
    consecutiveBuySellErrors++;
    if(consecutiveBuySellErrors>20){
      stop();
      alert("Too many auto buy/sell errors, see console for details. Game paused.");
    }
  }
}

function updateP0(){
  try{
  	drawUnits();
  	updateFPS();
  }
  catch(x){
    console.error(x);
    consecutiveP0Errors++;
    if(consecutiveP0Errors>20){
      stop();
      alert("Too many map update errors, see console for details. Game paused.");
    }
    
  }
}

function updateP1(){
  try{
  	toggleHilite();
  	manageBombCountdown();
  	setMinionOrder();
  	updatePnl1();
  	updateResourceDisplay();

  	consecutiveP1Errors=0;
  }
  catch(x){
    console.error(x);
    consecutiveP1Errors++;
    if(consecutiveP1Errors>20){
      stop();
      alert("Too many button update errors, see console for details. Game paused.");
    }
    
  }
}

function checkLevelComplete(){
	if(hero === null && squire === null && page === null){
		if(level >= achievements.maxLevelCleared.maxLevel){
		  stop();
		  document.getElementById("confirmModal").style.display="block";
		}
		else{
  		achievements.maxLevelCleared.count = Math.max(achievements.maxLevelCleared.count, level);
  		level=(+level+1);
  		
  		levelStartX = getEndOfLevelX(level-1);
  		levelEndX = getEndOfLevelX(level);
  		addHero();
		}
	}
}

function updateResourceDisplay(){
  const a = resources.a.amt>1000000?resources.a.amt.toExponential(2):Math.floor(resources.a.amt);
  const b = resources.b.amt>1000000?resources.b.amt.toExponential(2):Math.floor(resources.b.amt);
  const c = resources.c.amt>1000000?resources.c.amt.toExponential(2):Math.floor(resources.c.amt);
  const d = resources.d.amt>1000000?resources.d.amt.toExponential(2):Math.floor(resources.d.amt);
  const e = resources.e.amt>1000000?resources.e.amt.toExponential(2):Math.floor(resources.e.amt);
  const f = resources.f.amt>1000000?resources.f.amt.toExponential(2):Math.floor(resources.f.amt);

	setElementText(getUIElement("spnResourceAAmt"), a, false);
	setElementText(getUIElement("spnResourceBAmt"), b, false);
	setElementText(getUIElement("spnResourceCAmt"), c, false);
	setElementText(getUIElement("spnResourceDAmt"), d, false);
	setElementText(getUIElement("spnResourceEAmt"), e, false);
	setElementText(getUIElement("spnResourceFAmt"), f, false);
}

let thisLoop=0;
let lastLoop=0;
let frameTime=0;
function updateFPS(){
  const delta = (thisLoop=Date.now()) - lastLoop;
  frameTime+= (delta - frameTime) / 16;
  lastLoop = thisLoop;
  
	if(showFPS()){
	  ctx.fillStyle="#0009"
	  ctx.fillRect(0,0,42,17);
	  
	  const fps = Math.floor(100/frameTime)/10;
		ctx.beginPath();
		ctx.fillStyle="#FFF9";
		ctx.font = "10pt Helvetica"
		ctx.fillText(fps,10,10);
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
	if(hilites.some(x => x.id == id)){return;}
	
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

function doAutoSell(){
  if(!tierUnlocked(4)){return;}
  if(!getUIElement("chkAutoSell").checked){return;}
  
  for(let i=0;i<inventory.length;i++){
    if(inventory[i].isLocked){continue;}
    if(inventory[i].isEquipped()){continue;}
    const iscore = inventory[i].score();
    if(iscore>=autoSellLimit){continue;}
    
    sell(inventory[i].id);
  }
  
}

function doAutobuy(){
	for(let key in tierMisc){
		if(!tierMisc[key].autobuy.isUnlocked){continue;}
		if(!isAutoBuy(key)){
      toggleTierAutoPrestige(key, false);
      continue;
		}
		const tier = Number(tierMisc[key].tier);

	  let tierMaxed = true;
	  
    const r = Object.keys(resources)[tier];
    const initialAmt = resources[r].amt;
	  
	  if(tier>0){unlockAutobuy(tier-1);}
		if(tier==3){tierMaxed = bossAutoUnlock();}
		tierMaxed &= minionAutoUnlock(tier);
    if(tier > 0){upgradePotency(tier-1);}
		if(tier==3){tierMaxed &= bossAutobuy();}

		tierMaxed &= minionAutobuy(tier);
		
		let d = initialAmt-resources[r].amt;
		d = (tierMaxed)?Infinity:Math.max(d+1, resources[r].amt/2);
		
    miscTierAutobuy(tier, d);

		if(tierMaxed && getUIElement("chkAutoPrestige"+tier).checked){
		  prestigeTier(tier)
		}
	}
}
function minionAutoUnlock(tier){
	for(let minion in minionResearch){
	  
		if(minionResearch[minion].isUnlocked){continue;}
	  if(minionResearch[minion].unlockT!==tier){continue;}

	  //Try to unlock, if it doesn't take just return false;
	  unlockMinion(minion);
		if(!minionResearch[minion].isUnlocked){
		  return false;
		}
	}
	return true;
}
function minionAutobuy(tier){
  let cheapest = Infinity;
  let m = null;
  let u = null;
	const upgrades = minionUpgradeTypes[tier];

	for(let minion in minionResearch){
		if(!minionResearch[minion].isUnlocked && minionResearch[minion].unlockT >= tier){continue;}

		for(let index in upgrades){
		  const upgrade = upgrades[index];
		  const level = minionUpgrades[minion][upgrade];
		  //const cost = getUpgradeCost(minion, upgrade);
		  if(level < cheapest)
		  {
		    cheapest = level;
		    m = minion;
		    u = upgrade;
		  }
		}
	}
	
  const cost = getUpgradeCost(m, u);
  if(m!==null&&u!==null&&cost!==Infinity){
		buyUpgrade(m, u);
		return false;
	}
  return true;
}
function bossAutoUnlock(){
	for(let boss in bossResearch){
		if(bossResearch[boss].isUnlocked){continue;}

	  //Try to unlock, if it doesn't take just return false;
	  unlockBoss(boss);
		if(!bossResearch[boss].isUnlocked){
		  return false;
		}
	}
	return true;
}
function bossAutobuy(){
  let cheapest = Infinity;
  let b = null;
  let u = null;

	for(let boss in bossResearch){
		if(!bossResearch[boss].isUnlocked){continue;}

  	const upgrades = bossUpgrades[boss];
		for(let upgrade in upgrades){
		  const cost = getEnhanceCost(boss, upgrade);
		  if(cost < cheapest)
		  {
		    cheapest = cost;
		    b = boss;
		    u = upgrade;
		  }
		}
	}
	
	if(b!==null&&u!==null){
		enhanceBoss(b, u)
		return false;
	}
  return true;
}
function miscTierAutobuy(tier, max){
  		
  const buttons = miscTierButtons.find(x => x.tier === tier).buttons;
  
	let cheapestCost = max;
  let cheapestIndex = -1;
	for(let i in buttons){
	  const e = buttons[i]

	  //skip buttons that aren't available
	  if(e.button.style.display === "none"){
	    continue;
	  }

	  const cost = Number(e.cost.textContent);
	  if(cost < cheapestCost){
	    cheapestCost = cost;
	    cheapestIndex = i;
	  }
	}

	if(cheapestIndex >= 0){
		buttons[cheapestIndex].button.click();
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
		const saveTime = 100;
		if(lastSave > saveTime){//approx 1 minutes
		  try{
		    saveData();
		    consecutiveSaveErrors = 0;
		  }
		  catch(x){
		    consecutiveSaveErrors++;
		    if(consecutiveSaveErrors>5){
		      stop();
          alert("Too many auto-save errors, see console for details. Game paused.");
		    }
		  }
		}
		document.getElementById("divAutoSaveProgress").style.width = lastSave + "%";
	}
}

function updatePnl1(){
	toggleTierItems();
	if(getUIElement("divMinionDashboard").style.display != "none"){
		updateMinionSpawns();
		updateMinionDashboard();
	}
	else if(getUIElement("divBossArea").style.display != "none"){
		updateBossTab();
		updateEquipped();
		updateInventory();
	}
	else if(getUIElement("divArmory").style.display != "none"){
		updateT0();
	}
	else if(getUIElement("divGym").style.display != "none"){
		updateT1();
	}
	else if(getUIElement("divLab").style.display != "none"){
		updateT2();
	}
	else if(getUIElement("divOffice").style.display != "none"){
		updateT3();
	}
	else if(getUIElement("divForge").style.display != "none"){
		updateT4();
	}
	else if(getUIElement("divStore").style.display != "none"){
	  updateT5();
	}
	else if(getUIElement("divStatistics").style.display != "none"){
	  updateStatistics();
	}
	else if(getUIElement("divAchievements").style.display != "none"){
		updateAchievements();
	}
	else if(getUIElement("divInfo").style.display != "none"){}
	else if(getUIElement("divOptions").style.display != "none"){
		//updateOptionsTab();
	}
}
function toggleTierItems(){
	for(let i=0;i<7;i++){
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
			setButtonAffordableClass(btn, tierMisc[key].autobuy.cost <= resources[tierMisc[key].autobuy.resource].amt)
		}
	}
}
function updatePrestige(tier, resourceAmt){
  const temp = prestigeButtons.filter(x => x.tier === tier);
  if(temp.length !== 1){return;}
  const updatee = temp[0];
  
	const prestigeGain = getPrestigeGain(tier);
	setElementText(updatee.gains, prestigeGain);
  
	const prestigeCost = getPrestigeCost(tier);
	setElementText(updatee.cost, prestigeCost);
	
	setButtonAffordableClass(updatee.button, resourceAmt >= prestigeCost)
}
function updateAutoBuy(tier){
  
    const btnKey = "t"+(tier-1);
    const divKey = "t"+tier;
    const maxTier = 4;
  
    const div = tier == maxTier? null : getUIElement("divAutobuyt"+tier);
    if(div != null){
      if(tierMisc[divKey].autobuy.isUnlocked){
        div.style.display = null;
      }
      else{
        div.style.display = "none";
      }
    }

    const btn = tier == 0? null : getUIElement("btnautoBuy_"+tier);
    if(btn != null){
      if(tierMisc[btnKey].autobuy.isUnlocked){
        btn.style.display = "none";
      }
      else{
        btn.style.display = null;
      }
    }
}
function updateUpgrades(tier, upgradeList, resourceAmt){
  
  const potency = getUpgradePotency(tier);
  const perk = getAchievementBonus("prestige"+tier);
  const maxLevel = maxUpgradeLevel;
  for(let i in upgradeList){
    const list = upgradeList[i];
    if(!minionResearch[list.unitType].isUnlocked && minionResearch[list.unitType].unlockT >= tier){
      list.listElement.style.display = "none"
      continue;
    }
    list.listElement.style.display = null;
    
    for(let upgrade of list.upgrades){
			const cost = getUpgradeCost(list.unitType, upgrade.upgradeType);
			const lvl = minionUpgrades[list.unitType][upgrade.upgradeType] || 0;
      setElementText(upgrade.cost, cost!==Infinity?cost:"∞");
			setElementText(upgrade.maxLvl, maxLevel);
			setElementText(upgrade.lvl, lvl);
			setElementText(upgrade.potency, potency>1?potency+"x ":"");
			setElementText(upgrade.perk, perk>0?" +"+perk:"");
			setButtonAffordableClass(upgrade.button, cost <= resourceAmt);
    }
  }
}
function updateUnlocks(tier, resourceAmt){
  let temp = unlockButtons.filter(x => x.tier === tier);
  if(temp.length !== 1){return;}
  const unlockList = temp[0].unlocks;

  for(let i in unlockList){
    const unlock = unlockList[i];

    if(minionResearch[unlock.upgradeType] && minionResearch[unlock.upgradeType].isUnlocked){
      unlock.button.style.display = "none"
      continue;
    }
    if(bossResearch[unlock.upgradeType] && bossResearch[unlock.upgradeType].isUnlocked){
      unlock.button.style.display = "none"
      continue;
    }
    unlock.button.style.display = null;

  	const cost = tier === 3? unlockBossCost() : unlockMinionCost(unlock.upgradeType);

    setElementText(unlock.cost, cost);
		setButtonAffordableClass(unlock.button, cost <= resourceAmt);
  }
}
function updateMiscBuy(tier, resourceAmt){
  let temp = miscTierButtons.filter(x => x.tier === tier);
  if(temp.length !== 1){return;}
  const miscBuyList = temp[0].buttons;

  for(let i in miscBuyList){
    const miscBuy = miscBuyList[i];

    const type = miscBuy.button.getAttribute("purchaseType");
  	const cost = GetMiscCost(type, tier);

    setElementText(miscBuy.cost, cost!==Infinity?cost:"∞");
		setButtonAffordableClass(miscBuy.button, cost <= resourceAmt);
  }
}

function updateMinionSpawns(){
	const qPercent = Math.min(100, lastGlobalSpawn / getGlobalSpawnDelay() * 100);
	document.getElementById("divQProgress").style.width = qPercent + "%";
	
	for(let minionType in minionResearch){
	  const spawnChildren = minionSpawns[minionType];
		if(minionResearch[minionType].isUnlocked){
		  
		  const color = isColorblind()?"#000":baseMinion[minionType].color;
		  const color2 = isColorblind()?"#DDD":baseMinion[minionType].color2;

			spawnChildren.base.style.display = null;

			const lastSpawn = minionResearch[minionType].lastSpawn;
			const spawnDelay = getMinionSpawnDelay(minionType);

			const percent = Math.min(100, Math.floor(lastSpawn / spawnDelay * 100));
			spawnChildren.progress.style.width = percent + "%";
			spawnChildren.progress.style.backgroundColor = color;
			spawnChildren.progress.style.color = color2;
		}
		else{
		  spawnChildren.base.style.display = "none";
		}
	}
}
function updateMinionDashboard(){
	setElementTextById("lblMinionCounter", getMinionCount()||"0", false);
	setElementTextById("lblMaxMinions", getMaxMinions(), false);
	
	setElementTextById("spnBarracks", addMinionQ.length||"0");
	setElementTextById("lblMinionQ", addMinionQ.join(", "));
	
	
	if(isCompactMinions()){
	  generateCompactMinionList();
	}
	else{
	  generateExpandedMinionList();
	}
}

const minionCardInfo =function(type, minion, isSimple, isCompact){
  if(isCompact){
    const minionsOfType = minions.reduce((a,m) => a+((m.type==type&&!m.zombie)?1:0),0);
    if(isSimple){
      return type+": "+minionsOfType;
    }
    else{
	  	const stats = buildDictionary(getMinionUpgradedStats(type), "stat", "prod");
      return "{0}:{1} |Health:{2} |Damage:{3}".format(type, minionsOfType, stats.health, stats.damage);
    }
  }
  else{
    if(isSimple){
      return type;
    }
    else{
      return "{0} |Health:{1} |Damage:{2}".format(type, Math.ceil(minion.health),Math.floor(minion.damage));
    }
  }
}
const minionCardDisplayClasses=function(isSimple, isCompact){
  const output = ["minionBlock"];
  if(isCompact){
    if(isSimple){
      output.push("simpleCompactMinionBlock");
    }
    else{
      output.push("compactMinionBlock");
    }
  }
  else{
    if(isSimple){
      output.push("simpleMinionBlock");
    }
  }
  return output;
}

function generateCompactMinionList(){
	const isSimple = isSimpleMinions();
	const displayClasses = minionCardDisplayClasses(isSimple, true);
  for (const [key, value] of Object.entries(minionResearch)) {
    if(value === null){continue;}
    if(!value.isUnlocked){continue;}
    
    const minionsOfType = minions.filter(x => x.type == key);
    let minionInfo = minionCardInfo(key, null, isSimple, true);

    generateMinionCard(key, key, minionInfo, displayClasses);
  }
}

function generateExpandedMinionList(){
	const isSimple = isSimpleMinions();

	for(let i=0; i<minionOrder.length; i++){
	  if(minionOrder[i]>=minions.length){continue;}
		//build div html
    const minion = minions[minionOrder[i]];
		const type = minion.type;
		const minionInfo = minionCardInfo(type, minion, isSimple, false);
		const displayClasses = minionCardDisplayClasses(isSimple, false);
		
		generateMinionCard(i, type, minionInfo, displayClasses);
	}
	
	const minionList = getUIElement("divMinionList");
	//remove extra minion cards
	while(minionList.childNodes.length > minionOrder.length){
		minionList.removeChild(minionList.lastChild)
	}
}

function generateMinionCard(i, type, minionInfo, displayClasses){
	const minionList = getUIElement("divMinionList");
	const newMinion = createNewElement("div", "divMinionListItem" + i, minionList, displayClasses, minionInfo);
	newMinion.style.color = baseMinion[type].color;
	newMinion.style.backgroundColor = baseMinion[type].color2;
	
	if(isColorblind()){
		newMinion.style.color = GetColorblindColor();
		newMinion.style.backgroundColor = GetColorblindBackgroundColor();
	}
}

function updateBossTab(){
	
	const baseUnlockCost = unlockBossCost();
	for(let bossType in baseBoss){
	  const temp = bossUIs.filter(x => x.type == bossType);
	  if(temp.length !== 1){return;}
	  const updatee = temp[0];
	  
		if(bossResearch[bossType].isUnlocked){
			updatee.select.style.display = null;
			updatee.selectLabel.style.display = null;
			updatee.progressBackground.style.display = null;
			
			const delay = getBossSpawnDelay(bossType)
			const lastSpawn = bossResearch[bossType].lastSpawn;
			const percent = Math.min(100, (lastSpawn / delay) * 100);
			updatee.progress.style.width = percent + "%";
		}
		else{
			updatee.select.style.display = "none";
			updatee.selectLabel.style.display = "none";
			updatee.progressBackground.style.display = "none";
		}
	}
	
	if(boss == null){
		getUIElement("ulBossStats").style.display = "none";
		getUIElement("effectsTitle").style.display = "none";
		getUIElement("divBossActiveAbilityProgress").style.width = "0%";
		getUIElement("divBossActiveAbility").classList.add("bossButtonDisabled");
		return;
	}
	getUIElement("ulBossStats").style.display = null;
	getUIElement("effectsTitle").style.display = null;
	getUIElement("divBossActiveAbility").classList.remove("bossButtonDisabled");
	
	let p = 0;
	const btn = getUIElement("divBossActiveAbility")
	const prog = getUIElement("divBossActiveAbilityProgress")

	if(boss.remainingDuration >= 0){
		boss.remainingDuration = Math.max(boss.remainingDuration, 0);
		p = 100 * boss.remainingDuration / boss.abilityDuration;

		btn.classList.add("bossButtonActive");
		btn.classList.remove("bossButtonAvailable");
		btn.classList.remove("bossButtonUnavailable");
	}
	else{
		p = 100 * boss.lastActiveAbility / boss.abilityCooldown;

		if(p > 99.999){
			btn.classList.add("bossButtonAvailable");
			btn.classList.remove("bossButtonUnavailable");
		}
		else{
			btn.classList.add("bossButtonUnavailable");
			btn.classList.remove("bossButtonAvailable");
		}
	}
	
	p = Math.min(100, p);
	
  //keeps it an even number of pixels so it doesn't wiggle.
	const border = (+getComputedStyle(btn).borderWidth.slice(0,-2))*2;
  const w = ((btn.offsetWidth-border) * p / 100)>>1<<1;
	
	prog.style.width = w+"px";
	
	const bossInfoItems = [statTypes.health, statTypes.damage, statTypes.attackRate, statTypes.attackRange, statTypes.moveSpeed, statTypes.auraRange, statTypes.auraPower, "auraInfo", "passiveAbilityInfo", "activeAbilityInfo" ];
	for(let i=0;i<bossInfoItems.length;i++){
		const stat = bossInfoItems[i]
		const id = "spanBoss"+stat;
		switch(stat){
			case statTypes.attackRate:
			  const AR = boss.effects.CalculateEffectByName(statTypes.attackRate, 1);
			  const prod = Math.floor(boss.attackRate/AR*100)/100;
				setElementTextById(id, prod);
			  break;
			case statTypes.health:
			case statTypes.damage:
			case statTypes.attackRange:
			case statTypes.moveSpeed:
			case statTypes.auraRange:
			case statTypes.auraPower:{
			  const scale = scaledStats.includes(stat)?getScale():1;
			  const value = boss.CalculateEffect(stat)*statAdjustments[stat];
			  const calculated = value/scale;
			  
	  		const prod = flooredStats.includes(stat) ? Math.floor(calculated) : Math.floor(calculated*100)/100;

				setElementTextById(id, prod);
				break;
			}
			case "auraInfo":
			case "passiveAbilityInfo":
			case "activeAbilityInfo":
				const text = baseBoss[boss.type][stat];
				setElementTextById(id, text);
				break;
		}
	}
	
	const divEffects = getUIElement("divBossEffects");
	boss.effects.effects.forEach(e => e.updateHtml(divEffects));
}
function updateEquipped(){
  
  for (const [key, value] of Object.entries(equipped)) {
    if(value === null){continue;}
    
    const dest = document.getElementById("divEquipped"+key.fixString());
    
    value.buildHtml(dest, "eq");
    
    const btn = createNewElement("button", "btnUnequip"+value.id, dest, ["btnEquip"], "Unequip");
    addOnclick(btn, function() { unequip(value.type); });
  }
}
function updateInventory(){

  const itemList = document.getElementById("divItems");
  for(let i=0;i<inventory.length;i++){
    
    const itemId = inventory[i].id;
    let item = document.getElementById("divItem"+itemId);
    if(item == null){
      item = createNewElement("div", "divItem"+itemId, itemList, ["item"], null);
      inventory[i].buildHtml(item, "inv");
      
      const lockChar = inventory[i].isLocked?"🔒":"🔓";
      const btnLock = createNewElement("button", "btnLock"+itemId, item, ["btnLock"], lockChar);
      addOnclick(btnLock, function() { toggleLock(this, itemId); });
      
      const btnEquip = createNewElement("button", "btnEquip"+itemId, item, ["btnEquip"], "Equip");
      addOnclick(btnEquip, function() { equip(itemId); });
      
      const btnSell = createNewElement("button", "btnSell"+itemId, item, ["btnSell"], "Sell:" + inventory[i].sellValue() + resources.e.symbol);
      addOnclick(btnSell, function() { sell(itemId); });
    }
    else{
      document.getElementById("btnEquip"+itemId).disabled = inventory[i].isEquipped();
      document.getElementById("btnSell"+itemId).disabled = inventory[i].isEquipped() || inventory[i].isLocked;
      
      inventory[i].updateHtml("inv");
    }
  }
}
function populateForgeItems(){
  const itemSelect = getUIElement("ddlForgeItems");
  clearChildren(itemSelect);

  const opt = createNewElement("option", "optSelect", itemSelect, [], " < Select Item >")
  opt.value = null;

  for(let i=0;i<inventory.length;i++){
    const opt = createNewElement("option", "opt"+inventory[i].id, itemSelect, [], inventory[i].toString())
    opt.value = inventory[i].id;
  }
  
  populateForgeAttributes();
}
function populateForgeAttributes(){
  const stat = getUIElement("divForgeStat");
  const attr = getUIElement("divForgeAttributes");
  clearChildren(stat);
  clearChildren(attr);

  const prestige = getUIElement("btnPrestigeItem");
  const ddl = getUIElement("ddlForgeItems");
  if(ddl?.value == null || ddl?.value == "null"){
    prestige.style.display = "none";
    stat.style.display = "none";
    return;
  }
  prestige.style.display = null;
  stat.style.display = null;

  const item = inventory.find(x => x.id == ddl.value);
  if(!item){return;}
  const maxTier = item.maxAttrIndex();
  
  const canPrestige = item.canPrestige();
  const prestigeCost = canPrestige?item.prestigeCost():Infinity;
  setElementTextById("reforgeCost", prestigeCost==Infinity?"∞":prestigeCost);
	setButtonAffordableClass(prestige, prestigeCost <= resources.f.amt && item.canPrestige());

  forgeItemButtons.length=0;
  addStattribute(stat, item.id, item.stat, "stat", maxTier, false);

  for(let i=0;i<item.attributes.length;i++){
    const a = createNewElement("div", "fAttr"+i, attr, ["forgeStattribute"], null);
    addStattribute(a, item.id, item.attributes[i], i, maxTier, true);
  }
  updateStatributesAffordable();
}
function addStattribute(parent, itemId, statribute, suffix, maxIndex, isAttr){
  
  const step = statribute.range.step();
  createNewElement("text", "fHeader"+suffix, parent, ["forgeHeader"], statribute.toString());
  
  const rangeDiv = createNewElement("div", "fRangeHolder"+suffix, parent, ["forgeRangeHolder"], null);
  
  createNewElement("div", "fMin"+suffix, rangeDiv, ["forgeLeft"], statribute.range.min);
  const range = createNewElement("input", "fRange"+suffix, rangeDiv, ["forgeRange"], null);
  createNewElement("div", "ftMax"+suffix, rangeDiv, ["forgeRight"], statribute.range.max);

  range.type = "range";
  range.min = statribute.range.min;
  range.max = statribute.range.max;
  range.step = step;
  range.value = statribute.power;
  range.disabled = true;

  const uCost = statribute.range.upgradePrice();
  const u = createMiscButton("ItemUpgrade"+suffix, parent, "Upgrade", uCost, resources.e.symbol);
  addOnclick(u, function() { upgradeItemAttr(itemId, suffix); });
  u.itemId=itemId;
  u.index=suffix;
  forgeItemButtons.push(u);

  if(isAttr){
    const attrMax = Math.max(0, maxIndex+statribute.indexAdjustment);
    const maxRangeText = "Attribute Level:"+statribute.range.index+"/"+attrMax;
    createNewElement("div", "fMaxRange"+suffix, parent, ["forgeIndexMax"], maxRangeText);

    const pCost = statribute.range.prestigePrice();
    const p = createMiscButton("ItemPrestige"+suffix, parent, "Prestige", pCost, resources.e.symbol);
    addOnclick(p, function() { prestigeItemAttr(itemId, suffix); });
    p.itemId=itemId;
    p.index=suffix;
    p.maxI=maxIndex;
    forgeItemButtons.push(p);
    
    const rCost = getRerollAttrCost(maxIndex);
    const reroll = createMiscButton("Reroll"+suffix, parent, "Reroll", rCost, resources.e.symbol);
    addOnclick(reroll, function() { rerollItemAttr(itemId, suffix); });
    reroll.itemId=itemId;
    reroll.index=suffix;
    forgeItemButtons.push(reroll);
  }
  else{
    parent.style.height =105;
  }
  
}

function updateStatributesAffordable(){
  for(const b of forgeItemButtons){
    const cost = +b.cost;
    const id = b.itemId;
    const index = b.index;
    const maxI = +b.maxI||0;
    
    const item = inventory.find(x => x.id == id);
    if(item == undefined){return;}
    const attr = index == "stat"? item.stat : item.attributes[index];
    const attrMax = maxI + (attr.indexAdjustment||0);
    const affordable = cost <= resources.e.amt;
    
    let available = b.id.startsWith("Reroll", 3)
                || (b.id.startsWith("ItemPrestige", 3) && attr.power >= attr.range.max && attr.range.index < attrMax)
                || (b.id.startsWith("ItemUpgrade", 3) && attr.power < attr.range.max);
  
    b.disabled = !available;
  	setButtonAffordableClass(b, available&&affordable);
  }
}

function updateTierTab(tier, resourceAmount, upgradeList){
	updatePrestige(tier, resourceAmount);
	updateAutoBuy(tier);
	updateUpgrades(tier, upgradeList, resourceAmount);
	updateUnlocks(tier, resourceAmount);
	updateMiscBuy(tier, resourceAmount);
}
function updateT0(){
  updateTierTab(0, resources.a.amt, t0Upgrades);
}
function updateT1(){
  updateTierTab(1, resources.b.amt, t1Upgrades);
}
function updateT2(){
  updateTierTab(2, resources.c.amt, t2Upgrades);
}
function updateT3(){
  updateTierTab(3, resources.d.amt, t3Upgrades);
  const maxLevel = maxUpgradeLevel;
  const potency = getUpgradePotency(3);
  const perk = getAchievementBonus("prestige3");


  for(let i in t3BossUpgrades){
    const list = t3BossUpgrades[i];
    if(!bossResearch[list.unitType].isUnlocked){
      list.listElement.style.display = "none"
      continue;
    }
    list.listElement.style.display = null;
    
    for(let upgrade of list.upgrades){
			const cost = getEnhanceCost(list.unitType, upgrade.upgradeType);
      setElementText(upgrade.cost, cost!==Infinity?cost:"∞");
			setElementText(upgrade.maxLvl, maxLevel);
			setElementText(upgrade.lvl, bossUpgrades[list.unitType][upgrade.upgradeType]);
			setElementText(upgrade.potency, potency>1?potency+"x ":"");
			setElementText(upgrade.perk, perk>0?" +"+perk:"");

			setButtonAffordableClass(upgrade.button, cost <= resources.d.amt);
    }
  }
}
function updateT4(){
  updateTierTab(4, resources.e.amt, t4Upgrades);
  updateStatributesAffordable();
}
function updateT5(){
  for(let btn of getUIElement("divBombStock").children)
  {
    const r = bombTypes[btn.value].remaining;
    setButtonAffordableClass(btn, resources.f.amt>=1 && r==0);
  }
  for(let btn of getUIElement("divExchange").children)
  {
    setButtonAffordableClass(btn, resources.f.amt>=1);
    btn
  }
  
  updateExchangeRate("a");
  updateExchangeRate("b");
  updateExchangeRate("c");
  updateExchangeRate("d");
  
  const cost = getChestCost();
  setButtonAffordableClass(getUIElement("btnOpenChest"), resources.f.amt>=cost);
}
function updateExchangeRate(resource){
  const r = resources[resource];
  
  const exchangeScale = getAchievementBonus("itemPrestiged")+2;
  const a = resources.f.value;
  const b = r.value;
  
  const value = exchangeScale**(a) / exchangeScale**(b);
  const text = value+" "+r.name;
  const id = "btnExchange"+r.name;
  const btn = getUIElement(id);
  btn.value = value;

  setElementText(btn, text);
}


function updateChestStore(){
  //update cost
  let level = +getUIElement("numStoreChestLevel").value;
  
  if(level > 32){
    getUIElement("numStoreChestLevel").value=32;
    level = 32;
  }
  else if(level <0){
    getUIElement("numStoreChestLevel").value=0;
    level = 0;
  }
  
  const cost = getChestCost();
  setElementTextById("divChestCost", cost);
  
  const btn = getUIElement("btnOpenChest");
	setButtonAffordableClass(btn, cost <= resources.f.amt);
  
  //update tier% chances.
  level += getAchievementBonus("itemPrestiged");
  const table = getUIElement("chestExpectedResultTable");
  clearChildren(table);
  const data = getItemTierChances(level*4);
  for(let d of data){
    const row = createNewElement("tr", "eRow"+d.tier, table, [], null);
    const s = d.tier*100 + "-" + (((d.tier+1)*100)-1)
    createNewElement("td", "eTier"+d.tier, row, [], s);
    const pct = Math.floor(d.pct*10000)/100
    createNewElement("td", "ePct"+d.tier, row, [], pct);
  }
}

function updateAchievements(){
  
  const score = getAchievementScore();
  setElementTextById("score", score);
  
	for(let index in achievementElements){
	  const achievement = achievementElements[index];
    const type = achievement.type;
    
    const goal = +achievement.goal.textContent
    if(achievements[type].count >= goal){
  		const lvl = getAchievementLevel(type);
  		const next = getAchievementNext(type);
  
  		setElementText(achievement.level, lvl||"0");
  		setElementText(achievement.goal, next||"0");
  		
  		if(lvl >= achievements[type].maxLevel){
  		  achievements[type].count=0;
  		  achievements[type].maxCount++;
  		  
    		const lvl0 = getAchievementLevel(type);
    		const next0 = getAchievementNext(type);
    
    		setElementText(achievement.level, lvl0||"0");
    		setElementText(achievement.goal, next0||"0");
  		}
    }
    
	  setElementText(achievement.maxCount, achievements[type].maxCount||"0");
		setElementText(achievement.count, achievements[type].count||"0");
	}
}

function updateStatistics(){
  const setId = getUIElement("statsSelect").value;
  //if it isn't current it doen't need to keep updating.
  if(setId !== "Current"){
    return;
  }
  const statSet = stats.getDataSet(setId);

  const statsTeam = getUIElement("statsTeam").value;
  const dataSet = filterDataSet(statSet.data, statsTeam);
  
  const table = getUIElement("statsBody");

  setElementTextById("tickCount", statSet.ticks);
  for(let index in dataSet){
    dataSet[index].updateHTMLRow(table);
  }

  
}
function setStats(){
  const setId = getUIElement("statsSelect").value;
  const statSet = stats.getDataSet(setId);

  const statsTeam = getUIElement("statsTeam").value;
  let dataSet = filterDataSet(statSet.data, statsTeam);
  
  const select=getUIElement("statsSort")
  select.disabled=setId=="Current";
  if(!select.disabled){
    const sortBy=select.value;
    dataSet = dataSet.sort((a,b)=>a.compare(b,sortBy));
  }
  setElementTextById("tickCount", statSet.ticks);
  
  const table = getUIElement("statsBody");
  clearChildren(table);
  for(let index in dataSet){
    dataSet[index].buildHTMLRow(table);
  }
}

function clearMinionList(){
  const minionList = getUIElement("divMinionList");
  clearChildren(minionList);
}
