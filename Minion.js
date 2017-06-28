function MinionFactory(base){
	return new Minion(base.hp, base.damage, base.moveSpeed, base.attackSpeed, base.attackRange, base.color);
	//TODO: incorporate upgrades/boosts etc...
}

var sin = [];
var cos = [];


function Minion(hp, damage, moveSpeed, attackSpeed, attackRange, color){
	this.hp = hp||10;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.attackSpeed = attackSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(Math.max(-halfW>>2, path[0].x), halfH);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackSpeedMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
}
Minion.prototype.Move = function(){
	var fudgeFactor = Math.max(1, pathL>>4)
	for(var i=0;i<path.length;i++){
		if(Math.abs(path[i].x - this.Location.x) <= fudgeFactor){
			//if x is close enough, set the Y (keeps any drifting due to rounding to a minimum and is faster than calculating)
			this.Location.x += this.moveSpeed;
			this.Location.y = path[i].y;
			break;
		}
		else if(path[i].x < this.Location.x && path[i+1].x > this.Location.x){
			var y1 = path[i].y;
			var y2 = path[i+1].y;
			var deltaY = y1 - y2;
			var deltaX = 1;
			
			for(var j=0;j<minionMoveCos.length;j++){
				if(minionMoveCos[j].x == deltaY){
					deltaX = minionMoveCos[j].y;
					deltaY = minionMoveSin[j].y;
					break;
				}
			}
			
			this.Location.x += this.moveSpeed*this.moveSpeedMultiplier*deltaX;
			this.Location.y += this.moveSpeed*this.moveSpeedMultiplier*deltaY;
			
			break;
		}
	}
}
Minion.prototype.Draw = function(){
	ctx.fillStyle=this.color;
	ctx.beginPath();
	ctx.arc(this.Location.x,this.Location.y,pathW>>1,0,2*Math.PI);
	ctx.fill();
	
	if(showRange){
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.ellipse(this.Location.x, this.Location.y, this.xRange(), this.yRange(), 0, 0,2*Math.PI);
		ctx.stroke();
	}
}
Minion.prototype.xRange = function(){return this.attackRange*pathL}
Minion.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Minion.prototype.Attack = function(target){
	//TODO: ATTACK
	ctx.beginPath();
	ctx.strokeStyle='#FFF';
	ctx.moveTo(this.Location.x, this.Location.y);
	ctx.lineTo(target.Location.x, target.Location.y);
	ctx.stroke();
	target.hp-=this.damage;
}