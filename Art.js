"use strict";
//draw images
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  //need to use png with transparent background (look into gimp or something for making them)
//save() saves the current canvas state
//restore() restores the saved canvas state

//https://www.patrick-wied.at/blog/how-to-create-transparency-in-images-with-html5canvas


function drawPath(){
  ctx.save();
	if(Quality>=2 && !isColorblind()){
		const rad = pathW * .7;
		
		const rOpt = ['9','A','A','B','C'];
		const gOpt = ['9','8','7'];
		const bOpt = ['4','5'];
		
		for(let i=1;i<path.length;i++){
		  const j = i+totalPaths;
		  const r = rOpt[j%rOpt.length];
		  const g = gOpt[j%gOpt.length];
		  const b = bOpt[j%bOpt.length];
		  
			ctx.fillStyle='#'+r+g+b+"7";
			ctx.beginPath();
			ctx.ellipse(path[i].x, path[i].y, pathW, rad, 0, 0, Math.PI*2)
			ctx.fill();
		}
	}
	
	ctx.beginPath();
	ctx.lineWidth = pathW;
	ctx.strokeStyle ="#B85F";
	if(isColorblind()){
		ctx.strokeStyle = GetColorblindColor();
		ctx.lineWidth = 1;
	}
	
	ctx.moveTo(path[0].x, path[0].y);
	for(let i=1;i<path.length;i++){
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.stroke();
	ctx.closePath();

	drawHUD();
	ctx.restore();
}
function drawHUD(){
	const y = getPathYatX(leaderPoint);
	
	ctx.strokeStyle = "#F003";
	if(isColorblind()){
		ctx.strokeStyle = GetColorblindColor();
	}

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(leaderPoint, y - (pathW/2));
	ctx.lineTo(leaderPoint, y + (pathW/2));
	ctx.stroke();
	
	const y2 = getPathYatX(leaderPoint*2);
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(leaderPoint*2, y2 - (pathW/2));
	ctx.lineTo(leaderPoint*2, y2 + (pathW/2));
	ctx.stroke();
	
	if(getUIElement("divBossArea").style.display != "none"){
		const p = getBossMoveTarget();

		ctx.moveTo(p.x, 0);
		ctx.lineTo(p.x, pathW);
		ctx.moveTo(p.x-pathW/4,pathW/2);
		ctx.lineTo(p.x, pathW);
		ctx.lineTo(p.x+pathW/4,pathW/2);
		
		ctx.stroke();
		
		if(boss){
  		const color = isColorblind() ? GetColorblindColor() : boss.color;
  		ctx.beginPath();
  		ctx.fillStyle=color;
  		ctx.font = "bold 20pt Arial"
  		const size = ctx.measureText(boss.symbol);
  		ctx.fillText(boss.symbol, p.x-(size.width/2), 20);
  		ctx.font = "bold 12pt Arial"
		}
	}
	ctx.closePath();
}

function drawLevelEnd(){
	const Scale = getScale()*3/4;
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = Scale;
	const y2 = gameH - y1;

	ctx.lineWidth = Scale;

	const c1 = "#333";
	const c2 = "#555";
	const c3 = "#777";
	const c4 = "#999";

	drawVWall(Scale, x1, y1, y2, c2, c1);
	drawHWall(Scale, y1, x1, x2, c3, c2);
	drawHWall(Scale, y2, x1, x2, c3, c2);
	drawVWall(Scale, x2, y1, y2, c4, c3);
	
	const gateY = getPathYatX(x1-Scale);
	drawGate(Scale*2, x1-Scale, gateY, c2, c1);

	const c5 = isColorblind()? GetColorblindBackgroundColor() : "#444";
	const c6 = isColorblind()? GetColorblindColor() : "#666";
	const c7 = isColorblind()? GetColorblindBackgroundColor() : "#888";

	drawParapet(x1,y1,Scale,c6,c5);
	drawParapet(x1,y2,Scale,c6,c5);
	drawParapet(x2,y1,Scale,c7,c6);
	drawParapet(x2,y2,Scale,c7,c6);
	
	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawLevelFlag(x1,y2,level, color1, color2);
	if(Quality<2){return;}
	drawLevelFlag(x1,y1,level, color1, color2);
	drawLevelFlag(x2,y1,level, color1, color2);
	drawLevelFlag(x2,y2,level, color1, color2);


}
function drawVWall(width, x, y1, y2, color1, color2){
	if(isColorblind()){return;}

	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x, y1);
	ctx.lineTo(x, y2);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality<2){return;}
	
	const brickWidth = width / 8;
	const brickHeight = brickWidth * 1.625;
	const wallX = x - brickWidth * 5;
	let brickY = y1;
	ctx.beginPath();
	ctx.fillStyle = color2;
	while(brickY < y2){
		ctx.fillRect(wallX+brickWidth*2, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*4, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*6, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*8, brickY, brickWidth, brickHeight);
		brickY += brickHeight;

		if(brickY > y2){ break;}

		ctx.fillRect(wallX+brickWidth*1, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*3, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*5, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*7, brickY, brickWidth, brickHeight);
		ctx.fillRect(wallX+brickWidth*9, brickY, brickWidth, brickHeight);

		ctx.fillRect(wallX+brickWidth*10-1, brickY-brickHeight/4, brickWidth, brickHeight*1.5);
		brickY += brickHeight;
	}
}
function drawHWall(width, y, x1, x2, color1, color2){
	if(isColorblind()){return;}
	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x1, y);
	ctx.lineTo(x2, y);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality<2){return;}
	
	const brickHeight = width / 8;
	const brickWidth = brickHeight * 1.625;
	const wallY = y + brickHeight * 3;
	let brickX = x1;
	ctx.beginPath();
	ctx.fillStyle = "#222";
	while(brickX < x2){
		ctx.fillRect(brickX, wallY-brickHeight*0, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*2, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*4, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*6, brickWidth, brickHeight);

		brickX += brickWidth;
		if(brickX > x2){ break;}
		ctx.fillRect(brickX, wallY-brickHeight*1, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*3, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*5, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*7, brickWidth, brickHeight);
		brickX += brickWidth;
	}
}
function drawParapet(x, y, r, color1, color2){
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.arc(x,y,r,0,twoPi);
	ctx.fill();
	
	if(Quality<2){return;}

	const width = r/8;
	ctx.lineWidth = width;
	ctx.strokeStyle = color2;
	ctx.moveTo(x+width,y);
	ctx.arc(x,y,width*1,0,twoPi);
	ctx.moveTo(x+width*3,y);
	ctx.arc(x,y,width*3,0,twoPi);
	ctx.moveTo(x+width*5,y);
	ctx.arc(x,y,width*5,0,twoPi);
	ctx.moveTo(x+width*7,y);
	ctx.arc(x,y,width*7,0,twoPi);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x,y+r);
	ctx.lineTo(x,y-r);
	ctx.moveTo(x+r,y);
	ctx.lineTo(x-r,y);
	ctx.stroke();
	
	const r1 = r * 3 / 4;
	const r2 = r1 / 2;
	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x+r1,y+r1);
	ctx.lineTo(x+r2,y+r2);
	
	ctx.moveTo(x+r1,y-r1);
	ctx.lineTo(x+r2,y-r2);

	ctx.moveTo(x-r1,y+r1);
	ctx.lineTo(x-r2,y+r2);

	ctx.moveTo(x-r1,y-r1);
	ctx.lineTo(x-r2,y-r2);
	ctx.stroke();
	
	
}
function drawGate(width, x, y, color1, color2){
	if(isColorblind()){return;}
  
  width*=2
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.fillRect(x,y-width/2,width/2,width);
	
	if(Quality>=2){
		
		const brickWidth = width / 24;
		const brickHeight = brickWidth * 1.625;
		const wallX = x - brickWidth;
		const y1 = y-width/2
		const y2 = y1 + width;

		let brickY = y1;
		ctx.beginPath();
		ctx.fillStyle = color2;
		while(brickY < y2){
		  for(let i=2;i<14;i+=2){
  			ctx.fillRect(wallX+brickWidth*i, brickY, brickWidth, brickHeight);
		  }
			brickY += brickHeight;

			if(brickY > y2){ break;}
		  for(let i=1;i<14;i+=2){
  			ctx.fillRect(wallX+brickWidth*i, brickY, brickWidth, brickHeight);
		  }

			ctx.fillRect(wallX+brickWidth*14-1, brickY-brickHeight/4, brickWidth, brickHeight*1.5);
			brickY += brickHeight;
		}
	}
	
	ctx.beginPath();
	ctx.fillStyle = "#000";
	const doorW = width/2;
  const doorH = doorW/2;
	ctx.fillRect(x,y-doorW/2,doorH,doorW);
	ctx.arc(x+doorH-1,y,doorH,-halfPi,halfPi);
	ctx.fill();
	
}
function drawLevelFlag(x,y,level,color1,color2){
  const scale = getScale()*3/4;
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.font = "bold "+(scale/2-3)+"pt Arial"
	const height = scale /2;
	const width = ctx.measureText(level).width * 2;

	const pennonX = x+2;
	const pennonY = y-height*3;
	const pennonL = width*1.5;
	const pennonH = height / 2;
	ctx.beginPath();
	ctx.fillRect(pennonX, pennonY+height/2, width, height);
	ctx.fillStyle = color1;
	ctx.moveTo(pennonX,pennonY);
	ctx.lineTo(pennonX+pennonL,pennonY+pennonH)
	ctx.lineTo(pennonX,pennonY+pennonH*2)
	ctx.lineTo(pennonX+pennonL,pennonY+pennonH*3)
	ctx.lineTo(pennonX,pennonY+pennonH*4)
	ctx.fill();
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color2;
	ctx.moveTo(x, y);
	ctx.lineTo(x, pennonY-1);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle= color2;
	ctx.fillText(level, pennonX + width/4, pennonY + pennonH*3);
	ctx.closePath();
}

