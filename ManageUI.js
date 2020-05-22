function toggleP1(btn, input){
	var e = document.getElementsByClassName('mnuSelected');
	for(var i=0;i<e.length; i++){e[i].classList.remove('mnuSelected');}

	e = document.getElementsByClassName('p1BlockChild');
	for(var i=0;i<e.length; i++){e[i].style.display='none';}

	btn.classList.toggle('mnuSelected');
	document.getElementById(input).style.display='flex';
}

function showRangeMinion(){ return document.getElementById("chkRangeMinion").checked; }
function showRangeBoss(){ return document.getElementById("chkRangeBoss").checked; }
function showRangeTower(){ return document.getElementById("chkRangeTower").checked; }
function showRangeHero(){ return document.getElementById("chkRangeHero").checked; }
function showReloadMinion(){ return document.getElementById("chkReloadMinion").checked; }
function showReloadBoss(){ return document.getElementById("chkRangeBoss").checked; }
function showReloadTower(){ return document.getElementById("chkRangeTower").checked; }
function showReloadHero(){ return document.getElementById("chkRangeHero").checked; }
function showHealthMinion(){ return document.getElementById("chkHealthMinion").checked; }
function showHealthBoss(){ return document.getElementById("chkHealthBoss").checked; }
function showHealthTower(){ return document.getElementById("chkHealthTower").checked; }
function showHealthHero(){ return document.getElementById("chkHealthHero").checked; }
function showDamageMinion(){ return document.getElementById("chkDamageMinion").checked; }
function showDamageBoss(){ return document.getElementById("chkDamageBoss").checked; }
function showDamageTower(){ return document.getElementById("chkDamageTower").checked; }
function showDamageHero(){ return document.getElementById("chkDamageHero").checked; }

function showFPS(){ return document.getElementById("chkShowFPS").checked; }
function GetQuality(){ return document.getElementById("ddlQuality").value; }
function autoSave(){ return document.getElementById("chkAutoSave").checked; }

function yesCookies(){
	cookiesEnabled = 1;
	document.getElementById("divCookies").style.display = "none";
}
function noCookies(){
	cookiesEnabled = 0;
	document.getElementById("divCookies").style.display = "none";
}

var resizerDelay;
function resize(){
	clearTimeout(resizerDelay);
	resizerDelay = setTimeout(calcSize, 200);
}
function calcSize(){
	stop();
	
	var a = Math.max(document.documentElement.clientWidth);
	var b = Math.max(document.documentElement.clientHeight)*2.4;
	var maxD = Math.min(a, b) - 10;
	//breaks if it gets too small.
	maxD = Math.max(maxD, 200);
	
	//get canvas new size
	var newGameW = maxD;
	var newGameH = maxD/6;
	
	//get x,y ratios
	var dy = newGameH / gameH;
	var dx = newGameW / gameW;
	
	//adjust all path x,y by ratios
	for(var i=0;i<path.length;i++) {
		path[i].x *= dx;
		path[i].y *= dy;
	}
	
	//adjust all minion x,y by ratios
	for(var i=0;i<minions.length;i++) {
		minions[i].Location.x *= dx;
		minions[i].Location.y *= dy;
	}

	//adjust all tower x,y by ratios
	for(var i=0;i<towers.length;i++) {
		towers[i].Location.x *= dx;
		towers[i].Location.y *= dy;
	}
	
	//fix hero home/current location.
	hero.home.x *= dx;
	hero.home.y *= dy;
	hero.Location.x *= dx;
	hero.Location.y *= dy;

	//adjust all projectile x,y by ratios
	for(var i=0;i<projectiles.length;i++) {
		projectiles[i].Location.x *= dx;
		projectiles[i].Location.y *= dy;

		projectiles[i].target.x *= dx;
		projectiles[i].target.y *= dy;
		
		projectiles[i].Resize(dx, dy);
	}
		
	for(var i=0; i<impacts.length;i++){
		impacts[i].Location.x *= dx
		impacts[i].Location.y *= dy
	}
		
	//set canvas new size
	gameW = newGameW;
	gameH = newGameH;
	halfH = gameH>>1;
	langoliers = -(gameW<<1);
	pathL = (gameW>>6)*1;
	pathW = (gameH>>4)*1;
	
	halfH = gameH>>1;
	leaderPoint = gameW * 2 / 5;
	pathL = (gameW>>6);
	pathW = (gameH>>4);
	langoliers = pathL*-2;
	
	var drawArea = document.getElementById('canvasArea');
	drawArea.style.width = gameW;
	drawArea.style.height = gameH;
	drawArea.width = gameW;
	drawArea.height = gameH;
	ctx = drawArea.getContext('2d');


	//Resize other panels.	
	document.getElementById("pnl0").style.height = gameH;
	
	start();
}
