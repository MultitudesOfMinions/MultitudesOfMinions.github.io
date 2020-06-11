var addMinionQ = [];
var lastGlobalSpawn = 0;
var globalSpawnDelay = 50;
function getGlobalSpawnDelay(){
	var reduction = .95**(globalSpawnDelayReduction+1);
	return (globalSpawnDelay * (getLevel()+1)) * reduction;
}
function manageMinions(){
	if(minions.length == 0){
		minionOrder = [];
	}
	else{
		//remove stragglers
		for(var i=0;i<minions.length;i++){
			if(minions[i].Location.x < langoliers || minions[i].health <=0){
				if(minions[i].health <= 0){ resources.a.amt += minions[i].deathValue; }
				minions.splice(i,1);
				i--;
				
				if(boss != null && boss.type == "Death"){
					boss.damage += 1;
				}
				
			}
		}
		
		for(var i=0;i<minions.length;i++){
			if(!minions[i].Aim()){
				minions[i].Move(); 
			}
			minions[i].DoHealing();
			minions[i].effects.ManageEffects();
			minions[i].Aura();
		}
	}
	
	spawnMinions();
	addMinion();
}
function spawnMite(){
	if(addMinionQ.length >= 10){return;}
	addMinionQ[addMinionQ.length] = "Mite";
}
function spawnMinions(){
	if(addMinionQ.length >= 10 && !isDeathAbilityActive()){return;}
	
	for(var minionType in minionResearch)
{		
		var chk = document.getElementById("chkSpawn{0}".format(minionType))
		if(chk == null || !chk.checked || !minionResearch[minionType].isUnlocked){continue;}

		minionResearch[minionType].lastSpawn++;
		if(isDeathAbilityActive()){ minionResearch[minionType].lastSpawn+= 10}

		var spawnDelay = getMinionSpawnDelay(minionType);
		if(minionResearch[minionType].lastSpawn > spawnDelay){
			var spawnCount = minionUpgrades[minionType].minionsPerSpawn + 1;
			for(var i=0;i<spawnCount;i++){
				if(addMinionQ.length >= 10 && !isDeathAbilityActive()){ break; }
				addMinionQ[addMinionQ.length] = minionType;
			}
			minionResearch[minionType].lastSpawn=0;
		}
	}
}
function addMinion(){

	if(isDeathAbilityActive()){
		while(addMinionQ.length > 0){
			var type = addMinionQ.shift();
			minions[minions.length] =  MinionFactory(type);
		}
	}
	
	if(addMinionQ.length == 0 || getMinionCount() >= getMaxMinions()){return;}
	lastGlobalSpawn++;
	if(lastGlobalSpawn < getGlobalSpawnDelay()){ return; }

	var type = addMinionQ.shift();
	minions[minions.length] =  MinionFactory(type);
	lastGlobalSpawn = 0;
	achievements.minionsSpawned.count++;
}
function getMinionCount(){
	var count = 0;
	for(var i=0;i<minions.length;i++){
		var type = minions[i].type
		count += 1 / (minionUpgrades[type].minionsPerSpawn + 1);
	}
	return count;
}
function drawMinions(){ 
	for(var i=0;i<minions.length;i++){ 
		minions[i].Draw(); 
	}
}
function getMinionSpawnDelay(type){
	
	var base = getMinionBaseStats(type).spawnDelay;
	var upgradeMultiplier = getMinionUpgradeMultipliers(type).spawnDelay;
	var upgrades = minionUpgrades[type].spawnDelay;
	
	return base * (upgradeMultiplier**upgrades);
}
function getMaxMinions(){
	return 2**(maxMinions+1);
}
function getMinionBaseStats(type){
	var baseStats = {};
	Object.assign(baseStats, baseMinionDefault, baseMinion[type]);
	
	return baseStats;
}
function getMinionUpgradeMultipliers(type){
	var upgradeMultipliers = {};
	Object.assign(upgradeMultipliers, minionUpgradeMultipliersDefault, minionUpgradeMultipliers[type]);
	
	return upgradeMultipliers;
}
function getMinionUpgradedStats(type){
	var baseStats = getMinionBaseStats(type);
	var upgradeMultipliers = getMinionUpgradeMultipliers(type);
	var upgrades = minionUpgrades[type];

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
function clearQ(){addMinionQ = [];}

function MinionFactory(type){
	
	var baseStats = getMinionBaseStats(type);
	var upgradeMultipliers = getMinionUpgradeMultipliers(type);
	var upgrades = minionUpgrades[type];

	var newMinion = new Minion(type, Math.floor(baseStats.health * (upgradeMultipliers.health**upgrades.health||0)), 
					Math.floor(baseStats.damage * (upgradeMultipliers.damage**upgrades.damage||0)), 
					baseStats.moveSpeed * (upgradeMultipliers.moveSpeed**upgrades.moveSpeed||0), baseStats.isFlying,
					baseStats.attackRate * (upgradeMultipliers.attackRate**upgrades.attackRate||0), 
					baseStats.attackCharges, baseStats.chainRange, baseStats.chainDamageReduction, 
					baseStats.splashRadius * (upgradeMultipliers.splashRadius**upgrades.splashRadius||0),
					baseStats.projectileSpeed * (upgradeMultipliers.projectileSpeed**upgrades.projectileSpeed||0), baseStats.projectileType,
					baseStats.attackRange * (upgradeMultipliers.attackRange**upgrades.attackRange||0), 
					baseStats.color, baseStats.color2);

	return newMinion;
	
}

function Minion(type, health, damage, moveSpeed, isFlying, attackRate, attackCharges, chainRange, chainDamageReduction, splashRadius, projectileSpeed, projectileType, attackRange, color, color2){
	this.type = type;
	this.health = health||10;
	this.maxHealth = health;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.isFlying = isFlying;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||projectileTypes.balistic;
	this.attackRange = attackRange||1;
	this.attackCharges = attackCharges||0;
	this.chainRange = chainRange||0;
	this.chainDamageReduction = chainDamageReduction||0;
	this.splashRadius = splashRadius||0;
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.color2 = color2;
	
	if(isDeathAbilityActive()){
		this.Location = new point(boss.Location.x, boss.Location.y);
		this.health = 1;
		this.maxHealth = 1;
		this.attack = 1;
	}
	else{
		this.Location = new point(path[1].x, path[1].y);
	}
	if(this.projectileType == projectileTypes.blast){
		this.splashRadius = this.attackRange;
	}

	this.lastAttack = attackRate;
	this.deathValue = 1;
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;
	this.yShift = Math.random() - .5;
	this.xShift = Math.random() - .5;
	
	this.effects = new UnitEffects();

	this.uid = "M_" + (new Date()%10000);
}

Minion.prototype.GetDamage = function(){
	var effectPower = this.effects.GetEffectPowerByName("damage");
	return this.damage * effectPower;
}
Minion.prototype.GetMoveSpeed = function(){
	var effectPower = this.effects.GetEffectPowerByName("moveSpeed");
	return this.moveSpeed * effectPower * getScale();
}
Minion.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Minion.prototype.GetAttackRange = function(){
	var effectPower = this.effects.GetEffectPowerByName("attackRange");
	return this.attackRange * effectPower * getScale()
}
Minion.prototype.DoHealing = function(){
	if(this.type == "Earth"){
		this.health = Math.min(this.maxHealth, this.health + (this.GetDamage() / 256));
	}
	
	var effectPower = this.effects.GetEffectPowerByName("health");
	if(effectPower == 1){return;}
	this.health = Math.min(this.maxHealth, this.health+effectPower);
}
Minion.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta; 
}

