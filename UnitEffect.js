"use strict";
const effectType = { boon:0, condition:1 };

function UnitEffects(){
	this.effects = [];
}
UnitEffects.prototype.AddEffect = function(name, type, duration, power){
	const effects = this.effects.filter(e => e.name == name && e.type == type);

	if(effects == null || effects.length == 0){
		const effect = new UnitEffect(name, type, duration, power);
		this.effects.push(effect);
		return;
	}
	
	const effect = effects[0];
	if(power > effect.power){
		effect.power = power;
		effect.duration = duration;
	}
	else if(duration > effect.duration){
		effect.duration = duration;
	}
	
}
UnitEffects.prototype.ManageEffects = function(){
	for(let i=0;i<this.effects.length;i++){
		this.effects[i].duration--;
		if(this.effects[i].duration <= 0 || isNaN(this.effects[i].duration)){
			this.effects.splice(i,1);
			i--;
		}
	}
}
UnitEffects.prototype.GetEffectPowerByName = function(name){
	const effects = this.effects.filter(e => e.name == name && e.duration >= 0);
	if(effects == null || effects.length == 0){ return 1; }
	if(effects.length == 1) { return effects[0].GetPower(); }
	
	let totalPower = 1;
	for(let i = 0; i< effects.length;i++){
		totalPower*= effects[i].GetPower();
	}
	
	return totalPower;
}

function UnitEffect(name, type, duration, power){
	this.name = name;
	this.duration = duration;
	this.power = power;
	this.type = type;
}
UnitEffect.prototype.GetPower = function(){
	if(this.duration < 0) { return; }
	return this.power;
}

