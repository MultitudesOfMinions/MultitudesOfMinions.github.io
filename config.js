var resourceNames = {0:"Rubbish", 1:"Scrap", 2:"Trash"};
var resourceSymbols = {0:'µ', 1:'τ', 2:'Φ'};//230+i

var baseMinions = {
	Grunt:{
		hp:10,
		damage:10,
		moveSpeed:.7,
		attackRate:500,
		projectileSpeed:2,
		attackRange:2.5,
		spawnDelay:1000,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:1,
		unlockCost:0,
		color:'#050',
		color2:'#090'
	},
	Tank:{
		hp:100,
		damage:0,
		moveSpeed:.2,
		attackRate:10000,
		projectileSpeed:1,
		attackRange:0,
		spawnDelay:5000,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:0,
		unlockCost:100,
		color:'#F00',
		color2:'#000'
	},
	Swarmer:{
		hp:5,
		damage:2,
		moveSpeed:1,
		attackRate:500,
		projectileSpeed:5,
		attackRange:1.5,
		spawnDelay:300,
		lastSpawn:0,
		isFlying:1,
		isUnlocked:0,
		unlockCost:100,
		color:'#990',
		color2:'#FF0'
	}
}

var minionUpgrades = {
	Grunt:{
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	},
	Tank:{
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	},
	Swarmer:{
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	}
}

var minionUpgradeMultipliers = {
	hp:1.5,
	damage:1.5,
	moveSpeed:1.1,
	attackRate:0.9,
	projectileSpeed:1.1,
	attackRange:1.1,
	spawnDelay:.9
}
	
var baseTowers = {
	shooter:{
		hp:25,
		damage:5,
		attackRate:200,
		projectileSpeed:3,
		attackRange:2.5,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		color:'#90F',
		color2:'#F09'
	},
	Laser:{
		hp:15,
		damage:3,
		attackRate:100,
		projectileSpeed:12,
		attackRange:4,
		attackCharges:1,
		splashRadius:.3,
		canHitAir:1,
		canHitGround:0,
		color:'#FF0',
		color2:'#000'
	},
	bomb:{
		hp:40,
		damage:10,
		attackRate:2000,
		projectileSpeed:1.5,
		attackRange:3,
		attackCharges:0,
		splashRadius:.5,
		canHitAir:0,
		canHitGround:1,
		color:'#F00',
		color2:'#F73'
	}
}

var towerLevelMultipliers = {
	shooter:{
		hp:1.2,
		damage:1.2,
		attackRate:.95,
		projectileSpeed:1.1,
		attackRange:1.1,
		attackCharges:0,
		splashRadius:1
	},
	Laser:{
		hp:1.2,
		damage:1.2,
		attackRate:.95,
		projectileSpeed:1.1,
		attackRange:1.1,
		attackCharges:1.05,
		splashRadius:1
	},
	bomb:{
		hp:1.2,
		damage:1.2,
		attackRate:.95,
		projectileSpeed:1.1,
		attackRange:1.1,
		attackCharges:0,
		splashRadius:1.05
	}
}

var baseBosses = {
	Barbarian:{//do more damage with less HP
		hp:100,
		damage:10,
		moveSpeed:1,
		attackRate:500,
		projectileSpeed:2,
		attackRange:1.5,
		spawnDelay:1000,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:1,
		unlockCost:0,
		color:'#050',
		color2:'#090'
	},
	Cleric:{//Heal nearby minions
		hp:100,
		damage:1,
		moveSpeed:1,
		attackRate:100,
		projectileSpeed:2,
		attackRange:5,
		spawnDelay:1000,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:1,
		unlockCost:0,
		color:'#050',
		color2:'#090'
	},
	Sapper:{//'splodes on death
		hp:10,
		damage:50,
		moveSpeed:2,
		attackRate:100,
		projectileSpeed:2,
		attackRange:5,
		spawnDelay:100,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:1,
		unlockCost:0,
		color:'#050',
		color2:'#090'
	}
}

var bossUpgrades = {
	Barbarian:{//do more damage with less HP
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	},
	Cleric:{//Heal nearby minions
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	},
	Sapper:{//'splodes on death
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	}
}

var bossUpgradeMultipliers = {
	hp:1.5,
	damage:1.5,
	moveSpeed:1.1,
	attackRate:0.9,
	projectileSpeed:1.1,
	attackRange:1.1,
	spawnDelay:.9
}

var baseHeroes = {
	Knight:{//take less damage with less hp
		hp:10,
		regen:100,
		damage:2,
		moveSpeed:2,
		attackRate:200,
		projectileSpeed:3,
		attackRange:1.5,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		color:'#F00',
		color2:'#000',
		sym:'K'
	},
	Mechanic:{//repair nearby towers
		hp:7,
		regen:100,
		damage:2,
		moveSpeed:2,
		attackRate:200,
		projectileSpeed:3,
		attackRange:2,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		color:'#F00',
		color2:'#000',
		sym:'M'
	},
	Wizard:{//Attack rate aura
		hp:10,
		regen:100,
		damage:2,
		moveSpeed:2,
		attackRate:200,
		projectileSpeed:3,
		attackRange:2.5,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		color:'#F00',
		color2:'#000',
		sym:'W'
	}
}

var heroLevelMultipliers = {
	hp:1.4,
	regen:0.99,
	damage:1.4,
	moveSpeed:1.01,
	attackRate:0.95,
	projectileSpeed:1.01,
	attackRange:1.01,
	spawnDelay:.99,
	splashRadius:1.01
}