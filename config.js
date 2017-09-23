var baseMinions = 
{
	pete:{
		hp:10,
		damage:10,
		moveSpeed:3,
		attackDelay:500,
		attackSpeed:2,
		attackRange:2.5,
		spawnDelay:1000,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:1,
		color:'#0F0'
	},
	tanker:{
		hp:100,
		damage:0,
		moveSpeed:1,
		attackDelay:10000,
		attackSpeed:1,
		attackRange:0,
		spawnDelay:10000,
		lastSpawn:0,
		isFlying:0,
		isUnlocked:0,
		color:'#0FF'
	},
	swarmer:{
		hp:5,
		damage:2,
		moveSpeed:5,
		attackDelay:500,
		attackSpeed:5,
		attackRange:1.5,
		spawnDelay:300,
		lastSpawn:0,
		isFlying:1,
		isUnlocked:0,
		color:'#00F'
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
		attackDelay:200,
		attackSpeed:3,
		attackRange:4,
		attackCharges:0,
		chainRange:0,
		chainDamageReduction:0,
		splashRadius:1,
		splashDamageReduction:0,
		canHitAir:1,
		catHitGround:1,
		color:'#F0F'
	},
	lightning:{
		hp:25,
		damage:5,
		attackDelay:100,
		attackSpeed:100,
		attackRange:3,
		attackCharges:5,
		chainRange:9,
		chainDamageReduction:.7,
		splashRadius:1,
		splashDamageReduction:0,
		canHitAir:1,
		catHitGround:0,
		color:'#FF0'
	},
	bomb:{
		hp:25,
		damage:5,
		attackDelay:2000,
		attackSpeed:2,
		attackRange:2,
		attackCharges:0,
		chainRange:0,
		chainDamageReduction:0,
		splashRadius:9,
		splashDamageReduction:.5,
		canHitAir:0,
		catHitGround:1,
		color:'#F00'
	}
}

var towerLevelMultipliers =
{
	shooter:{
		hp:1.2,
		damage:1.2,
		attackDelay:1.2,
		attackRange:1.1,
		attackCharges:0,
		chainRange:0,
		chainDamageReduction:0,
		splashRadius:0,
		splashDamageReduction:0
	},
	lightning:{
		hp:1.2,
		damage:1.2,
		attackDelay:1.2,
		attackRange:1.1,
		attackCharges:1.05,
		chainRange:1.05,
		chainDamageReduction:1.1,
		splashRadius:0,
		splashDamageReduction:0
	},
	bomb:{
		hp:1.2,
		damage:1.2,
		attackDelay:1.2,
		attackRange:1.1,
		attackCharges:0,
		chainRange:0,
		chainDamageReduction:0,
		splashRadius:1.05,
		splashDamageReduction:1.1
	}
}