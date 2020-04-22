function TowerFactory(type, level, x, y){
	
	var base = baseTowers[type];
	var newTower = new Tower(
			Math.floor(base.hp * towerLevelMultipliers[type].hp**level), 
			Math.floor(base.damage * towerLevelMultipliers[type].damage**level), 
			base.attackRate * towerLevelMultipliers[type].attackRate**level, 
			base.projectileSpeed * towerLevelMultipliers[type].projectileSpeed**level, 
			base.attackRange * towerLevelMultipliers[type].attackRange**level,
			base.attackCharges * towerLevelMultipliers[type].attackCharges**level, 
			base.splashRadius * towerLevelMultipliers[type].splashRadius**level,
			x, y, base.color, base.color2);
	
	newTower.type = type;
	newTower.deathValue = 10 * (level+ 1);
	newTower.canHitAir = base.canHitAir;
	newTower.canHitGround = base.canHitGround;
	newTower.boostLevel = 0;
	return newTower;
}

function Tower(hp, damage, attackRate, projectileSpeed, attackRange, attackCharges, splashRadius, x, y, color, color2){
	this.hp = hp||10;
	this.damage = damage||0;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(x,y);
	this.color = color;
	this.color2 = color2;
	this.attackCharges = attackCharges||0;
	this.splashRadius = splashRadius||1;
	
	this.lastAttack = this.attackRate;
	this.deathValue = 10;
	this.team = 1;
}


Tower.prototype.getDamage = function(){
	return this.damage;//TODO: figure out wizard boosts.
}

Tower.prototype.getAttackRate = function(){
	return this.attackRate;//TODO: figure out wizard boosts.
}

Tower.prototype.Draw = function(){
	ctx.fillStyle=this.color;
	ctx.strokeStyle=this.color2;
	ctx.lineWidth=2;
	
	ctx.beginPath();
	ctx.fillRect(this.Location.x-5, this.Location.y-5, 10, 10);
	ctx.rect(this.Location.x-6, this.Location.y-6, 12, 12);
	ctx.rect(this.Location.x-1, this.Location.y-1, 2, 2);
	ctx.stroke();

	
	if(showRange){
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.ellipse(this.Location.x, this.Location.y, this.xRange(), this.yRange(), 0, 0,2*Math.PI);
		ctx.stroke();
	}
	if(showReload){
		ctx.strokeStyle=this.color;
		ctx.lineWidth=5;
		ctx.beginPath();
		var p = (1-Math.max(0,(this.getAttackRate()-this.lastAttack)/this.getAttackRate()))*2*Math.PI;
		ctx.ellipse(this.Location.x, this.Location.y, this.yRange()>>1, this.xRange()>>1, 3*Math.PI/2, 0, p, 0);
		ctx.stroke();
	}
	if(showHP){
		var w = ctx.measureText(this.hp).width
		var x = this.Location.x -(ctx.measureText(this.hp).width>>1);
		var y = this.Location.y-pathW;
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(this.hp, x, y);
	}
	if(showDMG){
		var text = this.damage + (this.attackCharges <= 1 ? '' : 'x' + Math.floor(this.attackCharges+1));
		var w = ctx.measureText(text).width
		var x = this.Location.x -(ctx.measureText(text).width>>1);
		var y = this.Location.y+(pathW*1.5);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(text, x, y);
	}
	if(this.target && this.lastAttack < 10 && this.type === "Laser"){
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=5-(this.lastAttack/2);
		ctx.moveTo(this.Location.x, this.Location.y);
		ctx.lineTo(this.Location.x-this.target.x, this.Location.y-this.target.y);
		ctx.stroke();
	}
}
Tower.prototype.xRange = function(){return this.attackRange*pathL}
Tower.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Tower.prototype.Attack = function(target){
	this.target = new point(this.Location.x-target.Location.x, this.Location.y-target.Location.y);
	if(this.lastAttack > this.getAttackRate()){
		projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.getDamage(),
								this.attackCharges, this.chainRange, this.chainDamageReduction,
								this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team);
								

		this.lastAttack = 0;
	}
}