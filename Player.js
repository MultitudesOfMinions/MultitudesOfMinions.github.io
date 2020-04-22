//testing for saved upgrades etc..., will override config.js values
var gameState = {
	minionResearch:{
		Dozer:{ isUnlocked:0 },
		Dart:{ isUnlocked:0 }
	},
	minionUpgrades:{
			Drone:{ hp:0, damage:0, moveSpeed:0, attackRate:0, projectileSpeed:0, attackRange:0, spawnDelay:0, lastSpawn:0 },
			Dozer:{ hp:0, damage:0, moveSpeed:0, attackRate:0, projectileSpeed:0, attackRange:0, spawnDelay:0, lastSpawn:0 },
			Dart:{ hp:0, damage:0, moveSpeed:0, attackRate:0, projectileSpeed:0, attackRange:0, spawnDelay:0, lastSpawn:0 },
	},
	gauges:{ range:0, reload:0, hp:0, dmg:0 },
	maxMinions:0,
	resources:{ 0:0, 1:0, 2:0 },
	level:0
}
