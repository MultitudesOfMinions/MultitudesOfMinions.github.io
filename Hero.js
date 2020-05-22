function manageHero(){
	if(hero === null){addHero()}
	
	if(hero.Location.x < langoliers || hero.health <= 0 || isNaN(hero.health)){
		resources.a.amt += hero.deathValue;
		hero.DeathEffect();
		hero = null;
	}
	else{
		//hero slowly regen health
		if(hero.health < hero.maxHP){
			if(hero.lastRegen++ > hero.regen){
				hero.health++;
				hero.lastRegen =0;
			}
		}
		
		if(!hero.Aim()){
			hero.Move();
		}
		hero.Aura();
		hero.effects.ManageEffects();
	}
}
function addHero(){
	var level = GetNextHeroLevel();
	var x = GetNextHeroX();
	var y = getPathYatX(x);// gameH/2;
	
	var index = getRandomInt(0, Object.keys(baseHero).length);
	var type = Object.keys(baseHero)[index];
	
	hero = HeroFactory(type, level, x, y);
}
function drawHero(){
	if(hero && hero.health >= 0){
		hero.Draw();
	}
}
function drawHeroAura(){
	if(hero && hero.health){
		hero.DrawAura();
	}
}
function GetNextHeroLevel(){
	return getLevelAtPathCount(totalPaths + (PathsPerLevel/2));
}
function GetNextHeroX(){
	var level = GetNextHeroLevel();
	var endOfLevel = LevelToTotalPaths(level+1) - 2;
	var x = (endOfLevel - totalPaths) * pathL;
	return x;
}

function HeroFactory(type, level, x, y){
	
	var base = baseHero[type];
	var deathValue = 25 + (level * level);
	
	var newHero = new Hero(type, level, base.symbol, deathValue, base.canHitAir, base.canHitGround,
			Math.floor(base.health * heroLevelMultipliers.health**level), 
			Math.floor(base.regen * heroLevelMultipliers.regen**level * 100)/100, 
			Math.floor(base.damage * heroLevelMultipliers.damage**level), 
			base.moveSpeed * heroLevelMultipliers.moveSpeed**level,
			base.attackRate * heroLevelMultipliers.attackRate**level, 
			base.projectileSpeed * heroLevelMultipliers.projectileSpeed**level, 
			base.projectileType,
			base.attackRange * heroLevelMultipliers.attackRange**level,
			base.attackCharges * heroLevelMultipliers.attackCharges**level, 
			base.splashRadius * heroLevelMultipliers.splashRadius**level,
			base.heroPowerType, x, y, base.color, base.color2);
	
	
	return newHero;
}

function Hero(type, level, symbol, deathValue, canHitAir, canHitGround,  health, regen, damage, moveSpeed, attackRate, projectileSpeed, projectileType, attackRange, attackCharges, splashRadius, heroPowerType, x, y, color, color2){
	this.type = type;
	this.deathValue = deathValue;
	this.canHitAir = canHitAir;
	this.canHitGround = canHitGround;
	this.health = health||10;
	this.maxHP = health||10;
	this.regen = regen;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.attackRate = attackRate||1;
	this.projectileSpeed = projectileSpeed||1;
	this.projectileType = projectileType||"aoe";
	this.attackRange = attackRange||1;
	this.Location = new point(x, y);
	this.home = new point(x, y);
	this.projectiles = [];
	this.moveSpeedMultiplier = 1;
	this.attackRateMultiplier = 1;
	this.damageMultiplier = 1;
	this.color = color;
	this.color2 = color2;
	this.attackCharges = attackCharges||0;
	this.splashRadius = splashRadius||1;
	
	this.heroPowerType = heroPowerType;
	this.heroPowerValues = [];
	for(var i=0;i<heroPowerType.effects.length;i++){
		var hpte = heroPowerType.effects[i];
		this.heroPowerValues.push({
			type:hpte.effectType,
			power: hpte.baseValue * hpte.levelMultiplier**level,
			isAura: hpte.isAura
		});
	}

	this.lastAttack = this.attackRate;
	this.lastRegen = 0;
	this.wanderDirection = 1;
	
	this.sym = symbol;
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 1;
	
	this.effects = new UnitEffects();
}

Hero.prototype.GetDamage = function(){
	var effectPower = this.effects.GetEffectPowerByName("damage");
	return this.damage * effectPower;
}
Hero.prototype.GetMoveSpeed = function(){
	var effectPower = this.effects.GetEffectPowerByName("moveSpeed");
	return this.moveSpeed * effectPower * getScale();
}
Hero.prototype.GetAttackRate = function(){
	return this.attackRate;
}
Hero.prototype.GetAttackRange = function(){
	var effectPower = this.effects.GetEffectPowerByName("attackRange");
	return this.attackRange * effectPower * getScale()
}

