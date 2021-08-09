"use strict";
function drawProjectiles() {
	for(let i=0;i<projectiles.length;i++){
		projectiles[i].Draw();
	}
}
function manageProjectiles(){
	for(let i=0;i<projectiles.length;i++){
		if(projectiles[i].Location.x < langoliers || projectiles[i].attackCharges<=0){
			projectiles.splice(i,1);
			i--;
			continue;
		}
		if(projectiles[i].type === projectileTypes.beam){
  		projectiles[i].beamDuration--;
			if(projectiles[i].beamDuration<=0){
				projectiles.splice(i,1);
				i--;
				continue;
			}
		}
		else if(projectiles[i].type === projectileTypes.homing){
		  if(projectiles[i].hasAttacked ||
		      (projectiles[i].team?team0:team1).find(x => x.uid === projectiles[i].targetId) === undefined){
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

function Projectile(Location, originType, target, targetId, sourceId, moveSpeed, damage, unitEffect, attackCharges, chainRange, chainReduction, impactRadius, canHitGround, canHitAir, team, type)
{
	this.source = new point(Location.x, Location.y);
	this.Location = new point(Location.x, Location.y);
	this.originType = originType;
	this.target = new point(target.x, target.y);
	this.damage = damage;
	this.unitEffect = unitEffect;
	this.targetId = targetId;
	this.sourceId = sourceId;

	this.moveSpeed = moveSpeed;
	
	this.attackCharges = attackCharges || 0;
	this.chainRange = chainRange || 0;
	this.chainReduction = chainReduction || 0;
	this.impactRadius = impactRadius || 0;
	this.team = team;//0=minion, 1=tower, 2=water healing rain;
	this.canHitGround = canHitGround;
	this.canHitAir = canHitAir;
	this.type = type || projectileTypes.ballistic;
	this.beamDuration = this.type == projectileTypes.beam ? 30 : -1;
	this.initialBeamDuration = this.beamDuration;
	this.hasAttacked = 0;
	this.trail = [];
	this.scale = getScale()/16;

	if(this.team==0){
		this.color="#F00";
	}
	else if(team==1){
		this.color="#00F";
	}
	else{
	  this.color="#0FF";
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
	this.scale = getScale()/16;
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
	else if(this.type == projectileTypes.homing){
		const newT = (this.team?team0:team1).find(x => x.uid == this.targetId);
		if(newT === undefined){
		  //target already died, will self destruct
		  return;
		}
		else{
			this.target = new point(newT.Location.x, newT.Location.y);
		}
	}
	
	const newLocation = calcMove(this.moveSpeed, this.Location, this.target);
  this.Location = newLocation;
	if(this.Location.x == this.target.x || this.Location.y == this.target.y){
		//ATTACK
		this.Attack();
	}else{
	  
	}
}
Projectile.prototype.Draw = function(){
	const color = isColorblind() ? GetColorblindColor() : this.color;

	ctx.fillStyle=color;
	ctx.strokeStyle=color;
	
	if(getUIElement("chkProjectileData").checked){
    const text = Math.floor(this.damage*10)/10;
		const w = ctx.measureText(text).width
		const x = this.Location.x-(w>>1)-1;
		const y = this.Location.y+getScale()/4;
		ctx.fillStyle=this.color;
		ctx.font = "8pt Helvetica"
		ctx.fillText(text, x, y);
  }


	if(this.type == projectileTypes.ballistic || this.type == projectileTypes.blast){
		ctx.beginPath();
		ctx.arc(this.Location.x,this.Location.y,this.scale,0,twoPi);
		ctx.fill();
	}
	else if(this.type == projectileTypes.homing){
			
		this.trail.push(new point(this.Location.x, this.Location.y));

  	ctx.strokeStyle=color;
		for(let i = 1; i < this.trail.length; i++){
  		ctx.beginPath();
			ctx.lineWidth = (i+3)>>1;
			ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
			ctx.lineTo(this.trail[i].x, this.trail[i].y);
			ctx.stroke();
  		ctx.closePath();
		}

		while(this.trail.length > 5){this.trail.shift();}
	}
	else if(this.type == projectileTypes.beam){
		const w = getScale()/6;
		const p = this.beamDuration/this.initialBeamDuration;
		if(this.beamDuration <= 0){return;}

  	ctx.strokeStyle=color+"6";
		ctx.beginPath();
		ctx.lineWidth=w*p;
		ctx.moveTo(this.source.x, this.source.y);
		ctx.lineTo(this.target.x, this.target.y);
		ctx.stroke();
  	ctx.strokeStyle=color;
	}
	ctx.closePath();
}
Projectile.prototype.ImpactRange = function(){
	return (this.impactRadius * getScale());
}
Projectile.prototype.Attack = function(){
	this.hasAttacked=1;
	if(this.type == projectileTypes.ballistic){
		const range = this.ImpactRange();
		impacts.push(new Impact(this.Location, range, this.color, 12, 0));
	}
	else if(this.type == projectileTypes.blast){
		const range = this.ImpactRange();
		impacts.push(new Impact(this.Location, range, this.color, 28, 1));
	}
	this.Damage();
	
	const newTarget = this.NextChainTarget();
	if(newTarget == null){ return; }

	const newDamage = this.damage * this.chainReduction;

	const newProjectile = new Projectile(
		this.target, this.originType, new point(newTarget.Location.x, newTarget.Location.y), newTarget.uid, this.targetId,
		this.moveSpeed, newDamage, this.unitEffect, this.attackCharges-1,
		this.chainRange, this.chainReduction, this.impactRadius,
		this.canHitGround, this.canHitAir, this.team, this.type
	);
	
	projectiles.push(newProjectile);
}

Projectile.prototype.Damage = function(){
	let units = this.team ? team0 : team1;
	
	if(this.type == projectileTypes.homing ||
			this.type == projectileTypes.beam){
		const targets = units.filter(x => x.uid == this.targetId);
		if(targets.length == 0){return;}
		const target = targets[0];
		
		const actualDamage = target.TakeDamage(this.damage);
    stats.addDamageDone(this.originType, actualDamage);
    stats.addDamageTaken(target.type, this.damage);
		this.ApplyUnitEffect(target);
	}
	else if(this.type == projectileTypes.ballistic ||
			this.type == projectileTypes.blast){
		const range = this.ImpactRange();
		for(let i=0;i<units.length;i++){
			const dx = Math.abs(units[i].Location.x - this.Location.x);
			const dy = Math.abs(units[i].Location.y - this.Location.y);

			//cheap check
			if(dx <= range && dy <= range)
			{
				//fancy check
				if(inRange(units[i].Location, this.Location, range)){
					const actualDamage = units[i].TakeDamage(this.damage);
          stats.addDamageDone(this.originType, actualDamage);
          stats.addDamageTaken(units[i].type, this.damage);
					this.ApplyUnitEffect(units[i]);
				}
			}
		}
	}
}

Projectile.prototype.NextChainTarget = function(){
	if(this.attackCharges < 1) { return; }
	let units = this.team ? team0 : team1;
	if(units.length == 0 ){ return; }
	
	if(this.type == projectileTypes.blast){
		return {uid:this.targetId, Location:new point(this.target.x, this.target.y) };
	}
	
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
	units = units.filter(u => u.Location.x < gameW && !inRange(u.Location, this.Location, this.chainRange))

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
	if(Array.isArray(this.unitEffect)){
	 for(let i=0;i<this.unitEffect.length;i++){
   	  target.effects.AddEffect(this.originType, this.unitEffect[i].name, this.unitEffect[i].type, this.unitEffect[i].duration, this.unitEffect[i].mPower, this.unitEffect[i].aPower);
	 }
	}
	else{
	  target.effects.AddEffect(this.originType, this.unitEffect.name, this.unitEffect.type, this.unitEffect.duration, this.unitEffect.mPower, this.unitEffect.aPower);
	}
}
