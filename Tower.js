"use strict";

const towerPassiveRegen = .0005;
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
	const lastTowerX = (lastTower ? lastTower.Location.x : pathL);
	const lastTowerPaths = lastTowerX / pathL;
	
	let levelEndPaths = LevelToTotalPaths(+level + 1) - totalPaths;
	while(levelEndPaths < lastTowerPaths){levelEndPaths += PathsPerLevel;}
	const remaining = levelEndPaths - lastTowerPaths;

	const towerSpacing = Math.ceil(Math.max(.1 * remaining, .5) * pathL);
	const newTowerX = lastTowerX + towerSpacing;
	
	if(path[path.length - 1].x < newTowerX){ return; }
	
	const type = getNextTowerType();
	let tLevel = level;
	const buffer = getScale()/2;
	while(getEndOfLevelX(tLevel)+buffer<newTowerX){tLevel++;}
	const newTower = TowerFactory(type, tLevel, newTowerX);
	stats.incrementDeployCount(type);
	towers.push(newTower);

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
	const multipliers = getTowerLevelMultipliers(type);

	const stats = [];
	for(let stat in statTypes){
		const base = baseStats[stat] || '-';
		const mult = multipliers[stat] || '-';

		const equippedEffect = getEquippedEffect(type, stat);
		let calculated = (base+equippedEffect.a)*equippedEffect.m;
		
		if(mult != '-'){
		  calculated*=mult**level;
		}
		
		if(statMaxLimits.hasOwnProperty(stat)){
		  calculated = Math.min(statMaxLimits[stat]*1.25, calculated);
		}
		if(statMinLimits.hasOwnProperty(stat)){
		  calculated = Math.max(statMinLimits[stat]*.75, calculated);
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
	return stats;
}
function generateTowerUid(c){
	const a = "T_" + (new Date()%10000) + ":" + c;
	let b = 0;
	
	let matches = towers.filter(x => x.uid == (a+b));
	while(matches.length){
		b++;
		matches = towers.filter(x => x.uid == (a+b));
	}
	return a+b;
}
function BuildTowerAttackEffect(unitType, base, level){
	if(base.attackEffect == null){return null;}
	let attackEffect = [];
	
	for(let i=0;i<base.attackEffect.length;i++){
  	const aPower = base.attackEffect[i].aBase*base.attackEffect[i].levelMultiplier**level;
  	const mPower = base.attackEffect[i].mBase*base.attackEffect[i].levelMultiplier**level;
  	const effect = new UnitEffect(unitType, base.attackEffect[i].name, effectType.curse, base.attackEffect[i].defaultDuration, mPower, aPower);
	  attackEffect.push(effect);
	}
  return attackEffect;
}

function getTowerY(x,r){
	const py = getPathYatX(x);
	
	const hew = pathW*.4;
	let temp = Math.max(r, hew);

  const minY = Math.max(getScale(), py-temp);
  const maxY = Math.min(gameH-getScale(), py+temp);
  const exclusions = {min:py-hew,max:py+hew};

	const y = getRandomIntExclusions(minY, maxY, exclusions);

  return y;
}

function TowerFactory(type, level, x){
	const baseStats = getTowerBaseStats(type);
	const upgradedStats = buildDictionary(getTowerUpgradedStats(type), "stat", "prod");

	const finalStats = {};
	Object.assign(finalStats, baseStats, upgradedStats);
	const r = (finalStats.attackRange/statAdjustments.attackRange * getScale()) + (getScale());
	const y = getTowerY(x,r);

	let attackEffect = BuildTowerAttackEffect(type, baseStats, level);
  
  const equipmentEffect = getEquippedEffect("a", "gain");
	let deathValue = (2**level)+(level**2)+(level);
	deathValue += equipmentEffect.a;
	deathValue *= equipmentEffect.m;
	if(level >= achievements.maxLevelCleared.count){
	  deathValue *= 2;
	}
	
	const newTower = new Tower(level, type, deathValue, finalStats.canHitAir, finalStats.canHitGround,
	    finalStats.health/statAdjustments.health,
	    finalStats.damage/statAdjustments.damage,
	    finalStats.targetCount/statAdjustments.targetCount,
	    attackEffect,
	    finalStats.attackRate/statAdjustments.attackRate,
	    finalStats.projectileSpeed/statAdjustments.projectileSpeed,
			finalStats.projectileType,
			finalStats.attackRange/statAdjustments.attackRange,
			finalStats.attackCharges/statAdjustments.attackCharges,
			finalStats.chainRange/statAdjustments.chainRange,
			finalStats.chainDamageReduction/statAdjustments.chainDamageReduction,
			finalStats.impactRadius/statAdjustments.impactRadius,
			x, y, finalStats.color, finalStats.color2);
			
	return newTower;
}

function Tower(level, type, deathValue, canHitAir, canHitGround, health, damage, targetCount, attackEffect, attackRate, projectileSpeed, projectileType, attackRange, attackCharges, chainRange, chainDamageReduction, impactRadius, x, y, color, color2){
	this.level = level;
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
	this.projectileType = projectileType||projectileTypes.ballistic;
	this.attackRange = attackRange||1;
	this.Location = new point(x,y);
	this.color = color;
	this.color2 = color2;
	this.attackCharges = Math.floor(attackCharges||0);
	this.chainRange = chainRange||0;
	this.chainDamageReduction = chainDamageReduction||0;
	this.impactRadius = impactRadius||1;
	
	this.lastAttack = this.attackRate;
	this.team = 1;
	this.regen = towerPassiveRegen*((level)<<5);
	
	this.effects = new UnitEffects();

	this.uid = generateTowerUid(type.charAt(0));
}

Tower.prototype.CalculateEffect = function(statType){
	const baseValue = this[statType];
	if(baseValue == null){return;}
  if(statType==statTypes.heath){
    result = Math.max(this.maxHealth, result);
  }

	return this.effects.CalculateEffectByName(statType, baseValue)
}
Tower.prototype.DoHealing = function(){
	this.health = Math.min(this.maxHealth>>1, this.health+this.regen);//passive Tower healing
	const newHealth = this.effects.DotsAndHots(this.health, this.maxHealth, this.type);
	this.health = newHealth;
}
Tower.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta;
}

