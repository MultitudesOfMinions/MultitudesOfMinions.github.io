"use strict";


function statFactory(tier, type, name){
	const rangeIndex = getItemStatRangeIndex(tier, type, name);
	const range = getItemStatRange(rangeTypes.a, rangeIndex);
	return new stat(itemType[type].stat, range);
}
function stat(attr, range) {
	this.attr = attr;
	this.power = range.min();
	this.range = range;
}
stat.prototype.score = function(){
  return this.range.score(this.power);;
}
function getItemStatRangeIndex(tier, type, name){
	let index = tier;
	index += itemType[type].rangeAdjustment || 0;
	index += items["t"+tier][type][name].rangeAdjustment || 0;
	return Math.max(index,0);
}
function getItemStatRange(rangeType, index){
	const ranges = statRange[rangeType];
	const surplus = Math.max(0, index - ranges.length);
	if(surplus > 0){
		index = ranges.length-1;
	}
	
	return new range(rangeTypes[rangeType], index, surplus)
}

