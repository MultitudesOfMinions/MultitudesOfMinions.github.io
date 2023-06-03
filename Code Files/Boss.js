
function manageBoss() {
	if(!tierUnlocked(2)) { boss = null; }
	if(boss === null) {
		if(activeBoss() != "none") {
			spawnBoss();
		}
		const divBossEffects=getUIElement("divBossEffects");
		if(divBossEffects.childNodes.length > 0) {
			clearChildren(divBossEffects);
		}
		return;
	}
	
	if(boss.Location.x < langoliers || boss.health <= 0) {
		boss = null;
	}
	else{
		if(!boss.Aim() || boss.Location.x < 0) {
			boss.Move();
		}
		else{
			boss.moving = false;
		}
		if(boss.remainingDuration >= 0) {
			if(boss.type === "War"){
				for(let i=0;i<boss.effects.effects.length;i++){
					if(boss.effects.effects[i].type === 1){
						boss.effects.effects[i].duration = -1;
					}
				}
			}
			boss.remainingDuration--;
		}
		else if(boss.lastActiveAbility >= boss.abilityCooldown && autoCastAbility()) {
			bossActivateAbility();
		}
		else {
			boss.lastActiveAbility = Math.min(boss.lastActiveAbility+1, boss.abilityCooldown);
		}
		
		boss.DoHealing();
		boss.Aura();
		boss.effects.ManageEffects(true);
	}
}
function spawnBoss() {
	if(boss != null) { return; }
	
	const type = activeBoss();
	if(type == "none") { return; }
	bossResearch[type].lastSpawn++;
	if(bossResearch[type].lastSpawn >= getBossSpawnDelay(type)) {
		addBoss();
		bossResearch[type].lastSpawn = 0;
	}
}
function getBossSpawnDelay(type) {
	if(type == "none") { return -1; }
	const base = getBossBaseStats(type).spawnDelay;
	const boost = 1/getBossBoost();
	const attr = getEquippedEffect("Boss", statTypes.spawnDelay);
	return (base + attr.a) * attr.m * boost;
}
function addBoss() {
	boss = BossFactory();
	achievements.bossesSummoned.count++;
	stats.incrementDeployCount(boss.type);
}
function drawBossAura() {
	if(boss && boss.health >= 0) {
		boss.DrawAura();
	}
}
function activeBoss() {
	if(!tierUnlocked(2)) { return "none"; }
	
	const rdo = document.querySelector("input[name='bossSelect']:checked");
	if(rdo == null) { return "none"; }
	return rdo.value;
}
function getBossBaseStats(type) {
	const baseStats = { };
	Object.assign(baseStats, baseBossDefault, baseBoss[type]);
	
	return baseStats;
}
function getBossUpgradeMultipliers(type) {
	const upgradeMultipliers = { };
	Object.assign(upgradeMultipliers, bossUpgradeMultipliersDefault, bossUpgradeMultipliers[type]);
	
	return upgradeMultipliers;
}
function getBossUpgradedStats(type) {
	const baseStats = getBossBaseStats(type);
	const multipliers = getBossUpgradeMultipliers(type);
	const upgrades = bossUpgrades[type];
	const pot = getUpgradePotency(3);
	const featBoost = getBossBoost();
	
	const stats = [];
	for(let stat in statTypes) {
		const base = baseStats[stat] || '-';
		let mult = multipliers[stat] || '-';
		
		const upg = (upgrades[stat]*pot) || '-';
		const bossItemEffect = getEquippedEffect("Boss", stat);
		
		let calculated = (base+bossItemEffect.a)*bossItemEffect.m;
		if(stat !== statTypes.chainReduction) {
			if(backwardsStats.includes(stat)) {
				calculated /= featBoost;
			}
			else{
				calculated *= featBoost;
			}
		}
		
		if(!isNaN(mult)&&!isNaN(upg)) {
			const limit = 48;
			let m = mult;
			let u = upg;
			while(u>limit) {
				calculated*=m**limit;
				m=((m-1)*.8)+1;
				u-=limit;
			}
			if(u>0) {
				calculated*=m**u;
			}    }
			
			if(statMaxLimits.hasOwnProperty(stat)) {
				calculated = Math.min(statMaxLimits[stat], calculated);
			}
			if(statMinLimits.hasOwnProperty(stat)) {
				calculated = Math.max(statMinLimits[stat], calculated);
			}
			
			const prod = flooredStats.includes(stat) ? Math.floor(calculated) : Math.floor(calculated*100)/100;
			if(isNaN(prod)) { continue; }
			
			
			stats.push({
				stat:stat,
				base:base,
				mult:mult,
				upg:upg,
				bonus:featBoost,
				prod:prod
			});
	}
	return stats;
}
function getBossMoveTarget() {
	const x = (+document.getElementById("bossPosition").value) * ((leaderPoint+pathL) / 25);
	const y = getPathYatX(x);
	
	return new point(x,y);;
}
function bossActivateAbility() {
	if(boss == null) { return; }
	if(boss.lastActiveAbility < boss.abilityCooldown) { return; }
	
	boss.ActiveAbilityStart();
}

