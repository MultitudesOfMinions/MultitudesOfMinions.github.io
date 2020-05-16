function drawProjectiles() {
	for(var i=0;i<projectiles.length;i++){ 
		projectiles[i].Draw(); 
	}
}
function manageProjectiles(){
	for(var i=0;i<projectiles.length;i++){ 
		if(projectiles[i].attackCharges < 0 ||
			(projectiles[i].type == 'laser' &&  projectiles[i].laserDuration < 0)){//remove spent projectiles
			projectiles.splice(i,1);
			i--;
			continue;
		}
		projectiles[i].Move();
	}
}

function Projectile(Location, target, moveSpeed, damage,
			attackCharges, chainRange, chainDamageReduction,
			splashRadius,splashDamageReduction, canHitGround, canHitAir, 
			team, type)
{
	this.source = new point(Location.x, Location.y);
	this.Location = new point(Location.x, Location.y);
	this.target = new point(target.x, target.y);
	this.damage = damage;

	var dx = (this.target.x - this.Location.x);
	var dy = (this.target.y - this.Location.y);
	
	this.moveSpeed = moveSpeed;
	var S = getScale();
	var D = moveSpeed**2/(dx**2 + dy**2);
	
	this.SpeedX = dx * D * S; 
	this.SpeedY = dy * D * S; 
	this.attackCharges = attackCharges || 0;
	this.chainRange = chainRange || 0;
	this.chainDamageReduction = chainDamageReduction || 0;
	this.splashRadius = splashRadius || 0;
	this.splashDamageReduction = splashDamageReduction || 0;
	this.team = team;//0=minion, 1=tower;
	this.canHitGround = canHitGround;
	this.canHitAir = canHitAir;
	this.type = type || 'projectile';
	this.laserDuration = this.type == 'projectile' ? -1 : 10;
}

Projectile.prototype.Resize = function(){
	var dx = (this.target.x - this.Location.x);
	var dy = (this.target.y - this.Location.y);
	
	var S = getScale(); //Scale
	var D = this.moveSpeed**2/(dx**2 + dy**2);
	
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
	if(this.type == 'aoe'){
		ctx.fillStyle='#00F';
		ctx.beginPath();
		ctx.arc(this.Location.x,this.Location.y,pathW>>2,0,2*Math.PI);
		ctx.fill();
	}
	else if(this.type == 'laser'){
		if(this.laserDuration < 0){return;}
		ctx.beginPath();
		ctx.strokeStyle='#FF0';
		ctx.lineWidth=(this.laserDuration/2);
		ctx.moveTo(this.source.x, this.source.y);
		ctx.lineTo(this.target.x, this.target.y);
		ctx.stroke();
		
		this.laserDuration--;
	}
	
}
Projectile.prototype.SplashRange = function(){return this.splashRadius*pathL}
Projectile.prototype.Attack = function(){

	impacts[impacts.length] = new Impact(this.Location, this.splashRadius, '#F00', 20);
	this.attackCharges--;
	 
	if(this.team == 0){
		attackTeam1(this);
	}
	else if(this.team == 1){
		attackTeam0(this);
	}
}

function attackTeam1(input){
	for(var i=0;i<team1.length;i++){
		var dx = Math.abs(team1[i].Location.x - input.Location.x);
		var dy = Math.abs(team1[i].Location.y - input.Location.y);

		//cheap check
		if(dx <= input.SplashRange() && dy <= input.SplashRange())
		{
			//fancy check
			if(inRange(team1[i].Location, input.Location, input.SplashRange())){
				team1[i].TakeDamage(input.damage);
			}
		}
	}
	
	//currently team0 has no chain attack so don't need to check it.
}

function attackTeam0(input){
	
	for(var i=0;i<team0.length;i++){
		//check if is correct projectile for minion
		if(team0[i].isFlying && !input.canHitAir){continue;}
		if(!team0[i].isFlying && !input.canHitGround){continue;}

		var dx = Math.abs(team0[i].Location.x - input.Location.x);
		var dy = Math.abs(team0[i].Location.y - input.Location.y);

		//cheap check
		if(dx <= input.SplashRange() && dy <= input.SplashRange())
		{
			//fancy check
			if(inRange(team0[i].Location, input.Location, input.SplashRange())){
				team0[i].TakeDamage(input.damage);
			}
		}
	}
	if(input.attackCharges < 0) { return; }
	if(team0.length == 0 ){ return; }

	for(var i=0;i<team0Order.length;i++){
		if(team0.length <= team0Order[i]){ continue; }
		if(team0[team0Order[i]] == null ){ continue; }

		var newTarget = team0[team0Order[i]];
		
		if(newTarget.isFlying && !input.canHitAir){ continue; }
		if(!newTarget.isFlying && !input.canHitGround){ continue; }
		if(newTarget.health <= 0){ continue; }
		if(newTarget.Location.x == input.target.x && newTarget.Location.y == input.target.y ){ continue; }
		
		var chainRange = input.chainRange * pathL;
		if(Math.abs(newTarget.Location.x - input.target.x) > chainRange){ continue; }
		
		var newDamage = Math.floor(input.damage*input.chainDamageReduction);

		projectiles[projectiles.length] = new Projectile(
			input.target, new point(newTarget.Location.x, newTarget.Location.y),
			input.moveSpeed, newDamage, input.attackCharges,
			input.chainRange, input.chainDamageReduction, input.splashRadius, input.splashDamageReduction, 
			input.canHitGround, input.canHitAir, input.team, input.type
		);
		break;
	}
}


