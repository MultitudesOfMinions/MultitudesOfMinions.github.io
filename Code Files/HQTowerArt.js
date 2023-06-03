

function hqBasic(tower, scale) {
	const w = scale/2;
	
	ctx.fillStyle=tower.color2;
	ctx.strokeStyle=tower.color;
	ctx.lineWidth=scale/8;
	
	ctx.beginPath();
	ctx.rect(-scale/2,-scale/2,scale, scale);
	ctx.fill();
	
	
	const m = scale/4;
	const n = scale/2;
	const q = Math.PI/4;
	const a = 0+q;
	const b = Math.PI/2+q;
	const c = Math.PI+q;
	const d = Math.PI*3/2+q;
	
	ctx.rotate(tower.aimTarget);
	ctx.beginPath();
	ctx.arc(0,0,n,a,b);
	ctx.arc(0,0,m,b,c);
	ctx.arc(0,0,n,c,d);
	ctx.arc(0,0,m,d,a);
	ctx.closePath();
	
	ctx.moveTo(m,0);
	ctx.lineTo(n+m,0);
	ctx.stroke();
}

function hqArtillery(tower, scale) {
	const m = scale/3;
	const n = scale/1.5;
	
	ctx.fillStyle=tower.color2;
	
	ctx.beginPath();
	ctx.arc(0,0,m*1.5,0,twoPi);
	ctx.fill();
	
	ctx.fillStyle=tower.color;
	ctx.strokeStyle=tower.color2;
	ctx.lineWidth=scale/12;
	
	ctx.beginPath();
	ctx.rect(-m,-m,n,n);
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(0,m/2);
	ctx.lineTo(n,m/2);
	ctx.moveTo(0,-m/2);
	ctx.lineTo(n,-m/2);
	ctx.stroke();
}

function hqExplosion(tower, scale) {
	ctx.strokeStyle=tower.color;
	ctx.lineWidth=scale/4;
	tower.drawCycle = ((tower.drawCycle||0)+.01)%twoPi
	
	const a = scale/8;
	const b = scale/2;
	
	const anti = -tower.drawCycle*2.5;
	const clock = tower.drawCycle*.7;
	const h = Math.PI/2;
	
	ctx.fillStyle=tower.color;
	ctx.beginPath();
	ctx.ellipse(0,0,a,scale,anti,0,twoPi);
	ctx.ellipse(0,0,a,scale,anti+h,0,twoPi);
	ctx.ellipse(0,0,a,scale,anti*1.5,0,twoPi);
	ctx.ellipse(0,0,a,scale,anti*1.5+h,0,twoPi);
	ctx.fill();
	
	ctx.fillStyle=tower.color2;
	ctx.beginPath();
	ctx.ellipse(0,0,a,b,0,0,twoPi);
	ctx.ellipse(0,0,a,b,h,0,twoPi);
	ctx.ellipse(0,0,a,b,clock,0,twoPi);
	ctx.ellipse(0,0,a,b,clock+h,0,twoPi);
	ctx.fill();
}

function hqIce(tower, scale) {
	ctx.lineWidth=scale/12;
	ctx.strokeStyle=tower.color;
	
	const w = scale/2
	const y = w*.87
	
	const rot = twoPi/6;
	ctx.beginPath();
	for(let i=0;i<6;i++){
		ctx.rotate(rot);
		ctx.moveTo(0,0);
		ctx.lineTo(w,0);
		
		ctx.moveTo(w,y);
		ctx.lineTo(w/2,0);
		ctx.lineTo(w,-y);
	}
	ctx.stroke();
	
	ctx.fillStyle=tower.color2;
	ctx.beginPath();
	ctx.moveTo(0,y/3);
	ctx.lineTo(scale*.7,-y/4);
	ctx.lineTo(scale*.7,y/4);
	ctx.lineTo(0,-y/3);
	ctx.closePath();
	ctx.fill();
}

function hqLightning(tower, scale) {
	const r = scale/6;
	
	ctx.strokeStyle=tower.color2;
	ctx.lineWidth=r*2;
	ctx.beginPath();
	ctx.arc(0,0,r*3,0,twoPi);
	ctx.stroke();
	
	ctx.strokeStyle=tower.color;
	ctx.lineWidth=scale/12;
	ctx.beginPath();
	ctx.arc(0,0,r,.5,twoPi-.5);
	ctx.moveTo(0,0);
	ctx.lineTo(scale,0);
	ctx.stroke();
	
	
	if(Math.random()>.98){
		const rand = Math.random()*twoPi;
		
		const x = Math.cos(rand);
		const y = Math.sin(rand);
		
		ctx.beginPath();
		ctx.moveTo(x*r,y*r);
		ctx.lineTo(x*r*3,y*r*3);
		ctx.stroke();
	}
	
}

function hqPoison(tower, scale) {
	
	const m=scale/4;
	const n = scale/2;
	
	ctx.fillStyle=tower.color2;
	ctx.strokeStyle="#000";
	ctx.lineWidth=scale/8;
	const r = scale/2;
	
	ctx.beginPath();
	ctx.arc(0,0,r,0,twoPi);
	ctx.fill();
	ctx.stroke();
	
	ctx.strokeStyle=tower.color2;
	ctx.fillStyle=tower.color;
	ctx.beginPath();
	
	const a = Math.PI*15/8;
	const b = Math.PI/2;
	
	const c = Math.PI*3/2;
	const d = Math.PI/8;
	
	ctx.arc(m,m,n,a,b,1);
	ctx.arc(m,-m,n,c,d,1);
	
	ctx.fill();
	ctx.stroke();
}

function hqSniper(tower, scale) {
	const r = scale/2;
	
	ctx.strokeStyle=tower.color;
	ctx.lineWidth=scale/8;
	ctx.fillStyle=tower.color2;
	
	ctx.beginPath();
	ctx.arc(0,0,r,0,twoPi);
	ctx.arc(0,0,r/2,0,twoPi);
	ctx.fill();
	
	ctx.moveTo(r,0);
	ctx.lineTo(r*1.5,0);
	
	ctx.stroke();
}

function DrawHighQualityTower(tower, scale){
	ctx.save();
	ctx.translate(tower.Location.x, tower.Location.y);
	
	const noRot = ["Basic"];
	if(!noRot.includes(tower.type)){
		ctx.rotate(tower.aimTarget);
	}
	const towerScale = scale;
	
	switch(tower.type){
		case "Basic": {
			hqBasic(tower, towerScale);
			break;
		}
		case "Artillery": {
			hqArtillery(tower, towerScale);
			break;
		}
		case "Explosion": {
			hqExplosion(tower, towerScale);
			break;
		}
		case "Ice": {
			hqIce(tower, towerScale);
			break;
		}
		case "Lightning": {
			hqLightning(tower, towerScale);
			break;
		}
		case "Poison": {
			hqPoison(tower, towerScale);
			break;
		}
		case "Sniper": {
			hqSniper(tower, towerScale);
			break;
			}
	}
	
	ctx.restore();
	tower.DrawHUD();
}