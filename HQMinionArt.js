"use strict";

function turtle(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 80;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	const cycle2 = (unit.drawCycle+phaseTime/4)%(phaseTime)
	const phase2 = (Math.abs(cycle2-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	ctx.strokeStyle=unit.color2;
	ctx.fillStyle=unit.color2;
	
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
	ctx.fillStyle=unit.color;
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
function worm(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 65;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	ctx.strokeStyle=unit.color2;
	
	ctx.lineWidth=scale/2;
	
	const gap = scale*4;
	const m = phase*gap;
	ctx.beginPath();
	ctx.moveTo(m,0);
	ctx.lineTo(-m+scale*4,0);
	ctx.stroke();
}
function butterfly(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 59;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	
	ctx.strokeStyle="#000";
	
	//antennae
	ctx.lineWidth=scale/8;
	ctx.beginPath();
	ctx.moveTo(scale*2,scale/3);
	ctx.lineTo(scale,0);
	ctx.lineTo(scale*2,scale/-3);
	ctx.stroke();
	
	//body
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(scale,0);
	ctx.lineTo(-scale,0);
	
	//leading wing border
	ctx.moveTo(scale/2,scale+phase*scale*4);
	ctx.lineTo(scale,0);
	ctx.lineTo(scale/2,-scale-phase*scale*4);
	ctx.stroke();
	
	//orange wing part
	ctx.fillStyle="#F70";
	ctx.beginPath();
	ctx.moveTo(scale,scale/8);
	ctx.lineTo(scale/2,scale+phase*scale*4);
	ctx.lineTo(-scale*2,scale/4);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(scale,-scale/8);
	ctx.lineTo(scale/2,-scale-phase*scale*4);
	ctx.lineTo(-scale*2,-scale/4);
	ctx.closePath();
	ctx.fill();
	
	//outside wing border
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(scale/2,scale+phase*scale*4);
	ctx.lineTo(-scale*2,scale/4);
	
	ctx.moveTo(scale/2,-scale-phase*scale*4);
	ctx.lineTo(-scale*2,-scale/4);
	ctx.stroke();
	
	//wing dividers
	ctx.beginPath();
	ctx.moveTo(-scale,scale/2+phase*scale*2);
	ctx.lineTo(scale,0);
	ctx.lineTo(-scale,-scale/2-phase*scale*2);
	ctx.stroke();
	
}
function snake(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 50;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle)/phaseTime;
	
	ctx.strokeStyle=unit.color2;
	ctx.fillStyle=unit.color2;
	
	const headx = scale;
	
	ctx.beginPath();
	ctx.arc(headx,0,scale/2,0,twoPi);
	ctx.arc(headx+scale/2,0,scale/4,0,twoPi);
	ctx.fill();
	
	const amp = scale;
	const freq = scale/2;
	const shift = phase * twoPi
	ctx.lineWidth=scale/2;
	ctx.beginPath();
	ctx.moveTo(headx,0);
	for(let i=0;i<16;i++){
		const y = amp * Math.sin(i-shift)/Math.max(4-i/2,1);
		const x = headx-(freq*i);
		ctx.lineTo(x,y);
	}
	ctx.stroke();
	
}
function hqUnderling(unit, scale) {
	//Wife things having different types of underlings is too confusing.
	//Also the name underlings was too confusing so now they are just snakes.
	snake(unit,scale);
}

function hqMite(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
	unit.drawCycle=(unit.drawCycle+(unit.moving?1:0))%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	//R foot
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	const rx = (phase)*scale;
	const ry = scale/2;
	ctx.ellipse(rx,ry,scale/2,scale,-1.5,0,twoPi);
	ctx.fill();
	
	//L foot
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	const lx = (-phase)*scale;
	const ly = -scale/2;
	ctx.ellipse(lx,ly,scale/2,scale,1.5,0,twoPi);
	ctx.fill();
	
	
	const handX = (-phase)*scale;
	const handY = scale*1.3;
	const handSize = scale/8;
	
	const ar = unit.CalculateEffect(statTypes.attackRate);
	if(ar<=unit.lastAttack){
		ctx.fillStyle="#741"
		ctx.beginPath();
		ctx.moveTo(handX,handY-handSize);
		ctx.lineTo(handX+scale*2,handY-handSize);
		ctx.lineTo(handX+scale*1.7,handY+handSize);
		ctx.lineTo(handX,handY+handSize);
		ctx.closePath();
		ctx.fill();
	}
	
	ctx.beginPath();
	ctx.fillStyle=unit.color;
	
	ctx.arc(handX, handY, handSize*3, 0, twoPi);
	ctx.arc(-handX, -handY, handSize*3, 0, twoPi);
	ctx.fill();
	
	//head
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

function hqImp(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 60;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	const tPhase = Math.abs(unit.drawCycle)/phaseTime;
	
	ctx.fillStyle=unit.color;
	ctx.strokeStyle=unit.color;
	
	//horns&head
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.arc(scale*1.8,0,scale*.6,Math.PI*.2,-Math.PI*.2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(scale,0,scale/2,0,twoPi);
	ctx.fill();
	
	//body
	ctx.lineWidth=scale/2;
	ctx.beginPath();
	ctx.moveTo(-scale,0);
	ctx.lineTo(scale/2,0);
	ctx.stroke();
	
	//legs
	const p1 = phase;
	const p2 = (1-phase)
	const l1 = scale/2 * p1;
	const l2 = scale/2 * p2;
	const knee = 1.5;
	
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(-scale*2.5-l1,scale/2);
	ctx.lineTo(-scale*knee,scale/2);
	
	ctx.moveTo(-scale*2.5-l2,-scale/2);
	ctx.lineTo(-scale*knee,-scale/2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth=scale/2;
	ctx.lineTo(-scale*knee,scale/2);
	ctx.lineTo(-scale,scale/4);
	ctx.lineTo(-scale,0);
	ctx.lineTo(-scale,-scale/4);
	ctx.lineTo(-scale*knee,-scale/2);
	ctx.stroke();
	
	//tail
	const stepY = scale/8;
	const stepX = scale;
	const shift = tPhase * twoPi
	ctx.lineWidth=scale/4;
	ctx.strokeStyle=unit.color2;
	ctx.beginPath();
	let j=0;
	ctx.moveTo(-scale,0);
	for(let i=0;i<8;i++){
		const y = scale * Math.sin(i*stepY - shift)/Math.max(8-i,1);
		
		ctx.lineTo(-scale-(stepX+i*2),y);
		j=y;
	}
	ctx.stroke();
	
	//Right wing
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(scale,scale+scale*phase);
	ctx.lineTo(0,scale+scale*3*phase);
	ctx.lineTo(-scale*2,scale+scale*phase);
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/8;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(scale,scale+scale*phase);
	ctx.lineTo(-scale*2,scale+scale*phase);
	
	ctx.moveTo(scale*1.3,scale+scale*phase*.8)
	ctx.lineTo(0,scale+scale*3*phase);
	ctx.stroke();
	
	//Left wing
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(scale,-scale-scale*phase);
	ctx.lineTo(0,-scale-scale*3*phase);
	ctx.lineTo(-scale*2,-scale-scale*phase);
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/8;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(scale,-scale-scale*phase);
	ctx.lineTo(-scale*2,-scale-scale*phase);
	
	ctx.moveTo(scale*1.3,-scale-scale*phase*.8)
	ctx.lineTo(0,-scale-scale*3*phase);
	ctx.stroke();
	
}

function hqBomber(unit, scale) {
	ctx.fillStyle=unit.color;
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/8;
	
	//rudder
	ctx.beginPath();
	ctx.moveTo(-scale,0);
	ctx.lineTo(-scale*1.5,-scale*1.5);
	ctx.lineTo(-scale*2.5,-scale*1.5);
	ctx.lineTo(-scale*2,0);
	ctx.lineTo(-scale*2.5,scale*1.5);
	ctx.lineTo(-scale*1.5,scale*1.5);
	ctx.closePath();
	ctx.fill();
	
	//filled ellipse
	ctx.fillStyle=unit.color;
	ctx.beginPath();
	ctx.ellipse(0,0,scale*2,scale,0,0,twoPi);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(scale*2,0);
	ctx.lineTo(-scale*2,0);
	ctx.stroke();
	
	//stroke a couple elipses
	ctx.beginPath();
	ctx.ellipse(0,0,scale*2,scale/2,0,0,twoPi);
	ctx.stroke();
	
	//top rudder
	ctx.strokeStyle="#000";
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(-scale,0);
	ctx.lineTo(-scale*2.5,0);
	ctx.stroke();
}

function hqCatapult(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 60;
	unit.drawCycle=(unit.drawCycle+(unit.moving?1:0))%(phaseTime);
	const p1 = unit.drawCycle/phaseTime;
	const p2 = ((unit.drawCycle+phaseTime/4)%phaseTime)/phaseTime;
	const p3 = ((unit.drawCycle+phaseTime/2)%phaseTime)/phaseTime;
	const p4 = ((unit.drawCycle+phaseTime*3/4)%phaseTime)/phaseTime;
	
	const ar = unit.CalculateEffect(statTypes.attackRate);
	const reloadPct = Math.min(1,unit.lastAttack/ar);
	
	ctx.strokeStyle=unit.color2;
	
	//wheels
	ctx.beginPath();
	ctx.lineWidth=scale/2;
	const x1 = scale*1.5;
	const x2 = scale*.5;
	ctx.moveTo(-x1, -scale);
	ctx.lineTo(-x2,-scale);
	ctx.moveTo(x1,-scale);
	ctx.lineTo(x2,-scale);
	ctx.moveTo(-x1,scale);
	ctx.lineTo(-x2,scale);
	ctx.moveTo(x1,scale);
	ctx.lineTo(x2,scale);
	ctx.stroke();
	
	ctx.strokeStyle=unit.color;
	ctx.beginPath();
	ctx.lineWidth=scale/6;
	ctx.moveTo(-x1+scale*p1,-scale*5/4);
	ctx.lineTo(-x1+scale*p1,-scale*3/4);
	
	ctx.moveTo(-x1+scale*p3,scale*5/4);
	ctx.lineTo(-x1+scale*p3,scale*3/4);
	
	ctx.moveTo(x2+scale*p2,scale*5/4);
	ctx.lineTo(x2+scale*p2,scale*3/4);
	
	ctx.moveTo(x2+scale*p4,-scale*5/4);
	ctx.lineTo(x2+scale*p4,-scale*3/4);
	ctx.stroke();
	
	//frame
	ctx.beginPath();
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/4;
	const frameW = scale*6/8;
	ctx.moveTo(-scale,-frameW);
	ctx.lineTo(scale,-frameW);
	ctx.lineTo(scale,frameW);
	ctx.lineTo(-scale,frameW);
	
	ctx.moveTo(scale/4,-frameW);
	ctx.lineTo(scale/4,frameW);
	ctx.stroke();
	
	//launch arm
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	ctx.lineWidth=scale/2;
	const x = -reloadPct*scale;
	ctx.moveTo(scale,0);
	ctx.lineTo(x,0);
	ctx.stroke();
	ctx.arc(x,0,scale/2,0,twoPi);
	ctx.fill();
	
	if(reloadPct>.99){
		ctx.beginPath();
		ctx.fillStyle=unit.color;
		ctx.arc(x,0,scale/4,0,twoPi);
		ctx.fill();
	}
	
}

function hqGolem(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (600*moveSpeed**-.5)/17;
	unit.drawCycle=(unit.drawCycle+(unit.moving?1:0))%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	//R foot
	ctx.beginPath();
	ctx.lineWidth=scale;
	ctx.strokeStyle=unit.color2;
	const rx = phase*scale*2-scale*1.5;
	const ry = scale;
	ctx.moveTo(rx,ry);
	ctx.lineTo(rx+scale*2,ry);
	ctx.stroke();
	
	//L foot
	ctx.beginPath();
	const lx = -phase*scale*2-scale*1.5;
	const ly = -scale;
	ctx.moveTo(lx,ly);
	ctx.lineTo(lx+scale*2,ly);
	ctx.stroke();
	
	//hands
	ctx.beginPath();
	ctx.strokeStyle=unit.color2;
	const lhx = phase*scale*3-scale;
	const rhx = -phase*scale*3-scale;
	const lhy = -scale*1.5;
	const rhy = scale*1.5;
	ctx.moveTo(lhx,lhy);
	ctx.lineTo(lhx+scale,lhy-scale/2);
	
	ctx.moveTo(rhx,rhy);
	ctx.lineTo(rhx+scale,rhy+scale/2);
	ctx.stroke();
	
	//shoulders
	ctx.strokeStyle=unit.color;
	ctx.lineWidth=scale;
	const lsx=rx/2;
	const rsx=lx/2;
	ctx.beginPath();
	ctx.moveTo(lsx,ly-scale);
	ctx.lineTo(rsx,ry+scale);
	ctx.stroke();
	
	//head
	ctx.strokeStyle=unit.color;
	const r = scale;
	const hr = r*.7;
	ctx.beginPath();
	ctx.moveTo(-r,0);
	ctx.lineTo(r,0);
	ctx.moveTo(hr,-hr);
	ctx.lineTo(hr,hr);
	ctx.stroke();
}

function hqHarpy(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 65;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	const tPhase = Math.abs(unit.drawCycle)/phaseTime;
	
	//horns&beak
	ctx.fillStyle=unit.color2;
	ctx.beginPath();
	ctx.moveTo(scale,-scale/4);
	ctx.lineTo(scale*2,0);
	ctx.lineTo(scale,scale/4);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle=unit.color;
	ctx.beginPath();
	ctx.arc(scale,0,scale/2,0,twoPi);
	ctx.fill();
	
	//body
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/2;
	ctx.beginPath();
	ctx.moveTo(-scale,0);
	ctx.lineTo(scale/2,0);
	ctx.stroke();
	
	//legs
	const p1 = phase;
	const p2 = (1-phase)
	const l1 = scale/2 * p1;
	const l2 = scale/2 * p2;
	const footx=-scale*2;
	const footy=scale/3;
	
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(footx,footy);
	ctx.lineTo(-scale,0);
	ctx.lineTo(footx,-footy);
	ctx.stroke();
	
	//feet
	ctx.lineWidth=scale/10;
	const footw=scale/4;
	ctx.beginPath();
	ctx.moveTo(footx-scale/2,footy-footw);
	ctx.lineTo(footx,footy);
	ctx.lineTo(footx-scale/2,footy+footw);
	ctx.moveTo(footx,footy);
	ctx.lineTo(footx-scale/2,footy);
	
	ctx.moveTo(footx-scale/2,-footy-footw);
	ctx.lineTo(footx,-footy);
	ctx.lineTo(footx-scale/2,-footy+footw);
	ctx.moveTo(footx,-footy);
	ctx.lineTo(footx-scale/2,-footy);
	ctx.stroke();
	
	const tipx = scale;
	const tipy = scale+scale*phase*2;
	//Right wing
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(tipx,tipy);
	ctx.stroke();
	
	//Left wing
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/4;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(tipx,-tipy);
	ctx.stroke();
	
	//feathers
	const wingW=6+12*phase;
	const fDeltay = tipy/8;
	const fDeltax = tipx/8;
	ctx.lineWidth=fDeltay/2;
	ctx.strokeStyle=unit.color
	ctx.beginPath();
	for(let i=0;i<9;i++){
		const fy = i*fDeltay;
		const fx = -scale-scale*(8-i)/8
		ctx.moveTo(scale/10+i*fDeltax,fy);
		ctx.lineTo(fx,fy+fDeltay);
		ctx.moveTo(scale/10+i*fDeltax,-fy);
		ctx.lineTo(fx,-fy-fDeltay);
	}
	for(let i=2;i<9;i+=3){
		const fy = i*fDeltay;
		const fx = -scale-scale*(8-i)/8
		ctx.moveTo(scale/10+i*fDeltax,fy+fDeltay);
		ctx.lineTo(fx,fy-fDeltay);
		ctx.moveTo(scale/10+i*fDeltax,-fy-fDeltay);
		ctx.lineTo(fx,-fy+fDeltay);
	}
	
	
	ctx.stroke();
	
	ctx.beginPath();
	const asdf = 8;
	const fd = Math.PI/asdf;
	for(let i=1;i<asdf;i++){
		const fx = -scale*Math.cos(i*fd);
		const fy = tipy+scale*Math.sin(i*fd);
		ctx.moveTo(scale,tipy);
		ctx.lineTo(fx,fy);
		ctx.moveTo(scale,-tipy);
		ctx.lineTo(fx,-fy);
	}
	ctx.stroke();
	
	
}

function hqRam(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 60;
	unit.drawCycle=(unit.drawCycle+(unit.moving?1:0))%(phaseTime);
	const p1 = unit.drawCycle/phaseTime;
	const p2 = ((unit.drawCycle+phaseTime/4)%phaseTime)/phaseTime;
	const p3 = ((unit.drawCycle+phaseTime/2)%phaseTime)/phaseTime;
	const p4 = ((unit.drawCycle+phaseTime*3/4)%phaseTime)/phaseTime;
	
	const ar = unit.CalculateEffect(statTypes.attackRate);
	const reloadPct = Math.min(1,unit.lastAttack/ar);
	
	//wheels
	ctx.strokeStyle=unit.color;
	ctx.beginPath();
	ctx.lineWidth=scale/2;
	const x1 = scale*1.5;
	const x2 = scale*.5;
	ctx.moveTo(-x1, -scale);
	ctx.lineTo(-x2,-scale);
	ctx.moveTo(x1,-scale);
	ctx.lineTo(x2,-scale);
	ctx.moveTo(-x1,scale);
	ctx.lineTo(-x2,scale);
	ctx.moveTo(x1,scale);
	ctx.lineTo(x2,scale);
	ctx.stroke();
	
	ctx.strokeStyle=unit.color2;
	ctx.beginPath();
	ctx.lineWidth=scale/6;
	ctx.moveTo(-x1+scale*p1,-scale*5/4);
	ctx.lineTo(-x1+scale*p1,-scale*3/4);
	
	ctx.moveTo(-x1+scale*p3,scale*5/4);
	ctx.lineTo(-x1+scale*p3,scale*3/4);
	
	ctx.moveTo(x2+scale*p2,scale*5/4);
	ctx.lineTo(x2+scale*p2,scale*3/4);
	
	ctx.moveTo(x2+scale*p4,-scale*5/4);
	ctx.lineTo(x2+scale*p4,-scale*3/4);
	ctx.stroke();
	
	//Ram
	ctx.lineWidth=scale/2;
	ctx.beginPath();
	ctx.strokeStyle=unit.color;
	const tipx = scale*3.5-scale*reloadPct;
	ctx.moveTo(tipx,0);
	ctx.lineTo(tipx-scale*4,0);
	
	ctx.moveTo(tipx-scale/2,-scale/2);
	ctx.lineTo(tipx-scale/2, scale/2);
	ctx.stroke();
	
	//Roof
	ctx.fillStyle=unit.color2;
	ctx.beginPath();
	ctx.rect(-scale,-scale,scale*2,scale*2);
	ctx.fill();
	
	ctx.strokeStyle=unit.color;
	ctx.lineWidth=scale/12;
	ctx.beginPath();
	ctx.moveTo(-scale,0);
	ctx.lineTo(scale,0);
	ctx.stroke();
}

function hqVampire(unit, scale) {
	if(unit.moving){
		vampireMove(unit,scale);
	}
	else{
		vampireWait(unit, scale);
	}
}
function vampireMove(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 57;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	
	ctx.strokeStyle=unit.color2;
	ctx.fillStyle=unit.color2;
	
	//wings
	const winga=scale+phase*scale*4;
	const wingb=winga*.9;
	const wingc=winga*.85;
	const wingd=winga*.75;
	const winge=winga*.6;
	const wingf=winga*.3;
	const wingx = scale/2;
	const dx=scale/6;
	ctx.beginPath();
	ctx.moveTo(wingx,0);
	ctx.lineTo(wingx+dx*2,winge);
	ctx.lineTo(wingx-dx*0,winga);
	ctx.lineTo(wingx-dx*1,wingb);
	ctx.lineTo(wingx-dx*3,wingc);
	ctx.lineTo(wingx-dx*3,wingd);
	ctx.lineTo(wingx-dx*5,winge);
	ctx.lineTo(wingx-dx*5,wingf);
	ctx.lineTo(wingx-dx*8,0);
	ctx.lineTo(wingx,0);
	ctx.lineTo(wingx-dx*8,-0);
	ctx.lineTo(wingx-dx*5,-wingf);
	ctx.lineTo(wingx-dx*5,-winge);
	ctx.lineTo(wingx-dx*3,-wingd);
	ctx.lineTo(wingx-dx*3,-wingc);
	ctx.lineTo(wingx-dx*1,-wingb);
	ctx.lineTo(wingx-dx*0,-winga);
	ctx.lineTo(wingx+dx*2,-winge);
	ctx.closePath();
	ctx.fill();
	
	//head
	const headw = scale/4
	ctx.beginPath();
	ctx.moveTo(0,headw);
	ctx.lineTo(scale,headw);
	ctx.lineTo(scale*3/4,0);
	ctx.lineTo(scale,-headw);
	ctx.lineTo(0,-headw);
	ctx.closePath();
	ctx.fill();
	
}
function vampireWait(unit, scale) {
	
	//cape
	ctx.fillStyle=unit.color2;
	ctx.beginPath();
	ctx.moveTo(0,-scale);
	ctx.lineTo(0,scale);
	ctx.arc(0,0,scale,Math.PI/2,-Math.PI/2);
	ctx.fill();
	
	//head
	ctx.beginPath();
	ctx.fillStyle=unit.color;
	ctx.arc(0,0,scale/2,0,twoPi);
	ctx.fill();
	
	//face?
}

function hqAir(unit,scale) {
	const phaseTime = 17;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	
	const delta = -scale/16;
	let w = scale/16;
	
	const shift = phase * twoPi;
	ctx.lineWidth=scale/12;
	ctx.strokeStyle=unit.color2;
	ctx.beginPath();
	for(let i=0;i<32;i++){
		const x = w/2*Math.cos(i*delta-shift);
		
		ctx.moveTo(-w+x,i*delta);
		ctx.lineTo(w+x,i*delta);
		
		w*=1.1;
	}
	ctx.stroke();
	
	
	if(Math.random() > .9){
		const x1 = Math.random()/2*scale;
		const y1 = (.8+Math.random()/2)*-scale;
		
		const x2 = x1+(Math.random()-.5)*scale/4;
		const y2 = y1+Math.random()*scale;
		ctx.strokeStyle=unit.color;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}
	//make some lightningh flashes
}

function hqEarth(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = 59;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	
	const p = unit.drawCycle/phaseTime;
	
	const hex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','F'];
	const steps=4;
	const deltaf=16/steps;
	const gap = scale*1.5/steps;
	const deltax = (unit.moving?gap:0);
	
	for(let i=0;i<steps;i++){
		const fade = hex[Math.ceil((1-p)*deltaf)+(deltaf*i)];
		const r = gap*(p+steps-i);
		const x = (scale+deltax*(1-p-steps+i)/2)-scale;
		ctx.fillStyle=unit.color2+fade;
		ctx.beginPath();
		ctx.arc(x,0,r,0,twoPi);
		ctx.fill();
	}
	
	const q = scale/4;
	const h = scale/2;
	const d = h*.7;
	const x = unit.moving?scale:0;
	ctx.fillStyle=unit.color;
	ctx.strokeStyle=unit.color;
	
	//arms
	const handx = h;
	const handp = ((Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime)*q/2;
	
	ctx.beginPath();
	ctx.moveTo(-q+handp,q);
	ctx.lineTo(q+handp,h);
	ctx.lineTo(q+handp,h+q);
	ctx.lineTo(-h+handp,q);
	
	ctx.moveTo(-q-handp,-q);
	ctx.lineTo(q-handp,-h);
	ctx.lineTo(q-handp,-h-q);
	ctx.lineTo(-h-handp,-q);
	ctx.fill();
	
	//hands
	
	ctx.lineWidth = scale/16;
	ctx.beginPath();
	ctx.moveTo(handx+handp,h-q/2);
	ctx.lineTo(handx+handp,h+q);
	
	ctx.moveTo(handx-handp,-h+q/2);
	ctx.lineTo(handx-handp,-h-q);
	ctx.stroke();
	
	ctx.moveTo(handx+handp,h);
	ctx.lineTo(handx+q+handp,h);
	ctx.lineTo(handx+q*1.2+handp,h+q/2);
	ctx.lineTo(handx+q+handp,h+q);
	ctx.lineTo(handx+handp,h+q);
	ctx.closePath();
	
	ctx.moveTo(handx-handp,-h);
	ctx.lineTo(handx+q-handp,-h);
	ctx.lineTo(handx+q*1.2-handp,-h-q/2);
	ctx.lineTo(handx+q-handp,-h-q);
	ctx.lineTo(handx-handp,-h-q);
	ctx.closePath();
	
	ctx.fill();
	
	//head
	ctx.strokeStyle=unit.color2;
	ctx.lineWidth=scale/8;
	ctx.beginPath();
	ctx.moveTo(h,0);
	ctx.lineTo(d,d);
	ctx.lineTo(0,d);
	ctx.lineTo(-d,d);
	ctx.lineTo(-h,0);
	ctx.lineTo(-d,-d);
	ctx.lineTo(0,-d);
	ctx.lineTo(d,-d);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	
}

function hqFire(unit, scale) {
	const phaseTime = 55;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	
	const delta = -scale/16;
	let w = scale/8;
	const shift = phase * twoPi;
	
	ctx.lineWidth=scale/12;
	ctx.strokeStyle=unit.color;
	ctx.beginPath();
	for(let i=20;i<36;i++){
		const x = Math.cos(i*delta+shift);
		
		ctx.moveTo(-w+x,i*delta);
		ctx.lineTo(w+x,i*delta);
		
		w*=.92;
	}
	ctx.stroke();
	
	ctx.strokeStyle=unit.color2;
	w = scale;
	ctx.beginPath();
	for(let i=0;i<32;i++){
		const x = Math.cos(i*delta-shift);
		
		ctx.moveTo(-w+x+scale/2,i*delta);
		ctx.lineTo(w+x+scale/2,i*delta);
		
		ctx.moveTo(-w+x-scale/2,i*delta);
		ctx.lineTo(w+x-scale/2,i*delta);
		
		w*=.9;
	}
	ctx.stroke();
	
	ctx.lineWidth=delta/2;
	ctx.strokeStyle=unit.color+"7";
	w=scale/2;
	ctx.beginPath();
	for(let i=0;i<16;i++){
		const x = Math.cos(i*delta+shift);
		
		ctx.moveTo(-w+x+scale/2,i*delta);
		ctx.lineTo(w+x+scale/2,i*delta);
		
		ctx.moveTo(-w+x-scale/2,i*delta);
		ctx.lineTo(w+x-scale/2,i*delta);
		
		w*=.8;
	}
	ctx.stroke();
	
	
}

function hqWater(unit, scale) {
	const phaseTime = 70;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const phase = Math.abs(unit.drawCycle-(phaseTime/2))/phaseTime;
	
	const delta = scale/16;
	let w = scale;
	const shift = phase * twoPi;
	const x = w*Math.cos(shift);
	
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	ctx.moveTo(-scale*.7,-scale*.7);
	ctx.lineTo(x,-scale*2);
	ctx.lineTo(scale*.7,-scale*.7);
	ctx.closePath();

	ctx.arc(0,0,scale,0,twoPi);
	ctx.closePath();
	ctx.fill();
}

function DrawHighQualityMinion(unit, scale){
	
	ctx.save();
	const dx = unit.moveTarget?.x-unit.Location.x;
	const dy = unit.moveTarget?.y-unit.Location.y;
	const rot = isNaN(dx)||isNaN(dy)?0:Math.atan2(dy,dx);
	ctx.translate(unit.Location.x, unit.Location.y);
	const noRot = ["Air", "Fire", "Water"]
	if(!noRot.includes(unit.type)){ctx.rotate(rot);}
	
	const unitScale = scale*.6;
	
	switch(unit.type){
		case "Underling": {
			hqUnderling(unit, scale/4);
			break;
		}
		case "Mite": {
			hqMite(unit, unitScale*.7);
			break;
		}
		case "Imp": {
			hqImp(unit, unitScale*.7);
			break;
		}
		case "Bomber": {
			hqBomber(unit, unitScale*1.2);
			break;
		}
		case "Catapult": {
			hqCatapult(unit, unitScale*1.2);
			break;
		}
		case "Golem": {
			hqGolem(unit, unitScale*.9);
			break;
		}
		case "Harpy": {
			hqHarpy(unit, unitScale);
			break;
		}
		case "Ram": {
			hqRam(unit, unitScale*1.2);
			break;
		}
		case "Vampire": {
			hqVampire(unit, unitScale*.7);
			break;
		}
		case "Air": {
			hqAir(unit, unitScale*1.5);
			break;
		}
		case "Earth": {
			hqEarth(unit, unitScale*2);
			break;
		}
		case "Fire": {
			hqFire(unit, unitScale);
			break;
		}
		case "Water": {
			hqWater(unit, unitScale);
			break;
		}
	}
	
	ctx.restore();
	unit.DrawHUD();
}
