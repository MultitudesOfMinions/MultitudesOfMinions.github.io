"use strict";
function manageHero() {
	if(hero) {
		if(hero.Location.x < langoliers || hero.health <= 0 || isNaN(hero.health)) {
			itemDrop(hero.level);
			resources.a.amt += hero.deathValue;
			hero.DeathEffect();
			hero = null;
			achievements.heroesKilled.count++;
		}
		else{
			hero.moving = !hero.Aim();
			if(hero.moving) {
				hero.Move();
			}
			hero.DoHealing();
			hero.Aura();
			hero.effects.ManageEffects();
		}
	}
	
	if(squire) {
		if(squire.Location.x < langoliers || squire.health <= 0 || isNaN(squire.health)) {
			itemDrop(squire.level);
			resources.a.amt += squire.deathValue;
			squire.DeathEffect();
			squire = null;
			achievements.heroesKilled.count++;
		}
		else{
			squire.moving = !squire.Aim();
			if(squire.moving) {
				squire.Move();
			}
			squire.DoHealing();
			squire.Aura();
			squire.effects.ManageEffects();
		}
	}
	
	if(page) {
		if(page.Location.x < langoliers || page.health <= 0 || isNaN(page.health)) {
			itemDrop(page.level);
			resources.a.amt += page.deathValue;
			page.DeathEffect();
			page = null;
			achievements.heroesKilled.count++;
		}
		else{
			page.moving = !page.Aim();
			if(page.moving) {
				page.Move();
			}
			page.DoHealing();
			page.Aura();
			page.effects.ManageEffects();
		}
	}
}

function addHero() {
	const x = GetNextHeroX();
	const y = getPathYatX(x);// gameH/2;
	
	const index = getRandomInt(0, Object.keys(baseHero).length);
	const type = Object.keys(baseHero)[index];
	const hLevel = level + (achievements.maxLevelCleared.maxCount*12);
	
	hero = HeroFactory(type, hLevel, x, y);
	
	const maxLevel = achievements.maxLevelCleared.count;
	const squireThreshold = 4;
	const pageThreshold = 8;
	
	if(level >= squireThreshold) {
		const tempList = Object.keys(baseHero).filter(x => x != hero.type);
		const index = getRandomInt(0, tempList.length);
		const sType = tempList[index];
		
		squire = HeroFactory(sType, hLevel - 2, x, y);
	}
	
	if(level >= pageThreshold) {
		const tempList = Object.keys(baseHero).filter(x => x != hero.type && x != squire.type);
		const index = getRandomInt(0, tempList.length);
		const sType = tempList[index];
		
		page = HeroFactory(sType, hLevel - 4, x, y);
	}
}
function drawHeroAura() {
	if(hero && hero.health >= 0) {
		hero.DrawAura();
	}
	if(squire && squire.health >= 0) {
		squire.DrawAura();
	}
	if(page && page.health >= 0) {
		page.DrawAura();
	}
}
function GetNextHeroX() {
	const endOfLevel = getEndOfLevelX(level);
	return endOfLevel - endZoneW()/2;
}
function getHeroBaseStats(type) {
	const baseStats = { };
	Object.assign(baseStats, baseHeroDefault, baseHero[type]);
	
	return baseStats;
}
function getHeroLevelMultipliers(type) {
	const levelMultipliers = { };
	Object.assign(levelMultipliers, heroLevelMultipliersDefault, heroLevelMultipliers[type]);
	
	return levelMultipliers;
}
function getHeroUpgradedStats(type, hLevel) {
	const baseStats = getHeroBaseStats(type);
	const multipliers = getHeroLevelMultipliers(type);
	if(!hLevel) {
		hLevel = level + (achievements.maxLevelCleared.maxCount*12);
	}
	
	const stats = [];
	for(let stat in statTypes) {
		const base = baseStats[stat] || '-';
		const mult = multipliers[stat] || '-';
		
		const equippedEffect = getEquippedEffect(type, stat);
		let calculated = (base+equippedEffect.a)*equippedEffect.m;
		
		if(mult != '-') {
			calculated*=mult**hLevel;
		}
		
		if(statMaxLimits.hasOwnProperty(stat)) {
			calculated = Math.min(statMaxLimits[stat]*1.5, calculated);
		}
		if(statMinLimits.hasOwnProperty(stat)) {
			calculated = Math.max(statMinLimits[stat]*.5, calculated);
		}
		
		const prod = flooredStats.includes(stat) ? Math.floor(calculated) : Math.floor(calculated*100)/100;
		if(isNaN(prod)) { continue; }
		stats.push({
			stat:stat,
			base:base,
			mult:mult,
			upg:hLevel,
			prod:prod
		});
	}
	return stats;
}

