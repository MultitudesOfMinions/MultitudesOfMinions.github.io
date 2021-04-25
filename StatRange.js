"use strict";

const rangeTypes= {a:"a",m:"m"};
const statRange={
	m:[
		new point(1,1.1),//0
		new point(1.1,1.2),//1
		new point(1.2,1.3),//2
		new point(1.3,1.5),//3
		new point(1.5,1.7),//4
		new point(1.7,1.9),//5
		new point(1.9,2.2),//6
		new point(2.2,2.5),//7
		new point(2.5,2.8),//8
		new point(2.8,3.2),//9
		new point(3.2,3.6),//10
		new point(3.6,4),//11
		new point(4,5)//12
	],
	a:[
		new point(1,2),//0
		new point(2,3),//1
		new point(3,4),//2
		new point(4,6),//3
		new point(6,8),//4
		new point(8,10),//5
		new point(10,12),//6
		new point(12,15),//7
		new point(15,18),//8
		new point(18,21),//9
		new point(21,24),//10
		new point(24,37),//11
		new point(27,35)//12
	]
}

function range(type, index, bonus){
	this.type = type || rangeType.a;
	this.index = index || 0;
	this.bonus = bonus || 0;
}
range.prototype.min = function(){
  return statRange[this.type][this.index].x + this.bonus;
}
range.prototype.max = function(){
  return statRange[this.type][this.index].y + this.bonus;
}
range.prototype.delta = function(){
  return this.max() - this.min() + 1;
}
range.prototype.score = function (power){
  return (power - this.min() + 1) / (this.delta() + 1);
}

