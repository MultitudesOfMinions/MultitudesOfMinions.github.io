"use strict";

const rangeTypes= {a:"a",m:"m"};

function Range(type, index){
	this.type = type || rangeTypes.a;
	
	this.index = Math.max(index || 0, 0);

  if(this.type == rangeTypes.a){
    this.min = Math.floor(1 + index + (index*index*.1));
    const next = index+1;
    this.max = Math.floor(1 + next + (next*next*.1));
  }
  else{
    this.min = 1 + Math.floor(index + (index*index*.1))*.1;
    const next = index+1;
    this.max = 1 + Math.floor(next + (next*next*.1))*.1;
  }
}
Range.prototype.delta = function(){
  return this.max - this.min;
}
Range.prototype.score = function (power){
  if(this.delta()<=0){return 0;}
  return (power - this.min) / (this.delta());
}

