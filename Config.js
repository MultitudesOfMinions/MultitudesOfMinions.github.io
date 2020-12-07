"use strict";
const unitTypes = {
	Minion:{team:0, uniqueSymbol:1, infoSymbol:"&#x1f771;"},
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
const statTypes = {
	health:"health",
	damage:"damage",
	targetCount:"targetCount",
	moveSpeed:"moveSpeed",
	attackRate:"attackRate",
	attackRange:"attackRange",
	projectileSpeed:"projectileSpeed",
	splashRadius:"splashRadius",
	spawnDelay:"spawnDelay",
	attackCharges:"attackCharges",
	chainRange:"chainRange",
	chainDamageReduction:"chainDamageReduction",
	auraRange:"auraRange",
	auraPower:"auraPower",
	abilityDuration:"abilityDuration",
	abilityCooldown:"abilityCooldown",
	damageReduction:"damageReduction",
	initialMinions:"initialMinions",
	minionsPerSpawn:"minionsPerSpawn"
}

const resources = {
	a:{//Armory - towers/heroes/etc
		amt:0,
		name:"Ruples",
		symbol:"α",//224
		value:1
	},
	b:{//Gym - prestige0/Regroup
		amt:0,
		name:"Shinies",
		symbol:"ß",//225
		value:16
	},
	c:{//Lab - prestige1/Evolve
		amt:0,
		name:"Tokens",
		symbol:"Γ",//226
		value:256
	},
	d:{//Office - prestige2/Promote
		amt:0,
		name:"Units",
		symbol:"π",//227
		value:4096
	},
	e:{//Store/Forge - Scrap Item
		amt:0,
		name:"Vincula",
		symbol:"Σ",
		value:65536
	},
	f:{//Forge - ??
		amt:0,
		name:"Womba",
		symbol:"σ",
		value:1048576
	}
};
const gauges = {
	Range:{isUnlocked:0,cost:1},
	Reload:{isUnlocked:0,cost:1},
	Health:{isUnlocked:0,cost:1},
	Damage:{isUnlocked:0,cost:1}
}
const tierMisc = {
	t0:{
		tier:0,
		autobuy:{
			isUnlocked:0,
			resource:"b"
		},
		upgradePotency:0,
		miscUpgrades:{
		  moneyPit_0: "Money Pit"
		}
	},
	t1:{
		tier:1,
		autobuy:{
			isUnlocked:0,
			resource:"c"
		},
		upgradePotency:0,
		miscUpgrades:{
		  autoBuy_1: "Unlock Automate Armory",
		  upgradePotency_1: "Armory Effectiveness",
		  maxMinions_1: "Max Minions++"
		}
	},
	t2:{
		tier:2,
		autobuy:{
			isUnlocked:0,
			resource:"d"
		},
		upgradePotency:0,
		miscUpgrades:{
		  autoBuy_2: "Unlock Automate Gym",
		  upgradePotency_2: "Gym Effectiveness",
		  upgradeLimit_2: "Upgrade Limit++"
		}
	},
	t3:{
		tier:3,
		autobuy:{
			isUnlocked:0,
			resource:"e"
		},
		upgradePotency:0,
		miscUpgrades:{
		  autoBuy_3: "Unlock Automate Lab",
		  upgradePotency_3: "Lab Effectiveness",
		  reduceDeployTime_3: "Reduce Deploy Time"
		}
	},
	t4:{
	  tier:4,
		autobuy:{
			isUnlocked:0
		},
		miscUpgrades:{
		  autoBuy_4: "Unlock Automate Office",
		  upgradePotency_4: "Lab Effectiveness",
		}
	}
}

let globalSpawnDelayReduction = 0;
const defaultMaxUpgradeLevel = 5;
let maxUpgradeLevel = defaultMaxUpgradeLevel;
let moneyPitLevel = 0;

const achievements = {
	minionsSpawned:{//boss boost
		name:"Minions Spawned",
		bonus:"Boss stat multiplier",
		count:0,
		first:32,
		mult:4,
		add:1,
		unlockT:3
	},
	towersDestroyed:{//b++
		name:"Towers Destroyed",
		bonus:"Increase Shiny Rocks gain",
		count:0,
		first:32,
		mult:2,
		add:0,
		unlockT:1
	},
	heroesKilled:{//c++
		name:"Heroes Killed",
		bonus:"Increase Tokens gain",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:2
	},
	itemScrapped:{//d++
		name:"Items Scrapped",
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
		name:"Regroups",
		bonus:"Reduce Armory prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:1
	},
	prestige1:{//b--
		name:"Researches",
		bonus:"Reduce Gym prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:2
	},
	prestige2:{//c--
		name:"Recruits",
		bonus:"Reduce Lab prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:3
	},
	prestige3:{//d--
		name:"Ascends",
		bonus:"Reduce Office Prices",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:4
	},
	maxLevelCleared:{//rarity++
		name:"Maximum Level Reached",
		bonus:"Improve equipment drop rarity",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:4
	}

}

const baseMinionDefault = {
		health:4,
		damage:3,
		moveSpeed:.02,
		attackRate:500,
		projectileSpeed:2,
		attackRange:2,
		splashRadius:.2,
		spawnDelay:1000,
		isFlying:0,
		attackCharges:1,
		chainRange:0,
		chainDamageReduction:0,
		unlockCost:0,
		color:"#FFF",
		color2:"#000",
	};
const baseMinion = {
	Mite:{
		health:3,
		damage:2,
		spawnDelay:400,
		color:"#0F0",
		info: "Weak ground unit with short spawn time"
	},
	Imp:{
		health:2,
		damage:3,
		spawnDelay:400,
		color:"#FA8",
		info: "Weak flying unit with short spawn time"
	},

	Bomber:{
		moveSpeed:.015,
		attackRange:2.5,
		splashRadius:2,
		spawnDelay:950,
		color:"#0FF",
		info:"Flying unit with large impact area but slow move speed"
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
		color:"#55F",
		info:"Flying unit with high rate of attack but low health"
		
	},

	Air:{
		health:1,
		damage:4,
		attackRate:100,
		moveSpeed:.07,
		isFlying:1,
		attackCharges:4,
		chainRange:9,
		chainDamageReduction:.95,
		spawnDelay:300,
		attackRange:2.5,
		projectileType:projectileTypes.homing,
		projectileSpeed:12,
		symbol:"&#x1f701;",
		color:"#FF7",
		color2:"#990",
		info:"Fast spawning fleeting flying minion with chain lightning attack and a move speed aura."
	},
	Earth:{
		health:12,
		moveSpeed:.01,
		projectileType:projectileTypes.blast,
		spawnDelay:1500,
		symbol:"&#x1f703;",
		color:"#631",
		color2:"#5B5",
		info:"Ground high health with passive self-healing."
	},
	Fire:{
		health:2,
		damage:1,
		moveSpeed:.1,
		attackRate:600,
		spawnDelay:600,
		isFlying:1,
		splashRadius:3,
		attackRange:.5,
		projectileType:projectileTypes.blast,
		symbol:"&#x1f702;",
		color:"#C00",
		color2:"#FB0",
		info:"Fast flying unit that targets towers with guerrilla tactics and inflicts burn damage over time."
	},
	Water:{
		health:2,
		damage:1,
		moveSpeed:.025,
		spawnDelay:400,
		splashRadius:2.5,
		attackRange:2.5,
		projectileType:projectileTypes.beam,
		symbol:"&#x1f704;",
		color:"#0FF",
		color2:"#01F",
		info:"Fast moving beam attack with a healing aura"
	}
}
const minionUpgradeMultipliersDefault = {
	health:1.02,
	damage:1.02,
	moveSpeed:1.03,
	attackRate:0.98,
	splashRadius:1.05,
	attackRange:1.03,
	spawnDelay:.95
};
const minionUpgradeMultipliers = {
	Mite:{
		spawnDelay:.9
	},
	Imp:{
	  sapwnDelay:.9
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
		attackRate:.95
	},
	
	Air:{ moveSpeed:1.07},
	Earth:{ health:1.06 },
	Fire:{ attackRate:.92 },
	Water:{  }
}
const minionResearch = {
	Mite:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:0
	},
	Imp:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:0
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
const minionUpgrades = {
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
	Imp:{
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

const baseTowerDefault = {
	health:10,
	damage:5,
	targetCount:1,
	attackRate:200,
	projectileSpeed:2,
	attackRange:2.7,
	canHitAir:0,
	canHitGround:0,
	attackCharges:1,
	chainRange:1,
	chainDamageReduction:.5,
	splashRadius:.1,
	spawnWeight:1,
	projectileType:projectileTypes.balistic,
	attackEffect:null
}
const attackEffects = {
	DOT:{
		name:statTypes.health,
		aBase:-.0078125,
		mBase:null,
		levelMultiplier:1.5,
		defaultDuration:100
	},
	Slow:{
		name:statTypes.moveSpeed,
		aBase:null,
		mBase:.8,
		levelMultiplier:.9,
		defaultDuration:250
	},
	Stun:{
		name:statTypes.moveSpeed,
		aBase:null,
		mBase:.01,
		levelMultiplier:1,
		defaultDuration:100
	},
	Disarm:{
		name:statTypes.damage,
		aBase:null,
		mBase:.95,
		levelMultiplier:.95,
		defaultDuration:100
	},
	Dibilitate:{
		name:statTypes.attackRate,
		aBase:null,
		mBase:.95,
		levelMultiplier:.95,
		defaultDuration:100
	}
}
const baseTower = {
	Basic:{
		damage:3,
		attackRate:100,
		canHitAir:1,
		canHitGround:1,
		spawnWeight:4,
		splashRadius:.4,
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
		splashRadius:.7,
		canHitGround:1,
		attackEffect:attackEffects.Dibilitate,
		color:"#F73",
		color2:"#733",
		info: "Large splash attack that hits ground units and slows rate of attack"
	},
	Explosion:{
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
		targetCount:3,
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
		damage:1,
		attackCharges:3,
		chainRange:3,
		chainDamageReduction:1,
		canHitAir:1,
		canHitGround:1,
		attackEffect:attackEffects.DOT,
		projectileType:projectileTypes.homing,
		projectileSpeed:3,
		color:"#5A5",
		color2:"#353",
		info: "Homing chain attack that hits air and ground units and deals damage over time"
	},
	Sniper:{
		attackRange:5,
		attackRate:500,
		projectileType:projectileTypes.homing,
		projectileSpeed:3,
		canHitAir:1,
		canHitGround:1,
		color:"#A00",
		color2:"#500",
		info: "Homing long range attack that hits air and ground units"
		
	}
}
const towerLevelMultipliersDefault ={
	health:1.1,
	damage:1.1,
	targetCount:1.05,
	attackRate:.95,
	projectileSpeed:1.06,
	attackRange:1.05,
	attackCharges:1.1,
	chainRange:1.05,
	chainDamageReduction:1,
	splashRadius:1.02
}
const towerLevelMultipliers = {
	Basic:{
		health:1.15,
		damage:1.15,
		splashRadius:1
	},
	Artilllery:{
		damage:1.2,
		splashRadius:1.04
	},
	Explosion:{
		attackRange:1.07,
		splashRadius:1.07,
		attackRate:.9
	},
	Ice:{
		targetCount:1.1,
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
		attackCharges:1.1,
		chainRange:1.1
	},
	Sniper:{
		attackRange:1.08,
		projectileSpeed:1.1,
	}
}

const baseBossDefault = {
	health:50,
	damage:10,
	attackRate:300,
	projectileSpeed:3,
	abilityDuration:100,
	abilityCooldown:1000,
	spawnDelay:1000,
	projectileType:projectileTypes.balistic,
	attackRange:2.5,
	attackCharges:1,
	chainRange:0,
	chainDamageReduction:0,
	auraRange: 3,
	splashRadius:.2,
	auraPower: 1.5,
	isFlying:0,
	unlockCost:0,
	passiveAbilityInfo: "N/A"
}
const bossUpgradeMultipliersDefault = {
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
const baseBoss = {
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
		auraInfo: "Damage enemies",
		passiveAbilityInfo: "Gain attack damage when a minion dies",
		activeAbilityInfo: "Summon skeletons instead of normal minions. Skeletons are like other minions but spawn much faster and only have 1 health and attack."
	},
	Famine:{
		damage:0,
		attackRate:200,
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
		activeAbilityInfo: "Reduce all tower damage"
	},
	War:{
		health:100,
		moveSpeed:.06,
		spawnDelay:1500,
		abilityCooldown:200,
		unlockCost:0,
		symbol:"&#x2694;",
		color:"#F00",
		color2:"#422",
		info: "Powerful in a direct assault",
		auraInfo: "Increase minion attack rate",
		passiveAbilityInfo: "Attacks gain health and reduce time to next respawn; getting attacked reduces time to next attack",
		activeAbilityInfo: "Increase rate of attack and move speed. Ignore incoming damage."
	}
}
const bossUpgradeMultipliers = {
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
const bossResearch = {
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
const bossUpgrades = {
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

const baseHeroDefault = {
	damage:2,
	health:15,
	regen:10,
	attackRate:200,
	attackRange:2.2,
	projectileSpeed:3,
	moveSpeed:.05,
	attackCharges:1,
	canHitAir:1,
	canHitGround:1,
	spawnWeight:1,
	splashRadius:.5
}
const heroPowerTypes = {
	DamageReduction:{
		name:statTypes.damageReduction,
		effects:[
			{
				effectType:statTypes.damageReduction,
				aBase:-1,
				mBase:.9,
				aMultiplier:1.5,
				mMultiplier:.9
			}
		]
	},
	Heal:{
		name:"Heal",
		effects:[
			{
				effectType:statTypes.health,
				aBase:.0078125,
				aMultiplier:1.0078125
			}
		]
	},
	AttackBoost:{
		name:"AttackBoost",
		effects:[
			{
				effectType:statTypes.attackRate,
				mBase:1.125,
				mMultiplier:1.0625
			},
			{
				effectType:statTypes.attackRange,
				mBase:1.125,
				mMultiplier:1.0625
			},
			{
				effectType:statTypes.damage,
				mBase:1.125,
				mMultiplier:1.0625
			}
		]
	}
}
const baseHero = {
	Cleric:{//heal nearby towers
		projectileType:projectileTypes.blast,
		heroPowerType:heroPowerTypes.Heal,
		splashRadius:2.5,
		regen:7,
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
		attackCharges:5,
		chainRange:5,
		chainDamageReduction:.95,
		projectileType:projectileTypes.beam,
		heroPowerType:heroPowerTypes.AttackBoost,
		color:"#77F",
		color2:"#220",
		symbol:"&#x269a;",
		info: "Boosts nearby towers"
	},
	Templar:{//take less damage with less health
		health:20,
		attackRange:1.75,
		splashRadius:.7,
		projectileType:projectileTypes.balistic,
		heroPowerType:heroPowerTypes.DamageReduction,
		color:"#F44",
		color2:"#044",
		symbol:"&#x26e8;",
		info: "High armor defender"
	}

}
const heroLevelMultipliersDefault ={
	health:1.3,
	regen:0.95,
	damage:1.3,
	moveSpeed:1.03,
	attackRate:0.95,
	projectileSpeed:1.05,
	attackRange:1.03,
	splashRadius:1.01,
	attackCharges:1
}
const heroLevelMultipliers = {
	Cleric:{
		regen:.7,
		attackRate:.9,
		splashRadius:1.03
	},
	Prophet:{
		damage:1.5,
		attackRange:1.05,
		attackCharges:1.1
	},
	Templar:{
		health:1.5,
		moveSpeed:1.1
	}
}
