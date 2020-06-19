"use strict";
const addMinionQ = [];
let lastGlobalSpawn = 0;
let globalSpawnDelay = 50;
function getGlobalSpawnDelay(){
	const reduction = .95**(globalSpawnDelayReduction+1);
	return (globalSpawnDelay * (getLevel()+1)) * reduction;
}
function manageMinions(){
	if(minions.length == 0){
		minionOrder.length = 0;
	}
	else{
		//remove stragglers
		for(let i=0;i<minions.length;i++){
			if(minions[i].Location.x < langoliers || minions[i].health <=0){
				if(minions[i].health <= 0){ resources.a.amt += minions[i].deathValue; }
				minions.splice(i,1);
				i--;
				
				if(boss != null && boss.type == "Death"){
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
	
	for(let minionType in minionResearch)
{		
		const chk = document.getElementById("chkSpawn{0}".format(minionType))
		if(chk == null || !chk.checked || !minionResearch[minionType].isUnlocked){continue;}

		minionResearch[minionType].lastSpawn++;
		if(isDeathAbilityActive()){ minionResearch[minionType].lastSpawn+= 10}

		const spawnDelay = getMinionSpawnDelay(minionType);
		if(minionResearch[minionType].lastSpawn > spawnDelay){
			const spawnCount = minionUpgrades[minionType].minionsPerSpawn + 1;
			for(let i=0;i<spawnCount;i++){
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
			const type = addMinionQ.shift();
			minions[minions.length] =  MinionFactory(type);
		}
	}
	
	if(addMinionQ.length == 0 || getMinionCount() >= getMaxMinions()){return;}
	lastGlobalSpawn++;
	if(lastGlobalSpawn < getGlobalSpawnDelay()){ return; }

	const type = addMinionQ.shift();
	minions[minions.length] =  MinionFactory(type);
	lastGlobalSpawn = 0;
	achievements.minionsSpawned.count++;
}
function getMinionCount(){
	let count = 0;
	for(let i=0;i<minions.length;i++){
		const type = minions[i].type
		count += 1 / (minionUpgrades[type].minionsPerSpawn + 1);
	}
	return count;
}
function drawMinions(){ 
	for(let i=0;i<minions.length;i++){ 
		minions[i].Draw(); 
	}
}
function getMinionSpawnDelay(type){
	
	const base = getMinionBaseStats(type).spawnDelay;
	const upgradeMultiplier = getMinionUpgradeMultipliers(type).spawnDelay;
	const upgrades = minionUpgrades[type].spawnDelay;
	
	return base * (upgradeMultiplier**upgrades);
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
	const upgradeMultipliers = getMinionUpgradeMultipliers(type);
	const upgrades = minionUpgrades[type];

	const stats = [];
	for(let stat in baseStats){
		if(upgradeMultipliers.hasOwnProperty(stat)){
			const base = baseStats[stat];
			const mult = upgradeMultipliers[stat];
			const upg = upgrades[stat];
			const prod = Math.floor(base*(mult**upg)*100)/100;
			
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
function clearQ(){addMinionQ.length = 0;}

function MinionFactory(type){
	
	const baseStats = getMinionBaseStats(type);
	const upgradeMultipliers = getMinionUpgradeMultipliers(type);
	const upgrades = minionUpgrades[type];

	const newMinion = new Minion(type, Math.floor(baseStats.health * (upgradeMultipliers.health**upgrades.health||0)), 
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
		const newX = boss.Location.x + pathL;
		const newY = getPathYatX(newX);
		this.Location = new point(newX, newY);
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
	const effectPower = this.effects.GetEffectPowerByName(statTypes.damage);
	return this.damage * effectPower;
}
Minion.prototype.GetMoveSpeed = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.moveSpeed);
	return this.moveSpeed * effectPower * getScale();
}
Minion.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Minion.prototype.GetAttackRange = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.attackRange);
	return this.attackRange * effectPower * getScale()
}
Minion.prototype.DoHealing = function(){
	if(this.type == "Earth"){
		this.health = Math.min(this.maxHealth, this.health + (this.maxHealth / 2048));
	}
	
	const effectPower = this.effects.GetEffectPowerByName(statTypes.health);
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

	const x = this.xShift * pathW;
	const y = this.yShift * pathW;
	const currentLocation = new point(this.Location.x - x, this.Location.y - y);
	const scale = getScale();
	
	let i = 1;
	while(path[i].x <= currentLocation.x && i < path.length){i++;}

	let target = new point(path[i].x, path[i].y);
	if(this.type == "Fire"){
		for(let i=0;i<towers.length;i++){
			if(towers[i].Location.x > this.Location.x){
				target = new point(towers[i].Location.x, towers[i].Location.y) 
				break;
			}
		}
	} 
	const newLocation = calcMove(this.GetMoveSpeed(), currentLocation, target);
	
	newLocation.x += x;
	newLocation.y += y;
	newLocation.x = Math.min(newLocation.x, levelEndX());
	
	this.Location = newLocation;
}
Minion.prototype.Draw = function(){
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
		const sideLen = pathW>>1;
		
		const lineW = 1;
		ctx.beginPath();
		ctx.fillRect(this.Location.x-(sideLen/2), this.Location.y-(sideLen/2), sideLen, sideLen);
		ctx.beginPath();
		ctx.lineWidth=lineW;
		ctx.rect(this.Location.x-((sideLen+lineW)/2), this.Location.y-((sideLen+lineW)/2), sideLen+lineW, sideLen+lineW);

		if(Quality >=2){
			const halfLen = sideLen/2
			if(minionResearch[this.type].unlockT == 2){
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
				else{// If any other unlockT 2 get added this is default
					ctx.moveTo(this.Location.x, this.Location.y-sideLen);
					ctx.lineTo(this.Location.x, this.Location.y+sideLen);
					ctx.moveTo(this.Location.x-sideLen, this.Location.y);
					ctx.lineTo(this.Location.x+sideLen, this.Location.y);
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
	}
	const gaugesChecked = GetGaugesCheckedForUnitType("Minion");
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
		ctx.arc(this.Location.x, this.Location.y, pathL, -halfPi, percent*twoPi-halfPi);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		ctx.font = "8pt Helvetica"
		const hp = (Math.ceil(this.health * 10) / 10).toFixed(1)
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
		ctx.font = "8pt Helvetica"
		const dmg = Math.floor(this.GetDamage() * 10)/10;
		const w = ctx.measureText(dmg).width
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y+(pathW*1.6);
		ctx.fillStyle=color2;
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=color;
		ctx.fillText(dmg, x, y);
	}
	ctx.closePath();
}
Minion.prototype.Aim = function(){
	const effectPower = this.effects.GetEffectPowerByName(statTypes.attackRate);
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);

	const targets = [];
	for(let i=0;i<team1.length;i++){
		//cheap check
		const range = this.GetAttackRange();
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
	
	let attackEffect = null;
	if(this.type == "Fire"){
		const power = this.GetDamage() / -64;
		attackEffect = new UnitEffect(statTypes.health, effectType.condition, 128, power);
	}


	const loc = this.projectileType == projectileTypes.blast? this.Location : target.Location;

	projectiles[projectiles.length] = new Projectile(this.Location, loc, target.uid, this.uid, this.projectileSpeed, this.GetDamage(), attackEffect,
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType)

	if(this.type == "Air" && this.uid == minions[minionOrder[0]].uid){
		this.TakeDamage(1);
	}
	
	this.lastAttack = 0;
}
Minion.prototype.Aura = function(){
	
	let name = null;
	let power = 0;
	const type = effectType.boon;
	const duration = 16;
	switch(this.type){
		case "Air":
			name = statTypes.moveSpeed;
			power = 2;
			break;
		case "Water":
			name = statTypes.health;
			power = this.GetDamage() / 128;
			break;
		default:
			return;
	}
	
	const range = this.GetAttackRange();
	const minX = this.Location.x - range;
	const maxX = this.Location.x + range;
	
	const units = team0.filter(u=>u.Location.x > minX && 
								u.Location.x < maxX && 
								u.type != this.type);
	
	for(let i=0;i<units.length;i++){
		units[i].effects.AddEffect(name, type, duration, power);
	}
	
}

Minion.prototype.TakeDamage = function(damage){
	if(this.type == "Air"){
		damage = this.health;
	}

	this.health -= damage;
}