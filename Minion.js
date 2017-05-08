function MinionFactory(base){
	return new Minion(base.hp, base.damage, base.moveSpeed);
	//TODO: incorporate upgrades/boosts etc...
}

function Minion(hp, damage, moveSpeed){
	this.hp = hp||10;
	this.damage = damage||0;
	this.moveSpeed = moveSpeed||1;
	this.Location = new point(Math.max(-halfW>>2, path[0].x), halfH);
}
Minion.prototype.Move = function(){
	var fudgeFactor = Math.max(1, pathInc>>4)
	for(var i=0;i<path.length;i++){
		if(Math.abs(path[i].x - this.Location.x) <= fudgeFactor){
			//if x is close enough, set the Y (keeps any drifting due to rounding to a minimum and is faster than calculating)
			this.Location.x += this.moveSpeed;
			this.Location.y = path[i].y;
			break;
		}
		else if(path[i].x < this.Location.x && path[i+1].x > this.Location.x){
			var y1 = path[i].y;
			var y2 = path[i+1].y;
			var deltaY = y1 - y2;
			var deltaX = 1;
			
			for(var j=0;j<cos.length;j++){
				if(cos[j].x == deltaY){
					deltaX = cos[j].y;
					deltaY = sin[j].y;
					break;
				}
			}
			
			this.Location.x += this.moveSpeed*deltaX;
			this.Location.y += this.moveSpeed*deltaY;
			
			break;
		}
	}
}
Minion.prototype.Draw = function(){
	ctx.fillStyle='#0F0';
	ctx.beginPath();
	ctx.arc(this.Location.x,this.Location.y,pathW>>1,0,2*Math.PI);
	ctx.fill();
}
