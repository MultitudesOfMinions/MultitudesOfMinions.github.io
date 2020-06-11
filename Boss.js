function manageBoss(){
	if(!tierUnlocked(2)) { boss = null; }
	if(boss === null){
		if(activeBoss != "none"){
			spawnBoss()
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
			boss.lastActiveAbility++;
		}

	}
}
function spawnBoss(){
	if(boss != null){return;}
	
	var type = activeBoss();
	if(type == "none"){return;}
	bossResearch[type].lastSpawn++;
	if(bossResearch[type].lastSpawn >= getBossSpawnDelay(type)){
		addBoss();
		bossResearch[type].lastSpawn = 0;
	}
}
function getBossSpawnDelay(type){
	if(type == "none"){return -1;}
	var base = getBossBaseStats(type).spawnDelay;
	return base;
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
	
	var rdo = document.querySelector("input[name='bossSelect']:checked");
	if(rdo == null){return "none";}
	return rdo.value;
}
function getBossBaseStats(type){
	var baseStats = {};
	Object.assign(baseStats, baseBossDefault, baseBoss[type]);
	
	return baseStats;
}
function getBossUpgradeMultipliers(type){
	var upgradeMultipliers = {};
	Object.assign(upgradeMultipliers, bossUpgradeMultipliersDefault, bossUpgradeMultipliers[type]);
	
	return upgradeMultipliers;
}
function getBossUpgradedStats(type){
	var baseStats = getBossBaseStats(type);
	var upgradeMultipliers = getBossUpgradeMultipliers(type);
	var upgrades = bossUpgrades[type];

	var stats = [];
	for(var stat in baseStats){
		if(upgradeMultipliers.hasOwnProperty(stat)){
			var base = baseStats[stat];
			var mult = upgradeMultipliers[stat];
			var upg = upgrades[stat];
			var prod = Math.floor(base*(mult**upg)*100)/100;
			
			stats.push({
				stat:stat,
				base:base,
				mult:mult,
				upg:upg,
				prod:prod
			})
		}
	}
	return stats;
}
function bossActivateAbility(){
	boss.ActiveAbilityStart();
}

function BossFactory(){
	var type = activeBoss();

	var baseStats = getBossBaseStats(type);
	var upgrades = bossUpgrades[type];
	var upgradeMultipliers = getBossUpgradeMultipliers(type)
	
	var symbol = baseStats.symbol;
	var achievementBoost = getBossBoost();
	
	var newBoss = new Boss(type, symbol,
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
		attackEffect.AddEffect("attackRate", effectType.condition, this.GetAttackRate(), .5)
	}
	
	this.uid = "B_" + (new Date()%10000);
}

Boss.prototype.GetDamage = function(){
	var effectPower = this.effects.GetEffectPowerByName("damage");
	return this.damage * effectPower;
}
Boss.prototype.GetMoveSpeed = function(){
	var effectPower = this.effects.GetEffectPowerByName("moveSpeed");
	return this.moveSpeed * effectPower * getScale();
}
Boss.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Boss.prototype.GetAttackRange = function(){
	var effectPower = this.effects.GetEffectPowerByName("attackRange");
	return this.attackRange * effectPower * getScale()
}
Boss.prototype.DoHealing = function(){
	var effectPower = this.effects.GetEffectPowerByName("health");
	if(effectPower == 1){return;}
	this.health = Math.min(this.maxHealth, this.health+effectPower);
}
Boss.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta; 
}

