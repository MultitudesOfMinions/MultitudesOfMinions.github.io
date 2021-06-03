"use strict";

let lastUnderlingSpawn = 0;
function manageUnderlings(){
  spawnUnderling();
  if(underlings.length == 0){return;}
  
	for(let i=0;i<underlings.length;i++){
  	if(underlings[i].Location.x < langoliers || underlings[i].health <=0){
  		if(underlings[i].health <= 0){
  		  resources.a.amt++;
  		}
  		underlings.splice(i,1);
  		i--;
  	}
  }
  
  for(let i=0;i<underlings.length;i++){
  	if(!underlings[i].Aim()){
  		underlings[i].Move();
  	}
  	underlings[i].DoHealing();
  	underlings[i].effects.ManageEffects();
  }
}

function spawnUnderling(){
  if(lastUnderlingSpawn++ < underling.spawnDelay){return;}

	const newU = new Minion("Underling",
        underling.health/statAdjustments.health,
				underling.damage/statAdjustments.damage,
				underling.moveSpeed/statAdjustments.moveSpeed,
				underling.isFlying,
				underling.attackRate/statAdjustments.attackRate,
				underling.targetCount/statAdjustments.targetCount,
				underling.attackCharges/statAdjustments.attackCharges,
				underling.chainRange/statAdjustments.chainRange,
				underling.chainDamageReduction/statAdjustments.chainDamageReduction,
				underling.splashRadius/statAdjustments.splashRadius,
				underling.projectileSpeed/statAdjustments.projectileSpeed,
				underling.projectileType,
				underling.attackRange/statAdjustments.attackRange,
				underling.color,
				underling.color2);
				
				
  newU.isUnderling = true;
	newU.canHitGround = 1;
	newU.canHitAir = 1;
	newU.team = 0;
	newU.yShift = Math.random() - .5;
	newU.xShift = Math.random() - .5;
	
	newU.effects = new UnitEffects();
	newU.direction = 1;
	newU.deathValue = 1;

	newU.uid = generateMinionUid("_");
	newU.lastAttack=0;
	underlings.push(newU);
  lastUnderlingSpawn=0;
}

function drawUnderlings(){
	for(let i=0;i<underlings.length;i++){
		underlings[i].Draw();
	}
}
