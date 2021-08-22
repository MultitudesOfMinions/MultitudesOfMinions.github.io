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
		const target = (U.maxP*pathL)-totalPathsL+path[0].x;
		
		
		if(uloc>target){
		  const earnRate = ((achievements.maxLevelCleared.count+4)/(level+1));
		  U.maxP+=earnRate/(level+1);
		  const ee = getEquippedEffect("a", "gain");
		  
		  resources.a.amt+=(1+ee.a)*ee.m;
		}

  	U.DoHealing();
  	U.effects.ManageEffects();
  }
  
  const usd = pathL*(level**2+5);
  if(underlings.length == 0 || underlings[underlings.length-1].Location.x > usd){
    spawnUnderling();
  }

}

function spawnUnderling(){
  //if(underlings.length>12){return;}//max underling count
	const newU = new Minion("Underling",
        underling.health/statAdjustments.health,
				underling.damage/statAdjustments.damage,
				underling.moveSpeed/statAdjustments.moveSpeed,
				underling.isFlying,
				underling.attackRate/statAdjustments.attackRate,
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
