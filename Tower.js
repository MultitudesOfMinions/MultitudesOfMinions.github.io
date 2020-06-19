"use strict";
function manageTowers(){
	if(towers.length > 0){
		for(let i=0; i< towers.length;i++){
			//remove stragglers
			if(towers[i].Location.x < langoliers || towers[i].health <= 0){
				if(towers[i].health <= 0){ resources.a.amt += towers[i].deathValue; }
				else { resources.a.amt += towers[i].deathValue>>2; }
				towers.splice(i,1);
				i--;
				achievements.towersDestroyed.count++;
				continue;
			}

			towers[i].Aim();
			towers[i].DoHealing();
			towers[i].effects.ManageEffects();
		}
	}
	
}
function addTower(){
	const lastTower = getLastTower();
	const lastTowerX = (lastTower ? lastTower.Location.x : 0);
	const lastTowerPaths = lastTowerX / pathL;
	
	const level = getLevelAtPathCount(lastTowerPaths + totalPaths);
	const levelStart = LevelToTotalPaths(level) - totalPaths;
	const levelEnd = LevelToTotalPaths(level + 1) - totalPaths;
	const remaining = levelEnd - lastTowerPaths;

	const towerSpacing = Math.ceil(Math.max(.1 * remaining, .5) * pathL);
	const newTowerX = lastTowerX + towerSpacing;
	
	if(path[path.length - 1].x < newTowerX){ return; }
	
	const type = getNextTowerType();
	
	const newTower = TowerFactory(type, level, newTowerX, null);
	towers[towers.length] = newTower;

}
function drawTowers() {
	for(let i=0;i<towers.length;i++){ 
		towers[i].Draw(); 
	}	
}
function getNextTowerType(){
	const weightedTowerList = [];
	
	for(let towerType in baseTower){
		const spawnWeight = getTowerBaseStats(towerType).spawnWeight;
		for(let i=0;i<spawnWeight;i++){
			weightedTowerList.push(towerType);
		}
	}
	const index = getRandomInt(0, weightedTowerList.length)

	return weightedTowerList[index];
}
function getLastTower(){
	if(!towers || !towers.length){
		return null;
	}
	
	return towers[towers.length -1]
}
function getTowerBaseStats(type){
	const baseStats = {};
	Object.assign(baseStats, baseTowerDefault, baseTower[type]);
	
	return baseStats;
}
function getTowerLevelMultipliers(type){
	const levelMultipliers = {};
	Object.assign(levelMultipliers, towerLevelMultipliersDefault, towerLevelMultipliers[type]);
	
	return levelMultipliers;
}
function getTowerUpgradedStats(type){
	const baseStats = getTowerBaseStats(type);
	const upgradeMultipliers = getTowerLevelMultipliers(type);

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

function TowerFactory(type, level, x, y){
	const base = getTowerBaseStats(type);
	const levelMultipliers = getTowerLevelMultipliers(type);
	const range = base.attackRange * levelMultipliers.attackRange**level;

	let distFromPath = 0;
	if(y == null){
		const pathY = getPathYatX(x);

		const r1 = Math.random() * (range * getScale()/2);
		const r2 = Math.random() * (range * getScale()/2);
		distFromPath = Math.max(pathW*2, r1 + r2);
		
		
		if(towers.length % 2 == 0){//above path
			y = Math.max(pathY - distFromPath, pathW);
		}
		else{//below path
			y = Math.min(pathY + distFromPath, gameH-pathW);
		}
	}
	
	const attackEffect = new UnitEffect();
	if(base.attackEffect != null){
		const power = base.attackEffect.baseValue*base.attackEffect.levelMultiplier**level;
		const attackEffect = new UnitEffect(base.attackEffect.name, effectType.condition, base.attackEffect.defaultDuration, power);
	}

	const deathValue = 8 + (level+level);
	
	const newTower = new Tower(type, deathValue, base.canHitAir, base.canHitGround,
			Math.floor(base.health * levelMultipliers.health**level), 
			Math.floor(base.damage * levelMultipliers.damage**level), 
			Math.floor(base.targetCount * levelMultipliers.targetCount**level), attackEffect,
			base.attackRate * levelMultipliers.attackRate**level, 
			base.projectileSpeed * levelMultipliers.projectileSpeed**level, 
			base.projectileType, range,
			base.attackCharges * levelMultipliers.attackCharges**level,
			base.chainRange * levelMultipliers.chainRange**level,
			base.chainDamageReduction * levelMultipliers.chainDamageReduction**level,
			base.splashRadius * levelMultipliers.splashRadius**level,
			x, y, base.color, base.color2);
			
	newTower.distFromPath = distFromPath;
	
	return newTower;
}

function Tower(type, deathValue, canHitAir, canHitGround, health, damage, targetCount, attackEffect, attackRate, projectileSpeed, projectileType, attackRange, attackCharges, chainRange, chainDamageReduction, splashRadius, x, y, color, color2){
	this.type = type;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||10;
	this.maxHealth = health*2||20;
	this.damage = damage||0;
	this.targetCount = Math.floor(targetCount);
	this.attackEffect = attackEffect;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.balistic;
	this.attackRange = attackRange||1;
	this.Location = new point(x,y);
	this.color = color;
	this.color2 = color2;
	this.attackCharges = attackCharges||0;
	this.chainRange = chainRange||0;
	this.chainDamageReduction = chainDamageReduction||0;
	this.splashRadius = splashRadius||1;
	
	this.lastAttack = this.attackRate;
	this.team = 1;
	
	this.effects = new UnitEffects();
	this.attackEffect = attackEffect;
	
	this.uid = "T_" + (new Date()%10000) + ":" + towers.length;
}

Tower.prototype.GetDamage = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.damage);
	return this.damage * effectPower;
}
Tower.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Tower.prototype.GetAttackRange = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.attackRange);
	return this.attackRange * effectPower * getScale()
}
Tower.prototype.DoHealing = function(){
	this.health = Math.min(this.maxHealth>>1, this.health+.0005);
	const effectPower = this.effects.GetEffectPowerByName(statTypes.health);
	if(effectPower == 1){return;}
	this.health = Math.min(this.maxHealth, this.health+effectPower);
}
Tower.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta; 
}