Tower.prototype.Draw = function(){
  ctx.save();
	const color = isColorblind() ? GetColorblindColor() : this.color;
	const color2 = isColorblind() ? GetColorblindBackgroundColor() : this.color2;
	const sideLen = getScale()/3;

	if(isColorblind()){
		const c = this.type.charAt(0);
		ctx.font = "10pt Helvetica";
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.fillRect(this.Location.x, this.Location.y, 3, 3);
		ctx.fillText(c,this.Location.x,this.Location.y);
		
		this.DrawHUD();
		ctx.closePath();
		return;
	}

	ctx.strokeStyle=color;
	ctx.fillStyle=color2;
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
	ctx.closePath();
	
	this.DrawHUD(color, color2);
	ctx.restore();
}

Tower.prototype.DrawHUD = function(color, color2){
  color = color || "#000";
  color2 = color2 || "#FFF";

  const sideLen = getScale()*3/8;
  
  if(getUIElement("chkDefenderLevel").checked){
  	const lText = this.level||"0";
  	const lSize = ctx.measureText(lText);
  	const lW = lSize.width;
  	const lH = lSize.actualBoundingBoxAscent;
    const lX = this.Location.x+(sideLen);
    const lY = this.Location.y;
    
  	ctx.fillStyle=color2;
  	ctx.fillRect(lX-1,lY+(sideLen/2),lW+(lH/2),-sideLen);
  	ctx.fillStyle=color;
  	ctx.fillText(lText, lX, lY+5);
  }

  
	const gaugesChecked = GetGaugesCheckedForUnitType("Tower");
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
		const percent = this.lastAttack>0 ? this.lastAttack/this.attackRate : -this.lastAttack/(this.attackRate-this.lastAttack);
		ctx.arc(this.Location.x, this.Location.y, sideLen*2, -halfPi, (percent*twoPi)-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = (Math.ceil(this.health * 10) / 10).toFixed(1);
		const s = ctx.measureText(hp)
		const w = s.width
		const h = s.actualBoundingBoxAscent
		const x = (this.Location.y < sideLen) ? this.Location.x-w-sideLen : this.Location.x -(w/2);
		const y = (this.Location.y < sideLen) ? this.Location.y+h : this.Location.y-sideLen;
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-h-2,w+3,h+2);
		ctx.fillStyle=color;
		ctx.fillText(hp, x-1, y-1);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const dmg = Math.ceil(this.CalculateEffect(statTypes.damage) * 10) / 10;
		const text = (this.targetCount <= 1 ? "" : Math.floor(this.targetCount) + "x") + dmg + (this.attackCharges <= 1 ? "" : "..." + Math.floor(this.attackCharges));
		const s = ctx.measureText(text)
		const w = s.width
		const h = s.actualBoundingBoxAscent
		const x = (this.Location.y > gameH-sideLen) ? this.Location.x + sideLen : this.Location.x -(w/2);
		const y = (this.Location.y > gameH-sideLen) ? this.Location.y : this.Location.y+sideLen+h;
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-h-1,w+3,h+3);
		ctx.fillStyle=color;
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Tower.prototype.Aim = function() {
	this.lastAttack += this.effects.CalculateEffectByName(statTypes.attackRate, 1);
	this.lastAttack = Math.min(this.attackRate, this.lastAttack);
	
	const targets = [];
	//Attacks the leader if in range
	for(let i = 0; i< team0Order.length;i++){
		if(team0Order[i] > team0.length){ continue; }
		const target = team0[team0Order[i]];

		if(target.isFlying && !this.canHitAir){continue;}
		if(!target.isFlying && !this.canHitGround){continue;}
		
		//cheap check
		const range = this.CalculateEffect(statTypes.attackRange);
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
	if(this.lastAttack < this.attackRate){return;}
	
	for(let i=0;i<targets.length;i++){
		const target = targets[i];
		
		const newProjectile = new Projectile(this.Location, this.type, target.Location, target.uid, this.uid, this.projectileSpeed, this.CalculateEffect(statTypes.damage), this.attackEffect,
								this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
								this.impactRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType);
		projectiles.push(newProjectile);
	}

	this.lastAttack = 0;
}
Tower.prototype.TakeDamage = function(damage) {
	if(this.Location.x > endZoneStartX() && this.Location.x < levelEndX){
		const maxLevel = achievements.maxLevelCleared.count;
		const DR = Math.max(0, level - (maxLevel>>1));
		damage = Math.max(0, damage - DR);
	}
	damage = this.effects.CalculateEffectByName(statTypes.damageReduction, damage)
	damage = Math.max(0, damage);
	
	const output = Math.min(damage, this.health);
	this.health -= damage;
	return output;
}