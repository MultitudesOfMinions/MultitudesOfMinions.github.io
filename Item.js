"use strict";


function getItemTier(heroLvl){
	let x = Math.random();
	const boostLvl = getRarityBoost() + (heroLvl >> 2);
	//any other rarity boostLvl bonuses go here.
	
	let boost = 1;
	if(boostLvl<24){
		boost+=(boostLvl*.2);
		x*=boost;
	}else{
		x*=3.4
		boost=(boostLvl-24)*.1;
		x+= boost;
	}
	
	const multiplicand = .8;
	let t = multiplicand;
	let n = 0;
	while(x > t){
		n++;
		t += multiplicand**n;
	}
	return n;
}
function getItemType(tier){
	const weightedItemList = [];
	if(!isNaN(tier)){tier = "t" + tier;}
	
	for(let type in items[tier]){
		const dropWeight = itemType[type].dropWeight || 1;
		for(let i=0;i<dropWeight;i++){
			weightedItemList.push(type);
		}
	}
	const index = getRandomInt(0, weightedItemList.length);

	return weightedItemList[index];
}
function getItem(tier, type){
	const weightedItemList = [];
	
	if(!isNaN(tier)){tier = "t" + tier;}
	
	for(let item in items[tier][type]){
		const dropWeight = items[tier][type].dropWeight || 1;
		for(let i=0;i<dropWeight;i++){
			weightedItemList.push(item);
		}
	}
	const index = getRandomInt(0, weightedItemList.length)

	return weightedItemList[index];
}

function itemFactory(lvl){
	const tier = getItemTier();
	const type = getItemType(tier);
	const name = getItem(tier, type);
	const stat = statFactory(tier, type, name);
	const attributes = attributeFactory(tier, type, name);

	const newItem =  new Item(tier, name, type, stat, attributes);
	return newItem;
}
function Item(tier, name, type, stat, attributes){
  this.tier = tier;
	this.name = name;
	this.type = type;
	this.stat = stat;
	this.attributes = attributes;
	this.scrapValue = (this.score()>>7)+1;
}
Item.prototype.score = function(){

	let score = this.stat.score();
	for(let i=0;i<this.attributes.length;i++){
		score += this.attributes[i].score();
	}
	score /= this.attributes.length + 1;
	score *= 100;
	score += 100*this.tier;

	return Math.floor(score-1);
}
