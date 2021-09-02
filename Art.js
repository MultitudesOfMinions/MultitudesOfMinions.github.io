"use strict";
//draw images
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  //need to use png with transparent background (look into gimp or something for making them)
//save() saves the current canvas state
//restore() restores the saved canvas state

//https://www.patrick-wied.at/blog/how-to-create-transparency-in-images-with-html5canvas


function drawPath(){
  if(path.length===0){return;}
	if(Quality>=2 && !isColorblind()){
		const rad = pathW * .7;
		
		const rOpt = ['9','A','A','B','C'];
		const gOpt = ['9','8','7'];
		const bOpt = ['4','5'];
		
		const first = (totalPaths%2)+1;
		for(let i=first;i<path.length;i+=2){
		  const j = i+totalPaths;
		  const r = rOpt[j%rOpt.length];
		  const g = gOpt[j%gOpt.length];
		  const b = bOpt[j%bOpt.length];
		  
			mctx.fillStyle='#'+r+g+b+"7";
			mctx.beginPath();
			mctx.ellipse(path[i].x, path[i].y, pathW, rad, 0, 0, Math.PI*2)
			mctx.fill();
		}
	}
	
	mctx.beginPath();
	mctx.lineWidth = pathW;
	mctx.strokeStyle ="#B85";
	if(isColorblind()){
		mctx.strokeStyle = GetColorblindColor();
		mctx.lineWidth = 1;
	}
	
	mctx.moveTo(path[0].x, path[0].y);
	for(let i=1;i<path.length;i++){
		mctx.lineTo(path[i].x, path[i].y);
	}
	mctx.stroke();
}
function drawAccents(scale){
	if(Quality!==3 || isColorblind()){return;}
	accents.forEach(a => a.draw(scale));
}
function drawHUD(){
	const y = getPathYatX(leaderPoint);
	
	mctx.strokeStyle = "#F001";
	if(isColorblind()){
		mctx.strokeStyle = GetColorblindColor();
	}

	mctx.beginPath();
	mctx.lineWidth = 1;
	mctx.moveTo(leaderPoint, y - (pathW/2));
	mctx.lineTo(leaderPoint, y + (pathW/2));
	mctx.stroke();

	if(getUIElement("divBossArea").style.display != "none"){
		const p = getBossMoveTarget();
		mctx.beginPath();
		mctx.moveTo(p.x, 0);
		mctx.lineTo(p.x, pathW);
		mctx.moveTo(p.x-pathW/4,pathW/2);
		mctx.lineTo(p.x, pathW);
		mctx.lineTo(p.x+pathW/4,pathW/2);
		mctx.stroke();
		
		if(boss){
  		const color = isColorblind() ? GetColorblindColor() : boss.color;
  		mctx.beginPath();
  		mctx.fillStyle=color;
  		mctx.font = "bold 20pt Arial"
  		const size = ctx.measureText(boss.symbol);
  		mctx.fillText(boss.symbol, p.x-(size.width/2), 20);
  		mctx.font = "bold 12pt Arial"
		}
	}
}

function drawLevelEnd(scale){
  const age = achievements.maxLevelCleared.maxCount % 4;

  switch(age){
    case 0:
      drawTentEnd(scale);
      break;
    case 1:
      drawCabinEnd(scale);
      break;
    case 2:
      drawFortEnd(scale);
      break;
    case 3:
      drawCastleEnd(scale);
      break;
  }
}

