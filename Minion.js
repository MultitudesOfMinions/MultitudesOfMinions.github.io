"use strict";
const addMinionQ = [];
const maxQ = 8;
let lastGlobalSpawn = 0;
let globalSpawnDelay = 50;
const deployList = [];
let deployDelay = 50;
let lastDeploy = 0;
function getGlobalSpawnDelay(){
	const reduction = .9**(globalSpawnDelayReduction+1);
	const distance = (totalPaths/PathsPerLevel)+1;
	return Math.max(globalSpawnDelay,globalSpawnDelay * distance * reduction);
}

function manageMinions(){
	if(minions.length === 0){
		minionOrder.length = 0;
	}
	else{
		//remove stragglers
		for(let i=0;i<minions.length;i++){
			if(minions[i].Location.x < langoliers || minions[i].health <=0){
				if(minions[i].health <= 0){
				  resources.a.amt += minions[i].deathValue;
			  	if(level >= achievements.maxLevelCleared.count){
            resources.a.amt += Math.ceil(minions[i].deathValue/2);
          }

				  
				  if(minions[i].type=="Water"){
				      const l = minions[i].Location;
				      const healEffect = new UnitEffect(statTypes.health, effectType.blessing, 3, 1, minions[i].damage);
				    	const p = new Projectile(l, "Water", l, minions[i].uid, minions[i].uid, 0, 0, healEffect, 1, 0, 0, 1, true, true, 2, projectileTypes.blast);
				    	//TODO: account for water healing in stats.
              projectiles.push(p);
				  }
				  
				}
				minions.splice(i,1);
				i--;
				
				if(boss !== null && boss.type === "Death"){
					boss.damage += 1;
				}
				
			}
		}
		
		for(let i=0;i<minions.length;i++){
			if(!minions[i].Aim()){
				minions[i].Move();
			}
			minions[i].DoHealing();
			minions[i].effects.ManageEffects();
		}
	}
	
	spawnMinions();
	deployMinion();
}
function spawnMite(){
	if(addMinionQ.length >= maxQ){return;}
	addMinionQ.push("Mite");
}
function spawnMinions(){
	if(addMinionQ.length >= maxQ && !isDeathAbilityActive()){return;}
	
	for(let minionType in minionResearch)
{
		const chk = document.getElementById("chkSpawn{0}".format(minionType))
		if(chk === null || !chk.checked || !minionResearch[minionType].isUnlocked){continue;}

		minionResearch[minionType].lastSpawn++;
		if(isDeathAbilityActive()){ minionResearch[minionType].lastSpawn+= 4}

		const spawnDelay = getMinionSpawnDelay(minionType);
		if(minionResearch[minionType].lastSpawn > spawnDelay){
  		addMinionQ.push(minionType);
  		minionResearch[minionType].lastSpawn=0;
		}
	}
}
function deployMinion(){

	if(isDeathAbilityActive()){
		while(addMinionQ.length > 0){
			const type = addMinionQ.shift();
			
    	const spawnCount = type=="Earth"?1:getMinionsPerDeploy(type);
      for(let i=0;i<spawnCount;i++){
			  minions.push(MinionFactory(type));
		  	stats.incrementUnitCount(type);
      }
		}
		return;
	}
	
	if(deployList.length > 0){
		lastDeploy++;
	  if(lastDeploy > deployDelay){
  	  const type = deployList.shift();
  	  minions.push(MinionFactory(type));
  	  stats.incrementUnitCount(type);
  	  if(!isDeathAbilityActive()){
  	    achievements.minionsSpawned.count++;
  	  }
  	  lastDeploy = 0;
    }
	}
	
	const gsd = getGlobalSpawnDelay();
	if(addMinionQ.length === 0 || getMinionCount() > getMaxMinions()-1){return;}
	lastGlobalSpawn++;
	if(lastGlobalSpawn < gsd){ return; }


  if(deployList.length === 0){
  	const type = addMinionQ.shift();
  	stats.incrementDeployCount(type);

  	const spawnCount = type=="Earth"?1:getMinionsPerDeploy(type);
  	deployList.length = spawnCount;
  	deployList.fill(type);
  	lastGlobalSpawn = 0;
  	deployDelay = (gsd*3/4) / spawnCount;
  	lastDeploy = deployDelay;
  }
}
function getMinionCount(){
	let count = 0;
	for(let i=0;i<minions.length;i++){
		const type = minions[i].type
		if(type == "Earth"){count+=1;continue;}
		count += 1 / (getMinionsPerDeploy(type));
	}
	count = Math.floor(count*10)/10;
	return count;
}
function getMinionsPerDeploy(type){
	const ee = getEquippedEffect(type, statTypes.minionsPerDeploy);
	const mpd = getMinionBaseStats(type).minionsPerDeploy + minionUpgrades[type].minionsPerDeploy;
	return (mpd+ee.a)*ee.m;
}
function getMinionSpawnDelay(type){
	
	const base = getMinionBaseStats(type).spawnDelay;
	const upgradeMultiplier = getMinionUpgradeMultipliers(type).spawnDelay;
	const itemEffect = getEquippedEffect(type, "spawnDelay");
	const upgrades = minionUpgrades[type].spawnDelay;
	
	return (base+itemEffect.a) * (upgradeMultiplier**upgrades) * itemEffect.m;
}
function getMaxMinions(){
	return 2**(maxMinions+1);
}
function getMinionBaseStats(type){
	const baseStats = {};
	Object.assign(baseStats, baseMinionDefault, baseMinion[type]);
	
	return baseStats;
}
function getMinionUpgradeMultipliers(type){
	const upgradeMultipliers = {};
	Object.assign(upgradeMultipliers, minionUpgradeMultipliersDefault, minionUpgradeMultipliers[type]);
	
	return upgradeMultipliers;
}
function getMinionUpgradedStats(type){
	const baseStats = getMinionBaseStats(type);
	const multipliers = getMinionUpgradeMultipliers(type);
	const upgrades = minionUpgrades[type];

	const stats = [];
	for(let stat in statTypes){
		const base = baseStats[stat] || '-';
		const mult = stat === "minionsPerDeploy"? "+" :  multipliers[stat] || '-';
		
		const upgT = getUpgradeTier(stat);
		const perk = getAchievementBonus("prestige"+upgT);

		const upg = upgrades[stat]+perk || '-';
		
		const equippedEffect = getEquippedEffect(type, stat);
		let calculated = (base+equippedEffect.a)*equippedEffect.m;
		
		if(stat === "minionsPerDeploy"){
		  calculated = getMinionsPerDeploy(type);
		}
		else if(upg != '-' && mult != '-'){
		  calculated*=mult**upg;
		}

		if(statMaxLimits.hasOwnProperty(stat)){
		  calculated = Math.min(statMaxLimits[stat], calculated);
		}
		if(statMinLimits.hasOwnProperty(stat)){
		  calculated = Math.max(statMinLimits[stat], calculated);
		}
		
		const prod = flooredStats.includes(stat) ? Math.floor(calculated) : Math.floor(calculated*100)/100;
		if(isNaN(prod)){continue;}

		stats.push({
			stat:stat,
			base:base,
			mult:mult,
			upg:upg,
			prod:prod
		});
	}
	return stats;
}
function clearQ(){addMinionQ.length = 0;}
function leaderUid(){
	if(minionOrder.length === 0){return null;}
	//get first one that exists incase minionOrder[0] is null;
	for(let i=0;i<minionOrder.length;i++){
		if(minions.length <= minionOrder[i]){continue;}
		return minions[minionOrder[i]].uid;
	}
}
function generateMinionUid(c){
	const a = "M_" + (new Date()%10000) + ":" + c;
	let b = 0;
	
	let matches = minions.filter(x => x.uid == (a+b));
	while(matches.length){
		b++;
		matches = minions.filter(x => x.uid === (a+b));
	}
	return a+b;
}
function getMinionDeathValue(type){
  
  if(isDeathAbilityActive()){
    return 0;
  }
  
  const scale = 2;
  let value = 0;
  for(let upgrade in minionUpgrades[type]){
    value += minionUpgrades[type][upgrade];
  }
  value = 1+(value>>scale);
  
  const equipmentEffect = getEquippedEffect("a", "gain");
  value += equipmentEffect.a;
  value *= equipmentEffect.m;
  
  if(type =="Earth"){
    getMinionBaseStats("Earth")
    value*=getMinionsPerDeploy(type);
  }

  return value;
}

