"use strict";

//  -left/right arrows = adjust boss aggression
//  -up = max aggression
//  -down = min aggression
//  -space = boss active
//  -/ = toggle advanced minion tactics
//  -q,w,e,r = turn on all minion, boss, tower, hero guages
//  -a,s,d,f = turn off all minion, boss, tower, hero gauges
//  -1,2,3,4,5,6,7,8,9,0,-,= - menu tab
//  -space - toggle start/stop
//  -m turn all minion spawnpools off
//  -n turn all minion spawnpools on
//  -b clear baracks
//  -z boss active ability

let keysDown = [];
window.onkeydown = function(e) {
  keysDown[e.key] = true;
  switch(e.keyCode){
    case 32://space
      if(mainCycle){ stop(); }
      else{ start(); }
      e.preventDefault();
      break;
    case 37://left arrow
      break;
    case 38://up arrow
      break;
    case 39://right arrow
      break;
    case 40://down arrow
      break;
      
      
    case 65://a
      break;
    case 83://s
      break;
    case 68://d
      break;
    case 70://f
      break;

    case 81://q
      break;
    case 87://w
      break;
    case 69://e
      break;
    case 82://r
      break;

    case 49://1
      break;
    case 50://2
      break;
    case 51://3
      break;
    case 52://4
      break;
    case 53://5
      break;
    case 54://6
      break;
    case 55://7
      break;
    case 56://8
      break;
    case 57://9
      break;
    case 48://0
      break;
    case 189://-
      break;
    case 187://=
      break;
    default:
      console.log(e, e.keyCode);
      break;
  }
}

window.onkeyup = function(e) {
  keysDown[e.key] = false;
}
