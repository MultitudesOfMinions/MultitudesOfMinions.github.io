var resources = { //224+i
	0:{
		amt:0,
		name:"Rubbish",
		symbol:'α'
	},
	1:{
		amt:0,
		name:"Scrap",
		symbol:'ß'
	},
	2:{
		amt:0,
		name:"Trash",
		symbol:'Γ'
	}
};
var gauges = { range:0, reload:0, hp:0, dmg:0 }
var minionUpgradeTypes = [
	['hp', 'damage'],
	['attackRange', 'attackRate', 'projectileSpeed', 'spawnDelay', 'moveSpeed', 'splashRadius'],
	[]
];

var baseMinions = {
	Drone:{
		hp:5,
		damage:5,
		moveSpeed:.6,
		attackRate:500,
		projectileSpeed:2,
		attackRange:2.5,
		splashRadius:.2,
		spawnDelay:1000,
		lastSpawn:0,
		isFlying:0,
		isSpawning:1,
		unlockCost:0,
		color:'#050',
		color2:'#090'
	},
	Dozer:{
		hp:20,
		damage:5,
		moveSpeed:.5,
		attackRate:1000,
		projectileSpeed:1,
		attackRange:1,
		splashRadius:.3,
		spawnDelay:2500,
		lastSpawn:0,
		isFlying:0,
		isSpawning:1,
		unlockCost:100,
		color:'#F00',
		color2:'#000'
	},
	Dart:{
		hp:2,
		damage:7,
		moveSpeed:.7,
		attackRate:250,
		projectileSpeed:5,
		attackRange:2.8,
		splashRadius:.1,
		spawnDelay:400,
		lastSpawn:0,
		isFlying:1,
		isSpawning:1,
		unlockCost:50,
		color:'#990',
		color2:'#FF0'
	}
}
var minionResearch = {
	Drone:{
		isUnlocked:1
	},
	Dozer:{
		isUnlocked:0
	},
	Dart:{
		isUnlocked:0
	}
}
var minionUpgrades = {
	Drone:{
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		splashRadius:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	},
	Dozer:{
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		splashRadius:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	},
	Dart:{
		hp:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		projectileSpeed:0,
		splashRadius:0,
		projectileSpeed:0,
		attackRange:0,
		spawnDelay:0
	}
}
var minionUpgradeMultipliers = {
	Drone:{
		hp:1.2,
		damage:1.2,
		moveSpeed:1.1,
		attackRate:0.9,
		projectileSpeed:1.1,
		splashRadius:1.1,
		projectileSpeed:1.1,
		attackRange:1.2,
		spawnDelay:.9
	},
	Dozer:{
		hp:1.3,
		damage:1.1,
		moveSpeed:1.1,
		attackRate:0.9,
		projectileSpeed:1.1,
		splashRadius:1.15,
		projectileSpeed:1.1,
		attackRange:1.05,
		spawnDelay:.9
	},
	Dart:{
		hp:1.05,
		damage:1.5,
		moveSpeed:1.3,
		attackRate:0.9,
		projectileSpeed:1.1,
		splashRadius:1.05,
		projectileSpeed:1.1,
		attackRange:1.1,
		spawnDelay:.85
	}
}
	
var baseTowers = {
	shooter:{
		hp:10,
		damage:5,
		attackRate:200,
		projectileSpeed:2.5,
		attackRange:2.5,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		canHitGround:1,
		color:'#90F',
		color2:'#F09'
	},
	Laser:{
		hp:7,
		damage:2,
		attackRate:100,
		projectileSpeed:12,
		attackRange:3,
		attackCharges:1,
		splashRadius:.3,
		canHitAir:1,
		canHitGround:0,
		color:'#FF0',
		color2:'#000'
	},
	bomb:{
		hp:20,
		damage:10,
		attackRate:500,
		projectileSpeed:2.5,
		attackRange:4,
		attackCharges:0,
		splashRadius:.5,
		canHitAir:0,
		canHitGround:1,
		color:'#733',
		color2:'#F73'
	}
}
var towerLevelMultipliers = {
	shooter:{
		hp:1.2,
		damage:1.2,
		attackRate:.95,
		projectileSpeed:1.5,
		attackRange:1.1,
		attackCharges:0,
		splashRadius:1
	},
	Laser:{
		hp:1.2,
		damage:1.1,
		attackRate:.95,
		projectileSpeed:1.5,
		attackRange:1.05,
		attackCharges:1.3,
		splashRadius:1
	},
	bomb:{
		hp:1.2,
		damage:1.2,
		attackRate:.95,
		projectileSpeed:1.5,
		attackRange:1.05,
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
		projectileSpeed:3,
		attackRange:1.5,
		spawnDelay:1000,
		lastSpawn:0,
		isFlying:0,
		unlockCost:0,
		color:'#050',
		color2:'#090'
	},
	Cleric:{//Heal nearby minions
		hp:100,
		damage:1,
		moveSpeed:1,
		attackRate:100,
		projectileSpeed:3,
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
		projectileSpeed:3,
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
var bossResearch = {
	Barbarian:{
		isUnlocked:0,
	},
	Cleric:{
		isUnlocked:0,
	},
	Sapper:{
		isUnlocked:0,
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
		hp:7,
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
		hp:5,
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
		hp:7,
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