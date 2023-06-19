"use strict";let gameW=1200,gameH=600,halfH=300,pathL=20,pathW=20,leaderPoint=120;const defaultInterval=15;let path=[],accents=[],langoliers=-(gameW>>3),projectiles=[],impacts=[],totalPaths=0,level=0,levelEndX=0,levelStartX=0,resetLevel=0,maxResetLevel=0,maxFPS=0,minFPS=100,maxMinions=0,lastSave=0,cookiesEnabled=0,Quality=3;const hilites=[];let ticksSinceReset=0,paused=!1;const underlings=[],minions=[];let minionOrder=[];const towers=[];let quid=[],hero=null,squire=null,page=null,boss=null;const maxInventory=24,inventory=[];let maxAutosellLimit=100,autoSellLimit=0,maxAutoForgeLimit=100,autoForgeLimit=0,newItemPreview=null,leadInvader=null,team0=[],team1=[],achievementCycle=0,autoBuySellCycle=0,autoSaveCycle=0,p0Cycle=0,p1Cycle=0,mainCycle=0,sinceQuid=0,consecutiveMainCylceErrors=0,consecutiveBuySellErrors=0,consecutiveSaveErrors=0,consecutiveP0Errors=0,consecutiveP1Errors=0;function UpgradeList(e,t,n){this.unitType=e,this.listId=t,this.listElement=n,this.upgrades=[]}function UpgradeIds(e,t,n,o,s,i,l){this.upgradeType=e,this.button=t,this.cost=n,this.lvl=o,this.maxLvl=s,this.potency=i,this.perk=l}function UnlockIds(e,t,n){this.upgradeType=e,this.button=t,this.cost=n}function UnlockList(e){this.tier=e,this.unlocks=[]}function PrestigeButton(e,t,n,o){this.tier=e,this.button=t,this.cost=n,this.gains=o}function TierMiscButtons(e){this.tier=e,this.buttons=[]}function MiscButton(e,t,n){this.type=e,this.button=t,this.cost=n}function AchievementElement(e,t,n,o,s){this.type=e,this.level=t,this.maxCount=n,this.count=o,this.goal=s}function BossUIElements(e,t,n,o,s){this.type=e,this.select=t,this.selectLabel=n,this.progress=o,this.progressBackground=s}const t0Upgrades=[],t1Upgrades=[],t2Upgrades=[],t3Upgrades=[],t4Upgrades=[],t3BossUpgrades=[],unlockButtons=[],miscTierButtons=[],prestigeButtons=[],achievementElements=[],bossUIs=[],forgeItemButtons=[],UIElements={};function getUIElement(e){if(void 0===UIElements[e]){let t=document.getElementById(e);if(null===t)return console.error("UI Element Not Found: "+e),null;UIElements[e]=t}return UIElements[e]}function removeUIElement(e){let t=getUIElement(e);null!==t&&t.parentNode.removeChild(t)}function isUIElementHiddenByID(e){return isUIElementHidden(getUIElement(e))}function isUIElementHidden(e){return e.classList.contains("hide")}function toggleUIElementByID(e,t){toggleUIElement(getUIElement(e),t)}function toggleUIElement(e,t){null!==e&&void 0!==e.classList&&isUIElementHidden(e)!==t&&e.classList.toggle("hide",t)}function MinionSpawnChildren(e,t,n){this.base=e,this.chk=t,this.progress=n}const minionSpawns={};function toggleP1(e,t){let n=document.getElementsByClassName("mnuSelected");for(let o=0;o<n.length;o++)n[o].classList.remove("mnuSelected");let s=document.getElementsByClassName("p1BlockChild");for(let i=0;i<s.length;i++)toggleUIElement(s[i],!0);e.classList.add("mnuSelected"),toggleUIElementByID(t,!1),"btnMnuGym"===e.id?resources.b.amt>getAutobuyCost(0)&&!tierMisc.t0.autobuy.isUnlocked&&addHilite("btnautoBuy_1",2):"btnMnuLab"===e.id?resources.c.amt>getAutobuyCost(1)&&!tierMisc.t1.autobuy.isUnlocked&&addHilite("btnautoBuy_2",2):"btnMnuOffice"===e.id?resources.d.amt>getAutobuyCost(2)&&!tierMisc.t2.autobuy.isUnlocked&&addHilite("btnautoBuy_3",2):"btnMnuForge"===e.id?(resources.e.amt>getAutobuyCost(3)&&!tierMisc.t3.autobuy.isUnlocked&&addHilite("btnautoBuy_4",2),populateForgeItems()):"btnMnuStore"===e.id?updateChestStore():"btnMnuStatistics"===e.id&&setStats(),delHilite(e.id)}function setColorblind(){setActiveStyleSheet();let e=document.getElementsByClassName("cbh");if(isColorblind())for(let t=0;t<e.length;t++)e[t].classList.add("hide");else for(let n=0;n<e.length;n++)e[n].classList.remove("hide")}function setActiveStyleSheet(){let e=getUIElement("ddlColors"),t=e.options[e.selectedIndex],n=t?t.text:"Light",o=document.getElementsByTagName("link");for(let s=0;s<o.length;s++){let i=o.item(s);!("stylesheet"!==i.rel||i.href.endsWith("Style.css"))&&(i.href.includes(n)&&i.href.includes("Colorblind")===isColorblind()?i.removeAttribute("disabled"):i.setAttribute("disabled",null))}drawMap()}function GetStyleColor(){return"#"+getUIElement("ddlColors").value}function oppositeHex(e){let t=16**e.length-1,n="0".repeat(e.length);return(n+(t-parseInt(e,16)).toString(16)).slice(-e.length)}function GetColorblindColor(){let e=getUIElement("ddlColors").value,t=3===e.length?1:2,n=oppositeHex(e.slice(0,t)),o=oppositeHex(e.slice(t,2*t)),s=oppositeHex(e.slice(2*t,3*t));return`#${n}${o}${s}`}function GetColorblindBackgroundColor(){return"#"+getUIElement("ddlColors").value}function resetInputs(){resetGauges(),resetAllAutobuy(),resetMinionSpawns(),resetSelectedBoss(),resetOptions()}function resetGauges(){setShowRangeMinion(!1),setShowRangeBoss(!1),setShowRangeTower(!1),setShowRangeHero(!1),setShowReloadMinion(!1),setShowReloadBoss(!1),setShowReloadTower(!1),setShowReloadHero(!1),setShowHealthMinion(!1),setShowHealthBoss(!1),setShowHealthTower(!1),setShowHealthHero(!1),setShowDamageMinion(!1),setShowDamageBoss(!1),setShowDamageTower(!1),setShowDamageHero(!1)}function resetAllAutobuy(){setAutobuyT0(!1),setAutobuyT1(!1),setAutobuyT2(!1),setAutobuyT3(!1)}function resetAutobuy(e){switch(e){case 0:setAutobuyT0(!1);break;case 1:setAutobuyT1(!1);break;case 2:setAutobuyT2(!1);break;case 3:setAutobuyT3(!1)}}function resetOptions(){document.getElementById("ddlColors").selectedIndex=0,document.getElementById("ddlQuality").selectedIndex=0,document.getElementById("ddlP1Rate").selectedIndex=0,document.getElementById("chkShowFPS").checked=!1,document.getElementById("chkColorblind").checked=!1,document.getElementById("chkSmipleMinions").checked=!0,document.getElementById("chkCompactMinions").checked=!1,document.getElementById("txtExport").value=null,document.getElementById("txtImport").value=null}function resetMinionSpawns(){for(let e in minionResearch)minionResearch[e].isUnlocked&&(document.getElementById("chkSpawn"+e).checked=!0)}function resetSelectedBoss(){getUIElement("selectNone").checked=!0}function autoCastAbility(){return getUIElement("chkAutocast").checked}function setAutoCastAbility(e){return getUIElement("chkAutocast").checked=e}function showRangeMinion(){return getUIElement("chkRangeMinion").checked}function showRangeBoss(){return getUIElement("chkRangeBoss").checked}function showRangeTower(){return getUIElement("chkRangeTower").checked}function showRangeHero(){return getUIElement("chkRangeHero").checked}function showReloadMinion(){return getUIElement("chkReloadMinion").checked}function showReloadBoss(){return getUIElement("chkRangeBoss").checked}function showReloadTower(){return getUIElement("chkRangeTower").checked}function showReloadHero(){return getUIElement("chkRangeHero").checked}function showHealthMinion(){return getUIElement("chkHealthMinion").checked}function showHealthBoss(){return getUIElement("chkHealthBoss").checked}function showHealthTower(){return getUIElement("chkHealthTower").checked}function showHealthHero(){return getUIElement("chkHealthHero").checked}function showDamageMinion(){return getUIElement("chkDamageMinion").checked}function showDamageBoss(){return getUIElement("chkDamageBoss").checked}function showDamageTower(){return getUIElement("chkDamageTower").checked}function showDamageHero(){return getUIElement("chkDamageHero").checked}function setShowRangeMinion(e){getUIElement("chkRangeMinion").checked=e}function setShowRangeBoss(e){getUIElement("chkRangeBoss").checked=e}function setShowRangeTower(e){getUIElement("chkRangeTower").checked=e}function setShowRangeHero(e){getUIElement("chkRangeHero").checked=e}function setShowReloadMinion(e){getUIElement("chkReloadMinion").checked=e}function setShowReloadBoss(e){getUIElement("chkRangeBoss").checked=e}function setShowReloadTower(e){getUIElement("chkRangeTower").checked=e}function setShowReloadHero(e){getUIElement("chkRangeHero").checked=e}function setShowHealthMinion(e){getUIElement("chkHealthMinion").checked=e}function setShowHealthBoss(e){getUIElement("chkHealthBoss").checked=e}function setShowHealthTower(e){getUIElement("chkHealthTower").checked=e}function setShowHealthHero(e){getUIElement("chkHealthHero").checked=e}function setShowDamageMinion(e){getUIElement("chkDamageMinion").checked=e}function setShowDamageBoss(e){getUIElement("chkDamageBoss").checked=e}function setShowDamageTower(e){getUIElement("chkDamageTower").checked=e}function setShowDamageHero(e){getUIElement("chkDamageHero").checked=e}function isAutoBuy(e){switch(e){case"t0":return autobuyT0();case"t1":return autobuyT1();case"t2":return autobuyT2();case"t3":return autobuyT3()}return!1}function isAutoPrestige(e){switch(e){case"t0":return autoPrestigeT0();case"t1":return autoPrestigeT1();case"t2":return autoPrestigeT2();case"t3":return autoPrestigeT3()}return!1}function autobuyT0(){return getUIElement("chkAutoBuy0").checked}function autobuyT1(){return getUIElement("chkAutoBuy1").checked}function autobuyT2(){return getUIElement("chkAutoBuy2").checked}function autobuyT3(){return getUIElement("chkAutoBuy3").checked}function setAutobuyT0(e){getUIElement("chkAutoBuy0").checked=e}function setAutobuyT1(e){getUIElement("chkAutoBuy1").checked=e}function setAutobuyT2(e){getUIElement("chkAutoBuy2").checked=e}function setAutobuyT3(e){getUIElement("chkAutoBuy3").checked=e}function autoPrestigeT0(){return getUIElement("chkAutoPrestige0").checked}function autoPrestigeT1(){return getUIElement("chkAutoPrestige1").checked}function autoPrestigeT2(){return getUIElement("chkAutoPrestige2").checked}function autoPrestigeT3(){return getUIElement("chkAutoPrestige3").checked}function setAutoPrestigeT0(e){getUIElement("chkAutoPrestige0").checked=e}function setAutoPrestigeT1(e){getUIElement("chkAutoPrestige1").checked=e}function setAutoPrestigeT2(e){getUIElement("chkAutoPrestige2").checked=e}function setAutoPrestigeT3(e){getUIElement("chkAutoPrestige3").checked=e}function toggleTierAutoPrestige(e,t){switch(e){case"t0":getUIElement("chkAutoPrestige0").checked=t;break;case"t1":getUIElement("chkAutoPrestige1").checked=t;break;case"t2":getUIElement("chkAutoPrestige2").checked=t;break;case"t3":getUIElement("chkAutoPrestige3").checked=t}}function updateRestartLevel(e){setElementTextById("startingLevelSelection",e.value),resetLevel=e.value}function autoSellLimitChanged(){let e=getUIElement("autoSellLimit");autoSellLimit=+e.value,getUIElement("autoSellLimitSelection").textContent=autoSellLimit}function showAutoSellLimit(){toggleUIElementByID("autoSellSelectingChange",!1);let e=getUIElement("autoSellLimit");getUIElement("selectedAutoSell").textContent=e.value,getUIElement("maxAutosell").textContent=maxAutosellLimit}function hideAutoSellTip(){toggleUIElementByID("autoSellSelectingChange",!0)}function autoForgeLimitChanged(){let e=getUIElement("autoForgeLimit");autoForgeLimit=+e.value,getUIElement("autoForgeLimitSelection").textContent=autoForgeLimit}function showAutoForgeLimit(){toggleUIElementByID("autoForgeSelectingChange",!1);let e=getUIElement("autoForgeLimit");getUIElement("selectedAutoForge").textContent=e.value,getUIElement("maxAutoForge").textContent=maxAutoForgeLimit}function hideAutoForgeTip(){toggleUIElementByID("autoForgeSelectingChange",!0)}function onChangeChkAutoForge(){let e=document.getElementById("ddlForgeItems");e.selectedIndex=0,populateForgeAttributes(),populateForgeItems(),e.disabled=getUIElement("chkAutoForge").checked,e.title=getUIElement("chkAutoForge").checked?"Disabled when auto-forge is enabled":""}function showResetSelection(){toggleUIElementByID("resetSelectionChange",!1);let e=getUIElement("startingLevelSelector");getUIElement("selectedRestart").textContent=e.value,getUIElement("maxReset").textContent=maxResetLevel}function hideResetTip(){toggleUIElementByID("resetSelectionChange",!0)}function isAdvancedTactics(){return getUIElement("chkAdvancedTactics").checked}function showFPS(){return getUIElement("chkShowFPS").checked}function isSimpleMinions(){return getUIElement("chkSmipleMinions").checked}function isCompactMinions(){return getUIElement("chkCompactMinions").checked}function GetQuality(){return+getUIElement("ddlQuality").value}function autoSave(){return getUIElement("chkAutoSave").checked}function isColorblind(){return getUIElement("chkColorblind").checked}function getP1Rate(){return+getUIElement("ddlP1Rate").value}function setQuality(){drawMap()}function ShowP1(){getUIElement("ddlP1Rate").selectedIndex=0,setP1Rate()}function toggleMap(){if(getUIElement("chkHideMap").checked){pnl0.classList.add("hide"),pnl1.classList.add("noMap"),pnl1.style.top="5px",getUIElement("resourceBox").style.top="5px";return}pnl1.style.top=gameH+5+"px",getUIElement("resourceBox").style.top=gameH+5+"px",pnl0.classList.remove("hide"),pnl1.classList.remove("noMap")}function yesCookies(){cookiesEnabled=1,toggleUIElementByID("divCookies",!0)}function noCookies(){cookiesEnabled=0,toggleUIElementByID("divCookies",!0)}let resizerDelay;function resize(){clearTimeout(resizerDelay),resizerDelay=setTimeout(calcSize,200)}function calcSize(){let e=Math.max(document.documentElement.clientHeight),t=Math.max(document.documentElement.clientWidth),n=Math.max(200,Math.min(t,2.4*e)-10),o=n,s=n/4,i=s/gameH,l=o/gameW;gameW=o,gameH=s,langoliers=-(gameW>>3),halfH=gameH/2,leaderPoint=gameW/2,pathL=gameW>>6,pathW=gameH>>2;for(let a=0;a<path.length;a++)path[a].x*=l,path[a].y*=i;accents.forEach(e=>{e.loc.x*=l,e.loc.y*=i});for(let r=0;r<minions.length;r++)minions[r].Location.x*=l,minions[r].Location.y*=i;for(let c=0;c<underlings.length;c++)underlings[c].Location.x*=l,underlings[c].Location.y*=i;boss&&(boss.Location.x*=l,boss.Location.y*=i);for(let u=0;u<towers.length;u++)towers[u].Location.x*=l,towers[u].Location.y*=i;hero&&(hero.home.x*=l,hero.home.y*=i,hero.Location.x*=l,hero.Location.y*=i,hero.patrolX*=l),squire&&(squire.home.x*=l,squire.home.y*=i,squire.Location.x*=l,squire.Location.y*=i,squire.patrolX*=l),page&&(page.home.x*=l,page.home.y*=i,page.Location.x*=l,page.Location.y*=i,page.patrolX*=l);for(let g=0;g<projectiles.length;g++)projectiles[g].Location.x*=l,projectiles[g].Location.y*=i,projectiles[g].target.x*=l,projectiles[g].target.y*=i,projectiles[g].Resize();for(let h=0;h<impacts.length;h++)impacts[h].Location.x*=l,impacts[h].Location.y*=i;levelEndX*=l;let d=getUIElement("unitLayer");d.style.width=gameW,d.style.height=gameH,d.width=gameW,d.height=gameH;let m=getUIElement("mapLayer");m.style.width=gameW,m.style.height=gameH,m.width=gameW,m.height=gameH,pnl0.style.height=gameH+"px",pnl1.style.top=gameH+5+"px",pnl1.style.height=e-gameH-15+"px",getUIElement("resourceBox").style.top=gameH+5+"px",drawMap()}const itemType={weapon:{name:"weapon",rangeAdjustment:3,dropWeight:8,stat:statTypes.damage},shield:{name:"shield",rangeAdjustment:2,dropWeight:7,stat:statTypes.health},legs:{name:"legs",rangeAdjustment:1,dropWeight:6,stat:statTypes.spawnDelay},torso:{name:"torso",rangeAdjustment:0,dropWeight:5,stat:statTypes.attackDelay},feet:{name:"feet",rangeAdjustment:-1,dropWeight:4,stat:statTypes.moveSpeed},head:{name:"head",rangeAdjustment:-2,dropWeight:3,stat:statTypes.attackRange},trinket:{name:"trinket",rangeAdjustment:-3,dropWeight:2,stat:statTypes.auraPower},amulet:{name:"amulet",rangeAdjustment:-4,dropWeight:1,stat:statTypes.auraRange}},itemTier={t0:{attrCount:0,score:0},t1:{attrCount:1,score:1},t2:{attrCount:1,score:2},t3:{attrCount:1,score:3},t4:{attrCount:2,score:4},t5:{attrCount:2,score:5},t6:{attrCount:2,score:6},t7:{attrCount:3,score:7}},items={t0:{weapon:{stick:{dropWeight:4,rangeAdjustment:0},club:{dropWeight:1,rangeAdjustment:1}}},t1:{weapon:{staff:{dropWeight:4,rangeAdjustment:0},spear:{dropWeight:1,rangeAdjustment:1}},shield:{aspis:{dropWeight:1,rangeAdjustment:-1}}},t2:{weapon:{dagger:{dropWeight:4,rangeAdjustment:0},claws:{dropWeight:1,rangeAdjustment:1}},shield:{buckler:{dropWeight:2,rangeAdjustment:0}},legs:{breeches:{dropWeight:1,rangeAdjustment:-1}}},t3:{weapon:{axe:{dropWeight:4,rangeAdjustment:0},kama:{dropWeight:1,rangeAdjustment:1}},shield:{targe:{dropWeight:4,rangeAdjustment:0}},legs:{chausses:{dropWeight:2,rangeAdjustment:0}},torso:{vest:{dropWeight:1,rangeAdjustment:-1}}},t4:{weapon:{mace:{dropWeight:4,rangeAdjustment:0},flail:{dropWeight:1,rangeAdjustment:1}},shield:{rondache:{dropWeight:4,rangeAdjustment:0}},legs:{schynbald:{dropWeight:4,rangeAdjustment:0}},torso:{brigandine:{dropWeight:2,rangeAdjustment:0}},feet:{sandals:{dropWeight:1,rangeAdjustment:-1}}},t5:{weapon:{sickle:{dropWeight:4,rangeAdjustment:0},scythe:{dropWeight:1,rangeAdjustment:1}},shield:{kiteShield:{dropWeight:4,rangeAdjustment:0}},legs:{cuisse:{dropWeight:4,rangeAdjustment:0}},torso:{hauberk:{dropWeight:4,rangeAdjustment:0}},feet:{clompers:{dropWeight:2,rangeAdjustment:0}},head:{cap:{dropWeight:1,rangeAdjustment:-1}}},t6:{weapon:{halberd:{dropWeight:4,rangeAdjustment:0},glaive:{dropWeight:2,rangeAdjustment:1}},shield:{aegis:{dropWeight:4,rangeAdjustment:0}},legs:{tassets:{dropWeight:4,rangeAdjustment:0}},torso:{cuirass:{dropWeight:4,rangeAdjustment:0}},feet:{greaves:{dropWeight:4,rangeAdjustment:0}},head:{coif:{dropWeight:2,rangeAdjustment:0}},trinket:{statuette:{dropWeight:1,rangeAdjustment:-1}}},t7:{weapon:{sword:{dropWeight:4,rangeAdjustment:0},greatSword:{dropWeight:1,rangeAdjustment:1}},shield:{towerShield:{dropWeight:4,rangeAdjustment:0}},legs:{plateLeggings:{dropWeight:4,rangeAdjustment:0}},torso:{fullPlate:{dropWeight:4,rangeAdjustment:0}},feet:{sabaton:{dropWeight:4,rangeAdjustment:0}},head:{crown:{dropWeight:4,rangeAdjustment:0}},trinket:{relic:{dropWeight:2,rangeAdjustment:0}},amulet:{pendant:{dropWeight:1,rangeAdjustment:-1}}}};