function drawRuins(){
	if(+level <= 0){return;}

  const scale = getScale()*3/4;
	const x1 = levelStartX - endZoneW();
	const x2 = levelStartX;
	const y = gameH - scale;
	const width = scale;

	ctx.lineWidth = width;

	const c1 = "#333";
	const c2 = "#555";
	const c3 = "#E53";
	const c4 = "#EB2"

	drawRuinsWall(width, y, x1, x2, c1, c3);
	
	const flagColor = "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawLevelFlag(x2,y,+level-1, color1, color2);
}
function drawRuinsWall(width, y, x1, x2, color1, color2){
	if(isColorblind()){return;}
	ctx.beginPath();
	ctx.strokeStyle = color1;
	ctx.moveTo(x1, y);
	ctx.lineTo(x2, y);
	ctx.stroke();
	ctx.closePath();
	
	if(Quality<2){return;}
	
	const brickHeight = width / 8;
	const brickWidth = brickHeight * 1.625;
	const wallY = y + brickHeight * 3;
	let brickX = x1;
	ctx.beginPath();
	ctx.fillStyle = "#222";
	while(brickX < x2){
		ctx.fillRect(brickX, wallY-brickHeight*0, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*2, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*4, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*6, brickWidth, brickHeight);

		brickX += brickWidth;
		if(brickX > x2){ break;}
		ctx.fillRect(brickX, wallY-brickHeight*1, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*3, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*5, brickWidth, brickHeight);
		ctx.fillRect(brickX, wallY-brickHeight*7, brickWidth, brickHeight);
		brickX += brickWidth;
	}
}

function draw(){
	//Refresh background
	ctx.fillStyle=GetStyleColor();
	ctx.fillRect(0,0, gameW, gameH);
	if(Quality == 0){return;}
	
	drawPath();
	drawLevelEnd();
	drawRuins();
	
	drawTowers();
	drawBoss();
	drawMinions();
	drawHero();

	ctx.globalAlpha = .2;
	drawHeroAura();
	drawBossAura();
	ctx.globalAlpha = 1;

	drawProjectiles();
	ctx.globalAlpha = .5;
	drawImpacts();
	ctx.globalAlpha = 1;
}

