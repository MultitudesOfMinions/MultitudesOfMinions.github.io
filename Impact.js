function drawImpacts(){
	for(var i=0;i<impacts.length;i++){ 
		impacts[i].Draw(); 
	}
}
function manageImpacts(){
	for(var i=0;i<impacts.length;i++){ 
		if(impacts[i].lifeSpan < 0){//remove spent impacts
			impacts.splice(i,1);
			i--;
			continue;
		}
	}
}

function Impact(Location, radius, color, lifeSpan){
	this.Location = new point(Location.x, Location.y);
	this.radius = radius || 0.1;
	this.color = color||'#F00';
	this.lifeSpan = lifeSpan || 10;
	this.maxLifeSpan = lifeSpan || 10;
}
Impact.prototype.Draw = function(){
	ctx.fillStyle= this.color;
	ctx.beginPath();
	var r = this.Radius();
	ctx.arc(this.Location.x, this.Location.y, r, 0 , twoPi);
	ctx.fill();
	this.lifeSpan--;
	ctx.closePath();
}
Impact.prototype.Radius = function(){
	var n = this.lifeSpan*(this.lifeSpan-this.maxLifeSpan);
	var d = (this.maxLifeSpan/2)**2;
	var scale = -n/d;
	return this.radius*scale;
}