function drawLevelFlag(scale, x,y,level,color1,color2){
	mctx.beginPath();
	mctx.fillStyle = color1;
	mctx.font = "bold "+(scale/4-3)+"pt Arial"
	const height = scale/4;
	const width = ctx.measureText(level).width * 2;

	const pennonX = x+2;
	const pennonY = y-height*3;
	const pennonL = width*1.5;
	const pennonH = height / 2;
	mctx.beginPath();
	mctx.fillRect(pennonX, pennonY+height/2, width, height);
	mctx.fillStyle = color1;
	mctx.moveTo(pennonX,pennonY);
	mctx.lineTo(pennonX+pennonL,pennonY+pennonH)
	mctx.lineTo(pennonX+width,pennonY+pennonH*2)
	mctx.lineTo(pennonX+pennonL,pennonY+pennonH*3)
	mctx.lineTo(pennonX,pennonY+pennonH*4)
	mctx.fill();
	
	mctx.beginPath();
	mctx.lineWidth = 2;
	mctx.strokeStyle = color2;
	mctx.moveTo(x, y);
	mctx.lineTo(x, pennonY-1);
	mctx.stroke();
	
	mctx.beginPath();
	mctx.fillStyle= color2;
	mctx.fillText(level, pennonX + width/4, pennonY + pennonH*3);
	mctx.closePath();
}
function drawTentEnd(scale){
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = scale;
	const y2 = gameH - (y1*1.5);
	
	const c1 = isColorblind() ? "#555" :  "#950";
	const c2 = isColorblind() ? "#777" :  "#B71";
	const c3 = "#000";

	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawTent(scale, x1, y2, [c1, c2, c3]);
	drawLevelFlag(scale,x1,y2,level, color1, color2);
	
	const y3 = getPathYatX(x2)
	drawTent(scale, x2, y3, [c1, c2, c3]);
	
	if(Quality<2){return;}
	drawTent(scale, x1, y1, [c1, c2, c3]);
	drawTent(scale, x2, y1, [c1, c2, c3]);
	drawTent(scale, x2, y2, [c1, c2, c3]);
	drawLevelFlag(scale, x1,y1,level, color1, color2);
	drawLevelFlag(scale, x2,y1,level, color1, color2);
	drawLevelFlag(scale, x2,y2,level, color1, color2);
}
function drawTent(scale, x, y, colors){
  const tentH = scale/2;
  const tentW = tentH*1.4;
  const tentL = tentW*2;
  const doorH = tentH/4;
  const doorW = tentW/3;
  
  //front
  mctx.fillStyle = colors[0];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-tentH,y-tentW);
  mctx.lineTo(x-tentH,y+tentW);
  mctx.closePath();
  mctx.fill();
  
  //side
  mctx.fillStyle = colors[1];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-tentH,y-tentW);
  mctx.lineTo(x+(tentL-tentH),y-tentW);
  mctx.lineTo(x+(tentL),y);
  mctx.lineTo(x+(tentL-tentH),y+tentW);
  mctx.lineTo(x-tentH,y+tentW);
  mctx.closePath();
  mctx.fill();
  
  //top line
  mctx.fillStyle = colors[2];
  mctx.strokeStyle = colors[2]+"4";
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x+tentL,y);
  mctx.stroke();

  //door
  mctx.beginPath();
  mctx.moveTo(x-doorH,y);
  mctx.lineTo(x-tentH+1,y-doorW);
  mctx.lineTo(x-tentH+1,y+doorW);
  mctx.closePath();
  mctx.fill();
}

function drawCabinEnd(scale){
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = scale;
	const y2 = gameH - (y1*1.5);

	const c1 = isColorblind() ? "#555" : "#950";
	const c2 = isColorblind() ? "#777" : "#630";
	const c3 = isColorblind() ? "#000" : "#410";
  
	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawCabin(scale,x1,y2,[c1,c2,c3]);
	drawLevelFlag(scale,x1,y2,level, color1, color2);
	
	const y3 = getPathYatX(x2);
	drawCabin(scale, x2, y3, [c1, c2, c3]);


	if(Quality<2){return;}
	drawCabin(scale,x1,y1,[c1,c2,c3]);
	drawCabin(scale,x2,y1,[c1,c2,c3]);
	drawCabin(scale,x2,y2,[c1,c2,c3]);
	drawLevelFlag(scale,x1,y1,level, color1, color2);
	drawLevelFlag(scale,x2,y1,level, color1, color2);
	drawLevelFlag(scale,x2,y2,level, color1, color2);
}
function drawCabin(scale, x, y, colors){
  
  const cabinH = scale/2;
  const cabinW = cabinH*1.5;
  const cabinL = cabinW*2;
  const doorH = cabinH*.7;
  const doorW = cabinW/4;
  const a = cabinH/4;
  const b = cabinW*.9;
  const logH = cabinH/7;
  
  //front
  mctx.fillStyle=colors[0];
  mctx.beginPath();
  mctx.moveTo(x+1,y);
  mctx.lineTo(x-a+1,y-b);
  mctx.lineTo(x-cabinH,y-b);
  mctx.lineTo(x-cabinH,y+b);
  mctx.lineTo(x-a+1,y+b);
  mctx.closePath();
  mctx.fill();
  
  //logs
  mctx.beginPath();
  mctx.strokeStyle=colors[1];
  mctx.lineWidth=logH;
  for(let i=1;i<7;i+=2){
    mctx.moveTo(x-logH*i,y-b);
    mctx.lineTo(x-logH*i,y+b);
  }
  mctx.stroke();
  
  //door
  mctx.fillStyle=colors[2];
  mctx.beginPath();
  mctx.moveTo(x-cabinH,y-doorW);
  mctx.lineTo(x-cabinH+doorH,y-doorW);
  mctx.lineTo(x-cabinH+doorH,y+doorW);
  mctx.lineTo(x-cabinH,y+doorW);
  mctx.closePath();
  mctx.fill();

  //chimney
  mctx.fillStyle="#555";
  mctx.beginPath();
  mctx.moveTo(x+cabinL-a,y+cabinW/2);
  mctx.lineTo(x+cabinL+a,y+cabinW/2);
  mctx.lineTo(x+cabinL+a,y+cabinW/4);
  mctx.lineTo(x+cabinL-a,y+cabinW/4);
  mctx.fill();

  //roof
  mctx.fillStyle=colors[2];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-a,y-cabinW);
  mctx.lineTo(x-a+cabinL,y-cabinW);
  mctx.lineTo(x+cabinL,y);
  mctx.lineTo(x-a+cabinL,y+cabinW);
  mctx.lineTo(x-a,y+cabinW);
  mctx.closePath();
  mctx.fill();
  
  mctx.lineWidth=1;
  mctx.strokeStyle="#000";
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x+cabinL,y);
  mctx.stroke();
  
}

