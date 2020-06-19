"use strict";
function drawProjectiles() {
	for(let i=0;i<projectiles.length;i++){ 
		projectiles[i].Draw(); 
	}
}
function manageProjectiles(){
	for(let i=0;i<projectiles.length;i++){ 
		if(projectiles[i].type == projectileTypes.beam){
			if(projectiles[i].beamDuration<=0){
				projectiles.splice(i,1);
				i--;
				continue;
			}
		}
		else{
			if(projectiles[i].hasAttacked){
				projectiles.splice(i,1);
				i--;
				continue;
			}
		}
	
		projectiles[i].Move();
	}
}

function Projectile(Location, target, targetId, sourceId, moveSpeed, damage, unitEffect, attackCharges, chainRange, chainDamageReduction, splashRadius,splashDamageReduction, canHitGround, canHitAir, team, type)
{
	this.source = new point(Location.x, Location.y);
	this.Location = new point(Location.x, Location.y);
	this.target = new point(target.x, target.y);
	this.damage = damage;
	this.unitEffect = unitEffect;
	this.targetId = targetId;
	this.sourceId = sourceId;

	this.moveSpeed = moveSpeed;
	
	this.attackCharges = attackCharges || 0;
	this.chainRange = chainRange || 0;
	this.chainDamageReduction = chainDamageReduction || 0;
	this.splashRadius = splashRadius || 0;
	this.splashDamageReduction = splashDamageReduction || 0;
	this.team = team;//0=minion, 1=tower;
	this.canHitGround = canHitGround;
	this.canHitAir = canHitAir;
	this.type = type || projectileTypes.balistic;
	this.beamDuration = this.type == projectileTypes.beam ? 10 : -1;
	this.initialBeamDuration = this.beamDuration;
	this.hasAttacked = 0;
	this.trail = [];

	if(this.team==0){
		this.color="#F00";
	}
	else{
		this.color="#00F";
	}
}
Projectile.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta; 
	this.target.x -= RecenterDelta;
	this.source.x -= RecenterDelta;
	
	for(let i=0;i<this.trail.length;i++){
		this.trail[i].x -= RecenterDelta;
	}
}

Projectile.prototype.Resize = function(){
	const dx = (this.target.x - this.Location.x);
	const dy = (this.target.y - this.Location.y);
	
	const S = getScale(); //Scale
	const D = this.moveSpeed**2/(dx**2 + dy**2);
	
	this.SpeedX = dx * D * S; 
	this.SpeedY = dy * D * S; 
}
Projectile.prototype.Move = function(){
	if(this.attackCharges < 0){return;}
	
	if(this.type == projectileTypes.beam){
		this.Location.x = this.target.x;
		this.Location.y = this.target.y;
		if(!this.hasAttacked){ this.Attack(); }
		return;
	}
	else if(this.type == projectileTypes.blast){
		this.Attack();
		return;
	}
	
	if(this.type == projectileTypes.homing){
		const newT = this.team ? team0.filter(x => x.uid == this.targetId) : team1.filter(x => x.uid == this.targetId);
		if(newT.length == 1){
			this.target = new point(newT[0].Location.x, newT[0].Location.y);
		}
		else{
			impacts[impacts.length] = new Impact(this.Location, range, this.color, 10, 0);
			this.Attack();
		}
	}
	
	this.Location = calcMove(this.moveSpeed, this.Location, this.target);

	if(this.Location.x == this.target.x || this.Location.y == this.target.y){
		//ATTACK
		this.Attack();
	}
}
Projectile.prototype.Draw = function(){
	const color = isColorblind() ? GetColorblindColor() : this.color;

	ctx.fillStyle=color;
	ctx.strokeStyle=color;

	if(this.type == projectileTypes.balistic || this.type == projectileTypes.blast){
		ctx.beginPath();
		ctx.arc(this.Location.x,this.Location.y,pathW>>2,0,twoPi);
		ctx.fill();
	}
	else if(this.type == projectileTypes.homing){
			
		this.trail.push(new point(this.Location.x, this.Location.y));

		for(let i = 1; i < this.trail.length; i++){
			ctx.beginPath();
			ctx.lineWidth = i>>1;
			ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
			ctx.lineTo(this.trail[i].x, this.trail[i].y);
			ctx.stroke();
		}

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(this.Location.x,this.Location.y);
		ctx.lineTo(this.target.x, this.target.y);
		ctx.stroke();
		
		while(this.trail.length > 5){this.trail.shift();}
	}
	else if(this.type == projectileTypes.beam){
		const w = pathW/4;
		const p = this.beamDuration/this.initialBeamDuration;
		if(this.beamDuration <= 0){return;}

		ctx.beginPath();
		ctx.lineWidth=w*p;
		ctx.moveTo(this.source.x, this.source.y);
		ctx.lineTo(this.target.x, this.target.y);
		ctx.stroke();
		
		this.beamDuration--;
	}
	ctx.closePath();
}
Projectile.prototype.SplashRange = function(){
	const blastBoost = this.type == projectileTypes.blast ? pathW : 0;
	return (this.splashRadius * getScale()) + blastBoost;
}
Projectile.prototype.Attack = function(){
	if(this.type == projectileTypes.balistic){
		const range = this.SplashRange();
		ctx.beginPath();
		ctx.arc(this.Location.x,this.Location.y,range,0,twoPi);
		ctx.stroke();

		impacts[impacts.length] = new Impact(this.Location, range, this.color, 10, 0);
	}
	else if(this.type == projectileTypes.blast){
		const range = this.SplashRange();
		impacts[impacts.length] = new Impact(this.Location, range, this.color, 15, 1);
	}
	this.attackCharges--;
	 
	if(this.team == 0){
		this.DamageTeam1();
	}
	else if(this.team == 1){
		this.DamageTeam0();
	}
	this.hasAttacked=1;
}

