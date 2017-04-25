function MinionFactory(base){
	return new Minion(base.hp, base.damage, base.moveSpeed);
	//TODO: incorporate upgrades/boosts etc...
}

function Minion(hp, damage, speed){
	this.hp = hp||10;
	this.damage = damage||0;
	this.speed = speed||1;
	this.Location = new point(path[0].x, path[0].y);
}
Minion.prototype.Move = function(){
	for(var i=0;i<path.length;i++){
		if(Math.abs(path[i].x - this.Location.x) < 3){
			//if x matches exactly, set the Y (keeps any drifting due to rounding to a minimum and is faster than calculating)
			this.Location.x += this.speed;
			this.Location.y = path[i].y;
			break;
		}
		else if(path[i].x < this.Location.x && path[i+1].x > this.Location.x){
		      //get the base delta to look up sin/cos.
			var deltaY = path[i].y - path[i+1].y;
			var deltaX = 1;
			
		      //Look up sin/cos to correctly move minion
			for(var j=0;j<cos.length;j++){
				if(cos[j].x == deltaY){
					deltaX = cos[j].y;
					deltaY = sin[j].y;
					break;
				}
			}
			
			this.Location.x += this.speed*deltaX;
			this.Location.y += this.speed*deltaY;
			break;
		}
	}
}
Minion.prototype.Draw = function(){
	ctx.fillStyle='#0F0';
	ctx.beginPath();
	ctx.arc(this.Location.x,this.Location.y,15,0,2*Math.PI);
	ctx.fill();
}
