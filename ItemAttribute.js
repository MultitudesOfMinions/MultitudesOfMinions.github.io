"use strict";

const attributeTarget={
	self:{
	  options:["Boss"],
		rangeAdjustment:0
	},
	minion:{
		options:["Mite","Bomber","Catapult","Golem","Harpy","Ram","Vampire","Air","Earth","Fire","Water"],
		rangeAdjustment:-1
	},
	invaders:{
	  options:["Invaders"],
		rangeAdjustment:-2
	},
	defenders:{
	  options:["Defenders"],
		rangeAdjustment:-2
	},
	currency:{
	  options:["a", "b", "c", "d", "e", "f"],
	  rangeAdjustment:0
	},
	allCurrency:{
	  options:["All"],
	  rangeAdjustment:-2
	}
}

const defaultAttributeOptions = {
  option0:{
    effectTypes:[statTypes.health],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  }
}

const attributeTypes={
  bossStat0:{
    dropWeight:16,
    itemTypes:[itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name],
    effectTypes:[statTypes.health],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bossStat1:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name],
    effectTypes:[statTypes.damage],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bossStat2:{
    dropWeight:8,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name],
    effectTypes:[statTypes.attackRate, statTypes.spawnDelay],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bossStat3:{
    dropWeight:4,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name],
    effectTypes:[statTypes.health, statTypes.damage],
    target:attributeTarget.self,
    rangeAdjustment:-1,
    rangeType:rangeTypes.m
  },
  bossStat4:{
    dropWeight:1,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name],
    effectTypes:[statTypes.attackRange, statTypes.attackRate, statTypes.spawnDelay],
    target:attributeTarget.self,
    rangeAdjustment:-2,
    rangeType:rangeTypes.m
  },
  bossStat5:{
    dropWeight:8,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.shield.name, itemType.head.name],
    effectTypes:[statTypes.auraRange, statTypes.auraPower],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  
  minionStat0:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.legs.name],
    effectTypes:[statTypes.health, statTypes.health],
    target:attributeTarget.minion,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  minionStat1:{
    dropWeight:8,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.legs.name],
    effectTypes:[statTypes.moveSpeed, statTypes.attackRange, statTypes.attackRate, statTypes.spawnDelay],
    target:attributeTarget.minion,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  minionStat2:{
    dropWeight:4,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.legs.name],
    effectTypes:[statTypes.health, statTypes.health],
    target:attributeTarget.minion,
    rangeAdjustment:-2,
    rangeType:rangeTypes.m
  },
  minionStat3:{
    dropWeight:2,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.legs.name],
    effectTypes:[statTypes.attackRate, statTypes.spawnDelay],
    target:attributeTarget.minion,
    rangeAdjustment:-2,
    rangeType:rangeTypes.m
  },
  minionStat4:{
    dropWeight:1,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.legs.name],
    effectTypes:[statTypes.minionsPerDeploy],
    target:attributeTarget.minion,
    rangeAdjustment:-32,
    rangeType:rangeTypes.a
  },
  
  allStat0:{
    dropWeight:2,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.shield.name, itemType.head.name],
    effectTypes:[statTypes.health, statTypes.damage],
    target:attributeTarget.invaders,
    rangeAdjustment:-1,
    rangeType:rangeTypes.a
  },
  allStat1:{
    dropWeight:2,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.shield.name, itemType.head.name],
    effectTypes:[statTypes.attackRange, statTypes.attackRate, statTypes.spawnDelay],
    target:attributeTarget.invaders,
    rangeAdjustment:-4,
    rangeType:rangeTypes.m
  },
  allStat2:{
    dropWeight:2,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.shield.name, itemType.head.name],
    effectTypes:[statTypes.health, statTypes.damage],
    target:attributeTarget.invaders,
    rangeAdjustment:-4,
    rangeType:rangeTypes.m
  },

  resource0:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.head.name],
    effectTypes:["discount"],
    target:attributeTarget.currency,
    rangeAdjustment:1,
    rangeType:rangeTypes.a
  },
  resource1:{
    dropWeight:4,
    itemTypes:[itemType.amulet.name, itemType.trinket.name],
    effectTypes:["discount"],
    target:attributeTarget.currency,
    rangeAdjustment:-4,
    rangeType:rangeTypes.m
  },
  resource2:{
    dropWeight:4,
    itemTypes:[itemType.amulet.name, itemType.trinket.name],
    effectTypes:["discount"],
    target:attributeTarget.allCurrency,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  resource3:{
    dropWeight:4,
    itemTypes:[itemType.amulet.name, itemType.trinket.name],
    effectTypes:["discount"],
    target:attributeTarget.allCurrency,
    rangeAdjustment:-8,
    rangeType:rangeTypes.m
  },
    resource4:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.head.name],
    effectTypes:["gain"],
    target:attributeTarget.currency,
    rangeAdjustment:5,
    rangeType:rangeTypes.a
  },
  resource5:{
    dropWeight:4,
    itemTypes:[itemType.amulet.name, itemType.trinket.name],
    effectTypes:["gain"],
    target:attributeTarget.currency,
    rangeAdjustment:0,
    rangeType:rangeTypes.m
  },
  resource6:{
    dropWeight:4,
    itemTypes:[itemType.amulet.name, itemType.trinket.name],
    effectTypes:["gain"],
    target:attributeTarget.allCurrency,
    rangeAdjustment:4,
    rangeType:rangeTypes.a
  },
  resource7:{
    dropWeight:4,
    itemTypes:[itemType.amulet.name, itemType.trinket.name],
    effectTypes:["gain"],
    target:attributeTarget.allCurrency,
    rangeAdjustment:-4,
    rangeType:rangeTypes.m
  },

  
    
  miscUpgradeBoost:{
    dropWeight:8,
    itemTypes:[itemType.trinket.name, itemType.amulet.name],
    effectTypes:[tierMisc.t1.miscUpgrades.maxMinions_1,
            tierMisc.t2.miscUpgrades.upgradeLimit_2,
            tierMisc.t3.miscUpgrades.reduceDeployTime_3,
            tierMisc.t4.miscUpgrades.unknown_4],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  }
}


