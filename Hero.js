"use strict";
function manageHero(){
	if(hero){
		if(hero.Location.x < langoliers || hero.health <= 0 || isNaN(hero.health)){
		  itemDrop(hero.level);
			resources.a.amt += hero.deathValue;
			hero.DeathEffect();
			hero = null;
			achievements.heroesKilled.count++;
		}
		else{
			if(!hero.Aim()){
				hero.Move();
			}
			hero.DoHealing();
			hero.Aura();
			hero.effects.ManageEffects();
		}
	}
	
	if(squire){
		if(squire.Location.x < langoliers || squire.health <= 0 || isNaN(squire.health)){
			resources.a.amt += squire.deathValue;
			squire.DeathEffect();
			squire = null;
			achievements.heroesKilled.count++;
		}
		else{
			if(!squire.Aim()){
				squire.Move();
			}
			squire.DoHealing();
			squire.Aura();
			squire.effects.ManageEffects();
		}
	}
	
	if(page){
		if(page.Location.x < langoliers || page.health <= 0 || isNaN(page.health)){
			resources.a.amt += page.deathValue;
			page.DeathEffect();
			page = null;
			achievements.heroesKilled.count++;
		}
		else{
			if(!page.Aim()){
				page.Move();
			}
			page.DoHealing();
			page.Aura();
			page.effects.ManageEffects();
		}
	}
}

function addHero(){
	const x = GetNextHeroX();
	const y = getPathYatX(x);// gameH/2;
	
	const index = getRandomInt(0, Object.keys(baseHero).length);
	const type = Object.keys(baseHero)[index];
	
	hero = HeroFactory(type, level, x, y);
	
	const maxLevel = achievements.maxLevelCleared.count;
	const squireThreshold = Math.max(4, maxLevel>>1);
	const pageThreshold = Math.max(8, maxLevel);
	
	if(level >= squireThreshold){
		const tempList = Object.keys(baseHero).filter(x => x != hero.type);
		const index = getRandomInt(0, tempList.length);
		const sType = tempList[index];
		
		squire = HeroFactory(sType, level - squireThreshold, x, y);
	}
	
	if(level >= pageThreshold){
		const tempList = Object.keys(baseHero).filter(x => x != hero.type && x != squire.type);
		const index = getRandomInt(0, tempList.length);
		const sType = tempList[index];
		
		page = HeroFactory(sType, level - pageThreshold, x, y);
	}
}
function drawHero(){
	if(hero && hero.health >= 0){
		hero.Draw();
	}
	if(squire && squire.health >= 0){
		squire.Draw();
	}
	if(page && page.health >= 0){
		page.Draw();
	}
}
function drawHeroAura(){
	if(hero && hero.health >= 0){
		hero.DrawAura();
	}
	if(squire && squire.health >= 0){
		squire.DrawAura();
	}
	if(page && page.health >= 0){
		page.DrawAura();
	}
}
function GetNextHeroX(){
	const endOfLevel = getEndOfLevelX(level);
	return endOfLevel - endZoneW()/2;
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
	const multipliers = getHeroLevelMultipliers(type);

	const stats = [];
	for(let stat in statTypes){
		const base = baseStats[stat] || '-';
		const mult = multipliers[stat] || '-';
		
		const equippedEffect = getEquippedEffect(type, stat);
		let calculated = (base+equippedEffect.a)*equippedEffect.m;
		
		if(mult != '-'){
		  calculated*=mult**level;
		}

		const prod = flooredStats.includes(stat) ? Math.floor(calculated) : Math.floor(calculated*100)/100;
		if(isNaN(prod)){continue;}
		stats.push({
			stat:stat,
			base:base,
			mult:mult,
			upg:level,
			prod:prod
		});
	}
	
  stats.push({
		stat:"regen",
		base:baseStats.regen,
		mult:multipliers.regen,
		upg:level,
		prod:Math.floor(baseStats.regen * multipliers.regen**level * 100)/100
  })
	
	return stats;
}

function HeroFactory(type, level, x, y){
	
	const baseStats = getHeroBaseStats(type);
	const upgradedStats = buildDictionary(getHeroUpgradedStats(type), "stat", "prod");
	
	const finalStats = {};
	Object.assign(finalStats, baseStats, upgradedStats);

	const deathValue = 1<<(level*2);
	
	const newHero = new Hero(type, level, finalStats.symbol, deathValue, finalStats.canHitAir, finalStats.canHitGround,
	    finalStats.health/statAdjustments.health,
	    finalStats.regen/1000,
	    finalStats.damage/statAdjustments.damage,
	    finalStats.moveSpeed/statAdjustments.moveSpeed,
	    finalStats.attackRate/statAdjustments.attackRate,
	    finalStats.projectileSpeed/statAdjustments.projectileSpeed,
	    finalStats.projectileType,
	    finalStats.attackRange/statAdjustments.attackRange,
	    finalStats.attackCharges/statAdjustments.attackCharges,
	    finalStats.splashRadius/statAdjustments.splashRadius,
	    finalStats.targetCount,

			finalStats.heroPowerType, x, y, finalStats.color, finalStats.color2);
	
	
	return newHero;
}

