"use strict";
const unitTypes = {
	Minion:{team:0, uniqueSymbol:1, infoSymbol:"&#x1f771;"},
	Boss:{team:0, uniqueSymbol:1, infoSymbol:"?"},
	Tower:{team:1, uniqueSymbol:0, infoSymbol:"&#x25a3;"},
	Hero:{team:1, uniqueSymbol:1, infoSymbol:"?"}
};
const projectileTypes = {
	ballistic:1,
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
	impactRadius:"impactRadius",
	spawnDelay:"spawnDelay",
	attackCharges:"attackCharges",
	chainRange:"chainRange",
	chainDamageReduction:"chainDamageReduction",//new damage=damage*damageReduction
	auraRange:"auraRange",
	auraPower:"auraPower",
	abilityDuration:"abilityDuration",
	abilityCooldown:"abilityCooldown",
	damageReduction:"damageReduction",
	initialMinions:"initialMinions",
	minionsPerDeploy:"minionsPerDeploy"
}
const statDescription = {
	health:"Amount of damage a unit can take",
	damage:"Amount of damage done when attacking",
	moveSpeed:"How fast a unit moves",
	attackRate:"Time between attacks",
	attackRange:"Maximum distance a unit can be attacked",
	projectileSpeed:"How fast a projectile moves, not applicable for beam or blast attacks",
	impactRadius:"Size of impact, not applicable for beam or homing attacks",
	spawnDelay:"Time between unit spawns",
	targetCount:"Number of targets that can be attacked in parallel",
	attackCharges:"Number of targets that can be attacked in series",
	chainRange:"Maximum distance a projectile can travel between targets in series",
	chainDamageReduction:"Percent of damage done to subsiquent targets in series",
	auraRange:"Maximum distance for units to be effected by the aura",
	auraPower:"The strength of the aura effect",
	abilityDuration:"Time that an active ability effect lasts",
	abilityCooldown:"Time between end of active ability until it can be used again",
	damageReduction:"Reduces incoming damage",
	initialMinions:"Number of minions deployed at reset",
	minionsPerDeploy:"Number of units deployed per spawn"
}

const statAdjustments = {
	health:1,
	damage:1,
	targetCount:1,
	moveSpeed:1000,
	attackRate:10,
	attackRange:10,
	projectileSpeed:10,
	impactRadius:10,
	spawnDelay:1,
	attackCharges:1,
	chainRange:10,
	chainDamageReduction:1,
	auraRange:10,
	auraPower:10,
	abilityDuration:1,
	abilityCooldown:1,
	damageReduction:1,
	initialMinions:1,
	minionsPerDeploy:1
}
const statMaxLimits = {
  moveSpeed:350,
  projectileSpeed:400,
  attackRange:50,
  impactRadius:50,
  chainRange:50
}
const statMinLimits ={
  attackRate:200,
  spawnDelay:50
}

//for these stats smaller is better, most stats bigger is better.
const backwardsStats = [statTypes.attackRate, statTypes.spawnDelay, statTypes.abilityCooldown];
const flooredStats = [statTypes.targetCount, statTypes.attackCharges, statTypes.initialMinions, statTypes.minionsPerDeploy];
const scaledStats = [statTypes.moveSpeed, statTypes.attackRange, statTypes.auraRange];

