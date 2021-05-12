"use strict";
//		Total Towers killed: resource.b++
//		Total Heroes killed: resources.c++
//		Total Items Scrapped: resources.d++
//		Best item rarity obtained:resources.e++
//		Total Regroups: cost resource.a--
//		Total Evolves: cost resources.b--
//		Total Recruit: cost resource.c--
//		Total Expand: cost resource.d--

//		Total Minons Spawned: Boss boost
//		Max Hero Level killed: Equip rarity drop boost

//0 mite/armory
//1 minions/gym
//2 elements/lab
//3 bosses/office
//4 equipment/forge

function getPrestigeBonus(tier){
	switch(tier){
		case 0:
			return getAchievementLevel("towersDestroyed");
			break;
		case 1:
			return getAchievementLevel("heroesKilled");
			break;
		case 2:
			return getAchievementLevel("itemScrapped");
			break;
		case 3:
			return getAchievementLevel("itemRarity");
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
  let discount = getAchievementLevel(name) * 2;
  discount += equippedEffect.a;
  discount *= equippedEffect.m;
  
  return discount;
}
function getBossBoost(stat){
  let boost = getAchievementLevel("minionsSpawned");
	if(backwardsStats.includes(stat))
	{
		boost = 1/(boost**.25);
		boost = Math.floor(boost*100)/100;
	}
	else{
	  boost = 1+(boost/10);
	}
	return boost;
}
function getRarityBoost(){
	return getAchievementLevel("maxLevelCleared");
}
function getRarityBoostAdd(){
	const lvl = getAchievementLevel("maxLevelCleared");
	
	if(lvl<10){
		return 0;
	}
	return (lvl-10)*.1;
}

function getAchievementLevel(id){
	const achievement = achievements[id];
	if(achievement == null){return 0;}
	
	const add = achievement.add;
	const mult = achievement.mult;
	if(add <= 0 && mult <= 1){return -1;}
	
	let count = 0;
	let target = achievement.first;
	
	while(target <= achievement.count){
	  target=(target+add)*mult;
	  count++;
	}

	return count;
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
	  //store is unlocked
	  return false;
	}
	return false;
}