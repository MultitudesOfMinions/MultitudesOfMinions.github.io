"use strict";

function getItemTierChances(heroLvl){
	const x = Math.max(0, getRarityBoost()+(heroLvl >> 2))-2;
	const output = [];
	
	const min = Math.max(0, x*.1);
	const max = (x*.25)+2;
	
	const range = max - min;
	
	let last=min;
	let sum=0;
	while(last < max){
		const a = last;
		let b = Math.ceil(last);
		b = b==a?a+1:b;
		b=Math.min(b, max);
		
		const d = b-a;
		const p = d/range;
		sum += p;
		output.push({tier:Math.floor(a), pct:p, sum:sum});
		last = b;
	}
	//make sure last one is 1 regardless of rounding issues
	output[output.length-1].sum=1;
	
	return output;
}

function getItemTier(heroLvl){
	const rng = Math.random();
	const dropRate = getItemTierChances(heroLvl);
	const t = dropRate.find(x => x.sum > rng);
	
	return t.tier;
}
function getItemType(tier){
	const weightedItemList = [];
	if(!isNaN(tier)){tier = "t" + Math.min(7,tier);}
	
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
	
	if(!isNaN(tier)){tier = "t" + Math.min(tier,7);}
	
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
	const tier = getItemTier(lvl);
	const type = getItemType(tier);
	const name = getItem(tier, type);
	const attributes = buildItemAttributes(tier, type);
	const isLocked = false;
	
	return new Item(tier, type, name, attributes);
}
function Item(tier, type, name, attributes){
	this.tier = tier;
	this.name = name;
	this.type = type;
	this.stat = statFactory(tier, type, name);
	this.attributes = attributes;
	this.scrapValue = (this.score()>>7)+1;
	this.id = generateItemUid(type.charAt(0));
}
Item.prototype.score = function(){
	
	let  score = this.stat.score();
	for(let i=0;i<this.attributes.length;i++){
		const attrMax = Math.max(0, this.maxAttrIndex() + this.attributes[i].indexAdjustment);
		const a = this.attributes[i].range.index * 100 / (attrMax+1);
		const b = this.attributes[i].score() / (attrMax+1);
		
		score += a + b;
	}
	score /= this.attributes.length+1;
	
	score += this.tier * 100;
	
	return Math.max(1,Math.floor(score));
}
Item.prototype.toString = function(){
	
	let output = this.type+" : "+this.name+" ("+this.score()+")";
	output += (this.isLocked?"*":" ");
	output = (this.isEquipped()?"[E] ":"")+output;
	return output;
}

function loadItem(i){
	
    const attr = [];
    for(let j=0;j<i.a.length;j++){
		const r = new Range(i.a[j].r, i.a[j].i)
		const newAttr = new Attribute(i.a[j].e, i.a[j].t, r);
		newAttr.power =  i.a[j].p;
		newAttr.indexAdjustment = i.a[j].a||0;
		
		attr.push(newAttr);
	}
    
    const newItem = new Item(i.r, i.t, i.n, attr);
    newItem.stat.power = i.p;
    newItem.isLocked = !!i.l;
	
    inventory.push(newItem);
    if(i.e){
		equip(newItem.id);
	}
	
}

function generateItemUid(c){
	const a = "I_" + (new Date()%10000) + c;
	let b = 0;
	
	let matches = inventory.filter(x => x.id == (a+b));
	
	while(matches.length){
		b++;
		matches = inventory.filter(x => x.id === (a+b));
	}
	return a+b;
}

Item.prototype.isEquipped = function(){
	if(equipped[this.type] == null){return false;}
	return equipped[this.type].id === this.id;
}

Item.prototype.sellValue = function(){
	const ee = getEquippedEffect("e", "gain");
	let value = (this.score()>>7)**2;
	value += getAchievementBonus("itemScrapped");
	value += ee.a;
	value *= ee.m;
	return value;
}

