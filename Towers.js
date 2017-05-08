function TowerFactory(base, level){
	var newTower = new Tower(base.hp, base.damage, base.moveSpeed);
	//TODO: multiply stats by level multipliers
	//TODO: make DamageReduction * multiplier have an upper limit ~.95; after which it boosts main damage.
}

function Tower(hp, damage, attackSpeed, location){
	this.hp = hp||10;
	this.damage = damage||0;
	this.attackSpeed = attackSpeed||1;
	this.Location = new point(50,50);//TODO: generate new tower locations from right side of screen
	this.projectiles = [];
}
Tower.prototype.Draw = function(){
	ctx.fillStyle='#F00';
	ctx.fillRect(this.Location.x, this.Location.y, 10, 10);
}
Tower.prototype.Attack = function(){
	//TODO: should this be a prototype function?
}