

let lastUnderlingSpawn = 0;
function manageUnderlings(){
	if(underlings.length == 0){
		spawnUnderling();
	}
	
	for(let i=0;i<quid.length;i++){
		if(quid[i].x < langoliers){
			quid.splice(i,1);
			const ee = getEquippedEffect("a", "gain");
			resources.a.amt+=(1+ee.a)*ee.m;
			i--;
		}
	}
	
	for(let i=0;i<underlings.length;i++){
		if(underlings[i].Location.x < langoliers || underlings[i].health <=0){
			underlings.splice(i,1);
			i--;
		}
		else{
			const md = pathL;
			const ms = getScale() * .04;
			for(let j=0;j<quid.length;j++){
				const dx = Math.abs(quid[j].x - underlings[i].Location.x);
				const dy = Math.abs(quid[j].y - underlings[i].Location.y);
				if(dx > md || dy > md){continue;}
				
				quid[j] = calcMove(ms, quid[j], underlings[i].Location);
				if(dx <= md/8 && dy < md/8){
					quid.splice(j,1);
					j--;
					const ee = getEquippedEffect("a", "gain");
					resources.a.amt+=(1+ee.a)*ee.m;
				}
			}
		}
	}
	
	const totalPathsL = totalPaths * pathL;
	for(let i=0;i<underlings.length;i++){
		const U = underlings[i];
		U.Move();
		const uloc = U.Location.x;
		U.DoHealing();
		U.effects.ManageEffects();
	}
	
	const usd = pathL*(level**2+4);
	if(underlings.length == 0 || underlings[underlings.length-1].Location.x > usd){
		spawnUnderling();
	}
	
	const temp = achievements.maxLevelCleared.count + achievements.maxLevelCleared.maxCount;
	const earnRate = temp===0?100:Math.max(1,temp-level+2)*200;
	while(sinceQuid > earnRate){
		addQuid();
		sinceQuid -= earnRate;
	}
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
	
	newU.uid = generateMinionUid("_");
	newU.lastAttack=0;
	
	//newU.uType = underlings.length%4;
	
	underlings.push(newU);
	lastUnderlingSpawn=0;
}
