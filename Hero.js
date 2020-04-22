function HeroFactory(type, level, x, y){
	
	var base = baseHeroes[type];
	var newHero = new Hero(
			Math.floor(base.hp * heroLevelMultipliers.hp**level), 
			Math.floor(base.regen * heroLevelMultipliers.regen**level * 100)/100, 
			Math.floor(base.damage * heroLevelMultipliers.damage**level), 
			Math.floor(base.moveSpeed * heroLevelMultipliers.moveSpeed**level),
			base.attackRate * heroLevelMultipliers.attackRate**level, 
			base.projectileSpeed * heroLevelMultipliers.projectileSpeed**level, 
			base.attackRange * heroLevelMultipliers.attackRange**level,
			base.attackCharges * heroLevelMultipliers.attackCharges**level, 
			base.splashRadius * heroLevelMultipliers.splashRadius**level,
			x, y, base.color, base.color2);
	
	newHero.deathValue = 25 * (level + 1);
	newHero.canHitAir = base.canHitAir;
	newHero.canHitGround = base.canHitGround;
	newHero.sym = base.sym;
	
	return newHero;
}

function Hero(hp, regen, damage, moveSpeed, attackRate, projectileSpeed, attackRange, attackCharges, splashRadius, x, y, color, color2){
	this.hp = hp||10;
	this.maxHP = hp||10;
	this.regen = regen;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(x, y);
	this.home = new point(x, y);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.color2 = color2;
	this.attackCharges = attackCharges||0;
	this.splashRadius = splashRadius||1;

	this.lastAttack = this.attackRate;
	this.lastRegen = 0;
	this.deathValue = 10;
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 1;
}
Hero.prototype.Move = function(){
	this.target = new point(0, 0)
	var S = (pathL + (pathW * 1.5))/2; //Scale
	
	if(minionOrder.length > 0 
	&& minions.length > minionOrder[0]
	&& minions[minionOrder[0]].Location.x > hero.home.x - (hero.xRange()*2)){
		var leader = minions[minionOrder[0]];
		
		//attack minion
		if(leader.Location.x < this.Location.x &&
		isInEllipse(leader.Location, hero.Location, hero.xRange(), hero.yRange())){
			return;
		}
		//move towards minion
		this.target = new point(leader.Location.x, leader.Location.y);
		if(leader.x > this.Location.x){ S *= 10; }
	}
	else if(this.Location.x != this.home.x){
		//go home
		this.target = new point(this.home.x, this.home.y);
	}
	
	if(this.target.x === 0 && this.target.y === 0){ return; }
	this.Location = calcMove(this.moveSpeed, this.Location, this.target);
}
Hero.prototype.Draw = function(){
	ctx.fillStyle=this.color;
	
	ctx.beginPath();
	ctx.fillRect(this.Location.x-7, this.Location.y-7, 13, 14);
	ctx.fillStyle=this.color2;
	ctx.font = "bold 12pt Arial"
	ctx.fillText(this.sym, this.Location.x-6, this.Location.y+6, 12, 12);
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
		var p = (1-Math.max(0,(this.attackRate-this.lastAttack)/this.attackRate))*2*Math.PI;
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
		var w = ctx.measureText(this.hp).width
		var x = this.Location.x -(ctx.measureText(this.damage).width>>1);
		var y = this.Location.y+(pathW*1.5);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(this.damage, x, y);
	}	
}
Hero.prototype.xRange = function(){return this.attackRange*pathL}
Hero.prototype.yRange = function(){return this.attackRange*pathW*1.5}
Hero.prototype.Attack = function() {
	if(this.lastAttack++ > this.attackRate){
		
		if(minionOrder.length > 0 
		&& minions.length > minionOrder[0]
		&& minions[minionOrder[0]].Location.x > hero.home.x - (hero.xRange()*2)){
			var target = minions[minionOrder[0]];
			
			projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.damage,
						this.attackCharges, this.chainRange, this.chainDamageReduction,
						this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team)

			this.lastAttack = 0;
		}
	}

}
Hero.prototype.DeathEffect = function(){}
