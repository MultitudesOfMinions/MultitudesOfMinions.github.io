"use strict";
const addMinionQ = [];
const maxQ = 8;
let lastGlobalSpawn = 0;
let globalSpawnDelay = 120;
const deployList = [];
let deployDelay = 50;
let zombieDelay = 5;
let lastDeploy = 0;
let minionsMaxed = false;
const zombieTypes = Object.entries(minionResearch).filter(x=>x[1].unlockT<2).map(x=>x[0]);


function getGlobalSpawnDelay(){
	const reduction = .9**(globalSpawnDelayReduction+1);
	const distance = (totalPaths/PathsPerLevel)+1;
	return Math.max(globalSpawnDelay,globalSpawnDelay * distance * reduction);
}

function manageMinions(){
	minionsMaxed = getMinionCount() >= getMaxMinions();

	if(minions.length === 0){
		minionOrder.length = 0;
	}
	else{
		//remove stragglers
		for(let i=0;i<minions.length;i++){
			if(minions[i].Location.x < langoliers || minions[i].health <=0){
				if(minions[i].health <= 0){
				  
				  if(boss?.type === "Death" && !minions[i].zombie && zombieTypes.includes(minions[i].type)){
				    const newZombie = MinionFactory(minions[i].type, true);
				    newZombie.Location = minions[i].Location;
				    minions.push(newZombie);
				  }
				  
				  if(minions[i].type=="Water"){
			      const l = minions[i].Location;
			      const d=200;
			      const impactEffects = [
			          new UnitEffect("Water", statTypes.health, effectType.blessing, d, 1, minions[i].damage/100),
			          new UnitEffect("Water", statTypes.damage, effectType.blessing, d, 1.2, minions[i].damage),
			          new UnitEffect("Water", statTypes.moveSpeed, effectType.blessing, d, 1.2, 0),
			          new UnitEffect("Water", statTypes.attackRate, effectType.blessing, d, 1.2, 0)
		          ];
			    	const p = new Projectile(l, "Water", l, minions[i].uid, minions[i].uid, 0, 0, impactEffects, 1, 0, 0, 1, true, true, 2, projectileTypes.blast);
            projectiles.push(p);
  			  }
				  else if(minions[i].type == "Bomber"){
			      const l = minions[i].Location;
  		    	const p = new Projectile(l, "Bomber", l, minions[i].uid, minions[i].uid, 0, minions[i].damage*2, null, 1, 0, 0, minions[i].impactRadius*2, true, true, 0, projectileTypes.blast);
            projectiles.push(p);
				  }
				  
				  
  				if(boss !== null && boss.type === "Death"){
  					boss.damage += 1;
  				}
				}
				
				minions.splice(i,1);
				i--;
			}
		}
		
		for(let i=0;i<minions.length;i++){
			if(!minions[i].Aim()){
				minions[i].Move();
			}
			else{
			  minions[i].moving = false;
			}
  	  if(minions[i].type == "Vampire"){minions[i].isFlying=minions[i].moving;}

			minions[i].DoHealing();
			minions[i].effects.ManageEffects();
		}
	}
	
	spawnMinions();
	deployMinion();
	
	if(isDeathAbilityActive()){
    zombieDelay--;
	  if(zombieDelay <=0){
	    zombieDelay = 25;
  		const type = pickOne(zombieTypes);
  		
		  minions.push(MinionFactory(type, true));
	  	stats.incrementUnitCount(type);
  	}
	}
}
	
