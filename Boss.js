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
	const boost = getBossBoost();
	return base / boost;
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
		const mult = multipliers[stat] || '-';
		const upg = upgrades[stat] || '-';
		let boost = getBossBoost();
		if(stat == statTypes.abilityCooldown || stat == statTypes.attackRate || stat == statTypes.spawnDelay)
		{
			boost = Math.floor(100/boost)/100;
		}

		const prod = upg == '-' || mult == '-' ? Math.floor(base*boost*100)/100 : Math.floor(base*(mult**upg)*boost*100)/100;
		if(isNaN(prod)){continue;}
		
		stats.push({
			stat:stat,
			base:base,
			mult:mult,
			upg:upg,
			bonus:boost,
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
	boss.ActiveAbilityStart();
}

function BossFactory(){
	const type = activeBoss();

	const baseStats = getBossBaseStats(type);
	const upgrades = bossUpgrades[type];
	const upgradeMultipliers = getBossUpgradeMultipliers(type)
	
	const symbol = baseStats.symbol;
	const achievementBoost = getBossBoost();
	
	const newBoss = new Boss(type, symbol,
					Math.floor(baseStats.health * (upgradeMultipliers.health**(upgrades.health||0)) * achievementBoost), 
					Math.floor(baseStats.damage * (upgradeMultipliers.damage**(upgrades.damage||0)) * achievementBoost), 
					baseStats.moveSpeed * (upgradeMultipliers.moveSpeed**(upgrades.moveSpeed||0) * achievementBoost), baseStats.isFlying,
					baseStats.attackRate * (upgradeMultipliers.attackRate**(upgrades.attackRate||0) / achievementBoost), 
					baseStats.splashRadius * (upgradeMultipliers.splashRadius**(upgrades.splashRadius||0) * achievementBoost),
					baseStats.projectileSpeed * (upgradeMultipliers.projectileSpeed**(upgrades.projectileSpeed||0) * achievementBoost),  baseStats.projectileType,
					baseStats.attackRange * (upgradeMultipliers.attackRange**(upgrades.attackRange||0) * achievementBoost), 
					baseStats.auraRange * (upgradeMultipliers.auraRange**(upgrades.auraRange||0) * achievementBoost), 
					baseStats.auraPower * (upgradeMultipliers.auraPower**(upgrades.auraPower||0) * achievementBoost), 
					
					baseStats.abilityCooldown * (upgradeMultipliers.abilityCooldown**(upgrades.abilityCooldown||0) / achievementBoost), 
					baseStats.abilityDuration * (upgradeMultipliers.abilityDuration**(upgrades.abilityDuration||0) * achievementBoost), 
					
					baseStats.color, baseStats.color2);
	
	return newBoss;
}

function Boss(type, symbol, health, damage, moveSpeed, isFlying, attackRate, splashRadius, projectileSpeed, projectileType, attackRange, auraRange, auraPower, abilityCooldown, abilityDuration, color, color2){
	this.type = type;
	this.symbol = symbol;
	this.health = health||10;
	this.maxHealth = health;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.isFlying = isFlying;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.balistic;
	this.attackRange = attackRange||1;
	this.splashRadius = splashRadius||0;
	this.Location = new point(path[1].x, path[1].y);
	this.lastLocation = new point(0,0);
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
	this.deathValue = 10;
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;

	this.effects = new UnitEffects();
	this.attackEffect = new UnitEffects();
	if(this.type == "Famine"){
		attackEffect.AddEffect(statTypes.attackRate, effectType.curse, this.attackRate, .5)
	}
	
	this.uid = "B_" + (new Date()%10000);
}

Boss.prototype.CalculateEffect = function(type){
	const temp = this[type];
	if(temp == null){return;}
	return this.effects.CalculateEffectByName(type, temp)
}
Boss.prototype.DoHealing = function(){
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
	
	if(Math.abs(newLocation.x - this.lastLocation.x) < pathW/100)
	{return;}
	
	this.lastLocation = this.Location;
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
				if(this.type != "Famine"){
					break;
				}
			}
		}
	}
	
	this.Attack(targets);

	return targets.length > 0;
}
Boss.prototype.Attack = function (targets){
	if(this.lastAttack < this.attackRate || targets.length == 0){ return; }
	
	for(let i=0;i<targets.length;i++){
		const target = targets[i];

		if(this.type == "War"){
			const bsd = getBossSpawnDelay("War");
			bossResearch.War.lastSpawn += bsd / 32;
			bossResearch.War.lastSpawn = Math.min(bsd, bossResearch.War.lastSpawn);
			this.health += Math.ceil(this.CalculateEffect(statTypes.damage) / 16);
		}
		
			const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;
			const newProjectile = new Projectile(this.Location, loc, target.uid, this.uid, this.projectileSpeed, this.CalculateEffect(statTypes.damage), null,
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.canHitGround, this.canHitAir, this.team, this.projectileType);
			projectiles.push(newProjectile);
	}

	this.lastAttack = 0;

}
Boss.prototype.Aura = function(){
	
	const power = this.auraPower;
	const minX = this.Location.x - this.AuraRange();
	const maxX = this.Location.x + this.AuraRange();
	
	switch(this.type){
		case "Death":{//damage towers
			const type = effectType.blessing;
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
		case "Famine":{//damage team1 && slow attack rate
			const type = effectType.curse;
			const name = statTypes.attackRate;
			
			for(let i=0;i<team1.length;i++){
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX){
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ){
						team1[i].effects.AddEffect(name, type, 10, power);
					}
				}
			}
		
			break;
		}
		case "War":{//increase minion attack rate
			const type = effectType.blessing;
			const name = statTypes.attackRate;
			power = power*2;
		
			for(let i=0;i<minions.length;i++){
				if(minions[i].Location.x > minX && minions[i].Location.x < maxX){
					if( inRange(minions[i].Location, this.Location, this.AuraRange()) ){
						minions[i].effects.AddEffect(name, type, 10, power);
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
		case "Famine":
			const name = statTypes.damage;
			const type = effectType.curse;
			const duration = this.abilityDuration;
			const power = .5;
		
			for(let i=0;i<towers.length;i++){
				towers[i].effects.AddEffect(name, type, duration+1, power);
			}
			break;
		case "Death":
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
		case "War":
		case "Famine":
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
