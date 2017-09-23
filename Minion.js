function MinionFactory(base){
	return new Minion(base.hp, base.damage, base.moveSpeed, base.attackDelay, base.attackSpeed, base.attackRange, base.color);
	//TODO: incorporate upgrades/boosts etc...
}

var sin = [];
var cos = [];


function Minion(hp, damage, moveSpeed, attackDelay, attackSpeed, attackRange, color){
	this.hp = hp||10;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.attackDelay = attackDelay||1;
	this.attackSpeed = attackSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(Math.max(-halfW>>2, path[0].x), halfH);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackDelayMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.lastAttack = 0;
	this.deathValue = 1;
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
	if(showNextShot){
		ctx.strokeStyle=this.color;
		ctx.lineWidth=5;
		ctx.beginPath();
		var p = (1-Math.max(0,(this.attackDelay-this.lastAttack)/this.attackDelay))*2*Math.PI;
		ctx.ellipse(this.Location.x, this.Location.y, this.yRange()>>1, this.xRange()>>1, 3*Math.PI/2, 0, p, 0);
		ctx.stroke();
	}
	if(showHP){
		var w = ctx.measureText(this.hp).width
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y-(pathL>>1);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.fillText(this.hp,x,y);
	}

}
Minion.prototype.xRange = function(){return this.attackRange*pathL}
Minion.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Minion.prototype.Attack = function(target){
	if(this.lastAttack > this.attackDelay){

		projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.attackSpeed, this.damage,
								this.attackCharges, this.chainRange, this.chainDamageReduction,
								this.splashRadius, this.splashDamageReduction, 0)

		this.lastAttack = 0;
	}
}