function BossFactory() {
	const type = activeBoss();
	
	const baseStats = getBossBaseStats(type);
	const upgradedStats = buildDictionary(getBossUpgradedStats(type), "stat", "prod");
	
	const bossStats = { };
	Object.assign(bossStats, baseStats, upgradedStats);
	
	
	const symbol = bossStats.symbol;
	
	const newBoss = new Boss(type, symbol,
		bossStats.health/statAdjustments.health,
		bossStats.damage/statAdjustments.damage,
		bossStats.moveSpeed/statAdjustments.moveSpeed,
		bossStats.attackDelay/statAdjustments.attackDelay,
		bossStats.impactRadius/statAdjustments.impactRadius,
		bossStats.projectileSpeed/statAdjustments.projectileSpeed,
		bossStats.attackRange/statAdjustments.attackRange,
		bossStats.targetCount/statAdjustments.targetCount,
		bossStats.attackCharges/statAdjustments.attackCharges,
		bossStats.chainRange/statAdjustments.chainRange,
		bossStats.chainReduction/statAdjustments.chainReduction,
		bossStats.regen/statAdjustments.regen,
		
		bossStats.auraRange/statAdjustments.auraRange,
		bossStats.auraPower/statAdjustments.auraPower,
		
		bossStats.abilityCooldown/statAdjustments.abilityCooldown,
		bossStats.abilityDuration/statAdjustments.abilityDuration,
		
		bossStats.projectileType,
		bossStats.isFlying,
		bossStats.color,
	bossStats.color2);
	
	return newBoss;
}

function Boss(type, symbol, health, damage, moveSpeed, attackDelay, impactRadius, projectileSpeed, attackRange, targetCount, attackCharges, chainRange, chainReduction, regen, auraRange, auraPower, abilityCooldown, abilityDuration, projectileType, isFlying, color, color2) {
	this.type = type;
	this.symbol = symbol;
	this.health = health||10;
	this.maxHealth = health*4;
	this.damage = damage||0;
	this.moveSpeed = Math.min(moveSpeed||1, 300);
	this.isFlying = isFlying;
	this.attackDelay = attackDelay||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.ballistic;
	this.attackRange = attackRange||1;
	this.targetCount = targetCount||1;
	this.attackCharges = attackCharges||1;
	this.chainRange = chainRange||1;
	this.chainReduction = chainReduction||0;
	this.impactRadius = impactRadius||0;
	this.Location = new point(path[1].x, path[1].y);
	this.regen = regen;
	
	this.auraPower = auraPower;
	this.auraRange = auraRange;
	this.abilityCooldown = abilityCooldown;
	this.abilityDuration = abilityDuration;
	this.lastActiveAbility = abilityCooldown;
	this.remainingDuration = 0;
	
	this.color = color;
	this.color2 = color2;
	
	this.lastAttack = attackDelay;
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;
	
	this.effects = new UnitEffects();
	this.attackEffects = [];
	if(type === "Pestilence") {
		const divisor = 1000;
		const dot = this.damage/divisor*-1;
		this.attackEffects.push(new UnitEffect(this.type, statTypes.health, effectType.curse, divisor/2, null, dot));
	}
	if(type === "War") {
		this.impactRadius = this.attackRange;
	}
	
	this.drawCycle = 0;
	this.moving=0;
	this.moveTarget = new point(0,0);
	this.attackHand = 0;
	
	this.uid = "B_" + (new Date()%10000);
}

