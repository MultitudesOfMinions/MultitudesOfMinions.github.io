"use strict";
//rebuild as:
//tier
	//color
	//attr count
	//scrapValue
	//score
		//adjusted by 'adjustment' on type/item/stat target/stat options
		//adjusted value determines statRange.

//statRange {m,a}
//statTarget {self, minion, all}

//statOption
	//name
		//attribute
		//target [boss,minion,all]
		//rangeType [m|a]
		//adjustment

//type 
	//adjustment
	//stat
	//scrapValue
	//drop weight

//statTarget
	//adjustment
	//dropWeight
	//options
	
//items
	//tier
		//type
			//name
				//adjustment
				//dropWeight
				// [ statOption ]
const attributeTarget={
	self:{
		dropWeight:8,
		adjustment:0
	},
	minion:{
		dropWeight:4,
		options:["Mite","Bomber","Catapult","Golem","Harpy","Ram","Vampire","Air","Earth","Fire","Water"],
		adjustment:-1
	},
	all:{
		dropWeight:1,
		adjustment:-2
	}
}
const rangeTypes= {a:1,m:2}
const attributeRange={
	m:[
		new point(1,1.05),//0
		new point(1.05,1.1),//1
		new point(1.1,1.3),//2
		new point(1.3,1.5),//3
		new point(1.5,1.7),//4
		new point(1.7,2),//5
		new point(2,2.5),//6
		new point(2.5,3),//7
		new point(3.5,4),//8
		new point(4.5,5),//9
		new point(5,6),//10
		new point(6,7),//11
		new point(7,8)//12
	],
	a:[
		new point(1,1),//0
		new point(1,2),//1
		new point(1,3),//2
		new point(1,4),//3
		new point(2,5),//4
		new point(2,6),//5
		new point(2,7),//6
		new point(3,8),//7
		new point(3,10),//8
		new point(4,12),//9
		new point(6,14),//10
		new point(9,16),//11
		new point(12,20),//12
	]
}
const itemType={
	weapon:{
		adjustment:0,
		dropWeight:6,
		scrapValue:1,
		stat:'damage'
	},
	shield:{
		adjustment:4,
		dropWeight:8,
		scrapValue:0,
		stat:'health'
	},
	helm:{
		adjustment:0,
		dropWeight:4,
		scrapValue:2,
		stat:'health'
	},
	boots:{
		adjustment:0,
		dropWeight:4,
		scrapValue:3,
		stat:'moveSpeed'
	},
	trinket:{
		adjustment:-4,
		dropWeight:2,
		scrapValue:4
	},
	ammulet:{
		adjustment:-4,
		dropWeight:1,
		scrapValue:8
	}
}
const itemTier={
	t0:{
		color:"#777",
		attrCount:0,
		scrapValue:1,
		score:0
	},
	t1:{
		color:"#FFF",
		attrCount:0,
		scrapValue:1,
		score:1
	},
	t2:{
		color:"#0FF",
		attrCount:1,
		scrapValue:2,
		score:2
	},
	t3:{
		color:"#F0F",
		attrCount:1,
		scrapValue:3,
		score:3
	},
	t4:{
		color:"#FF0",
		attrCount:2,
		scrapValue:5,
		score:4
	},
	t5:{
		color:"#00F",
		attrCount:2,
		scrapValue:8,
		score:5
	},
	t6:{
		color:"#0F0",
		attrCount:3,
		scrapValue:13,
		score:6
	},
	t7:{
		color:"#F00",
		attrCount:4,
		scrapValue:21,
		score:7
	}
}

function statFactory(statType, range){
	const power = getRandomInt(range.min, range.max+1);
	return new stat(statType, power, range);
}
function stat(attr, type, power, range) {
	this.attr = attr;
	this.type = type || rangeTypes.a;
	this.power = power || 0;
	this.range = range || new point(0,0);
}

function range(type, min, max){
	this.type = type || rangeType.a;
	this.min = min || 0;
	this.max = max || 0;
}

const defaultAttributeOptions = {
	health:{
		attribute:statTypes.health,
		target:attributeTarget.self,
		rangeType:rangeTypes.m,
		adjustment:2
	},
	damage:{
		attribute:statTypes.damage,
		target:attributeTarget.self,
		rangeType:rangeTypes.m,
		adjustment:0
	}
}
function attributeFactory(attributeCount, attributeOptions){
}
function attribute(stat, target){
	this.stat = stat;
	this.target = target;
}

