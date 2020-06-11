var resources = {
	a:{//Armory - towers/heroes/etc
		amt:0,
		name:"Ruples",
		symbol:"α"//224
	},
	b:{//Gym - prestige0/Regroup
		amt:0,
		name:"Shiny Rocks",
		symbol:"ß"//225
	},
	c:{//Lab - prestige1/Evolve
		amt:0,
		name:"Tokens",
		symbol:"Γ"//226
	},
	d:{//Office - prestige2/Promote
		amt:0,
		name:"Units",
		symbol:"π"//227
	},
	e:{//Forge - prestige3/Ascend
		amt:0,
		name:"Vincula",
		symbol:"Σ"
	},
	f:{//Forge - Scrap Items
		amt:0,
		name:"Womba",
		symbol:"σ"
	}
};
var gauges = { 
	Range:{isUnlocked:0,cost:1}, 
	Reload:{isUnlocked:0,cost:1}, 
	Health:{isUnlocked:0,cost:1}, 
	Damage:{isUnlocked:0,cost:1} 
}
var minionUpgradeTypes = [
	["health", "damage"],
	["attackRate", "moveSpeed", "splashRadius"],
	["attackRange", "initialMinions", "spawnDelay"],
	["minionsPerSpawn"]
];
var unitTypes = {
	Minion:{team:0, uniqueSymbol:0, infoSymbol:"&#x1f771;"},
	Boss:{team:0, uniqueSymbol:1, infoSymbol:"?"},
	Tower:{team:1, uniqueSymbol:0, infoSymbol:"&#x25a3;"}, 
	Hero:{team:1, uniqueSymbol:1, infoSymbol:"?"} 
};
const projectileTypes = { 
	balistic:1,
	beam:2,
	blast:3,
	homing:4
}
var tierMisc = {
	t0:{
		tier:0,
		autobuy:{
			isUnlocked:0,
			cost:8,
			resource:"b"
		},
		upgradePotency:0
	},
	t1:{
		tier:1,
		autobuy:{
			isUnlocked:0,
			cost:4,
			resource:"c"
		},
		upgradePotency:0
	},
	t2:{
		tier:2,
		autobuy:{
			isUnlocked:0,
			cost:2,
			resource:"d"
		},
		upgradePotency:0
	},
	t3:{
		tier:3,
		autobuy:{
			isUnlocked:0,
			cost:1,
			resource:"e"
		},
		upgradePotency:0
	}	
}

var globalSpawnDelayReduction = 0;
var maxUpgradeLevel = 10;

var achievements = {
	minionsSpawned:{//boss boost
		name:"Total Minions Spawned",
		bonus:"Boss stat multiplier",
		count:0,
		first:32,
		mult:4,
		add:1,
		unlockT:3
	},
	towersDestroyed:{//b++
		name:"Total Towers Destroyed",
		bonus:"Increase Shiny Rocks gain",
		count:0,
		first:32,
		mult:2,
		add:0,
		unlockT:1
	},
	heroesKilled:{//c++
		name:"Total Heroes Killed",
		bonus:"Increase Tokens gain",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:2
	},
	itemScrapped:{//d++
		name:"Total Items Scrapped",
		bonus:"Increase Units gain",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:4
	},
	itemRarity:{//e++
		name:"Max Item Rarity Obtained",
		bonus:"Increase Vincula gain",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:4
	},
	prestige0:{//a--
		name:"Total Regroups",
		bonus:"Reduce Armory prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:1
	},
	prestige1:{//b--
		name:"Total Evolves",
		bonus:"Reduce Gym prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:2
	},
	prestige2:{//c--
		name:"Total Promotes",
		bonus:"Reduce Lab prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:3
	},
	prestige3:{//d--
		name:"Total ???",
		bonus:"Reduce Office Prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:4		
	},
	maxLevelCleared:{//rarity++
		name:"Maximum Castle Level Reached",
		bonus:"Improve equipment drop rarity",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:4
	}

}

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
		attackCharges:0,
		chainRange:0,
		chainDamageReduction:0,
		unlockCost:0,
		color:"#FFF",
		color2:"#000",
	};