function drawFortEnd(scale){
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = scale;
	const y2 = gameH-y1;

	const c1 = isColorblind() ? "#999" : "#950";
	const c2 = isColorblind() ? "#777" : "#740";
	const c3 = isColorblind() ? "#555" : "#520";
	const c4 = isColorblind() ? "#333" : "#410";

	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	
	drawFortWall(scale,new point(x1,y1), new point(x1,y2), [c4,c3]);
	drawFortWall(scale,new point(x1,y1), new point(x2,y1), [c3,c2]);
	drawFortWall(scale,new point(x1,y2), new point(x2,y2), [c3,c2]);
	drawFortWall(scale,new point(x2,y1), new point(x2,y2), [c2,c1]);
	
	drawFortParapet(scale,x1,y1,[c2,c3,c4])
	drawFortParapet(scale,x1,y2,[c2,c3,c4] )
	drawFortParapet(scale,x2,y1,[c1,c2,c3] )
  drawFortParapet(scale,x2,y2,[c1,c2,c3] )
  	
	drawLevelFlag(scale,x1,y2,level, color1, color2);
	if(Quality<2){return;}
	drawLevelFlag(scale,x1,y1,level, color1, color2);
	drawLevelFlag(scale,x2,y1,level, color1, color2);
	drawLevelFlag(scale,x2,y2,level, color1, color2);

}
function drawFortWall(scale,a,b,colors){
  
  mctx.beginPath();
  mctx.lineWidth=scale;
  mctx.strokeStyle=colors[0];
  mctx.moveTo(a.x,a.y);
  mctx.lineTo(b.x,b.y);
  mctx.stroke();
  if(Quality<2){return;}
  
  const dx = Math.abs(a.x-b.x);
  const dy = Math.abs(a.y-b.y);
  mctx.strokeStyle=colors[1];
  if(dx>dy){//horizontal
    const w = dx/16;
    mctx.lineWidth=w;
    for(let i=0;i<16;i+=2){
      mctx.moveTo(a.x+(i*w),a.y-scale/2);
      mctx.lineTo(a.x+(i*w),a.y+scale/2);
    }
  }
  else{//vertical
    const w = dy/16;
    mctx.lineWidth=w;
    for(let i=0;i<16;i+=2){
      mctx.moveTo(a.x-scale/2,a.y+(i*w));
      mctx.lineTo(a.x+scale/2,a.y+(i*w));
    }
  }
  mctx.stroke();
  
}
function drawFortParapet(scale,x,y,colors){
  
  mctx.fillStyle=colors[0];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x+scale,y-scale);
  mctx.lineTo(x+scale,y+scale);
  mctx.closePath();
  mctx.fill();

  mctx.fillStyle=colors[1];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-scale,y+scale);
  mctx.lineTo(x+scale,y+scale);
  mctx.closePath();
  mctx.fill();
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-scale,y-scale);
  mctx.lineTo(x+scale,y-scale);
  mctx.closePath();
  mctx.fill();
  
  mctx.fillStyle=colors[2];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-scale,y-scale);
  mctx.lineTo(x-scale,y+scale);
  mctx.closePath();
  mctx.fill();

  const s = scale/4;
  mctx.strokeStyle="#0004";
  mctx.lineWidth=2;
  mctx.beginPath();
  mctx.moveTo(x-scale,y-scale);
  mctx.lineTo(x+scale,y+scale);
  mctx.moveTo(x+scale,y-scale);
  mctx.lineTo(x-scale,y+scale);
  mctx.stroke();
  
  for(let i=0;i<5;i++){
    mctx.beginPath();
    mctx.moveTo(x-(i*s),y-(i*s));
    mctx.lineTo(x+(i*s),y-(i*s));
    mctx.lineTo(x+(i*s),y+(i*s));
    mctx.lineTo(x-(i*s),y+(i*s));
    mctx.closePath();
    mctx.stroke();
  }
}

