"use strict";

function manageBombCountdown(){
  for(let [key, value] of Object.entries(bombTypes)){
    if(value.remaining >0){
      value.remaining--;
    }
    updateBombRow(key);
  }
}

function getBombEffect(type){
  const bomb = bombTypes[type];
  const level = getAchievementLevel("bossesSummoned");
  
  let a = (bomb.initial.a + (bomb.scaleA.a*level)) * (bomb.scaleA.m**level);
  let m = (bomb.initial.m + (bomb.scaleM.a*level)) * (bomb.scaleM.m**level);
  let d = (bomb.initial.d + (bomb.scaleD.a*level)) * (bomb.scaleD.m**level);
  
  a = Math.floor(a*100)/100;
  m = Math.floor(m*100)/100;
  d = Math.floor(d);
  
  return {stats:bomb.stats, team:bomb.team, a:a, m:m, d:d, r:bomb.remaining};
}

function buyBomb(type){
  if(resources.f.amt<1){return;}
  if(bombTypes[type].remaining>0){return;}

  const b = getBombEffect(type);
  const targets = b.team==0?team0:team1;
  const eType = b.team==0?effectType.blessing:effectType.curse;
  
  resources.f.amt-=1;
  for(let t of targets){
    for(let s of b.stats){
      const a = statAdjustments.hasOwnProperty(s)? b.a/statAdjustments[s]:b.a;
   	  t.effects.AddEffect(s, eType, b.d, b.m, a);
    }
  }
  bombTypes[type].remaining = b.d;
  
  const blinks = Math.max(1,Math.floor(b.d/15));
  addHilite("bombDuration"+type, blinks);
}

function buildBombRow(type, parent){
  const b = getBombEffect(type);
  
	const tr = createNewElement("tr", "bombInfo"+type, parent, []);
  
  const formula = "(stat+{0})*{1}".format(b.a,b.m);
  const stats = fixBombStats(b.stats);
  
	createNewElement("td", "bombName"+type, tr, [], type.fixString());
	createNewElement("td", "bombStat"+type, tr, [], stats);
	createNewElement("td", "bombFormula"+type, tr, [], formula);
	createNewElement("td", "bombDuration"+type, tr, [], b.d);
}

function updateBombRow(type){
  const b = getBombEffect(type);
  
  let formula = "stat";
  if(b.a!=0&&b.m!=1){
    formula = "(stat+{0})*{1}".format(b.a,b.m);
  }
  else if(b.a==0&&b.m!=1){
    formula = "(stat)*{0}".format(b.m);
  }
  else if(b.a!=0&&b.m==1){
    formula = "(stat+{0})".format(b.a);
  }
  
  setElementTextById("bombFormula"+type, formula);
  
  const d = (b.r>0?b.r+"/":"")+b.d;
  setElementTextById("bombDuration"+type, d);
}

function fixBombStats(stats){
  let output = stats[0].fixString();
  
  for(let i=1;i<stats.length;i++){
    output += ", " + stats[i].fixString();
  }

  return output;
}