Boss.prototype.CalculateEffect = function(statType) {
	const baseValue = this[statType];
	if(baseValue == null) { return; }
	
	let result = this.effects.CalculateEffectByName(statType, baseValue);
	if(statType==statTypes.heath) {
		result = Math.max(this.maxHealth, result);
	}
	
	if(statType==="moveSpeed" && this.Location.x < -pathL) {
		const moveBonus = (this.Location.x)/pathL;
		result *= moveBonus**2;
	}
	
	return result;
}
Boss.prototype.DoHealing = function() {
	if(this.regen && this.health < this.maxHealth/4) {
		this.health += this.regen;
	}
	
	this.health = this.effects.DotsAndHots(this.health, this.maxHealth, this.type);
}

Boss.prototype.Recenter = function(RecenterDelta) {
	this.Location.x -= RecenterDelta;
}

Boss.prototype.Move = function() {
	if(isNaN(this.Location.x)) {
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}
	
	const targetX = getBossMoveTarget().x;
	let moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	
	const deltaX = Math.abs(targetX - this.Location.x);
	if(deltaX < moveSpeed/2) {
		this.Location.x = targetX;
		this.moving = false;
		return;
	}
	
	if(this.Location.x == targetX) { 
		this.moving = false;
		return; 
	}
	
	let i = 1;
	while(path[i].x <= this.Location.x && i < path.length) { i++; }
	i--;
	
	const direction = targetX < this.Location.x ? -3 : 3;
	if(targetX < this.Location.x) {
		moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	}
	const temp = Math.max(0, i+direction);
	let target = new point(path[temp].x, path[temp].y);
	//if war active just charge the defender
	if(direction>0&&this.type === "War" && this.remainingDuration>0) {
		target = team1.find(x=>x.Location.x>this.Location.x).Location;
		if(target.x > levelEndX) {
			if(hero) { target = hero.Location; }
			else if(squire) { target = squire.Location; }
			else if(page) { target = page.Location; }
			
			if(inRange(target, this.Location, this.CalculateEffect(statTypes.attackRange))) {
				this.moving = false;
				return;
			}
		}
		if(target.x-this.Location.x<moveSpeed) {
			this.lastAttack=this.attackDelay;
		}
	}
	
	this.moveTarget = target;
	const newLocation = calcMove(moveSpeed, this.Location, target)
	newLocation.x = Math.min(newLocation.x, levelEndX);
	this.moving = !this.Location.equals(newLocation);
	this.Location = newLocation;
}
Boss.prototype.Draw = function() {
	const color = isColorblind() ? GetColorblindColor() : this.color;
	const color2 = isColorblind() ? GetColorblindBackgroundColor() : this.color2;
	
	if(isColorblind()) {
		const c = this.type.charAt(0);
		ctx.font = "bold 20pt Arial";
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.fillRect(this.Location.x, this.Location.y, 3, 3);
		ctx.fillText(c,this.Location.x,this.Location.y);
		
		this.DrawHUD();
		ctx.closePath();
		return;
	}
	
	if(Quality > 0) {
		ctx.lineWidth=2;
		ctx.fillStyle=color2;
		ctx.strokeStyle=color;
		
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, pathL, 0, twoPi);
		ctx.fill();
		ctx.stroke();
	}
	if(Quality > 1) {
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.font = "bold 20pt Arial"
		const size = ctx.measureText(this.symbol);
		const w = size.width;
		ctx.fillText(this.symbol, this.Location.x-(w/2), this.Location.y+10);
		ctx.font = "bold 12pt Arial"
	}
	ctx.closePath();
	
	this.DrawHUD(color, color2);
}

