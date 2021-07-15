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
  ctx.save();
  const age = achievements.maxLevelCleared.maxCount % 4;//TODO: for now just loop through, maybe figure out a torment style ending
  
  switch(age){
    case 0:
      drawTentEnd();
      break;
    case 1:
      drawCabinEnd();
      break;
    case 2:
      drawFortEnd();
      break;
    case 3:
      drawCastleEnd();
      break;
  }
  ctx.restore();
}

function drawTentEnd(){
	const Scale = getScale()*3/4;
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = Scale;
	const y2 = gameH - (y1*1.5);
	
	const c1 = isColorblind() ? "#555" :  "#950";
	const c2 = isColorblind() ? "#777" :  "#B71";
	const c3 = "#000";

	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawLevelFlag(x1,y2,level, color1, color2);
	drawTent(x1, y2-5, [c1, c2, c3]);
	
	const y3 = getPathYatX(x2)-(pathW/3)
	drawTent(x2, y3, [c1, c2, c3]);
	
	if(Quality<2){return;}
	drawLevelFlag(x1,y1,level, color1, color2);
	drawLevelFlag(x2,y1,level, color1, color2);
	drawLevelFlag(x2,y2,level, color1, color2);
	drawTent(x1, y1-5, [c1, c2, c3]);
	drawTent(x2, y1-5, [c1, c2, c3]);
	drawTent(x2, y2-5, [c1, c2, c3]);


}
function drawTent(x, y, colors){
  
  const tentH = getScale();
  const tentW = getScale()/2;
  const doorH = tentH/2;
  const doorW = tentW/4;
  
  //front
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-tentW,y+tentH);
  ctx.lineTo(x+tentW,y+tentH);
  ctx.closePath();
  ctx.fill();
  
  //side
  ctx.fillStyle = colors[1];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+tentW,y+(tentH*.1));
  ctx.lineTo(x+(tentW*2),y+(tentH*.9));
  ctx.lineTo(x+tentW,y+tentH);
  ctx.closePath();
  ctx.fill();
  
  //door
  ctx.fillStyle = colors[2];
  ctx.beginPath();
  ctx.moveTo(x,y+doorH);
  ctx.lineTo(x-doorW,y+tentH-1);
  ctx.lineTo(x+doorW,y+tentH-1);
  ctx.closePath();
  ctx.fill();
}

function drawCabinEnd(){
	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawLevelFlag(x1,y2,level, color1, color2);

	if(Quality<2){return;}
	drawLevelFlag(x1,y1,level, color1, color2);
	drawLevelFlag(x2,y1,level, color1, color2);
	drawLevelFlag(x2,y2,level, color1, color2);

  
}
function drawCabin(x, y, colors){
  //make rectangles
    //fill light brown
    //stroke dark brown
  //make a roof
}

function drawFortEnd(){
	const Scale = getScale()*3/4;
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = Scale;
	const y2 = gameH - y1;

  
  //TODO: make some type of wood fort.
  
  
	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawLevelFlag(x1,y2,level, color1, color2);
	if(Quality<2){return;}
	drawLevelFlag(x1,y1,level, color1, color2);
	drawLevelFlag(x2,y1,level, color1, color2);
	drawLevelFlag(x2,y2,level, color1, color2);

}

