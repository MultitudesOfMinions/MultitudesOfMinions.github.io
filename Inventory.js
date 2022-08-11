"use strict";

const equipped = {
	weapon:null,
	shield:null,
	feet:null,
	legs:null,
	torso:null,
	head:null,
	trinket:null,
	amulet:null
}

const soldItems = [];

function itemDrop(heroLvl){
	if(!tierUnlocked(4)){return;}
	if(inventory.length >= maxInventory){ 
		toggleUIElementByID("fullInventory", true);
		return; 
	}
	
	const newItem = itemFactory(heroLvl);
	inventory.push(newItem);
	setElementTextById("inventoryCount", inventory.length);
	filterInventory();//this should be filtering it, but isn't sometimes?
	
	const ddl = getUIElement("ddlForgeItems");
	const opt = createNewElement("option", "opt"+newItem.id, ddl, [], newItem.toString())
	opt.value = newItem.id;
}

function equip(itemId){
	const item = inventory.find(x => x.id === itemId);
	unequip(item.type);
	equipped[item.type] = item;
	recalculateSellValue();
}

function sell(itemId){
	const item = inventory.find(x => x.id === itemId);
	const index = inventory.indexOf(item);
	if(index<0){ return; }
	
	const sellValue = inventory[index].sellValue();
	
	soldItems.push({value: sellValue, item:inventory[index]});
	
	inventory.splice(index,1);
	toggleUIElementByID("fullInventory", true);
	
	setItemBuyBack();
	
	resources.e.amt+=sellValue;
	achievements.itemScrapped.count++;
	recalculateSellValue();
	
	setElementTextById("inventoryCount", inventory.length);
	
	const itemDiv = document.getElementById("divItem"+itemId);
	if(itemDiv){
		itemDiv.parentNode.removeChild(itemDiv);
	}
	
	//if selected item is sold just refresh the whole thing
	const ddl = getUIElement("ddlForgeItems");
	if(itemId == ddl.value){
		populateForgeItems();
		ddl.selectedIndex = -1;
	}
	else {
		const option = document.getElementById("opt"+itemId);
		if(option && option.parentElement == ddl) {
			ddl.removeChild(option);
		}
	}
}
function buyBack(){
	if(soldItems.length ==0){return;}
	while(soldItems.length > 8){soldItems.shift();}
	if(inventory.length >= 24){
		toggleUIElementByID("buyBackFullInventory", false);
		return;
	}
	
	const cost = soldItems[soldItems.length-1].value;
	if(resources.e.amt < cost){
		return;
	}
	
	resources.e.amt -= cost
	achievements.itemScrapped.count--;//can go negative I suppose if after maxLevel is reached. I'm fine with that.
	const lastSold = soldItems.pop().item;
	lastSold.isLocked = true;
	inventory.push(lastSold);
	
	setItemBuyBack();
}
function setItemBuyBack(){
	
	if(soldItems.length==0){
		toggleUIElementByID("divBuyBack", true);
		return;
	}
	
	toggleUIElementByID("divBuyBack", false);
	const itemBuyBack = getUIElement("divBuyBackPreview");
	clearChildren(itemBuyBack);
	
	const buyBackPreview = soldItems[soldItems.length-1].item;
	buyBackPreview.buildHtml(itemBuyBack, "BuyBack");
	setElementTextById("buyBackValue", soldItems[soldItems.length-1].value||"0");
}

function toggleLock(sender, itemId){
	const item = inventory.find(x => x.id === itemId);
	const index = inventory.indexOf(item);
	if(index<0){return;}
	
	inventory[index].isLocked = !inventory[index].isLocked;
	
	const lockChar = inventory[index].isLocked?"🔒":"🔓";
	setElementText(sender, lockChar);
}

function unequip(slot){
	const slotDiv = document.getElementById("divEquipped"+slot.fixString());
	equipped[slot] = null;
	slotDiv.textContent = null;
}

function getEquippedEffect(target, effect){
	let m = 1;
	let a = 0;
	
	for (const [key, value] of Object.entries(equipped)) {
		if(value === null){continue;}
		
		let bonus = getEquippedItemEffect(key, target, effect);
		a+= bonus.a;
		m*= bonus.m;
	}
	
	if(backwardsStats.includes(effect)){
		m = 1/m;
		a*=-1;
	}
	
	return {m:m, a:a};
}

function getEquippedItemEffect(type, target, effect){
	let m=1;
	let a=0;
	
	const eqItem = equipped[type];
	if(eqItem == null){return {m:m, a:a};};
	
	//if checking boss also look at the item stat
	if(target === "Boss" && eqItem.stat.attr === effect){
		a+=eqItem.stat.power;
	}
	
	//get team if invaders/defenders applies
	for(let i=0;i<eqItem.attributes.length;i++){
		let attr = eqItem.attributes[i];
		const isAll = (isTeam0(target) && attr.target === "Invaders") || 
						(isTeam1(target) && attr.target === "Defenders") ||
						(resources[target] !== undefined && attr.target === "All");
		
		if(attr.target !== target && !isAll){continue;}
		if(attr.effect !== effect){continue;}
		
		if(attr.range.type === rangeTypes.a){
			a+=attr.power;
		}
		else if(attr.range.type === rangeTypes.m){
			m*=attr.power;
		}
	}
	
	return {m:m, a:a};
}

function recalculateSellValue(){
	for(var i=0;i<inventory.length;i++){
		inventory[i].updateSellValue();
	}
}

function filterInventory(){
	const items = getUIElement("divItems").children;
	
	for(let i=0;i<items.length;i++){
		const itemId = items[i].id.replace("divItem","");
		const type = inventory.find(x => x.id == itemId).type;
		const checked = document.getElementById("chkFilter"+type).checked
		toggleUIElement(items[i], !checked);
	}
}

function filterAll(sender){
	const chks = document.getElementsByClassName("chkItemFilter");
	
	for(let i=0;i<chks.length;i++){
		chks[i].checked = sender.checked;
	}
	
	filterInventory();
}		