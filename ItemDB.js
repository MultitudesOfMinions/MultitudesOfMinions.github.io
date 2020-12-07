"use strict";

//item name ideas:
  //http://www.medievalwarfare.info/armour.htm
  //http://www.medievalwarfare.info/weapons.htm
  //https://imgur.com/gallery/jMzzk/

//tier
	//color
	//attr count
	//score
		//adjusted by 'rangeAdjustment' on type/item/stat target/stat options
		//adjusted value determines statRange.

//statRange {m,a}
//statTarget {self, minion, all}

//statOption
	//name
		//attribute
		//target [boss,minion,all]
		//rangeType [m|a]
		//rangeAdjustment

//type
	//rangeAdjustment
	//stat
	//drop weight

//statTarget
	//rangeAdjustment
	//dropWeight
	//options
	
//items
	//tier
		//type
			//name
				//rangeAdjustment
				//dropWeight
				// [ statOption ]

const attributeTarget={
	self:{
	  options:[],
		rangeAdjustment:0
	},
	minion:{
		options:["Mite","Bomber","Catapult","Golem","Harpy","Ram","Vampire","Air","Earth","Fire","Water"],
		rangeAdjustment:-1
	},
	all:{
	  options:[],
		rangeAdjustment:-2
	}
}
const rangeTypes= {a:"a",m:"m"};
const statRange={
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
		new point(0,1),//0
		new point(1,2),//1
		new point(2,3),//2
		new point(3,4),//3
		new point(4,6),//4
		new point(6,8),//5
		new point(8,10),//6
		new point(10,12),//7
		new point(12,15),//8
		new point(15,18),//9
		new point(18,21),//10
		new point(21,24),//11
		new point(24,30),//12
	]
}
const itemType={
	weapon:{
		rangeAdjustment:3,
		dropWeight:8,
		stat:statTypes.damage
	},
	shield:{
		rangeAdjustment:2,
		dropWeight:7,
		stat:statTypes.health
	},
	legs:{
		rangeAdjustment:1,
		dropWeight:6,
		stat:statTypes.spawnDelay
	},
	torso:{
		rangeAdjustment:0,
		dropWeight:5,
		stat:statTypes.attackRate
	},
	feet:{
		rangeAdjustment:-1,
		dropWeight:4,
		stat:statTypes.moveSpeed
	},
	head:{
		rangeAdjustment:-2,
		dropWeight:3,
		stat:statTypes.attackRange
	},
	trinket:{
		rangeAdjustment:-3,
		dropWeight:2,
		stat:statTypes.auraPower
	},
	ammulet:{
		rangeAdjustment:-4,
		dropWeight:1,
		stat:statTypes.auraRange
	}
}
const itemTier={
	t0:{
		color:"#777",
		attrCount:0,
		score:0
	},
	t1:{
		color:"#FFF",
		attrCount:0,
		score:1
	},
	t2:{
		color:"#0FF",
		attrCount:1,
		score:2
	},
	t3:{
		color:"#F0F",
		attrCount:1,
		score:3
	},
	t4:{
		color:"#FF0",
		attrCount:2,
		score:4
	},
	t5:{
		color:"#00F",
		attrCount:2,
		score:5
	},
	t6:{
		color:"#0F0",
		attrCount:3,
		score:6
	},
	t7:{
		color:"#F00",
		attrCount:4,
		score:7
	}
}
const attributeOptions={
  bonusStat0:{
    dropWeight:16,
    itemTypes:[itemType.shield, itemType.torso, itemType.head, itemType.feet],
    options:[statTypes.health],
    target:[attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bonusStat1:{
    dropWeight:16,
    itemTypes:[itemType.weapon],
    options:[statTypes.damage],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  
  bonusStat2:{
    dropWeight:16,
    itemTypes:[itemType.shield, itemType.torso, itemType.head, itemType.feet],
    options:[statTypes.health],
    target:attributeTarget.minion,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bonusStat3:{
    dropWeight:16,
    itemTypes:[itemType.weapon],
    options:[statTypes.damage],
    target:attributeTarget.minion,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },


  miscUpgradeBoost:{
    dropWeight:8,
    itemTypes:[itemType.trinket, itemType.ammulet],
    options:[tierMisc.t1.miscUpgrades.maxMinions_1,
            tierMisc.t2.miscUpgrades.upgradeLimit_2,
            tierMisc.t3.miscUpgrades.reduceDeployTime_3],
    target:null,
    rangeAdjustment:0,
    rangeType:rangeTypes.a,
  },
  resource0:{
    dropWeight:16,
    options:["gain", "discount"],
    target:null,
    rangeAdjustment:0,
    rangeTypes:rangeTypes.a,
    itemTypes:[itemType.weapon, itemType.shield, itemType.head]
  },
  resource1:{
    dropWeight:4,
    options:["gain", "discount"],
    target:null,
    rangeAdjustment:-4,
    rangeTypes:rangeTypes.m,
    itemTypes:[itemType.ammulet, itemType.trinket]
  }
  
}

function range(type, min, max){
	this.type = type || rangeType.a;
	this.min = min || 0;
	this.max = max || 0;
	this.delta = this.max - this.min + 1;
}
range.prototype.score = function (power){
  return (power - this.min + 1) / this.delta
}

function statFactory(tier, type, name){
	const rangeIndex = getItemStatRangeIndex(tier, type, name);
	return new stat(itemType[type].stat, rangeIndex);
}
function stat(attr, rangeIndex) {
	const range = statRange[rangeTypes.a][rangeIndex||0];

	this.attr = attr;
	this.power = range.min || 0;
	this.range = rangeIndex || 0;
}
stat.prototype.score = function(){
  return statRange[rangeTypes.a][rangeIndex||0].score(this.power);
}

function getAttributeOptions(type){
  options = [];
  for(let option in attributeOptions){
    if(!attributeOptions[option].types.includes(type)){continue;}
    
    for(let i=0;i<option.dropWeight;i++){
      options.push(option)
    }
  }
  
	if(attributeOptions == null || attributeOptions.length == 0){return null;}
	
  const optionName = options[getRandomInt(0, options.lenght-1)];
  const option = attributeOptions[optionName];
}
function attributeFactory(tier, type, name, attributeCount){
  //get attributeOptions based on type
  const option = getAttributeOptions(type);
	const rangeIndex = getItemAttrRangeIndex(tier, type, name, option.rangeAdjustment);

  
}
function attribute(effect, target, power){
	this.effect = effect;
	this.target = target;
	this.rangeIndex = rangeIndex;
	this.rangeType = rangeType;
	this.power = power;
}
attribute.prototype.score = function(){
  return statRange[this.rangeType][rangeIndex||0].score(this.power);
}

function getItemTier(){
	let x = Math.random();
	const boostLvl = getRarityBoost();
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

function getItemStatRangeIndex(tier, type, name){
	let index = tier;
	index += itemType[type].rangeAdjustment || 0;
	index += items["t"+tier][type][name].rangeAdjustment || 0;
	return Math.max(index,0);
}
function getItemStatRange(index){
	const ranges = statRange[rangeType.a];
	const surplus = Math.max(0, index - ranges.length);
	if(surplus > 0){
		index = ranges.length-1;
	}
	
	const newRange = ranges[index];

	return new range(rangeTypes[rangeType], newRange.x + surplus, newRange.y + surplus)
  
}

function getItemAttrRangeIndex(tier, type, name, rangeAdjustment){

	let index = tier;
	index += itemType[type].rangeAdjustment || 0;
	index += items["t"+tier][type][name].rangeAdjustment || 0;
	index -= 2;
	index += rangeAdjustment || 0;
	return Math.max(index,0);
}
function getItemAttrRange(rangeType, index){
  	const ranges = statRange[rangeType];
	const surplus = Math.max(0, index - ranges.length);
	if(surplus > 0){
		index = ranges.length-1;
	}
	
	const newRange = ranges[index];

	return new range(rangeTypes[rangeType], newRange.x + surplus, newRange.y + surplus)

}

function buildItemAttributes(tier, type, name){
  return [];
	const attributes = [];
	const tierName = "t" + tier;

	if(itemTier[tierName].attrCount == 0){ return attributes; }
	
	if(attributeOptions == null || attributeOptions.length == 0){
		attributeOptions = defaultAttributeOptions;
	}

	for(let i=0;i<itemTier[tierName].attrCount;i++){
    const options = pickAKey(attributeOptions);
		const range = getItemstatRange(tier, type, name, option.rangeAdjustment, option.rangeType);
		const stat = statFactory(option.attribute, range);
		
		attributes.push()
	}
	
	return attributes;
}
function getItemScore(tier, stat, attributes){
	let score = stat.score;
	for(let i=0;i<attributes.length;i++){
		score += attributes[i].score;
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
	const stat = statFactory(tier, type, name);
	const attributes = buildItemAttributes(tier, type, name);

	const score = getItemScore(tier, stat, attributes);

	const newItem =  new Item(name, type, stat, attributes, score);
	console.log(newItem);
	return newItem;
}
function Item(tier, name, type, stat, attributes, score){
	this.name = name;
	this.type = type;
	this.stat = stat;
	this.attributes = attributes;
	this.score = score;
	this.scrapValue = (score>>7)+1;
}
Item.prototype.score(){
	let score = stat.score;
	for(let i=0;i<attributes.length;i++){
		score += attributes[i].score;
	}
	score /= attributes.length + 1;
	score *= 100;
	score += 100*tier;
	
	return Math.floor(score-1);

  
}

const items = {
	t0:{//weapon
		weapon:{
			stick:{
				dropWeight:4
			},
			club:{
				dropWeight:2
			}
		}
	},
	t1:{//shield
		weapon:{
			staff:{
				dropWeight:4
			},
			spear:{
				dropWeight:2
			}
		},
		shield:{
			aspis:{}
		}
	},
	t2:{//legs
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
		},
		legs:{
		  breeches:{}
		}
	},
	t3:{//torso
		weapon:{
			axe:{
				dropWeight:4
			},
			kama:{
				dropWeight:2
			}
		},
		shield:{
			targe:{}
		},
		legs:{
		  chausses:{}
		},
		torso:{
		  vest:{}
		}
	},
	t4:{//feet
		weapon:{
			mace:{
				dropWeight:4
			},
			flail:{
				dropWeight:2
			}
		},
		shield:{
			rondache:{}
		},
		legs:{
		  schynbald:{}
		},
		torso:{
		  brigandine:{}
		},
		feet:{
			sandals:{}
		}
	},
	t5:{//head
		weapon:{
			sickle:{
				dropWeight:4
			},
			scythe:{
				dropWeight:2
			}
		},
		shield:{
			kiteShield:{}
		},
		legs:{
		  cuisse:{}
		},
		torso:{
		  hauberk:{}
		},
		feet:{
			clompers:{}
		},
		head:{
			cap:{}
		}
	},
	t6:{//trink
		weapon:{
			halberd:{
				dropWeight:4
			},
			glaive:{
				dropWeight:2
			}
		},
		shield:{
			aegis:{}
		},
		legs:{
		  tassets:{}
		},
		torso:{
		  cuirass:{}
		},
		feet:{
			greaves:{}
		},
		head:{
			coif:{}
		},
		trinket:{
		  statuette:{}
		}
	},
	t7:{//ammy
		weapon:{
			sword:{
				dropWeight:4
			},
			greatSword:{
				dropWeight:2
			}
		},
		shield:{
			towerShield:{}
		},
		legs:{
		  plate leggings:{}
		},
		torso:{
		  full plate:{}
		},
		feet:{
			sabaton:{}
		},
		head:{
			crown:{}
		},
		trinket:{
		  relic:{}
		},
		ammulet:{
		  pendant:{}
		}
	}
}