function drawCastleEnd(scale){
	const x1 = endZoneStartX();
	const x2 = levelEndX;
	const y1 = scale;
	const y2 = gameH - y1;

	ctx.lineWidth = scale;

	const c1 = "#333";
	const c2 = "#555";
	const c3 = "#777";
	const c4 = "#999";

	drawVWall(scale, x1, y1, [c2, c1]);
	drawHWall(scale, x1, y1, [c3, c2]);
	drawHWall(scale, x1, y2, [c3, c2]);
	drawVWall(scale, x2, y1, [c4, c3]);
	
	drawGate(scale*2,x1,[c2,c3]);

	const c5 = isColorblind()? GetColorblindBackgroundColor() : "#444";
	const c6 = isColorblind()? GetColorblindColor() : "#666";
	const c7 = isColorblind()? GetColorblindBackgroundColor() : "#888";

	drawParapet(scale,x1,y1,c6,c5);
	drawParapet(scale,x1,y2,c6,c5);
	drawParapet(scale,x2,y1,c7,c6);
	drawParapet(scale,x2,y2,c7,c6);
	
	const flagColor = hero != null ? hero.color : squire != null ? squire.color : page != null ? page.color : "#777";
	const color1 = isColorblind() ? GetColorblindBackgroundColor() : flagColor;
	const color2 = isColorblind() ? GetColorblindColor() : "#000";
	drawLevelFlag(scale,x1,y2,level, color1, color2);
	if(Quality<2){return;}
	drawLevelFlag(scale,x1,y1,level, color1, color2);
	drawLevelFlag(scale,x2,y1,level, color1, color2);
	drawLevelFlag(scale,x2,y2,level, color1, color2);


}
function drawVWall(scale,x, y, colors){
	if(isColorblind()){return;}
  const wallHeight=scale;
  const wallWidth=gameH-(2*y);
	if(Quality<2){
  	mctx.beginPath();
  	mctx.strokeStyle = colors[0];
  	mctx.moveTo(x, y);
  	mctx.lineTo(x, y+wallWidth);
  	mctx.stroke();
  	mctx.closePath();
	  return;
	}
	
	const rows = 8;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	const wallX = x-(wallHeight/2);
	const wallY = y+wallWidth;
	
	mctx.beginPath();
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      mctx.fillStyle= colors[(i+j)%colors.length];
      const bx = wallX+(j*brickHeight);
      const by = wallY-brickWidth*i;
      mctx.fillRect(bx, by, brickHeight+1, brickWidth+1);
    }
  }
  for(let i=1;i<cols;i+=2){
    const bx = wallX+(rows*brickHeight);
    const by = wallY-brickWidth*i;
    mctx.fillRect(bx, by, brickHeight+1, brickWidth);
    mctx.fillRect(bx+brickHeight, by-(brickWidth/4), brickHeight+1, brickWidth*1.5);
  }
	mctx.fillStyle="#F00";
	mctx.fillRect(wallX, wallY, 10, 10);
	
	mctx.closePath();
}
function drawHWall(scale,x, y, colors){
	if(isColorblind()){return;}
  const wallHeight=scale;
  const wallWidth=endZoneW();

	if(Quality<2){
  	mctx.beginPath();
  	mctx.strokeStyle = colors[0];
  	mctx.moveTo(x, y);
  	mctx.lineTo(x+wallWidth, y);
  	mctx.stroke();
  	mctx.closePath();
	  return;
	}
	
	const rows = 8;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	const wallX = x;
	const wallY = y+(wallHeight/2);

	mctx.beginPath();
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      mctx.fillStyle= colors[(i+j)%colors.length];
      const bx = wallX+(brickWidth*i);// (j*brickHeight);
      const by = wallY-(j*brickHeight);// brickWidth*i;
      mctx.fillRect(bx, by, brickWidth+1, brickHeight+1);
    }
  }
	mctx.closePath();
}
function drawParapet(scale, x, y, color1, color2){
	mctx.beginPath();
	mctx.fillStyle = color1;
	mctx.arc(x,y,scale,0,twoPi);
	mctx.fill();
	
	if(Quality<2){return;}

	const width = scale/8;
	mctx.lineWidth = width;
	mctx.strokeStyle = color2;
	mctx.moveTo(x+width,y);
	mctx.arc(x,y,width*1,0,twoPi);
	mctx.moveTo(x+width*3,y);
	mctx.arc(x,y,width*3,0,twoPi);
	mctx.moveTo(x+width*5,y);
	mctx.arc(x,y,width*5,0,twoPi);
	mctx.moveTo(x+width*7,y);
	mctx.arc(x,y,width*7,0,twoPi);
	mctx.stroke();

	mctx.beginPath();
	mctx.strokeStyle = color1;
	mctx.moveTo(x,y+scale);
	mctx.lineTo(x,y-scale);
	mctx.moveTo(x+scale,y);
	mctx.lineTo(x-scale,y);
	mctx.stroke();
	
	const r1 = scale * 3 / 4;
	const r2 = r1 / 2;
	mctx.beginPath();
	mctx.strokeStyle = color1;
	mctx.moveTo(x+r1,y+r1);
	mctx.lineTo(x+r2,y+r2);
	
	mctx.moveTo(x+r1,y-r1);
	mctx.lineTo(x+r2,y-r2);

	mctx.moveTo(x-r1,y+r1);
	mctx.lineTo(x-r2,y+r2);

	mctx.moveTo(x-r1,y-r1);
	mctx.lineTo(x-r2,y-r2);
	mctx.stroke();
}
function drawGate(scale, x, colors){
	if(isColorblind()){return;}
  
  const wallHeight=scale;
  let wallWidth=pathW*1.4;
  
	mctx.beginPath();
	const rows = 16;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	wallWidth=cols*brickWidth;
	const wallX = x-(wallHeight/2);
	const wallY = getPathYatX(wallX)-(wallWidth/2);
	
	if(Quality>=2){

		mctx.beginPath();
    for(let i=0;i<cols;i++){
      for(let j=0;j<rows;j++){
        mctx.fillStyle= colors[(i+j)%colors.length];
        const bx = wallX+(j*brickHeight);
        const by = wallY+brickWidth*i;
        mctx.fillRect(bx, by, brickHeight+1, brickWidth+1);
      }
    }
    for(let i=0;i<cols;i+=2){
      const bx = wallX+(rows*brickHeight);
      const by = wallY+brickWidth*i;
      mctx.fillRect(bx, by, brickHeight+1, brickWidth);
      mctx.fillRect(bx+brickHeight, by-(brickWidth/4), brickHeight+1, brickWidth*1.5);
    }
	}
	
	mctx.beginPath();
	mctx.fillStyle = "#000";
	const doorW = wallWidth*3/4;
  const doorH = doorW/2;
  const doorX = x-(wallHeight/2);
  const doorY = getPathYatX(doorX)-(doorW/2);
	mctx.fillRect(doorX,doorY,doorH,doorW);
	mctx.arc(doorX+doorH-1,doorY+(doorW/2),doorH,-halfPi,halfPi);
	mctx.fill();
}


