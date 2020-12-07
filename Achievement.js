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
	switch(tier){
		case 0:
			return getAchievementLevel("prestige0") * 2;
			break;
		case 1:
			return getAchievementLevel("prestige1") * 2;
			break;
		case 2:
			return getAchievementLevel("prestige2") * 2;
			break;
		case 3:
			return getAchievementLevel("prestige3") * 2;
			break;
		case 4:
			return getAchievementLevel("prestige4") * 2;
			break;
		default:
			return 0;
	}
}
function getBossBoost(){
	return 1+(getAchievementLevel("minionsSpawned")/10);
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
	
	const add = achievement.add;
	const mult = achievement.mult;
	if(add == 0 && mult == 1){return -1;}
	
	let temp = achievement.count;
	let count = 0;
	while(temp >= add && temp >= mult){
		temp = (temp - add)/mult;
		count++;
	}
	return count;
}

function getAchievementNext(id){
	const achievement = achievements[id];
	
	const add = achievement.add;
	const mult = achievement.mult;
	if(add == 0 && mult == 1){return -1;}
	const lvl = getAchievementLevel(id)+1;
	
	let next = 1;
	for(let i=0;i<lvl;i++){
		next *= mult;
		next += add;
	}
	return next;
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