Minion.prototype.Move = function(){
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}

	var x = this.xShift * pathW;
	var y = this.yShift * pathW;
	var currentLocation = new point(this.Location.x - x, this.Location.y - y);
	var scale = getScale();
	
	var i = 1;
	while(path[i].x <= currentLocation.x && i < path.length){i++;}

	var target = new point(path[i].x, path[i].y);
	var newLocation = calcMove(this.GetMoveSpeed(), currentLocation, target);
	
	var newLocation = new point(newLocation.x + x, newLocation.y + y);
	newLocation.x = Math.min(newLocation.x, levelEndX());
	
	this.Location = newLocation;
}
Minion.prototype.Draw = function(){
	
	ctx.strokeStyle=this.color;
	ctx.fillStyle=this.color2;
	var sideLen = pathW>>1;
	
	
	var lineW = 1;
	ctx.beginPath();
	ctx.fillRect(this.Location.x-(sideLen/2), this.Location.y-(sideLen/2), sideLen, sideLen);
	ctx.beginPath();
	ctx.lineWidth=lineW;
	ctx.rect(this.Location.x-((sideLen+lineW)/2), this.Location.y-((sideLen+lineW)/2), sideLen+lineW, sideLen+lineW);

	if(Quality >=2){
		ctx.moveTo(this.Location.x-(sideLen/2), this.Location.y-(sideLen/2));
		ctx.lineTo(this.Location.x+(sideLen/2), this.Location.y+(sideLen/2));
		ctx.moveTo(this.Location.x-(sideLen/2), this.Location.y+(sideLen/2));
		ctx.lineTo(this.Location.x+(sideLen/2), this.Location.y-(sideLen/2));
	}
	ctx.stroke();

	var gaugesChecked = GetGaugesCheckedForUnitType("Minion");
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
		ctx.arc(this.Location.x, this.Location.y, pathL, -halfPi, percent*twoPi-halfPi);
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
Minion.prototype.Aim = function(){
	var effectPower = this.effects.GetEffectPowerByName("attackRate");
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);

	for(var i=0;i<team1.length;i++){
		//cheap check
		var range = this.GetAttackRange();
		if(Math.abs(team1[i].Location.x - this.Location.x) < range)
		{
			//fancy check
			if(inRange(team1[i].Location, this.Location, range)){
				this.Attack(team1[i]);
				
				
				if(minionResearch[this.type].unlockT < 2){
					return true;
				}
				//elementals move and attack.
				else if(team1[i].type == "Cleric" || team1[i].type == "Prophet" || team1[i].type == "Templar"){
					return true;//stop at hero
				}
			}
		}
	}
	return false;
}
Minion.prototype.Attack = function(target){
	if(this.lastAttack < this.GetAttackRate()){ return; }
	
	var attackEffect = null;
	if(this.type == "Fire"){
		var power = this.GetDamage() / -64;
		attackEffect = new UnitEffect("health", effectType.condition, 128, power);
	}

	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, target.uid, this.uid, this.projectileSpeed, this.GetDamage(), attackEffect,
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType)

	this.lastAttack = 0;
}
Minion.prototype.Aura = function(){
	
	var name = null;
	var power = 0;
	var type = effectType.boon;
	var duration = 16;
	switch(this.type){
		case "Air":
			name = "moveSpeed";
			power = 2;
			break;
		case "Water":
			name = "health";
			power = this.GetDamage() / 128;
			break;
		default:
			return;
	}
	
	var range = this.GetAttackRange();
	var minX = this.Location.x - range;
	var maxX = this.Location.x + range;
	
	var units = team0.filter(u=>u.Location.x > minX && 
								u.Location.x < maxX && 
								u.uid != this.uid);
	
	for(var i=0;i<units.length;i++){
		units[i].effects.AddEffect(name, type, duration, power);
	}
	
}

Minion.prototype.TakeDamage = function(damage){
	this.health -= damage;
}