function HeroFactory(type, hLevel, x, y) {
	
	const baseStats = getHeroBaseStats(type);
	const upgradedStats = buildDictionary(getHeroUpgradedStats(type, hLevel), "stat", "prod");
	
	const finalStats = { };
	Object.assign(finalStats, baseStats, upgradedStats);
	
	let deathValue = ((2*hLevel)**2)+(hLevel*4)+8;;
	if(level >= achievements.maxLevelCleared.count) {
		deathValue *= 5;
	}
	stats.incrementDeployCount(type);
	
	const newHero = new Hero(type, hLevel, finalStats.symbol, deathValue, finalStats.canHitAir, finalStats.canHitGround,
	    finalStats.health/statAdjustments.health,
	    finalStats.regen/statAdjustments.regen,
	    finalStats.damage/statAdjustments.damage,
	    finalStats.moveSpeed/statAdjustments.moveSpeed,
	    finalStats.attackDelay/statAdjustments.attackDelay,
	    finalStats.projectileSpeed/statAdjustments.projectileSpeed,
	    finalStats.projectileType,
	    finalStats.attackRange/statAdjustments.attackRange,
	    finalStats.attackCharges/statAdjustments.attackCharges,
		finalStats.chainRange/statAdjustments.chainRange,
		finalStats.chainReduction/statAdjustments.chainReduction,
	    finalStats.impactRadius/statAdjustments.impactRadius,
	    finalStats.targetCount,
		
	finalStats.heroPowerType, x, y, finalStats.color, finalStats.color2);
	
	
	return newHero;
}

function Hero(type, level, symbol, deathValue, canHitAir, canHitGround,  health, regen, damage, moveSpeed, attackDelay, projectileSpeed, projectileType, attackRange, attackCharges, chainRange, chainReduction, impactRadius, targetCount, heroPowerType, x, y, color, color2) {
	this.type = type;
	this.level = level;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||5;
	this.maxHealth = health*4;
	this.regen = regen;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed;
	this.attackDelay = attackDelay||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.ballistic;
	this.attackRange = attackRange||1;
	this.Location = new point(x, y);
	this.home = new point(x, y);
	this.moveSpeedMultiplier = 1;
	this.attackDelayMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.color2 = color2;
	this.attackCharges = attackCharges||1;
	this.chainRange = chainRange||0;
	this.chainReduction = chainReduction||0;
	this.impactRadius = impactRadius||1;
	this.targetCount = targetCount||1;
	
	this.heroPowerType = heroPowerType;
	this.heroPowerValues = [];
	for(let i=0;i<heroPowerType.effects.length;i++) {
		const hpte = heroPowerType.effects[i];
		this.heroPowerValues.push({
			type:hpte.effectType,
			mPower: hpte.mBase * hpte.mMultiplier**level,
			aPower: hpte.aBase * hpte.aMultiplier**level
		});
	}
	
	this.lastAttack = this.attackDelay;
	this.wanderDirection = 1;
	this.patrolX = x;
	if(type == "Knight") { this.patrolX-=pathL*2; }
	else if(type == "Mage") { this.patrolX+=pathL*2; }
	
	this.symbol = symbol;
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 1;
	
	this.effects = new UnitEffects();
	this.drawCycle = 0;
	this.moving=0;
	this.moveTarget = new point(x-5,y);
	
	this.uid = "H_" + (new Date()%10000) + type.charAt(0);
}

function getHeroSize(uid) {
	if(hero && hero.uid == uid) { return getScale()/2; }
	if(squire && squire.uid == uid) { return getScale()/3; }
	if(page && page.uid == uid) { return getScale()/4; }
}
function getHeroFontSize(uid) {
	if(hero && hero.uid == uid) { return "bold 20pt Arial"; }
	if(squire && squire.uid == uid) { return "bold 15pt Arial"; }
	if(page && page.uid == uid) { return "bold 10pt Arial"; }
}

