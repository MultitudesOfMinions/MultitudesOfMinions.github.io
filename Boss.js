function manageBoss(){
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
		if(!boss.Aim()){
			boss.Move();
		}
		boss.Aura();
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
	var rdo = document.querySelector('input[name="bossSelect"]:checked');
	if(rdo == null){return "none";}
	return rdo.value;
}
function getBossBaseStats(type){
	var baseStats = {};
	Object.assign(baseStats, baseBoss[type]);
	
	return baseStats;
}
function getBossUpgradeMultipliers(type){
	var upgradeMultipliers = {};
	Object.assign(upgradeMultipliers, bossUpgradeMultipliersDefault, bossUpgradeMultipliers[type]);
	
	return upgradeMultipliers;
}

function BossFactory(){
	var type = activeBoss();

	var baseStats = getBossBaseStats(type);
	var upgrades = bossUpgrades[type];
	var upgradeMultipliers = getBossUpgradeMultipliers(type)
	
	var symbol = baseStats.symbol;
	
	
	var newBoss = new Boss(type, symbol,
					Math.floor(baseStats.health * (upgradeMultipliers.health**(upgrades.health||0))), 
					Math.floor(baseStats.damage * (upgradeMultipliers.damage**(upgrades.damage||0))), 
					baseStats.moveSpeed * (upgradeMultipliers.moveSpeed**(upgrades.moveSpeed||0)), baseStats.isFlying,
					baseStats.attackRate * (upgradeMultipliers.attackRate**(upgrades.attackRate||0)), 
					baseStats.splashRadius * (upgradeMultipliers.splashRadius**(upgrades.splashRadius||0)),
					baseStats.projectileSpeed * (upgradeMultipliers.projectileSpeed**(upgrades.projectileSpeed||0)), 
					baseStats.attackRange * (upgradeMultipliers.attackRange**(upgrades.attackRange||0)), 
					baseStats.auraRange * (upgradeMultipliers.auraRange**(upgrades.auraRange||0)), 
					baseStats.auraPower * (upgradeMultipliers.auraPower**(upgrades.auraPower||0)), 
					
					baseStats.abilityCooldown * (upgradeMultipliers.abilityCooldown**(upgrades.abilityCooldown||0)), 
					baseStats.abilityDuration * (upgradeMultipliers.abilityDuration**(upgrades.abilityDuration||0)), 

					
					baseStats.color, baseStats.color2);
	
	return newBoss;
}

function Boss(type, symbol, health, damage, moveSpeed, isFlying, attackRate, splashRadius, projectileSpeed, attackRange, auraRange, auraPower, abilityCooldown, abilityDuration, color, color2){
	this.type = type;
	this.symbol = symbol;
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

	this.auraPower = auraPower;
	this.auraRange = auraRange;
	this.abilityCooldown = abilityCooldown;
	this.abilityDuration = abilityDuration;

	this.color = color;
	this.color2 = color2;
	
	
	this.lastAttack = attackRate;
	this.deathValue = 10;
	
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;

	this.effects = [];
}
Boss.prototype.Move = function (){
	if(isNaN(this.Location.x)){
		this.Location.x = path[0].x;
		this.Location.y = path[0].y;
	}
	var aggression = document.getElementById("bossAggresion").value;

	var leaderCushion = (25-aggression) * pathL;
	var targetX = gameW; 
	var moveSpeed = this.moveSpeed;
	var scale = getScale();

	if(aggression < 25 && minionOrder.length > 0 && minions.length > minionOrder[0]){
		var leader = minions[minionOrder[0]];
		targetX = Math.max(leader.Location.x - leaderCushion, pathL);
		moveSpeed = Math.min(moveSpeed, leader.moveSpeed);
		
		if(Math.abs(targetX - this.Location.x) < moveSpeed*scale){
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
	
	var newLocation = calcMove(moveSpeed*scale, this.Location, target)
	
	this.Location = newLocation;
}
Boss.prototype.Draw = function (){
	ctx.fillStyle="#000";
	ctx.strokeStyle=this.color;
	
	ctx.beginPath();
	ctx.arc(this.Location.x, this.Location.y, pathL, 0, twoPi);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle=this.color;
	ctx.font = "bold 20pt Arial"
	var size = ctx.measureText(this.symbol);
	ctx.fillText(this.symbol, this.Location.x-(size.width/2), this.Location.y+10);
	ctx.font = "bold 12pt Arial"
	
	var gaugesChecked = GetGaugesCheckedForUnitType('Boss');
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
Boss.prototype.DrawAura = function(){
	var gaugesChecked = GetGaugesCheckedForUnitType('Boss');
	if(gaugesChecked.Range){
		var x = this.Location.x - this.AuraRange();
		var w = this.AuraRange() * 2;

		ctx.fillStyle=this.color2;
		ctx.arc(this.Location.x, this.Location.y, this.AuraRange(), 0, 2 * Math.PI);
		ctx.fill();
	}
}
Boss.prototype.AttackRange = function (){return this.attackRange*pathL;}
Boss.prototype.AuraRange = function() {return this.auraRange*pathL;}
Boss.prototype.Aim = function (){
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
Boss.prototype.Attack = function (target){
	if(this.lastAttack < this.attackRate){ return; }

	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.damage,
						this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
						this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, 'aoe')

	this.lastAttack = 0;

}
Boss.prototype.Aura = function(){
	switch(this.type){
		case "Death":
			break;
		case "Famine":
			break;
		case "War":
			break;
		default:
			console.warn("Unknown boss aura:" + this.type);
			break;
	}
}
Boss.prototype.ActiveAbility = function(){
	switch(this.type){
		case "Death":
			break;
		case "Famine":
			break;
		case "War":
			break;
		default:
			console.warn("Unknown boss ability:" + this.type);
			break;
	}
}
Boss.prototype.TakeDamage = function(damage){
	console.log(damage);
	this.health -= damage;
}
