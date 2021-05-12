"use strict";
function manageBoss(){
	if(!tierUnlocked(2)) { boss = null; }
	if(boss === null){
		if(activeBoss != "none"){
			spawnBoss();
		}
		return;
	}
	
	if(boss.Location.x < langoliers || boss.health <= 0){
		resources.a.amt += boss.deathValue;
		boss = null;
	}
	else{
		if(!boss.Aim() || boss.type == "Famine"){
			boss.Move();
		}
		boss.DoHealing();
		boss.Aura();
		boss.effects.ManageEffects();
		
		if(boss.remainingDuration >= 0){
			boss.remainingDuration--;
			if(boss.remainingDuration == 0){
				boss.ActiveAbilityEnd();
			}
		}else
		{
			if(boss.lastActiveAbility == boss.abilityCooldown && autoCastAbility()){
				bossActivateAbility();
			}

			boss.lastActiveAbility = Math.min(boss.lastActiveAbility+1, boss.abilityCooldown)
		}

	}
}
function spawnBoss(){
	if(boss != null){return;}
	
	const type = activeBoss();
	if(type == "none"){return;}
	bossResearch[type].lastSpawn++;
	if(bossResearch[type].lastSpawn >= getBossSpawnDelay(type)){
		addBoss();
		bossResearch[type].lastSpawn = 0;
	}
}
function getBossSpawnDelay(type){
	if(type == "none"){return -1;}
	const base = getBossBaseStats(type).spawnDelay;
	const boost = getBossBoost(statTypes.spawnDelay);
	const attr = getEquippedEffect("Boss", statTypes.spawnDelay);
	return (base + attr.a) * attr.m * boost;
}
function addBoss(){
	boss = BossFactory()
}
function drawBoss(){
	if(boss && boss.health >= 0){
		boss.Draw();
	}
}
function drawBossAura(){
	if(boss && boss.health >= 0){
		boss.DrawAura();
	}
}
function activeBoss(){
	if(!tierUnlocked(2)) { return "none"; }
	
	const rdo = document.querySelector("input[name='bossSelect']:checked");
	if(rdo == null){return "none";}
	return rdo.value;
}
function getBossBaseStats(type){
	const baseStats = {};
	Object.assign(baseStats, baseBossDefault, baseBoss[type]);
	
	return baseStats;
}
function getBossUpgradeMultipliers(type){
	const upgradeMultipliers = {};
	Object.assign(upgradeMultipliers, bossUpgradeMultipliersDefault, bossUpgradeMultipliers[type]);
	
	return upgradeMultipliers;
}
function getBossUpgradedStats(type){
	const baseStats = getBossBaseStats(type);
	const multipliers = getBossUpgradeMultipliers(type);
	const upgrades = bossUpgrades[type];

	const stats = [];
	for(let stat in statTypes){
		const base = baseStats[stat] || '-';
		let mult = multipliers[stat] || '-';
		const upg = upgrades[stat] || '-';
		const bossItemEffect = getEquippedEffect("Boss", stat);
		let featBoost = getBossBoost(stat);

		let calculated = (base+bossItemEffect.a)*bossItemEffect.m*featBoost;
		
		if(type=="Pestilence"){
		  if(stat == statTypes.attackCharges || stat == statTypes.targetCount){
		    mult = '+';
		    calculated = (base + upg + bossItemEffect.a) * bossItemEffect.m;
		  }
		  
		}
		else if(upg != '-' && mult != '-'){
		  calculated*=mult**upg;
		}

		const prod = flooredStats.includes(stat) ? Math.floor(calculated) : Math.floor(calculated*100)/100;
		if(isNaN(prod)){continue;}
		
		
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
function getBossMoveTarget(){
	const x = (+document.getElementById("bossPosition").value) * ((leaderPoint+pathL) / 25);
	const y = getPathYatX(x);
	
	return new point(x,y);;
}
function bossActivateAbility(){
  if(boss == null){return;}
	boss.ActiveAbilityStart();
}
function getBossDeathValue(type){
  let value = 16;
  for(let upgrade in bossUpgrades[type]){
    value += bossUpgrades[type][upgrade];
  }
  const equipmentEffect = getEquippedEffect("a", "gain");
  value += equipmentEffect.a;
  value *= equipmentEffect.m;
  return value;
}


function BossFactory(){
	const type = activeBoss();

	const baseStats = getBossBaseStats(type);
	const upgradedStats = buildDictionary(getBossUpgradedStats(type), "stat", "prod");
	
	const bossStats = {};
	Object.assign(bossStats, baseStats, upgradedStats);

	
	const symbol = bossStats.symbol;

	const newBoss = new Boss(type, symbol,
					bossStats.health/statAdjustments.health,
					bossStats.damage/statAdjustments.damage,
					bossStats.moveSpeed/statAdjustments.moveSpeed,
					bossStats.attackRate/statAdjustments.attackRate,
					bossStats.splashRadius/statAdjustments.splashRadius,
					bossStats.projectileSpeed/statAdjustments.projectileSpeed,
					bossStats.attackRange/statAdjustments.attackRange,
					bossStats.targetCount/statAdjustments.targetCount,
					bossStats.attackCharges/statAdjustments.attackCharges,
					bossStats.chainRange/statAdjustments.chainRange,
					bossStats.chainDamageReduction/statAdjustments.chainDamageReduction,
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

function Boss(type, symbol, health, damage, moveSpeed, attackRate, splashRadius, projectileSpeed, attackRange, targetCount, attackCharges, chainRange, chainDamageReduction, auraRange, auraPower, abilityCooldown, abilityDuration, projectileType, isFlying, color, color2){
	this.type = type;
	this.symbol = symbol;
	this.health = health||10;
	this.maxHealth = health;
	this.damage = damage||0;
	this.moveSpeed = Math.min(moveSpeed||1, 300);
	this.isFlying = isFlying;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.balistic;
	this.attackRange = attackRange||1;
	this.targetCount = targetCount||1;
	this.attackCharges = attackCharges||1;
	this.chainRange = chainRange||1;
	this.chainDamageReduction = chainDamageReduction||0;
	this.splashRadius = splashRadius||0;
	this.Location = new point(path[1].x, path[1].y);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;

	this.auraPower = auraPower;
	this.auraRange = auraRange;
	this.abilityCooldown = abilityCooldown;
	this.abilityDuration = abilityDuration;
	this.lastActiveAbility = abilityCooldown;
	this.remainingDuration = 0;

	this.color = color;
	this.color2 = color2;
	
	this.lastAttack = attackRate;
	this.deathValue = getBossDeathValue(type);
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;

	this.effects = new UnitEffects();
	this.attackEffects = new UnitEffect();
	if(type === "Famine"){
	  const duration = 400 * (400/attackRate);
	  this.attackEffects= new UnitEffect(statTypes.health, effectType.curse, duration, null, -.0078125)// 1/2^7
	}
	if(type === "Pestilence"){
	  this.attackEffects= new UnitEffect(statTypes.health, effectType.curse, Infinity, null, -towerPassiveRegen*this.damage)
	}

	this.uid = "B_" + (new Date()%10000);
}

Boss.prototype.CalculateEffect = function(type){
	const baseValue = this[type];
	if(baseValue == null){return;}
	
	//pestilence does damage over time in perpetuity instead of on impact.
	if(this.type == "Pestilence" && type == statTypes.damage){ return 0;	}
	
	return this.effects.CalculateEffectByName(type, baseValue)
}
Boss.prototype.DoHealing = function(){
  if(this.type === "Death"){return;}
	const newHealth = this.CalculateEffect(statTypes.health, this.health);
	this.health = Math.min(this.maxHealth, newHealth);
}

Boss.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta;
}

Boss.prototype.Move = function (){
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}

	const targetX = getBossMoveTarget().x;
	let moveSpeed = this.CalculateEffect(statTypes.moveSpeed);

	const deltaX = Math.abs(targetX - this.Location.x);
	if(deltaX < moveSpeed/2) {
	  this.Location.x = targetX;
	  return;
	}

	if(this.Location.x < path[5].x){
    const moveBonus = (path[6].x - this.Location.x)/pathL;
    moveSpeed *= moveBonus**2;
	}

	if(this.Location.x == targetX){return;}
	
	let i = 1;
	while(path[i].x <= this.Location.x && i < path.length){i++;}
	i--;
	
	const direction = targetX < this.Location.x ? -1 : 1;
	if(targetX < this.Location.x){
		moveSpeed = this.CalculateEffect(statTypes.moveSpeed);
	}
	const target = new point(path[i+direction].x, path[i+direction].y);
	
	const newLocation = calcMove(moveSpeed, this.Location, target)
	newLocation.x = Math.min(newLocation.x, levelEndX);
	
	this.Location = newLocation;
}
Boss.prototype.Draw = function (){
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
	const gaugesChecked = GetGaugesCheckedForUnitType("Boss");
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
		ctx.arc(this.Location.x, this.Location.y, pathL*1.5, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = (Math.ceil(this.health * 10) / 10).toFixed(1);
		const w = ctx.measureText(hp).width;
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y-(pathW);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(hp,x,y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		const dmg = Math.floor(this.CalculateEffect(statTypes.damage) * 10)/10;
		const text = (this.type == "Famine" ? "∞x" : null) + dmg;

		const w = ctx.measureText(text).width
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y+(pathW*1.6);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Boss.prototype.DrawAura = function(){
	const gaugesChecked = GetGaugesCheckedForUnitType("Boss");
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
Boss.prototype.AuraRange = function() {return this.auraRange*getScale();}
Boss.prototype.Aim = function (){
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
				if(this.targetCount < targets.length){
					break;
				}
			}
		}
	}
	
	if(this.lastAttack >= this.attackRate && targets.length > 0){
  	this.Attack(targets);
	}

	return targets.length >= this.targetCount;
}
Boss.prototype.Attack = function (targets){
	for(let i=0;i<targets.length;i++){
		const target = targets[i];

		if(this.type == "War"){
			const bsd = getBossSpawnDelay("War");
			bossResearch.War.lastSpawn += bsd / 128;
			bossResearch.War.lastSpawn = Math.min(bsd, bossResearch.War.lastSpawn);
			this.health += Math.ceil(this.CalculateEffect(statTypes.damage) / 16);
		}
		else if(this.type == "Famine"){
		  const penalty = this.attackRate/4;
		  target.lastAttack -= penalty;
		}

		const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
		const newProjectile = new Projectile(this.Location, loc, target.uid, this.uid, this.projectileSpeed, this.CalculateEffect(statTypes.damage), this.attackEffects,
						this.attackCharges||1, this.chainRange||0, this.chainDamageReduction||0,
						this.splashRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType);
		projectiles.push(newProjectile);
	}

	this.lastAttack = 0;

}
Boss.prototype.Aura = function(){
	
	const power = this.auraPower;
	const minX = this.Location.x - this.AuraRange();
	const maxX = this.Location.x + this.AuraRange();
	const duration = 5;
	
	switch(this.type){
		case "Death":{//damage enemies
			const type = effectType.curse;
			const powerFloor = Math.floor(power)/128;
		
			for(let i=0;i<team1.length;i++){
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX){
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ){
						team1[i].TakeDamage(powerFloor);
					}
				}
			}
			break;
		}
		case "Famine":{//slow attack rate
			const type = effectType.curse;
			const name = statTypes.attackRate;
			const faminePower = 1/ power;
			
			for(let i=0;i<team1.length;i++){
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX){
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ){
						team1[i].effects.AddEffect(name, type, duration, faminePower);
					}
				}
			}
		
			break;
		}
		case "Pestilence":{//reduce enemy damage
			const type = effectType.curse;
			const name = statTypes.damage;
			const pestilencePower = 1/ power;
			
			for(let i=0;i<team1.length;i++){
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX){
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ){
						team1[i].effects.AddEffect(name, type, duration, pestilencePower);
					}
				}
			}
		
			break;
		}
		case "War":{//increase minion attack rate
			const type = effectType.blessing;
			const name = statTypes.attackRate;
			const warPower = power*2;

			for(let i=0;i<minions.length;i++){
				if(minions[i].Location.x > minX && minions[i].Location.x < maxX){
					if( inRange(minions[i].Location, this.Location, this.AuraRange()) ){
						minions[i].effects.AddEffect(name, type, duration, warPower);
					}
				}
			}
			break;
		}
		default:
			console.warn("Unknown boss aura:" + this.type);
			break;
	}
}
Boss.prototype.ActiveAbilityStart = function(){
	this.remainingDuration = this.abilityDuration;
	this.lastActiveAbility = 0;

	switch(this.type){
	  case "Death":break;
		case "Famine":
			const faminePower = .5;
		
			for(let i=0;i<towers.length;i++){
				towers[i].effects.AddEffect(statTypes.damage, effectType.curse, this.abilityDuration+1, faminePower);
			}
			break;
		case "Pestilence":
			const pestilencePower = -.03125;// 1/2^5

			for(let i=0;i<towers.length;i++){
				towers[i].effects.AddEffect(statTypes.health, effectType.curse, this.abilityDuration+1, null, pestilencePower);
			}
			break;
		case "War":
			boss.effects.AddEffect(statTypes.attackRate, effectType.blessing, this.abilityDuration, 2);
			boss.effects.AddEffect(statTypes.moveSpeed, effectType.blessing, this.abilityDuration, 1.2);
			break;
		default:
			console.warn("Unknown boss ability:" + this.type);
			break;
	}
}
Boss.prototype.ActiveAbilityEnd = function(){
	switch(this.type){
		case "Death":
			while(addMinionQ.length > 10){addMinionQ.pop();}
			break;
		case "Famine":
		case "Pestilence":
		case "War":
			break;
	}
}
Boss.prototype.TakeDamage = function(damage){
	if(this.type == "War"){
		this.lastAttack += this.attackRate / 2;
		if(this.remainingDuration > 0){return;}
	}
	
	this.health -= damage;
}
