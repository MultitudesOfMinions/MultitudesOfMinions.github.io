"use strict";
const effectType = { blessing:0, curse:1 };

function UnitEffects(){
	this.effects = [];
}
UnitEffects.prototype.AddEffect = function(name, type, duration, mPower, aPower){

  //stacking intensity types, if more than one change to [types].inclues(name)
	if(statTypes.health === name){
		const effect = new UnitEffect(name, type, duration, mPower, aPower);
		this.effects.push(effect);
		return;
	}

	const effects = this.effects.filter(e => e.name == name && e.type == type);

	if(effects == null || effects.length == 0){
		const effect = new UnitEffect(name, type, duration, mPower, aPower);
		this.effects.push(effect);
		return;
	}
	
	const effect = effects[0];
	effect.mPower = Math.max(effect.mPower, mPower);
	effect.aPower = Math.max(effect.aPower, aPower);
	effect.duration = Math.max(effect.duration, duration);
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
UnitEffects.prototype.CalculateEffectByName = function(name, input){
	const effects = this.effects.filter(e => e.name == name && e.duration >= 0);
	if(effects == null || effects.length == 0){
		if([statTypes.moveSpeed, statTypes.attackRange, statTypes.auraRange].includes(name)){
			return input * getScale();
		}
		return input;
	}
	
	let mPowerTotal = 1;
	let aPowerTotal = 0;
	for(let i = 0; i< effects.length;i++){
		mPowerTotal *= effects[i].GetMPower() || 1;
		aPowerTotal += effects[i].GetAPower() || 0;
	}
	
	if([statTypes.moveSpeed, statTypes.attackRange, statTypes.auraRange].includes(name)){
		return (input + aPowerTotal) * mPowerTotal * getScale();
	}
	return (input + aPowerTotal) * mPowerTotal;
}

function UnitEffect(name, type, duration, mPower, aPower){
	this.name = name;
	this.duration = duration;
	this.mPower = mPower;
	this.aPower = aPower;
	this.type = type;
}
UnitEffect.prototype.GetMPower = function(){
	if(this.duration < 0) { return; }
	return this.mPower;
}
UnitEffect.prototype.GetAPower = function(){
	if(this.duration < 0) { return; }
	return this.aPower;
}

