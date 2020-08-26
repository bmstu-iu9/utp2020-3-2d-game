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

const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

const blockCenter = 5;
const blockSize = 10;

const cameraStartX = 0;
const cameraStartY = 0;
const moveBorder = 150;
const visiblePart = 500;
let cameraSpeed = 4;

const worldTileSize = 10;
const canvasTileSize = worldTileSize / (visiblePart / canvas.width);


let sightWidth = 8;
let sightHeight = 2;

const bullets = new Set();
const rounds = [];

const playerStartX = 218;
const playerStartY = 52;
const playerWidth = 56;
const playerHeight = 48;
let playerSpeed = cameraSpeed;
const spriteTileW = 96;
const spriteTileH = 64;
const spriteFeetH = 38;
const spriteFeetW = 53;
const FeetH = 1.75;
const FeetW = 7;

const srcOffsetX = 8;
const srcOffsetY = 10;
const realOffsetX = playerWidth / spriteTileW * srcOffsetX;
const realOffsetY = playerHeight / spriteTileH * srcOffsetY;
const srcRealW = 63;
const srcRealH = 49;
const realW = playerWidth / spriteTileW * srcRealW;
const realH = playerHeight / spriteTileH * srcRealH;
const gunOffsetX = 88;
const gunOffsetY = 48;
let xDeg = 24;
let yDeg = 40;
const gunOffset = Math.atan( (gunOffsetY - yDeg) / (gunOffsetX - xDeg));

const camera = new Camera(cameraStartX, cameraStartY, images["map"], visiblePart, visiblePart, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const spritePl = {
  pl : new Sprite(images["player"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2,3,4,5]),
  shoot : new Sprite(images["shoot"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2]),
  up : new Sprite(images["walk_UD"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0]),
  down : new Sprite(images["walk_UD"], 0, spriteFeetW, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1]),
  right : new Sprite(images["walk_RL"], 0, 0, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0]),
  left : new Sprite(images["walk_RL"], 0, spriteFeetH, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1]),
  strafe : new Sprite(images["strafe"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1]),
};

spritePl.pl.setWorldSize(playerWidth, playerHeight);
spritePl.shoot.setWorldSize(playerWidth, playerHeight);
spritePl.up.setWorldSize(FeetH, FeetW);
spritePl.down.setWorldSize(FeetH, FeetW);
spritePl.left.setWorldSize(FeetW, FeetH);
spritePl.right.setWorldSize(FeetW, FeetH);

const player = new Player(playerStartX, playerStartY, playerWidth, playerHeight,
                          realOffsetX, realOffsetY, realW, realH, playerSpeed, spritePl);

const controlPoints = []
controlPoints.push(69, 137, 60, 3, [null], null);
controlPoints.push(593, 281, 170, 3, [null], null);
controlPoints.push(405, 1145, 170, 2, [null], 4);
controlPoints.push(957, 1013, 130, 2, [3], 6);
controlPoints.push(1241, 825, 120, 3, [null], 6);
controlPoints.push(1741, 1205, 100, 3, [4, 5], 11);
controlPoints.push(1749, 833, 120, 4, [null], 11);
controlPoints.push(1405, 413, 230, 3, [null], 9);
controlPoints.push(2649, 455, 220, 2, [8], 13);
controlPoints.push(2181, 829, 150, 4, [null], 12);
controlPoints.push(2217, 1213, 180, 4, [6, 7], 12);
controlPoints.push(2685, 1113, 200, 4, [10, 11], 13);
controlPoints.push(3705, 745, 100, 0, [9, 12], null);

const targets = [];
targets.push(new Target(107, 41, 1));
targets.push(new Target(29, 231, 1));
targets.push(new Target(101, 669, 1));
targets.push(new Target(449, 775, 2));
targets.push(new Target(443, 327, 2));
targets.push(new Target(703, 201, 2));
targets.push(new Target(227, 1194, 3));
targets.push(new Target(503, 1248, 3));
targets.push(new Target(897, 900, 4));
targets.push(new Target(953, 1056, 4));
targets.push(new Target(1309, 736, 5));
targets.push(new Target(1179, 912, 5));
targets.push(new Target(1413, 890, 5));
targets.push(new Target(1503, 1148, 6));
targets.push(new Target(1533, 584, 8));
targets.push(new Target(1233, 440, 8));
targets.push(new Target(2385, 299, 9));
targets.push(new Target(2897, 471, 9));
targets.push(new Target(1669, 1173, 6));
targets.push(new Target(1905, 1215, 6));
targets.push(new Target(1937, 719, 7));
targets.push(new Target(1653, 713, 7));
targets.push(new Target(1845, 717, 7));
targets.push(new Target(1691, 919, 7));
targets.push(new Target(2065, 757, 10));
targets.push(new Target(2069, 875, 10));
targets.push(new Target(2449, 725, 10));
targets.push(new Target(2423, 959, 11));
targets.push(new Target(2061, 1051, 11));
targets.push(new Target(2135, 1289, 11));
targets.push(new Target(2257, 1257, 11));
targets.push(new Target(2551, 731, 12));
targets.push(new Target(2559, 977, 12));
targets.push(new Target(2737, 757, 12));
targets.push(new Target(2745, 1183, 12));
targets.push(new Target(1654, 357, 8));
targets.push(new Target(2336, 729, 10));

