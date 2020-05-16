var resources = {
	a:{
		amt:0,
		name:"Rubbish",
		symbol:'α'//224
	},
	b:{
		amt:0,
		name:"Scraps",
		symbol:'ß'//225
	},
	c:{
		amt:0,
		name:"Trash",
		symbol:'Γ'//226
	}
};
var gauges = { 
	Range:{isUnlocked:0,cost:1}, 
	Reload:{isUnlocked:0,cost:1}, 
	Health:{isUnlocked:0,cost:1}, 
	Damage:{isUnlocked:0,cost:1} 
}
var minionUpgradeTypes = [
	['health', 'damage'],
	['attackRange', 'attackRate', 'moveSpeed', 'splashRadius' ],
	[ 'initialMinions', 'spawnDelay', 'minionsPerSpawn']
];
var unitTypes = {
	Minion:{team:0, infoSymbol:'&#x25c9;'}, //
	Boss:{team:0, infoSymbol:'§'}, //21
	Tower:{team:1, infoSymbol:'&#x25a3;'}, //220
	Hero:{team:1, infoSymbol:'#'} //35
};

var minionUpgradePotency = [0,0,0];
var baseMinionDefault = {
		health:3,
		damage:3,
		moveSpeed:.05,
		attackRate:500,
		projectileSpeed:2,
		attackRange:2,
		splashRadius:.2,
		spawnDelay:1000,
		isFlying:0,
		unlockCost:0
	};
var baseMinion = {
	Mite:{
		health:2,
		damage:2,
		spawnDelay:450,
		color:'#0F0',
		color2:'#000',
		info: 'Weak ground unit'
	},
	Manticore:{
		damage:6,
		moveSpeed:.04,
		attackRange:2.1,
		isFlying:1,
		color:'#FF0',
		color2:'#000',
		info: 'Air unit that shoots deadly tail spikes'
	},
	Minotaur:{
		health:4,
		moveSpeed:.07,
		attackRate:600,
		attackRange:1.8,
		spawnDelay:900,
		color:'#F00',
		color2:'#000',
		info: 'Charges to the front'
	}
}
var minionResearch = {
	Mite:{
		isUnlocked:1,
		lastSpawn:0
	},
	Manticore:{
		isUnlocked:0,
		lastSpawn:0
	},
	Minotaur:{
		isUnlocked:0,
		lastSpawn:0
	}
}
var minionUpgrades = {
	Mite:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		splashRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerSpawn:0
	},
	Manticore:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		splashRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerSpawn:0
	},
	Minotaur:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		splashRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerSpawn:0
	}
}
var minionUpgradeMultipliersDefault = {
	health:1.02,
	damage:1.02,
	moveSpeed:1.05,
	attackRate:0.9,
	splashRadius:1.05,
	attackRange:1.05,
	spawnDelay:.95
};
var minionUpgradeMultipliers = {
	Mite:{
		spawnDelay:.9
	},
	Manticore:{
		damage:1.05
	},
	Minotaur:{
		moveSpeed:1.06
	}
}

var baseTowerDefault = {
	health:10,
	damage:5,
	attackRate:200,
	projectileSpeed:2,
	attackRange:2.3,
	canHitAir:0,
	canHitGround:0,
	attackCharges:0,
	chainRange:0,
	chainDamageReduction:0,
	splashRadius:.2,
	spawnWeight:1
}
var baseTower = {
	Shooter:{
		canHitAir:1,
		canHitGround:1,
		spawnWeight:3,
		color:'#F09',
		color2:'#903',
		info:'Can hit air and ground units'
	},
	Laser:{
		health:7,
		damage:4,
		projectileSpeed:16,
		attackCharges:1,
		chainRange:2,
		chainDamageReduction:.5,
		canHitAir:1,
		color:'#FF0',
		color2:'#990',
		info: 'Chain attack; hits air units'
	},
	Bomb:{
		health:20,
		damage:10,
		attackRate:400,
		attackRange:3,
		splashRadius:.5,
		canHitGround:1,
		color:'#F73',
		color2:'#733',
		info: 'Large splash; hits ground units'
	}
}
var towerLevelMultipliersDefault ={
	health:1.1,
	damage:1.1,
	attackRate:.95,
	projectileSpeed:1.06,
	attackRange:1.05,
	attackCharges:0,
	chainRange:0,
	chainDamageReduction:0,
	splashRadius:1.02
}
var towerLevelMultipliers = {
	Shooter:{
		health:1.15,
		damage:1.15,
		splashRadius:1
	},
	Laser:{
		projectileSpeed:1,
		attackRange:1.1,
		attackCharges:1.3,
		chainRange:1.1,
		chainDamageReduction:1.1,
		splashRadius:1
	},
	Bomb:{
		attackRate:.9,
		splashRadius:1.05
	}
}

