"use strict";

function hqDeath(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
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
	
	const ad = unit.lastAttack/unit.CalculateEffect(statTypes.attackDelay)*10;
	
	const focus = 4.75+phase;
	const staff = ad>1?(1.5+phase):ad*(1.5+phase);
	
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
	ctx.strokeStyle="#BB8";
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
function hqFamine(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
	unit.drawCycle=(unit.drawCycle+1)%(phaseTime);
	const p0 = (Math.abs(unit.drawCycle-(phaseTime/2))-phaseTime/4)/phaseTime;
	const p1 = (Math.abs((unit.drawCycle+phaseTime*3/4)%phaseTime-(phaseTime/2))-phaseTime/4)/phaseTime;
	
	const w = scale;
	const l = scale*2;
	
	const armw = scale/12;
	const fingw = armw/2;
	const fingl = scale/5;

	const rhx = l*.525;
	const rhy = w*1.9;
	const lhx = l*.525;
	const lhy = -w*1.9;

	ctx.strokeStyle = "#EFBA21";
	ctx.fillStyle = "#EFBA21";
	//scale in right hand
	ctx.lineWidth=armw/2;
	ctx.beginPath();
	ctx.moveTo(rhx+armw*2, rhy+armw);
	ctx.lineTo(rhx-l*.2,rhy+armw);
	
	ctx.moveTo(rhx-l*.65,rhy+armw+l*.55);
	ctx.lineTo(rhx-l*.35,rhy+armw+l*.4);
	ctx.lineTo(rhx-l*.65,rhy+armw+l*.25);

	ctx.moveTo(rhx-l*.65,rhy+armw-l*.55);
	ctx.lineTo(rhx-l*.35,rhy+armw-l*.4);
	ctx.lineTo(rhx-l*.65,rhy+armw-l*.25);
	ctx.stroke();

	ctx.lineWidth=armw;
	ctx.beginPath();
	ctx.arc(rhx-l, rhy+armw, l*.8, -.55, .55);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(rhx-l/2, rhy+armw+l*.4, l*.2, Math.PI-1, Math.PI+1);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(rhx-l/2, rhy+armw-l*.4, l*.2, Math.PI-1, Math.PI+1);
	ctx.fill();


	ctx.lineWidth=armw;
	ctx.strokeStyle = "#BB8";
	//L arm
	ctx.beginPath();
	ctx.moveTo(l*.65,-w*1.4);
	ctx.lineTo(l*.55,-w*1.9);
	ctx.lineTo(l*.5,-w*1.9);
	ctx.lineTo(l*.6,-w*1.4);
	
	//R arm
	ctx.moveTo(l*.65,w*1.4);
	ctx.lineTo(l*.55,w*1.9);
	ctx.lineTo(l*.5,w*1.9);
	ctx.lineTo(l*.6,w*1.4);
	ctx.stroke();
	
	ctx.lineWidth = fingw;
	//R hand
	ctx.beginPath();
	ctx.moveTo(rhx-armw,rhy);
	ctx.lineTo(rhx-armw,rhy+fingl*.7);
	
	ctx.moveTo(rhx-armw+fingw*2,rhy);
	ctx.lineTo(rhx-armw+fingw*2,rhy+fingl*.7);
	
	ctx.moveTo(rhx+armw,rhy);
	ctx.lineTo(rhx+armw,rhy+fingl*.7);
	
	ctx.moveTo(rhx+armw,rhy);
	ctx.lineTo(rhx+armw*2,rhy);
	ctx.stroke();
	
	//L hand
	ctx.beginPath();
	ctx.moveTo(lhx-armw,lhy);
	ctx.lineTo(lhx-armw,lhy-fingl);
	
	ctx.moveTo(lhx-armw+fingw*2,lhy);
	ctx.lineTo(lhx-armw+fingw*2,lhy-fingl);
	
	ctx.moveTo(lhx+armw,lhy);
	ctx.lineTo(lhx+armw,lhy-fingl);
	
	ctx.moveTo(lhx+armw,lhy);
	ctx.lineTo(lhx+armw*2.5,lhy);
	ctx.stroke();

	ctx.fillStyle=unit.color2+'77';
	ctx.strokeStyle=unit.color;
	//Extra tattered spikey tails
	ctx.beginPath();
	ctx.moveTo(0,-w);
	ctx.lineTo(-l*.7,-w*.9+w*p1);
	ctx.lineTo(-l*1.5,-w*.8+w*p0*1.5);
	ctx.lineTo(-l*.7,-w*.7+w*p1);

	ctx.lineTo(0,-w*.6);

	ctx.lineTo(-l*.7,-w*.5-w*p1);
	ctx.lineTo(-l*1.7,-w*.4-w*p0*1.5);
	ctx.lineTo(-l*.7,-w*.3-w*p1);

	ctx.lineTo(0,-w*.2);

	ctx.lineTo(-l*.6,-w*.1-w*p0);
	ctx.lineTo(-l*1.3,w*0-w*p1*1.5);
	ctx.lineTo(-l*.6,w*.1-w*p0);

	ctx.lineTo(0,w*.2);

	ctx.lineTo(-l*.8,w*.3+w*p1);
	ctx.lineTo(-l*1.9,w*.4+w*p0*1.5);
	ctx.lineTo(-l*.8,w*.5+w*p1);

	ctx.lineTo(0,w*.6);

	ctx.lineTo(-l*.6,w*.7-w*p0);
	ctx.lineTo(-l*1.3,w*.8-w*p1*1.5);
	ctx.lineTo(-l*.6,w*.9-w*p0);

	ctx.lineTo(0,w);

	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle=unit.color2+'99';
	ctx.strokeStyle=unit.color;
	//Extra tattered spikey tails
	ctx.beginPath();
	ctx.moveTo(0,-w*.8);
	ctx.lineTo(-l*.7,-w*.7-w*p0);
	ctx.lineTo(-l*1.4,-w*.6-w*p1*1.5);
	ctx.lineTo(-l*.7,-w*.5-w*p0);

	ctx.lineTo(0,-w*.4);

	ctx.lineTo(-l*.7,-w*.3+w*p1);
	ctx.lineTo(-l*1.6,-w*.2+w*p0*1.5);
	ctx.lineTo(-l*.7,-w*.1+w*p1);

	ctx.lineTo(0,0);

	ctx.lineTo(-l*.7,w*.1-w*p0);
	ctx.lineTo(-l*1.5,w*.2-w*p1*1.5);
	ctx.lineTo(-l*.7,w*.3-w*p0);

	ctx.lineTo(0,w*.4);

	ctx.lineTo(-l*.8,w*.5-w*p1);
	ctx.lineTo(-l*1.6,w*.6-w*p0*1.5);
	ctx.lineTo(-l*.8,w*.7-w*p1);

	ctx.lineTo(0,w*.8);

	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle=unit.color2;
	ctx.strokeStyle=unit.color;
	
	//body: wraith-like with tattered robes
	ctx.beginPath();
	ctx.moveTo(l,-w/2);
	//Head
	ctx.lineTo(l*1.2,-w*.4);
	ctx.lineTo(l*1.3,-w*.2);
	
	ctx.lineTo(l*1.3,w*.2);
	ctx.lineTo(l*1.2,w*.4);
	
	ctx.lineTo(l,w/2);
	//R arm
	ctx.lineTo(l*.7,w*1.5);
	ctx.lineTo(-l,w*1.5+w*p1);
	ctx.lineTo(-l/2,w+w*p0);

	ctx.lineTo(-l*.2,w*.7-w*p0);
	ctx.lineTo(-l*.8,w*.6-w*p1);
	ctx.lineTo(-l*1.2,w*.5+w*p0*2);//tail tip
	ctx.lineTo(-l*.8,w*.4-w*p1);
	ctx.lineTo(-l*.2,w*.3-w*p0);
	
	ctx.lineTo(-l*.2,w*.2-w*p0);
	ctx.lineTo(-l*.8,w*.1-w*p1);
	ctx.lineTo(-l*1.5,w*p0*2);//tail tip
	ctx.lineTo(-l*.8,-w*.1-w*p1);
	ctx.lineTo(-l*.2,-w*.2-w*p0);
	
	//L arm
	ctx.lineTo(-l/2,-w-w*p0);
	ctx.lineTo(-l,-w*1.5-w*p1);
	ctx.lineTo(l*.7,-w*1.5);
	
	ctx.closePath();
	ctx.fill();
}

function locust(unit, scale, p0, p1) {
	ctx.strokeStyle=unit.color2;
	ctx.fillStyle=unit.color;
	ctx.lineWidth=1;//scale/24;
	
	const lw = scale/16;
	const ll = scale*.4;
	
	ctx.beginPath();
	ctx.moveTo(ll,0);
	ctx.lineTo(ll*.8,lw*.8);
	ctx.lineTo(0,lw);
	ctx.lineTo(-ll,0);
	ctx.lineTo(0,-lw);
	ctx.lineTo(ll*.7,-lw*.8);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	//back legs
	ctx.moveTo(-ll/2,lw/2);
	ctx.lineTo(-ll,lw);
	ctx.lineTo(-ll*1.5,lw);
	
	ctx.moveTo(-ll/2,-lw/2);
	ctx.lineTo(-ll,-lw);
	ctx.lineTo(-ll*1.5,-lw);
	
	//mid legs
	ctx.moveTo(0,lw);
	ctx.lineTo(-ll/4,lw*1.5);
	ctx.lineTo(-ll*.7,lw*2);
	
	ctx.moveTo(0,-lw);
	ctx.lineTo(-ll/4,-lw*1.5);
	ctx.lineTo(-ll*.7,-lw*2);
	
	//front legs
	ctx.moveTo(ll/2,lw);
	ctx.lineTo(ll*.7,lw*1.5);
	ctx.lineTo(ll,lw*2);
	
	ctx.moveTo(ll/2,-lw);
	ctx.lineTo(ll*.7,-lw*1.5);
	ctx.lineTo(ll,-lw*2);
	
	
	//antennea
	ctx.moveTo(ll*.8,lw*.7);
	ctx.lineTo(ll,lw*.7);
	ctx.lineTo(ll*1.3,lw*2);
	
	ctx.moveTo(ll*.8,-lw*.7);
	ctx.lineTo(ll,-lw*.7);
	ctx.lineTo(ll*1.3,-lw*2);
	ctx.stroke();
	
	//wings
	const ww = ll*2;
	ctx.beginPath();
	ctx.moveTo(ll*.5,lw*.8);
	ctx.lineTo(ll*.7,ww*p0);
	ctx.arc(ll*.6,ww*.8*p0,ll*.2,halfPi,Math.PI);
	ctx.lineTo(ll*.3,lw*.8);
	ctx.closePath();
	
	ctx.moveTo(ll*.5,-lw*.8);
	ctx.lineTo(ll*.7,-ww*p0);
	ctx.arc(ll*.6,-ww*.8*p0,ll*.2,halfPi*3,Math.PI,1);
	ctx.lineTo(ll*.3,-lw*.8);
	ctx.closePath();
	
	ctx.moveTo(ll*.2,lw*.9);
	ctx.lineTo(ll*.2,ww*p1);
	ctx.arc(ll*.1,ww*.8*p1,ll*.2,halfPi,Math.PI);
	ctx.lineTo(-ll*.5,lw);
	ctx.closePath()
	
	ctx.moveTo(ll*.2,-lw*.9);
	ctx.lineTo(ll*.2,-ww*p1);
	ctx.arc(ll*.1,-ww*.8*p1,ll*.2,halfPi*3,Math.PI,1);
	ctx.lineTo(-ll*.5,-lw);
	ctx.closePath()
	ctx.fill();
	
}
function swarm(unit, scale) {
	const fogTime=800;
	const q = fogTime/4;
	const fog = [];
	for(let i=0;i<5;i++){
		const f = (Math.abs(((unit.drawCycle+i*q)%fogTime)-(fogTime/2)))/fogTime;
		fog.push(f);
	}
	
	const steps = 18;
	const fogDelta = twoPi/steps;
	ctx.fillStyle=unit.color+"3";
	ctx.beginPath();
	for(let i=0;i<steps;i++){
		const p = (fog[i%fog.length]*scale/2)+scale;
		const x = Math.cos(fogDelta*i)*p;
		const y = Math.sin(fogDelta*i)*p;
		ctx.lineTo(x,y,scale/2,0,twoPi);
	}
	ctx.closePath();
	ctx.fill();
	
	const t0 = 400;
	const t1 = 128;
	const t2 = 240;
	const t3 = 365;
	const p0 = ((unit.drawCycle%t0)/t0)*twoPi;
	const p1 = ((unit.drawCycle%t1)/t1)*twoPi;
	const p2 = ((unit.drawCycle%t2)/t2)*twoPi;
	const p3 = ((unit.drawCycle%t3)/t3)*twoPi;
	const p = [p0,p1,p2,p3,p2,p1];
	
	ctx.fillStyle = unit.color2;
	const s = scale/18;
	
	const a = [scale/8,-scale/4,-scale/2,-scale/8,scale/4,-scale/8];
	const b = [-scale/4,scale/8,-scale/4, -scale/4,scale/2,scale/3];
	const arx = [5,6,4,5,3,7];
	const ary = [3,7,5,3,7,4];
	ctx.beginPath();
	for(let i=0;i<6;i++){
		for(let j=2;j<4;j++){
			const dir = i>3?1:-1;
			const x = a[i] + Math.cos(p[i]*j*dir)*scale*(j/arx[i]);
			const y = b[i] + Math.sin(p[i]*j*dir)*scale*(j/ary[i]);
			ctx.fillRect(x,y,s,s);
		}
	}
}
function hqPestilence(unit, scale) {
	scale *= 2;
	const phaseTime = 16777216;
	unit.drawCycle=(unit.drawCycle+(unit.moving?1:.5))%(phaseTime);
	ctx.fillStyle=unit.color;
	
	swarm(unit, scale+1.5);
	
	const pt0 = 10;
	const p0 = Math.abs((unit.drawCycle%pt0)-(pt0/2))/pt0*1.5+.25;
	const pt1 = 5;
	const p1 = Math.abs((unit.drawCycle%pt1)-(pt1/2))/pt1*2;
	
	ctx.translate(scale/4,0);
	locust(unit, scale/2, p0, p1);
	ctx.translate(-scale/2,scale/3);
	locust(unit, scale/4, p0, p1);
	ctx.translate(0,-scale);
	locust(unit, scale/3, p0, p1);
	ctx.translate(scale*.7,0);
	locust(unit, scale/4, p0, p1);
	
	
}
function hqWar(unit, scale) {
	scale *= 1.2;
	ctx.translate(-scale,0);
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
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
	
	
	const ad = unit.lastAttack/unit.CalculateEffect(statTypes.attackDelay)*5;
	
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
	const rRot = rot*(unit.attackHand&&ad<1?(ad-.5)*2:1);
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
	const lRot = rot*(!unit.attackHand&&ad<1?(ad-.5)*2:1);
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

function DrawHighQualityBoss(unit, scale){
	ctx.save();
	ctx.translate(unit.Location.x, unit.Location.y);
	
	const dx = unit.moveTarget?.x-unit.Location.x;
	const dy = unit.moveTarget?.y-unit.Location.y;
	const rot = isNaN(dx)||isNaN(dy)?0:Math.atan2(dy,dx);
	
	const unitScale = scale/3;
	
	switch(unit.type){
		case "Death": {
			hqDeath(unit, unitScale);
			break;
		}
		case "Famine": {
			hqFamine(unit, unitScale);
			break;
		}
		case "Pestilence": {
			hqPestilence(unit, unitScale);
			break;
		}
		case "War": {
			hqWar(unit, unitScale);
			break;
			}
	}
	
	ctx.restore();
	unit.DrawHUD();
}