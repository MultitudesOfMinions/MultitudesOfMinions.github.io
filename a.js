"use strict";let gameW=1200,gameH=600,halfH=300,pathL=20,pathW=20,leaderPoint=120;const defaultInterval=15;let path=[],accents=[],langoliers=-(gameW>>3),projectiles=[],impacts=[],totalPaths=0,level=0,levelEndX=0,levelStartX=0,resetLevel=0,maxResetLevel=0,maxFPS=0,minFPS=100,maxMinions=0,lastSave=0,cookiesEnabled=0,Quality=3;const hilites=[];let ticksSinceReset=0,paused=!1;const underlings=[],minions=[];let minionOrder=[];const towers=[];let quid=[],hero=null,squire=null,page=null,boss=null;const maxInventory=24,inventory=[];let maxAutosellLimit=100,autoSellLimit=0,maxAutoForgeLimit=100,autoForgeLimit=0,newItemPreview=null,leadInvader=null,team0=[],team1=[],achievementCycle=0,autoBuySellCycle=0,autoSaveCycle=0,p0Cycle=0,p1Cycle=0,mainCycle=0,sinceQuid=0,consecutiveMainCylceErrors=0,consecutiveBuySellErrors=0,consecutiveSaveErrors=0,consecutiveP0Errors=0,consecutiveP1Errors=0;function UpgradeList(e,t,a){this.unitType=e,this.listId=t,this.listElement=a,this.upgrades=[]}function UpgradeIds(e,t,a,n,o,i,s){this.upgradeType=e,this.button=t,this.cost=a,this.lvl=n,this.maxLvl=o,this.potency=i,this.perk=s}function UnlockIds(e,t,a){this.upgradeType=e,this.button=t,this.cost=a}function UnlockList(e){this.tier=e,this.unlocks=[]}function PrestigeButton(e,t,a,n){this.tier=e,this.button=t,this.cost=a,this.gains=n}function TierMiscButtons(e){this.tier=e,this.buttons=[]}function MiscButton(e,t,a){this.type=e,this.button=t,this.cost=a}function AchievementElement(e,t,a,n,o){this.type=e,this.level=t,this.maxCount=a,this.count=n,this.goal=o}function BossUIElements(e,t,a,n,o){this.type=e,this.select=t,this.selectLabel=a,this.progress=n,this.progressBackground=o}const t0Upgrades=[],t1Upgrades=[],t2Upgrades=[],t3Upgrades=[],t4Upgrades=[],t3BossUpgrades=[],unlockButtons=[],miscTierButtons=[],prestigeButtons=[],achievementElements=[],bossUIs=[],forgeItemButtons=[],UIElements={};function getUIElement(e){if(void 0===UIElements[e]){let t=document.getElementById(e);if(null===t)return console.error("UI Element Not Found: "+e),null;UIElements[e]=t}return UIElements[e]}function removeUIElement(e){let t=getUIElement(e);null!==t&&t.parentNode.removeChild(t)}function isUIElementHiddenByID(e){return isUIElementHidden(getUIElement(e))}function isUIElementHidden(e){return e.classList.contains("hide")}function toggleUIElementByID(e,t){toggleUIElement(getUIElement(e),t)}function toggleUIElement(e,t){null!==e&&void 0!==e.classList&&isUIElementHidden(e)!==t&&e.classList.toggle("hide",t)}function MinionSpawnChildren(e,t,a){this.base=e,this.chk=t,this.progress=a}const minionSpawns={};function toggleP1(e,t){let a=document.getElementsByClassName("mnuSelected");for(let n=0;n<a.length;n++)a[n].classList.remove("mnuSelected");let o=document.getElementsByClassName("p1BlockChild");for(let i=0;i<o.length;i++)toggleUIElement(o[i],!0);e.classList.add("mnuSelected"),toggleUIElementByID(t,!1),"btnMnuGym"===e.id?resources.b.amt>getAutobuyCost(0)&&!tierMisc.t0.autobuy.isUnlocked&&addHilite("btnautoBuy_1",2):"btnMnuLab"===e.id?resources.c.amt>getAutobuyCost(1)&&!tierMisc.t1.autobuy.isUnlocked&&addHilite("btnautoBuy_2",2):"btnMnuOffice"===e.id?resources.d.amt>getAutobuyCost(2)&&!tierMisc.t2.autobuy.isUnlocked&&addHilite("btnautoBuy_3",2):"btnMnuForge"===e.id?(resources.e.amt>getAutobuyCost(3)&&!tierMisc.t3.autobuy.isUnlocked&&addHilite("btnautoBuy_4",2),populateForgeItems()):"btnMnuStore"===e.id?updateChestStore():"btnMnuStatistics"===e.id&&setStats(),delHilite(e.id)}function setColorblind(){setActiveStyleSheet();let e=document.getElementsByClassName("cbh");if(isColorblind())for(let t=0;t<e.length;t++)e[t].classList.add("hide");else for(let a=0;a<e.length;a++)e[a].classList.remove("hide")}function setActiveStyleSheet(){let e=getUIElement("ddlColors"),t=e.options[e.selectedIndex],a=t?t.text:"Light",n=document.getElementsByTagName("link");for(let o=0;o<n.length;o++){let i=n.item(o);!("stylesheet"!==i.rel||i.href.endsWith("Style.css"))&&(i.href.includes(a)&&i.href.includes("Colorblind")===isColorblind()?i.removeAttribute("disabled"):i.setAttribute("disabled",null))}drawMap()}function GetStyleColor(){return"#"+getUIElement("ddlColors").value}function oppositeHex(e){let t=16**e.length-1,a="0".repeat(e.length);return(a+(t-parseInt(e,16)).toString(16)).slice(-e.length)}function GetColorblindColor(){let e=getUIElement("ddlColors").value,t=3===e.length?1:2,a=oppositeHex(e.slice(0,t)),n=oppositeHex(e.slice(t,2*t)),o=oppositeHex(e.slice(2*t,3*t));return`#${a}${n}${o}`}function GetColorblindBackgroundColor(){return"#"+getUIElement("ddlColors").value}function resetInputs(){resetGauges(),resetAllAutobuy(),resetMinionSpawns(),resetSelectedBoss(),resetOptions()}function resetGauges(){setShowRangeMinion(!1),setShowRangeBoss(!1),setShowRangeTower(!1),setShowRangeHero(!1),setShowReloadMinion(!1),setShowReloadBoss(!1),setShowReloadTower(!1),setShowReloadHero(!1),setShowHealthMinion(!1),setShowHealthBoss(!1),setShowHealthTower(!1),setShowHealthHero(!1),setShowDamageMinion(!1),setShowDamageBoss(!1),setShowDamageTower(!1),setShowDamageHero(!1)}function resetAllAutobuy(){setAutobuyT0(!1),setAutobuyT1(!1),setAutobuyT2(!1),setAutobuyT3(!1)}function resetAutobuy(e){switch(e){case 0:setAutobuyT0(!1);break;case 1:setAutobuyT1(!1);break;case 2:setAutobuyT2(!1);break;case 3:setAutobuyT3(!1)}}function resetOptions(){document.getElementById("ddlColors").selectedIndex=0,document.getElementById("ddlQuality").selectedIndex=0,document.getElementById("ddlP1Rate").selectedIndex=0,document.getElementById("chkShowFPS").checked=!1,document.getElementById("chkColorblind").checked=!1,document.getElementById("chkSmipleMinions").checked=!0,document.getElementById("chkCompactMinions").checked=!1,document.getElementById("txtExport").value=null,document.getElementById("txtImport").value=null}function resetMinionSpawns(){for(let e in minionResearch)minionResearch[e].isUnlocked&&(document.getElementById("chkSpawn"+e).checked=!0)}function resetSelectedBoss(){getUIElement("selectNone").checked=!0}function autoCastAbility(){return getUIElement("chkAutocast").checked}function setAutoCastAbility(e){return getUIElement("chkAutocast").checked=e}function showRangeMinion(){return getUIElement("chkRangeMinion").checked}function showRangeBoss(){return getUIElement("chkRangeBoss").checked}function showRangeTower(){return getUIElement("chkRangeTower").checked}function showRangeHero(){return getUIElement("chkRangeHero").checked}function showReloadMinion(){return getUIElement("chkReloadMinion").checked}function showReloadBoss(){return getUIElement("chkRangeBoss").checked}function showReloadTower(){return getUIElement("chkRangeTower").checked}function showReloadHero(){return getUIElement("chkRangeHero").checked}function showHealthMinion(){return getUIElement("chkHealthMinion").checked}function showHealthBoss(){return getUIElement("chkHealthBoss").checked}function showHealthTower(){return getUIElement("chkHealthTower").checked}function showHealthHero(){return getUIElement("chkHealthHero").checked}function showDamageMinion(){return getUIElement("chkDamageMinion").checked}function showDamageBoss(){return getUIElement("chkDamageBoss").checked}function showDamageTower(){return getUIElement("chkDamageTower").checked}function showDamageHero(){return getUIElement("chkDamageHero").checked}function setShowRangeMinion(e){getUIElement("chkRangeMinion").checked=e}function setShowRangeBoss(e){getUIElement("chkRangeBoss").checked=e}function setShowRangeTower(e){getUIElement("chkRangeTower").checked=e}function setShowRangeHero(e){getUIElement("chkRangeHero").checked=e}function setShowReloadMinion(e){getUIElement("chkReloadMinion").checked=e}function setShowReloadBoss(e){getUIElement("chkRangeBoss").checked=e}function setShowReloadTower(e){getUIElement("chkRangeTower").checked=e}function setShowReloadHero(e){getUIElement("chkRangeHero").checked=e}function setShowHealthMinion(e){getUIElement("chkHealthMinion").checked=e}function setShowHealthBoss(e){getUIElement("chkHealthBoss").checked=e}function setShowHealthTower(e){getUIElement("chkHealthTower").checked=e}function setShowHealthHero(e){getUIElement("chkHealthHero").checked=e}function setShowDamageMinion(e){getUIElement("chkDamageMinion").checked=e}function setShowDamageBoss(e){getUIElement("chkDamageBoss").checked=e}function setShowDamageTower(e){getUIElement("chkDamageTower").checked=e}function setShowDamageHero(e){getUIElement("chkDamageHero").checked=e}function isAutoBuy(e){switch(e){case"t0":return autobuyT0();case"t1":return autobuyT1();case"t2":return autobuyT2();case"t3":return autobuyT3()}return!1}function isAutoPrestige(e){switch(e){case"t0":return autoPrestigeT0();case"t1":return autoPrestigeT1();case"t2":return autoPrestigeT2();case"t3":return autoPrestigeT3()}return!1}function autobuyT0(){return getUIElement("chkAutoBuy0").checked}function autobuyT1(){return getUIElement("chkAutoBuy1").checked}function autobuyT2(){return getUIElement("chkAutoBuy2").checked}function autobuyT3(){return getUIElement("chkAutoBuy3").checked}function setAutobuyT0(e){getUIElement("chkAutoBuy0").checked=e}function setAutobuyT1(e){getUIElement("chkAutoBuy1").checked=e}function setAutobuyT2(e){getUIElement("chkAutoBuy2").checked=e}function setAutobuyT3(e){getUIElement("chkAutoBuy3").checked=e}function autoPrestigeT0(){return getUIElement("chkAutoPrestige0").checked}function autoPrestigeT1(){return getUIElement("chkAutoPrestige1").checked}function autoPrestigeT2(){return getUIElement("chkAutoPrestige2").checked}function autoPrestigeT3(){return getUIElement("chkAutoPrestige3").checked}function setAutoPrestigeT0(e){getUIElement("chkAutoPrestige0").checked=e}function setAutoPrestigeT1(e){getUIElement("chkAutoPrestige1").checked=e}function setAutoPrestigeT2(e){getUIElement("chkAutoPrestige2").checked=e}function setAutoPrestigeT3(e){getUIElement("chkAutoPrestige3").checked=e}function toggleTierAutoPrestige(e,t){switch(e){case"t0":getUIElement("chkAutoPrestige0").checked=t;break;case"t1":getUIElement("chkAutoPrestige1").checked=t;break;case"t2":getUIElement("chkAutoPrestige2").checked=t;break;case"t3":getUIElement("chkAutoPrestige3").checked=t}}function updateRestartLevel(e){setElementTextById("startingLevelSelection",e.value),resetLevel=e.value}function autoSellLimitChanged(){let e=getUIElement("autoSellLimit");autoSellLimit=+e.value,getUIElement("autoSellLimitSelection").textContent=autoSellLimit}function showAutoSellLimit(){toggleUIElementByID("autoSellSelectingChange",!1);let e=getUIElement("autoSellLimit");getUIElement("selectedAutoSell").textContent=e.value,getUIElement("maxAutosell").textContent=maxAutosellLimit}function hideAutoSellTip(){toggleUIElementByID("autoSellSelectingChange",!0)}function autoForgeLimitChanged(){let e=getUIElement("autoForgeLimit");autoForgeLimit=+e.value,getUIElement("autoForgeLimitSelection").textContent=autoForgeLimit}function showAutoForgeLimit(){toggleUIElementByID("autoForgeSelectingChange",!1);let e=getUIElement("autoForgeLimit");getUIElement("selectedAutoForge").textContent=e.value,getUIElement("maxAutoForge").textContent=maxAutoForgeLimit}function hideAutoForgeTip(){toggleUIElementByID("autoForgeSelectingChange",!0)}function onChangeChkAutoForge(){let e=document.getElementById("ddlForgeItems");e.selectedIndex=0,populateForgeAttributes(),populateForgeItems(),e.disabled=getUIElement("chkAutoForge").checked,e.title=getUIElement("chkAutoForge").checked?"Disabled when auto-forge is enabled":""}function showResetSelection(){toggleUIElementByID("resetSelectionChange",!1);let e=getUIElement("startingLevelSelector");getUIElement("selectedRestart").textContent=e.value,getUIElement("maxReset").textContent=maxResetLevel}function hideResetTip(){toggleUIElementByID("resetSelectionChange",!0)}function isAdvancedTactics(){return getUIElement("chkAdvancedTactics").checked}function showFPS(){return getUIElement("chkShowFPS").checked}function isSimpleMinions(){return getUIElement("chkSmipleMinions").checked}function isCompactMinions(){return getUIElement("chkCompactMinions").checked}function GetQuality(){return+getUIElement("ddlQuality").value}function autoSave(){return getUIElement("chkAutoSave").checked}function isColorblind(){return getUIElement("chkColorblind").checked}function getP1Rate(){return+getUIElement("ddlP1Rate").value}function setQuality(){drawMap()}function ShowP1(){getUIElement("ddlP1Rate").selectedIndex=0,setP1Rate()}function toggleMap(){if(getUIElement("chkHideMap").checked){pnl0.classList.add("hide"),pnl1.classList.add("noMap"),pnl1.style.top="5px",getUIElement("resourceBox").style.top="5px";return}pnl1.style.top=gameH+5+"px",getUIElement("resourceBox").style.top=gameH+5+"px",pnl0.classList.remove("hide"),pnl1.classList.remove("noMap")}function yesCookies(){cookiesEnabled=1,toggleUIElementByID("divCookies",!0)}function noCookies(){cookiesEnabled=0,toggleUIElementByID("divCookies",!0)}let resizerDelay;function resize(){clearTimeout(resizerDelay),resizerDelay=setTimeout(calcSize,200)}function calcSize(){let e=Math.max(document.documentElement.clientHeight),t=Math.max(document.documentElement.clientWidth),a=Math.max(200,Math.min(t,2.4*e)-10),n=a,o=a/4,i=o/gameH,s=n/gameW;gameW=n,gameH=o,langoliers=-(gameW>>3),halfH=gameH/2,leaderPoint=gameW/2,pathL=gameW>>6,pathW=gameH>>2;for(let l=0;l<path.length;l++)path[l].x*=s,path[l].y*=i;accents.forEach(e=>{e.loc.x*=s,e.loc.y*=i});for(let c=0;c<minions.length;c++)minions[c].Location.x*=s,minions[c].Location.y*=i;for(let r=0;r<underlings.length;r++)underlings[r].Location.x*=s,underlings[r].Location.y*=i;boss&&(boss.Location.x*=s,boss.Location.y*=i);for(let u=0;u<towers.length;u++)towers[u].Location.x*=s,towers[u].Location.y*=i;hero&&(hero.home.x*=s,hero.home.y*=i,hero.Location.x*=s,hero.Location.y*=i,hero.patrolX*=s),squire&&(squire.home.x*=s,squire.home.y*=i,squire.Location.x*=s,squire.Location.y*=i,squire.patrolX*=s),page&&(page.home.x*=s,page.home.y*=i,page.Location.x*=s,page.Location.y*=i,page.patrolX*=s);for(let m=0;m<projectiles.length;m++)projectiles[m].Location.x*=s,projectiles[m].Location.y*=i,projectiles[m].target.x*=s,projectiles[m].target.y*=i,projectiles[m].Resize();for(let g=0;g<impacts.length;g++)impacts[g].Location.x*=s,impacts[g].Location.y*=i;levelEndX*=s;let d=getUIElement("unitLayer");d.style.width=gameW,d.style.height=gameH,d.width=gameW,d.height=gameH;let h=getUIElement("mapLayer");h.style.width=gameW,h.style.height=gameH,h.width=gameW,h.height=gameH,pnl0.style.height=gameH+"px",pnl1.style.top=gameH+5+"px",pnl1.style.height=e-gameH-15+"px",getUIElement("resourceBox").style.top=gameH+5+"px",drawMap()}const unitTypes={Minion:{team:0,uniqueSymbol:1,infoSymbol:"&#x1f771;"},Boss:{team:0,uniqueSymbol:1,infoSymbol:"?"},Tower:{team:1,uniqueSymbol:0,infoSymbol:"&#x25a3;"},Hero:{team:1,uniqueSymbol:1,infoSymbol:"?"}},projectileTypes={ballistic:1,beam:2,blast:3,homing:4},statTypes={health:"health",damage:"damage",targetCount:"targetCount",moveSpeed:"moveSpeed",attackDelay:"attackDelay",attackRange:"attackRange",attackRate:"attackRate",projectileSpeed:"projectileSpeed",impactRadius:"impactRadius",spawnDelay:"spawnDelay",attackCharges:"attackCharges",chainRange:"chainRange",chainReduction:"chainReduction",regen:"regen",auraRange:"auraRange",auraPower:"auraPower",abilityDuration:"abilityDuration",abilityCooldown:"abilityCooldown",damageReduction:"damageReduction",initialMinions:"initialMinions",minionsPerDeploy:"minionsPerDeploy"},statDescription={health:"Amount of damage a unit can take",damage:"Amount of damage done when attacking",moveSpeed:"How fast a unit moves",attackDelay:"Time between attacks",attackRate:"How fast the attack delay is counted",attackRange:"Maximum distance a unit can attack",projectileSpeed:"How fast a projectile moves, not applicable for beam or blast attacks",impactRadius:"Size of impact, not applicable for beam or homing attacks",spawnDelay:"Time between unit spawns",targetCount:"Number of targets that can be attacked in parallel",attackCharges:"Number of targets that can be attacked in series",chainRange:"Maximum distance a projectile can travel between targets in series",chainReduction:"Percent of damage done to subsiquent targets in series",auraRange:"Maximum distance for units to be effected by the aura",auraPower:"The strength of the aura effect",abilityDuration:"Time that an active ability effect lasts",abilityCooldown:"Time from the end of active ability until it can be used again",damageReduction:"Reduces incoming damage",initialMinions:"Number of minions deployed at reset",minionsPerDeploy:"Number of units deployed per spawn",regen:"Rate of passively regaining health."},statAdjustments={health:1,damage:1,targetCount:1,moveSpeed:3e3,attackDelay:3,attackRate:1,attackRange:10,projectileSpeed:50,impactRadius:10,spawnDelay:1,attackCharges:1,chainRange:10,chainReduction:1,auraRange:10,auraPower:10,abilityDuration:1,abilityCooldown:1,damageReduction:1,initialMinions:1,minionsPerDeploy:1,regen:1e3},statMaxLimits={moveSpeed:350,projectileSpeed:400,attackRange:50,impactRadius:25,chainRange:50,auraRange:100},statMinLimits={attackDelay:200,spawnDelay:50},backwardsStats=[statTypes.attackDelay,statTypes.spawnDelay,statTypes.abilityCooldown],flooredStats=[statTypes.targetCount,statTypes.attackCharges,statTypes.initialMinions,statTypes.minionsPerDeploy],scaledStats=[statTypes.moveSpeed,statTypes.attackRange,statTypes.auraRange],resources={a:{amt:1,name:"Ruples",symbol:"α",value:1},b:{amt:0,name:"Shillins",symbol:"\xdf",value:2},c:{amt:0,name:"Tokens",symbol:"Γ",value:3},d:{amt:0,name:"Units",symbol:"π",value:4},e:{amt:0,name:"Vincula",symbol:"Σ",value:5},f:{amt:0,name:"Womba",symbol:"σ",value:6}},gauges={Range:{isUnlocked:1,cost:1},Reload:{isUnlocked:1,cost:1},Health:{isUnlocked:1,cost:1},Damage:{isUnlocked:1,cost:1}},tierMisc={t0:{tier:0,autobuy:{isUnlocked:0,resource:"b"},upgradePotency:1,miscUpgrades:{moneyPit_0:"Money Pit"}},t1:{tier:1,autobuy:{isUnlocked:0,resource:"c"},upgradePotency:1,miscUpgrades:{autoBuy_1:"Unlock Automate Armory",upgradePotency_1:"Armory Multiplier",maxMinions_1:"Active Squads Limit++"}},t2:{tier:2,autobuy:{isUnlocked:0,resource:"d"},upgradePotency:1,miscUpgrades:{autoBuy_2:"Unlock Automate Gym",upgradePotency_2:"Gym Multiplier",upgradeLimit_2:"Upgrade Limit++"}},t3:{tier:3,autobuy:{isUnlocked:0,resource:"e"},upgradePotency:1,miscUpgrades:{autoBuy_3:"Unlock Automate Lab",upgradePotency_3:"Lab Multiplier",reduceDeployTime_3:"Deploy Time--"}},t4:{tier:4,autobuy:{isUnlocked:0,resource:"f"},miscUpgrades:{autoBuy_4:"Unlock Automate Office",upgradePotency_4:"Office Multiplier",autoSell_4:"Auto Sell limit++",autoForge_4:"Auto Forge limit++",startingLevel_4:"Maximum Starting Level++"}}},bombTypes={heal:{text:"Heal Invaders",team:0,effectType:0,remaining:0,stats:[statTypes.health],initial:{a:.5,m:1,d:10},scaleA:{a:1,m:1.2},scaleM:{a:0,m:1},scaleD:{a:2,m:1.1}},bless:{text:"Bless Invaders",team:0,effectType:0,remaining:0,stats:[statTypes.attackDelay,statTypes.damage,statTypes.moveSpeed],initial:{a:.5,m:1.1,d:50},scaleA:{a:1,m:1.05},scaleM:{a:.1,m:1.05},scaleD:{a:1,m:1.1}},damage:{text:"Damage Defenders",team:1,effectType:1,remaining:0,stats:[statTypes.health],initial:{a:-.5,m:1,d:1},scaleA:{a:-.1,m:1.01},scaleM:{a:0,m:1},scaleD:{a:1,m:1.001}},curse:{text:"Curse Defenders",team:1,effectType:1,remaining:0,stats:[statTypes.attackDelay,statTypes.damage],initial:{a:0,m:.9,d:50},scaleA:{a:0,m:1},scaleM:{a:0,m:.9},scaleD:{a:5,m:1.1}}};let globalSpawnDelayReduction=0;const defaultMaxUpgradeLevel=4;let maxUpgradeLevel=4,moneyPitLevel=0;const achievements={prestige0:{name:"Regroups",bonus:"Reduce armory prices and increase armory minion upgrades",count:0,first:8,mult:2,add:0,unlockT:1,maxLevel:12,maxCount:0},prestige1:{name:"Researches",bonus:"Reduce gym prices and increase gym minion upgrades",count:0,first:4,mult:2,add:0,unlockT:2,maxLevel:12,maxCount:0},prestige2:{name:"Recruits",bonus:"Reduce lab prices and increase lab minion upgrades",count:0,first:2,mult:2,add:0,unlockT:3,maxLevel:12,maxCount:0},prestige3:{name:"Restructures",bonus:"Reduce office prices and increase office minion upgrades",count:0,first:1,mult:2,add:0,unlockT:4,maxLevel:12,maxCount:0},towersDestroyed:{name:"Towers Destroyed",bonus:"Increase shillins gain",count:0,first:32,mult:2,add:0,unlockT:1,maxLevel:12,maxCount:0},heroesKilled:{name:"Heroes Vanquished",bonus:"Increase tokens gain",count:0,first:4,mult:2,add:0,unlockT:2,maxLevel:12,maxCount:0},bossesSummoned:{name:"Bosses Summoned",bonus:"Increase units gain",count:0,first:12,mult:2,add:6,unlockT:3,maxLevel:12,maxCount:0},itemScrapped:{name:"Items Sold",bonus:"Increase vincula gain",count:0,first:8,mult:2,add:4,unlockT:4,maxLevel:12,maxCount:0},minionsSpawned:{name:"Minions Deployed",bonus:"Boss stat multiplier",count:0,first:32,mult:4,add:1,unlockT:3,maxLevel:12,maxCount:0},maxLevelCleared:{name:"Maximum Level",bonus:"Improve equipment drop rarity",count:0,first:1,mult:1,add:1,unlockT:4,maxLevel:12,maxCount:0},itemPrestiged:{name:"Items Reforged",bonus:"Store effectiveness",count:0,first:1,mult:1.6,add:0,unlockT:5,maxLevel:12,maxCount:0}},underling={health:.1,damage:0,moveSpeed:25,attackDelay:1/0,projectileSpeed:0,projectileType:"None",attackRange:0,impactRadius:0,spawnDelay:300,isFlying:0,targetCount:0,attackCharges:0,chainRange:0,chainReduction:0,unlockCost:0,color:"#741",color2:"#171",minionsPerDeploy:1},baseMinionDefault={health:4,damage:3,moveSpeed:20,attackDelay:5e3,attackRate:1,projectileSpeed:75,projectileType:projectileTypes.ballistic,attackRange:8,impactRadius:.5,spawnDelay:3e3,isFlying:0,targetCount:1,attackCharges:1,chainRange:0,chainReduction:0,regen:0,unlockCost:0,color:"#FFF",color2:"#000",minionsPerDeploy:1},baseMinion={Mite:{health:2,damage:1,attackRange:6,spawnDelay:1200,minionsPerDeploy:2,symbol:"&#x2610;",color:"#0AA",color2:"#000",info:"Weak ground unit with short spawn time."},Imp:{health:1,damage:2,projectileType:projectileTypes.beam,attackRange:6,spawnDelay:1200,minionsPerDeploy:2,isFlying:1,symbol:"&#x2610;",color:"#D40",color2:"#500",info:"Weak flying unit with short spawn time."},Bomber:{moveSpeed:15,attackRange:10,impactRadius:4,spawnDelay:2750,attackDelay:7e3,isFlying:1,symbol:"&#x2610;",color:"#CCC",color2:"#040",info:"A flying unit with large impact area but slow move speed. Bombers crash in an explosion when they die."},Catapult:{damage:4,attackRange:11,attackDelay:1e4,spawnDelay:3300,symbol:"&#x2610;",color:"#972",color2:"#420",info:"A ground unit with large attack range but slow attack rate. Catapults cannot reload while moving."},Golem:{health:8,moveSpeed:15,attackRange:7,attackDelay:7e3,spawnDelay:2700,symbol:"&#x2610;",color:"#A52",color2:"#431",info:"Ground unit with high health but slow spawn time. Golems take reduced damage effected by missing health."},Harpy:{damage:5,health:3,moveSpeed:30,isFlying:1,attackRange:7,attackCharges:2,chainRange:10,chainReduction:.5,projectileType:projectileTypes.homing,symbol:"&#x2610;",color:"#FC0",color2:"#000",info:"Flying unit with high damage but short range. Harpies have a chance to dodge attacks."},Ram:{damage:4,moveSpeed:40,attackDelay:7e3,attackRange:6,spawnDelay:2700,projectileType:projectileTypes.beam,symbol:"&#x2610;",color:"#333",color2:"#AAA",info:"Ground unit with high move speed but slow attack rate. Rams cannot move while reloading."},Vampire:{health:2,moveSpeed:30,attackDelay:2e3,attackRange:8,isFlying:1,spawnDelay:2500,minionsPerDeploy:3,projectileType:projectileTypes.beam,symbol:"&#x2610;",color:"#99D",color2:"#404",info:"Unit with a high rate of attack but low health. Vampires are flying units while moving and ground units while attacking."},Air:{health:1,damage:6,attackDelay:1e3,moveSpeed:40,isFlying:1,attackCharges:4,chainRange:50,chainReduction:.95,attackRange:5,projectileType:projectileTypes.beam,minionsPerDeploy:2,unlockCost:32,symbol:"&#x2610;",color:"#FF4",color2:"#555",info:"A fragile fast flying kamikaze minion with a high damage beam attack."},Earth:{health:10,moveSpeed:10,attackDelay:1e4,projectileType:projectileTypes.blast,targetCount:2,spawnDelay:3900,regen:3,attackRange:5,impactRadius:5,minionsPerDeploy:2,unlockCost:32,symbol:"&#x2610;",color:"#6A2",color2:"#652",info:"A ground unit with high health and a blast attack. Earth elementals spawns as one amalgamate; minions per deploy increases attributes."},Fire:{health:2,damage:4,attackDelay:6e3,spawnDelay:2400,impactRadius:2,attackRange:2,projectileType:projectileTypes.blast,minionsPerDeploy:4,unlockCost:32,symbol:"&#x2610;",color:"#C00",color2:"#FB0",info:"A ground unit that burns towers with guerrilla tactics and inflicts damage over time."},Water:{health:2,damage:5,moveSpeed:25,impactRadius:2,attackRange:.1,spawnDelay:3600,isFlying:1,projectileType:projectileTypes.beam,minionsPerDeploy:6,unlockCost:32,symbol:"&#x2610;",color:"#0FF",color2:"#01F",info:"Rains down blessings on the Invaders. Blessing power is based on water stats."}},minionUpgradeMultipliersDefault={health:1.02,damage:1.02,moveSpeed:1.01,attackDelay:.99,impactRadius:1.02,attackRange:1.01,spawnDelay:.98},minionUpgradeMultipliers={Mite:{spawnDelay:.95},Imp:{spawnDelay:.95},Bomber:{impactRadius:1.02,damage:1.01},Catapult:{attackRange:1.02,attackDelay:.995},Golem:{health:1.03,attackRange:1.005},Harpy:{damage:1.03,attackRange:1.005,attackDelay:.995},Ram:{moveSpeed:1.02,attackRange:1.005},Vampire:{attackDelay:.98,damage:1.01,attackRange:1.005},Air:{moveSpeed:1.02,damage:1.03,attackRange:1},Earth:{health:1.03,spawnDelay:.97,attackRange:1.01,impactRadius:1.01},Fire:{impactRadius:1.01,damage:1.01,attackRange:1},Water:{spawnDelay:.96,health:1.03,impactRadius:1.01}},minionResearch={Mite:{isUnlocked:0,lastSpawn:0,unlockT:0,hotkey:"Q"},Imp:{isUnlocked:0,lastSpawn:0,unlockT:0,hotkey:"W"},Bomber:{isUnlocked:0,lastSpawn:0,unlockT:1,hotkey:"E"},Catapult:{isUnlocked:0,lastSpawn:0,unlockT:1,hotkey:"R"},Golem:{isUnlocked:0,lastSpawn:0,unlockT:1,hotkey:"T"},Harpy:{isUnlocked:0,lastSpawn:0,unlockT:1,hotkey:"Y"},Ram:{isUnlocked:0,lastSpawn:0,unlockT:1,hotkey:"U"},Vampire:{isUnlocked:0,lastSpawn:0,unlockT:1,hotkey:"I"},Air:{isUnlocked:0,lastSpawn:0,unlockT:2,hotkey:"O"},Earth:{isUnlocked:0,lastSpawn:0,unlockT:2,hotkey:"P"},Fire:{isUnlocked:0,lastSpawn:0,unlockT:2,hotkey:"{ "},Water:{isUnlocked:0,lastSpawn:0,unlockT:2,hotkey:" }"}},minionUpgrades={Mite:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Imp:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Bomber:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Catapult:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Golem:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Harpy:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Ram:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Vampire:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Air:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Earth:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Fire:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0},Water:{health:0,damage:0,moveSpeed:0,attackDelay:0,impactRadius:0,attackRange:0,spawnDelay:0,initialMinions:0,minionsPerDeploy:0}},baseTowerDefault={health:4,damage:1,targetCount:1.5,attackDelay:2500,attackRate:1,projectileSpeed:50,attackRange:10,canHitAir:0,canHitGround:0,attackCharges:1.3,chainRange:10,chainReduction:.5,impactRadius:1,spawnWeight:1,projectileType:projectileTypes.ballistic,attackEffect:null,regen:.05},attackEffects={DOT:[{name:statTypes.health,aBase:-.0078125,mBase:null,levelMultiplier:1.15,defaultDuration:100}],Slow:[{name:statTypes.moveSpeed,aBase:null,mBase:.8,levelMultiplier:.98,defaultDuration:100}],Stun:[{name:statTypes.attackRate,aBase:null,mBase:.8,levelMultiplier:.98,defaultDuration:100}],Disarm:[{name:statTypes.damage,aBase:null,mBase:.7,levelMultiplier:.97,defaultDuration:100}],Dibilitate:[{name:statTypes.attackRate,aBase:null,mBase:.9,levelMultiplier:.97,defaultDuration:75},{name:statTypes.moveSpeed,aBase:null,mBase:.9,levelMultiplier:.97,defaultDuration:75},{name:statTypes.damage,aBase:null,mBase:.9,levelMultiplier:.97,defaultDuration:75}]},baseTower={Basic:{spawnWeight:6,damage:.8,attackDelay:1200,canHitAir:1,canHitGround:1,impactRadius:2,projectileSpeed:60,color:"#D0F",color2:"#406",info:"Basic tower that hits air and ground units."},Artillery:{spawnWeight:2,health:5,damage:2,attackDelay:4e3,attackRange:11,impactRadius:4,canHitGround:1,attackEffect:attackEffects.Dibilitate,color:"#F73",color2:"#622",info:"Hits ground units with a large impact radius and reduces damage, movement speed, and rate of attack."},Explosion:{health:6,spawnWeight:1,canHitAir:1,canHitGround:1,attackRange:10,impactRadius:12,projectileType:projectileTypes.blast,attackEffect:attackEffects.Stun,color:"#AAA",color2:"#222",info:"Blast attack that hits air and ground units that reduces rate of attack."},Ice:{spawnWeight:4,damage:.5,targetCount:2,canHitAir:1,canHitGround:1,impactRadius:1,projectileType:projectileTypes.beam,attackEffect:attackEffects.Slow,color:"#0AF",color2:"#037",info:"Beam attack that hits air and ground units that reduces movement speed."},Lightning:{spawnWeight:4,health:3,damage:2,attackCharges:2,attackRange:11,chainRange:15,chainReduction:.5,canHitAir:1,projectileType:projectileTypes.beam,attackEffect:attackEffects.Disarm,color:"#FF0",color2:"#666",info:"Beam attack that hits air units and reduces damage."},Poison:{spawnWeight:4,damage:1,attackCharges:2,attackRange:10,chainRange:15,chainReduction:1,canHitAir:1,canHitGround:1,attackEffect:attackEffects.DOT,projectileType:projectileTypes.homing,projectileSpeed:70,color:"#6C6",color2:"#131",info:"Homing attack that hits air and ground units and deals damage over time."},Sniper:{damage:3,spawnWeight:2,attackRange:13,attackDelay:3e3,projectileType:projectileTypes.homing,projectileSpeed:70,canHitAir:1,canHitGround:1,color:"#D33",color2:"#300",info:"Homing attack that hits air and ground units."}},towerLevelMultipliersDefault={health:1.1,damage:1.1,targetCount:1.024,attackDelay:.97,projectileSpeed:1.01,attackRange:1.02,attackCharges:1.024,chainRange:1.01,chainReduction:1,impactRadius:1.02,regen:1.2},towerLevelMultipliers={Basic:{health:1.12,damage:1.12,impactRadius:1},Artillery:{damage:1.15,impactRadius:1.03,attackRange:1.03},Explosion:{health:1.2,attackRange:1.01,impactRadius:1.01,attackDelay:.95,targetCount:1,attackCharges:1,chainRange:1},Ice:{targetCount:1.1,attackRange:1.03,attackDelay:.95,impactRadius:1,attackCharges:1,chainRange:1},Lightning:{projectileSpeed:1,attackRange:1.03,attackDelay:.95,attackCharges:1.1,targetCount:1.1,chainRange:1.02,chainReduction:1,impactRadius:1},Poison:{projectileSpeed:1.05,damage:1.05,attackRange:1.03,attackCharges:1.05,chainRange:1.02,impactRadius:1},Sniper:{damage:1.2,attackRange:1.05,attackDelay:.99,projectileSpeed:1.05,impactRadius:1,attackCharges:1,chainRange:1}},baseBossDefault={health:100,damage:20,attackDelay:3e3,attackRate:1,moveSpeed:20,projectileSpeed:100,abilityDuration:300,abilityCooldown:3e3,spawnDelay:3e3,projectileType:projectileTypes.ballistic,attackRange:12,attackCharges:1,chainRange:0,chainReduction:0,auraRange:15,impactRadius:2,targetCount:1,auraPower:15,isFlying:0,regen:0,unlockCost:32,passiveAbilityInfo:"N/A"},baseBoss={Death:{health:50,moveSpeed:30,attackRange:15,abilityDuration:150,abilityCooldown:2e3,impactRadius:4,symbol:"&#x1f480;",color:"#777",color2:"#111",info:"Ground unit that increases move speed and commands the undead.",auraInfo:"Haste: Increase invader move speed.",passiveAbilityInfo:"Rise: When a minion dies it is resurrected with reduced attributes; can not resurrect elementals.",activeAbilityInfo:"Incite: Summon zombie horde. Zombies travel in a straight line and have reduced attributes."},Famine:{damage:10,attackDelay:2500,projectileType:projectileTypes.beam,attackRange:15,spawnDelay:1500,moveSpeed:35,isFlying:1,symbol:"&#x20E0;",color:"#770077",color2:"#111111",info:"Air unit with a beam attack that decreases enemy attack rate.",auraInfo:"Starve: Damage defenders over time.",passiveAbilityInfo:"Drain: Attacks delay the targets' next attack",activeAbilityInfo:"Exhaust: Reset all defenders' attack timer and slows attack rate."},Pestilence:{health:75,damage:5,moveSpeed:10,projectileType:projectileTypes.homing,abilityDuration:150,abilityCooldown:4500,spawnDelay:2100,attackDelay:1200,attackRange:20,auraRange:18,targetCount:2,attackCharges:3,chainRange:50,projectileSpeed:100,chainReduction:.9,isFlying:1,symbol:"&#x2623;",color:"#070",color2:"#111",info:"Air unit with a long range homing attack and damage over time.",auraInfo:"Enfeable: Reduce enemy damage",passiveAbilityInfo:"Infect: Attacks stack damage over time.",activeAbilityInfo:"Epidemic: Increase attack charges and attack rate."},War:{health:200,projectileType:projectileTypes.blast,abilityCooldown:1e3,targetCount:2,attackRange:7,impactRadius:6,spawnDelay:3500,regen:3,symbol:"&#x2694;",color:"#C00",color2:"#620",info:"Ground unit with a short ranged blast attack and charges towers.",auraInfo:"Fury: Increase invader rate of attack",passiveAbilityInfo:"Rage: Attacks reduce time to next respawn; getting attacked reduces time to next attack and recharges active ability.",activeAbilityInfo:"Rampage: Become immune to curses and charge at the next tower with increased move speed and attack rate. Also reduces direct damage taken for the duration."}},bossUpgradeMultipliersDefault={auraPower:1.02,auraRange:1.02,abilityDuration:1.03,abilityCooldown:.97},bossUpgradeMultipliers={Death:{abilityCooldown:.95,moveSpeed:1.05,impactRadius:1.02},Famine:{abilityDuration:1.05,spawnDelay:.96,attackRange:1.01},Pestilence:{auraRange:1.05,chainReduction:1.01,attackCharges:1.02},War:{auraPower:1.05,attackDelay:.95,regen:1.02}},bossResearch={Death:{isUnlocked:0,lastSpawn:0},Famine:{isUnlocked:0,lastSpawn:0},Pestilence:{isUnlocked:0,lastSpawn:0},War:{isUnlocked:0,lastSpawn:0}},bossUpgrades={Death:{impactRadius:0,moveSpeed:0,auraRange:0,auraPower:0,abilityDuration:0,abilityCooldown:0},Famine:{attackRange:0,spawnDelay:0,auraRange:0,auraPower:0,abilityDuration:0,abilityCooldown:0},Pestilence:{attackCharges:0,chainReduction:0,auraRange:0,auraPower:0,abilityDuration:0,abilityCooldown:0},War:{attackDelay:0,regen:0,auraRange:0,auraPower:0,abilityDuration:0,abilityCooldown:0}},baseHeroDefault={damage:2,health:10,regen:2,attackDelay:2250,attackRate:1,attackRange:10,projectileSpeed:60,moveSpeed:15,attackCharges:1.5,canHitAir:1,canHitGround:1,chainRange:0,chainReduction:0,spawnWeight:1,impactRadius:3,targetCount:1.5},heroPowerTypes={DamageReduction:{name:statTypes.damageReduction,effects:[{effectType:statTypes.damageReduction,aBase:-1,mBase:.8,aMultiplier:1.1,mMultiplier:.9}]},Heal:{name:"Heal",effects:[{effectType:statTypes.health,aBase:.005,aMultiplier:1.005}]},AttackBoost:{name:"AttackBoost",effects:[{effectType:statTypes.attackRate,mBase:1.01,mMultiplier:1.03},{effectType:statTypes.damage,mBase:1.1,mMultiplier:1.03}]}},baseHero={Cleric:{projectileType:projectileTypes.blast,heroPowerType:heroPowerTypes.Heal,impactRadius:15,regen:4,color:"#DF4",color2:"#999",symbol:"&#x271d;",info:"Ground unit with a blast attack that heals nearby defenders."},Mage:{health:7,damage:3,attackDelay:1500,attackRange:12,moveSpeed:14,attackCharges:2,targetCount:2,chainRange:20,chainReduction:.95,projectileType:projectileTypes.beam,heroPowerType:heroPowerTypes.AttackBoost,color:"#77F",color2:"#220",symbol:"&#x269a;",info:"Ground unit with a beam attack that blesses nearby defenders."},Knight:{health:12,attackRange:10,impactRadius:7,projectileSpeed:75,projectileType:projectileTypes.onballistic,heroPowerType:heroPowerTypes.DamageReduction,color:"#F44",color2:"#777",symbol:"&#x26e8;",info:"Ground unit with high damage reduction."}},heroLevelMultipliersDefault={moveSpeed:1.1,attackDelay:.98,projectileSpeed:1.05,attackRange:1.02,impactRadius:1.01,attackCharges:1,targetCount:1,regen:1.1},heroLevelMultipliers={Cleric:{health:1.15,damage:1.1,regen:1.2,attackDelay:.97,impactRadius:1.02},Mage:{health:1.1,damage:1.15,attackRange:1.03,attackCharges:1.03,targetCount:1.03},Knight:{health:1.2,damage:1.05,moveSpeed:1.07,impactRadius:1.005,attackCharges:1.02,targetCount:1.02}},itemType={weapon:{name:"weapon",rangeAdjustment:3,dropWeight:8,stat:statTypes.damage},shield:{name:"shield",rangeAdjustment:2,dropWeight:7,stat:statTypes.health},legs:{name:"legs",rangeAdjustment:1,dropWeight:6,stat:statTypes.spawnDelay},torso:{name:"torso",rangeAdjustment:0,dropWeight:5,stat:statTypes.attackDelay},feet:{name:"feet",rangeAdjustment:-1,dropWeight:4,stat:statTypes.moveSpeed},head:{name:"head",rangeAdjustment:-2,dropWeight:3,stat:statTypes.attackRange},trinket:{name:"trinket",rangeAdjustment:-3,dropWeight:2,stat:statTypes.auraPower},amulet:{name:"amulet",rangeAdjustment:-4,dropWeight:1,stat:statTypes.auraRange}},itemTier={t0:{attrCount:0,score:0},t1:{attrCount:1,score:1},t2:{attrCount:1,score:2},t3:{attrCount:1,score:3},t4:{attrCount:2,score:4},t5:{attrCount:2,score:5},t6:{attrCount:2,score:6},t7:{attrCount:3,score:7}},items={t0:{weapon:{stick:{dropWeight:4,rangeAdjustment:0},club:{dropWeight:1,rangeAdjustment:1}}},t1:{weapon:{staff:{dropWeight:4,rangeAdjustment:0},spear:{dropWeight:1,rangeAdjustment:1}},shield:{aspis:{dropWeight:1,rangeAdjustment:-1}}},t2:{weapon:{dagger:{dropWeight:4,rangeAdjustment:0},claws:{dropWeight:1,rangeAdjustment:1}},shield:{buckler:{dropWeight:2,rangeAdjustment:0}},legs:{breeches:{dropWeight:1,rangeAdjustment:-1}}},t3:{weapon:{axe:{dropWeight:4,rangeAdjustment:0},kama:{dropWeight:1,rangeAdjustment:1}},shield:{targe:{dropWeight:4,rangeAdjustment:0}},legs:{chausses:{dropWeight:2,rangeAdjustment:0}},torso:{vest:{dropWeight:1,rangeAdjustment:-1}}},t4:{weapon:{mace:{dropWeight:4,rangeAdjustment:0},flail:{dropWeight:1,rangeAdjustment:1}},shield:{rondache:{dropWeight:4,rangeAdjustment:0}},legs:{schynbald:{dropWeight:4,rangeAdjustment:0}},torso:{brigandine:{dropWeight:2,rangeAdjustment:0}},feet:{sandals:{dropWeight:1,rangeAdjustment:-1}}},t5:{weapon:{sickle:{dropWeight:4,rangeAdjustment:0},scythe:{dropWeight:1,rangeAdjustment:1}},shield:{kiteShield:{dropWeight:4,rangeAdjustment:0}},legs:{cuisse:{dropWeight:4,rangeAdjustment:0}},torso:{hauberk:{dropWeight:4,rangeAdjustment:0}},feet:{clompers:{dropWeight:2,rangeAdjustment:0}},head:{cap:{dropWeight:1,rangeAdjustment:-1}}},t6:{weapon:{halberd:{dropWeight:4,rangeAdjustment:0},glaive:{dropWeight:2,rangeAdjustment:1}},shield:{aegis:{dropWeight:4,rangeAdjustment:0}},legs:{tassets:{dropWeight:4,rangeAdjustment:0}},torso:{cuirass:{dropWeight:4,rangeAdjustment:0}},feet:{greaves:{dropWeight:4,rangeAdjustment:0}},head:{coif:{dropWeight:2,rangeAdjustment:0}},trinket:{statuette:{dropWeight:1,rangeAdjustment:-1}}},t7:{weapon:{sword:{dropWeight:4,rangeAdjustment:0},greatSword:{dropWeight:1,rangeAdjustment:1}},shield:{towerShield:{dropWeight:4,rangeAdjustment:0}},legs:{plateLeggings:{dropWeight:4,rangeAdjustment:0}},torso:{fullPlate:{dropWeight:4,rangeAdjustment:0}},feet:{sabaton:{dropWeight:4,rangeAdjustment:0}},head:{crown:{dropWeight:4,rangeAdjustment:0}},trinket:{relic:{dropWeight:2,rangeAdjustment:0}},amulet:{pendant:{dropWeight:1,rangeAdjustment:-1}}}};