"use strict";
let gameW = 1200;
let gameH = 600;
let halfH = 300;
let pathL = 20;
let pathW = 20;
let leaderPoint = 120;
const defaultInterval = 15;
let path = [];
let langoliers = -(gameW>>3);
let projectiles = [];
let impacts = [];
let totalPaths = 0;//Use for levels
let level = 0;
let levelEndX = 0;
let levelStartX = 0;
let resetLevel = 0;
let maxResetLevel = 0;
let maxFPS = 0;
let minFPS = 100;
let RecenterDelta = 0;
let maxMinions = 0;
let lastSave = 0;
let cookiesEnabled = 0;
let Quality = 2;
const hilites = [];
let skippedFrames = 0;
let ticksSinceReset=0;

const underlings = [];
const minions = [];
let minionOrder = [];
const towers = [];
let hero = null;
let squire = null;
let page = null;
let boss = null;
const maxInventory = 24;
const inventory = [];
let maxAutosellLimit = 100;
let newItemPreview = null;
let leadInvader = null;

let team0 = [];
let team1 = [];

let achievementCycle = 0;
let autoBuySellCycle = 0;
let autoSaveCycle = 0;
let p0Cycle = 0;
let p1Cycle = 0;
let mainCycle = 0;

let consecutiveMainCylceErrors = 0;
let consecutiveBuySellErrors = 0;
let consecutiveSaveErrors = 0;
let consecutiveP0Errors = 0;
let consecutiveP1Errors = 0;


