"use strict";

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
  return Math.floor(this.delta()/(this.index + 2) * 100)/100;
}
Range.prototype.score = function (power){
  if(this.delta()<=0){return 0;}
  return (power - this.min) * 100 / (this.delta());
}
Range.prototype.upgradePrice = function(){
  const discount = getDiscount(4);
  return Math.max(1, this.index+2-discount);
}
Range.prototype.prestigePrice = function(){
  const discount = getDiscount(4);
  return Math.max(1,(this.index**2)-discount);
}