Boss.prototype.DrawHUD = function(color, color2) {
	color = color || "#000";
	color2 = color2 || "#FFF";
	
	const gaugesChecked = GetGaugesCheckedForUnitType("Boss");
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
		const percent = this.lastAttack/this.attackDelay;
		ctx.arc(this.Location.x, this.Location.y, pathL*1.5, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health) {
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = Math.ceil(this.health * 10) / 10;
		const w = ctx.measureText(hp).width;
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y-getScale();
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(hp,x,y);
	}
	if(gaugesChecked.Damage) {
		ctx.beginPath();
		const dmg = Math.floor(this.CalculateEffect(statTypes.damage) * 10)/10;
		const text = (this.targetCount <= 1 ? "" : Math.floor(this.targetCount) + "x") + dmg + (this.attackCharges <= 1 ? "" : "..." + Math.floor(this.attackCharges));;
		
		const w = ctx.measureText(text).width
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y+getScale();
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Boss.prototype.DrawAura = function() {
	const gaugesChecked = GetGaugesCheckedForUnitType("Boss");
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
Boss.prototype.AuraRange = function() { return this.auraRange*getScale(); }
Boss.prototype.Aim = function () {
	this.lastAttack += this.effects.CalculateEffectByName(statTypes.attackRate, 1);
	this.lastAttack = Math.min(this.attackDelay, this.lastAttack);
	const range = this.CalculateEffect(statTypes.attackRange);
	const tc = this.targetCount;
	
	const targets = [];
	for(let i=0;i<team1.length;i++) {
		if(targets.length >= tc) { break; }
		const target = team1[i];
		
		const deltaX = Math.abs(this.Location.x - target.Location.x);
		const deltaY = Math.abs(this.Location.y - target.Location.y);
		if(deltaX < range && deltaY < range && inRange(target.Location, this.Location, range))
		{
			targets.push(target);
		}
	}
	
	if(targets.length > 0) {
		this.Attack(targets);
		if(!this.moving) {
			this.moveTarget = new point(targets[0].Location.x, targets[0].Location.y);
		}
	}
	
	return targets.length >= this.targetCount;
}
Boss.prototype.Attack = function (targets) {
	if(this.lastAttack < this.attackDelay) { return; }
	for(let i=0;i<targets.length;i++) {
		const target = targets[i];
		
		
		let damage = this.CalculateEffect(statTypes.damage);
		if(this.type == "War") {
			const bsd = getBossSpawnDelay("War");
			bossResearch.War.lastSpawn += bsd / 128;
			bossResearch.War.lastSpawn = Math.min(bsd, bossResearch.War.lastSpawn);
		}
		else if(this.type == "Famine") {
			const penalty =  (target.attackDelay>>2)*3;
			target.lastAttack -= penalty;
		}
		else if(this.type === "Pestilence"){
			damage = 0;//does damage over time instead.
		}
		
		const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
		const newProjectile = new Projectile(this.Location, this.type, loc, target.uid, this.uid, this.projectileSpeed, damage, this.attackEffects,
			this.attackCharges||1, this.chainRange||0, this.chainReduction||0,
		this.impactRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType);
		
		if(this.type === "Pestilence" && this.remainingDuration > 0) {
			newProjectile.attackCharges += 3;
		}
		
		projectiles.push(newProjectile);
	}
	
	this.lastAttack = 0;
	this.attackHand = (this.attackHand+1)%2;
}
Boss.prototype.Aura = function() {
	
	const power = this.auraPower;
	const minX = this.Location.x - this.AuraRange();
	const maxX = this.Location.x + this.AuraRange();
	const duration = 1;
	
	switch(this.type) {
		case "Death": { //damage enemies
			const type = effectType.blessing;
			const name = statTypes.moveSpeed;
			const deathPower = power**.7;
			
			for(let i=0;i<minions.length;i++) {
				if(minions[i].Location.x > minX && minions[i].Location.x < maxX) {
					if( inRange(minions[i].Location, this.Location, this.AuraRange()) ) {
						minions[i].effects.AddEffect(this.type, name, type, duration, deathPower);
					}
				}
			}
			break;
		}
		case "Famine": { //dot
			const type = effectType.curse;
			const name = statTypes.health;
			const faminePower = (power**.7)/-1024;
			
			for(let i=0;i<team1.length;i++) {
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX) {
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ) {
						team1[i].effects.AddEffect(this.type, name, type, duration, null, faminePower);
					}
				}
			}
			
			break;
		}
		case "Pestilence": { //reduce enemy damage
			for(let i=0;i<team1.length;i++) {
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX) {
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ) {
						const e = team1[i].effects.effects.find(x => x.originType===this.type)
						if(e === undefined) {
							const type = effectType.curse;
							const name = statTypes.damage;
							const pestilencePower = (1/power)**.1;
							
							team1[i].effects.AddEffect(this.type, name, type, 5, pestilencePower);
						}
						else{
							e.duration = 5;
						}
					}
				}
			}
			
			break;
		}
		case "War": { //increase minion attack rate
			const type = effectType.blessing;
			const name = statTypes.attackRate;
			const warPower = power**.7;
			
			for(let i=0;i<minions.length;i++) {
				if(minions[i].Location.x > minX && minions[i].Location.x < maxX) {
					if( inRange(minions[i].Location, this.Location, this.AuraRange()) ) {
						minions[i].effects.AddEffect(this.type, name, type, duration, warPower);
					}
				}
			}
			break;
		}
		default: {
			console.warn("Unknown boss aura:" + this.type);
			break;
		}
	}
}
Boss.prototype.ActiveAbilityStart = function() {
	this.remainingDuration = this.abilityDuration;
	this.lastActiveAbility = 0;
	
	switch(this.type) {
		case "Death": { break; }
		case "Famine": {
			const faminePower = .2;
			for(let i=0;i<team1.length;i++) {
				//reset last attack and slow attack rate.
				team1[i].lastAttack=0;
				team1[i].effects.AddEffect(this.type, statTypes.attackRate, effectType.curse, this.abilityDuration+1, faminePower);
			}
			break;
		}
		case "Pestilence": {
			//increase boss attack charges/rate
			boss.effects.AddEffect(this.type, statTypes.attackRate, effectType.blessing, this.abilityDuration+1, 3);
			boss.effects.AddEffect(this.type, statTypes.attackCharges, effectType.blessing, this.abilityDuration+1, 1, 3);
			break;
		}
		case "War": {
			boss.effects.AddEffect(this.type, statTypes.moveSpeed, effectType.blessing, this.abilityDuration+1, 3);
			boss.effects.AddEffect(this.type, statTypes.attackRate, effectType.blessing, this.abilityDuration+1, 3);
			break;
		}
		default: {
			console.warn("Unknown boss ability:" + this.type);
			break;
		}
	}
}
Boss.prototype.TakeDamage = function(damage) {
	if(this.type == "War") {
		this.lastAttack += this.attackDelay;
		this.lastActiveAbility = Math.min(this.lastActiveAbility+(this.abilityCooldown/20), this.abilityCooldown)
		if(this.remainingDuration >0) {
			damage=damage>>1;
		}
	}
	
	const output = Math.min(this.health, damage);
	this.health -= damage;
	return output;
}
