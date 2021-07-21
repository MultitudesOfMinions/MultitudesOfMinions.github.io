"use strict";

function getPrestigeBonus(tier){
	switch(tier){
		case 0:
			return getAchievementBonus("towersDestroyed");
			break;
		case 1:
			return getAchievementBonus("heroesKilled");
			break;
		case 2:
			return getAchievementBonus("bossesSummoned");
			break;
		case 3:
			return getAchievementBonus("itemScrapped");
			break;
		default:
			console.warn(tier);
			return 0;
	}
}
function getDiscount(tier){
  const a = Object.keys(resources)[tier];
  const equippedEffect = getEquippedEffect(a, "discount");

  const name = "prestige"+tier;
  const b = getAchievementBonus(name);
  let discount = (b**1.4)+b;
  discount += equippedEffect.a;
  discount *= equippedEffect.m;
  
  return Math.floor(discount);
}
function getBossBoost(){
  const boost = getAchievementBonus("minionsSpawned")/10;
	return 1+boost;
}
function getRarityBoost(){
	return getAchievementBonus("maxLevelCleared");
}

function getAchievementLevel(id){
	const achievement = achievements[id];
	if(achievement == null){return 0;}
	
	const add = achievement.add;
	const mult = achievement.mult;
	if(add <= 0 && mult <= 1){return -1;}
	
	let level = 0;
	let target = achievement.first;
	
	while(target <= achievement.count){
	  target=(target+add)*mult;
	  level++;
	}
	
	return level;
}

function getAchievementBonuses(){
  const output = {};
  for(let i=0;i<4;i++){
   output[i] = getAchievementBonus("prestige"+i);
  }
  return output;
}

function getAchievementBonus(id){
	const achievement = achievements[id];
	if(achievement == null){return 0;}

  const level = getAchievementLevel(id);
  if(level == 0){return 0;}

	const maxBonus = achievement.maxCount*3;

  return level + maxBonus;
}

function getAchievementNext(id){
	const achievement = achievements[id];
	if(achievement == null){return 0;}
	
	const add = achievement.add;
	const mult = achievement.mult;
	if(add <= 0 && mult <= 1){return -1;}
	
	let target = achievement.first;
	
	while(target <= achievement.count){
	  target=(target+add)*mult;
	}

	return target;
}

function getAchievementLast(id){
	const achievement = achievements[id];
	if(achievement == null){return 0;}
	
	const level=getAchievementLevel(id);
	if(level==0 && achievement.maxCount==0){return 0;}
	
	const add = achievement.add;
	const mult = achievement.mult;
	if(add <= 0 && mult <= 1){return -1;}
	
	let target = achievement.first;
	
	while(target <= achievement.count){
	  target=(target+add)*mult;
	}

	return (target/mult)-add;
}


function tierUnlocked(tier){
	if(tier == 0){
		return true;
	}
	if(tier == 1){
		return achievements.prestige0.count > 0 || tierUnlocked(2);
	}
	if(tier == 2){
		return achievements.prestige1.count > 0 || tierUnlocked(3);
	}
	if(tier == 3){
		return achievements.prestige2.count > 0 || tierUnlocked(4);
	}
	if(tier == 4){
		return achievements.prestige3.count > 0 || tierUnlocked(5);
	}
	if(tier == 5){
	  return achievements.itemPrestiged.count > 0 || resources.f.amt > 0;
	}
	return false;
}

function getAchievementScore(){
  let total = 0;
  
	for(let id in achievements){
	  const a = achievements[id];
	  const level = getAchievementLevel(id);
	  const maxCount = a.maxCount;
	  const maxLevel = a.maxLevel;
	  
	  const min = getAchievementLast(id);
	  const max = getAchievementNext(id);
	  
	  const pct = (a.count-min)*100/(max-min);
	  
	  let score = level + (maxCount * maxLevel);
	  score *= 100;
	  score += pct;
	  
	  total += score;
	}
	
	return Math.floor(total*100)/100;
}