function getItemTier(){
	const x = Math.random();
	const boostLvl = getRarityBoost();
	//any other rarity boostLvl bonuses go here.
	
	const boost = 1;
	if(boostLvl<24){
		boost+=(boostLvl*.2);
		x*=boost;
	}else{
		x*=3.4
		boost=(boostLvl-24)*.1;
		x+= boost;
	}
	
	const multiplicand = .8;
	const t = .8;
	const n = 0;
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
function getItemAttributeRange(tier, type, name, attrAdjustment, rangeType){
	const ranges = attributeRange[rangeType];

	const index = tier;
	index += itemType[type].adjustment || 0;
	index += items["t"+tier][type][name].adjustment || 0;
	index += attrAdjustment || 0;

	const surplus = Math.max(0, index - ranges.length);
	if(surplus > 0){
		index = ranges.length-1;
	}
	
	const range = ranges[index];

	return new range(rangeTypes[rangeType], range.x + surplus, range.y + surplus)
}
function getItemAttributes(tier, type, name, attributeOptions){
	const attributes = [];
	if(itemTier[tier].attrCount == 0){ return attributes; }
	
	if(!isNaN(tier)){tier = "t" + tier;}
	if(attributeOptions == null || attributeOptions.length == 0){
		attributeOptions = defaultAttributeOptions;
	}

	for(let i=0;i<itemTier[tier].attrCount;i++){
		const option = attributeOptions[getRandomInt(0, attributeOptions.length)];
		const range = getItemAttributeRange(tier, type, name, option.adjustment, option.rangeType);
		const stat = statFactory(option.attribute, range);
		
		attributes.push()
	}
	
	return attributes;
}
function getItemScore(tier, stat, attributes){
	const score = (stat.power - stat.range.x + 1) / (stat.range.y - stat.range.x + 1);
	for(let i=0;i<attributes.length;i++){
		score += (attributes[i].power - attributes[i].range.x) / (attributes[i].range.y - attributes[i].range.x)
	}
	score /= attributes.length + 1;
	score *= 100;
	score += 100*tier;
	
	return Math.floor(score-1);
}
function itemFactory(){
	const tier = getItemTier();
	const type = getItemType(tier);
	const name = getItem(tier, type);
	const range = getItemAttributeRange(tier, type, name, 0, rangeTypes.a);
	const stat = statFactory(itemType[type].stat, range);
	const scrapValue = itemType[type].scrapValue + itemTier["t"+tier].scrapValue;
	const attributes = getItemAttributes(tier, type, name);

	const score = getItemScore(tier, stat, attributes);
	
	return new item(name, type, stat, attributes, score, scrapValue);
}
function item(name, type, stat, attributes, score, scrapValue){
	this.name = name;
	this.type = type;
	this.stat = stat;
	this.attributes = attributes;
	this.score = score;
	this.scrapValue = scrapValue;
}

const items = {
	t0:{
		weapon:{
			stick:{
				dropWeight:4
			},
			club:{
				dropWeight:2
			}
		},
		shield:{
			wood:{}
		}
	},
	t1:{
		weapon:{
			staff:{
				dropWeight:4
			},
			spear:{
				dropWeight:2
			}
		},
		shield:{
			targe:{}
		}
	},
	t2:{
		weapon:{
			dagger:{
				dropWeight:4
			},
			claws:{
				dropWeight:2
			}
		},
		shield:{
			buckler:{}
		}
	},
	t3:{
		weapon:{
			axe:{
				dropWeight:4
			},
			kama:{
				dropWeight:2
			}
		},
		shield:{
			rondache:{}
		}
	},
	t4:{
		weapon:{
			mace:{
				dropWeight:4
			},
			flail:{
				dropWeight:2
			}
		},
		shield:{
			kiteShield:{}
		},
		helm:{
			cap:{}
		},
		boots:{
			sandals:{}
		}
	},
	t5:{
		weapon:{
			sickle:{
				dropWeight:4
			},
			scythe:{
				dropWeight:2
			}
		},
		shield:{
			aegis:{}
		},
		helm:{
			hood:{}
		},
		boots:{
			clompers:{}
		}
	},
	t6:{
		weapon:{
			halberd:{
				dropWeight:4
			},
			glaive:{
				dropWeight:2
			}
		},
		shield:{
			towerShield:{}
		},
		helm:{
			coif:{}
		},
		boots:{
			greaves:{}
		}
	},
	t7:{
		weapon:{
			sword:{
				dropWeight:4
			},
			greatSword:{
				dropWeight:2
			}
		},
		shield:{
			ascended:{}
		},
		helm:{
			crown:{}
		},
		boots:{
			sabaton:{}
		}
	}
}