Projectile.prototype.DamageTeam1 = function(){
	if(this.type == projectileTypes.homing){
		const targets = team1.filter(x => x.uid == this.targetId);
		if(targets.length){
			targets[0].TakeDamage(this.damage);
			this.ApplyUnitEffect(targets[0]);
		}
	}
	else if(this.type == projectileTypes.balistic || 
			this.type == projectileTypes.blast ||
			this.type == projectileTypes.beam){
		const range = this.SplashRange();
		for(let i=0;i<team1.length;i++){
			const dx = Math.abs(team1[i].Location.x - this.Location.x);
			const dy = Math.abs(team1[i].Location.y - this.Location.y);

			//cheap check
			if(dx <= range && dy <= range)
			{
				//fancy check
				if(inRange(team1[i].Location, this.Location, range)){
					team1[i].TakeDamage(this.damage);
					this.ApplyUnitEffect(team1[i]);
				}
			}
		}
	}
	
	if(this.attackCharges < 0) { return; }
	if(team1.length == 0 ){ return; }
	const newTarget = this.NextChainTarget();
	if(newTarget == null){ return; }
	
	const newDamage = this.damage * this.chainDamageReduction;

	const newProjectile = new Projectile(
		this.target, new point(newTarget.Location.x, newTarget.Location.y), newTarget.uid, this.targetId,
		this.moveSpeed, newDamage, this.unitEffect, this.attackCharges,
		this.chainRange, this.chainDamageReduction, this.splashRadius, this.splashDamageReduction, 
		this.canHitGround, this.canHitAir, this.team, this.type
	);
	
	projectiles[projectiles.length] = newProjectile;

}

Projectile.prototype.DamageTeam0 = function(){
	if(this.type == projectileTypes.homing){
		const targets = team0.filter(x => x.uid == this.targetId);
		if(targets.length){
			targets[0].TakeDamage(this.damage);
			this.ApplyUnitEffect(targets[0]);
		}
	}
	else if(this.type == projectileTypes.balistic || 
			this.type == projectileTypes.blast ||
			this.type == projectileTypes.beam){
		const range = this.SplashRange()
		for(let i=0;i<team0.length;i++){
			//check if is correct projectile for minion
			if(team0[i].isFlying && !this.canHitAir){continue;}
			if(!team0[i].isFlying && !this.canHitGround){continue;}

			const dx = Math.abs(team0[i].Location.x - this.Location.x);
			const dy = Math.abs(team0[i].Location.y - this.Location.y);

			//cheap check
			if(dx <= range && dy <= range)
			{
				//fancy check
				if(inRange(team0[i].Location, this.Location, range)){
					team0[i].TakeDamage(this.damage);
					this.ApplyUnitEffect(team0[i]);
				}
			}
		}
	}

	if(this.attackCharges < 0) { return; }
	if(team0.length == 0 ){ return; }
	const newTarget = this.NextChainTarget();
	if(newTarget == null){ return; }

	const newDamage = this.damage * this.chainDamageReduction;

	const newProjectile = new Projectile(
		this.target, new point(newTarget.Location.x, newTarget.Location.y), newTarget.uid, this.targetId,
		this.moveSpeed, newDamage, this.unitEffect, this.attackCharges,
		this.chainRange, this.chainDamageReduction, this.splashRadius, this.splashDamageReduction, 
		this.canHitGround, this.canHitAir, this.team, this.type
	);
	
	projectiles[projectiles.length] = newProjectile;
}

Projectile.prototype.NextChainTarget = function(){
	let units = this.team ? team0 : team1;
	
	const minX = this.Location.x - (this.chainRange * getScale());
	const maxX = this.Location.x + (this.chainRange * getScale());
		
	units = units.filter(u => u.Location.x >= minX && 
								u.Location.x <= maxX &&
								u.uid != this.sourceId &&
								u.uid != this.targetId);
	if(!this.canHitAir){
		units = units.filter(u=> !u.isFlying);
	}
	if(!this.canHitGround){
		units = units.filter(u=> u.isFlying);
	}
	units = units.filter(u => !inRange(u.Location, this.Location, this.chainRange))

	if(units.length == 0){
		return null;
	}
	
	let minRange = gameW;
	let index = -1;
	for(let i=0;i<units.length;i++){
		const d = calcDistance(this.Location, units[i].Location);
		if(d < minRange){
			minRange = d;
			index = i;
		}
	}
	
	if(index==-1){
		return null;
	}
	return units[index];
}
Projectile.prototype.ApplyUnitEffect = function(target){
	if(this.unitEffect == null){return;}
	target.effects.AddEffect(this.unitEffect.name, this.unitEffect.type, this.unitEffect.duration, this.unitEffect.power)
}
