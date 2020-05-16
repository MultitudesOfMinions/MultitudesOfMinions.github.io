function manageHero(){
	if(hero === null){addHero()}
	
	if(hero.Location.x < langoliers || hero.health <= 0){
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
		
		hero.heroPower();
		if(!hero.Aim()){
			hero.Move();
		}
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
	return getLevelAtPathCount(totalPaths + (levelScale*.9));
}
function GetNextHeroX(){
	var level = GetNextHeroLevel();
	var endOfLevel = LevelToTotalPaths(level+1) - 1;
	var x = (endOfLevel - totalPaths) * pathL;
	return x;
}

function HeroFactory(type, level, x, y){
	
	var base = baseHero[type];
	var deathValue = 25 * (level + 1);
	var newHero = new Hero(type, level, deathValue, base.canHitAir, base.canHitGround,
			Math.floor(base.health * heroLevelMultipliers.health**level), 
			Math.floor(base.regen * heroLevelMultipliers.regen**level * 100)/100, 
			Math.floor(base.damage * heroLevelMultipliers.damage**level), 
			Math.floor(base.moveSpeed * heroLevelMultipliers.moveSpeed**level),
			base.attackRate * heroLevelMultipliers.attackRate**level, 
			base.projectileSpeed * heroLevelMultipliers.projectileSpeed**level, 
			base.attackRange * heroLevelMultipliers.attackRange**level,
			base.attackCharges * heroLevelMultipliers.attackCharges**level, 
			base.splashRadius * heroLevelMultipliers.splashRadius**level,
			base.heroPowerType.baseValue * base.heroPowerType.levelMultiplier**level,
			base.heroPowerType, x, y, base.color, base.color2);
	
	return newHero;
}

function Hero(type, level, deathValue, canHitAir, canHitGround,  health, regen, damage, moveSpeed, attackRate, projectileSpeed, attackRange, attackCharges, splashRadius, heroPowerValue, heroPowerType, x, y, color, color2){
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
	
	this.heroPowerValue = heroPowerValue;
	this.heroPowerType = heroPowerType

	this.lastAttack = this.attackRate;
	this.lastRegen = 0;
	this.wanderDirection = 1;
	
	this.sym = level;
	this.canHitGround = 1;
	this.canHitAir = 1;
	this.team = 0;
	
	this.effects = [];
}
Hero.prototype.Move = function(){
	this.target = new point(0, 0)

	var leader = null;
	if(team0 != null && team0Order != null && team0Order[0] < team0.length){
		leader = team0[team0Order[0]];
	}
	
	//Go towards the leader if in range
	if(leader != null && leader.Location.x > this.xTerritory()){
		//pursue leader
		this.target = new point(leader.Location.x, leader.Location.y);
	}
	else if(this.Location.x != this.home.x){
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
		
		this.Location.y += this.moveSpeed * getScale() / 16 * this.wanderDirection;
		return;
	}
	
	if(this.target.x === 0 && this.target.y === 0){ return; }
	this.Location = calcMove(this.moveSpeed*getScale(), this.Location, this.target);
}
Hero.prototype.Draw = function(){
	ctx.fillStyle=this.color2;
	
	ctx.beginPath();
	ctx.fillRect(this.Location.x-8, this.Location.y-8, 16, 16);
	ctx.fillStyle=this.color;
	ctx.font = "bold 16pt Arial"
	ctx.fillText(this.sym, this.Location.x-6, this.Location.y+6);
	ctx.stroke();
	ctx.font = "bold 12pt Arial"
	
	
	var gaugesChecked = GetGaugesCheckedForUnitType('Hero');
	if(gaugesChecked.Range){
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(this.Location.x, this.Location.y, this.AttackRange(), 0, twoPi);
		ctx.stroke();
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#F00';
		var x = this.xTerritory();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, gameH);
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
		var w = ctx.measureText(this.health).width
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
	if(this.heroPowerType.isAura)
	{
		var gaugesChecked = GetGaugesCheckedForUnitType('Hero');
		if(gaugesChecked.Range){

			var x = this.Location.x - this.AuraRange();
			var w = this.AuraRange() * 2;

			ctx.fillStyle=this.color2;
			ctx.arc(this.Location.x, this.Location.y, this.AuraRange(), 0,twoPi);
			ctx.fill();
		}
	}
}
Hero.prototype.AttackRange = function() {return this.attackRange*pathL;}
Hero.prototype.AuraRange = function() {return this.attackRange*pathL*1.5;}
Hero.prototype.xTerritory = function() {return hero.home.x - (hero.AttackRange()*2);}
Hero.prototype.Aim = function() {
	this.lastAttack++;
	
	//Attacks the leader if in range
	if(team0.length > 0 && team0.length > team0Order[0]){
		var target = team0[team0Order[0]];
		
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

	if(this.heroPowerType.name == 'Repair' && this.lastAttack > this.attackRate){
		this.lastAttack = 0;

		var minX = this.Location.x - this.AuraRange();
		var maxX = this.Location.x + this.AuraRange();
		
		if(towers.length > 0){
			for(var i=0; i< towers.length;i++){
				if(towers[i].Location.x >= minX && towers[i].Location.x <= maxX
					&& towers[i].health < towers[i].maxHealth){
					towers[i].health += this.heroPowerValue;
				}
			}
		}

	}
	return false;
}
Hero.prototype.Attack = function (target){
	if(this.lastAttack < this.attackRate){ return; }

	projectiles[projectiles.length] = new Projectile(this.Location, target.Location, this.projectileSpeed, this.damage,
			this.attackCharges||0, this.chainRange||0, this.chainDamageReduction||0,
			this.splashRadius, this.splashDamageReduction, this.canHitGround, this.canHitAir, this.team, 'aoe')

	this.lastAttack = 0;
}
Hero.prototype.DeathEffect = function(){}
Hero.prototype.heroPower = function(){
	if(!this.heroPowerType.isAura) { return; }
	
	var minX = this.Location.x - this.AuraRange();
	var maxX = this.Location.x + this.AuraRange();
	
	if(this.heroPowerType.name == 'AttackRateBoost'){
		if(towers.length > 0){
			for(var i=0; i< towers.length;i++){
				if(towers[i].Location.x > minX && towers[i].Location.x < maxX){
					towers[i].attackRateBoostValue = this.heroPowerValue;
				}
				else{
					towers[i].attackRateBoostValue = 1;
				}
			}
		}

	}
}
Hero.prototype.TakeDamage = function(damage){
	
	if(this.heroPowerType.name == 'DamageReduction'){
		damage -= Math.floor(3/(Math.pow(this.heroPowerValue,3)));
		damage *= this.heroPowerValue;
		damage = Math.max(1,damage);
	}
	this.health -= damage;
}