const resources = {
	a:{//Armory - towers/heroes/etc
		amt:0,
		name:"Ruples",
		symbol:"α",//224
		value:1
	},
	b:{//Gym - prestige0/Regroup
		amt:0,
		name:"Shillins",
		symbol:"ß",//225
		value:2
	},
	c:{//Lab - prestige1/Evolve
		amt:0,
		name:"Tokens",
		symbol:"Γ",//226
		value:3
	},
	d:{//Office - prestige2/Promote
		amt:0,
		name:"Units",
		symbol:"π",//227
		value:4
	},
	e:{//Store/Forge - Scrap Item
		amt:0,
		name:"Vincula",
		symbol:"Σ",
		value:5
	},
	f:{//Forge - ??
		amt:0,
		name:"Womba",
		symbol:"σ",
		value:6
	}
};
const gauges = {
	Range:{isUnlocked:1,cost:1},
	Reload:{isUnlocked:1,cost:1},
	Health:{isUnlocked:1,cost:1},
	Damage:{isUnlocked:1,cost:1}
}
const tierMisc = {
	t0:{
		tier:0,
		autobuy:{
			isUnlocked:0,
			resource:"b"
		},
		upgradePotency:1,
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
		upgradePotency:1,
		miscUpgrades:{
		  autoBuy_1: "Unlock Automate Armory",
		  upgradePotency_1: "Armory Multiplier",
		  maxMinions_1: "Active Minions Limit++"
		}
	},
	t2:{
		tier:2,
		autobuy:{
			isUnlocked:0,
			resource:"d"
		},
		upgradePotency:1,
		miscUpgrades:{
		  autoBuy_2: "Unlock Automate Gym",
		  upgradePotency_2: "Gym Multiplier",
		  upgradeLimit_2: "Upgrade Limit++"
		}
	},
	t3:{
		tier:3,
		autobuy:{
			isUnlocked:0,
			resource:"e"
		},
		upgradePotency:1,
		miscUpgrades:{
		  autoBuy_3: "Unlock Automate Lab",
		  upgradePotency_3: "Lab Multiplier",
		  reduceDeployTime_3: "Deploy Time--"
		}
	},
	t4:{
	  tier:4,
		autobuy:{
			isUnlocked:0,
			resource:"f"
		},
		miscUpgrades:{
		  autoBuy_4: "Unlock Automate Office",
		  upgradePotency_4: "Office Multiplier",
		  autoSell_4: "Auto Sell limit++",
		  startingLevel_4:"Maximum Starting Level++"
		}
	}
}