function spawnMite(){
  if(!getUIElement("chkClickToSpawn").checked){return;}
	if(addMinionQ.length >= maxQ){return;}
	
	addMinionQ.push(getUIElement("ddlClickToSpawnType").value);
}
function spawnMinions(){
	if(addMinionQ.length >= maxQ){return;}
	
	for(let minionType in minionResearch)
  {
		const chk = document.getElementById("chkSpawn{0}".format(minionType))
		if(chk === null || !chk.checked || !minionResearch[minionType].isUnlocked){continue;}

		minionResearch[minionType].lastSpawn++;

		const spawnDelay = getMinionSpawnDelay(minionType);
		if(minionResearch[minionType].lastSpawn > spawnDelay){
  		addMinionQ.push(minionType);
  		minionResearch[minionType].lastSpawn=0;
		}
	}
}
function deployMinion(){

	if(minionsMaxed){return;}
	if(deployList.length > 0){
		lastDeploy++;
	  if(lastDeploy > deployDelay){
  	  const type = deployList.shift();
  	  minions.push(MinionFactory(type, false));
  	  stats.incrementUnitCount(type);
	    achievements.minionsSpawned.count++;
  	  lastDeploy = 0;
    }
	}
	
	if(addMinionQ.length === 0){return;}

	const gsd = getGlobalSpawnDelay();
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
	
	const minionRate = {Earth:1};
	
	for(let i=0;i<minions.length;i++){
	  if(minions[i].zombie){continue;}
		const type = minions[i].type
		if(!minionRate.hasOwnProperty(type)){
		  minionRate[type]=1 / (getMinionsPerDeploy(type));
		}
		count += minionRate[type];
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
	return maxMinions+2;
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
	const potencies = getPotencies();
	const bonuses = getAchievementBonuses();

	const stats = [];
	for(let stat in statTypes){
		const base = baseStats[stat] || '-';
		const mult = stat === "minionsPerDeploy"? "+1" :  multipliers[stat] || '-';
		
		const upgT = getUpgradeTier(stat);
		const perk = bonuses[upgT]||0;
		const pot = potencies[upgT]||1;

		const upg = (upgrades[stat]+perk)*pot || '-';
		
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
	
	if(type === "Earth"){
	  const mpd = stats.find(x=>x.stat == statTypes.minionsPerDeploy).prod;
	  
	  const h = stats.find(x=>x.stat==statTypes.health);
	  const d = stats.find(x=>x.stat==statTypes.damage);
	  const r = stats.find(x=>x.stat==statTypes.regen);
	  const ar = stats.find(x=>x.stat==statTypes.attackRange);
	  const ir = stats.find(x=>x.stat==statTypes.impactRadius);
	  const tc = stats.find(x=>x.stat==statTypes.targetCount);
	  const ms = stats.find(x=>x.stat==statTypes.moveSpeed);

	  h.prod = Math.floor(h.prod*(mpd**.7)*100)/100;
	  r.prod = Math.floor(r.prod*(mpd**.5)*100)/100;
	  tc.prod = Math.floor(tc.prod*(mpd**.3));
	  d.prod = Math.floor(d.prod*(mpd**.2)*100)/100;
	  ar.prod = Math.min(statMaxLimits.impactRadius, Math.floor(ar.prod*(mpd**.2)*100)/100);
	  ir.prod = Math.min(statMaxLimits.impactRadius, Math.floor(ir.prod*(mpd**.2)*100)/100);
	  ms.prod = Math.min(statMaxLimits.moveSpeed, Math.floor(ms.prod*(mpd**.1)*100)/100);
	  
    stats.find(x=>x.stat == statTypes.minionsPerDeploy).prod=1;
	}


	return stats;
}
function clearQ(){addMinionQ.length = 0;}

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

function MinionFactory(type, isZombie){
	
	const baseStats = getMinionBaseStats(type);
	const upgradedStats = buildDictionary(getMinionUpgradedStats(type), "stat", "prod");

	const finalStats = {};
	Object.assign(finalStats, baseStats, upgradedStats);

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
					finalStats.attackRange/statAdjustments.attackRange,
					finalStats.regen/statAdjustments.regen,
					finalStats.projectileType,
					isZombie,
					finalStats.color,
					finalStats.color2);

	return newMinion;
	
}

function Minion(type, health, damage, moveSpeed, isFlying, attackRate, targetCount, attackCharges, chainRange, chainDamageReduction, impactRadius, projectileSpeed, attackRange, regen, projectileType, zombie, color, color2){
	this.type = type;
	this.health = health||10;
	this.maxHealth = this.health*4;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed;
	this.isFlying = isFlying;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.ballistic;
	this.attackRange = attackRange||1;
	this.targetCount = targetCount||1;
	this.attackCharges = attackCharges||1;
	this.chainRange = chainRange||0;
	this.chainDamageReduction = chainDamageReduction||0;
	this.impactRadius = impactRadius||0;
	this.regen = regen||0;
	this.color = color;
	this.color2 = color2;
	this.zombie = zombie;
	
	if(zombie){
	  const scale = getScale();
	  const bossR = (boss?.auraRange||3)*scale;
	  const bossL = boss?.Location?.x || path[4].x;
	  const minX = Math.max(0, bossL-bossR);
	  const maxX = Math.min(levelEndX, bossL+bossR)
	  
	  const x = getRandomInt(minX, maxX);
	  const y = getRandomInt(scale, gameH-scale);
	  this.Location = new point(x, y);
	  
		this.health = this.health/2;
		this.maxHealth = this.health;
	  this.damage = Math.max(1, this.damage/2);

		this.moveSpeed/=2;
		this.attackRate*=2;
		
		this.targetCount = 1;
		this.attackCharges=1;
		this.regen=0;

	  this.attackRange = Math.max(1, this.attackRange/2);
	  this.impactRadius = Math.max(.1, this.impactRadius/2);
	}
	else if(type == "Air"){
	  const maxX = Math.min(leaderPoint*2, endZoneStartX());
	  const x = getRandomInt(0, maxX);
	  const y = getRandomInt(0, gameH);
	  
	  this.Location = new point(x, y);
	}
	else if(type == "Fire"){
	  const y = getRandomInt(0, gameH);
	  this.Location = new point(path[0].x, y);
	}
	else if(type == "Water"){
	  const maxX = Math.min(leaderPoint*2, endZoneStartX());
	  const minX = Math.min(pathL*8, endZoneStartX());
	  const x = getRandomInt(minX, maxX);
	  const y = 0;
	  
	  this.Location = new point(x, y);
	}
	else{
		this.Location = new point(path[0].x, path[0].y);
	}

	this.lastAttack = this.attackRate;

	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;
	this.yShift = Math.random() - .5;
	this.xShift = Math.random() - .5;
	
	this.effects = new UnitEffects();
	this.direction = 1;
	this.moving = true;
	
	this.uid = generateMinionUid(type.charAt(0));
}

Minion.prototype.CalculateEffect = function(statType){
	const baseValue = this[statType];
	if(baseValue == null){return;}
	
  if(statType==statTypes.heath){
    result = Math.max(this.maxHealth, result);
  }
  
	return this.effects.CalculateEffectByName(statType, baseValue)
}
Minion.prototype.DoHealing = function(){
  if(this.regen){
    this.health = Math.min(this.maxHealth/4, this.health+this.regen);
  }

	const newHealth = this.effects.DotsAndHots(this.health, this.maxHealth, this.type);

	this.health = newHealth;
}
Minion.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta;
}