function drawRuins(scale){
  const age = achievements.maxLevelCleared.maxCount;
  
  switch(age){
    case 0:
      drawTentRuins(scale);
      break;
    case 1:
      drawCabinRuins(scale);
      break;
    case 2:
      drawFortRuins(scale);
      break;
    case 3:
      drawCastleRuins(scale);
      break;
  }

}

function drawRuinsFlag(scale,x,y){
  mctx.save();
  mctx.translate(x, y);
  mctx.rotate(-1);
	drawLevelFlag(scale,0,0,+level-1, "#777", "#000");
	mctx.restore();
}

function drawTentRuins(scale){
	if(+level <= 0){return;}
	const x = levelStartX;
	const y = gameH - scale;
	drawBrokenTent(scale,x,y);

  const tentH = scale*3/4;
  const tentW = tentH/2;
  drawRuinsFlag(scale,x+scale, y+tentW);
}
function drawBrokenTent(scale,x,y){
	const c1 = isColorblind() ? "#555" :  "#950";
	const c2 = isColorblind() ? "#777" :  "#B71";
	const c3 = "#000";
  const colors = [c1, c2, c3];

  const tentH = scale/2;
  const tentW = tentH*1.4;
  const tentL = tentW*2;
  const doorH = tentH/2;
  const doorW = tentW/3;
  
  //front
  mctx.fillStyle = colors[0];
  mctx.beginPath();
  mctx.moveTo(x+1,y+tentW/2);
  mctx.lineTo(x-tentH,y-tentW/2);
  mctx.lineTo(x-tentH,y+tentW);
  mctx.closePath();
  mctx.fill();
  
  //side
  mctx.fillStyle = colors[1];
  mctx.beginPath();
  mctx.moveTo(x,y+tentW/2);
  mctx.lineTo(x-tentH,y-tentW/2);
  mctx.lineTo(x,y-tentW/3);
  mctx.lineTo(x+(tentL-tentH),y-tentW/2);
  mctx.lineTo(x+(tentL-tentH*1.5),y);
  mctx.lineTo(x+(tentL-tentH),y+tentW);
  mctx.lineTo(x+tentL/4,y+tentW*.8);
  mctx.lineTo(x-tentH,y+tentW);
  mctx.closePath();
  mctx.fill();

  //top line
  mctx.fillStyle = colors[2];
  mctx.strokeStyle = colors[2]+"4";
  mctx.beginPath();
  mctx.moveTo(x,y+tentW/2);
  mctx.lineTo(x+tentL/3,y+tentW/3);
  mctx.lineTo(x+tentL/8,y+tentW/5);
  mctx.lineTo(x+tentL-tentH*1.5,y);
  mctx.stroke();

  //door
  mctx.beginPath();
  mctx.moveTo(x-doorH,y+doorW);
  mctx.lineTo(x-tentH+1,y-doorW/2);
  mctx.lineTo(x-tentH+1,y+doorW*2);
  mctx.closePath();
  mctx.fill();

}

