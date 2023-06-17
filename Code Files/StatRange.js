

const rangeTypes= {a:"a",m:"m"};

function Range(type, index){
	this.type = type || rangeTypes.a;
	
	this.index = Math.max(index || 0, 0);
	
	const next = index+1;
	this.min = Math.floor(1 + index + (index*index*.1));
	this.max = Math.floor(1 + next + (next*next*.1));
	if(this.type == rangeTypes.m){
		this.min = 1 + (this.min/10);
		this.max = 1 + (this.max/10);
	}
	else{
		this.min*=2;
		this.max*=2;
	}
}
Range.prototype.recalculate = function(){
	const next = this.index+1;
	this.min = Math.floor(1 + this.index + (this.index*this.index*.1));
	this.max = Math.floor(1 + next + (next*next*.1));
	if(this.type == rangeTypes.m){
		this.min = 1 + (this.min/10);
		this.max = 1 + (this.max/10);
	}
	else{
		this.min*=2;
		this.max*=2;
	}
}
Range.prototype.delta = function(){
	return this.max - this.min;
}
Range.prototype.step = function(){
	const steps = this.index;
	const stepSize = this.delta()/steps;
	return Math.floor(stepSize * 100)/100;
}
Range.prototype.score = function (power){
	if(power === this.max){return 100;}
	if(this.delta()<=0){return 0;}
	
	return (power - this.min) * 100 / (this.delta());
}
Range.prototype.upgradePrice = function(){
	const discount = getDiscount(4);
	const x = this.index;
	const cost = Math.floor(x**1.25+x**.5);
	return Math.max(1, cost-discount);
}
Range.prototype.prestigePrice = function(){
	const discount = getDiscount(4);
	const x = this.index+1;
	const cost = Math.floor(x**1.25);
	return Math.max(1,cost-discount);
}