Boss.prototype.Move = function (){
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}
	var aggression = document.getElementById("bossAggresion").value;

	var leaderCushion = (25-aggression) * pathL;
	var targetX = gameW; 
	var moveSpeed = this.GetMoveSpeed();

	if(aggression < 25 && minionOrder.length > 0 && minions.length > minionOrder[0]){
		var leader = minions[minionOrder[0]];
		targetX = Math.max(leader.Location.x - leaderCushion, pathL);
		moveSpeed = Math.min(moveSpeed, leader.GetMoveSpeed());
		
		if(Math.abs(targetX - this.Location.x) < moveSpeed){
			return;
		}
	}
	if(this.Location.x == targetX){return;}
	
	var i = 1;
	while(path[i].x <= this.Location.x && i < path.length){i++;}
	i--;
	
	var direction = 1;
	if(targetX < this.Location.x){direction = -1;}
	var target = new point(path[i+direction].x, path[i+direction].y);
	
	var newLocation = calcMove(moveSpeed, this.Location, target)
	newLocation.x = Math.min(newLocation.x, levelEndX());
	
	this.Location = newLocation;
}
Boss.prototype.Draw = function (){
	ctx.fillStyle="#000";
	ctx.strokeStyle=this.color;
	
	ctx.beginPath();
	ctx.arc(this.Location.x, this.Location.y, pathL, 0, twoPi);
	ctx.fill();
	ctx.stroke();

	if(Quality >= 2){
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.font = "bold 20pt Arial"
		var size = ctx.measureText(this.symbol);
		ctx.fillText(this.symbol, this.Location.x-(size.width/2), this.Location.y+10);
		ctx.font = "bold 12pt Arial"
	}
	
	var gaugesChecked = GetGaugesCheckedForUnitType("Boss");
	if(gaugesChecked.Range){
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, this.GetAttackRange(), 0, twoPi);
		ctx.stroke();
	}
	if(gaugesChecked.Reload){
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=2;
		ctx.beginPath();
		var percent = this.lastAttack/this.GetAttackRate();
		ctx.arc(this.Location.x, this.Location.y, pathL*1.5, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		var hp = Math.ceil(this.health * 10) / 10;
		var w = ctx.measureText(hp).width;
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y-(pathW);
		ctx.fillStyle="#000";
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(hp,x,y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		var dmg = this.GetDamage();
		var w = ctx.measureText(dmg).width
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y+(pathW*1.6);
		ctx.fillStyle="#000";
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(dmg, x, y);
	}	
	ctx.closePath();
}
Boss.prototype.DrawAura = function(){
	var gaugesChecked = GetGaugesCheckedForUnitType("Boss");
	if(gaugesChecked.Range){
		var x = this.Location.x - this.AuraRange();
		var w = this.AuraRange() * 2;

		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.arc(this.Location.x, this.Location.y, this.AuraRange(), 0, twoPi);
		ctx.fill();
		ctx.closePath();

	}
}
Boss.prototype.AuraRange = function() {return this.auraRange*getScale();}
Boss.prototype.Aim = function (){
	var effectPower = this.effects.GetEffectPowerByName("attackRate");
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);

	var targets = [];
	for(var i=0;i<team1.length;i++){
		//cheap check
		var range = this.GetAttackRange();
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
	if(this.lastAttack < this.GetAttackRate() || targets.length == 0){ return; }
	
	for(var i=0;i<targets.length;i++){
		if(this.type == "War"){
			var bsd = getBossSpawnDelay("War");
			bossResearch.War.lastSpawn += bsd / 32;
			bossResearch.War.lastSpawn = Math.min(bsd, bossResearch.War.lastSpawn);
			this.health += Math.ceil(this.GetDamage() / 16);
		}
		
		projectiles[projectiles.length] = new Projectile(this.Location, targets[i].Location, targets[i].uid, this.uid, this.projectileSpeed, this.GetDamage(), null,
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType)
	}

	this.lastAttack = 0;

}
Boss.prototype.Aura = function(){
	
	var power = this.auraPower;
	var minX = this.Location.x - this.AuraRange();
	var maxX = this.Location.x + this.AuraRange();
	
	switch(this.type){
		case "Death"://minion move speed
			var type = effectType.boon;
			var name = "moveSpeed";
			var powerFloor = Math.floor(power)/128;
		
			for(var i=0;i<team1.length;i++){
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX){
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ){
						team1[i].TakeDamage(powerFloor);
					}
				}
			}
			break;
		case "Famine"://damage team1 && slow attack rate
			var type = effectType.condition;
			var name = "attackRate";
			
			for(var i=0;i<team1.length;i++){
				if(team1[i].Location.x > minX && team1[i].Location.x < maxX){
					if( inRange(team1[i].Location, this.Location, this.AuraRange()) ){
						team1[i].effects.AddEffect(name, type, 10, power);
					}
				}
			}
		
			break;
		case "War"://increase minion attack rate
			var type = effectType.boon;
			var name = "attackRate";
			power = power*2;
		
			for(var i=0;i<minions.length;i++){
				if(minions[i].Location.x > minX && minions[i].Location.x < maxX){
					if( inRange(minions[i].Location, this.Location, this.AuraRange()) ){
						minions[i].effects.AddEffect(name, type, 10, power);
					}
				}
			}
			break;
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
			var name = "damage";
			var type = effectType.condition;
			var duration = this.abilityDuration;
			var power = .5;
		
			for(var i=0;i<towers.length;i++){
				towers[i].effects.AddEffect(name, type, duration+1, power);
			}
			break;
		case "Death":
			break;
		case "War":
			boss.effects.AddEffect("attackRate", effectType.boon, this.abilityDuration, 2);
			boss.effects.AddEffect("moveSpeed", effectType.boon, this.abilityDuration, 1.2);
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
		this.lastAttack += this.GetAttackRate() / 2;
		if(this.remainingDuration > 0){return;}
	}
	
	this.health -= damage;
}