function MinionFactory(type){
	
	const baseStats = getMinionBaseStats(type);
	const upgradedStats = buildDictionary(getMinionUpgradedStats(type), "stat", "prod");

	const finalStats = {};
	Object.assign(finalStats, baseStats, upgradedStats);
	
	if(type == "Earth"){
	  const a = finalStats.minionsPerDeploy;
	  finalStats.health=Math.floor(finalStats.health*(a**.8));
	  finalStats.damage=Math.floor(finalStats.damage*(a**.3));
	}

	const newMinion = new Minion(type,
	        finalStats.health/statAdjustments.health,
					finalStats.damage/statAdjustments.damage,
					finalStats.moveSpeed/statAdjustments.moveSpeed,
					finalStats.isFlying,
					finalStats.attackRate/statAdjustments.attackRate,
					finalStats.targetCount/statAdjustments.targetCount,
					finalStats.attackCharges/statAdjustments.attackCharges,
					finalStats.chainRange/statAdjustments.chainRange,
					finalStats.chainDamageReduction/statAdjustments.chainDamageReduction,
					finalStats.impactRadius/statAdjustments.impactRadius,
					finalStats.projectileSpeed/statAdjustments.projectileSpeed,
					finalStats.projectileType,
					finalStats.attackRange/statAdjustments.attackRange,
					finalStats.color,
					finalStats.color2);

	return newMinion;
	
}

