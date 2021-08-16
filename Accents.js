"use strict";

function ManageAccents(){
	for(let i=0; i< accents.length;i++){
		if(accents[i].Location.x < path[0].x){
			accents.splice(i,1);
			i--;
		}
	}
}

function Accent(type, loc){
  this.type = type
  this.loc = loc;
}

function addAccent(){
  const x = accents.reduce((a,b) => (a > b.loc?.x) ? a : b.loc.x,0)+gameW/50;

  const gorp = Math.random() < .7;
	const hew = pathW/2;

  const py = getPathYatX(x);
  //console.log(x,py);
  const minY = py-hew;
  const maxY = py+hew;
  const exclusions = {min:minY,max:maxY*1.2};
  const y = gorp? getRandomInt(minY,maxY):getRandomIntExclusions(getScale(),gameH,exclusions);
  
  const loc = new point(x,y);
  
  const pathTypes = ["pebble0", "pebble1", "pebble2", "pebble3"];
  const grassTypes = ["grass0", "grass0", "grass1", "grass2", "grass2", "grass3", "grass3"];
  
  let type = pathTypes[0];
  if(gorp){
    type = pickOne(pathTypes);
  }
  else{
    type = pickOne(grassTypes);
  }
  
  accents.push(new Accent(type, loc));
}

Accent.prototype.Recenter = function(RecenterDelta){
	this.loc.x -= RecenterDelta;
}
Accent.prototype.draw=function(scale){
  ctx.save();
  ctx.translate(this.loc.x, this.loc.y);
  const pRot = this.loc.y%6;
  switch(this.type){
    case "pebble0":
      ctx.beginPath();
      ctx.fillStyle="#7775";
      ctx.ellipse(0,0,scale/16,scale/12,pRot,0,twoPi);
      ctx.fill();
      break;
    case "pebble1":
      ctx.beginPath();
      ctx.fillStyle="#7655";
      ctx.ellipse(0,0,scale/10,scale/16,pRot,0,twoPi);
      ctx.fill();
      break;
    case "pebble2":
      ctx.beginPath();
      ctx.fillStyle="#5565";
      ctx.ellipse(0,0,scale/10,scale/8,pRot,0,twoPi);
      ctx.fill();
      break;
    case "pebble3":
      ctx.beginPath();
      ctx.fillStyle="#2225";
      ctx.ellipse(0,0,scale/8,scale/10,pRot,0,twoPi);
      ctx.fill();
      break;
    case "grass0":
      ctx.lineWidth=scale/16;
      ctx.strokeStyle="#0709";
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-scale/8,-scale/4);
      ctx.moveTo(0,0);
      ctx.lineTo(scale/4,-scale/8);
      ctx.moveTo(0,0);
      ctx.lineTo(scale/12,-scale/3);
      ctx.stroke();
      break;
    case "grass1":
      ctx.lineWidth=scale/16;
      ctx.strokeStyle="#0508";
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-scale/10,-scale/8);
      ctx.moveTo(0,0);
      ctx.lineTo(0,-scale/3);
      ctx.moveTo(0,0);
      ctx.lineTo(scale/8,-scale/6);
      ctx.stroke();
      break;
    case "grass2":
      ctx.lineWidth=scale/16;
      ctx.strokeStyle="#090D";
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-scale/10,-scale/4);
      ctx.moveTo(0,0);
      ctx.lineTo(0,-scale/5);
      ctx.moveTo(0,0);
      ctx.lineTo(scale/8,-scale/6);
      ctx.stroke();
      break;
    case "grass3":
      ctx.lineWidth=scale/16;
      ctx.strokeStyle="#090D";
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(0,-this.loc.y%(scale/2));
      ctx.moveTo(0,0);
      ctx.lineTo(this.loc.y%(scale/4),-scale/6);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

