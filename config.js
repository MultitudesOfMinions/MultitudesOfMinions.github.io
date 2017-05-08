var baseMinions = 
{
	pete:{
		hp:10,
		damage:10,
		moveSpeed:1,
		attackSpeed:10,
		attackRange:7,
		spawnRate:1,
		isFlying:0,
		isUnlocked:1
	},
	tanker:{
		hp:100,
		damage:0,
		moveSpeed:5,
		attackSpeed:0,
		attackRange:-1,
		spawnRate:1,
		isFlying:0,
		isUnlocked:0
	},
	swarmer:{
		hp:5,
		damage:2,
		moveSpeed:15,
		attackSpeed:20,
		attackRange:3,
		spawnRate:3,
		isFlying:1,
		isUnlocked:0
	}
}

var minionUpgrades = {
	puncher:{
		minionTypes:['pete','swarmer'],
		attribute:'damage',
		bonus:1,
		isPurchased:0
	},
	runner:
	{
		minionTypes:['pete','tanker'],
		attribute:'moveSpeed',
		bonus:1,
		isPurchased:0
	}
}

var baseTowers =
{
	shooter:{
		hp:25,
		damage:5,
		attackSpeed:5,
		attackRange:25,
		chainCount:0,
		chainRange:-1,
		chainDamageReduction:0,
		splashRadius:-1,
		splashDamageReduction:0,
		canHitAir:1,
		catHitGround:1
	},
	lightning:{
		hp:25,
		damage:5,
		attackSpeed:5,
		attackRange:25,
		chainCount:5,
		chainRange:9,
		chainDamageReduction:.7,
		splashRadius:-1,
		splashDamageReduction:0,
		canHitAir:1,
		catHitGround:0
	},
	bomb:{
		hp:25,
		damage:5,
		attackSpeed:5,
		attackRange:25,
		chainCount:0,
		chainRange:-1,
		chainDamageReduction:0,
		splashRadius:9,
		splashDamageReduction:.5,
		canHitAir:0,
		catHitGround:1
	}
}

var towerLevelMultipliers =
{
	shooter:{
		hp:1.2,
		damage:1.2,
		attackSpeed:1.2,
		attackRange:1.1,
		chainCount:0,
		chainRange:0,
		chainDamageReduction:0,
		splashRadius:0,
		splashDamageReduction:0,
	},
	lightning:{
		hp:1.2,
		damage:1.2,
		attackSpeed:1.2,
		attackRange:1.1,
		chainCount:1.05,
		chainRange:1.05,
		chainDamageReduction:1.1,
		splashRadius:0,
		splashDamageReduction:0,
	},
	bomb:{
		hp:1.2,
		damage:1.2,
		attackSpeed:1.2,
		attackRange:1.1,
		chainCount:0,
		chainRange:0,
		chainDamageReduction:0,
		splashRadius:1.05,
		splashDamageReduction:1.1,
	}
}