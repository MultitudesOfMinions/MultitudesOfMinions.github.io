function Projectile(Location, moveSpeed, target, 
			chainCount, chainRange, chainDamageReduction,
			splashRadius,splashDamageReduction)
{
	
}
Projectile.prototype.Move = function(){
	//TODO: move projectile
}
Projectile.prototype.Draw = function(){
	ctx.fillStyle='#00F';
	ctx.fillRect(this.Location.x, this.Location.y, 2, 2);
}