const bombTypes ={
  heal:{
    text:"Heal Invaders",
    team:0,
    effectType:0,
    remaining:0,
    stats:[statTypes.health],
    initial:{
      a:.5,
      m:1,
      d:10
    },
    scaleA:{
      a:1,
      m:1.2
    },
    scaleM:{
      a:0,
      m:1
    },
    scaleD:{
      a:2,
      m:1.1
    }
  },
  enrage:{
    text:"Enrage Invaders",
    team:0,
    effectType:0,
    remaining:0,
    stats:[statTypes.attackRate, statTypes.damage, statTypes.moveSpeed],
    initial:{
      a:.5,
      m:1.1,
      d:50
    },
    scaleA:{
      a:1,
      m:1.05
    },
    scaleM:{
      a:.1,
      m:1.05
    },
    scaleD:{
      a:1,
      m:1.1
    }
  },
  damage:{
    text:"Damage Defenders",
    team:1,
    effectType:1,
    remaining:0,
    stats:[statTypes.health],
    initial:{
      a:-.1,
      m:1,
      d:5
    },
    scaleA:{
      a:-1,
      m:1.2
    },
    scaleM:{
      a:0,
      m:1
    },
    scaleD:{
      a:1,
      m:1.1
    }
  },
  curse:{
    text:"Curse Defenders",
    team:1,
    effectType:1,
    remaining:0,
    stats:[statTypes.attackRate, statTypes.damage],
    initial:{
      a:0,
      m:.9,
      d:50
    },
    scaleA:{
      a:0,
      m:1
    },
    scaleM:{
      a:0,
      m:.9
    },
    scaleD:{
      a:5,
      m:1.1
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
		unlockT:3,
		maxLevel:12,
		maxCount:0
	},
	bossesSummoned:{
	  name:"Bosses Summoned",
	  bonus:"Store Effectiveness",
	  count:0,
	  first:12,
	  mult:2,
	  add:6,
	  unlockT:5,
		maxLevel:12,
		maxCount:0
	},
	towersDestroyed:{//b++
		name:"Towers Destroyed",
		bonus:"Increase Shillins gain",
		count:0,
		first:32,
		mult:2,
		add:0,
		unlockT:1,
		maxLevel:12,
		maxCount:0
	},
	heroesKilled:{//c++
		name:"Heroes Vanquished",
		bonus:"Increase Tokens gain",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:2,
		maxLevel:12,
		maxCount:0
	},
	itemScrapped:{//d++
		name:"Items Sold",
		bonus:"Increase Units gain",
		count:0,
		first:8,
		mult:2,
		add:4,
		unlockT:4,
		maxLevel:12,
		maxCount:0
	},
	itemPrestiged:{//e++
		name:"Items Prestiged",
		bonus:"Increase Vincula gain",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:4,
		maxLevel:12,
		maxCount:0
	},
	prestige0:{//a--
		name:"Regroups",
		bonus:"Reduce Armory prices and increase Armory minion upgrades",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:1,
		maxLevel:12,
		maxCount:0
	},
	prestige1:{//b--
		name:"Researches",
		bonus:"Reduce Gym prices and increase Gym minion upgrades",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:2,
		maxLevel:12,
		maxCount:0
	},
	prestige2:{//c--
		name:"Recruits",
		bonus:"Reduce Lab prices and increase Lab minion upgrades",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:3,
		maxLevel:12,
		maxCount:0
	},
	prestige3:{//d--
		name:"Restructures",
		bonus:"Reduce Office Prices and increase Office minion upgrades",
		count:0,
		first:1,
		mult:2,
		add:0,
		unlockT:4,
		maxLevel:12,
		maxCount:0
	},
	maxLevelCleared:{//rarity++
		name:"Maximum Castle Vanquished",
		bonus:"Improve equipment drop rarity",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:4,
		maxLevel:12,
		maxCount:0
	}
}


const underling = {
		health:.1,
		damage:0,
		moveSpeed:25,
		attackRate:Infinity,
		projectileSpeed:0,
		projectileType:"None",
		attackRange:0,
		impactRadius:0,
		spawnDelay:100,
		isFlying:0,
		targetCount:0,
		attackCharges:0,
		chainRange:0,
		chainDamageReduction:0,
		unlockCost:0,
		color:"#999",
		color2:"#333",
		minionsPerDeploy:3
}
const baseMinionDefault = {
		health:4,
		damage:3,
		moveSpeed:20,
		attackRate:5000,
		projectileSpeed:50,
		projectileType:projectileTypes.ballistic,
		attackRange:8,
		impactRadius:1,
		spawnDelay:1000,
		isFlying:0,
		targetCount:1,
		attackCharges:1,
		chainRange:0,
		chainDamageReduction:0,
		unlockCost:0,
		color:"#FFF",
		color2:"#000",
		minionsPerDeploy:1
	};
const baseMinion = {
	Mite:{
		health:3,
		damage:2,
		attackRange:6,
		spawnDelay:400,
		color:"#0F0",
		color2:"#000",
		info: "Weak ground unit with short spawn time"
	},
	Imp:{
		health:2,
		damage:3,
		attackRange:6,
		spawnDelay:400,
		isFlying:1,
		color:"#FA8",
		color2:"#000",
		info: "Weak flying unit with short spawn time"
	},

	Bomber:{
		moveSpeed:15,
		attackRange:10,
		impactRadius:1.8,
		spawnDelay:950,
		attackRate:7000,
		isFlying:1,
		color:"#0FF",
		color2:"#000",
		info:"A flying unit with large impact area but slow move speed. Bombers crash in a large explosion when it dies."
	},
	Catapult:{
		damage:4,
		attackRange:11,
		attackRate:10000,
		spawnDelay:1100,
		color:"#F0F",
		color2:"#000",
		info:"A ground unit with long attack range but slow attack rate. Catapults cannot reload while moving."
	},
	Golem:{
		health:8,
		moveSpeed:15,
		attackRange:7,
		spawnDelay:900,
		color:"#A52",
		color2:"#000",
		info:"Ground unit with high health but slow spawn time. Golems take less damage with lower health."
	},
	Harpy:{
		damage:6,
		health:3,
		moveSpeed:30,
		isFlying:1,
		color:"#FF0",
		color2:"#000",
		info: "Flying unit with high damage but short range. Harpies have a chance to dodge attacks or take double damage."
	},
	Ram:{
	  damage:6,
		moveSpeed:40,
		attackRate:7000,
		attackRange:6.5,
		spawnDelay:900,
		color:"#F00",
		color2:"#000",
		info: "Ground unit with high move speed but slow attack rate. Rams cannot move while reloading."
	},
	Vampire:{
		health:2,
		moveSpeed:30,
		attackRate:2500,
		isFlying:1,
		spawnDelay:850,
		color:"#55F",
		color2:"#000",
		info:"Creature with a high rate of attack but low health. Vampires are flying units while moving and ground units while attacking."
	},

	Air:{
		health:1,
		damage:6,
		attackRate:1000,
		moveSpeed:40,
		isFlying:1,
		attackCharges:4,
		chainRange:50,
		chainDamageReduction:.95,
		attackRange:5,
		projectileType:projectileTypes.beam,
		minionsPerDeploy:2,
		unlockCost:32,
		symbol:"&#x1f701;",
		color:"#FF7",
		color2:"#990",
		info:"A fast flying kamikaze minion with chain beam attack."
	},
	Earth:{
		health:10,
		moveSpeed:12,
		projectileType:projectileTypes.blast,
		targetCount:2,
		spawnDelay:1300,
		minionsPerDeploy:2,
		unlockCost:32,
		symbol:"&#x1f703;",
		color:"#631",
		color2:"#5B5",
		info:"A ground unit with High health and an area blast attack. Spawns as one amalgamate; minions per spawn increases attributes."
	},
	Fire:{
		health:2,
		damage:4,
		attackRate:6000,
		spawnDelay:800,
		impactRadius:2,
		attackRange:2,
		projectileType:projectileTypes.blast,
		minionsPerDeploy:4,
		unlockCost:32,
		symbol:"&#x1f702;",
		color:"#C00",
		color2:"#FB0",
		info:"A ground unit that burns towers with guerrilla tactics and inflicts damage over time."
	},
	Water:{
		health:2,
		damage:5,
		moveSpeed:25,
		impactRadius:2,
		attackRange:.1,
		spawnDelay:1200,
		isFlying:1,
		projectileType:projectileTypes.beam,
		minionsPerDeploy:4,
		unlockCost:32,
		symbol:"&#x1f704;",
		color:"#0FF",
		color2:"#01F",
		info:"Rains down blessings and healing on the Invaders."
	}
}
const minionUpgradeMultipliersDefault = {
	health:1.02,
	damage:1.02,
	moveSpeed:1.01,
	attackRate:0.99,
	impactRadius:1.03,
	attackRange:1.03,
	spawnDelay:.98
};
const minionUpgradeMultipliers = {
	Mite:{
		spawnDelay:.95
	},
	Imp:{
	  spawnDelay:.95
	},
	Bomber:{
		impactRadius:1.06,
		damage:1.01
	},
	Catapult:{
		attackRange:1.06,
		attackRate:.995
	},
	Golem:{
		health:1.04
	},
	Harpy:{
		damage:1.03,
		attackRange:1.01,
		attackRate:.995
	},
	Ram:{
		moveSpeed:1.02
	},
	Vampire:{
		attackRate:.98
	},
	
	Air:{ moveSpeed:1.02,damage:1.03 },
	Earth:{ health:1.05,spawnDelay:.97 },
	Fire:{ impactRadius:1.05,damage:1.03, attackRange:1 },
	Water:{ spawnDelay:.96,health:1.03 }
}
const minionResearch = {
	Mite:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:0,
		hotkey:'Q'
	},
	Imp:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:0,
		hotkey:'W'
	},
	Bomber:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1,
		hotkey:'E'
	},
	Catapult:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1,
		hotkey:'R'
	},
	Golem:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1,
		hotkey:'T'
	},
	Harpy:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1,
		hotkey:'Y'
	},
	Ram:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1,
		hotkey:'U'
	},
	Vampire:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:1,
		hotkey:'I'
	},

	Air:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2,
		hotkey:'O'
	},
	Earth:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2,
		hotkey:'P'
	},
	Fire:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2,
		hotkey:'{'
	},
	Water:{
		isUnlocked:0,
		lastSpawn:0,
		unlockT:2,
		hotkey:'}'
	}
}
const minionUpgrades = {
	Mite:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Imp:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Bomber:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Catapult:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Golem:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Harpy:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Ram:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Vampire:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},

	Air:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Earth:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Fire:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	},
	Water:{
		health:0,
		damage:0,
		moveSpeed:0,
		attackRate:0,
		impactRadius:0,
		attackRange:0,
		spawnDelay:0,
		initialMinions:0,
		minionsPerDeploy:0
	}
}