function Hero(type, level, symbol, deathValue, canHitAir, canHitGround,  health, regen, damage, moveSpeed, attackRate, projectileSpeed, projectileType, attackRange, attackCharges, splashRadius, targetCount, heroPowerType, x, y, color, color2){
	this.type = type;
	this.level = level;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||10;
	this.maxHealth = health||10;
	this.regen = regen;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed;
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
	this.attackCharges = attackCharges||1;
	this.splashRadius = splashRadius||1;
	this.targetCount = targetCount||1;
	
	this.heroPowerType = heroPowerType;
	this.heroPowerValues = [];
	for(let i=0;i<heroPowerType.effects.length;i++){
		const hpte = heroPowerType.effects[i];
		this.heroPowerValues.push({
			type:hpte.effectType,
			mPower: hpte.mBase * hpte.mMultiplier**level,
			aPower: hpte.aBase * hpte.aMultiplier**level
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
	
	this.uid = "H_" + (new Date()%10000) + type.charAt(0);
}

function getHeroSize(uid){
	if(hero && hero.uid == uid){return pathL;}
	if(squire && squire.uid == uid){return pathL * 3 /4;}
	if(page && page.uid == uid){return pathL/2;}
}
function getHeroFontSize(uid){
	if(hero && hero.uid == uid){return "bold 20pt Arial";}
	if(squire && squire.uid == uid){return "bold 15pt Arial";}
	if(page && page.uid == uid){return "bold 10pt Arial";}
}

Hero.prototype.CalculateEffect = function(type){
	const temp = this[type];
	if(temp == null){return;}
	return this.effects.CalculateEffectByName(type, temp)
}
Hero.prototype.DoHealing = function(){
	//hero slowly regen health
	this.health += this.regen;
	const newHealth = this.CalculateEffect(statTypes.health, this.health);
	this.health = Math.min(this.maxHealth, newHealth);
}
Hero.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta;
	this.home.x -= RecenterDelta;
	this.home.y = getPathYatX(this.home.x);
	this.patrolX -= RecenterDelta;
}

Hero.prototype.Move = function(){
	this.target = new point(0, 0)

	let leader = null;
	if(team0 != null && team0Order != null && team0Order[0] < team0.length){
		leader = team0[team0Order[0]];
	}
	
	const moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	//Go towards the leader if in range or passed
	const territoryX = endZoneStartX() - (pathL*2)-this.attackRange;
	if(leader != null && leader.Location.x > territoryX){
		//pursue leader
		this.target = new point(leader.Location.x, leader.Location.y);
	}
	else if(Math.abs(this.Location.x - this.patrolX) > moveSpeed/2){
		//go home
		this.home.y = getPathYatX(this.home.x);//reset home.y seems to get off sometimes.
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
		this.Location.y += moveSpeed / 4 * this.wanderDirection;
		return;
	}
	
	if(this.target.x === 0 && this.target.y === 0){ return; }
	this.Location = calcMove(moveSpeed, this.Location, this.target);
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
		
		const r = getHeroSize(this.uid);
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, r, 0, twoPi);
		ctx.fill();
		ctx.stroke();

		if(Quality >= 2){
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.font =  getHeroFontSize(this.uid);

			const size = ctx.measureText(this.symbol);
  		ctx.font = "bold 20pt Arial";
			ctx.fillText(this.symbol, this.Location.x-(size.width/2), this.Location.y+(r/2));
			ctx.font = "bold 12pt Arial"
		}
	}
	const gaugesChecked = GetGaugesCheckedForUnitType("Hero");
	if(gaugesChecked.Range){
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, this.CalculateEffect(statTypes.attackRange), 0, twoPi);
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
		const y = this.Location.y-getScale();
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(hp, x, y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		const dmg = Math.floor(this.CalculateEffect(statTypes.damage) * 10)/10;
		const text = (this.targetCount <= 1 ? "" : Math.floor(this.targetCount) + "x") + dmg + (this.attackCharges <= 1 ? "" : "..." + Math.floor(this.attackCharges));

		ctx.font = "8pt Helvetica"
		const w = ctx.measureText(text).width;
		const x = this.Location.x -(w>>1);
		const y = this.Location.y+getScale();
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Hero.prototype.DrawAura = function(){
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
	this.lastAttack += this.effects.CalculateEffectByName(statTypes.attackRate, 1);
	this.lastAttack = Math.min(this.attackRate, this.lastAttack);

	//Attacks the leader if in range
	if(team0.length > 0 && team0.length > team0Order[0]){
		const target = team0[team0Order[0]];
		
		//cheap check
		if(target && Math.abs(this.Location.x - target.Location.x) < this.CalculateEffect(statTypes.attackRange))
		{
			//fancy check
			if(inRange(target.Location, this.Location, this.CalculateEffect(statTypes.attackRange))){
				this.Attack(target);
				return true;
			}
		}
	}

	return false;
}
Hero.prototype.Attack = function (target){
	if(this.lastAttack < this.attackRate){ return; }

	const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
	const newProjectile = new Projectile(this.Location, loc, target.uid, this.uid, this.projectileSpeed, this.CalculateEffect(statTypes.damage), null,
			this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
			this.splashRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType);
	projectiles.push(newProjectile);
	this.lastAttack = 0;
}
Hero.prototype.DeathEffect = function(){}
Hero.prototype.Aura = function(){
	const auraPowers = this.heroPowerValues;
	
	const range = this.AuraRange();
	const minX = this.Location.x - range;
	const maxX = this.Location.x + range;
	
	
	for(let i=0;i<auraPowers.length;i++){
		const aPower = auraPowers[i].aPower;
		const mPower = auraPowers[i].mPower;
		const type = auraPowers[i].type;

		for(let j=0; j< team1.length;j++){
			
			if(team1[j].Location.x > minX && team1[j].Location.x < maxX){
				if(inRange(team1[j].Location, this.Location, range)){
					team1[j].effects.AddEffect(type, effectType.blessing, 2, mPower, aPower);
				}
			}
		}
	}
}
Hero.prototype.TakeDamage = function(damage){
	damage = this.effects.CalculateEffectByName(statTypes.damageReduction, damage)
	damage = Math.max(0, damage);
	this.health -= damage;
}
