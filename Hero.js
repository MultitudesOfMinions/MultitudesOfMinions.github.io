"use strict";
function manageHero(){
	if(hero === null){addHero()}
	
	if(hero.Location.x < langoliers || hero.health <= 0 || isNaN(hero.health)){
		resources.a.amt += hero.deathValue;
		hero.DeathEffect();
		hero = null;
		achievements.heroesKilled.count++;
		achievements.maxLevelCleared.count = Math.max(achievements.maxLevelCleared.count, getLevel()+1);
	}
	else{
		//hero slowly regen health
		if(hero.health < hero.maxHP){
			if(hero.lastRegen++ > hero.regen){
				hero.health+=.1;
				hero.lastRegen =0;
			}
		}
		
		if(!hero.Aim()){
			hero.Move();
		}
		hero.Aura();
		hero.effects.ManageEffects();
	}
}
function addHero(){
	const level = GetNextHeroLevel();
	const x = GetNextHeroX();
	const y = getPathYatX(x);// gameH/2;
	
	const index = getRandomInt(0, Object.keys(baseHero).length);
	const type = Object.keys(baseHero)[index];
	
	hero = HeroFactory(type, level, x, y);
}
function drawHero(){
	if(hero && hero.health >= 0){
		hero.Draw();
	}
}
function drawHeroAura(){
	if(hero && hero.health){
		hero.DrawAura();
	}
}
function GetNextHeroLevel(){
	const buffer = PathsPerLevel - (leaderPoint / pathL);
	return getLevelAtPathCount(totalPaths + buffer);
}
function GetNextHeroX(){
	const level = GetNextHeroLevel();
	const endOfLevel = LevelToTotalPaths(level+1) - 2;
	const x = (endOfLevel - totalPaths) * pathL;
	return x;
}
function getHeroBaseStats(type){
	const baseStats = {};
	Object.assign(baseStats, baseHeroDefault, baseHero[type]);
	
	return baseStats;
}
function getHeroLevelMultipliers(type){
	const levelMultipliers = {};
	Object.assign(levelMultipliers, heroLevelMultipliersDefault, heroLevelMultipliers[type]);
	
	return levelMultipliers;
}
function getHeroUpgradedStats(type){
	const baseStats = getHeroBaseStats(type);
	const upgradeMultipliers = getHeroLevelMultipliers(type);

	const stats = [];
	const lvl = getLevel();
	for(let stat in baseStats){
		if(upgradeMultipliers.hasOwnProperty(stat)){
			const base = baseStats[stat];
			const mult = upgradeMultipliers[stat];
			const prod = Math.floor(base*(mult**lvl)*100)/100;

			stats.push({
				stat:stat,
				base:base,
				mult:mult,
				upg:lvl,
				prod:prod
			})
		}
	}
	return stats;
}

function HeroFactory(type, level, x, y){
	
	const base = getHeroBaseStats(type);
	const levelMultipliers = getHeroLevelMultipliers(type);
	const deathValue = 25 + (level * level);
	
	const newHero = new Hero(type, level, base.symbol, deathValue, base.canHitAir, base.canHitGround,
			Math.floor(base.health * levelMultipliers.health**level), 
			Math.floor(base.regen * levelMultipliers.regen**level * 100)/100, 
			Math.floor(base.damage * levelMultipliers.damage**level), 
			base.moveSpeed * levelMultipliers.moveSpeed**level,
			base.attackRate * levelMultipliers.attackRate**level, 
			base.projectileSpeed * levelMultipliers.projectileSpeed**level, 
			base.projectileType,
			base.attackRange * levelMultipliers.attackRange**level,
			base.attackCharges * levelMultipliers.attackCharges**level, 
			base.splashRadius * levelMultipliers.splashRadius**level,
			base.heroPowerType, x, y, base.color, base.color2);
	
	
	return newHero;
}

function Hero(type, level, symbol, deathValue, canHitAir, canHitGround,  health, regen, damage, moveSpeed, attackRate, projectileSpeed, projectileType, attackRange, attackCharges, splashRadius, heroPowerType, x, y, color, color2){
	this.type = type;
	this.level = level;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||10;
	this.maxHP = health||10;
	this.regen = regen;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.balistic;
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
	
	this.heroPowerType = heroPowerType;
	this.heroPowerValues = [];
	for(let i=0;i<heroPowerType.effects.length;i++){
		const hpte = heroPowerType.effects[i];
		this.heroPowerValues.push({
			type:hpte.effectType,
			power: hpte.baseValue * hpte.levelMultiplier**level,
			isAura: hpte.isAura
		});
	}

	this.lastAttack = this.attackRate;
	this.lastRegen = 0;
	this.wanderDirection = 1;
	this.patrolX = x;
	if(type == "Templar"){this.patrolX-=pathL*2;}
	else if(type == "Prophet"){this.patrolX+=pathL*2;}

	
	this.symbol = symbol;
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 1;
	
	this.effects = new UnitEffects();
	
	this.uid = "H_" + (new Date()%10000);
}

Hero.prototype.GetDamage = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.damage);
	return this.damage * effectPower;
}
Hero.prototype.GetMoveSpeed = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.moveSpeed);
	return this.moveSpeed * effectPower * getScale();
}
Hero.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Hero.prototype.GetAttackRange = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.attackRange);
	return this.attackRange * effectPower * getScale()
}
Hero.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta; 
	this.home.x -= RecenterDelta;
	this.patrolX -= RecenterDelta;
}

