"use strict";
const effectType = { blessing:0, curse:1 };

function UnitEffects(){
	this.effects = [];
}
UnitEffects.prototype.AddEffect = function(originType, name, type, duration, mPower, aPower){

	const effect = new UnitEffect(originType, name, type, duration, mPower, aPower);
	this.effects.push(effect);
//	return;
//
//
//
//	const effects = this.effects.filter(e => e.name == name && e.type == type);
//
//	if(effects == null || effects.length == 0){
//		const effect = new UnitEffect(name, type, duration, mPower, aPower);
//		this.effects.push(effect);
//		return;
//	}
//	//TODO: if effects > 1 remove the extra ones; should just have one of each name&type per unit.
//	const effect = effects[0];
//
//  //stacking intensity types
//  const stackingCurses = [statTypes.health];
//  const stackingBlessings = [];//I don't think we want any at the moment.
//	if((type == effectType.curse && stackingCurses.includes(name))
//	  ||(type == effectType.blessing && stackingBlessings.includes(name))){
//	  effect.mPower = nanAdd(effect.mPower, mPower);
//	  effect.aPower = nanAdd(effect.aPower, aPower);
//	  effect.duration = nanAdd(effect.duration, duration);
//	}
//	else{//just take the most powerful
//	  effect.mPower = nanMax(effect.mPower, mPower);
//	  effect.aPower = nanMax(effect.aPower, aPower);
//	  effect.duration = nanMax(effect.duration, duration);
//	}
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
	const scale = scaledStats.includes(name)?getScale():1;
	
	if(effects == null || effects.length == 0){
		return input*scale;
	}
	
	let mPowerTotal = 1;
	let aPowerTotal = 0;
	for(let i = 0; i< effects.length;i++){
		mPowerTotal *= effects[i].GetMPower() || 1;
		aPowerTotal += effects[i].GetAPower() || 0;
	}
	
	return (input + aPowerTotal) * mPowerTotal * scale;
}

function UnitEffect(originType, name, type, duration, mPower, aPower){
  this.originType = originType;
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
UnitEffect.prototype.buildHtml = function(parent){
  if(this.duration<=1){return;}
  
  const effect = createNewElement("div", this.type+"_Effect_"+this.name, parent, ["effect"], null);
  
  createNewElement("div", this.type+"_Duration_"+this.name, effect, ["effectDuration"], this.duration);
  createNewElement("div", this.type+"_Name_"+this.name, effect, ["effectName"], this.name.fixString());
  createNewElement("div", this.type+"_Details_"+this.name, effect, ["effectDetails"], null);
}
UnitEffect.prototype.updateHtml = function(parent){
  const effect = document.getElementById(this.type+"_Effect_"+this.name);
  
  if(!effect){
    this.buildHtml(parent);
    return;
  }
  
  if(this.duration <= 1){
    effect.parentNode.removeChild(effect);
    return;
  }
  
  setElementTextById(this.type+"_Name_"+this.name, this.name, true);
  setElementTextById(this.type+"_Duration_"+this.name, Math.floor(this.duration), false);

  let a = (isNaN(this.aPower)?0:Math.floor(this.aPower*1000)/1000);
  a *= statAdjustments[this.name];
  const m = isNaN(this.mPower)||this.mPower==0?1:Math.floor(this.mPower*1000)/1000;
  let details = "(x+"+a+")*"+m;
  setElementTextById(this.type+"_Details_"+this.name, details, false);
}
