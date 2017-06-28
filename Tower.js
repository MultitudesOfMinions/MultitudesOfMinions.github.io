function TowerFactory(base, level, x, y){
	var newTower = new Tower(base.hp, base.damage, base.attackSpeed, base.attackRange, x, y, base.color);
	//TODO: multiply stats by level multipliers
	//TODO: make DamageReduction * multiplier have an upper limit ~.95; after which it boosts main damage.
	return newTower;
}

function Tower(hp, damage, attackSpeed, attackRange, x, y, color){
	this.hp = hp||10;
	this.damage = damage||0;
	this.attackSpeed = attackSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(x,y);
	this.projectiles = [];
	this.color = color
}
Tower.prototype.Draw = function(){
	ctx.fillStyle=this.color;
	ctx.fillRect(this.Location.x-5, this.Location.y-5, 10, 10);
	
	if(showRange){
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		//ctx.arc(this.Location.x, this.Location.y, this.attackRange, 0, 2*Math.PI);
		ctx.ellipse(this.Location.x, this.Location.y, this.attackRange*pathL, this.attackRange*pathW*1.5, 0, 0,2*Math.PI);

		ctx.stroke();
	}

}
Tower.prototype.xRange = function(){return this.attackRange*pathL}
Tower.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Tower.prototype.Attack = function(target){
	//TODO: ATTACK
	ctx.beginPath();
	ctx.strokeStyle='#FFF';
	ctx.moveTo(this.Location.x, this.Location.y);
	ctx.lineTo(target.Location.x, target.Location.y);
	ctx.stroke();
	target.hp -= this.damage;
}