Tower.prototype.Draw = function(){
	const color = isColorblind() ? GetColorblindColor() : this.color;
	const color2 = isColorblind() ? GetColorblindBackgroundColor() : this.color2;

	if(isColorblind()){
		const c = this.type.charAt(0);
		ctx.font = "10pt Helvetica";
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.fillRect(this.Location.x, this.Location.y, 3, 3);
		ctx.fillText(c,this.Location.x,this.Location.y);
	}
	else{
		ctx.strokeStyle=color;
		ctx.fillStyle=color2;
		const sideLen = pathW;
		const lineW = sideLen/4;
		
		ctx.beginPath();
		ctx.fillRect(this.Location.x-(sideLen/2), this.Location.y-(sideLen/2), sideLen, sideLen);
		if(Quality >=2){
			ctx.beginPath();
			ctx.lineWidth=lineW;
			ctx.rect(this.Location.x-((sideLen+lineW)/2), this.Location.y-((sideLen+lineW)/2), sideLen+lineW, sideLen+lineW);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.lineWidth=lineW;
		ctx.rect(this.Location.x-(lineW/2)-1, this.Location.y-(lineW/2)-1, lineW+2, lineW+2);
		ctx.stroke();
	}

	const gaugesChecked = GetGaugesCheckedForUnitType("Tower");
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
		const percent = this.lastAttack/this.GetAttackRate();
		ctx.arc(this.Location.x, this.Location.y, pathL, -halfPi, (percent*twoPi)-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = (Math.ceil(this.health * 10) / 10).toFixed(1);
		const w = ctx.measureText(hp).width
		const x = (this.Location.y < pathL || this.Location.y > gameH-pathL) ? this.Location.x - w - pathW : this.Location.x -(w>>1);
		const y = (this.Location.y < pathL || this.Location.y > gameH-pathL) ? this.Location.y : this.Location.y-pathW;
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+2,12);
		ctx.fillStyle=color;
		ctx.fillText(hp, x, y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const dmg = Math.ceil(this.GetDamage() * 10) / 10;
		const text = dmg + (this.attackCharges <= 1 ? "" : "x" + Math.floor(this.attackCharges+1));
		const w = ctx.measureText(text).width
		const x = (this.Location.y < pathL || this.Location.y > gameH-pathL) ? this.Location.x + pathW : this.Location.x -(w>>1);
		const y = (this.Location.y < pathL || this.Location.y > gameH-pathL) ? this.Location.y : this.Location.y+(pathW*1.6);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+2,12);
		ctx.fillStyle=color;
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Tower.prototype.Aim = function() {
	const effectPower = this.effects.GetEffectPowerByName(statTypes.attackRate);
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);
	
	const targets = [];
	//Attacks the leader if in range
	for(let i = 0; i< team0Order.length;i++){
		if(team0Order[i] > team0.length){ continue; }
		const target = team0[team0Order[i]];

		if(target.isFlying && !this.canHitAir){continue;}
		if(!target.isFlying && !this.canHitGround){continue;}
		
		//cheap check
		const range = this.GetAttackRange();
		const deltaX = Math.abs(this.Location.x - target.Location.x);
		const deltaY = Math.abs(this.Location.y - target.Location.y);
		if(deltaX < range && deltaY < range)
		{
			//fancy check
			if(inRange(target.Location, this.Location, range)){
				targets.push(target);
				if(targets.length < this.targetCount){
					continue;
				}
				break;
			}
		}
	}
	if(targets.length > 0){
		this.Attack(targets);
		return true;
	}
	return false;
}
Tower.prototype.Attack = function(targets){
	if(this.lastAttack < this.GetAttackRate()){return;}
	
	for(let i=0;i<targets.length;i++){
		const target = targets[i];
		
		//const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
		projectiles[projectiles.length] = new Projectile(this.Location, target.Location, target.uid, this.uid, this.projectileSpeed, this.GetDamage(), this.attackEffect,
								this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
								this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType);
	}
							

	this.lastAttack = 0;
}
Tower.prototype.TakeDamage = function(damage) {
	if(this.Location.x > endZoneStartX() && this.Location.x < levelEndX()){
		damage = Math.max(0, damage - getLevel());
	}
	
	this.health -= damage;
}