function drawCabinRuins(scale){
	if(+level <= 0){return;}
	const x = levelStartX;
	const y = gameH - scale*1.5;
	drawBrokenCabin(scale,x,y);
  drawRuinsFlag(scale,x-scale/4, y);
}
function drawBrokenCabin(scale,x,y){
	const c1 = isColorblind() ? "#555" : "#950";
	const c2 = isColorblind() ? "#777" : "#630";
	const c3 = isColorblind() ? "#000" : "#410";

  const colors= [c1,c2,c3];
	
  const cabinH = scale/2;
  const cabinW = cabinH*1.5;
  const cabinL = cabinW*2;
  const doorH = cabinH*.7;
  const doorW = cabinW/4;
  const a = cabinH/6;
  const b = cabinW*.9;
  const logH = cabinH/7;
  
  //chimney
  mctx.fillStyle="#555";
  mctx.beginPath();
  mctx.moveTo(x+cabinL-a,y+cabinW/2);
  mctx.lineTo(x+cabinL+a,y+cabinW/2);
  mctx.lineTo(x+cabinL+a,y+cabinW/4);
  mctx.lineTo(x+cabinL-a,y+cabinW/4);
  mctx.fill();
  
  //back
  mctx.fillStyle=colors[0];
  mctx.beginPath();
  mctx.moveTo(cabinL+x,y);
  mctx.lineTo(cabinL+x-a+1,y-b);
  mctx.lineTo(cabinL+x-cabinH,y-b);
  mctx.lineTo(cabinL+x-cabinH,y+b);
  mctx.lineTo(cabinL+x-a,y+b);
  mctx.closePath();
  mctx.fill();
  
  //side logs
  mctx.beginPath();
  mctx.strokeStyle=colors[1];
  mctx.lineWidth=logH;
  mctx.moveTo(x-cabinH,y-b);
  mctx.lineTo(x-cabinH+cabinL+cabinH/2,y-b);
  mctx.moveTo(x-cabinH,y+b);
  mctx.lineTo(x-cabinH+cabinL+cabinH/2,y+b);
  mctx.stroke();
  
  //logs
  mctx.beginPath();
  mctx.strokeStyle=colors[1];
  mctx.lineWidth=logH;
  for(let i=3;i<7;i+=2){
    mctx.moveTo(cabinL+x-logH*i,y-b);
    mctx.lineTo(cabinL+x-logH*i,y+b);
  }
  mctx.stroke();
  
  //collapsed roof
  drawLogs(scale,x+cabinL/2-cabinH/2,y,colors[2]);

  //front
  mctx.fillStyle=colors[0];
  mctx.beginPath();
  mctx.moveTo(x,y);
  mctx.lineTo(x-a+1,y-b);
  mctx.lineTo(x-cabinH,y-b);
  mctx.lineTo(x-cabinH,y+b);
  mctx.lineTo(x-a,y+b);
  mctx.closePath();
  mctx.fill();
  
  //logs
  mctx.beginPath();
  mctx.strokeStyle=colors[1];
  mctx.lineWidth=logH;
  for(let i=3;i<7;i+=2){
    mctx.moveTo(x-logH*i,y-b);
    mctx.lineTo(x-logH*i,y+b);
  }
  mctx.stroke();
  
  //doorway
	mctx.fillStyle=GetStyleColor();
  mctx.beginPath();
  mctx.moveTo(x-cabinH,y-doorW);
  mctx.lineTo(x-cabinH+doorH,y-doorW);
  mctx.lineTo(x-cabinH+doorH,y+doorW);
  mctx.lineTo(x-cabinH,y+doorW);
  mctx.closePath();
  mctx.fill();
  
}
function drawLogs(scale,x,y,color){
  const w = scale*.8;
  const l = scale/2;
  const a = scale/2;
  
  mctx.strokeStyle = color;
  mctx.lineWidth=scale/8;
  mctx.beginPath();
  for(let i=0;i<12;i++){
    const X1 = x+((51*level+372*i)%l)-l/2;
    const Y1 = y+((17*level+297*i)%w)-w/2;
    const X2 = X1+(a*Math.cos(level+i));
    const Y2 = Y1+(a*Math.sin(level+i));
    
    mctx.moveTo(X1,Y1);
    mctx.lineTo(X2,Y2);
    mctx.stroke();
  }
}

