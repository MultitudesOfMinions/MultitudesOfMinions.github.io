"use strict";
function setElementText(element, text, fix)  {
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
		throw id + " element not found";
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
	  if(element.classList.contains("upg")){
  		element.classList.remove("upg");
	  }
	}
	else{
	  if(!element.classList.contains("upg")){
  		element.classList.add("upg");
	  }
	  if(element.classList.contains("affordableUpg")){
  		element.classList.remove("affordableUpg");
	  }
	}
}

const frameCount = 0;
let consecutiveErrors = 0;
let lastUpdateP0 = 0;
let lastUpdateP1 = 0;
function update(){
  try{
  	Quality = GetQuality();
  	toggleHilite();
  	
  	manageMinions();
  	manageBoss();
  	setMinionOrder();
  	setTeam0Order();
  
  	manageHero();
  	manageTowers();
  	setTeam1Order();
  	checkLevelComplete();
  
  	managePath();
  	manageProjectiles();
  	manageImpacts();
  	
  	followTheLeader();
  	doAutobuy();
  	doAutoSell();
  	const now = Date.now();
  	const p1Rate = Number(getP1Rate());
  	if(p1Rate === 0){
  	  pnl1.style.display = "none";
  	  reshowP1.style.display = null;
  	}
  	else if(now - lastUpdateP1 > p1Rate){
  	  pnl1.style.display = null;
  	  reshowP1.style.display = "none";
    	updatePnl1();
    	updateResourceDisplay();
    	lastUpdateP1 = now;
  	}
  	
  	const p0Rate = Number(getP0Rate());
  	if(p0Rate === 0){
  	  pnl0.style.display = "none";
  	}
  	else if(now - lastUpdateP0 > p0Rate){
  	  pnl0.style.display = null;
  	  draw();
    	fps();
    	lastUpdateP0 = now;
  	}
  	
  	updateAutosave();
  	consecutiveErrors = 0;
  }
  catch(x){
    console.error(x);
    consecutiveErrors++;
    if(consecutiveErrors>20){
      stop();
      alert("Too many errors, see console for details. Game stopped.");
    }
    
  }
}

function checkLevelComplete(){
	if(hero === null && squire === null && page === null){
		achievements.maxLevelCleared.count = Math.max(achievements.maxLevelCleared.count, level);
		level=+level+1;
		levelStartX = getEndOfLevelX(level-1);
		levelEndX = getEndOfLevelX(level);
		addHero();
	}
}

function updateResourceDisplay(){
	setElementText(getUIElement("spnResourceAAmt"), Math.floor(resources.a.amt), false);
	setElementText(getUIElement("spnResourceBAmt"), Math.floor(resources.b.amt), false);
	setElementText(getUIElement("spnResourceCAmt"), Math.floor(resources.c.amt), false);
	setElementText(getUIElement("spnResourceDAmt"), Math.floor(resources.d.amt), false);
	setElementText(getUIElement("spnResourceEAmt"), Math.floor(resources.e.amt), false);
	setElementText(getUIElement("spnResourceFAmt"), Math.floor(resources.f.amt), false);
}