const baseTowerDefault = {
	health:4,
	damage:1,
	targetCount:1,
	attackRate:2500,
	projectileSpeed:50,
	attackRange:10,
	canHitAir:0,
	canHitGround:0,
	attackCharges:1,
	chainRange:10,
	chainDamageReduction:.5,
	impactRadius:1,
	spawnWeight:1,
	projectileType:projectileTypes.ballistic,
	attackEffect:null
}
const attackEffects = {
	DOT:[{
		name:statTypes.health,
		aBase:-.0078125,
		mBase:null,
		levelMultiplier:1.5,
		defaultDuration:100
	}],
	Slow:[{
		name:statTypes.moveSpeed,
		aBase:null,
		mBase:.8,
		levelMultiplier:.8,
		defaultDuration:100
	}],
	Stun:[{
		name:statTypes.attackRate,
		aBase:null,
		mBase:.05,
		levelMultiplier:1,
		defaultDuration:25
	}],
	Disarm:[{
		name:statTypes.damage,
		aBase:null,
		mBase:.5,
		levelMultiplier:.8,
		defaultDuration:100
	}],
	Dibilitate:[{
		name:statTypes.attackRate,
		aBase:null,
		mBase:.9,
		levelMultiplier:.9,
		defaultDuration:75
	},{
		name:statTypes.moveSpeed,
		aBase:null,
		mBase:.9,
		levelMultiplier:.9,
		defaultDuration:75
	},{
		name:statTypes.damage,
		aBase:null,
		mBase:.9,
		levelMultiplier:.9,
		defaultDuration:75
	}
	]
}
const baseTower = {
	Basic:{
		spawnWeight:6,
		damage:.8,
		attackRate:1200,
		canHitAir:1,
		canHitGround:1,
		impactRadius:2,
		projectileSpeed:60,
		color:"#D0F",
		color2:"#507",
		info:"Basic tower that hits air and ground units"
	},
	Artilllery:{
		spawnWeight:2,
		health:5,
		damage:2,
		attackRate:4000,
		attackRange:14,
		impactRadius:4,
		canHitGround:1,
		attackEffect:attackEffects.Dibilitate,
		color:"#F73",
		color2:"#733",
		info: "Large Impact Radius that hits ground units and slows rate of attack"
	},
	Explosion:{
		spawnWeight:1,
		canHitAir:1,
		canHitGround:1,
		attackRange:8,
		impactRadius:8,
		projectileType:projectileTypes.blast,
		attackEffect:attackEffects.Stun,
		color:"#999",
		color2:"#333",
		info: "Stuns all minions in range"
	},
	Ice:{
		spawnWeight:4,
		damage:.5,
		targetCount:2,
		canHitAir:1,
		canHitGround:1,
		impactRadius:1,
		projectileType:projectileTypes.beam,
		attackEffect:attackEffects.Slow,
		color:"#0AF",
		color2:"#069",
		info: "Multi-Beam attack that hits all units and slows movement speed"
	},
	Lightning:{
		spawnWeight:4,
		health:3,
		damage:2,
		attackCharges:2,
		attackRange:12,
		chainRange:15,
		chainDamageReduction:.5,
		canHitAir:1,
		projectileType:projectileTypes.beam,
		attackEffect:attackEffects.Disarm,
		color:"#FF0",
		color2:"#990",
		info: "Beam chain attack that hits air units and reduces damage"
	},
	Poison:{
		spawnWeight:4,
		damage:1,
		attackCharges:2,
		attackRange:12,
		chainRange:15,
		chainDamageReduction:1,
		canHitAir:1,
		canHitGround:1,
		attackEffect:attackEffects.DOT,
		projectileType:projectileTypes.homing,
		projectileSpeed:70,
		color:"#5A5",
		color2:"#353",
		info: "Homing chain attack that hits air and ground units and deals damage over time"
	},
	Sniper:{
	  damage:3,
		spawnWeight:2,
		attackRange:15,
		attackRate:1700,
		projectileType:projectileTypes.homing,
		projectileSpeed:70,
		canHitAir:1,
		canHitGround:1,
		color:"#C33",
		color2:"#500",
		info: "Homing long range attack that hits air and ground units"
		
	}
}
const towerLevelMultipliersDefault ={
	health:1.1,
	damage:1.1,
	targetCount:1.05,
	attackRate:.98,
	projectileSpeed:1.06,
	attackRange:1.02,
	attackCharges:1.02,
	chainRange:1.01,
	chainDamageReduction:1,
	impactRadius:1.02
}
const towerLevelMultipliers = {
	Basic:{
		health:1.12,
		damage:1.12,
		impactRadius:1
	},
	Artilllery:{
		damage:1.2,
		impactRadius:1.03
	},
	Explosion:{
		attackRange:1.03,
		impactRadius:1.03,
		attackRate:.95,
		targetCount:1,
		attackCharges:1
	},
	Ice:{
		targetCount:1.1,
		attackRange:1.03,
		attackRate:.95,
		impactRadius:1
	},
	Lightning:{
		projectileSpeed:1,
		attackRange:1.03,
		attackRate:.95,
		attackCharges:1.1,
		targetCount:1.1,
		chainRange:1.02,
		chainDamageReduction:1.02,
		impactRadius:1
	},
	Poison:{
		projectileSpeed:1.1,
		damage:1.05,
		attackRange:1.03,
		attackCharges:1.05,
		chainRange:1.02,
		impactRadius:1
	},
	Sniper:{
	  damage:1.2,
		attackRange:1.1,
		projectileSpeed:1.1,
		impactRadius:1
	}
}