var baseBoss = {
	War:{
		health:100,
		damage:10,
		moveSpeed:.07,
		attackRate:300,
		projectileSpeed:3,
		attackRange:2.5,
		splashRadius:.2,
		auraRange: 3.5,
		auraPower: 1, //rate -= (.05*auraPower)
		spawnDelay:10,
		abilityCooldown:100,
		abilityDuration: 100,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:0,
		unlockCost:0,
		symbol:"&#x2694;",
		color:"#F00",
		color2:"#422",
		info: "Powerful in a direct assault",
		auraInfo: "Increase minion attack rate",
		passiveAbilityInfo: "Attacking reduces time to next respawn; getting attacked reduces time to next attack",
		activeAbilityInfo: "Temporary invincibility"
	},
	Famine:{
		health:100,
		damage:10,
		moveSpeed:.03,
		attackRate:100,
		projectileSpeed:3,
		attackRange:2,
		splashRadius:.2,
		auraRange: 6,
		auraPower: 1, //daamage = power; rate += (.02*auraPower)
		spawnDelay:100,
		abilityCooldown:1000,
		abilityDuration: 300,
		lastSpawn:0,
		isFlying:1,
		isUnlocked:0,
		unlockCost:0,
		symbol:"&#x2623;",
		color:"#707",
		color2:"#111",
		info: "Silent but deadly",
		auraInfo: "Damage towers and slow attack rate",
		passiveAbilityInfo: "Attacks delay enemy attack",
		activeAbilityInfo: "Temporarily reduce all tower damage"
	},
	Death:{
		health:100,
		damage:10,
		moveSpeed:.05,
		attackRate:100,
		projectileSpeed:3,
		attackRange:2.5,
		splashRadius:.2,
		auraRange: 4,
		auraPower: 1.05, //speed *= power
		spawnDelay:100,
		abilityCooldown:1000,
		abilityDuration: 200,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:0,
		unlockCost:0,
		symbol:"&#x1f480;",
		color:"#777",
		color2:"#333",
		info: "Strength from the misfortune of minions",
		auraInfo: "Increase minion move speed",
		passiveAbilityInfo: "Gain attack damage when a minion dies",
		activeAbilityInfo: "Temporarily increase minion limit and spawn rate; when ability ends all minions die."
	}
}
var bossResearch = {
	War:{
		isUnlocked:0,
		lastSpawn:0
	},
	Famine:{
		isUnlocked:0,
		lastSpawn:0
	},
	Death:{
		isUnlocked:0,
		lastSpawn:0
	}
}
var bossUpgrades = {
	War:{
		moveSpeed:0,
		damageReduction:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	},
	Famine:{
		attackRange:0,
		damageReduction:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	},
	Death:{
		attackRate:0,
		damageReduction:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	}
}
var bossUpgradeMultipliersDefault = {
	attackRate:0.9,
	attackRange:1.05,
	moveSpeed:1.05,
	damageReduction:.95,
	auraPower:1.05,
	auraRange:1.05,
	abilityDuration:1.05,
	abilityCooldown:.95
}
var bossUpgradeMultipliers = {
	War:{
		damageReduction:.9,
	},
	Famine:{
		auraRange:1.1,
	},
	Death:{
		abilityCooldown:.9
	}
}


var heroPowerTypes = {
	DamageReduction:{
		name:'DamageReduction',
		baseValue:.95,
		levelMultiplier:.95,
		isAura:0
	},
	Repair:{
		name:'Repair',
		baseValue:3,
		levelMultiplier:1.5,
		isAura:1
	},
	AttackRateBoost:{
		name:'AttackRateboost',
		baseValue:.8,
		levelMultiplier:.8,
		isAura:1
	}
}
var baseHero = {
	Knight:{//take less damage with less health
		health:20,
		regen:100,
		damage:2,
		moveSpeed:.1,
		attackRate:200,
		projectileSpeed:3,
		attackRange:1.7,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:1,
		heroPowerType: heroPowerTypes.DamageReduction,
		color:'#F44',
		color2:'#044',
		sym:'K',
		info: 'High armor'
	},
	Mechanic:{//repair nearby towers
		health:15,
		regen:100,
		damage:2,
		moveSpeed:.1,
		attackRate:200,
		projectileSpeed:3,
		attackRange:2.2,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:1,
		heroPowerType: heroPowerTypes.Repair,
		color:'#4F4',
		color2:'#404',
		sym:'M',
		info:'Repairs nearby towers'
	},
	Wizard:{//Attack rate aura
		health:10,
		regen:100,
		damage:5,
		moveSpeed:.08,
		attackRate:200,
		projectileSpeed:3,
		attackRange:3,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:1,
		heroPowerType: heroPowerTypes.AttackRateBoost,
		color:'#77F',
		color2:'#220',
		sym:'W',
		info: 'Boosts nearby towers damage'
	}
}
var heroLevelMultipliers = {
	health:1.4,
	regen:0.99,
	damage:1.4,
	moveSpeed:1.01,
	attackRate:0.95,
	projectileSpeed:1.01,
	attackRange:1.01,
	spawnDelay:.99,
	splashRadius:1.01
}