function buildItemAttributes(tier, type){
	const attributes = [];
	const tierName = "t" + Math.min(tier,7);
	const attrCount = itemTier[tierName].attrCount;

	if(attrCount == 0){ return attributes; }
	
	for(let i=0;i<attrCount;i++){
    attributes.push(attributeFactory(tier, type));
	}
	
	return attributes;
}
function attributeFactory(tier, type){
	let weightedOptions = getWeightedAttributeTypes(type);

	if(weightedOptions == null || weightedOptions.length == 0){
		weightedOptions = defaultAttributeOptions;
	}
  const attr = attributeTypes[pickAKey(weightedOptions)];
  const effect = pickOne(attr.effectTypes);
  const target = attr.target;

  const rangeAdjustment = attr.rangeAdjustment + target.rangeAdjustment + itemType[type].rangeAdjustment;
	const rangeIndex = getItemAttrRangeIndex(tier, type, rangeAdjustment);
  const range = new Range(attr.rangeType, rangeIndex);

  const t = pickOne(target.options);

  const A = new Attribute(effect, t, range, rangeAdjustment);

  return A;
}
function Attribute(effect, target, range, rangeAdjustment){
	this.effect = effect;
	this.target = target;
	this.range = range;
	this.power = range.min;
	this.indexAdjustment = rangeAdjustment;
}
Attribute.prototype.score = function(){
  return this.range.score(this.power);
}

function getWeightedAttributeTypes(itemType){
  const weightedAttributes = [];
  for(let effect in attributeTypes){
    
    if(!attributeTypes[effect].itemTypes.includes(itemType)){
      continue;
    }
    
    for(let i=0;i<attributeTypes[effect].dropWeight;i++){
      weightedAttributes.push(effect)
    }
  }
  
	return weightedAttributes;
}
function getItemAttrRangeIndex(tier, type, rangeAdjustment){
	let index = tier-2;
	index += itemType[type].rangeAdjustment || 0;
	index += rangeAdjustment || 0;
	return Math.max(index,0);
}
Attribute.prototype.toString = function(){
  const target = resources[this.target]?.name ?? this.target;
  
  const isBackwards = backwardsStats.includes(this.effect)
  const isA = this.range.type == rangeTypes.a;
  const type = isA  ?
        (isBackwards? '-' : '+') :
        (isBackwards? '/' : '*');

  return target+" "+this.effect.fixString()+": "+type+this.power;
}

Attribute.prototype.buildSave = function(){
  const output = {};
  
  output.t = this.target;

  output.e=this.effect;
  
  output.p = this.power;
  output.r = this.range.type;
  output.i = this.range.index;
  output.a = this.indexAdjustment;
  
  return output
}