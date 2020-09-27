'use strict';
let RAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback){ window.setTimeout(callback, 1000 / 60) };

let cancelRAF =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame;

const worldToCanvas = (t, type) => {
  if (type == 0) return (t - camera.x) / camera.scaleX;
  else return (t - camera.y) / camera.scaleY;
}

const canvasToWorld = (t, type) => {
  if (type == 0) return t * camera.scaleX + camera.x;
  else return t * camera.scaleY + camera.y;
}

const rotate = (x, y, angle) => {
  return { "x": x * Math.cos(angle) - y * Math.sin(angle),
           "y": x * Math.sin(angle) + y * Math.cos(angle) };
}

const getRandom = () => {
  return Math.round(Math.random());
}

const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

const blockCenter = 5;

const cameraStartX = 0;
const cameraStartY = 0;
const moveBorder = canvas.width / 2;
const visiblePart = 500;
let cameraSpeed = 3;

const worldTileSize = 10;
const canvasTileSize = worldTileSize / (visiblePart / canvas.width);


let sightWidth = 8;
let sightHeight = 2;

const bullets = new Set();
const rounds = [];

const barbedWireDmg = 0.5;

const playerSounds = {
  water : new Sound(sounds["water"], 0, 0.8, 0.5, 0),
  dirt : new Sound(sounds["dirt"], 0, 0.6, 0.5, 0),
  tile : new Sound(sounds["tile"], 0, 0.2, 1.5, 0),
  ak_reload : new Sound(sounds["ak_reload"], 0, 1.5, 0.5, 0),
  m16_reload : new Sound(sounds["m16_reload"], 0.4, 1.8, 0.5, 0),
  shotgun_reload : new Sound(sounds["shotgun_reload"], 0, 0.58, 1, 0),
  door_open : new Sound(sounds["door"], 0, 1.0, 1.5, 0),
  door_close : new Sound(sounds["door"], 2.5, 3.0, 1.5, 0),
  grenade : new Sound(sounds["grenade"], 0, 0.2, 1.5, 0),
  glass_hit : new Sound(sounds["glass_hit"], 0, 0.8, 0.5, 0),
  switch_weapon : new Sound(sounds["change_weapon"], 0, 0.2, 0.5, 0)
};
const playerStartX = 218;
const playerStartY = 52;
const playerWidth = 56;
const playerHeight = 48;
let playerSpeed = cameraSpeed;
const spriteTileW = 96;
const spriteTileH = 64;
const spriteFeetH = 38;
const spriteFeetW = 53;
const FeetH = 27;
const FeetW = 38;

const memoryTime = 200;

const srcOffsetX = 8;
const srcOffsetY = 10;
const realOffsetX = playerWidth / spriteTileW * srcOffsetX;
const realOffsetY = playerHeight / spriteTileH * srcOffsetY;
const srcRealW = 63;
const srcRealH = 49;
const realW = playerWidth / spriteTileW * srcRealW;
const realH = playerHeight / spriteTileH * srcRealH;

const camera = new Camera(cameraStartX, cameraStartY, images["map"], visiblePart, visiblePart, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const spritePl = {
  pl : new Sprite(images["player"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2,3,4,5]),
  shoot : new Sprite(images["shoot"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2]),
  up : new Sprite(images["walk_UD"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0]),
  down : new Sprite(images["walk_UD"], 0, spriteFeetW, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1]),
  right : new Sprite(images["walk_RL"], 0, 0, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX + realOffsetX - 3, 0), worldToCanvas(playerStartY + realOffsetY + 10, 1), [0]),
  left : new Sprite(images["walk_RL"], 0, spriteFeetH, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1]),
  strafe : new Sprite(images["strafe"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1]),
  death : new Sprite(images["death"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0])
};


spritePl.pl.setWorldSize(playerWidth, playerHeight);
spritePl.shoot.setWorldSize(playerWidth, playerHeight);
spritePl.death.setWorldSize(playerWidth, playerHeight);
spritePl.up.setWorldSize(FeetH, FeetW);
spritePl.down.setWorldSize(FeetH, FeetW);
spritePl.left.setWorldSize(FeetW, FeetH);
spritePl.right.setWorldSize(FeetW, FeetH);

const player = new Player(playerStartX, playerStartY, playerWidth, playerHeight,
                          realOffsetX, realOffsetY, realW, realH, playerSpeed, spritePl);

