function TowerFactory(base, level, x, y){
	var newTower = new Tower(base.hp, base.damage, base.attackDelay, base.attackRange, x, y, base.color);
	//TODO: multiply stats by level multipliers
	//TODO: make DamageReduction * multiplier have an upper limit ~.95; after which it boosts main damage.
	return newTower;
}

function Tower(hp, damage, attackDelay, attackRange, x, y, color){
	this.hp = hp||10;
	this.damage = damage||0;
	this.attackDelay = attackDelay||1;
	this.attackRange = attackRange||1;
	this.Location = new point(x,y);
	this.projectiles = [];
	this.color = color;
	this.lastAttack = this.attackDelay;
	this.deathValue = 10;
}
Tower.prototype.Draw = function(){
	ctx.fillStyle=this.color;
	ctx.fillRect(this.Location.x-5, this.Location.y-5, 10, 10);
	
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
		var x = this.Location.x -(ctx.measureText(this.hp).width>>1);
		var y = this.Location.y-(pathL>>1);
		ctx.fillText(this.hp, x, y);
	}
	

}
Tower.prototype.xRange = function(){return this.attackRange*pathL}
Tower.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Tower.prototype.Attack = function(target){
	if(this.lastAttack > this.attackDelay){
		ctx.beginPath();
		ctx.strokeStyle='#F00';
		ctx.moveTo(this.Location.x, this.Location.y);
		ctx.lineTo(target.Location.x, target.Location.y);
		ctx.stroke();
		target.hp -= this.damage;
		this.lastAttack = 0;
	}
}

