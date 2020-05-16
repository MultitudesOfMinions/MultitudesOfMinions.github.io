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
	
	var pathY = getPathYatX(newTowerX);
	var min = level<<1;
	var r1 = getRandomInt(min, (gameH>>3)+min);
	var r2 = getRandomInt(min, (gameH>>3)+min);
	
	var newTowerY = r1 + r2 + pathW;
	if(towers.length % 2 == 0){//above path
		newTowerY = pathY - newTowerY;
	}
	else{//below path
		newTowerY = pathY + newTowerY;
	}

	towers[towers.length] = TowerFactory(type, level, newTowerX, newTowerY);
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

	var deathValue = 10 * (level+ 1);
	
	var newTower = new Tower(type, deathValue, base.canHitAir, base.canHitGround,
			Math.floor(base.health * levelMultipliers.health**level), 
			Math.floor(base.damage * levelMultipliers.damage**level), 
			base.attackRate * levelMultipliers.attackRate**level, 
			base.projectileSpeed * levelMultipliers.projectileSpeed**level, 
			base.attackRange * levelMultipliers.attackRange**level,
			base.attackCharges * levelMultipliers.attackCharges**level,
			base.chainRange * levelMultipliers.chainRange**level,
			base.chainDamageReduction * levelMultipliers.chainDamageReduction**level,
			base.splashRadius * levelMultipliers.splashRadius**level,
			x, y, base.color, base.color2);
	
	newTower.attackRateBoostValue = 1;
	return newTower;
}

function Tower(type, deathValue, canHitAir, canHitGround, health, damage, attackRate, projectileSpeed, attackRange, attackCharges, chainRange, chainDamageReduction, splashRadius, x, y, color, color2){
	this.type = type;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||10;
	this.maxHealth = health*2||20;
	this.damage = damage||0;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.attackRange = attackRange||1;
	this.Location = new point(x,y);
	this.color = color;
	this.color2 = color2;
	this.attackCharges = attackCharges||0;
	this.chainRange = chainRange||0;
	this.chainDamageReduction = chainDamageReduction||0;
	this.splashRadius = splashRadius||1;
	
	this.lastAttack = this.attackRate;
	this.deathValue = 10;
	this.team = 1;
	
	this.effects = [];
}

Tower.prototype.getDamage = function(){
	return this.damage;//TODO: figure out hero boosts.
}

Tower.prototype.getAttackRate = function(){
	return this.attackRate * this.attackRateBoostValue;
}

Tower.prototype.Draw = function(){
	var len = pathW;
	var wid = Math.max(pathW/4,1)
	
	var half = pathW/2;

	ctx.fillStyle=this.color2;
	ctx.strokeStyle=this.color;
	ctx.lineWidth=2;
	
	ctx.beginPath();
	ctx.fillRect(this.Location.x-half, this.Location.y-half, len, len);
	ctx.rect(this.Location.x-half, this.Location.y-half, len, len);
	ctx.rect(this.Location.x-(wid/2), this.Location.y-(wid/2), wid, wid);
	ctx.stroke();

	var gaugesChecked = GetGaugesCheckedForUnitType('Tower');
	if(gaugesChecked.Range){
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, this.AttackRange(), 0, twoPi);
		ctx.stroke();
	}
	if(gaugesChecked.Reload){
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=2;
		ctx.beginPath();
		var percent = this.lastAttack/this.attackRate
		ctx.arc(this.Location.x, this.Location.y, this.AttackRange()>>1, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		var hp = Math.round(this.health * 10) / 10;
		var w = ctx.measureText(hp).width
		var x = this.Location.x - w>>1;
		var y = this.Location.y-pathW;
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(this.health, x, y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		var text = this.damage + (this.attackCharges <= 1 ? '' : 'x' + Math.floor(this.attackCharges+1));
		var w = ctx.measureText(text).width
		var x = this.Location.x -(ctx.measureText(text).width>>1);
		var y = this.Location.y+(pathW*1.6);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(text, x, y);
	}
	ctx.closePath();
}
Tower.prototype.AttackRange = function(){return this.attackRange*pathL*(1/this.attackRateBoostValue)}
Tower.prototype.Aim = function() {
	this.lastAttack++;
	
	//Attacks the leader if in range
	for(var i = 0; i< team0Order.length;i++){
		if(team0Order[i] > team0.length){ continue; }
		var target = team0[team0Order[0]];

		if(target.isFlying && !this.canHitAir){continue;}
		if(!target.isFlying && !this.canHitGround){continue;}
		
		//cheap check
		if(target && Math.abs(this.Location.x - target.Location.x) < this.AttackRange())
		{
			//fancy check
			if(inRange(target.Location, this.Location, this.AttackRange())){
				this.Attack(target);
				return true;
			}
		}
	}
}
Tower.prototype.Attack = function(target){
	if(this.lastAttack < this.getAttackRate()){return;}

	var ammoType = this.type == "Laser" ? 'laser' : 'aoe';
	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.getDamage(),
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, ammoType);
							

	this.lastAttack = 0;
}
Tower.prototype.TakeDamage = function(damage) {
	this.health -= damage;
}