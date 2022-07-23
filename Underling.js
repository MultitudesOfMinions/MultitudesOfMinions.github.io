"use strict";

let lastUnderlingSpawn = 0;
function manageUnderlings(){
	if(underlings.length == 0){
		spawnUnderling();
	}
	
	for(let i=0;i<underlings.length;i++){
		if(underlings[i].Location.x < langoliers || underlings[i].health <=0){
			underlings.splice(i,1);
			i--;
		}
	}
	
	const totalPathsL = totalPaths * pathL;
	for(let i=0;i<underlings.length;i++){
		const U = underlings[i];
		U.Move();
		const uloc = U.Location.x;
		const target = (U.maxP-totalPaths)*pathL +path[0].x;
		
		if(uloc>target){
			//distance needed for next Ruple
			const earnRate = (achievements.maxLevelCleared.count-level+1)*4;
			U.maxP+=earnRate;
			const ee = getEquippedEffect("a", "gain");
			
			resources.a.amt+=(1+ee.a)*ee.m;
		}
		
		U.DoHealing();
		U.effects.ManageEffects();
	}
	
	const usd = pathL*(level**2+4);
	if(underlings.length == 0 || underlings[underlings.length-1].Location.x > usd){
		spawnUnderling();
	}
	
}

Minion.prototype.DrawRuple = function(scale){
	if(this.type !== "Underling"){return new point(-pathL, -pathW);}

	const x = (this.maxP-totalPaths)*pathL +path[0].x + scale/2;
	const y = getPathYatX(x) + this.shift.y * pathW;
	
	const rLoc = new point(x,y);
	ctx.beginPath();
	ctx.fillStyle="#6F6";
	ctx.arc(rLoc.x,rLoc.y,scale/12,0,twoPi);
	ctx.fill();
}

function spawnUnderling(){
	//if(underlings.length>12){return;}//max underling count
	const newU = new Minion("Underling",
        underling.health/statAdjustments.health,
		underling.damage/statAdjustments.damage,
		underling.moveSpeed/statAdjustments.moveSpeed,
		underling.isFlying,
		underling.attackDelay/statAdjustments.attackDelay,
		underling.targetCount/statAdjustments.targetCount,
		underling.attackCharges/statAdjustments.attackCharges,
		underling.chainRange/statAdjustments.chainRange,
		underling.chainReduction/statAdjustments.chainReduction,
		underling.splashRadius/statAdjustments.splashRadius,
		underling.projectileSpeed/statAdjustments.projectileSpeed,
		underling.attackRange/statAdjustments.attackRange,
		0,
		underling.projectileType,
		false,
		underling.color,
	underling.color2);
	
	newU.damage = 0;
	newU.attackRange = 0;
	
	newU.isUnderling = true;
	newU.canHitGround = 1;
	newU.canHitAir = 1;
	newU.team = 0;
	newU.yShift = Math.random() - .5;
	newU.xShift = Math.random() - .5;
	
	newU.effects = new UnitEffects();
	newU.direction = 1;
	newU.maxP = totalPaths;
	
	newU.uid = generateMinionUid("_");
	newU.lastAttack=0;
	
	//newU.uType = underlings.length%4;
	
	underlings.push(newU);
	lastUnderlingSpawn=0;
}