function drawCastleEnd(){
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

	drawVWall(x1, y1, [c2, c1]);
	drawHWall(x1, y1, [c3, c2]);
	drawHWall(x1, y2, [c3, c2]);
	drawVWall(x2, y1, [c4, c3]);
	
	drawGate(x1,[c2,c3]);

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
function drawVWall(x, y, colors){
	if(isColorblind()){return;}
  const wallHeight=getScale();
  const wallWidth=gameH-(2*y);
	if(Quality<2){
  	ctx.beginPath();
  	ctx.strokeStyle = colors[0];
  	ctx.moveTo(x, y);
  	ctx.lineTo(x, y+wallWidth);
  	ctx.stroke();
  	ctx.closePath();
	  return;
	}
	
	const rows = 8;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	const wallX = x-(wallHeight/2);
	const wallY = y+wallWidth;
	
	ctx.beginPath();
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      ctx.fillStyle= colors[(i+j)%colors.length];
      const bx = wallX+(j*brickHeight);
      const by = wallY-brickWidth*i;
      ctx.fillRect(bx, by, brickHeight+1, brickWidth+1);
    }
  }
  for(let i=1;i<cols;i+=2){
    const bx = wallX+(rows*brickHeight);
    const by = wallY-brickWidth*i;
    ctx.fillRect(bx, by, brickHeight+1, brickWidth);
    ctx.fillRect(bx+brickHeight, by-(brickWidth/4), brickHeight+1, brickWidth*1.5);
  }
	ctx.fillStyle="#F00";
	ctx.fillRect(wallX, wallY, 10, 10);
	

	ctx.closePath();
}
function drawHWall(x, y, colors){
	if(isColorblind()){return;}
  const wallHeight=getScale();
  const wallWidth=endZoneW();

	if(Quality<2){
  	ctx.beginPath();
  	ctx.strokeStyle = colors[0];
  	ctx.moveTo(x, y);
  	ctx.lineTo(x+wallWidth, y);
  	ctx.stroke();
  	ctx.closePath();
	  return;
	}
	
	const rows = 8;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	const wallX = x;
	const wallY = y+(wallHeight/2);

	ctx.beginPath();
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      ctx.fillStyle= colors[(i+j)%colors.length];
      const bx = wallX+(brickWidth*i);// (j*brickHeight);
      const by = wallY-(j*brickHeight);// brickWidth*i;
      ctx.fillRect(bx, by, brickWidth+1, brickHeight+1);
    }
  }
	ctx.closePath();
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
function drawGate(x, colors){
	if(isColorblind()){return;}
  
  const wallHeight=getScale()*2;
  let wallWidth=pathW*1.4;
  
	ctx.beginPath();
	const rows = 16;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	wallWidth=cols*brickWidth;
	const wallX = x-(wallHeight/2);
	const wallY = getPathYatX(wallX)-(wallWidth/2);
	
	if(Quality>=2){

		ctx.beginPath();
    for(let i=0;i<cols;i++){
      for(let j=0;j<rows;j++){
        ctx.fillStyle= colors[(i+j)%colors.length];
        const bx = wallX+(j*brickHeight);
        const by = wallY+brickWidth*i;
        ctx.fillRect(bx, by, brickHeight+1, brickWidth+1);
      }
    }
    for(let i=0;i<cols;i+=2){
      const bx = wallX+(rows*brickHeight);
      const by = wallY+brickWidth*i;
      ctx.fillRect(bx, by, brickHeight+1, brickWidth);
      ctx.fillRect(bx+brickHeight, by-(brickWidth/4), brickHeight+1, brickWidth*1.5);
    }
	  ctx.closePath();
	}
	
	ctx.beginPath();
	ctx.fillStyle = "#000";
	const doorW = wallWidth*3/4;
  const doorH = doorW/2;
  const doorX = x-(wallHeight/2);
  const doorY = getPathYatX(doorX)-(doorW/2);
	ctx.fillRect(doorX,doorY,doorH,doorW);
	ctx.arc(doorX+doorH-1,doorY+(doorW/2),doorH,-halfPi,halfPi);
	ctx.fill();
}
function drawLevelFlag(x,y,level,color1,color2){
  const scale = getScale()/2;
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.font = "bold "+(scale/2-3)+"pt Arial"
	const height = scale/2;
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
	ctx.lineTo(pennonX+width,pennonY+pennonH*2)
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

function drawImperialEnd(){
  
}

function drawRuins(){
  const age = achievements.maxLevelCleared.maxCount;
  
  switch(age){
    case 0:
      drawTentRuins();
      break;
    case 1:
      drawCabinRuins();
      break;
    case 1:
      drawFortRuins();
      break;
    case 2:
      drawCastleRuins();
      break;
    case 3:
      drawImperialRuins();
      break;
  }

}

function drawTentRuins(){
	if(+level <= 0){return;}

  const scale = getScale()*3/4;
	const x = levelStartX;
	const y = gameH - scale;

	drawLevelFlag(x,y-(scale/2),+level-1, "#777", "#000");
}

function drawCabinRuins(){
  
}

function drawFortRuins(){
	if(+level <= 0){return;}
  
}

function drawCastleRuins(){
	if(+level <= 0){return;}

  const scale = getScale()*3/4;
	const x = levelStartX;
	const y = gameH - scale;

	drawRuinsWall(x, y);
	
	drawLevelFlag(x,y-(scale/2),+level-1, "#777", "#000");
}

function drawImperialRuins(){
  
  
}

const brickColor = function(row,col){

  const a = "#222F";
  const b = "#333F";
  const c = "#555F";
  const d = "#666F";
  const e = "#888F";

  const f = "#FFF0";
  
  const colors = [[a,b,c,b,c,b,a],//0
                [c,d,a,b,d,a,b,d],//1
                [b,d,e,c,e,c,e,b],//2
                [c,d,e,d,e,c,e,d],//3
                [d,e,f,c,d,e,f,c],//4
                [d,e,f,d,e,d,f,e],//5
                [d,f,e,f,d,e,f,e],//6
                [f,e,f,e,f,f,e,f]];//7
  const i = Math.min(colors.length, row);
  const opts = colors[i];
  
  const out = opts[col%opts.length];
  return out;
}
function drawRuinsWall(x, y){
	if(isColorblind()){return;}
	const wallWidth = endZoneW();
	const wallHeight = getScale();
	if(Quality<2){
  	ctx.lineWidth = wallHeight;
	  ctx.beginPath();
  	ctx.strokeStyle = "#333";
  	ctx.moveTo(x-wallWidth, y);
  	ctx.lineTo(x, y);
  	ctx.stroke();
  	ctx.closePath();
	  return;
	}
	
	const rows = 8;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	const wallY = y + brickHeight * 3;
	const wallX = x - wallWidth;

	ctx.beginPath();
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      ctx.fillStyle=brickColor(j,i*(j+level+1));
      const bx = wallX+(i*brickWidth);
      const by = wallY-brickHeight*j;
      ctx.fillRect(bx, by, brickWidth, brickHeight);
    }
  }
}

//TODO: if Quality is HIGH do some fancy drawings
const drawMinions=function(){
	for(let i=0;i<minions.length;i++){
		minions[i].Draw();
	}
}
const drawBoss=function(){
	if(boss && boss.health >= 0){
		boss.Draw();
	}
}
const drawTowers=function() {
	for(let i=0;i<towers.length;i++){
		towers[i].Draw();
	}
}
const drawHero=function(){
	if(hero && hero.health >= 0){
		hero.Draw();
	}
	if(squire && squire.health >= 0){
		squire.Draw();
	}
	if(page && page.health >= 0){
		page.Draw();
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
	drawUnderlings();
	drawMinions();
	drawBoss();
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

