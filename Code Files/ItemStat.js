


function statFactory(tier, type, name){
	const rangeIndex = getItemStatRangeIndex(tier, type, name);
	const range = new Range(rangeTypes.a, rangeIndex);
	return new Stat(itemType[type].stat, range);
}
function Stat(attr, range) {
	this.attr = attr;
	this.power = range.min;
	this.range = range;
}
Stat.prototype.score = function(){
	return this.range.score(this.power);
}
function getItemStatRangeIndex(tier, type, name){
	let index = tier;
	index += itemType[type].rangeAdjustment || 0;
	index += items["t"+Math.min(7,tier)][type][name].rangeAdjustment || 0;
	return Math.max(index,0);
}
function getItemStatRange(rangeType, index){
	return new Range(rangeTypes[rangeType], index);
}

Stat.prototype.toString = function(){
	
	if(backwardsStats.includes(this.attr)){
		return this.attr.fixString()+": -"+this.power;
	}
	
	return this.attr.fixString()+": +"+this.power;
}