Item.prototype.maxAttrIndex = function(){
	return this.tier+5;
}
Item.prototype.canPrestige = function(){
	if(this.stat.power < this.stat.range.max){return false;}
	for(const attr of this.attributes){
		const attrMax = this.maxAttrIndex()+attr.indexAdjustment;
		if(attr.range.index < attrMax){return false;}
		if(attr.power < attr.range.max){return false;}
	}
	return true;
}
Item.prototype.prestigeCost = function(){
	const discount = getDiscount(5);
	return Math.max(1,((this.tier+1)<<1)-discount);
}
function getRerollAttrCost(maxAttrIndex){
	const discount = getDiscount(4);
	return Math.floor(Math.max(1,(maxAttrIndex*1.5)-discount));
}
Item.prototype.rerollAttrCost = function(){
	return getRerollAttrCost(this.maxAttrIndex());
}

Item.prototype.updateSellValue = function(){
	const string = "Sell:"+this.sellValue()+resources.e.symbol;
	const btn = document.getElementById("btnSell"+this.id);
	
	if(btn){//if boss tab hasn't been visited yet the sell button doesn't exist
		setElementText(btn, string);
	}
}


const itemColorClass =function(score){
	if(score < 100){
		return "itemT0";
	}
	if(score < 200){
		return "itemT1";
	}
	if(score < 300){
		return "itemT2";
	}
	if(score < 400){
		return "itemT3";
	}
	if(score < 500){
		return "itemT4";
	}
	if(score < 600){
		return "itemT5";
	}
	if(score < 700){
		return "itemT6";
	}
	if(score < 800){
		return "itemT7";
	}
	if(score < 900){
		return "itemT8";
	}
	if(score < 1000){
		return "itemT9";
	}
	if(score < 1100){
		return "itemT10";
	}
	return "itemT11";
}
Item.prototype.buildHtml = function(parent, prefix){
	const title = createNewElement("div", prefix+"_ItemTitle"+this.id, parent, ["itemTitle"], null);
	const score = this.score();
	const colorStyle = itemColorClass(score);
	createNewElement("div", prefix+"_ItemName"+this.id, title, ["itemName"], this.name.fixString());
	createNewElement("div", prefix+"_ItemType"+this.id, title, ["itemType", colorStyle], this.type.fixString());
	createNewElement("div", prefix+"_ItemScore"+this.id, title, ["itemScore"], score);
	
	createNewElement("span", prefix+"_stat"+this.id, parent, ["itemStat"], this.stat.toString());
	
	const list = createNewElement("ul", prefix+"_ulItem"+this.id, parent, ["itemAttributeList"], null);
	for(let j=0;j<this.attributes.length;j++){
		createNewElement("li", prefix+"_attr"+this.id+"_"+j, list, ["itemAttributes"], this.attributes[j].toString());
	}
}
Item.prototype.updateHtml = function(prefix){
	const checkDiv = document.getElementById("divItem"+this.id);
	if(checkDiv==null){return;}//boss tab hasn't been visited yet; div doesn't exist yet.
	
	setElementTextById(prefix+"_ItemName"+this.id, this.name.fixString());
	setElementTextById(prefix+"_ItemType"+this.id, this.type.fixString());
	setElementTextById(prefix+"_ItemScore"+this.id, this.score());
	
	setElementTextById(prefix+"_stat"+this.id, this.stat.toString());
	
	for(let j=0;j<this.attributes.length;j++){
		setElementTextById(prefix+"_attr"+this.id+"_"+j, this.attributes[j].toString());
	}
}



Item.prototype.buildSave = function(){
	const output = {}
	output.e=this.isEquipped()?1:0;
	
	output.r=this.tier;
	output.t=this.type;
	output.n=this.name;
	
	output.p=this.stat.power;
	output.i=this.stat.range.index;
	
	output.l=this.isLocked;
	
	output.a=[]
	for(let i=0;i<this.attributes.length;i++){
		output.a.push(this.attributes[i].buildSave());
	}
	return output;
}