let fCount = 0;
let lastFps = 0;
let s = 0;
let averageFps = 0;
function fps(){
	fCount++;
	if(new Date() % 1000 <= defaultInterval){
		lastFps = fCount;
		averageFps *= s/(s+1);
		s++;
		averageFps += lastFps/s;
		fCount = 0;
	}
	if(showFPS()){
		ctx.beginPath();
		ctx.fillStyle="#FFF";
		ctx.font = "10pt Helvetica"
		ctx.fillText("FPS:{0} {1}".format(Math.floor(averageFps*100)/100, lastFps),10,10);
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
	if(hilites.filter(x => x.id == id) > 0){return;}
	
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
  
  const limit = +getUIElement("autoSellLimit").value;
  
  for(let i=0;i<inventory.length;i++){
    if(inventory[i].isLocked){continue;}
    if(inventory[i].isEquipped()){continue;}
    const iscore = inventory[i].score();
    if(iscore>=limit){continue;}
    
    sell(inventory[i].id);
  }
  
}

function doAutobuy(){
	for(let key in tierMisc){
		if(!tierMisc[key].autobuy.isUnlocked){continue;}
		if(!isAutoBuy(key)){
      toggleTierAutoPrestige(key, true);
      continue;
		}
		const tierId = Number(key.replace("t",""));

    toggleTierAutoPrestige(key, false);
		let lowestLevel = 9999;
	  let prestigeable = true;
	  
		const upgrades = minionUpgradeTypes[tierMisc[key].tier];
		for(let minion in minionResearch){
			if(!minionResearch[minion].isUnlocked){
			  if(minionResearch[minion].unlockT!==tierId){continue;}

			  //Try to unlock, if can't afford continue to next minion
			  unlockMinion(minion);
  			if(!minionResearch[minion].isUnlocked){
  			  prestigeable = false;
  			  continue;
  			}
			}
			
			for(let upgrade in upgrades){
				lowestLevel = Math.min(lowestLevel, minionUpgrades[minion][upgrades[upgrade]])
			}
		}
		
  	const potency = tierMisc[key].upgradePotency + 1;
		if(isAutoPrestige(key) && lowestLevel/potency >= maxUpgradeLevel){
		  const tier = Number(key.replace('t',''));
		  prestigeTier(tier)
		}
		
		for(let minion in minionResearch){
			if(!minionResearch[minion].isUnlocked && minionResearch[minion].unlockT >= tierId){continue;}
			
			for(let upgrade in upgrades){
				if(minionUpgrades[minion][upgrades[upgrade]] > lowestLevel){continue;}
				buyUpgrade(minion, upgrades[upgrade]);
			}
		}

		const tempTier = miscTierButtons.filter(x => x.tier === tierId);
		if(tempTier.length !== 1){continue;}
		const buttons = tempTier[0].buttons;
		
		let previousTier = "t0";
		switch(key){
		  case "t1":
    		previousTier = "t0";
		    break;
		  case "t2":
    		previousTier = "t1";
		    break;
		  case "t3":
    		previousTier = "t2";
		    break;
		  case "t4":
    		previousTier = "t3";
		    break;
		  case "t5":
    		previousTier = "t4";
		    break;
		}
		let cheapestCost = Infinity;
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
}

function updateAutosave(){
	if(cookiesEnabled == 0){
		document.getElementById("divAutoSave").style.display = "none";
		return;
	}
	
	document.getElementById("divAutoSave").style.display = null;
	if(autoSave()){
		lastSave++;
		const saveTime = 1000;
		if(lastSave > saveTime){//approx 1 minutes
			saveData();
		}
		document.getElementById("divAutoSaveProgress").style.width = (lastSave / saveTime) * 100 + "%";
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
	else if(getUIElement("divAchievements").style.display != "none"){
		updateAchievements();
	}
	else if(getUIElement("divInfo").style.display != "none"){}
	else if(getUIElement("divOptions").style.display != "none"){
		updateOptionsTab();
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

		
		
  return;
  
  //TODO: refactor this to make it less dumb
  switch(tier){
    case 0:{
      const div = getUIElement("divAutobuyt0");
      if(tierMisc.t0.autobuy.isUnlocked){
        div.style.display = null;
      }
      else{
        div.style.display = "none";
      }
      break;
    }
    case 1:{
      const div = getUIElement("divAutobuyt1");
      if(tierMisc.t1.autobuy.isUnlocked){
        div.style.display = null;
      }
      else{
        div.style.display = "none";
      }

      const btn = getUIElement("btnautoBuy_1");
      if(tierMisc.t0.autobuy.isUnlocked){
        btn.style.display = "none";
      }
      else{
        btn.style.display = null;
      }
      break;
    }
    case 2:{
      const div = getUIElement("divAutobuyt2");
      if(tierMisc.t2.autobuy.isUnlocked){
        div.style.display = null;
      }
      else{
        div.style.display = "none";
      }

      const btn = getUIElement("btnautoBuy_2");
      if(tierMisc.t1.autobuy.isUnlocked){
        btn.style.display = "none";
      }
      else{
        btn.style.display = null;
      }
      break;
    }
    case 3:{
      const div = getUIElement("divAutobuyt3");
      if(tierMisc.t3.autobuy.isUnlocked){
        div.style.display = null;
      }
      else{
        div.style.display = "none";
      }

      const btn = getUIElement("btnautoBuy_3");
      if(tierMisc.t2.autobuy.isUnlocked){
        btn.style.display = "none";
      }
      else{
        btn.style.display = null;
      }
      break;
    }
    case 4:{
      break;
    }
  }
}
function updateUpgrades(tier, upgradeList, resourceAmt){
  for(let i in upgradeList){
    const list = upgradeList[i];
    if(!minionResearch[list.unitType].isUnlocked && minionResearch[list.unitType].unlockT >= tier){
      list.listElement.style.display = "none"
      continue;
    }
    list.listElement.style.display = null;
    
    for(let upgrade of list.upgrades){
			const cost = getUpgradeCost(list.unitType, upgrade.upgradeType);
      setElementText(upgrade.cost, cost!==Infinity?cost:"∞");
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

    setElementText(miscBuy.cost, cost);
		setButtonAffordableClass(miscBuy.button, cost <= resourceAmt);
  }
}

function updateMinionSpawns(){
	const qPercent = Math.min(100, lastGlobalSpawn / getGlobalSpawnDelay() * 100);
	document.getElementById("divQProgress").style.width = qPercent + "%";
	
	for(let minionType in minionResearch){
	  const spawnChildren = minionSpawns[minionType];
		if(minionResearch[minionType].isUnlocked){

			spawnChildren.base.style.display = null;

			const lastSpawn = minionResearch[minionType].lastSpawn;
			const spawnDelay = getMinionSpawnDelay(minionType);

			const percent = Math.min(100, Math.floor(lastSpawn / spawnDelay * 100));
			spawnChildren.progress.style.width = percent + "%";
		}
		else{
		  spawnChildren.base.style.display = "none";
		}
	}
}
function updateMinionDashboard(){
	setElementTextById("lblMinionCounter", getMinionCount()||"0", false);
	setElementTextById("lblMaxMinions", getMaxMinions(), false);
	
	setElementTextById("spnBaracks", addMinionQ.length||"0");
	setElementTextById("lblMinionQ", addMinionQ.join(", "));
	
	
	if(isCompactMinions()){
	  generateCompactMinionList();
	}
	else{
	  generateExpandedMinionList();
	}
}

function generateCompactMinionList(){
	  
	const displayClasses = ["minionBlock"];
  for (const [key, value] of Object.entries(minionResearch)) {
    if(value === null){continue;}
    if(!value.isUnlocked){continue;}
    
    const minionsOfType = minions.filter(x => x.type == key);
    let minionInfo = key+": "+minionsOfType.length;
    //TODO: build minionInfor for !simple

    generateMinionCard(key, key, minionInfo, displayClasses);
  }
}
function generateExpandedMinionList(){
	for(let i=0; i< minionOrder.length; i++){
		//build div html
		const type = minions[minionOrder[i]].type;
		let minionInfo = minions[minionOrder[i]].type;
		const displayClasses = ["minionBlock", "simpleMinionBlock"];
		
		if(!isSimpleMinions()){
		  minionInfo = "#{2}|HP:{0}|DMG:{1}"
				.format(Math.ceil(minions[minionOrder[i]].health),
						Math.floor(minions[minionOrder[i]].damage),
						i);
		  displayClasses.pop();
		}
		
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
	prog.style.width = p+"%";
	
	const bossInfoItems = [statTypes.health, statTypes.damage, statTypes.attackRate, statTypes.attackRange, statTypes.moveSpeed, statTypes.auraRange, statTypes.auraPower, "auraInfo", "passiveAbilityInfo", "activeAbilityInfo" ];
	for(let i=0;i<bossInfoItems.length;i++){
		const id = "spanBoss"+bossInfoItems[i];
		switch(bossInfoItems[i]){
			case statTypes.health:
			case statTypes.damage:
			case statTypes.attackRate:
			case statTypes.attackRange:
			case statTypes.moveSpeed:
			case statTypes.auraRange:
			case statTypes.auraPower:{
				const rounded = Math.floor(boss[bossInfoItems[i]]*100)/100;
				const text = "{0}: {1}".format(bossInfoItems[i], rounded);
				setElementTextById(id, text);
				break;
			}
			case "auraInfo":
			case "passiveAbilityInfo":
			case "activeAbilityInfo":{
				const text = baseBoss[boss.type][bossInfoItems[i]];
				setElementTextById(id, text);
				break;
			}
		}
	}
	
	const divEffects = getUIElement("divBossEffects");
	for(let i=0;i<boss.effects.effects.length;i++){
	  boss.effects.effects[i].updateHtml(divEffects);
	}
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
    }
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
			setButtonAffordableClass(upgrade.button, cost <= resources.d.amt);
    }
  }
}
function updateT4(){
  updateTierTab(4, resources.e.amt, t4Upgrades);
  
}
function updateT5(){
  //store
}
function updateAchievements(){
	for(let index in achievementElements){
	  const achievement = achievementElements[index];
    const type = achievement.type;

		const lvl = getAchievementLevel(type);
		const next = getAchievementNext(type);

		setElementText(achievement.level, lvl||"0");
		setElementText(achievement.count, achievements[type].count||"0");
		setElementText(achievement.goal, next||"0");
	}
}
function updateInfo(){
	if(isColorblind()){
		
	}else{
		
	}
}
function updateOptionsTab(){
	for(let gaugeType in gauges){
	  const row = getUIElement("row" + gaugeType);
	  const rowUnlock = getUIElement("rowUnlock" + gaugeType)
	  
		if(!gauges[gaugeType].isUnlocked){
  	  const btnUnlock = getUIElement("btnUnlock" + gaugeType)
			setButtonAffordableClass(btnUnlock, gauges[gaugeType].cost <= resources.b.amt)

			rowUnlock.style.display = null;
			row.style.display = "none";
		}
		else{
			rowUnlock.style.display = "none";
			row.style.display = null;
		}
	}
}

function clearMinionList(){
  const minionList = getUIElement("divMinionList");
  while(minionList.firstChild){
    minionList.removeChild(minionList.firstChild);
  }
}
