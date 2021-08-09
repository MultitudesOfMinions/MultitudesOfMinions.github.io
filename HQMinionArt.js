"use strict";



const turtleMove=(minion, scale)=>{
  const loc = minion.Location;
  const moveSpeed = minion.CalculateEffect(statTypes.moveSpeed)/scale;
  const phaseTime = 70;
  const phase = (Math.abs(minion.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
  const cycle2 = (minion.drawCycle+phaseTime/4)%(phaseTime)
  const phase2 = (Math.abs(cycle2-(phaseTime/2))-(phaseTime/4))/phaseTime;
  minion.drawCycle=(minion.drawCycle+1)%(phaseTime);

  ctx.strokeStyle=minion.color2;
  ctx.fillStyle=minion.color2;

  //head
  ctx.beginPath();
  ctx.arc(scale*1.7,0,scale/2,0,twoPi);
  ctx.fill();

  //legs
  const a = phase*scale;
  const b = phase2*scale;
  const foot = scale/4;
  const leg = scale;
  const gap = scale*2;
  ctx.lineWidth=foot;
  
  for(let i=0;i<2;i++){
    let x = a;
    //This is from when I made them bugs with a bunch of legs instead of turtles. My wife didn't like the bugs.
    switch(i%4){
      case 0:
        x=a;
        break;
      case 1:
        x=-b;
        break;
      case 2:
        x=-a;
        break;
      case 3:
        x=b;
        break;
    }

    ctx.beginPath();
    ctx.moveTo(scale-(gap*i), 0);
    ctx.lineTo(scale-(gap*i)+x,leg);
    ctx.moveTo(scale-(gap*i),0);
    ctx.lineTo(scale-(gap*i)-x,-leg);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(scale-(gap*i)+x,leg, foot, 0, twoPi);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(scale-(gap*i)-x,-leg, foot, 0, twoPi);
    ctx.fill();
    
    //This is how you make bug legs
    //ctx.moveTo(scale-(gap*i)+x,leg);
    //ctx.lineTo(scale-(gap*i)-x,-leg);
  }
  ctx.fill();
  
  //body
  ctx.fillStyle=minion.color;
  ctx.beginPath();
  ctx.ellipse(0,0,scale*1.5,scale,0,0,twoPi);
  ctx.fill();
  
  ctx.strokeStyle="#000";
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(0,scale);
  ctx.lineTo(0,-scale);
  ctx.moveTo(scale*1.5,0);
  ctx.lineTo(scale*-1.5,0);
  ctx.stroke();
  

}
const wormMove=(minion, scale)=>{
  const loc = minion.Location;
  const moveSpeed = minion.CalculateEffect(statTypes.moveSpeed)/scale;
  const phaseTime = 70;
  const phase = (Math.abs(minion.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
  minion.drawCycle=(minion.drawCycle+1)%(phaseTime);

  ctx.strokeStyle=minion.color;

  ctx.lineWidth=scale/2;
  
  const gap = scale;
  const m = phase*gap;
  ctx.beginPath();
  ctx.moveTo(m,0);
  ctx.lineTo(-m+scale*2,0);
  ctx.stroke();
}
const underlingMove=(minion, scale)=>{turtleMove(minion,scale);}


const miteHead=(scale)=>{
  ctx.beginPath();
  ctx.arc(0, 0, scale, 0, twoPi);
  ctx.moveTo(-scale,-2*scale);
  ctx.lineTo(scale/2,-scale/4);
  ctx.lineTo(scale*1.5,0);
  ctx.lineTo(scale/2,scale/4);
  ctx.lineTo(-scale,2*scale);
  ctx.lineTo(-scale/2,0);
  ctx.closePath();
  ctx.fill();
}
const miteMove=(minion, scale)=>{
  const loc = minion.Location;
  const moveSpeed = minion.CalculateEffect(statTypes.moveSpeed)/scale;
  const phaseTime = 20*moveSpeed**-.5;
  const phase = (Math.abs(minion.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
  minion.drawCycle=(minion.drawCycle+1)%(phaseTime);
  
  //R foot
  ctx.beginPath();
  ctx.fillStyle=minion.color2;
  const rx = (phase)*scale;
  const ry = scale/2;
  ctx.ellipse(rx,ry,scale/2,scale,-1.5,0,twoPi);
  ctx.fill();
  
  //L foot
  ctx.beginPath();
  ctx.fillStyle=minion.color2;
  const lx = (-phase)*scale;
  const ly = -scale/2;
  ctx.ellipse(lx,ly,scale/2,scale,1.5,0,twoPi);
  ctx.fill();
  
  
  const handX = (-phase)*scale;
  const handY = scale*1.3;
  const handSize = scale/8;
  
  const ar = minion.CalculateEffect(statTypes.attackRate);
  if(ar<=minion.lastAttack){
    ctx.fillStyle="#555"
    ctx.beginPath();
    ctx.moveTo(handX,handY-handSize);
    ctx.lineTo(handX+scale,handY-handSize);
    ctx.lineTo(handX+scale*.7,handY+handSize);
    ctx.lineTo(handX,handY+handSize);
    ctx.closePath();
    ctx.fill();
  }

  ctx.beginPath();
  ctx.fillStyle=minion.color;
  
  ctx.arc(handX, handY, handSize*3, 0, twoPi);
  ctx.arc(-handX, -handY, handSize*3, 0, twoPi);
  ctx.fill();
  
  miteHead(scale);
}
const miteWait=(minion, scale)=>{
  //feet
  ctx.beginPath();
  ctx.fillStyle=minion.color2;
  const y = scale/2;
  ctx.ellipse(scale/4,y,scale/2,scale,-1.5,0,twoPi);
  ctx.ellipse(scale/4,-y,scale/2,scale,1.5,0,twoPi);
  ctx.fill();
  
  //dagger
  const handDelta = scale/12;
  const handY = scale*1.3;
  const handSize = scale/8;
  ctx.fillStyle="#555"
  ctx.beginPath();
  ctx.moveTo(handDelta,handY-handSize);
  ctx.lineTo(handDelta+scale,handY-handSize);
  ctx.lineTo(handDelta+scale*.7,handY+handSize);
  ctx.lineTo(handDelta,handY+handSize);
  ctx.closePath();
  ctx.fill();


  ctx.beginPath();
  ctx.fillStyle=minion.color;
  
  //hands
  ctx.arc(handDelta, handY, handSize*3, 0, twoPi);
  ctx.arc(handDelta, -handY, handSize*3, 0, twoPi);
  ctx.fill();
  
  miteHead(scale);
}
const miteReload=(minion, scale)=>{
  const ar = minion.CalculateEffect(statTypes.attackRate);
  
  const reloadPct = Math.min(1,(ar-minion.lastAttack)/ar);
  //feet
  ctx.beginPath();
  ctx.fillStyle=minion.color2;
  const y = scale/2;
  const rfx = scale/(4-reloadPct*2);
  ctx.ellipse(rfx,y,scale/2,scale,-1.5,0,twoPi);
  ctx.ellipse(scale/4,-y,scale/2,scale,.5+(1-reloadPct),0,twoPi);
  ctx.fill();
  
  const handDelta = scale/12;
  const handY = scale*1.3;
  const handSize = scale/8;

  ctx.beginPath();
  ctx.fillStyle=minion.color;
  //right
  const rhx = reloadPct*scale;
  ctx.arc(handDelta+rhx, handY, handSize*3, 0, twoPi);
  
  //left
  ctx.arc(handDelta, -handY, handSize*3, 0, twoPi);
  ctx.fill();

  miteHead(scale);
}

const impMove=(minion, scale)=>{}
const impWait=(minion, scale)=>{}
const impReload=(minion, scale)=>{}

function DrawHighQualityMinion(minion, scale){

  ctx.save();
  const dx = minion.moveTarget?.x-minion.Location.x;
  const dy = minion.moveTarget?.y-minion.Location.y;
  const rot = isNaN(dx)||isNaN(dy)?0:Math.atan2(dy,dx);
  ctx.translate(minion.Location.x, minion.Location.y);
  ctx.rotate(rot);
  
  const minionScale = .6;
  
  if(minion.moving){
    switch(minion.type){
      case "Underling":
        underlingMove(minion, scale/2);
        break;
      case "Mite":
        miteMove(minion, scale*minionScale);
        break;
      default:
        ctx.restore();
        minion.Draw();
        return;
    }
  }
  else if(minion.waiting){
    switch(minion.type){
      case "Mite":
        miteWait(minion, scale*minionScale);
        break;
      default:
        ctx.restore();
        minion.Draw();
        return;
    }
  }
  else{//reloading
    switch(minion.type){
      case "Mite":
        miteReload(minion, scale*minionScale);
        break;
      default:
        ctx.restore();
        minion.Draw();
        return;
    }
  }
	ctx.restore();
  minion.DrawHUD();
}