Hero.prototype.Move = function(){
	this.target = new point(0, 0)

	let leader = null;
	if(team0 != null && team0Order != null && team0Order[0] < team0.length){
		leader = team0[team0Order[0]];
	}
	
	//Go towards the leader if in range or passed
	const territoryX = endZoneStartX() - (pathL*2);
	if(leader != null && leader.Location.x > territoryX){
		//pursue leader
		this.target = new point(leader.Location.x, leader.Location.y);
	}
	else if(Math.abs(this.Location.x - this.patrolX) > this.GetMoveSpeed()/2){
		//go home
		this.target = new point(this.patrolX, this.home.y);
	}
	else{
		//wander
		if(this.home.y - this.Location.y > gameH/4){
			this.wanderDirection = 1;
		}
		else if(this.Location.y - this.home.y > gameH/4){
			this.wanderDirection = -1;
		}
		
		this.Location.x = this.patrolX;
		this.Location.y += this.GetMoveSpeed() / 4 * this.wanderDirection;
		return;
	}
	
	if(this.target.x === 0 && this.target.y === 0){ return; }
	this.Location = calcMove(this.GetMoveSpeed(), this.Location, this.target);
}
Hero.prototype.Draw = function(){
	const color = isColorblind() ? GetColorblindColor() : this.color;
	const color2 = isColorblind() ? GetColorblindBackgroundColor() : this.color2;

	if(isColorblind()){
		const c = this.type.charAt(0);
		ctx.font = "bold 20pt Arial";
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.fillRect(this.Location.x, this.Location.y, 3, 3);
		ctx.fillText(c,this.Location.x,this.Location.y);
	}
	else{
		ctx.fillStyle=color2;
		ctx.strokeStyle=color;
		
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, pathL, 0, twoPi);
		ctx.fill();
		ctx.stroke();
		
		if(Quality >= 2){
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.font = "bold 20pt Arial"
			const size = ctx.measureText(this.symbol);
			ctx.fillText(this.symbol, this.Location.x-(size.width/2), this.Location.y+10);
			ctx.font = "bold 12pt Arial"
		}
	}
	const gaugesChecked = GetGaugesCheckedForUnitType("Hero");
	if(gaugesChecked.Range){
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, this.GetAttackRange(), 0, twoPi);
		ctx.stroke();
	}
	if(gaugesChecked.Reload){
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=2;
		ctx.beginPath();
		const percent = this.lastAttack/this.attackRate
		ctx.arc(this.Location.x, this.Location.y, pathL*1.5, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = (Math.ceil(this.health * 10) / 10).toFixed(1)
		const w = ctx.measureText(hp).width
		const x = this.Location.x -(w>>1);
		const y = this.Location.y-pathW;
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(hp, x, y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		const dmg = Math.floor(this.GetDamage() * 10)/10;
		ctx.font = "8pt Helvetica"
		const w = ctx.measureText(dmg).width;
		const x = this.Location.x -(w>>1);
		const y = this.Location.y+(pathW*1.6);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(dmg, x, y);
	}	
	ctx.closePath();
}
Hero.prototype.DrawAura = function(){
	const auraPowers = this.heroPowerValues.filter(effect => effect.isAura);
	if(auraPowers.length == 0) { return; }
	const gaugesChecked = GetGaugesCheckedForUnitType("Hero");
	if(gaugesChecked.Range){

		const x = this.Location.x - this.AuraRange();
		const w = this.AuraRange() * 2;

		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.arc(this.Location.x, this.Location.y, this.AuraRange(), 0, twoPi);
		ctx.fill();
		ctx.closePath();
	}
}
Hero.prototype.AuraRange = function() {return this.attackRange*getScale()*2;}
Hero.prototype.Aim = function() {
	const effectPower = this.effects.GetEffectPowerByName(statTypes.attackRate);
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);

	//Attacks the leader if in range
	if(team0.length > 0 && team0.length > team0Order[0]){
		const target = team0[team0Order[0]];
		
		//cheap check
		if(target && Math.abs(this.Location.x - target.Location.x) < this.GetAttackRange())
		{
			//fancy check
			if(inRange(target.Location, this.Location, this.GetAttackRange())){
				this.Attack(target);
				return true;
			}
		}
	}

	return false;
}
Hero.prototype.Attack = function (target){
	if(this.lastAttack < this.GetAttackRate()){ return; }

	const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
	projectiles[projectiles.length] = new Projectile(this.Location, loc, target.uid, this.uid, this.projectileSpeed, this.GetDamage(), null,
			this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
			this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType)

	this.lastAttack = 0;
}
Hero.prototype.DeathEffect = function(){}
Hero.prototype.Aura = function(){
	const auraPowers = this.heroPowerValues.filter(effect => effect.isAura);
	if(auraPowers.length == 0) { return; }
	if(towers.length == 0){ return; }
	
	const range = this.AuraRange();
	const minX = this.Location.x - range;
	const maxX = this.Location.x + range;
	
	for(let i=0;i<auraPowers.length;i++){
		for(let j=0; j< towers.length;j++){
			const power = auraPowers[i].power;
			const type = auraPowers[i].type;
			
			if(towers[j].Location.x > minX && towers[j].Location.x < maxX){
				if(inRange(towers[j].Location, this.Location, range)){
					towers[j].effects.AddEffect(type, effectType.boon, 10, power);
				}
			}
		}
	}
}
Hero.prototype.TakeDamage = function(damage){
	const drPowers = this.heroPowerValues.filter(effect => effect.type == statTypes.damageReduction);
	if(drPowers.length == 1) {
		const power = drPowers[0].power;
		damage -= Math.floor(1/power);
		damage *= power;
		damage = Math.max(.01,damage);
	}

	this.health -= damage;
}
