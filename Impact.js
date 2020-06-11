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

function Impact(Location, radius, color, lifeSpan, type){
	this.Location = new point(Location.x, Location.y);
	this.radius = radius || 0.1;
	this.color = color||"#F00";
	this.lifeSpan = lifeSpan || 10;
	this.maxLifeSpan = lifeSpan || 10;
	this.type = type || 0;
}
Impact.prototype.Recenter = function(RecenterDelta){
	this.Location.x -= RecenterDelta; 
}

Impact.prototype.Draw = function(){
	if(this.type == 0){//default balistic
		ctx.fillStyle= this.color;
		ctx.beginPath();
		var r = this.Radius();
		ctx.arc(this.Location.x, this.Location.y, r, 0 , twoPi);
		ctx.fill();
		this.lifeSpan--;
		ctx.closePath();
	}
	else if(this.type == 1){//blast
		ctx.strokeStyle= this.color;
		ctx.beginPath();
		var weight = this.Radius();
		var r = 0;
		if(this.lifeSpan > this.maxLifeSpan/2){//first half
			r=weight/2;
		}
		else{//second half
			r=this.radius - weight/2;
		}
		ctx.lineWidth = weight;
		ctx.arc(this.Location.x, this.Location.y, r, 0 , twoPi);
		ctx.stroke();
		this.lifeSpan--;
		ctx.closePath();
	}
}
Impact.prototype.Radius = function(){
	var n = this.lifeSpan*(this.lifeSpan-this.maxLifeSpan);
	var d = (this.maxLifeSpan/2)**2;
	var scale = -n/d;
	return this.radius*scale;
}
