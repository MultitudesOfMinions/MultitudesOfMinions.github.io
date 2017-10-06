function point(x, y){ this.x = x||0; this.y = y||0; }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//P=point to check, C=center of ellipse, Rx is x radius, Ry is y radius
function isInEllipse(P, C, Rx, Ry){
	Rx = Rx**2;
	Ry = Ry**2;
	var a = Ry*((P.x - C.x)**2);
	var b = Rx*((P.y - C.y)**2);
	var c = Rx * Ry;
	return a+b<=c;
}

function buy(type){
	switch(type){
		case 'Prestige':
			var cost = 100;
			if(resource >= cost){
				document.getElementById('pnl2').style.display='block';
				pResource += totalD;//TODO: figure out actual pResource gain formula
				resource = 0;
				buildWorld();
			}
			break;
		case 'MaxMinions':
			var cost = maxMinions**2 * 10;
			if(pResource >= cost){
				pResource -= cost;
				maxMinions++;
				
				document.getElementById("btnBuyMaxMinions").innerHTML = "Max Minions++ (" + (maxMinions**2 * 10) + ")";
			}
			break;
		case 'UnlockSwarmer':
			var cost = 100;
			if(pResource >= cost){
				pResource -= cost;
				
				baseMinions['swarmer'].isUnlocked=1;
				document.getElementById("btnUnlockSwarmer").style.display='none';
			}
			break;
		case 'UnlockTank':
			var cost = 100;
			if(pResource >= cost){
				pResource -= cost;

				baseMinions['tanker'].isUnlocked=1;
				document.getElementById("btnUnlockTank").style.display='none';
			}
			break;
		case 'ShowRange':
			var cost = 10;
			if(pResource >= cost){
				pResource -= cost;
				document.getElementById("buyShowRange").style.display='none';
				document.getElementById("divShowRange").style.display='block';
			}
			break;
		case 'ShowReload':
			var cost = 10;
			if(pResource >= cost){
				pResource -= cost;
				document.getElementById("buyShowReload").style.display='none';
				document.getElementById("divShowReload").style.display='block';
			}
			break;
		case 'ShowHP':
			var cost = 10;
			if(pResource >= cost){
				pResource -= cost;
				document.getElementById("buyShowHP").style.display='none';
				document.getElementById("divShowHP").style.display='block';
			}
			break;
		case 'ShowDMG':
			var cost = 10;
			if(pResource >= cost){
				pResource -= cost;
				document.getElementById("buyShowDMG").style.display='none';
				document.getElementById("divShowDMG").style.display='block';
			}
			break;
		case '':
			break;
	}
	
}

