"use strict";

function showHelpModal(topic) {
	const e = document.getElementById(topic);
	
	const parent = getUIElement("helpContent");
	clearChildren(parent);
	
	const clone = e.cloneNode(true);
	
	getUIElement("helpContent").appendChild(clone);
	toggleUIElementByID("helpModal", false);
	clone.classList.remove("ddHelp");
	clone.classList.add("helpText");
}

function toggleHelp(topic, arrow) {
	const e = document.getElementById(topic);
	if(e == null){ return; }
	
	e.classList.toggle("expand");
	
	const a = document.getElementById(arrow);
	if(a == null){ return; }
	
	a.classList.toggle("ddRotate");
}
