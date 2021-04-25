"use strict";

const attributeTargetType={unit:"unit", currency:"currency"};

const attributeTarget={
	self:{
	  options:["Boss"],
	  targetType:attribute.unit,
		rangeAdjustment:0
	},
	minion:{
		options:["Mite","Bomber","Catapult","Golem","Harpy","Ram","Vampire","Air","Earth","Fire","Water"],
	  targetType:attribute.unit,
		rangeAdjustment:-1
	},
	all:{
	  options:["All"],
	  targetType:attribute.unit,
		rangeAdjustment:-2
	},
	currency:{
	  options:["a", "b", "c", "d", "e", "f"],
	  targetType:attribute.currency,
	  rangeAdjustment:0
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
  bonusStat0:{
    dropWeight:16,
    itemTypes:[itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name],
    effectTypes:[statTypes.health],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bonusStat1:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name],
    effectTypes:[statTypes.damage],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  
  bonusStat2:{
    dropWeight:16,
    itemTypes:[itemType.shield.name, itemType.torso.name, itemType.head.name, itemType.feet.name, itemType.legs.name],
    effectTypes:[statTypes.health],
    target:attributeTarget.minion,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  bonusStat3:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name],
    effectTypes:[statTypes.damage],
    target:attributeTarget.minion,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },

  resource0:{
    dropWeight:16,
    itemTypes:[itemType.weapon.name, itemType.shield.name, itemType.head.name],
    effectTypes:["gain", "discount"],
    target:attributeTarget.currency,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  },
  resource1:{
    dropWeight:4,
    itemTypes:[itemType.ammulet.name, itemType.trinket.name],
    effectTypes:["gain", "discount"],
    target:attributeTarget.currency,
    rangeAdjustment:-4,
    rangeType:rangeTypes.m
  },
    
  miscUpgradeBoost:{
    dropWeight:8,
    itemTypes:[itemType.trinket.name, itemType.ammulet.name],
    effectTypes:[tierMisc.t1.miscUpgrades.maxMinions_1,
            tierMisc.t2.miscUpgrades.upgradeLimit_2,
            tierMisc.t3.miscUpgrades.reduceDeployTime_3,
            tierMisc.t4.miscUpgrades.unknown_4],
    target:attributeTarget.self,
    rangeAdjustment:0,
    rangeType:rangeTypes.a
  }
}


function attributeFactory(tier, itemType, name){
  
	const attributes = [];
	const tierName = "t" + tier;
	const attrCount = itemTier[tierName].attrCount + 1;

	if(attrCount == 0){ return attributes; }
	
	let weightedOptions = getWeightedAttributeTypes(itemType);

	if(weightedOptions == null || weightedOptions.length == 0){
		weightedOptions = defaultAttributeOptions;
	}

	for(let i=0;i<attrCount;i++){
	  const attr = attributeTypes[pickAKey(weightedOptions)];
	  const effect = pickOne(attr.effectTypes);
    const target = attr.target;

    const rangeAdjustment = attr.rangeAdjustment + target.rangeAdjustment; //TODO: look for other range adjustments.
  	const rangeIndex = getItemAttrRangeIndex(tier, itemType, name, rangeAdjustment);
	  const range = getItemAttrRange(attr.rangeType, rangeIndex);
	  const power = range.min();
	  
	  const t = pickOne(target.options);

    const A = new attribute(effect, t, target.targetType, power, range);
    attributes.push(A);
	}
	
	return attributes;
}
function attribute(effect, target, targetType, power, range){
	this.effect = effect;
	this.target = target;
	this.targetType = targetType;
	this.range = range;
	this.power = power;
}
attribute.prototype.score = function(){
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
	
	return new range(rangeTypes[rangeType], index, surplus)
}