function Minion(type, health, damage, moveSpeed, isFlying, attackRate, targetCount, attackCharges, chainRange, chainDamageReduction, impactRadius, projectileSpeed, projectileType, attackRange, color, color2){
	this.type = type;
	this.health = health||10;
	this.maxHealth = this.health*4;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed;
	this.isFlying = isFlying;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.balistic;
	this.attackRange = attackRange||1;
	this.targetCount = targetCount||1;
	this.attackCharges = attackCharges||1;
	this.chainRange = chainRange||0;
	this.chainDamageReduction = chainDamageReduction||0;
	this.impactRadius = impactRadius||0;
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.color2 = color2;
	
	if(isDeathAbilityActive()){
		const newX = boss.Location.x + pathL;
		const newY = getPathYatX(newX);
		this.Location = new point(newX, newY);
		this.health = 1;
		this.maxHealth = 1;
		this.moveSpeed/=2;
	}
	else if(type == "Air"){
	  const maxX = Math.min(leaderPoint*2, endZoneStartX());
	  const x = getRandomInt(0, maxX);
	  const y = getRandomInt(0, gameH);
	  
	  this.Location = new point(x, y);
	}
	else if(type == "Water"){
	  const maxX = Math.min(leaderPoint*2, endZoneStartX());
	  const minX = Math.min(pathL*8, endZoneStartX());
	  const x = getRandomInt(minX, maxX);
	  const y = 0;
	  
	  this.Location = new point(x, y);
	}
	else{
		this.Location = new point(path[1].x, path[1].y);
	}
	if(this.projectileType == projectileTypes.blast){
		this.impactRadius = this.attackRange;
	}

	this.lastAttack = attackRate;

	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;
	this.yShift = Math.random() - .5;
	this.xShift = Math.random() - .5;
	
	this.effects = new UnitEffects();
	this.direction = 1;
	
	this.deathValue = getMinionDeathValue(type)

	this.uid = generateMinionUid(type.charAt(0));
}

