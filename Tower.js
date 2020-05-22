function manageTowers(){
	if(towers.length > 0){
		for(var i=0; i< towers.length;i++){
			//remove stragglers
			if(towers[i].Location.x < langoliers || towers[i].health <= 0){
				if(towers[i].health <= 0){ resources.a.amt += towers[i].deathValue; }
				else { resources.a.amt += towers[i].deathValue>>2; }
				towers.splice(i,1);
				i--;
				continue;
			}

			towers[i].Aim();
			towers[i].DoHealing();
			towers[i].effects.ManageEffects();
		}
	}
	
}
function addTower(){
	var lastTower = getLastTower();
	var lastTowerX = (lastTower ? lastTower.Location.x : 0);
	var lastTowerPaths = lastTowerX / pathL;
	
	var level = getLevelAtPathCount(lastTowerPaths + totalPaths);
	var levelStart = LevelToTotalPaths(level) - totalPaths;
	var levelEnd = LevelToTotalPaths(level + 1) - totalPaths;
	var remaining = levelEnd - lastTowerPaths;

	var towerSpacing = Math.ceil(Math.max(.1 * remaining, .5) * pathL);
	var newTowerX = lastTowerX + towerSpacing;
	
	if(path[path.length - 1].x < newTowerX){ return; }
	
	var type = getNextTowerType();
	
	var newTower = TowerFactory(type, level, newTowerX, null);
	towers[towers.length] = newTower;

}
function drawTowers() {
	for(var i=0;i<towers.length;i++){ 
		towers[i].Draw(); 
	}	
}
function getNextTowerType(){
	var weightedTowerList = [];
	
	for(var towerType in baseTower){
		var spawnWeight = getTowerBaseStats(towerType).spawnWeight;
		for(var i=0;i<spawnWeight;i++){
			weightedTowerList.push(towerType);
		}
	}
	var index = getRandomInt(0, weightedTowerList.length)

	return weightedTowerList[index];
}
function getLastTower(){
	if(!towers || !towers.length){
		return null;
	}
	
	return towers[towers.length -1]
}
function getTowerBaseStats(type){
	var baseStats = {};
	Object.assign(baseStats, baseTowerDefault, baseTower[type]);
	
	return baseStats;
}
function getTowerLevelMultipliers(type){
	var levelMultipliers = {};
	Object.assign(levelMultipliers, towerLevelMultipliersDefault, towerLevelMultipliers[type]);
	
	return levelMultipliers;
}

function TowerFactory(type, level, x, y){
	var base = getTowerBaseStats(type);
	var levelMultipliers = getTowerLevelMultipliers(type);
	var range = base.attackRange * levelMultipliers.attackRange**level;
	var distFromPath = 0;
	if(y == null){
		var pathY = getPathYatX(x);

		var r1 = Math.random() * (range * getScale()/2);
		var r2 = Math.random() * (range * getScale()/2);
		distFromPath = Math.max(pathW*1.5, r1 + r2);
		
		if(towers.length % 2 == 0){//above path
			y = pathY - distFromPath;
		}
		else{//below path
			y = pathY + distFromPath;
		}
	}

	var deathValue = 8 + (level+level);
	
	var newTower = new Tower(type, deathValue, base.canHitAir, base.canHitGround,
			Math.floor(base.health * levelMultipliers.health**level), 
			Math.floor(base.damage * levelMultipliers.damage**level), 
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

function Tower(type, deathValue, canHitAir, canHitGround, health, damage, attackRate, projectileSpeed, projectileType, attackRange, attackCharges, chainRange, chainDamageReduction, splashRadius, x, y, color, color2){
	this.type = type;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||10;
	this.maxHealth = health*2||20;
	this.damage = damage||0;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||"aoe";
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
}

Tower.prototype.GetDamage = function(){
	var effectPower = this.effects.GetEffectPowerByName("damage");
	return this.damage * effectPower;
}
Tower.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Tower.prototype.GetAttackRange = function(){
	var effectPower = this.effects.GetEffectPowerByName("attackRange");
	return this.attackRange * effectPower * getScale()
}

Tower.prototype.DoHealing = function(){
	var effectPower = this.effects.GetEffectPowerByName("health") - 1;
	if(effectPower == 0){return;}
	this.health = Math.min(this.maxHealth, this.health+effectPower);
}

Tower.prototype.Draw = function(){
	var len = pathW;
	var wid = Math.max(pathW/4,1)
	
	var half = len/2;

	ctx.fillStyle=this.color2;
	ctx.strokeStyle=this.color;
	ctx.lineWidth=len/5;
	
	ctx.beginPath();
	ctx.fillRect(this.Location.x-half, this.Location.y-half, len, len);
	if(Quality >= 2){
		ctx.rect(this.Location.x-half, this.Location.y-half, len, len);
		ctx.rect(this.Location.x-(wid/2), this.Location.y-(wid/2), wid, wid);
	}
	ctx.stroke();

	var gaugesChecked = GetGaugesCheckedForUnitType('Tower');
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
		ctx.arc(this.Location.x, this.Location.y, pathL, -halfPi, (percent*twoPi)-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		var hp = Math.ceil(this.health * 10) / 10;
		var w = ctx.measureText(hp).width
		var x = this.Location.x -(w>>1);
		var y = this.Location.y-pathW;
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+2,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(hp, x, y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		var dmg = Math.ceil(this.GetDamage() * 10) / 10;
		var text = dmg + (this.attackCharges <= 1 ? '' : 'x' + Math.floor(this.attackCharges+1));
		var w = ctx.measureText(text).width
		var x = this.Location.x -(w>>1);
		var y = this.Location.y+(pathW*1.6);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+2,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Tower.prototype.Aim = function() {
	var effectPower = this.effects.GetEffectPowerByName("attackRate");
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);
	
	//Attacks the leader if in range
	for(var i = 0; i< team0Order.length;i++){
		if(team0Order[i] > team0.length){ continue; }
		var target = team0[team0Order[i]];

		if(target.isFlying && !this.canHitAir){continue;}
		if(!target.isFlying && !this.canHitGround){continue;}
		
		//cheap check
		var range = this.GetAttackRange();
		var deltaX = Math.abs(this.Location.x - target.Location.x);
		var deltaY = Math.abs(this.Location.y - target.Location.y);
		if(deltaX < range && deltaY < range)
		{
			//fancy check
			if(inRange(target.Location, this.Location, range)){
				this.Attack(target);
				return true;
			}
		}
	}
}
Tower.prototype.Attack = function(target){
	if(this.lastAttack < this.GetAttackRate()){return;}

	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.GetDamage(),
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType);
							

	this.lastAttack = 0;
}
Tower.prototype.TakeDamage = function(damage) {
	this.health -= damage;
}