const controlPoints = []
controlPoints.push(new ControlPoint(69, 137, 150, 2, [null], null));
controlPoints.push(new ControlPoint(593, 281, 200, 2, [null], null));
controlPoints.push(new ControlPoint(405, 1145, 300, 2, [null], 3));
controlPoints.push(new ControlPoint(957, 1013, 200, 2, [2], 5));
controlPoints.push(new ControlPoint(1241, 825, 200, 2, [null], 5));
controlPoints.push(new ControlPoint(1741, 1205, 200, 2, [3, 4], 10));
controlPoints.push(new ControlPoint(1749, 833, 200, 2, [null], 10));
controlPoints.push(new ControlPoint(1680, 370, 300, 2, [null], 8));
controlPoints.push(new ControlPoint(2649, 455, 350, 2, [7], 12));
controlPoints.push(new ControlPoint(2181, 829, 200, 2, [null], 11));
controlPoints.push(new ControlPoint(2217, 1213, 180, 3, [5, 6], 11));
controlPoints.push(new ControlPoint(2685, 1113, 220, 2, [9, 10], 12));
controlPoints.push(new ControlPoint(3705, 745, 200, 1, [8, 11], 13));
controlPoints.push(new ControlPoint(3541, 281, 300, 2, [12], null));

const targets = [];
targets.push(new Target(101, 41, 0, 1, 0, getRandom()));
targets.push(new Target(29, 241, 0, -1, 0, getRandom()));
targets.push(new Target(443, 327, 1, 0, 1, getRandom()));
targets.push(new Target(703, 201, -1, 0, 1, getRandom()));
targets.push(new Target(227, 1202, 1, -1, 2, getRandom()));
targets.push(new Target(503, 1248, -1, -1, 2, getRandom()));
targets.push(new Target(889, 907, -1, 1, 3, getRandom()));
targets.push(new Target(949, 1060, -1, 0, 3, getRandom()));
targets.push(new Target(1309, 726, -1, 1, 4, getRandom()));
targets.push(new Target(1420, 940, 0, 1, 4, getRandom()));
targets.push(new Target(1523, 584, 0, 1, 7, getRandom()));
targets.push(new Target(2385, 300, -1, 1, 8, getRandom()));
targets.push(new Target(2900, 481, -1, 0, 8, getRandom()));
targets.push(new Target(1905, 1204, 0, -1, 5, getRandom()));
targets.push(new Target(1663, 1205, -1, 0, 5, getRandom()));
targets.push(new Target(1843, 723, -1, 1, 6, getRandom()));
targets.push(new Target(1689, 921, 0, 1, 6, getRandom()));
targets.push(new Target(2065, 760, 1, 0, 9, getRandom()));
targets.push(new Target(2069, 885, 1, 0, 9, getRandom()));
targets.push(new Target(2423, 960, 0, 1, 10, getRandom()));
targets.push(new Target(2061, 1049, 0, 1, 10, getRandom()));
targets.push(new Target(2140, 1289, 0, -1, 10, getRandom()));
targets.push(new Target(2560, 980, 0, -1, 11, getRandom()));
targets.push(new Target(2740, 760, 1, 0, 11, getRandom()));
targets.push(new Target(1882, 103, 0, 1, 7, getRandom()));
targets.push(new Target(3421, 864, -1, 1, 12, getRandom()));
targets.push(new Target(3507, 289, -1, 1, 13, getRandom()));
targets.push(new Target(3789, 107, -1, 1, 13, getRandom()));

let closestTarget = targets[0];
let distCT = 5000;
let targetOnCanvas = false;
let targetsCount = targets.length;

const weapons = new Set();
weapons.add(new Weapon(0, 72, 20)).add(new Weapon(2, 660, 188)).add(new Weapon(0, 1222, 829)).
        add(new Weapon(1, 1160, 690)).add(new Weapon(2, 2174, 960)).add(new Weapon(1, 2585, 157)).
        add(new Weapon(0, 3715, 32)).add(new Weapon(2, 3320, 300));
const grenades = new Set();
const clouds = [];

const doors = [];
doors.push(new Door(1200, 955, 80, 10, true, images["door"]));
doors.push(new Door(1710, 955, 80, 10, true, images["door"]));
doors.push(new Door(1700, 1135, 80, 10, true, images["door"]));
doors.push(new Door(2015, 1170, 80, 10, false, images["door"]));
doors.push(new Door(2770, 805, 60, 10, true, images["door"]));
doors.push(new Door(2215, 1340, 60, 10, false, images["door"]));
doors.push(new Door(1860, 155, 70, 10, true, images["door"]));
doors.push(new Door(2425, 280, 60, 10, false, images["door"]));
doors.push(new Door(3740, 225, 60, 10, true, images["door"]));
doors.push(new Door(3460, 235, 70, 10, true, images["door"]));
doors.push(new Door(3410, 465, 60, 10, true, images["door"]));
doors.push(new Door(3370, 815, 70, 10, true, images["door"]));
doors.push(new Door(3370, 945, 70, 10, true, images["door"]));