Hero.prototype.CalculateEffect = function(statType) {
	const baseValue = this[statType];
	if(baseValue == null) { return; }
	if(statType==statTypes.heath) {
		result = Math.max(this.maxHealth, result);
	}
	
	return this.effects.CalculateEffectByName(statType, baseValue)
}
Hero.prototype.DoHealing = function() {
	if(this.regen && this.health < this.maxHealth/4
		&& !this.effects.effects.some(x=>x.type==effectType.curse&&x.name==statTypes.health)) {
		this.health += this.regen;
	}
	
	this.health = this.effects.DotsAndHots(this.health, this.maxHealth, this.type);
}
Hero.prototype.Recenter = function(RecenterDelta) {
	this.Location.x -= RecenterDelta;
	this.home.x -= RecenterDelta;
	this.home.y = getPathYatX(this.home.x);
	this.patrolX -= RecenterDelta;
	this.moveTarget.x -= RecenterDelta;
}

Hero.prototype.Move = function() {
	let moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	//Go towards the leader if in range or passed
	const territoryX = endZoneStartX() - (pathL*12);
	
	if(leadInvader != null && leadInvader.Location.x > territoryX) {
		//if leader is in range don't move.
		const range = this.CalculateEffect(statTypes.attackRange);
		const deltaX = Math.abs(this.Location.x - leadInvader.Location.x);
		const deltaY = Math.abs(this.Location.y - leadInvader.Location.y);
		if(deltaX < range && deltaY < range && inRange(leadInvader.Location, this.Location, range)) { 
			this.moving = false;
			return; 
		}
		
		//pursue leader
		this.moveTarget = new point(leadInvader.Location.x, leadInvader.Location.y);
	}
	else if(Math.abs(this.Location.x - this.patrolX) > moveSpeed/2) {
		//go home
		this.home.y = getPathYatX(this.home.x);//reset home.y seems to get off sometimes.
		this.moveTarget = new point(this.patrolX, this.home.y);
	}
	else{
		//wander
		if(this.home.y - this.Location.y > gameH/4) {
			this.wanderDirection = 1;
		}
		else if(this.Location.y - this.home.y > gameH/4) {
			this.wanderDirection = -1;
		}
		
		const y = this.Location.y + (pathL * this.wanderDirection);
		this.moveTarget = new point(this.patrolX, y);
		moveSpeed/=4;
		this.moving=.25;
	}
	
	const newLocation = calcMove(moveSpeed, this.Location, this.moveTarget);
	if(newLocation.equals(this.Location)) {
		this.moving = false;
		return;
	}
	this.Location = newLocation;
}
Hero.prototype.Draw = function() {
	const color = isColorblind() ? GetColorblindColor() : this.color;
	const color2 = isColorblind() ? GetColorblindBackgroundColor() : this.color2;
	
	if(isColorblind()) {
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
		ctx.lineWidth=2;
		
		const r = getHeroSize(this.uid);
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, r, 0, twoPi);
		ctx.fill();
		ctx.stroke();
		
		if(Quality >= 2) {
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.font =  getHeroFontSize(this.uid);
			const size = ctx.measureText(this.symbol);
			const w = size.width;
			const h = size.fontBoundingBoxAscent;
			ctx.fillText(this.symbol, this.Location.x-(w/2), this.Location.y+(h/2));
			ctx.font = "bold 12pt Arial"
		}
	}
	
	this.DrawHUD(color, color2);
}

