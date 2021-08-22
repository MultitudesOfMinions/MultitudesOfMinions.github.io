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
	chainReduction:"chainReduction",//new damage=damage*chainReduction
	regen:"regen",
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
	chainReduction:"Percent of damage done to subsiquent targets in series",
	auraRange:"Maximum distance for units to be effected by the aura",
	auraPower:"The strength of the aura effect",
	abilityDuration:"Time that an active ability effect lasts",
	abilityCooldown:"Time between end of active ability until it can be used again",
	damageReduction:"Reduces incoming damage",
	initialMinions:"Number of minions deployed at reset",
	minionsPerDeploy:"Number of units deployed per spawn",
	regen:"Rate of passively regaining health."
}

const statAdjustments = {
	health:1,
	damage:1,
	targetCount:1,
	moveSpeed:3000,
	attackRate:3,
	attackRange:10,
	projectileSpeed:50,
	impactRadius:10,
	spawnDelay:1,
	attackCharges:1,
	chainRange:10,
	chainReduction:1,
	auraRange:10,
	auraPower:10,
	abilityDuration:1,
	abilityCooldown:1,
	damageReduction:1,
	initialMinions:1,
	minionsPerDeploy:1,
	regen:1000
}
const statMaxLimits = {
  moveSpeed:350,
  projectileSpeed:400,
  attackRange:50,
  impactRadius:25,
  chainRange:50,
  auraRange:100
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
		name:"Minions Deployed",
		bonus:"Boss stat multiplier",
		count:0,
		first:32,
		mult:4,
		add:1,
		unlockT:3,
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
	heroesKilled:{//c++
		name:"Heroes Vanquished",
		bonus:"Increase Tokens gain",
		count:0,
		first:4,
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
	bossesSummoned:{//d++
	  name:"Bosses Summoned",
	  bonus:"Increase Units Gain",
	  count:0,
	  first:12,
	  mult:2,
	  add:6,
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
	itemScrapped:{//e++
		name:"Items Sold",
		bonus:"Increase Vincula gain",
		count:0,
		first:8,
		mult:2,
		add:4,
		unlockT:4,
		maxLevel:12,
		maxCount:0
	},
	maxLevelCleared:{//rarity++
		name:"Maximum Level",
		bonus:"Improve equipment drop rarity",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:4,
		maxLevel:12,
		maxCount:0
	},
	itemPrestiged:{//store++
		name:"Items Reforged",
		bonus:"Store Effectiveness",
		count:0,
		first:1,
		mult:1,
		add:1,
		unlockT:5,
		maxLevel:12,
		maxCount:0
	},
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
		spawnDelay:300,
		isFlying:0,
		targetCount:0,
		attackCharges:0,
		chainRange:0,
		chainReduction:0,
		unlockCost:0,
		color:"#741",
		color2:"#171",
		minionsPerDeploy:1
}
const baseMinionDefault = {
		health:4,
		damage:3,
		moveSpeed:20,
		attackRate:5000,
		projectileSpeed:75,
		projectileType:projectileTypes.ballistic,
		attackRange:8,
		impactRadius:.5,
		spawnDelay:3000,
		isFlying:0,
		targetCount:1,
		attackCharges:1,
		chainRange:0,
		chainReduction:0,
		regen:0,
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
		spawnDelay:1200,
		color:"#0AA",
		color2:"#000",
		info: "Weak ground unit with short spawn time"
	},
	Imp:{
		health:2,
		damage:3,
		projectileType:projectileTypes.beam,
		attackRange:6,
		spawnDelay:1200,
		isFlying:1,
		color:"#D40",
		color2:"#500",
		info: "Weak flying unit with short spawn time"
	},

	Bomber:{
		moveSpeed:15,
		attackRange:10,
		impactRadius:.8,
		spawnDelay:2750,
		attackRate:7000,
		isFlying:1,
		color:"#CCC",
		color2:"#040",
		info:"A flying unit with large impact area but slow move speed. Bombers crash in a large explosion when it dies."
	},
	Catapult:{
		damage:4,
		attackRange:11,
		attackRate:10000,
		spawnDelay:3300,
		color:"#972",
		color2:"#420",
		info:"A ground unit with long attack range but slow attack rate. Catapults cannot reload while moving."
	},
	Golem:{
		health:8,
		moveSpeed:15,
		attackRange:7,
		attackRate:7000,
		spawnDelay:2700,
		color:"#A52",
		color2:"#431",
		info:"Ground unit with high health but slow spawn time. Golems take less damage with lower health."
	},
	Harpy:{
		damage:6,
		health:3,
		moveSpeed:30,
		isFlying:1,
		attackRange:7,
		projectileType:projectileTypes.beam,
		color:"#FC0",
		color2:"#000",
		info: "Flying unit with high damage but short range. Harpies have a chance to dodge attacks or take double damage."
	},
	Ram:{
	  damage:6,
		moveSpeed:40,
		attackRate:7000,
		attackRange:6,
		spawnDelay:2700,
		projectileType:projectileTypes.beam,
		color:"#333",
		color2:"#AAA",
		info: "Ground unit with high move speed but slow attack rate. Rams cannot move while reloading."
	},
	Vampire:{
		health:2,
		moveSpeed:30,
		attackRate:2500,
		attackRange:7,
		isFlying:1,
		spawnDelay:2550,
		projectileType:projectileTypes.homing,
		color:"#99D",
		color2:"#404",
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
		chainReduction:.95,
		attackRange:5,
		projectileType:projectileTypes.beam,
		minionsPerDeploy:2,
		unlockCost:32,
		symbol:"&#x1f701;",
		color:"#FF4",
		color2:"#555",
		info:"A fast flying kamikaze minion with chain beam attack."
	},
	Earth:{
		health:10,
		moveSpeed:10,
		attackRate:10000,
		projectileType:projectileTypes.blast,
		targetCount:2,
		spawnDelay:3900,
		regen:3,
		attackRange:5,
		impactRadius:5,
		minionsPerDeploy:2,
		unlockCost:32,
		symbol:"&#x1f703;",
		color:"#6A2",
		color2:"#652",
		info:"A ground unit with High health and an area blast attack. Spawns as one amalgamate; minions per spawn increases attributes."
	},
	Fire:{
		health:2,
		damage:4,
		attackRate:6000,
		spawnDelay:2400,
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
		spawnDelay:3600,
		isFlying:1,
		projectileType:projectileTypes.beam,
		minionsPerDeploy:6,
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
	impactRadius:1.02,
	attackRange:1.01,
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
		impactRadius:1.04,
		damage:1.01
	},
	Catapult:{
		attackRange:1.02,
		attackRate:.995
	},
	Golem:{
		health:1.03,
		attackRange:1.005
	},
	Harpy:{
		damage:1.03,
		attackRange:1.005,
		attackRate:.995
	},
	Ram:{
		moveSpeed:1.02,
		attackRange:1.005
	},
	Vampire:{
		attackRate:.98,
		damage:1.01,
		attackRange:1.005
	},
	
	Air:{ moveSpeed:1.02,damage:1.03, attackRange:1 },
	Earth:{ health:1.03,spawnDelay:.97, attackRange:1.01, impactRadius:1.01 },
	Fire:{ impactRadius:1.01,damage:1.01, attackRange:1 },
	Water:{ spawnDelay:.96,health:1.03,impactRadius:1.01 }
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
	chainReduction:.5,
	impactRadius:1,
	spawnWeight:1,
	projectileType:projectileTypes.ballistic,
	attackEffect:null,
	regen:.05
}
const attackEffects = {
	DOT:[{
		name:statTypes.health,
		aBase:-.0078125,
		mBase:null,
		levelMultiplier:1.25,
		defaultDuration:100
	}],
	Slow:[{
		name:statTypes.moveSpeed,
		aBase:null,
		mBase:.7,
		levelMultiplier:.95,
		defaultDuration:100
	}],
	Stun:[{
		name:statTypes.attackRate,
		aBase:null,
		mBase:.01,
		levelMultiplier:1,
		defaultDuration:25
	}],
	Disarm:[{
		name:statTypes.damage,
		aBase:null,
		mBase:.5,
		levelMultiplier:.95,
		defaultDuration:100
	}],
	Dibilitate:[
	  {
  		name:statTypes.attackRate,
  		aBase:null,
  		mBase:.9,
  		levelMultiplier:.95,
  		defaultDuration:75
  	},{
  		name:statTypes.moveSpeed,
  		aBase:null,
  		mBase:.9,
  		levelMultiplier:.95,
  		defaultDuration:75
  	},{
  		name:statTypes.damage,
  		aBase:null,
  		mBase:.9,
  		levelMultiplier:.95,
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
		color2:"#406",
		info:"Basic tower that hits air and ground units"
	},
	Artillery:{
		spawnWeight:2,
		health:5,
		damage:2,
		attackRate:4000,
		attackRange:14,
		impactRadius:4,
		canHitGround:1,
		attackEffect:attackEffects.Dibilitate,
		color:"#F73",
		color2:"#622",
		info: "Large Impact Radius that hits ground units and slows rate of attack"
	},
	Explosion:{
		spawnWeight:1,
		canHitAir:1,
		canHitGround:1,
		attackRange:10,
		impactRadius:12,
		projectileType:projectileTypes.blast,
		attackEffect:attackEffects.Stun,
		color:"#AAA",
		color2:"#222",
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
		color2:"#037",
		info: "Multi-Beam attack that hits all units and slows movement speed"
	},
	Lightning:{
		spawnWeight:4,
		health:3,
		damage:2,
		attackCharges:2,
		attackRange:12,
		chainRange:15,
		chainReduction:.5,
		canHitAir:1,
		projectileType:projectileTypes.beam,
		attackEffect:attackEffects.Disarm,
		color:"#FF0",
		color2:"#666",
		info: "Beam chain attack that hits air units and reduces damage"
	},
	Poison:{
		spawnWeight:4,
		damage:1,
		attackCharges:2,
		attackRange:12,
		chainRange:15,
		chainReduction:1,
		canHitAir:1,
		canHitGround:1,
		attackEffect:attackEffects.DOT,
		projectileType:projectileTypes.homing,
		projectileSpeed:70,
		color:"#6C6",
		color2:"#131",
		info: "Homing chain attack that hits air and ground units and deals damage over time"
	},
	Sniper:{
	  damage:3,
		spawnWeight:2,
		attackRange:15,
		attackRate:3000,
		projectileType:projectileTypes.homing,
		projectileSpeed:70,
		canHitAir:1,
		canHitGround:1,
		color:"#D33",
		color2:"#300",
		info: "Homing long range attack that hits air and ground units"
		
	}
}
const towerLevelMultipliersDefault ={
	health:1.1,
	damage:1.1,
	targetCount:1.05,
	attackRate:.97,
	projectileSpeed:1.02,
	attackRange:1.03,
	attackCharges:1.02,
	chainRange:1.01,
	chainReduction:1,
	impactRadius:1.02,
	regen:1.2
}
const towerLevelMultipliers = {
	Basic:{
		health:1.12,
		damage:1.12,
		impactRadius:1
	},
	Artillery:{
		damage:1.15,
		impactRadius:1.03,
		attackRange:1.05
	},
	Explosion:{
	  health:1.2,
		attackRange:1.02,
		impactRadius:1.02,
		attackRate:.95,
		targetCount:1,
		attackCharges:1
	},
	Ice:{
		targetCount:1.1,
		attackRange:1.05,
		attackRate:.95,
		impactRadius:1
	},
	Lightning:{
		projectileSpeed:1,
		attackRange:1.05,
		attackRate:.95,
		attackCharges:1.1,
		targetCount:1.1,
		chainRange:1.02,
		chainReduction:1,
		impactRadius:1
	},
	Poison:{
		projectileSpeed:1.1,
		damage:1.05,
		attackRange:1.05,
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
	health:100,
	damage:20,
	attackRate:3000,
	moveSpeed:20,
	projectileSpeed:100,
	abilityDuration:300,
	abilityCooldown:3000,
	spawnDelay:3000,
	projectileType:projectileTypes.ballistic,
	attackRange:12,
	attackCharges:1,
	chainRange:0,
	chainReduction:0,
	auraRange:15,
	impactRadius:2,
	targetCount:1,
	auraPower:15,
	isFlying:0,
	regen:0,
	unlockCost:32,
	passiveAbilityInfo: "N/A"
}
const baseBoss = {
	Death:{
	  spawnDelay:10,
	  health:50,
		moveSpeed:30,
		attackRange:15,
  	abilityDuration:150,
  	abilityCooldown:2000,
  	impactRadius:4,
		symbol:"&#x1f480;",
		color:"#777",
		color2:"#111",
		info: "Death is not the end",
		auraInfo: "Increase invader move speed.",
		passiveAbilityInfo: "When a minion dies it comes back as a zombie.",
		activeAbilityInfo: "Summon zombie horde. Zombies travel in a straight line and have reduced attributes."
	},
	Famine:{
		damage:10,
		attackRate:2500,
		projectileType:projectileTypes.beam,
		attackRange:10,
		spawnDelay:1500,
		moveSpeed:35,
		isFlying:1,
		symbol:"&#x20E0;",
		color:"#707",
		color2:"#111",
		info: "Silent but deadly",
		auraInfo: "Slowly starve defenders and prevent towers from repairing.",
		passiveAbilityInfo: "Attacks delay targets next attack",
		activeAbilityInfo: "Reset defender attacks and slow attack rate."
	},
	Pestilence: {
	  health:75,
		damage:1,
		moveSpeed:10,
		projectileType:projectileTypes.homing,
  	abilityDuration:150,
  	abilityCooldown:4500,
		spawnDelay:2100,
		attackRate:1200,
		attackRange:20,
		auraRange:18,
		targetCount:2,
		attackCharges:3,
		chainRange:50,
		projectileSpeed:100,
		chainReduction:.95,
		isFlying:1,
		symbol:"&#x2623;",
		color:"#070",
		color2:"#111",
		info: "Spreads like the plague",
		auraInfo: "Reduce enemy damage",
		passiveAbilityInfo: "Attacks stack damage over time.",
		activeAbilityInfo: "Increase Target Count, Attack Range, and Attack Rate but decrease Damage."
	},
	War:{
		health:150,
		projectileType:projectileTypes.blast,
		abilityCooldown:1000,
		targetCount:2,
		attackRange:5,
	  impactRadius:6,
  	spawnDelay:3500,
  	regen:3,
		symbol:"&#x2694;",
		color:"#C00",
		color2:"#620",
		info: "Powerful in a direct assault",
		auraInfo: "Increase invader attack rate",
		passiveAbilityInfo: "Attacks reduce time to next respawn; getting attacked reduces time to next attack",
		activeAbilityInfo: "Charge straight at and attack each tower with increased move speed and damage reduction."
	}
}
const bossUpgradeMultipliersDefault = {
	auraPower:1.03,
	auraRange:1.03,
	abilityDuration:1.03,
	abilityCooldown:.95
}
const bossUpgradeMultipliers = {
	Death:{
		abilityCooldown:.92,
		moveSpeed:1.05,
		impactRadius:1.02
	},
	Famine:{
	  abilityDuration:1.09,
  	spawnDelay:.96,
	  attackRange:1.03
	},
	Pestilence:{
		auraRange:1.05,
  	chainReduction:1.01,
  	attackCharges:1.02
	},
	War:{
	  auraPower:1.09,
	  attackRate:.95,
	  regen:1.02
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
	  impactRadius:0,
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
		attackCharges:0,
		chainReduction:0,
		auraRange:0,
		auraPower:0,
		abilityDuration:0,
		abilityCooldown:0
	},
	War:{
		attackRate:0,
		regen:0,
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
	attackRate:2000,
	attackRange:12,
	projectileSpeed:60,
	moveSpeed:15,
	attackCharges:1,
	canHitAir:1,
	canHitGround:1,
	chainRange:0,
	chainReduction:0,
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
	Cleric:{//heal nearby towers
		projectileType:projectileTypes.blast,
		heroPowerType:heroPowerTypes.Heal,
		impactRadius:15,
		regen:4,
		color:"#DF4",
		color2:"#999",
		symbol:"&#x271d;",
		info:"Heals nearby towers"
	},
	Mage:{//AttackRate/Damage (buff tower/debuff minions) aura
		health:7,
		damage:3,
		attackRate:1000,
		attackRange:20,
		moveSpeed:17,
		attackCharges:2,
		targetCount:2,
		chainRange:20,
		chainReduction:.95,
		projectileType:projectileTypes.beam,
		heroPowerType:heroPowerTypes.AttackBoost,
		color:"#77F",
		color2:"#220",
		symbol:"&#x269a;",
		info: "Boosts nearby towers"
	},
	Knight:{//take less damage with less health
		health:12,
		attackRange:10,
		impactRadius:7,
		projectileType:projectileTypes.ballistic,
		heroPowerType:heroPowerTypes.DamageReduction,
		color:"#F44",
		color2:"#777",
		symbol:"&#x26e8;",
		info: "High armor defender"
	}

}
const heroLevelMultipliersDefault ={
	moveSpeed:1.1,
	attackRate:0.97,
	projectileSpeed:1.05,
	attackRange:1.02,
	impactRadius:1.02,
	attackCharges:1,
	targetCount:1,
	regen:1.2
}
const heroLevelMultipliers = {
	Cleric:{
	  health:1.15,
	  damage:1.1,
		regen:1.2,
		attackRate:.95,
		impactRadius:1.03
	},
	Mage:{
		health:1.1,
		damage:1.15,
		attackRange:1.03,
		attackCharges:1.05,
		targetCount:1.05,
	},
	Knight:{
		health:1.2,
		damage:1.05,
		moveSpeed:1.07,
		impactRadius:1.01
	}
}