const baseBossDefault = {
	health:50,
	damage:10,
	attackRate:4000,
	moveSpeed:30,
	projectileSpeed:50,
	abilityDuration:100,
	abilityCooldown:1000,
	spawnDelay:1000,
	projectileType:projectileTypes.ballistic,
	attackRange:12,
	attackCharges:1,
	chainRange:0,
	chainDamageReduction:0,
	auraRange:30,
	impactRadius:2,
	targetCount:1,
	auraPower:15,
	isFlying:0,
	unlockCost:32,
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
	  health:75,
		attackRate:5000,
		auraRange:40,
		moveSpeed:45,
		attackRange:15,
  	abilityDuration:50,
		symbol:"&#x1f480;",
		color:"#777",
		color2:"#333",
		info: "Strength from the misfortune of minions",
		auraInfo: "Damage nearby enemies",
		passiveAbilityInfo: "Gain attack damage when a minion dies",
		activeAbilityInfo: "Summon zombie horde. Zombies travel in a straight line and have reduced attributes."
	},
	Famine:{
		damage:5,
		attackRate:2500,
		projectileType:projectileTypes.beam,
		attackRange:20,
		impactRadius:30,
		auraRange:60,
		spawnDelay:500,
		targetCount:2,
		abilityDuration: 300,
		isFlying:1,
		symbol:"&#x20E0;",
		color:"#707",
		color2:"#111",
		info: "Silent but deadly",
		auraInfo: "Slow Tower attack Rate",
		passiveAbilityInfo: "Attacks delay enemy attack",
		activeAbilityInfo: "Reduce all tower damage"
	},
	Pestilence: {
	  health:20,
		damage:2,
		projectileType:projectileTypes.homing,
  	abilityDuration:50,
  	abilityCooldown:500,
		spawnDelay:700,
		attackRate:1000,
		attackRange:20,
		auraRange:40,
		targetCount:1,
		attackCharges:5,
		chainRange:50,
		chainDamageReduction:1.01,
		isFlying:1,
		symbol:"&#x2623;",
		color:"#070",
		color2:"#111",
		info: "There is no escape",
		auraInfo: "Reduce enemy damage",
		passiveAbilityInfo: "Attacks get more powerful as it spreads and stack damage over time on enemies",
		activeAbilityInfo: "Infect all towers with damage over time"
	},
	War:{
		health:100,
		abilityCooldown:200,
		attackRange:10,
		symbol:"&#x2694;",
		color:"#F00",
		color2:"#422",
		info: "Powerful in a direct assault",
		auraInfo: "Increase minion attack rate",
		passiveAbilityInfo: "Attacks gain health and reduce time to next respawn; getting attacked reduces time to next attack",
		activeAbilityInfo: "Charge straight toward the next tower with increased move speed and rate of attack."
	}
}
const bossUpgradeMultipliers = {
	Death:{
		abilityCooldown:.9
	},
	Famine:{
	  attackRange:1.1,
		auraRange:1.1
	},
	War:{
	  health:1.3,
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
	Pestilence:{
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
	Pestilence:{
		targetCount:0,
		attackCharges:0,
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
	health:10,
	regen:2,
	attackRate:3000,
	attackRange:12,
	projectileSpeed:60,
	moveSpeed:10,
	attackCharges:1,
	canHitAir:1,
	canHitGround:1,
	chainRange:0,
	chainDamageReduction:0,
	spawnWeight:1,
	impactRadius:3,
	targetCount:1
}
const heroPowerTypes = {
	DamageReduction:{
		name:statTypes.damageReduction,
		effects:[
			{
				effectType:statTypes.damageReduction,
				aBase:-1,
				mBase:.8,
				aMultiplier:1.1,
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
				effectType:statTypes.damage,
				mBase:1.125,
				mMultiplier:1.0625
			}
		]
	}
}
const baseHero = {
	Monk:{//heal nearby towers
		projectileType:projectileTypes.blast,
		heroPowerType:heroPowerTypes.Heal,
		impactRadius:15,
		regen:4,
		color:"#4F4",
		color2:"#404",
		symbol:"&#x271d;",
		info:"Heals nearby towers"
	},
	Prophet:{//AttackRate/Damage (buff tower/debuff minions) aura
		health:7,
		damage:3,
		attackRate:2000,
		attackRange:20,
		attackCharges:2,
		targetCount:2,
		chainRange:20,
		chainDamageReduction:.95,
		projectileType:projectileTypes.beam,
		heroPowerType:heroPowerTypes.AttackBoost,
		color:"#77F",
		color2:"#220",
		symbol:"&#x269a;",
		info: "Boosts nearby towers"
	},
	Templar:{//take less damage with less health
		health:15,
		attackRange:10,
		impactRadius:7,
		projectileType:projectileTypes.ballistic,
		heroPowerType:heroPowerTypes.DamageReduction,
		color:"#F44",
		color2:"#044",
		symbol:"&#x26e8;",
		info: "High armor defender"
	}

}
const heroLevelMultipliersDefault ={
	health:1.2,
	regen:1.05,
	damage:1.2,
	moveSpeed:1.2,
	attackRate:0.95,
	projectileSpeed:1.05,
	attackRange:1.02,
	impactRadius:1.02,
	attackCharges:1,
	targetCount:1
}
const heroLevelMultipliers = {
	Monk:{
		regen:1.1,
		attackRate:.92,
		impactRadius:1.03
	},
	Prophet:{
		damage:1.3,
		attackRange:1.03,
		attackCharges:1.1,
		targetCount:1.1,
		attackRate:.92
	},
	Templar:{
		health:1.5,
		moveSpeed:1.1,
		impactRadius:1.01
	}
}
