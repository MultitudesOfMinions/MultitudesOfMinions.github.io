function MinionFactory(type){
	
	var base = baseMinions[type];
	var upgrades = minionUpgrades[type];
	var newMinion = new Minion(Math.floor(base.hp * (1.5**upgrades.hp)), 
					Math.floor(base.damage * (1.5**upgrades.damage)), 
					base.moveSpeed * (1.5**upgrades.moveSpeed), 
					base.attackRate * (0.8**upgrades.attackRate), 
					base.projectileSpeed * (1.5**upgrades.projectileSpeed), 
					base.attackRange * (1.5**upgrades.attackRange), 
					base.color);
	newMinion.isFlying = base.isFlying;
	return newMinion;
	
}

function Minion(hp, damage, moveSpeed, attackRate, projectileSpeed, attackRange, color){
	this.hp = hp||10;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(path[0].x, path[0].y);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.lastAttack = 0;
	this.deathValue = 1;
}
Minion.prototype.Move = function(){
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}

	var i = 1;
	while(path[i].x <= this.Location.x){i++;}
	
	var x1 = path[i-1].x;
	var y1 = path[i-1].y
	var x2 = path[i].x;
	var y2 = path[i].y;
	var dx = x2 - x1;
	var dy = y2 - y1;

	var S = (pathL + (pathW * 1.5))/2; //Scale
	if(this.Location.x < -100){S *= 10;}
	var D = this.moveSpeed**2/(dx**2 + dy**2);
	
	var SpeedX = dx * D * S; 
	var SpeedY = dy * D * S; 
	
	this.Location.x += SpeedX;
	//fix the y for misc float rounding when close to a node.
	if(Math.abs(this.Location.x - path[i].x) < SpeedX){ this.Location.y = path[i].y; }
	else { this.Location.y += SpeedY; }
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
	if(showReload){
		ctx.strokeStyle=this.color;
		ctx.lineWidth=5;
		ctx.beginPath();
		var p = (1-Math.max(0,(this.attackRate-this.lastAttack)/this.attackRate))*2*Math.PI;
		ctx.ellipse(this.Location.x, this.Location.y, this.yRange()>>1, this.xRange()>>1, 3*Math.PI/2, 0, p, 0);
		ctx.stroke();
	}
	if(showHP){
		var w = ctx.measureText(this.hp).width
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y-(pathW);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.fillText(this.hp,x,y);
	}
	if(showDMG){
		var w = ctx.measureText(this.damage).width
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y+(pathW*1.5);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.fillText(this.damage, x, y);
	}

}
Minion.prototype.xRange = function(){return this.attackRange*pathL}
Minion.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Minion.prototype.Attack = function(target){
	if(this.lastAttack > this.attackRate){

		projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.damage,
								this.attackCharges, this.chainRange, this.chainDamageReduction,
								this.splashRadius, this.splashDamageReduction, 0)

		this.lastAttack = 0;
	}
}