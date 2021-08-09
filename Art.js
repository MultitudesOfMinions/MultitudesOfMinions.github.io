"use strict";
//draw images
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  //need to use png with transparent background (look into gimp or something for making them)
//save() saves the current canvas state
//restore() restores the saved canvas state

//https://www.patrick-wied.at/blog/how-to-create-transparency-in-images-with-html5canvas


function drawPath(){
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
		ctx.beginPath();
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
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.font = "bold "+(scale/4-3)+"pt Arial"
	const height = scale/4;
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
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-tentH,y-tentW);
  ctx.lineTo(x-tentH,y+tentW);
  ctx.closePath();
  ctx.fill();
  
  //side
  ctx.fillStyle = colors[1];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-tentH,y-tentW);
  ctx.lineTo(x+(tentL-tentH),y-tentW);
  ctx.lineTo(x+(tentL),y);
  ctx.lineTo(x+(tentL-tentH),y+tentW);
  ctx.lineTo(x-tentH,y+tentW);
  ctx.closePath();
  ctx.fill();
  
  //top line
  ctx.fillStyle = colors[2];
  ctx.strokeStyle = colors[2]+"4";
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+tentL,y);
  ctx.stroke();

  //door
  ctx.beginPath();
  ctx.moveTo(x-doorH,y);
  ctx.lineTo(x-tentH+1,y-doorW);
  ctx.lineTo(x-tentH+1,y+doorW);
  ctx.closePath();
  ctx.fill();
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
  ctx.fillStyle=colors[0];
  ctx.beginPath();
  ctx.moveTo(x+1,y);
  ctx.lineTo(x-a+1,y-b);
  ctx.lineTo(x-cabinH,y-b);
  ctx.lineTo(x-cabinH,y+b);
  ctx.lineTo(x-a+1,y+b);
  ctx.closePath();
  ctx.fill();
  
  //logs
  ctx.beginPath();
  ctx.strokeStyle=colors[1];
  ctx.lineWidth=logH;
  for(let i=1;i<7;i+=2){
    ctx.moveTo(x-logH*i,y-b);
    ctx.lineTo(x-logH*i,y+b);
  }
  ctx.stroke();
  
  //door
  ctx.fillStyle=colors[2];
  ctx.beginPath();
  ctx.moveTo(x-cabinH,y-doorW);
  ctx.lineTo(x-cabinH+doorH,y-doorW);
  ctx.lineTo(x-cabinH+doorH,y+doorW);
  ctx.lineTo(x-cabinH,y+doorW);
  ctx.closePath();
  ctx.fill();

  //chimney
  ctx.fillStyle="#555";
  ctx.beginPath();
  ctx.moveTo(x+cabinL-a,y+cabinW/2);
  ctx.lineTo(x+cabinL+a,y+cabinW/2);
  ctx.lineTo(x+cabinL+a,y+cabinW/4);
  ctx.lineTo(x+cabinL-a,y+cabinW/4);
  ctx.fill();

  //roof
  ctx.fillStyle=colors[2];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-a,y-cabinW);
  ctx.lineTo(x-a+cabinL,y-cabinW);
  ctx.lineTo(x+cabinL,y);
  ctx.lineTo(x-a+cabinL,y+cabinW);
  ctx.lineTo(x-a,y+cabinW);
  ctx.closePath();
  ctx.fill();
  
  ctx.lineWidth=1;
  ctx.strokeStyle="#000";
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+cabinL,y);
  ctx.stroke();
  
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
  
  ctx.beginPath();
  ctx.lineWidth=scale;
  ctx.strokeStyle=colors[0];
  ctx.moveTo(a.x,a.y);
  ctx.lineTo(b.x,b.y);
  ctx.stroke();
  if(Quality<2){return;}
  
  const dx = Math.abs(a.x-b.x);
  const dy = Math.abs(a.y-b.y);
  ctx.strokeStyle=colors[1];
  if(dx>dy){//horizontal
    const w = dx/16;
    ctx.lineWidth=w;
    for(let i=0;i<16;i+=2){
      ctx.moveTo(a.x+(i*w),a.y-scale/2);
      ctx.lineTo(a.x+(i*w),a.y+scale/2);
    }
  }
  else{//vertical
    const w = dy/16;
    ctx.lineWidth=w;
    for(let i=0;i<16;i+=2){
      ctx.moveTo(a.x-scale/2,a.y+(i*w));
      ctx.lineTo(a.x+scale/2,a.y+(i*w));
    }
  }
  ctx.stroke();
  
}
function drawFortParapet(scale,x,y,colors){
  
  ctx.fillStyle=colors[0];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+scale,y-scale);
  ctx.lineTo(x+scale,y+scale);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle=colors[1];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-scale,y+scale);
  ctx.lineTo(x+scale,y+scale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-scale,y-scale);
  ctx.lineTo(x+scale,y-scale);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle=colors[2];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-scale,y-scale);
  ctx.lineTo(x-scale,y+scale);
  ctx.closePath();
  ctx.fill();

  const s = scale/4;
  ctx.strokeStyle="#0004";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(x-scale,y-scale);
  ctx.lineTo(x+scale,y+scale);
  ctx.moveTo(x+scale,y-scale);
  ctx.lineTo(x-scale,y+scale);
  ctx.stroke();
  
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.moveTo(x-(i*s),y-(i*s));
    ctx.lineTo(x+(i*s),y-(i*s));
    ctx.lineTo(x+(i*s),y+(i*s));
    ctx.lineTo(x-(i*s),y+(i*s));
    ctx.closePath();
    ctx.stroke();
  }
  
 //make 4 triangles
 //stroke some squares on it
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
function drawHWall(scale,x, y, colors){
	if(isColorblind()){return;}
  const wallHeight=scale;
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
function drawParapet(scale, x, y, color1, color2){
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.arc(x,y,scale,0,twoPi);
	ctx.fill();
	
	if(Quality<2){return;}

	const width = scale/8;
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
	ctx.moveTo(x,y+scale);
	ctx.lineTo(x,y-scale);
	ctx.moveTo(x+scale,y);
	ctx.lineTo(x-scale,y);
	ctx.stroke();
	
	const r1 = scale * 3 / 4;
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
function drawGate(scale, x, colors){
	if(isColorblind()){return;}
  
  const wallHeight=scale;
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
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-1);
	drawLevelFlag(scale,0,0,+level-1, "#777", "#000");
	ctx.restore();
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
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.moveTo(x+1,y+tentW/2);
  ctx.lineTo(x-tentH,y-tentW/2);
  ctx.lineTo(x-tentH,y+tentW);
  ctx.closePath();
  ctx.fill();
  
  //side
  ctx.fillStyle = colors[1];
  ctx.beginPath();
  ctx.moveTo(x,y+tentW/2);
  ctx.lineTo(x-tentH,y-tentW/2);
  ctx.lineTo(x,y-tentW/3);
  ctx.lineTo(x+(tentL-tentH),y-tentW/2);
  ctx.lineTo(x+(tentL-tentH*1.5),y);
  ctx.lineTo(x+(tentL-tentH),y+tentW);
  ctx.lineTo(x+tentL/4,y+tentW*.8);
  ctx.lineTo(x-tentH,y+tentW);
  ctx.closePath();
  ctx.fill();

  //top line
  ctx.fillStyle = colors[2];
  ctx.strokeStyle = colors[2]+"4";
  ctx.beginPath();
  ctx.moveTo(x,y+tentW/2);
  ctx.lineTo(x+tentL/3,y+tentW/3);
  ctx.lineTo(x+tentL/8,y+tentW/5);
  ctx.lineTo(x+tentL-tentH*1.5,y);
  ctx.stroke();

  //door
  ctx.beginPath();
  ctx.moveTo(x-doorH,y+doorW);
  ctx.lineTo(x-tentH+1,y-doorW/2);
  ctx.lineTo(x-tentH+1,y+doorW*2);
  ctx.closePath();
  ctx.fill();

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
  ctx.fillStyle="#555";
  ctx.beginPath();
  ctx.moveTo(x+cabinL-a,y+cabinW/2);
  ctx.lineTo(x+cabinL+a,y+cabinW/2);
  ctx.lineTo(x+cabinL+a,y+cabinW/4);
  ctx.lineTo(x+cabinL-a,y+cabinW/4);
  ctx.fill();
  
  //back
  ctx.fillStyle=colors[0];
  ctx.beginPath();
  ctx.moveTo(cabinL+x,y);
  ctx.lineTo(cabinL+x-a+1,y-b);
  ctx.lineTo(cabinL+x-cabinH,y-b);
  ctx.lineTo(cabinL+x-cabinH,y+b);
  ctx.lineTo(cabinL+x-a,y+b);
  ctx.closePath();
  ctx.fill();
  
  //side logs
  ctx.beginPath();
  ctx.strokeStyle=colors[1];
  ctx.lineWidth=logH;
  ctx.moveTo(x-cabinH,y-b);
  ctx.lineTo(x-cabinH+cabinL+cabinH/2,y-b);
  ctx.moveTo(x-cabinH,y+b);
  ctx.lineTo(x-cabinH+cabinL+cabinH/2,y+b);
  ctx.stroke();
  
  //logs
  ctx.beginPath();
  ctx.strokeStyle=colors[1];
  ctx.lineWidth=logH;
  for(let i=3;i<7;i+=2){
    ctx.moveTo(cabinL+x-logH*i,y-b);
    ctx.lineTo(cabinL+x-logH*i,y+b);
  }
  ctx.stroke();
  
  //collapsed roof
  drawLogs(scale,x+cabinL/2-cabinH/2,y,colors[2]);

  //front
  ctx.fillStyle=colors[0];
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-a+1,y-b);
  ctx.lineTo(x-cabinH,y-b);
  ctx.lineTo(x-cabinH,y+b);
  ctx.lineTo(x-a,y+b);
  ctx.closePath();
  ctx.fill();
  
  //logs
  ctx.beginPath();
  ctx.strokeStyle=colors[1];
  ctx.lineWidth=logH;
  for(let i=3;i<7;i+=2){
    ctx.moveTo(x-logH*i,y-b);
    ctx.lineTo(x-logH*i,y+b);
  }
  ctx.stroke();
  
  //doorway
	ctx.fillStyle=GetStyleColor();
  ctx.beginPath();
  ctx.moveTo(x-cabinH,y-doorW);
  ctx.lineTo(x-cabinH+doorH,y-doorW);
  ctx.lineTo(x-cabinH+doorH,y+doorW);
  ctx.lineTo(x-cabinH,y+doorW);
  ctx.closePath();
  ctx.fill();
  
}
function drawLogs(scale,x,y,color){
  const w = scale*.8;
  const l = scale/2;
  const a = scale/2;
  
  ctx.strokeStyle = color;
  ctx.lineWidth=scale/8;
  ctx.beginPath();
  for(let i=0;i<12;i++){
    const X1 = x+((51*level+372*i)%l)-l/2;
    const Y1 = y+((17*level+297*i)%w)-w/2;
    const X2 = X1+(a*Math.cos(level+i));
    const Y2 = Y1+(a*Math.sin(level+i));
    
    ctx.moveTo(X1,Y1);
    ctx.lineTo(X2,Y2);
    ctx.stroke();
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
	
  ctx.lineWidth=scale;
  ctx.strokeStyle=c3;
  ctx.moveTo(x,y);
  ctx.lineTo(x-l*3/4,y);
  ctx.stroke();

  ctx.strokeStyle=c2;
  ctx.beginPath();
  const w = l/16;
  ctx.lineWidth=w;
  for(let i=1;i<12;i+=2){
    const skewA = (((level+i)%3)-1)*w
    const skewB = (((level*i)%5)-2)*w
    ctx.moveTo(x-(i*w)+skewA,y-scale/2);
    ctx.lineTo(x-(i*w)-skewB,y+scale/2);
  }
  ctx.stroke();

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
  const scale = getScale()/4;
	for(let i=0;i<minions.length;i++){
	  if(Quality===3){
	    DrawHighQualityMinion(minions[i], scale);
	  }
	  else{
		  minions[i].Draw();
	  }
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

function draw(){
	//Refresh background
	ctx.fillStyle=GetStyleColor();
	ctx.fillRect(0,0, gameW, gameH);
	if(Quality == 0){return;}
	
//  testAllRuins();
//	return;
	
	drawPath();
	const scale = getScale();
	drawLevelEnd(scale);
	drawRuins(scale);
	
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
}