function drawFortRuins(scale){
	if(+level <= 0){return;}
	const x = levelStartX;
	const y = gameH - scale*1.5;
	drawBrokenFort(scale,x,y);
  drawRuinsFlag(scale,x,y);
}
function drawBrokenFort(scale,x,y){
	const c1 = isColorblind() ? "#999" : "#950";
	const c2 = isColorblind() ? "#777" : "#740";
	const c3 = isColorblind() ? "#555" : "#520";
	const l = endZoneW();
	
  mctx.lineWidth=scale;
  mctx.strokeStyle=c3;
  mctx.moveTo(x,y);
  mctx.lineTo(x-l*3/4,y);
  mctx.stroke();

  mctx.strokeStyle=c2;
  mctx.beginPath();
  const w = l/16;
  mctx.lineWidth=w;
  for(let i=1;i<12;i+=2){
    const skewA = (((level+i)%3)-1)*w
    const skewB = (((level*i)%5)-2)*w
    mctx.moveTo(x-(i*w)+skewA,y-scale/2);
    mctx.lineTo(x-(i*w)-skewB,y+scale/2);
  }
  mctx.stroke();

  drawLogs(scale, x-l/2,y+scale,l/8,scale/8,c1);
 
  drawFortParapet(scale, x, y, [c1,c2,c3]);
}

function drawCastleRuins(scale){
	if(+level <= 0){return;}
	const x = levelStartX;
	const y = gameH - scale;
	drawBrokenCastleWall(scale,x, y);
	drawRuinsFlag(scale,x,y-(scale/2));
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
function drawBrokenCastleWall(scale, x, y){
	if(isColorblind()){return;}
	const wallWidth = endZoneW();
	const wallHeight = scale;
	if(Quality<2){
  	mctx.lineWidth = wallHeight;
	  mctx.beginPath();
  	mctx.strokeStyle = "#333";
  	mctx.moveTo(x-wallWidth, y);
  	mctx.lineTo(x, y);
  	mctx.stroke();
  	mctx.closePath();
	  return;
	}
	
	const rows = 8;
	const brickHeight = wallHeight / rows;
	const brickWidth = brickHeight * 1.625;
	const cols = Math.ceil(wallWidth/brickWidth);
	const wallY = y + brickHeight * 3;
	const wallX = x - wallWidth;

	mctx.beginPath();
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      mctx.fillStyle=brickColor(j,i*(j+level+1));
      const bx = wallX+(i*brickWidth);
      const by = wallY-brickHeight*j;
      mctx.fillRect(bx, by, brickWidth, brickHeight);
    }
  }
}

