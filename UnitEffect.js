"use strict";
const effectType = { blessing:0, curse:1 };

function UnitEffects(){
	this.effects = [];
}
UnitEffects.prototype.AddEffect = function(originType, name, type, duration, mPower, aPower){
	
	const effects = this.effects.filter(e => e.name == name && e.type == type);
	
	if(effects.length == 0){
		const effect = new UnitEffect(originType, name, type, duration, mPower, aPower);
		this.effects.push(effect);
		return;
	}
	
	//stack same origin stacking effects.
	const sameOrigin = effects.find(x =>x.originType == originType);
	const stackingCurses = [statTypes.health];
	const stackingBlessings = [statTypes.health];
	if(sameOrigin!=null&&
		((type == effectType.curse && stackingCurses.includes(name))
		||(type == effectType.blessing && stackingBlessings.includes(name)))){
		sameOrigin.mPower = nanMult(sameOrigin.mPower, mPower);
		sameOrigin.aPower = nanAdd(sameOrigin.aPower, aPower);
		sameOrigin.duration = nanMax(sameOrigin.duration, duration);
		return;
	}
	
	const effect = new UnitEffect(originType, name, type, duration, mPower, aPower);
	this.effects.push(effect);
}
UnitEffects.prototype.ManageEffects = function(isBoss=false){
	for(let i=0;i<this.effects.length;i++){
		this.effects[i].duration--;
		if(this.effects[i].duration <= 0 || isNaN(this.effects[i].duration)){
			if(isBoss){
				const effect = document.getElementById(this.effects[i].type+"_Effect_"+this.effects[i].name);
				if(effect){
					effect.parentNode.removeChild(effect);
				}
			}
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
		mPowerTotal *= effects[i].getMPower();
		aPowerTotal += effects[i].getAPower();
	}
	
	return (input + aPowerTotal) * mPowerTotal * scale;
}
UnitEffects.prototype.DotsAndHots = function(base, max, targetType){
	const effects = this.effects.filter(e => e.name == statTypes.health && e.duration >= 0);
	
	if(effects == null || effects.length == 0){
		return base;
	}
	
	let mPowerTotal = 1;
	let aPowerTotal = 0;
	for(let i = 0; i< effects.length;i++){
		const temp = Math.min(max, effects[i].calculate(base));
		let delta = temp-base;
		
		if(delta===0 || isNaN(delta)){continue;}
		if(delta < 0){
			delta = Math.abs(delta);
			stats.addDamageDone(effects[i].originType, delta);
			stats.addDamageTaken(targetType, delta);
		}
		else{stats.addHealingDone(effects[i].originType, delta);}
		
		base = temp;
	}
	
	return base;
}
//for some reason name = effected stat; not sure why I called it that but I'm not changing it now.
function UnitEffect(originType, name, type, duration, mPower, aPower){
	this.originType = originType;
	this.name = name;
	this.duration = duration;
	this.mPower = mPower;
	this.aPower = aPower;
	this.type = type;
}
UnitEffect.prototype.getMPower = function(){
	if(this.mPower==null || isNaN(this.mPower)){return 1;}
	if(this.duration < 0){return 1;}
	return this.mPower||1;
}
UnitEffect.prototype.getAPower = function(){
	if(this.aPower==null || isNaN(this.aPower)){return 0;}
	if(this.duration < 0){return 0;}
	return this.aPower||0;
}
UnitEffect.prototype.calculate = function(input){
	const a = this.getAPower();
	const m = this.getMPower();
	return (input + a)*m;
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
	
	setElementTextById(this.type+"_Name_"+this.name, this.name, true);
	setElementTextById(this.type+"_Duration_"+this.name, Math.floor(this.duration), false);
	setElementTextById(this.type+"_Details_"+this.name, this.toString(), false);
}
UnitEffect.prototype.toString = function(){
	let a = isNaN(this.aPower)?0:(Math.floor(this.aPower*100)/100);
	a *= statAdjustments[this.name];
	const m = isNaN(this.mPower)||this.mPower==0?1:(Math.floor(this.mPower*10)/10);
	const s = a>0?'+':''; 	

	if(a!==0 && m!==1){
		return `(x${s}${a})*${m}`;
	}
	if(a!==0 && m===1){
		return `${s}${a}`;	
	}
	if(a===0 && m!==1){
		return `*${m}`;	
	}
	return '-';
}
