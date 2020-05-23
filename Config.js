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
	Minion:{team:0, infoSymbol:'&#x25c9;'},
	Boss:{team:0, infoSymbol:'§'}, //21
	Tower:{team:1, infoSymbol:'&#x25a3;'}, 
	Hero:{team:1, infoSymbol:'#'} //35
};

//00F Vampire(attackRate),F0F Bomber(slow, large aoe)
var minionUpgradePotency = [0,0,0];
var baseMinionDefault = {
		health:4,
		damage:3,
		moveSpeed:.02,
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
		health:3,
		damage:2,
		spawnDelay:450,
		color:'#0F0',
		color2:'#000',
		info: 'Weak ground unit with short spawn time'
	},
	Bomber:{
		moveSpeed:.01,
		attackRange:2.5,
		splashRadius:.7,
		color:"#F0F",
		color2:"#000",
		info:"Flying unit with large area aoe but slow move speed"
	},
	Catapult:{
		damage:4,
		attackRange:3.5,
		attackRate:750,
		color:"#F0F",
		color2:"#000",
		info:"Long attack range but slow attack rate"
	},
	Golem:{
		health:10,
		moveSpeed:.03,
		spawnDelay:1200,
		color:"#A52",
		color2:"#000",
		info:"High health but slow spawn time"
	},
	Manticore:{
		damage:6,
		moveSpeed:.03,
		attackRange:1.8,
		isFlying:1,
		color:'#FF0',
		color2:'#000',
		info: 'Air with high damage but short range'
	},
	Minotaur:{
		moveSpeed:.07,
		attackRate:600,
		attackRange:1.8,
		spawnDelay:900,
		color:'#F00',
		color2:'#000',
		info: 'Ground unit with high move speed but slow rate of attack.'
	},
	Vampire:{
		health:2,
		moveSpeed:.04,
		attackRate:300,
		color:"#00F",
		color2:"#000",
		info:"Flying unit with high rate of attack but low health"
		
	}
}
var minionResearch = {
	Mite:{
		isUnlocked:1,
		lastSpawn:0
	},
	Bomber:{
		isUnlocked:0,
		lastSpawn:0
	},
	Catapult:{
		isUnlocked:0,
		lastSpawn:0
	},
	Golem:{
		isUnlocked:0,
		lastSpawn:0
	},
	Manticore:{
		isUnlocked:0,
		lastSpawn:0
	},
	Minotaur:{
		isUnlocked:0,
		lastSpawn:0
	},
	Vampire:{
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
	Bomber:{
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
	Catapult:{
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
	Golem:{
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
	},
	Vampire:{
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
	moveSpeed:1.03,
	attackRate:0.95,
	splashRadius:1.05,
	attackRange:1.03,
	spawnDelay:.95
};
var minionUpgradeMultipliers = {
	Mite:{
		spawnDelay:.9
	},
	Bomber:{
		splashRadius:1.1
	},
	Catapult:{
		attackRange:1.06
	},
	Golem:{
		health:1.04
	},
	Manticore:{
		damage:1.04
	},
	Minotaur:{
		moveSpeed:1.06
	},
	Vampire:{
		attackRate:.9
	}
}

var baseTowerDefault = {
	health:10,
	damage:5,
	attackRate:200,
	projectileSpeed:2,
	attackRange:2.7,
	canHitAir:0,
	canHitGround:0,
	attackCharges:0,
	chainRange:0,
	chainDamageReduction:0,
	splashRadius:.2,
	spawnWeight:1,
	projectileType:'aoe'
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
	Lightning:{
		health:7,
		damage:4,
		projectileSpeed:16,
		attackCharges:1,
		chainRange:2,
		chainDamageReduction:.5,
		canHitAir:1,
		projectileType:'beam',
		color:'#FF0',
		color2:'#990',
		info: 'Chain attack; hits air units'
	},
	Bomb:{
		health:20,
		damage:10,
		attackRate:400,
		attackRange:3.2,
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
	Lightning:{
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
	Death:{
		health:100,
		damage:10,
		moveSpeed:.03,
		attackRate:300,
		projectileSpeed:3,
		projectileType:'aoe',
		attackRange:2.5,
		splashRadius:.2,
		auraRange: 4,
		auraPower: 1.5, //speed *= power
		spawnDelay:1000,
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
		activeAbilityInfo: "Summon skeletons based on minions unlocked. Skeletons have the same stats but only have 1 health and attack."
	},
	Famine:{
		health:50,
		damage:1,
		moveSpeed:.007,
		attackRate:300,
		projectileSpeed:3,
		projectileType:'beam',
		attackRange:3,
		splashRadius:.2,
		auraRange: 6,
		auraPower: 1.25, //damage = power; rate *= auraPower
		spawnDelay:500,
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
	War:{
		health:150,
		damage:10,
		moveSpeed:.06,
		attackRate:300,
		projectileSpeed:3,
		projectileType:'aoe',
		attackRange:2.5,
		splashRadius:.2,
		auraRange: 2.5,
		auraPower: 1.5, //rate *= (1/auraPower)
		spawnDelay:1500,
		abilityCooldown:200,
		abilityDuration:100,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:0,
		unlockCost:0,
		symbol:"&#x2694;",
		color:"#F00",
		color2:"#422",
		info: "Powerful in a direct assault",
		auraInfo: "Increase minion attack rate",
		passiveAbilityInfo: "Attacks gain health and reduce time to next respawn; getting attacked reduces time to next attack",
		activeAbilityInfo: "Increase rate of attack, move speed and gain invincibility"
	}
}
var bossResearch = {
	Death:{
		isUnlocked:0,
		lastSpawn:0
	},
	Famine:{
		isUnlocked:0,
		lastSpawn:0
	},
	War:{
		isUnlocked:0,
		lastSpawn:0
	}
}
var bossUpgrades = {
	Death:{
		attackRate:0,
		moveSpeed:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	},
	Famine:{
		attackRange:0,
		spawnDelay:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	},
	War:{
		damage:0,
		health:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	}
}
var bossUpgradeMultipliersDefault = {
	health:1.05,
	damage:1.05,
	attackRate:0.9,
	attackRange:1.05,
	spawnDelay:.95,
	moveSpeed:1.05,
	auraPower:1.05,
	auraRange:1.05,
	abilityDuration:1.05,
	abilityCooldown:.95
}
var bossUpgradeMultipliers = {
	Death:{
		abilityCooldown:.9
	},
	Famine:{
		auraRange:1.1
	},
	War:{
		damage:1.1
	}
}

var heroPowerTypes = {
	DamageReduction:{
		name:'DamageReduction',
		effects:[
			{
				effectType:"damageReduction",
				baseValue:.95,
				levelMultiplier:.95,
				isAura:0
			}
		]
	},
	Heal:{
		name:'Heal',
		effects:[
			{
				effectType:"health",
				baseValue:1.0078125,
				levelMultiplier:1.0078125,
				isAura:1
			}
		]
	},
	AttackBoost:{
		name:'AttackBoost',
		effects:[
			{
				effectType:"attackRate",
				baseValue:1.25,
				levelMultiplier:1.25,
				isAura:1
			},
			{
				effectType:"attackRange",
				baseValue:1.125,
				levelMultiplier:1.125,
				isAura:1
			},
			{
				effectType:"damage",
				baseValue:1.25,
				levelMultiplier:1.25,
				isAura:1
			}
		]
	}
}
var baseHero = {
	Templar:{//take less damage with less health
		health:20,
		regen:100,
		damage:2,
		moveSpeed:.05,
		attackRate:200,
		projectileSpeed:3,
		projectileType:'aoe',
		attackRange:1.75,
		attackCharges:0,
		splashRadius:.4,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:1,
		heroPowerType: heroPowerTypes.DamageReduction,
		color:'#F44',
		color2:'#044',
		symbol:"&#x26e8;",
		info: 'High armor defender'
	},
	Cleric:{//heal nearby towers
		health:15,
		regen:100,
		damage:2,
		moveSpeed:.05,
		attackRate:200,
		projectileSpeed:3,
		projectileType:'aoe',
		attackRange:2.2,
		attackCharges:0,
		splashRadius:.3,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:1,
		heroPowerType: heroPowerTypes.Heal,
		color:'#4F4',
		color2:'#404',
		symbol:"&#x271d;",
		info:'Heals nearby towers'
	},
	Prophet:{//AttackRate/Damage (buff tower/debuff minions) aura
		health:10,
		regen:100,
		damage:5,
		moveSpeed:.04,
		attackRate:100,
		projectileSpeed:3,
		projectileType:'aoe',
		attackRange:3,
		attackCharges:0,
		splashRadius:.3,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:1,
		heroPowerType: heroPowerTypes.AttackBoost,
		color:'#77F',
		color2:'#220',
		symbol:"&#x269a;",
		info: 'Boosts nearby tower attack'
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
