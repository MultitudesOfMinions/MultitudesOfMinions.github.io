"use strict";
//https://keycode.info/
//  -left/right arrows = adjust boss aggression
//  -up = max aggression
//  -down = min aggression
//  -space = boss active
//  -/ = toggle advanced minion tactics
//  -1,2,3,4,5,6,7,8,9,0,-,= - menu tab
//  -space - toggle start/stop

//  ALT+m turn all minion spawnpools off
//  m turn all minion spawnpools on

//  b clear baracks
//  z boss active ability

// q,w,e,r,t,y,u,i,o,p,[,] toggle individual minion spawnpool

// toggle Gauge Checkboxes:
//  CTRL+ALT:
//    Grid 1,2,3,4x1,q,a,z


const keysDown = [];
window.onkeydown = function(e) {
  const ae = document.activeElement;
  if(ae.nodeName=="INPUT" && (ae.type=="textarea" || ae.type=="number")){return;}
  
  keysDown[e.key] = true;

  if(e.ctrlKey && e.altKey && e.shiftKey){
    ctrlAltShift(e);
    return;
  }
  if(e.ctrlKey && e.shiftKey){
    ctrlShift(e);
    return;
  }

  noModifiers(e);
  
}

window.onkeyup = function(e) {
  keysDown[e.key] = false;
}

function toggleMinionSpawn(type){
  if(!minionResearch[type].isUnlocked){return;}
  getUIElement("chkSpawn"+type).checked = !getUIElement("chkSpawn"+type).checked;
}


function ctrlAltShift(e){
      switch(e.keyCode){
      //Range
      case 49://1
        document.getElementById("chkRangeMinion").checked = !document.getElementById("chkRangeMinion").checked;
        return;
      case 50://2
        document.getElementById("chkRangeBoss").checked = !document.getElementById("chkRangeBoss").checked;
        return;
      case 51://3
        document.getElementById("chkRangeTower").checked = !document.getElementById("chkRangeTower").checked;
        return;
      case 52://4
        document.getElementById("chkRangeHero").checked = !document.getElementById("chkRangeHero").checked;
        return;
      
      //Reload
      case 81://q
        document.getElementById("chkReloadMinion").checked = !document.getElementById("chkReloadMinion").checked;
        return;
      case 87://w
        document.getElementById("chkReloadBoss").checked = !document.getElementById("chkReloadBoss").checked;
        return;
      case 69://e
        document.getElementById("chkReloadTower").checked = !document.getElementById("chkReloadTower").checked;
        return;
      case 82://r
        document.getElementById("chkReloadHero").checked = !document.getElementById("chkReloadHero").checked;
        return;
      
      //Health
      case 65://a
        document.getElementById("chkHealthMinion").checked = !document.getElementById("chkHealthMinion").checked;
        return;
      case 83://s
        document.getElementById("chkHealthBoss").checked = !document.getElementById("chkHealthBoss").checked;
        return;
      case 68://d
        document.getElementById("chkHealthTower").checked = !document.getElementById("chkHealthTower").checked;
        return;
      case 70://f
        document.getElementById("chkHealthHero").checked = !document.getElementById("chkHealthHero").checked;
        return;
  
      //Damage
      case 90://z
        document.getElementById("chkDamageMinion").checked = !document.getElementById("chkDamageMinion").checked;
        return;
      case 88://x
        document.getElementById("chkDamageBoss").checked = !document.getElementById("chkDamageBoss").checked;
        return;
      case 67://c
        document.getElementById("chkDamageTower").checked = !document.getElementById("chkDamageTower").checked;
        return;
      case 86://v
        document.getElementById("chkDamageHero").checked = !document.getElementById("chkDamageHero").checked;
        return;
    }
}

function ctrlShift(e){
  
}

function noModifiers(e){
  let btnId = null;
  const bossPos = getUIElement("bossPosition");

  switch(e.keyCode){
    case 32://space
      if(mainCycle){ stop(); }
      else{ start(); }
      e.preventDefault();
      break;
      
    case 37://left arrow
      bossPos.value--;
      break;
    case 38://up arrow
      break;
    case 40://down arrow
      break;
    case 39://right arrow
      bossPos.value++;
      break;

    case 90://z
      if(e.ctrlKey){
        getUIElement("chkAutocast").checked = !getUIElement("chkAutocast").checked;
        break;
      }
    
      if(boss && boss.lastActiveAbility == boss.abilityCooldown){
				bossActivateAbility();
			}
      break;
      
    //minion spawn toggle
    case 81://q
      toggleMinionSpawn("Mite");
      break;
    case 87://w
      toggleMinionSpawn("Imp");
      break;
    case 69://e
      toggleMinionSpawn("Bomber");
      break;
    case 82://r
      toggleMinionSpawn("Catapult");
      break;
    case 84://t
      toggleMinionSpawn("Golem");
      break;
    case 89://y
      toggleMinionSpawn("Harpy");
      break;
    case 85://u
      toggleMinionSpawn("Ram");
      break;
    case 73://i
      toggleMinionSpawn("Vampire");
      break;
    case 79://o
      toggleMinionSpawn("Air");
      break;
    case 80://p
      toggleMinionSpawn("Earth");
      break;
    case 219://[
      toggleMinionSpawn("Fire");
      break;
    case 221://]
      toggleMinionSpawn("Water");
      break;

    case 77://m
      const go=!e.altKey;
      const minionTypes = Object.keys(minionResearch);
      for(let i=0;i<minionTypes.length;i++){
        if(!minionResearch[minionTypes[i]].isUnlocked){continue;}
        getUIElement("chkSpawn"+minionTypes[i]).checked = go;
      }
      break;
    case 66://b
        addMinionQ.length = 0;
      break;

    //tabs
    case 192://`
      if(!tierUnlocked(3)){return;}
      btnId = "btnMnuBosses";
      break;
    case 49://1
      btnId = "btnMnuMinions";
      break;
    case 50://2
      btnId = "btnMnuArmory";
      break;
    case 51://3
      if(!tierUnlocked(1)){return;}
      btnId = "btnMnuGym";
      break;
    case 52://4
      if(!tierUnlocked(2)){return;}
      btnId = "btnMnuLab";
      break;
    case 53://5
      if(!tierUnlocked(3)){return;}
      btnId = "btnMnuOffice";
      break;
    case 54://6
      if(!tierUnlocked(4)){return;}
      btnId = "btnMnuForge";
      break;
    case 55://7
      if(!tierUnlocked(5)){return;}
      btnId = "btnMnuStore";
      break;
    case 56://8
      break;
    case 57://9
      btnId = "btnMnuAchievements";
      break;
    case 48://0
      btnId = "btnMnuInfo";
      break;
    case 189://-
      btnId = "btnMnuOptions";
      break;
    case 187://=
      btnId = "btnMnuHelp";
      break;
  }
  
  if(btnId){
    getUIElement(btnId).click();
  }

}