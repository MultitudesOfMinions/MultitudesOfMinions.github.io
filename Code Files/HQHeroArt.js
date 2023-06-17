

function hqCleric(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
	unit.drawCycle=(unit.drawCycle+unit.moving)%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	//Feet/robe
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	const rx = scale/4+(phase)*scale;
	const ry = scale/2;
	const lx = scale/4+(-phase)*scale;
	const ly = -scale/2;
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
	
	const ad = Math.max(0,unit.lastAttack)/unit.CalculateEffect(statTypes.attackDelay)*10;
	
	const focus = 4.75+phase;
	const staff = ad>1?(1.5+phase):ad*(1.5+phase);
	
	const rhx = Math.cos(staff)*scale;
	const rhy = Math.sin(staff)*scale*1.2;
	const handSize = scale/8;
	
	//staff
	ctx.fillStyle="#420";
	ctx.beginPath();
	ctx.moveTo(rhx-scale*2,rhy-handSize/2);
	ctx.lineTo(rhx+scale,rhy-handSize);
	ctx.lineTo(rhx+scale,rhy+handSize);
	ctx.lineTo(rhx-scale*2,rhy+handSize/2);
	ctx.closePath();
	ctx.fill();
	
	ctx.lineWidth=scale/4;
	ctx.strokeStyle=unit.color;
	ctx.beginPath();
	ctx.arc(rhx+scale*2,rhy,scale/4,0,twoPi);
	ctx.moveTo(rhx+scale,rhy);
	ctx.lineTo(rhx+scale*1.8,rhy);
	ctx.moveTo(rhx+scale*2,rhy+scale/4);
	ctx.lineTo(rhx+scale*2,rhy+scale);
	ctx.moveTo(rhx+scale*2,rhy-scale/4);
	ctx.lineTo(rhx+scale*2,rhy-scale);
	ctx.moveTo(rhx+scale*2.2,rhy);
	ctx.lineTo(rhx+scale*3,rhy);
	ctx.stroke();
	
	ctx.fillStyle="#753";
	ctx.beginPath();
	ctx.arc(rhx, rhy, handSize*3, 0, twoPi);
	ctx.fill();
	
	const lhx = Math.cos(focus)*scale;
	const lhy = Math.sin(focus)*scale*1.2;
	
	ctx.beginPath();
	ctx.arc(lhx, lhy, handSize*3, 0, twoPi);
	ctx.fill();
	
	//head
	const hood = scale*3/4;
	const hoodx = scale/8;
	ctx.fillStyle="#CCC";
	ctx.beginPath();
	ctx.arc(hoodx,0,hood,Math.PI/2,Math.PI*3/2,);
	ctx.lineTo(scale,-hood*.8);
	ctx.lineTo(scale,hood*.8);
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle=unit.color;
	ctx.beginPath();
	ctx.moveTo(scale,hood*.8);
	ctx.lineTo(scale,-hood*.8);
	ctx.stroke();
}
function hqMage(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
	unit.drawCycle=(unit.drawCycle+unit.moving)%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	//Feet/robe
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	const rx = scale/4+(phase)*scale;
	const ry = scale/2;
	const lx = scale/4+(-phase)*scale;
	const ly = -scale/2;
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
	
	const ad = Math.max(0,unit.lastAttack)/unit.CalculateEffect(statTypes.attackDelay)*10;
	
	const focus = 4.75+phase;
	const staff = ad>1?(1.5+phase):ad*(1.5+phase);
	
	const rhx = Math.cos(staff)*scale;
	const rhy = Math.sin(staff)*scale;
	const handSize = scale/8;
	
	ctx.fillStyle="#420";
	ctx.beginPath();
	ctx.moveTo(rhx-scale*2,rhy-handSize/2);
	ctx.lineTo(rhx+scale*1.5,rhy-handSize);
	ctx.lineTo(rhx+scale*1.5,rhy+handSize);
	ctx.lineTo(rhx-scale*2,rhy+handSize/2);
	ctx.closePath();
	ctx.fill();
	
	const pr = 500
	let pulse = (Date.now()/5)%pr
	pulse = Math.abs(pulse-pr/2)/pr;
	ctx.lineWidth=scale/8*(3*pulse+1);
	ctx.fillStyle=unit.color+"9";
	ctx.strokeStyle=unit.color;
	ctx.beginPath();
	ctx.arc(rhx+scale*2,rhy,scale/2,0,twoPi);
	ctx.stroke();
	ctx.fill();
	
	ctx.fillStyle=unit.color;
	ctx.beginPath();
	ctx.arc(rhx, rhy, handSize*3, 0, twoPi);
	ctx.fill();
	
	const lhx = Math.cos(focus)*scale;
	const lhy = Math.sin(focus)*scale;
	
	ctx.beginPath();
	ctx.arc(lhx, lhy, handSize*3, 0, twoPi);
	ctx.fill();
	
	ctx.fillStyle="#0003";
	ctx.strokeStyle="#0003";
	ctx.beginPath();
	ctx.arc(rhx, rhy, handSize*3, 0, twoPi);
	ctx.arc(lhx, lhy, handSize*3, 0, twoPi);
	ctx.fill();
	
	ctx.fillStyle=unit.color;
	ctx.beginPath();
	ctx.arc(0,0,scale,0,twoPi);
	ctx.fill();
	
	ctx.lineWidth=scale/8;
	ctx.beginPath();
	ctx.arc(0,0,scale/2,Math.PI/2,Math.PI*3/2,1);
	ctx.lineTo(-scale,0);
	ctx.closePath();
	ctx.stroke();
	
}
function hqKnight(unit, scale) {
	const moveSpeed = unit.CalculateEffect(statTypes.moveSpeed)/scale;
	const phaseTime = (340*moveSpeed**-.5)/17;
	unit.drawCycle=(unit.drawCycle+unit.moving)%(phaseTime);
	const phase = (Math.abs(unit.drawCycle-(phaseTime/2))-(phaseTime/4))/phaseTime;
	
	if(unit.moving){
		unit.block = phase+.25;
	}
	else{
		unit.drawCycle = phaseTime/2;
		unit.block=Math.max(0,unit.block-.1);
	}
	
	//R foot
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	const rx = scale/4+(phase)*scale;
	const ry = scale/2;
	ctx.ellipse(rx,ry,scale/2,scale,-1.5,0,twoPi);
	ctx.fill();
	
	//L foot
	ctx.beginPath();
	ctx.fillStyle=unit.color2;
	
	const lx = scale/4+(-phase)*scale;
	const ly = -scale/2;
	ctx.ellipse(lx,ly,scale/2,scale,1.5,0,twoPi);
	ctx.fill();
	
	//sword
	const ad = Math.max(0,unit.lastAttack)/unit.CalculateEffect(statTypes.attackDelay)*10;
	
	const shield =!unit.moving?(5.5-unit.block):(4.75+phase);
	const sword = ad>1?(1.5+phase):ad*(1.5+phase);
	
	const handX = Math.cos(sword)*scale;
	const handY = Math.sin(sword)*scale;
	const handSize = scale/8;
	
	ctx.fillStyle="#777";
	ctx.beginPath();
	ctx.moveTo(handX-scale/2,handY-handSize);
	ctx.lineTo(handX+scale*2.3,handY-handSize);
	ctx.lineTo(handX+scale*2.5,handY);
	ctx.lineTo(handX+scale*2.3,handY+handSize);
	ctx.lineTo(handX-scale/2,handY+handSize);
	ctx.closePath();
	
	ctx.moveTo(handX+scale/4,handY-scale/2);
	ctx.lineTo(handX+scale/2,handY-scale/2);
	ctx.lineTo(handX+scale/2,handY+scale/2);
	ctx.lineTo(handX+scale/4,handY+scale/2);
	ctx.closePath();
	
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle=unit.color;
	
	ctx.arc(handX, handY, handSize*3, 0, twoPi);
	ctx.fill();
	
	//shield
	ctx.lineWidth=scale/4;
	ctx.strokeStyle=unit.color;
	
	const a=shield-.75;
	const b=shield+.75;
	
	const shieldx = Math.cos(shield)*scale;
	const shieldy = Math.sin(shield)*scale;
	ctx.beginPath();
	ctx.arc(shieldx, shieldy, handSize*3, 0, twoPi);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(0,0,scale*1.4,a,b);
	ctx.stroke();
	
	//head
	const r = scale*3/4;
	ctx.beginPath();
	ctx.fillStyle="#999";
	ctx.arc(0,0,r,0,twoPi);
	ctx.fill();
	
	ctx.beginPath();
	ctx.lineWidth=scale/4;
	ctx.strokeStyle=unit.color;
	ctx.moveTo(r,0);
	ctx.lineTo(-r,0);
	ctx.moveTo(0,r);
	ctx.lineTo(0,-r);
	ctx.stroke();
}

function DrawHighQualityHero(unit, scale){
	ctx.save();
	ctx.translate(unit.Location.x, unit.Location.y);
	
	const dx = unit.moveTarget?.x-unit.Location.x;
	const dy = unit.moveTarget?.y-unit.Location.y;
	const rot = isNaN(dx)||isNaN(dy)?0:Math.atan2(dy,dx);
	
	ctx.rotate(rot);
	const unitScale = scale*3/4;
	
	switch(unit.type){
		case "Cleric": {
			hqCleric(unit, unitScale);
			break;
		}
		case "Mage": {
			hqMage(unit, unitScale);
			break;
		}
		case "Knight": {
			hqKnight(unit, unitScale);
			break;
			}
	}
	
	ctx.restore();
	unit.DrawHUD();
}