Minion.prototype.CalculateEffect = function(statType){
	const baseValue = this[statType];
	if(baseValue == null){return;}
	return this.effects.CalculateEffectByName(statType, baseValue)
}
Minion.prototype.DoHealing = function(){
	const newHealth = this.CalculateEffect(statTypes.health);
	this.health = Math.min(this.maxHealth, newHealth);
}
Minion.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta;
}

Minion.prototype.Move = function(){
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}

	const x = this.xShift * pathL;
	const y = this.yShift * pathW;

	const tx = this.Location.x +pathL+x;
	const ty = getPathYatX(tx)+y;
	let target = new point(tx,ty);
	let moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	
	if(this.type == "Fire"){
	  const r = this.CalculateEffect(statTypes.attackRange);
		if(this.lastAttack < this.attackRate){
		  const maxX = Math.min(leaderPoint*2, endZoneStartX())
			const deltaX = towers[0].Location.x < maxX ? this.xShift*getScale()*3 : Math.abs(this.xShift*getScale()*3);
			const deltaY = Math.abs(this.yShift*getScale()*3) * (towers[0].Location.y < halfH ? 1 : -1);
			target = new point(towers[0].Location.x-deltaX, towers[0].Location.y+deltaY);
		}
		else{
			target = new point(towers[0].Location.x+(r*this.xShift), towers[0].Location.y+(r*this.yShift));
		}
	}
	else if(this.type == "Air"){
	  let index = 0;
	  let minD = Infinity;
	  for(let i=0;i<towers.length;i++){
	    const dx = (this.Location.x-towers[i].Location.x)**2;
	    const dy = (this.Location.y-towers[i].Location.y)**2;
	    
	    if(dx+dy<minD){
	      minD=dx+dy;
	      index = i;
	    }
	  }
	  
	  target = new point(towers[index].Location.x, towers[index].Location.y);
	}
	else if(this.type == "Water"){
  	const waterx = this.Location.x;
  	const watery = getPathYatX(waterx)+y;
  	target = new point(waterx, watery);
  	
  	if(target.y - this.Location.y < moveSpeed){
  	  this.TakeDamage(Infinity)
  	}
	}
	
	if(isAdvancedTactics() && boss == null && getMinionCount() < getMaxMinions() && this.Location.x < path[10].x){
	  if(this.Location.x < path[2].x){
	    this.direction = 1;
	  }
	  else if(this.Location.x > path[8].x){
  	  this.direction = -1;
	  }

    const atx = this.Location.x+(pathL*this.direction)+x;
    const aty = getPathYatX(atx)+y;
  	target = new point(atx,aty);
  }
	
	if(this.Location.x == target.x && this.Location.y == target.y){return;}

	const newLocation = calcMove(moveSpeed, this.Location, target);
	
	newLocation.x = Math.min(newLocation.x, levelEndX);
	
	this.Location = newLocation;
}
Minion.prototype.Draw = function(){
  ctx.save();
	const color = isColorblind() ? GetColorblindColor() : this.color;
	const color2 = isColorblind() ? GetColorblindBackgroundColor() : this.color2;
	const isElement = minionResearch[this.type]?.unlockT == 2;
	const sideLen = (getScale()>>2)*(isElement?1.5:1)*(this.isUnderling?.5:1);
	
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
	
	if(Quality > 0){
	const lineW = 1;
  	ctx.beginPath();
  	ctx.fillRect(this.Location.x-(sideLen/2), this.Location.y-(sideLen/2), sideLen, sideLen);
  	ctx.beginPath();
  	ctx.lineWidth=lineW;
  	ctx.rect(this.Location.x-((sideLen+lineW)/2), this.Location.y-((sideLen+lineW)/2), sideLen+lineW, sideLen+lineW);
  }
	if(Quality > 1){
		const halfLen = sideLen/2
		if(isElement){
			if(this.type == "Air" || this.type == "Earth"){
				ctx.moveTo(this.Location.x-halfLen, this.Location.y);
				ctx.lineTo(this.Location.x+halfLen, this.Location.y);
			}
			
			if(this.type == "Air" || this.type == "Fire"){
				ctx.moveTo(this.Location.x-halfLen, this.Location.y+halfLen);
				ctx.lineTo(this.Location.x, this.Location.y-halfLen);
				ctx.lineTo(this.Location.x+halfLen, this.Location.y+halfLen);
			}
			else if(this.type == "Earth" || this.type == "Water"){
				ctx.moveTo(this.Location.x-halfLen, this.Location.y-halfLen);
				ctx.lineTo(this.Location.x, this.Location.y+halfLen);
				ctx.lineTo(this.Location.x+halfLen, this.Location.y-halfLen);
			}
		}
		else{
			ctx.moveTo(this.Location.x-halfLen, this.Location.y-halfLen);
			ctx.lineTo(this.Location.x+halfLen, this.Location.y+halfLen);
			ctx.moveTo(this.Location.x-halfLen, this.Location.y+halfLen);
			ctx.lineTo(this.Location.x+halfLen, this.Location.y-halfLen);
		}
	}
	ctx.stroke();
	ctx.closePath();
	
	this.DrawHUD(color, color2);
	ctx.restore();
}
Minion.prototype.DrawHUD = function(color, color2){
  if(this.isUnderling){return;}
  color = color || "#000";
  color2 = color2 || "#FFF";

	const gaugesChecked = GetGaugesCheckedForUnitType("Minion");
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
		const percent = this.lastAttack/this.attackRate;
		ctx.arc(this.Location.x, this.Location.y, pathL, -halfPi, percent*twoPi-halfPi);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = (Math.ceil(this.health * 10) / 10).toFixed(1)
		const w = ctx.measureText(hp).width;
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y-(getScale()/2);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(hp,x,y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const dmg = Math.floor(this.CalculateEffect(statTypes.damage) * 10)/10;
		const text = dmg + (this.attackCharges <= 1 ? "" : "..." + Math.floor(this.attackCharges));

		const w = ctx.measureText(text).width
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y+(getScale()/2);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Minion.prototype.Aim = function(){
  if(this.Location.x<0){return false;}
	this.lastAttack += this.effects.CalculateEffectByName(statTypes.attackRate, 1);
	this.lastAttack = Math.min(this.attackRate, this.lastAttack);

	const targets = [];
	for(let i=0;i<team1.length;i++){
		//cheap check
		const range = this.CalculateEffect(statTypes.attackRange);
		if(Math.abs(team1[i].Location.x - this.Location.x) < range)
		{
			//fancy check
			if(inRange(team1[i].Location, this.Location, range)){
			  targets.push(team1[i]);
			  if(targets.length < this.targetCount){
			    continue;
			  }
			  break;
			}
		}
	}
	
	if(targets.length > 0){
		this.Attack(targets);
	}

	return targets.length >= this.targetCount && this.type != "Fire" && this.type != "Water";
}
Minion.prototype.Attack = function(targets){
  if(targets.length == 0){return;}
	if(this.lastAttack < this.attackRate){ return; }
	
	let attackEffect = null;
	if(this.type == "Fire"){
		const aPower = this.CalculateEffect(statTypes.damage) / -64;
		attackEffect = new UnitEffect(statTypes.health, effectType.curse, 128, null, aPower);
	}

	
	for(let i=0;i<targets.length;i++){
	  const target = targets[i];
  	const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
  	projectiles.push(new Projectile(this.Location, this.type, loc, target.uid, this.uid, this.projectileSpeed, this.CalculateEffect(statTypes.damage), attackEffect,
  							this.attackCharges||1, this.chainRange||0, this.chainDamageReduction||0,
  							this.impactRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType));
  							
  	if(this.projectileType == projectileTypes.blast){break;}
	}
	
	if(this.type == "Air"){
		this.TakeDamage(1);
	}
	
	this.lastAttack = 0;
}

Minion.prototype.TakeDamage = function(damage){
	const output = Math.min(damage, this.health);

	if(this.type == "Air"){
		this.health -= Infinity;
	}

	this.health -= damage;
	return output;
}