const glass = [];
glass.push(new Glass(1100, 770, 50, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(1370, 770, 50, 10, -Math.PI / 2, images["glass"]));
glass.push(new Glass(1110, 950, 60, 10, Math.PI, images["glass"]));
glass.push(new Glass(1310, 950, 60, 10, Math.PI, images["glass"]));
glass.push(new Glass(1620, 950, 60, 10, Math.PI, images["glass"]));
glass.push(new Glass(1820, 950, 60, 10, Math.PI, images["glass"]));
glass.push(new Glass(2640, 1390, 90, 10, Math.PI, images["glass"]));
glass.push(new Glass(1610, 770, 50, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(1310, 950, 60, 10, Math.PI, images["glass"]));
glass.push(new Glass(1880, 770, 50, 10, -Math.PI / 2, images["glass"]));
glass.push(new Glass(1610, 1150, 100, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(2410, 670, 70, 10, 0, images["glass"]));
glass.push(new Glass(2070, 1220, 100, 10, 0, images["glass"]));
glass.push(new Glass(1740, 60, 60, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(3600, 100, 60, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(3260, 280, 60, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(3260, 370, 60, 10, Math.PI / 2, images["glass"]));
glass.push(new Glass(3260, 840, 80, 10, Math.PI / 2, images["glass"]));


const trees = [];
trees.push(new Tree(540, 25, 80, 90, 0, 0, 110, 120, images["trees"])); //дерево 1
trees.push(new Tree(535, 103, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(616, 114, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(727, 124, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(674, 126, 35, 30, 272, 168, 55, 45, images["trees"])); //растение 1
trees.push(new Tree(740, 234, 80, 90, 0, 250, 102, 102, images["trees"])); //дерево 2
trees.push(new Tree(769, 180, 80, 90, 0, 259, 102, 102, images["trees"]));
trees.push(new Tree(550, 426, 80, 90, 0, 125, 110, 120, images["trees"])); //дерево 3
trees.push(new Tree(143, 32, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(150, 110, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(147, 180, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(140, 250, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(150, 345, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(155, 295, 35, 30, 272, 168, 55, 45, images["trees"]));
trees.push(new Tree(130, 420, 80, 90, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(133, 497, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(150, 620, 60, 60, 170, 308, 73, 73, images["trees"])); //куст 1
trees.push(new Tree(162, 663, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(17, 417, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(9, 320, 60, 60, 170, 308, 73, 73, images["trees"]));
trees.push(new Tree(5, 545, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(16, 680, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(274, 442, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(147, 770, 60, 70, 111, 130, 90, 80, images["trees"])); //куст 2
trees.push(new Tree(179, 1097, 35, 30, 272, 168, 55, 45, images["trees"]));
trees.push(new Tree(550, 1190, 35, 30, 272, 168, 55, 45, images["trees"]));
trees.push(new Tree(621, 1123, 35, 30, 272, 168, 55, 45, images["trees"]));
trees.push(new Tree(136, 731, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(137, 1124, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(223, 1120, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(484, 1169, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(588, 1160, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(40, 1320, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(160, 1325, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(260, 1318, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(330, 1300, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(430, 1315, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(550, 1288, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(620, 1300, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(740, 1318, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(840, 1290, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(977, 1241, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1100, 1289, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(1250, 1300, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(823, 937, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(865, 856, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(903, 805, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(925, 704, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(965, 564, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1006, 463, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1050, 356, 100, 110, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(1062, 286, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1165, 284, 100, 110, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(1237, 283, 120, 130, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(1123, 354, 100, 110, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(1185, 358, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1296, 327, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1090, 426, 100, 110, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(1521, 270, 60, 60, 170, 308, 73, 73, images["trees"]));
trees.push(new Tree(1468, 262, 100, 110, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(1570, 287, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(1734, 278, 60, 60, 170, 308, 73, 73, images["trees"])); //куст 1
trees.push(new Tree(1866, 252, 60, 70, 111, 130, 90, 80, images["trees"])); //куст 2
trees.push(new Tree(1800, 273, 150, 150, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(1992, 367, 90, 90, 170, 308, 73, 73, images["trees"])); //куст 1
trees.push(new Tree(2137, 362, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(2287, 365, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(2480, 367, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(2655, 368, 60, 60, 170, 308, 73, 73, images["trees"])); //куст 1
trees.push(new Tree(2710, 360, 60, 70, 111, 130, 90, 80, images["trees"])); //куст 2
trees.push(new Tree(2237, 76, 80, 90, 0, 250, 102, 102, images["trees"])); //дерево 2
trees.push(new Tree(2410, 94, 60, 60, 170, 308, 73, 73, images["trees"]));
trees.push(new Tree(2333, 85, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(3563, 677, 60, 70, 111, 130, 90, 80, images["trees"]));
trees.push(new Tree(3564, 634, 80, 90, 0, 0, 110, 120, images["trees"])); //дерево 1
trees.push(new Tree(3573, 574, 120, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(3545, 965, 80, 90, 0, 0, 110, 120, images["trees"])); //дерево 1
trees.push(new Tree(3689, 925, 80, 90, 0, 0, 110, 120, images["trees"])); //дерево 1
trees.push(new Tree(3561, 885, 110, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(3614, 972, 110, 130, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(72, 715, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(535, 727, 60, 60, 170, 308, 73, 73, images["trees"]));
trees.push(new Tree(535, 788, 80, 90, 0, 0, 110, 120, images["trees"]));
trees.push(new Tree(534, 670, 80, 90, 0, 250, 102, 102, images["trees"]));
trees.push(new Tree(535, 510, 80, 90, 0, 125, 110, 120, images["trees"]));
trees.push(new Tree(535, 580, 110, 130, 0, 250, 102, 102, images["trees"]));

const blood = [];

const covers = [];
covers.push(new Cover(910, 1020, 10, 70, 0));
covers.push(new Cover(1150, 1180, 10, 70, 1));
covers.push(new Cover(1250, 1080, 50, 80, 2));
covers.push(new Cover(1410, 560, 80, 50, 3));
covers.push(new Cover(2210, 140, 10, 70, 4));
covers.push(new Cover(2100, 720, 30, 70, 5));
covers.push(new Cover(2100, 840, 30, 70, 6));
covers.push(new Cover(2510, 910, 70, 30, 7));
covers.push(new Cover(3400, 620, 70, 10, 8));

const init = () => {
  controlInit();
  creeping = false;
  lastRed = false;
  lastWater = false;
  bullets.clear();
  rounds.splice(0, rounds.length);

  camera.init(cameraStartX, cameraStartY, cameraSpeed, visiblePart, visiblePart);
  player.init(playerStartX, playerStartY, playerSpeed);

  controlPoints.splice(0, controlPoints.length);
  controlPoints.push(new ControlPoint(69, 137, 150, 2, [null], null));
  controlPoints.push(new ControlPoint(593, 281, 200, 2, [null], null));
  controlPoints.push(new ControlPoint(405, 1145, 300, 2, [null], 3));
  controlPoints.push(new ControlPoint(957, 1013, 200, 2, [2], 5));
  controlPoints.push(new ControlPoint(1241, 825, 200, 2, [null], 5));
  controlPoints.push(new ControlPoint(1741, 1205, 200, 2, [3, 4], 10));
  controlPoints.push(new ControlPoint(1749, 833, 200, 2, [null], 10));
  controlPoints.push(new ControlPoint(1680, 370, 300, 2, [null], 8));
  controlPoints.push(new ControlPoint(2649, 455, 350, 2, [7], 12));
  controlPoints.push(new ControlPoint(2181, 829, 200, 2, [null], 11));
  controlPoints.push(new ControlPoint(2217, 1213, 180, 3, [5, 6], 11));
  controlPoints.push(new ControlPoint(2685, 1113, 220, 2, [9, 10], 12));
  controlPoints.push(new ControlPoint(3705, 745, 200, 1, [8, 11], 13));
  controlPoints.push(new ControlPoint(3541, 281, 300, 2, [12], null));

  targets.splice(0, targets.length);
  targets.push(new Target(101, 41, 0, 1, 0, getRandom()));
  targets.push(new Target(29, 241, 0, -1, 0, getRandom()));
  targets.push(new Target(443, 327, 1, 0, 1, getRandom()));
  targets.push(new Target(703, 201, -1, 0, 1, getRandom()));
  targets.push(new Target(227, 1202, 1, -1, 2, getRandom()));
  targets.push(new Target(503, 1248, -1, -1, 2, getRandom()));
  targets.push(new Target(889, 907, -1, 1, 3, getRandom()));
  targets.push(new Target(949, 1060, -1, 0, 3, getRandom()));
  targets.push(new Target(1309, 726, -1, 1, 4, getRandom()));
  targets.push(new Target(1420, 940, 0, 1, 4, getRandom()));
  targets.push(new Target(1523, 584, 0, 1, 7, getRandom()));
  targets.push(new Target(2385, 300, -1, 1, 8, getRandom()));
  targets.push(new Target(2900, 481, -1, 0, 8, getRandom()));
  targets.push(new Target(1905, 1204, 0, -1, 5, getRandom()));
  targets.push(new Target(1663, 1205, -1, 0, 5, getRandom()));
  targets.push(new Target(1843, 723, -1, 1, 6, getRandom()));
  targets.push(new Target(1689, 921, 0, 1, 6, getRandom()));
  targets.push(new Target(2065, 760, 1, 0, 9, getRandom()));
  targets.push(new Target(2069, 885, 1, 0, 9, getRandom()));
  targets.push(new Target(2423, 960, 0, 1, 10, getRandom()));
  targets.push(new Target(2061, 1049, 0, 1, 10, getRandom()));
  targets.push(new Target(2140, 1289, 0, -1, 10, getRandom()));
  targets.push(new Target(2560, 980, 0, -1, 11, getRandom()));
  targets.push(new Target(2740, 760, 1, 0, 11, getRandom()));
  targets.push(new Target(1882, 103, 0, 1, 7, getRandom()));
  targets.push(new Target(3421, 864, -1, 1, 12, getRandom()));
  targets.push(new Target(3507, 289, -1, 1, 13, getRandom()));
  targets.push(new Target(3789, 107, -1, 1, 13, getRandom()));

  closestTarget = targets[0];
  targetsCount = targets.length;

  weapons.clear();
  weapons.add(new Weapon(0, 72, 20)).add(new Weapon(2, 660, 188)).add(new Weapon(0, 1222, 829)).
          add(new Weapon(1, 1160, 690)).add(new Weapon(2, 2174, 960)).add(new Weapon(1, 2585, 157)).
          add(new Weapon(0, 3715, 32)).add(new Weapon(2, 3320, 300));
  grenades.clear();
  clouds.splice(0, clouds.length);

  doors.splice(0, doors.length);
  doors.push(new Door(1200, 955, 80, 10, true, images["door"]));
  doors.push(new Door(1710, 955, 80, 10, true, images["door"]));
  doors.push(new Door(1700, 1135, 80, 10, true, images["door"]));
  doors.push(new Door(2015, 1170, 80, 10, false, images["door"]));
  doors.push(new Door(2770, 805, 60, 10, true, images["door"]));
  doors.push(new Door(2215, 1340, 60, 10, false, images["door"]));
  doors.push(new Door(1860, 155, 70, 10, true, images["door"]));
  doors.push(new Door(2425, 280, 60, 10, false, images["door"]));
  doors.push(new Door(3740, 225, 60, 10, true, images["door"]));
  doors.push(new Door(3460, 235, 70, 10, true, images["door"]));
  doors.push(new Door(3410, 465, 60, 10, true, images["door"]));
  doors.push(new Door(3370, 815, 70, 10, true, images["door"]));
  doors.push(new Door(3370, 945, 70, 10, true, images["door"]));

  glass.splice(0, glass.length);
  glass.push(new Glass(1100, 770, 50, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(1370, 770, 50, 10, -Math.PI / 2, images["glass"]));
  glass.push(new Glass(1110, 950, 60, 10, Math.PI, images["glass"]));
  glass.push(new Glass(1310, 950, 60, 10, Math.PI, images["glass"]));
  glass.push(new Glass(1620, 950, 60, 10, Math.PI, images["glass"]));
  glass.push(new Glass(1820, 950, 60, 10, Math.PI, images["glass"]));
  glass.push(new Glass(2640, 1390, 90, 10, Math.PI, images["glass"]));
  glass.push(new Glass(1610, 770, 50, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(1310, 950, 60, 10, Math.PI, images["glass"]));
  glass.push(new Glass(1880, 770, 50, 10, -Math.PI / 2, images["glass"]));
  glass.push(new Glass(1610, 1150, 100, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(2410, 670, 70, 10, 0, images["glass"]));
  glass.push(new Glass(2070, 1220, 100, 10, 0, images["glass"]));
  glass.push(new Glass(1740, 60, 60, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(3600, 100, 60, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(3260, 280, 60, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(3260, 370, 60, 10, Math.PI / 2, images["glass"]));
  glass.push(new Glass(3260, 840, 80, 10, Math.PI / 2, images["glass"]));

  blood.splice(0, blood.length);
}
