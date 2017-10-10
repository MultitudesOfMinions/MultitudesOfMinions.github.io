function Projectile(Location, target, moveSpeed, damage,
			attackCharges, chainRange, chainDamageReduction,
			splashRadius,splashDamageReduction, team)
{
	this.Location = new point(Location.x, Location.y);
	this.target = new point(target.x, target.y);
	this.damage = damage;

	var dx = (this.target.x - this.Location.x);
	var dy = (this.target.y - this.Location.y);
	
	var S = (pathL + (pathW * 1.5))/2; //Scale
	var D = moveSpeed**2/(dx**2 + dy**2);
	
	this.SpeedX = dx * D * S; 
	this.SpeedY = dy * D * S; 
	this.attackCharges = attackCharges || 0;
	this.chainRange = chainRange || 0;
	this.chainDamageReduction = chainDamageReduction || 0;
	this.splashRadius = splashRadius || 0;
	this.splashDamageReduction = splashDamageReduction || 0;
	this.team = team;//0=minion, 1=tower;
}
Projectile.prototype.Resize = function(){
	var dx = (this.target.x - this.Location.x);
	var dy = (this.target.y - this.Location.y);
	
	var S = (pathL + (pathW * 1.5))/2; //Scale
	var D = moveSpeed**2/(dx**2 + dy**2);
	
	this.SpeedX = dx * D * S; 
	this.SpeedY = dy * D * S; 
}
Projectile.prototype.Move = function(){
	if(this.attackCharges < 0){return;}
		
	var deltaX = Math.abs(this.Location.x - this.target.x);
	var deltaY = Math.abs(this.Location.y - this.target.y);
	
	if(deltaX > Math.abs(this.SpeedX) && deltaY > Math.abs(this.SpeedY)){
		this.Location.x += this.SpeedX;
		this.Location.y += this.SpeedY;
	}
	else if(this.Location.x != this.target.x || this.Location.y != this.target.y){
		this.Location.x = this.target.x;
		this.Location.y = this.target.y;
	}
	else{
		//ATTACK
		this.Attack();
	}
}
Projectile.prototype.Draw = function(){
	ctx.fillStyle='#00F';
	ctx.beginPath();
	ctx.arc(this.Location.x,this.Location.y,pathW>>2,0,2*Math.PI);
	ctx.fill();
}
Projectile.prototype.xRange = function(){return this.splashRadius*pathL}
Projectile.prototype.yRange = function(){return this.splashRadius*pathW*1.5}
Projectile.prototype.Attack = function(){

	impacts[impacts.length] = new Impact(this.Location, this.splashRadius, '#F00', 20);

	if(this.team){//attack towers
		for(var i=0;i<minions.length;i++){
			var dx = Math.abs(minions[i].Location.x - this.Location.x);
			var dy = Math.abs(minions[i].Location.y - this.Location.y);

			//cheap check
			if(dx <= this.xRange() && dy <= this.yRange())
			{
				//fancy check
				if(isInEllipse(minions[i].Location, this.Location, this.xRange(), this.yRange())){
					minions[i].hp -= this.damage;
				}
			}
		}
	}
	else{//attack minions
		for(var i=0;i<towers.length;i++){
			var dx = Math.abs(towers[i].Location.x - this.Location.x);
			var dy = Math.abs(towers[i].Location.y - this.Location.y);

			//cheap check
			if(dx <= this.xRange() && dy <= this.yRange())
			{
				//fancy check
				if(isInEllipse(towers[i].Location, this.Location, this.xRange(), this.yRange())){
					towers[i].hp -= this.damage;
				}
			}
		}
	}
	
	if(this.attackCharges > 0){
		//TODO: find next chain target
	}
	this.attackCharges--;

}
