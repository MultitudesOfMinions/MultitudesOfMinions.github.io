//testing for saved upgrades etc..., will override config.js values
var gameState = {
	minionResearch:{
		Tank:{ isUnlocked:0 },
		Swarmer:{ isUnlocked:0 }
	},
	minionUpgrades:{
			Grunt:{ hp:0, damage:0, moveSpeed:0, attackRate:0, projectileSpeed:0, attackRange:0, spawnDelay:0, lastSpawn:0, },
			Tank:{ hp:0, damage:0, moveSpeed:0, attackRate:0, projectileSpeed:0, attackRange:0, spawnDelay:0, lastSpawn:0, },
			Swarmer:{ hp:0, damage:0, moveSpeed:0, attackRate:0, projectileSpeed:0, attackRange:0, spawnDelay:0, lastSpawn:0, },
	},
	indicators:{ range:0, reload:0, hp:0, dmg:0 },
	maxMinions:1,
	resources:{ 0:0, 1:0, 2:0 },
	level:0
}