const weapons = new Set();
weapons.add(new Weapon(1, 72, 20)).add(new Weapon(2, 660, 188)).add(new Weapon(0, 1222, 829));
const grenades = new Set();
const clouds = [];

const doors = [];
doors.push(new Door(1200, 955, 80, 10, true, images["door"]));
doors.push(new Door(1710, 955, 80, 10, true, images["door"]));
doors.push(new Door(1700, 1135, 80, 10, true, images["door"]));
doors.push(new Door(2015, 1170, 80, 10, false, images["door"]));
doors.push(new Door(2770, 805, 60, 10, true, images["door"]));

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

const init = () => {
  controlInit();
  bullets.clear();
  rounds.splice(0, rounds.length);

  camera.x = cameraStartX;
  camera.y = cameraStartY;

  player.init(playerStartX, playerStartY);


  controlPoints.splice(0, controlPoints.length);
  controlPoints.push(69, 137, 60, 3, [null], null);
  controlPoints.push(593, 281, 170, 3, [null], null);
  controlPoints.push(405, 1145, 170, 2, [null], 4);
  controlPoints.push(957, 1013, 130, 2, [3], 6);
  controlPoints.push(1241, 825, 120, 3, [null], 6);
  controlPoints.push(1741, 1205, 100, 3, [4, 5], 11);
  controlPoints.push(1749, 833, 120, 4, [null], 11);
  controlPoints.push(1405, 413, 230, 3, [null], 9);
  controlPoints.push(2649, 455, 220, 2, [8], 13);
  controlPoints.push(2181, 829, 150, 4, [null], 12);
  controlPoints.push(2217, 1213, 180, 4, [6, 7], 12);
  controlPoints.push(2685, 1113, 200, 4, [10, 11], 13);
  controlPoints.push(3705, 745, 100, 0, [9, 12], null);

  targets.splice(0, targets.length);
  targets.push(new Target(107, 41, 1));
  targets.push(new Target(29, 231, 1));
  targets.push(new Target(101, 669, 1));
  targets.push(new Target(449, 775, 2));
  targets.push(new Target(443, 327, 2));
  targets.push(new Target(703, 201, 2));
  targets.push(new Target(227, 1194, 3));
  targets.push(new Target(503, 1248, 3));
  targets.push(new Target(897, 900, 4));
  targets.push(new Target(953, 1056, 4));
  targets.push(new Target(1309, 736, 5));
  targets.push(new Target(1179, 912, 5));
  targets.push(new Target(1413, 890, 5));
  targets.push(new Target(1503, 1148, 6));
  targets.push(new Target(1533, 584, 8));
  targets.push(new Target(1233, 440, 8));
  targets.push(new Target(2385, 299, 9));
  targets.push(new Target(2897, 471, 9));
  targets.push(new Target(1669, 1173, 6));
  targets.push(new Target(1905, 1215, 6));
  targets.push(new Target(1937, 719, 7));
  targets.push(new Target(1653, 713, 7));
  targets.push(new Target(1845, 717, 7));
  targets.push(new Target(1691, 919, 7));
  targets.push(new Target(2065, 757, 10));
  targets.push(new Target(2069, 875, 10));
  targets.push(new Target(2449, 725, 10));
  targets.push(new Target(2423, 959, 11));
  targets.push(new Target(2061, 1051, 11));
  targets.push(new Target(2135, 1289, 11));
  targets.push(new Target(2257, 1257, 11));
  targets.push(new Target(2551, 731, 12));
  targets.push(new Target(2559, 977, 12));
  targets.push(new Target(2737, 757, 12));
  targets.push(new Target(2745, 1183, 12));
  targets.push(new Target(1654, 357, 8));
  targets.push(new Target(2336, 729, 10));

  weapons.clear();
  weapons.add(new Weapon(1, 72, 20)).add(new Weapon(2, 660, 188)).add(new Weapon(0, 1222, 829));
  grenades.clear();
  clouds.splice(0, clouds.length);

  doors.splice(0, doors.length);
  doors.push(new Door(1200, 955, 80, 10, true, images["door"]));
  doors.push(new Door(1710, 955, 80, 10, true, images["door"]));
  doors.push(new Door(1700, 1135, 80, 10, true, images["door"]));
  doors.push(new Door(2015, 1170, 80, 10, false, images["door"]));
  doors.push(new Door(2770, 805, 60, 10, true, images["door"]));

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

}