function drawUnderlings(){
  const scale = getScale()/4;
	for(let i=0;i<underlings.length;i++){
	  if(Quality===3){
	    DrawHighQualityMinion(underlings[i], scale);
	  }
	  else{underlings[i].Draw();}
	}
}
const drawMinions=function(){
  if(Quality===3){
    const scale = getScale()/4;
    for(let i=0;i<minions.length;i++){
      if(minions[i].isFlying){continue;}
      DrawHighQualityMinion(minions[i], scale);
    }
    for(let i=0;i<minions.length;i++){
      if(!minions[i].isFlying){continue;}
      DrawHighQualityMinion(minions[i], scale);
    }

  }
  else{
  	for(let i=0;i<minions.length;i++){
  	  minions[i].Draw();
  	}
  }
}
const drawBoss=function(){
  const scale = getScale();
	if(boss && boss.health >= 0){
	  if(Quality>=2){
	    DrawHighQualityBoss(boss, scale);
	  }
	  else{
		  boss.Draw();
	  }
	}
}
const drawTowers=function() {
  
  const scale = getScale()/2;
  if(Quality===3){
    for(let i=0;i<towers.length;i++){
      DrawHighQualityTower(towers[i], scale);
    }
  }
  else{
  	for(let i=0;i<towers.length;i++){
  		towers[i].Draw();
  	}
  }
}
const drawHero=function(){
  
  const scale = getScale()/8;

	if(hero && hero.health >= 0){
	  if(Quality>=2){
	    DrawHighQualityHero(hero, scale*4);
	  }
	  else{
		  hero.Draw();
	  }
	}
	if(squire && squire.health >= 0){
	  if(Quality>=2){
	    DrawHighQualityHero(squire, scale*3);
	  }
	  else{
		  squire.Draw();
	  }
	}
	if(page && page.health >= 0){
	  if(Quality>=2){
	    DrawHighQualityHero(page, scale*2);
	  }
	  else{
		  page.Draw();
	  }
	}
}

const updateFPS=()=>{
  const delta = (thisLoop=performance.now()) - lastLoop;
  frameTime+= (delta - frameTime) / 16;
  lastLoop = thisLoop;
  
	if(showFPS()){
	  ctx.fillStyle="#0009"
	  ctx.fillRect(0,0,42,17);
	  
	  const fps = Math.floor(1000/frameTime);
		ctx.beginPath();
		ctx.fillStyle="#FFF9";
		ctx.font = "10pt Helvetica"
		ctx.fillText(fps,10,10);
		ctx.closePath();
	}
}


const testAllRuins=()=>{
  const s = getScale();
  ctx.save();
  ctx.translate(100, -gameH+pathW*2);
  level=1;
	drawRuins(s);

  ctx.translate(150, 0);
  level=2;
	drawRuins(s);
	
  ctx.translate(150, 0);
  level=3;
	drawRuins(s);

  ctx.translate(150, 0);
  level=4;
	drawRuins(s);

  ctx.translate(150, 0);
  level=5;
	drawRuins(s);

  ctx.translate(150, 0);
  level=6;
	drawRuins(s);

  ctx.translate(-150*5, 100);
  level=7;
	drawRuins(s);

  ctx.translate(150, 0);
  level=8;
	drawRuins(s);

  ctx.translate(150, 0);
  level=9;
	drawRuins(s);

  ctx.translate(150, 0);
  level=10;
	drawRuins(s);

  ctx.translate(150, 0);
  level=11;
	drawRuins(s);

  ctx.translate(150, 0);
  level=12;
	drawRuins(s);

  ctx.restore();
  
  stop();
}

function drawMap(){
  Quality = GetQuality();
//  testAllRuins();
//	return;

	//Refresh background
	mctx.fillStyle=GetStyleColor();
	mctx.fillRect(0,0, gameW, gameH);
	const scale = getScale();

	drawPath();
	drawAccents(scale);
	//drawHUD();

	drawLevelEnd(scale);
	drawRuins(scale);
}

function drawUnits(){
  if(paused){return;}
  
  requestAnimationFrame(drawUnits);
	Quality = GetQuality();

	//Refresh background
	ctx.clearRect(0,0,gameW,gameH);

	if(Quality == 0){return;}
	const scale = getScale();

	drawTowers();
	drawUnderlings();
	drawMinions();
	drawBoss();
	drawHero();

	ctx.globalAlpha = .2;
	drawHeroAura();
	drawBossAura();

	ctx.globalAlpha = .4;
	drawImpacts();
	
	ctx.globalAlpha = 1;
	drawProjectiles();
	updateFPS();
}

