"use strict";

//item name ideas:
  //http://www.medievalwarfare.info/armour.htm
  //http://www.medievalwarfare.info/weapons.htm
  //https://imgur.com/gallery/jMzzk/

//tier
	//color
	//attr count
	//score
		//adjusted by 'rangeAdjustment' on type/item/stat target/stat options
		//adjusted value determines statRange.

//statRange {m,a}
//statTarget {self, minion, all}

//statOption
	//name
		//attribute
		//target [boss,minion,all]
		//rangeType [m|a]
		//rangeAdjustment

//type
	//rangeAdjustment
	//stat
	//drop weight

//statTarget
	//rangeAdjustment
	//dropWeight
	//options
	
//items
	//tier
		//type
			//name
				//rangeAdjustment
				//dropWeight
				// [ statOption ]

const itemType={
	weapon:{
	  name:"weapon",
		rangeAdjustment:3,
		dropWeight:8,
		stat:statTypes.damage
	},
	shield:{
    name:"shield",
    rangeAdjustment:2,
		dropWeight:7,
		stat:statTypes.health
	},
	legs:{
    name:"legs",
		rangeAdjustment:1,
		dropWeight:6,
		stat:statTypes.spawnDelay
	},
	torso:{
    name:"torso",
		rangeAdjustment:0,
		dropWeight:5,
		stat:statTypes.attackRate
	},
	feet:{
    name:"feet",
		rangeAdjustment:-1,
		dropWeight:4,
		stat:statTypes.moveSpeed
	},
	head:{
    name:"head",
		rangeAdjustment:-2,
		dropWeight:3,
		stat:statTypes.attackRange
	},
	trinket:{
    name:"trinket",
		rangeAdjustment:-3,
		dropWeight:2,
		stat:statTypes.auraPower
	},
	ammulet:{
    name:"ammulet",
		rangeAdjustment:-4,
		dropWeight:1,
		stat:statTypes.auraRange
	}
}
const itemTier={
	t0:{
		color:"#999",
		attrCount:0,
		score:0
	},
	t1:{
		color:"#FFF",
		attrCount:0,
		score:1
	},
	t2:{
		color:"#CC0",
		attrCount:1,
		score:2
	},
	t3:{
		color:"#3F3",
		attrCount:1,
		score:3
	},
	t4:{
		color:"#3FF",
		attrCount:1,
		score:4
	},
	t5:{
		color:"#33F",
		attrCount:2,
		score:5
	},
	t6:{
		color:"#F3F",
		attrCount:2,
		score:6
	},
	t7:{
		color:"#F33",
		attrCount:3,
		score:7
	}
}

const items = {
	t0:{//weapon
		weapon:{
			stick:{
				dropWeight:4,
				rangeAdjustment:0
			},
			club:{
				dropWeight:1,
				rangeAdjustment:1
			}
		}
	},
	t1:{//shield
		weapon:{
			staff:{
				dropWeight:4,
				rangeAdjustment:0
			},
			spear:{
				dropWeight:1,
				rangeAdjustment:1
			}
		},
		shield:{
			aspis:{
				dropWeight:1,
				rangeAdjustment:-1
			}
		}
	},
	t2:{//legs
		weapon:{
			dagger:{
				dropWeight:4,
				rangeAdjustment:0
			},
			claws:{
				dropWeight:1,
				rangeAdjustment:1
			}
		},
		shield:{
			buckler:{
				dropWeight:2,
				rangeAdjustment:0
			}
		},
		legs:{
		  breeches:{
				dropWeight:1,
				rangeAdjustment:-1
		  }
		}
	},
	t3:{//torso
		weapon:{
			axe:{
				dropWeight:4,
				rangeAdjustment:0
			},
			kama:{
				dropWeight:1,
				rangeAdjustment:1
			}
		},
		shield:{
			targe:{
				dropWeight:4,
				rangeAdjustment:0
			}
		},
		legs:{
		  chausses:{
				dropWeight:2,
				rangeAdjustment:0
		  }
		},
		torso:{
		  vest:{
				dropWeight:1,
				rangeAdjustment:-1
		  }
		}
	},
	t4:{//feet
		weapon:{
			mace:{
				dropWeight:4,
				rangeAdjustment:0
			},
			flail:{
				dropWeight:1,
				rangeAdjustment:1
			}
		},
		shield:{
			rondache:{
				dropWeight:4,
				rangeAdjustment:0
			}
		},
		legs:{
		  schynbald:{
				dropWeight:4,
				rangeAdjustment:0
		  }
		},
		torso:{
		  brigandine:{
				dropWeight:2,
				rangeAdjustment:0
		  }
		},
		feet:{
			sandals:{
				dropWeight:1,
				rangeAdjustment:-1
			}
		}
	},
	t5:{//head
		weapon:{
			sickle:{
				dropWeight:4,
				rangeAdjustment:0
			},
			scythe:{
				dropWeight:1,
				rangeAdjustment:1
			}
		},
		shield:{
			kiteShield:{
				dropWeight:4,
    		rangeAdjustment:0
			}
		},
		legs:{
		  cuisse:{
				dropWeight:4,
    		rangeAdjustment:0
		  }
		},
		torso:{
		  hauberk:{
				dropWeight:4,
    		rangeAdjustment:0
		  }
		},
		feet:{
			clompers:{
				dropWeight:2,
    		rangeAdjustment:0
			}
		},
		head:{
			cap:{
				dropWeight:1,
    		rangeAdjustment:-1
			}
		}
	},
	t6:{//trink
		weapon:{
			halberd:{
				dropWeight:4,
				rangeAdjustment:0
			},
			glaive:{
				dropWeight:2,
				rangeAdjustment:1
			}
		},
		shield:{
			aegis:{
				dropWeight:4,
    		rangeAdjustment:0
			}
		},
		legs:{
		  tassets:{
				dropWeight:4,
    		rangeAdjustment:0
		  }
		},
		torso:{
		  cuirass:{
				dropWeight:4,
    		rangeAdjustment:0
		  }
		},
		feet:{
			greaves:{
				dropWeight:4,
    		rangeAdjustment:0
			}
		},
		head:{
			coif:{
				dropWeight:2,
    		rangeAdjustment:0
			}
		},
		trinket:{
		  statuette:{
				dropWeight:1,
    		rangeAdjustment:-1
		  }
		}
	},
	t7:{//ammy
		weapon:{
			sword:{
				dropWeight:4,
				rangeAdjustment:0
			},
			greatSword:{
				dropWeight:1,
				rangeAdjustment:1
			}
		},
		shield:{
			towerShield:{
				dropWeight:4,
    		rangeAdjustment:0
			}
		},
		legs:{
		  plateLeggings:{
				dropWeight:4,
    		rangeAdjustment:0
		  }
		},
		torso:{
		  fullPlate:{
				dropWeight:4,
    		rangeAdjustment:0
		  }
		},
		feet:{
			sabaton:{
				dropWeight:4,
    		rangeAdjustment:0
			}
		},
		head:{
			crown:{
				dropWeight:4,
    		rangeAdjustment:0
			}
		},
		trinket:{
		  relic:{
				dropWeight:2,
    		rangeAdjustment:0
		  }
		},
		ammulet:{
		  pendant:{
				dropWeight:1,
    		rangeAdjustment:-1
		  }
		}
	}
}