var baseMinion = {
	Mite:{
		health:3,
		damage:2,
		spawnDelay:450,
		color:"#0F0",
		info: "Weak ground unit with short spawn time"
	},
	Bomber:{
		moveSpeed:.015,
		attackRange:2.5,
		splashRadius:2,
		spawnDelay:950,
		color:"#0FF",
		info:"Flying unit with large area balistic but slow move speed"
	},
	Catapult:{
		damage:4,
		attackRange:2.8,
		attackRate:750,
		spawnDelay:1100,
		color:"#F0F",
		info:"Ground unit with long attack range but slow attack rate"
	},
	Golem:{
		health:10,
		moveSpeed:.03,
		spawnDelay:1200,
		color:"#A52",
		info:"Ground unit with high health but slow spawn time"
	},
	Harpy:{
		damage:6,
		moveSpeed:.03,
		attackRange:1.8,
		isFlying:1,
		color:"#FF0",
		info: "Flying unit with high damage but short range"
	},
	Ram:{
		moveSpeed:.04,
		attackRate:600,
		attackRange:1.8,
		spawnDelay:900,
		color:"#F00",
		info: "Ground unit with high move speed but slow attack rate."
	},
	Vampire:{
		health:2,
		moveSpeed:.04,
		attackRate:200,
		isFlying:1,
		spawnDelay:850,
		color:"#00F",
		info:"Flying unit with high rate of attack but low health"
		
	},

	Air:{
		health:1,
		damage:1,
		attackRate:50,
		moveSpeed:.1,
		isFlying:1,
		attackCharges:5,
		chainRange:9,
		chainDamageReduction:.95,
		projectileType:projectileTypes.beam,
		symbol:"&#x1f701;",
		color:"#FF7",
		color2:"#990",
		info:"Flying chain beam attack with a move speed aura."
	},
	Earth:{
		health:12,
		moveSpeed:.01,
		projectileType:projectileTypes.blast,
		spawnDelay:1500,
		symbol:"&#x1f703;",
		color:"#631",
		color2:"#393",
		info:"Ground high health with passive self-healing."
	},
	Fire:{
		moveSpeed:.015,
		damage:2,
		attackRate:150,
		isFlying:1,
		splashRadius:3,
		attackRange:3,
		projectileType:projectileTypes.blast,
		symbol:"&#x1f702;",
		color:"#E53",
		color2:"#EB2",
		info:"Flying fast attack rate that inflicts burn damage over time."
	},
	Water:{
		health:2,
		damage:1,
		moveSpeed:.025,
		spawnDelay:400,
		splashRadius:2.5,
		attackRange:2.5,
		projectileType:projectileTypes.blast,
		symbol:"&#x1f704;",
		color:"#0FF",
		color2:"#01F",
		info:"Fast moving blast attack with a healing aura"
	}
}
var minionResearch = {
	Mite:{
		isUnlocked:1,
		lastSpawn:0,
		unlockT:1
	},
	Bomber:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1
	},
	Catapult:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1
	},
	Golem:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1
	},
	Harpy:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1
	},
	Ram:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1
	},
	Vampire:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1
	},

	Air:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2
	},
	Earth:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2
	},
	Fire:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2
	},
	Water:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2
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
	Harpy:{
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
	Ram:{
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
	},

	Air:{
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
	Earth:{
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
	Fire:{
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
	Water:{
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
	Harpy:{
		damage:1.04
	},
	Ram:{
		moveSpeed:1.06
	},
	Vampire:{
		attackRate:.9
	},
	
	Air:{},
	Earth:{},
	Fire:{},
	Water:{}
}

var attackEffects = {
	DOT:{
		name:"health",
		baseValue:-.0078125,
		levelMultiplier:2,
		defaultDuration:100
	},
	Slow:{
		name:"moveSpeed",
		baseValue:.8,
		levelMultiplier:.9,
		defaultDuration:250
	},
	Stun:{
		name:"moveSpeed",
		baseValue:.01,
		levelMultiplier:1,
		defaultDuration:100
	},
	Disarm:{
		name:"damage",
		baseValue:.95,
		levelMultiplier:.95,
		defaultDuration:100
	},
	Dibilitate:{
		name:"attackRate",
		baseValue:.95,
		levelMultiplier:.95,
		defaultDuration:100
	},
	Blind:{
		name:"attackRange",
		baseValue:.95,
		levelMultiplier:.95,
		defaultDuration:100
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
	projectileType:projectileTypes.balistic,
	attackEffect:null
}
var baseTower = {
	Basic:{
		damage:3,
		attackRate:100,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:4,
		projectileSpeed:2.5,
		color:"#D0F",
		color2:"#507",
		info:"Basic tower that hits air and ground units"
	},
	Artilllery:{
		health:15,
		damage:7,
		attackRate:400,
		attackRange:3.2,
		splashRadius:.5,
		canHitGround:1,
		attackEffect:attackEffects.Dibilitate,
		color:"#F73",
		color2:"#733",
		info: "Large splash attack that hits ground units and slows rate of attack"
	},
	Boom:{
		damage:1,
		canHitAir:1,
		canHitGround:1,
		canHitAir:1,
		splashRadius:2.7,
		projectileType:projectileTypes.blast,
		attackEffect:attackEffects.Stun,
		color:"#999",
		color2:"#333",
		info: "Stuns all minions in range"
	},
	Ice:{
		damage:2,
		canHitAir:1,
		canHitGround:1,
		splashRadius:.1,
		projectileType:projectileTypes.beam,
		attackEffect:attackEffects.Slow,
		color:"#0AF",
		color2:"#069",
		info: "Multi-Beam attack that hits all units and slows movement speed"
	},
	Lightning:{
		health:7,
		damage:4,
		projectileSpeed:16,
		attackCharges:1,
		chainRange:2,
		chainDamageReduction:.5,
		canHitAir:1,
		projectileType:projectileTypes.beam,
		attackEffect:attackEffects.Disarm,
		color:"#FF0",
		color2:"#990",
		info: "Beam chain attack that hits air units and reduces damage"
	},
	Poison:{
		damage:2,
		attackCharges:3,
		chainRange:3,
		chainDamageReduction:1,
		canHitGround:1,
		attackEffect:attackEffects.DOT,
		projectileType:projectileTypes.homing,
		splashRadius:.1,
		color:"#5A5",
		color2:"#353",
		info: "Homing chain attack that hits ground units and deals damage over time"
	},
	Sniper:{
		attackRange:5,
		attackRate:500,
		projectileType:projectileTypes.homing,
		projectileSpeed:3,
		splashRadius:.1,
		canHitAir:1,
		canHitGround:1,
		color:"#A00",
		color2:"#500",
		info: "Homing long range attack that hits air and ground units"
		
	}
}
var towerLevelMultipliersDefault ={
	health:1.1,
	damage:1.1,
	attackRate:.95,
	projectileSpeed:1.06,
	attackRange:1.05,
	attackCharges:1,
	chainRange:1,
	chainDamageReduction:1,
	splashRadius:1.02
}
var towerLevelMultipliers = {
	Basic:{
		health:1.15,
		damage:1.15,
		splashRadius:1
	},
	Artilllery:{
		damage:1.2,
		splashRadius:1.04
	},
	Boom:{
		attackRange:1.07,
		attackRate:.9
	},
	Ice:{
		attackRange:1.08,
		attackRate:.9
	},
	Lightning:{
		projectileSpeed:1,
		attackRange:1.1,
		attackCharges:1.3,
		chainRange:1.1,
		chainDamageReduction:1.1,
		splashRadius:1
	},
	Poison:{
		damage:1,
		attackRange:1.1,
		attackCharges:1.3,
		chainRange:1.1
	},
	Sniper:{
		attackRange:1.08,
		projectileSpeed:1.1,
	}
}

var baseBossDefault = {
	health:50,
	damage:10,
	attackRate:300,
	projectileSpeed:3,
	abilityDuration: 200,
	abilityCooldown:1000,
	spawnDelay:1000,
	projectileType:projectileTypes.balistic,
	attackRange:2.5,
	attackCharges:0,
	chainRange:0,
	chainDamageReduction:0,
	auraRange: 3,
	splashRadius:.2,
	auraPower: 1.5,
	isFlying:0,
	unlockCost:0,
	passiveAbilityInfo: "N/A"
}
var baseBoss = {
	Death:{
		attackRate:500,
		moveSpeed:.03,
		auraRange: 4,
		abilityCooldown:1500,
		unlockCost:0,
		symbol:"&#x1f480;",
		color:"#777",
		color2:"#333",
		info: "Strength from the misfortune of minions",
		auraInfo: "Damage nearby enemies",
		passiveAbilityInfo: "Gain attack damage when a minion dies",
		activeAbilityInfo: "Summon skeletons based on minions unlocked. Skeletons have the same stats but only have 1 health and attack."
	},
	Famine:{
		damage:1,
		moveSpeed:.007,
		projectileType:projectileTypes.beam,
		attackRange:3,
		auraRange: 6,
		spawnDelay:500,
		abilityDuration: 300,
		isFlying:1,
		unlockCost:0,
		symbol:"&#x2623;",
		color:"#707",
		color2:"#111",
		info: "Silent but deadly",
		auraInfo: "Slow Tower attack Rate",
		passiveAbilityInfo: "Attacks delay enemy attack",
		activeAbilityInfo: "Temporarily reduce all tower damage"
	},
	War:{
		health:100,
		moveSpeed:.06,
		spawnDelay:1500,
		abilityCooldown:200,
		abilityDuration:100,
		unlockCost:0,
		symbol:"&#x2694;",
		color:"#F00",
		color2:"#422",
		info: "Powerful in a direct assault",
		auraInfo: "Increase minion attack rate",
		passiveAbilityInfo: "Attacks gain health and reduce time to next respawn; getting attacked reduces time to next attack",
		activeAbilityInfo: "Increase rate of attack and move speed, and gain invincibility"
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
		name:"DamageReduction",
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
		name:"Heal",
		effects:[
			{
				effectType:"health",
				baseValue:.0078125,
				levelMultiplier:1.0078125,
				isAura:1
			}
		]
	},
	AttackBoost:{
		name:"AttackBoost",
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
var baseHeroDefault = {
	damage:2,
	health:15,
	regen:10,
	attackRate:200,
	attackRange:2.2,
	projectileSpeed:3,
	moveSpeed:.05,
	attackCharges:0,
	canHitAir:1,
	canHitGround:1,
	spawnWeight:1,
	splashRadius:.3
}
var baseHero = {
	Cleric:{//heal nearby towers
		projectileType:projectileTypes.balistic,
		heroPowerType:heroPowerTypes.Heal,
		color:"#4F4",
		color2:"#404",
		symbol:"&#x271d;",
		info:"Heals nearby towers"
	},
	Prophet:{//AttackRate/Damage (buff tower/debuff minions) aura
		health:10,
		damage:5,
		attackRate:100,
		attackRange:3,
		projectileType:projectileTypes.balistic,
		heroPowerType:heroPowerTypes.AttackBoost,
		color:"#77F",
		color2:"#220",
		symbol:"&#x269a;",
		info: "Boosts nearby tower attack"
	},
	Templar:{//take less damage with less health
		health:20,
		attackRange:1.75,
		splashRadius:.4,
		projectileType:projectileTypes.balistic,
		heroPowerType:heroPowerTypes.DamageReduction,
		color:"#F44",
		color2:"#044",
		symbol:"&#x26e8;",
		info: "High armor defender"
	}

}
var heroLevelMultipliersDefault ={
	health:1.3,
	regen:0.95,
	damage:1.3,
	moveSpeed:1.03,
	attackRate:0.95,
	projectileSpeed:1.05,
	attackRange:1.03,
	splashRadius:1.01
}
var heroLevelMultipliers = {
	Cleric:{
		regen:.9,
		attackRate:.9
	},
	Prophet:{
		damage:1.5,
		attackRange:1.05
	},
	Templar:{
		health:1.5,
		moveSpeed:1.5
	}
}