Hero.prototype.Move = function(){
	this.target = new point(0, 0)

	var leader = null;
	if(team0 != null && team0Order != null && team0Order[0] < team0.length){
		leader = team0[team0Order[0]];
	}
	
	//Go towards the leader if in range or passed
	if(leader != null && leader.Location.x > endZoneStartX()){
		//pursue leader
		this.target = new point(leader.Location.x, leader.Location.y);
	}
	else if(Math.abs(this.Location.x - this.home.x) > this.GetMoveSpeed()/2){
		//go home
		this.target = new point(this.home.x, this.home.y);
	}
	else{
		//wander
		if(this.home.y - this.Location.y > gameH/4){
			this.wanderDirection = 1;
		}
		else if(this.Location.y - this.home.y > gameH/4){
			this.wanderDirection = -1;
		}
		
		this.Location.x = this.home.x;
		this.Location.y += this.GetMoveSpeed() / 4 * this.wanderDirection;
		return;
	}
	
	if(this.target.x === 0 && this.target.y === 0){ return; }
	this.Location = calcMove(this.GetMoveSpeed(), this.Location, this.target);
}
Hero.prototype.Draw = function(){
	ctx.fillStyle=this.color2;
	
	ctx.font = "bold 16pt Arial"
	var textW = ctx.measureText(this.sym).width

	ctx.beginPath();
	ctx.fillRect(this.Location.x-(textW/2)-2, this.Location.y-10, textW+4, 20);
	ctx.fillStyle=this.color;
	
	if(Quality >= 2){
		ctx.fillText(this.sym, this.Location.x-textW/2-2, this.Location.y+7);
	}
	ctx.font = "bold 12pt Arial"
	
	var gaugesChecked = GetGaugesCheckedForUnitType('Hero');
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
		var percent = this.lastAttack/this.attackRate
		ctx.arc(this.Location.x, this.Location.y, pathL, -halfPi, percent*twoPi-halfPi, 0);
		ctx.stroke();
	}
	if(gaugesChecked.Health){
		ctx.beginPath();
		var hp = Math.ceil(this.health * 10) / 10;
		var w = ctx.measureText(hp).width
		var x = this.Location.x -(w>>1);
		var y = this.Location.y-pathW;
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(hp, x, y);
	}
	if(gaugesChecked.Damage){
		ctx.beginPath();
		var w = ctx.measureText(this.damage).width
		var x = this.Location.x -(ctx.measureText(this.damage).width>>1);
		var y = this.Location.y+(pathW*1.6);
		ctx.fillStyle='#000';
		ctx.fillRect(x-1,y-9,w+3,12);
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(this.damage, x, y);
	}	
	ctx.closePath();
}
Hero.prototype.DrawAura = function(){
	var auraPowers = this.heroPowerValues.filter(effect => effect.isAura);
	if(auraPowers.length == 0) { return; }
	var gaugesChecked = GetGaugesCheckedForUnitType('Hero');
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
Hero.prototype.AuraRange = function() {return this.attackRange*getScale()*2;}
Hero.prototype.Aim = function() {
	var effectPower = this.effects.GetEffectPowerByName("attackRate");
	this.lastAttack += effectPower;
	this.lastAttack = Math.min(this.GetAttackRate(), this.lastAttack);

	//Attacks the leader if in range
	if(team0.length > 0 && team0.length > team0Order[0]){
		var target = team0[team0Order[0]];
		
		//cheap check
		if(target && Math.abs(this.Location.x - target.Location.x) < this.GetAttackRange())
		{
			//fancy check
			if(inRange(target.Location, this.Location, this.GetAttackRange())){
				this.Attack(target);
				return true;
			}
		}
	}

	return false;
}
Hero.prototype.Attack = function (target){
	if(this.lastAttack < this.GetAttackRate()){ return; }

	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.GetDamage(),
			this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
			this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, this.projectileType)

	this.lastAttack = 0;
}
Hero.prototype.DeathEffect = function(){}
Hero.prototype.Aura = function(){
	var auraPowers = this.heroPowerValues.filter(effect => effect.isAura);
	if(auraPowers.length == 0) { return; }
	if(towers.length == 0){ return; }
	
	var range = this.AuraRange();
	var minX = this.Location.x - range;
	var maxX = this.Location.x + range;
	
	for(var i=0;i<auraPowers.length;i++){
		for(var j=0; j< towers.length;j++){
			var power = auraPowers[i].power;
			var type = auraPowers[i].type;
			
			if(towers[j].Location.x > minX && towers[j].Location.x < maxX){
				if(inRange(towers[j].Location, this.Location, range)){
					towers[j].effects.AddEffect(type, effectType.boon, 10, power);
				}
			}
		}
	}
}
Hero.prototype.TakeDamage = function(damage){
	var drPowers = this.heroPowerValues.filter(effect => effect.type == "damageReduction");
	if(drPowers.length == 1) {
		var power = drPowers[0].power;
		damage -= Math.floor(1/power);
		damage *= power;
		damage = Math.max(.01,damage);
	}

	this.health -= damage;
}