Minion.prototype.Move = function(){
  if(this.type == "Ram" && this.lastAttack < this.attackRate){ return; }
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}

	const x = this.xShift * pathL;
	const y = this.yShift * pathW;

	const tx = this.Location.x+pathL+x;
	const ty = getPathYatX(tx)+y;
	let target = new point(tx,ty);
	let moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	
	if(this.zombie){
    target = new point(tx, this.Location.y);
  }
	else if(this.type == "Fire"){
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
		if(target.x > levelEndX){
		  if(hero?.health > 0){
  			target = new point(hero.Location.x+(r*this.xShift), hero.Location.y+(r*this.yShift));
		  }
		  else if(squire?.health > 0){
  			target = new point(squire.Location.x+(r*this.xShift), squire.Location.y+(r*this.yShift));
		  }
		  else if(page?.health>0){
  			target = new point(page.Location.x+(r*this.xShift), page.Location.y+(r*this.yShift));
		  }
		}
	}
	else if(this.type == "Air"){
	  let index = 0;
	  let minD = Infinity;
	  for(let i=0;i<team1.length;i++){
	    const dx = (this.Location.x-team1[i].Location.x)**2;
	    const dy = (this.Location.y-team1[i].Location.y)**2;
	    
	    if(dx+dy<minD){
	      minD=dx+dy;
	      index = i;
	    }
	  }
	  
	  target = new point(team1[index].Location.x, team1[index].Location.y);
	}
	else if(this.type == "Water"){
  	const waterx = this.Location.x;
  	target = new point(this.Location.x, getPathYatX(waterx)+y);
  	
  	if(target.y - this.Location.y < moveSpeed){
  	  this.TakeDamage(Infinity)
  	}
	}
	
	if(this.type !== "Underling" && isAdvancedTactics() && boss == null && !minionsMaxed && this.Location.x < path[11].x){
	  //const middle = path[5].x;
	  //const stagingWidth = pathL*6;
	  //const waitinH = pathW;
	  //const atx = middle + (stagingWidth * this.xShift);
	  if(this.Location.x < path[3].x){
	    this.direction = 1;
	  }
	  else if(this.Location.x > path[10].x){
  	  this.direction = -1;
	  }

    const atx = this.Location.x+(pathL*this.direction)+x;
	  const aty = getPathYatX(atx)+y;
	  moveSpeed/=2;
  	target = new point(atx,aty);
  }
	if(this.Location.x == target.x && this.Location.y == target.y){return;}

	const newLocation = calcMove(moveSpeed, this.Location, target);
	
	newLocation.x = Math.min(newLocation.x, levelEndX);
	
	this.moving = this.Location.x !== newLocation.x || this.Location.y !== newLocation.y
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
		const hp = Math.ceil(this.health*10)/10;
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
		const dmg = Math.floor(this.CalculateEffect(statTypes.damage)*10)/10;
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
  if(this.type !== "Catapult" || !this.moving){
  	this.lastAttack += this.effects.CalculateEffectByName(statTypes.attackRate, 1);
  	this.lastAttack = Math.min(this.attackRate, this.lastAttack);
  }
	const range = this.CalculateEffect(statTypes.attackRange);

	const targets = [];
	for(let i=0;i<team1.length;i++){
	  if(targets.length >= this.targetCount){break;}
	  const target = team1[i];
	  
		const deltaX = Math.abs(this.Location.x - target.Location.x);
		const deltaY = Math.abs(this.Location.y - target.Location.y);
		if(deltaX < range && deltaY < range && inRange(target.Location, this.Location, range))
		{
			targets.push(target);
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
		attackEffect = new UnitEffect(statTypes.health, effectType.curse, 64, null, aPower);
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
	else if(this.type == "Harpy"){
	  const roll = Math.random();
	  if(roll > .9){
	    damage = 0;
	  }
	  else if(roll < .2){
	    damage *= 2;
	  }
	}
	else if(this.type == "Golem"){
	  const dr = .5 + this.health*2/this.maxHealth;
	  damage*=dr;
	}

	this.health -= damage;
	return output;
}