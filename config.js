var baseMinions = 
{
	pete:{
		hp:10,
		damage:10,
		moveSpeed:1,
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
		moveSpeed:.2,
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
		moveSpeed:1,
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
		attackRange:2.5,
		attackCharges:0,
		splashRadius:.2,
		canHitAir:1,
		catHitGround:1,
		color:'#F0F'
	},
	lightning:{
		hp:15,
		damage:3,
		attackDelay:100,
		attackSpeed:10,
		attackRange:4,
		attackCharges:1,
		splashRadius:.1,
		canHitAir:1,
		catHitGround:0,
		color:'#FF0'
	},
	bomb:{
		hp:40,
		damage:10,
		attackDelay:2000,
		attackSpeed:1.5,
		attackRange:2.3,
		attackCharges:0,
		splashRadius:.5,
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
		attackDelay:.95,
		attackSpeed:1.1,
		attackRange:1.1,
		attackCharges:0,
		splashRadius:1
	},
	lightning:{
		hp:1.2,
		damage:1.2,
		attackDelay:.95,
		attackSpeed:1.1,
		attackRange:1.1,
		attackCharges:1.05,
		splashRadius:1
	},
	bomb:{
		hp:1.2,
		damage:1.2,
		attackDelay:.95,
		attackSpeed:1.1,
		attackRange:1.1,
		attackCharges:0,
		splashRadius:1.05
	}
}