"use strict";

const hqDeath=(unit, scale, rate)=>{
    const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
  const phaseTime = (340*moveSpeed**-.5)/rate;
  unit.drawCycle=(unit.drawCycle+unit.moving)%(phaseTime);
  const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
  
  //Feet/robe
  ctx.beginPath();
  ctx.fillStyle=unit.color2;
  const rx = scale/4+(phase)*scale;
  const ry = scale/3;
  const lx = scale/4+(-phase)*scale;
  const ly = -scale/3;
  ctx.ellipse(rx,ry,scale/2,scale,-1.5,0,twoPi);
  ctx.ellipse(lx,ly,scale/2,scale,1.5,0,twoPi);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(rx+scale,ry);
  ctx.lineTo(lx+scale,ly);
  ctx.lineTo(lx-scale,ly);
  ctx.lineTo(rx-scale,ry);
  ctx.closePath();
  ctx.fill();
  
  const ar = unit.lastAttack/unit.CalculateEffect(statTypes.attackRate)*10;
  
  const focus = 4.75+phase;
  const staff = ar>1?(1.5+phase):ar*(1.5+phase);
  
  const rhx = Math.cos(staff)*scale;
  const rhy = Math.sin(staff)*scale*1.5;
  const handSize = scale/8;
  
  //staff
  ctx.fillStyle="#420";
  ctx.beginPath();
  ctx.moveTo(rhx-scale*1.5,rhy-handSize/2);
  ctx.lineTo(rhx+scale*2.5,rhy-handSize);
  ctx.lineTo(rhx+scale*2.5,rhy+handSize);
  ctx.lineTo(rhx-scale*1.5,rhy+handSize/2);
  ctx.closePath();
  ctx.fill();


  ctx.fillStyle="#000";
  ctx.beginPath();
  ctx.ellipse(rhx+scale*1.5,rhy,scale,scale*2,0,halfPi*3,twoPi);
  ctx.ellipse(rhx+scale*1.5,rhy,scale/2,scale*2,0,twoPi,halfPi*3,1);
  ctx.fill();

  ctx.strokeStyle="#999";
  ctx.lineWidth=scale/8;
  ctx.beginPath();
  ctx.ellipse(rhx+scale*1.5,rhy,scale/2,scale*2,0,halfPi*3,twoPi);
  ctx.stroke();
  

  const lhx = Math.cos(focus)*scale;
  const lhy = Math.sin(focus)*scale*1.4;
  
  //arms/hands
  const armw = scale/12;
  const fingw = armw/2;
  
  //Right arm/hand
  ctx.strokeStyle="#BB9";
  ctx.lineWidth=armw;
  ctx.beginPath();
  ctx.moveTo(-armw,scale/2);
  ctx.lineTo(rhx-armw,rhy-handSize);
  ctx.lineTo(rhx+armw,rhy-handSize);
  ctx.lineTo(armw,scale/2);
  ctx.stroke();
  
  ctx.lineWidth=fingw;
  ctx.beginPath();
  ctx.moveTo(rhx-armw,rhy-handSize);
  ctx.lineTo(rhx-armw,rhy+handSize);

  ctx.moveTo(rhx-armw+fingw*2,rhy-handSize);
  ctx.lineTo(rhx-armw+fingw*2,rhy+handSize);
  
  ctx.moveTo(rhx+armw,rhy-handSize);
  ctx.lineTo(rhx+armw,rhy+handSize);
  ctx.stroke();
  
  //Left arm/hand
  ctx.lineWidth=armw;
  ctx.beginPath();
  ctx.moveTo(-armw,-scale/2);
  ctx.lineTo(lhx-armw,lhy+handSize);
  ctx.lineTo(lhx+armw,lhy+handSize);
  ctx.lineTo(armw,-scale/2);
  ctx.stroke();
  
  ctx.lineWidth=fingw;
  ctx.beginPath();
  ctx.moveTo(lhx-armw,lhy-handSize);
  ctx.lineTo(lhx-armw,lhy+handSize);

  ctx.moveTo(lhx-armw+fingw*2,lhy-handSize);
  ctx.lineTo(lhx-armw+fingw*2,lhy+handSize);
  
  ctx.moveTo(lhx+armw,lhy-handSize);
  ctx.lineTo(lhx+armw,lhy+handSize);

  ctx.moveTo(lhx+armw,lhy+handSize);
  ctx.lineTo(lhx+armw*2.5,lhy+handSize);
  ctx.stroke();
  
  //Shoulders
  ctx.fillStyle="#222";
  ctx.beginPath();
  ctx.ellipse(0,0,scale/2,scale,0,0,twoPi);
  ctx.fill();

  //head
  const hood = scale/2;
  const hoodx = -scale/8;
  ctx.lineWidth=scale/4
  ctx.fillStyle="#333";
  ctx.beginPath();
  ctx.arc(hoodx,0,hood,Math.PI/2,Math.PI*3/2,);
  ctx.lineTo(scale,-hood*.8);
  ctx.lineTo(scale,hood*.8);
  ctx.closePath();
  ctx.fill();
  
  ctx.strokeStyle="#222";
  ctx.beginPath();
  ctx.moveTo(scale,hood*.8);
  ctx.lineTo(scale,-hood*.8);
  ctx.stroke();
}
const hqFamine=(unit, scale, rate)=>{
}
const hqPesilence=(unit, scale, rate)=>{
}
const hqWar=(unit, scale, rate)=>{
  ctx.translate(-scale,0);
  const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
  const phaseTime = (340*moveSpeed**-.5)/rate;
  unit.drawCycle=(unit.drawCycle+(unit.moving?1:0))%(phaseTime);
  const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
  
  const h = Math.PI;
  const t = 0;
  const fr = scale;
  const fa = h-.3;//heel
  const fb = t-.5;//toe
  const fc = t+.5;//toe
  const fd = h+.3;//heel
  
  const footSize = scale*3/4;
  //R foot
  const rx = scale/2+(phase)*scale;
  const ry = scale*3/4;
  
  
  ctx.fillStyle="#000";
  ctx.beginPath();
  ctx.ellipse(rx,ry,footSize,footSize/2,0,fa,fb);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rx,ry,footSize,footSize/2,0,fc,fd);
  ctx.fill();

  //L foot
  const lx = scale/2+(-phase)*scale;
  const ly = -ry;
  ctx.beginPath();
  ctx.ellipse(lx,ly,footSize,footSize/2,0,fa,fb);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(lx,ly,footSize,footSize/2,0,fc,fd);
  ctx.fill();
  

  const ar = unit.lastAttack/unit.CalculateEffect(statTypes.attackRate)*5;
  
  const rh = 1.5+phase;
  const lh = 4.75+phase;
  
  const rhx = Math.cos(rh)*scale+scale;
  const rhy = Math.sin(rh)*scale;
  const lhx = Math.cos(lh)*scale+scale;
  const lhy = Math.sin(lh)*scale;
  const handSize = scale/8;
  ctx.lineWidth=scale/4;
  
  const rot = .5;
  //R Axe
  ctx.fillStyle="#777";
  ctx.strokeStyle="#AAA";
  const rRot = rot*(unit.attackHand&&ar<1?(ar-.5)*2:1);
  ctx.rotate(rRot);
  const axer=scale*3/4
  ctx.beginPath();
  ctx.arc(rhx+scale*2,rhy,axer,.5,Math.PI-.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rhx+scale*2,rhy,axer,Math.PI+.5,twoPi-.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(rhx+scale*2,rhy,axer,Math.PI-.5,.5,1);
  ctx.arc(rhx+scale*2,rhy,axer,Math.PI+.5,twoPi-.5);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle="#420";
  ctx.beginPath();
  ctx.moveTo(rhx-scale/2,rhy-handSize)
  ctx.lineTo(rhx+scale*2+axer,rhy-handSize)
  ctx.lineTo(rhx+scale*2+axer,rhy+handSize)
  ctx.lineTo(rhx-scale/2,rhy+handSize)
  ctx.closePath();
  ctx.fill();

  //R Arm
  ctx.fillStyle=unit.color2;
  ctx.beginPath();
  ctx.arc(rhx,rhy,handSize*3,0,twoPi);
  ctx.ellipse(rhx/2,rhy/2,scale/2,scale/4,rh-.5,0,twoPi);
  ctx.fill();

  ctx.rotate(-rRot);

  //L Axe
  ctx.fillStyle="#777";
  ctx.strokeStyle="#AAA";
  const lRot = rot*(!unit.attackHand&&ar<1?(ar-.5)*2:1);
  ctx.rotate(-lRot);
  ctx.beginPath();
  ctx.arc(lhx+scale*2,lhy,axer,.5,Math.PI-.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(lhx+scale*2,lhy,axer,Math.PI+.5,twoPi-.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(lhx+scale*2,lhy,axer,Math.PI-.5,.5,1);
  ctx.arc(lhx+scale*2,lhy,axer,Math.PI+.5,twoPi-.5);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle="#420";
  ctx.beginPath();
  ctx.moveTo(lhx-scale/2,lhy-handSize)
  ctx.lineTo(lhx+scale*2+axer,lhy-handSize)
  ctx.lineTo(lhx+scale*2+axer,lhy+handSize)
  ctx.lineTo(lhx-scale/2,lhy+handSize)
  ctx.closePath();
  ctx.fill();
  
  //L Arm
  ctx.fillStyle=unit.color2;
  ctx.beginPath();
  ctx.arc(lhx,lhy,handSize*3,0,twoPi);
  ctx.ellipse(lhx/2,lhy/2,scale/2,scale/4,lh+.5,0,twoPi);
  ctx.fill();

  ctx.rotate(lRot);
  
  ctx.translate(-scale/4,0);
  //head
  const r = scale*3/4;
  ctx.fillStyle=unit.color;
  ctx.beginPath();
  ctx.arc(scale,0,scale*.4,0,twoPi);
  ctx.ellipse(0,0,scale/2,scale*3/4,0,0,twoPi);
  ctx.fill();
  
  ctx.lineWidth=scale/4;
  ctx.strokeStyle=unit.color2;
  ctx.beginPath();
  const nose = scale/3;
  ctx.moveTo(scale,nose);
  ctx.lineTo(nose,scale/2);
  ctx.lineTo(nose,-scale/2);
  ctx.lineTo(scale,-nose);
  ctx.closePath();
  ctx.fill();
  
  //nose ring
  ctx.strokeStyle="#FF0";
  ctx.lineWidth=scale/12;
  ctx.beginPath();
  ctx.ellipse(scale*1.5,0,scale/6,scale/4,0,Math.PI+.5,Math.PI-.5);
  ctx.stroke();
  
  //eyes
  ctx.fillStyle="#000";
  ctx.beginPath();
  ctx.ellipse(scale*.5,scale*.3,scale/12,scale/8,.5,0,twoPi);
  ctx.ellipse(scale*.5,-scale*.3,scale/12,scale/8,-.5,0,twoPi);
  ctx.fill();

  //Horns
  const hornPoints = [
    {
      x:.1,
      y:.5,
      s:.15
    },
    {
      x:.3,
      y:.8,
      s:.15
    },
    {
      x:.4,
      y:.9,
      s:.14
    },
    {
      x:.6,
      y:.8,
      s:.13
    },
    {
      x:.8,
      y:.6,
      s:.1
    },
    {
      x:1,
      y:.5,
      s:.07
    },
    {
      x:1.5,
      y:.5,
      s:.04
    }
    ];
  ctx.strokeStyle="#CCC";
  for(let i=1;i<hornPoints.length;i++){
    const x1 = hornPoints[i-1].x*scale;
    const y1 = hornPoints[i-1].y*scale;
    const x2 = hornPoints[i].x*scale;
    const y2 = hornPoints[i].y*scale;
    
    ctx.lineWidth = hornPoints[i].s*scale;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    
    ctx.moveTo(x1,-y1);
    ctx.lineTo(x2,-y2);

    ctx.stroke();
  }
}

function DrawHighQualityBoss(unit, scale, rate){
  ctx.save();
  ctx.translate(unit.Location.x, unit.Location.y);
  
  const dx = unit.moveTarget?.x-unit.Location.x;
  const dy = unit.moveTarget?.y-unit.Location.y;
  const rot = isNaN(dx)||isNaN(dy)?0:Math.atan2(dy,dx);

  ctx.rotate(rot);
  const unitScale = scale/2;
  
  switch(unit.type){
    case "Death":
      hqDeath(unit, unitScale, rate);
      break;
    case "Famine":
      hqFamine(unit, unitScale*2, rate);
      break;
    case "Pestilence":
      hqPestilence(unit, unitScale*2, rate);
      break;
    case "War":
      hqWar(unit, unitScale, rate);
      break;
  }

	ctx.restore();
  unit.DrawHUD();
}