function Impact(Location, radius, color, lifeSpan)
{
	this.Location = new point(Location.x, Location.y);
	this.radius = radius || 0.1;
	this.color = color||'#F00';
	this.lifeSpan = lifeSpan || 10;
	this.maxLifeSpan = lifeSpan || 10;
}
Impact.prototype.Draw = function(){
	ctx.fillStyle= this.color;
	ctx.beginPath();
	ctx.ellipse(this.Location.x, this.Location.y, this.xRange(), this.yRange(), 0, 0,2*Math.PI);
	ctx.fill();
	this.lifeSpan--;
}
Impact.prototype.xRange = function(){
	var x = (this.lifeSpan - (this.maxLifeSpan/2))**2
	var scale = (-x + (this.maxLifeSpan/2)**2)/((this.maxLifeSpan/2)**2);
	return this.radius*pathL*scale;
}
Impact.prototype.yRange = function(){
	var x = (this.lifeSpan - (this.maxLifeSpan/2))**2
	var scale = (-x + (this.maxLifeSpan/2)**2)/((this.maxLifeSpan/2)**2);
	return this.radius*pathW*1.5*scale
}