Hero.prototype.DrawHUD = function(color, color2) {
	color = color || "#000";
	color2 = color2 || "#FFF";
	
	if(getUIElement("chkDefenderLevel").checked) {
		ctx.font = "bold 12pt Arial"
		const lText = this.level||"0";
		const lSize = ctx.measureText(lText);
		const lW = lSize.width;
		const lH = lSize.actualBoundingBoxAscent;
		const lX = this.Location.x+(getScale()/2);
		const lY = this.Location.y;
		
		ctx.fillStyle=color2;
		ctx.fillRect(lX-1,lY-(lH/2)-2,lW+2,lH+4);
		ctx.fillStyle=color;
		ctx.fillText(lText, lX, lY+5);
	}
	
	const gaugesChecked = GetGaugesCheckedForUnitType("Hero");
	if(gaugesChecked.Range) {
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, this.CalculateEffect(statTypes.attackRange), 0, twoPi);
		ctx.stroke();
	}
	if(gaugesChecked.Reload) {
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=2;
		ctx.beginPath();
		const percent = this.lastAttack>0 ? this.lastAttack/this.attackDelay : -this.lastAttack/(this.attackDelay);
		ctx.arc(this.Location.x, this.Location.y, pathL*1.5, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health) {
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = this.health.toFixed(1);
		const w = ctx.measureText(hp).width
		const x = this.Location.x -(w>>1);
		const y = this.Location.y-getScale();
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(hp, x, y);
	}
	if(gaugesChecked.Damage) {
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
Hero.prototype.DrawAura = function() {
	const gaugesChecked = GetGaugesCheckedForUnitType("Hero");
	if(gaugesChecked.Range) {
		
		const x = this.Location.x - this.AuraRange();
		const w = this.AuraRange() * 2;
		const color = isColorblind() ? GetColorblindColor() : this.color;
		
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.arc(this.Location.x, this.Location.y, this.AuraRange(), 0, twoPi);
		ctx.fill();
		ctx.closePath();
	}
}
Hero.prototype.AuraRange = function() { return this.attackRange*getScale()*2; }
Hero.prototype.Aim = function() {
	this.lastAttack += this.effects.CalculateEffectByName(statTypes.attackRate, 1);
	this.lastAttack = Math.min(this.attackDelay, this.lastAttack);
	const range = this.CalculateEffect(statTypes.attackRange);
	
	
	const targets = [];
	for(let i = 0; i< team0.length;i++) {
		if(targets.length >= this.targetCount) { break; }
		const target = team0[i];
		
		//cheap check
		const deltaX = Math.abs(this.Location.x - target.Location.x);
		const deltaY = Math.abs(this.Location.y - target.Location.y);
		if(deltaX < range && deltaY < range && inRange(target.Location, this.Location, range))
		{
			targets.push(target);
		}
	}
	if(targets.length > 0) {
		if(!this.moving) {
			this.moveTarget = new point(targets[0].Location.x, targets[0].Location.y);
		}
		this.Attack(targets);
	}
	return targets.some(x => x.uid === leadInvader.uid || x.Location.x === leadInvader.Location.x);
}
Hero.prototype.Attack = function (targets) {
	if(this.lastAttack < this.attackDelay || targets.length === 0) { return; }
	
	for(let i=0;i<targets.length;i++) {
		const target = targets[i];
		
		const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
		const newProjectile = new Projectile(this.Location, this.type, loc, target.uid, this.uid, this.projectileSpeed, this.CalculateEffect(statTypes.damage), null,
  			this.attackCharges||0, this.chainRange||0, this.chainReduction||0,
		this.impactRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType);
		projectiles.push(newProjectile);
	};
	this.lastAttack = 0;
}
Hero.prototype.DeathEffect = function() { }
Hero.prototype.Aura = function() {
	const auraPowers = this.heroPowerValues;
	
	const range = this.AuraRange();
	const minX = this.Location.x - range;
	const maxX = this.Location.x + range;
	
	
	for(let i=0;i<auraPowers.length;i++) {
		const aPower = auraPowers[i].aPower;
		const mPower = auraPowers[i].mPower;
		const statType = auraPowers[i].type;
		
		for(let j=0; j< team1.length;j++) {
			
			if(team1[j].Location.x > minX && team1[j].Location.x < maxX) {
				if(inRange(team1[j].Location, this.Location, range)) {
					team1[j].effects.AddEffect(this.type, statType, effectType.blessing, 1, mPower, aPower);
				}
			}
		}
	}
}
Hero.prototype.TakeDamage = function(damage) {
	damage = this.effects.CalculateEffectByName(statTypes.damageReduction, damage)
	damage = Math.max(0, damage);
	
	const output = Math.min(damage, this.health);
	this.health -= damage;
	return output;
}
