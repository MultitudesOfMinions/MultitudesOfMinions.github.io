"use strict";

const maxInventory = 32;
const inventory = [];

const equiped = {
  weapon:null,
  shield:null,
  feet:null,
  legs:null,
  torso:null,
  head:null,
  trinket:null,
  ammulet:null
}

function itemDrop(heroLvl){
  if(!tierUnlocked(4)){return;}
  if(inventory.length >= maxInventory){ return; }
  
  const newItem = itemFactory(heroLvl);
  inventory.push(newItem);
  console.log(newItem, newItem.score(), inventory);
}