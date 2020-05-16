var addMinionQ = [];
var lastGlobalSpawn = 0;
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
			}
		}
		
		//Get minion Order
		getMinionOrder();
		
		for(var i=0;i<minions.length;i++){
			if(!minions[i].Aim()){
				minions[i].Move(); 
			}
		}
	}
	
	spawnMinions();
	addMinion();
}
function spawnMinions(){
	if(minions.length >= getMaxMinions()){return;}
	for(var minionType in minionResearch)
{		
		var chk = document.getElementById('chkSpawn{0}'.format(minionType))
		if(chk == null || !chk.checked || !minionResearch[minionType].isUnlocked){continue;}

		minionResearch[minionType].lastSpawn++;

		var spawnDelay = getMinionSpawnDelay(minionType);
		if(minionResearch[minionType].lastSpawn > spawnDelay){
			var spawnCount = minionUpgrades[minionType].minionsPerSpawn + 1;
			for(var i=0;i<spawnCount;i++){
				addMinionQ[addMinionQ.length] = minionType;
			}
			minionResearch[minionType].lastSpawn=0;
		}
	}
}
function addMinion(){
	if(addMinionQ.length == 0 || minions.length >= getMaxMinions()){return;}
	if(lastGlobalSpawn++ < globalSpawnDelay){ return; }

	var type = addMinionQ.shift();
	minions[minions.length] =  MinionFactory(type);
	lastGlobalSpawn = 0;
	minionsSpawned++;
}
function getMinionOrder(){
	minionOrder = unitArrayOrderByLocationX(minions);
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

function MinionFactory(type){
	
	var baseStats = getMinionBaseStats(type);
	var upgradeMultipliers = getMinionUpgradeMultipliers(type);
	var upgrades = minionUpgrades[type];

	var newMinion = new Minion(Math.floor(baseStats.health * (upgradeMultipliers.health**upgrades.health||0)), 
					Math.floor(baseStats.damage * (upgradeMultipliers.damage**upgrades.damage||0)), 
					baseStats.moveSpeed * (upgradeMultipliers.moveSpeed**upgrades.moveSpeed||0), baseStats.isFlying,
					baseStats.attackRate * (upgradeMultipliers.attackRate**upgrades.attackRate||0), 
					baseStats.splashRadius * (upgradeMultipliers.splashRadius**upgrades.splashRadius||0),
					baseStats.projectileSpeed * (upgradeMultipliers.projectileSpeed**upgrades.projectileSpeed||0), 
					baseStats.attackRange * (upgradeMultipliers.attackRange**upgrades.attackRange||0), 
					baseStats.color, baseStats.color2);

	return newMinion;
	
}

function Minion(health, damage, moveSpeed, isFlying, attackRate, splashRadius, projectileSpeed, attackRange, color, color2){
	this.health = health||10;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.isFlying = isFlying;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.attackRange = attackRange||1;
	this.splashRadius = splashRadius||0;
	this.Location = new point(path[1].x, path[1].y);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.color2 = color2;
	
	this.lastAttack = attackRate;
	this.deathValue = 1;
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;
	this.yShift = Math.random() - .5;
	this.xShift = Math.random() - .5;
	
	this.effects = [];
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
	var newLocation = calcMove(this.moveSpeed*scale, currentLocation, target);
	
	this.Location = new point(newLocation.x + x, newLocation.y + y);
}
Minion.prototype.Draw = function(){
	
	var r = pathW>>1;
	ctx.beginPath();
	ctx.fillStyle=this.color2;
	ctx.arc(this.Location.x, this.Location.y, r, 0,twoPi);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle=this.color;
	ctx.lineWidth=2;
	ctx.arc(this.Location.x, this.Location.y, r, 0,twoPi);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(this.Location.x, this.Location.y, 1, 0,twoPi);
	ctx.stroke();

	var gaugesChecked = GetGaugesCheckedForUnitType('Minion');
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
		var percent = this.lastAttack/this.attackRate;
		ctx.arc(this.Location.x, this.Location.y, this.AttackRange()>>1, -halfPi, percent*twoPi-halfPi);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		var hp = Math.round(this.health * 10) / 10;
		var w = ctx.measureText(hp).width;
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y-(pathW);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(this.health,x,y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		var w = ctx.measureText(this.damage).width
		var x = this.Location.x-(w>>1)-1;
		var y = this.Location.y+(pathW*1.6);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(this.damage, x, y);
	}
	ctx.closePath();
}
Minion.prototype.AttackRange = function(){return this.attackRange*getScale();}
Minion.prototype.Aim = function(){
	this.lastAttack++;
	
	for(var i=0;i<team1.length;i++){
		//cheap check
		if(Math.abs(team1[i].Location.x - this.Location.x) < this.AttackRange())
		{
			//fancy check
			if(inRange(team1[i].Location, this.Location, this.AttackRange())){
				this.Attack(team1[i]);
				return true;
			}
		}
	}
	return false;
}
Minion.prototype.Attack = function(target){
	if(this.lastAttack < this.attackRate){ return; }

	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.damage,
							this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
							this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, 'aoe')

	this.lastAttack = 0;
}
Minion.prototype.TakeDamage = function(damage){
	this.health -= damage;
}