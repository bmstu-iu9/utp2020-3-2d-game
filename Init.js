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
  pl : new Sprite(images["player"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2,3]),
  shoot : new Sprite(images["shoot"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1]),
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

const targets = [];
//targets.push(new Target(15, 30, 5));
// targets.push(new Target(130, 100, 5));
//targets.push(new Target(80, 285, 5));
//targets.push(new Target(200, 100, 5));

const weapons = new Set();
weapons.add(new Weapon(1, 50, 50)).add(new Weapon(2, 50, 90)).add(new Weapon(0, 80, 80));
const grenades = new Set();

const doors = [];
doors.push(new Door(30, 61, 8, 2, false, images["door"]));
doors.push(new Door(121, 70, 8, 2, true, images["door"]));

const init = () => {
  bullets.clear();
  rounds.splice(0, rounds.length);

  camera.x = cameraStartX;
  camera.y = cameraStartY;

  player.init(playerStartX, playerStartY);

  targets.splice(0, targets.length);
  //targets.push(new Target(15, 30, 5));
  //targets.push(new Target(130, 100, 5));
  //targets.push(new Target(80, 285, 5));
  //targets.push(new Target(200, 100, 5));

  weapons.clear();
  weapons.add(new Weapon(1, 50, 50)).add(new Weapon(2, 50, 90)).add(new Weapon(0, 80, 80));
  grenades.clear();

  doors.splice(0, doors.length);
  doors.push(new Door(30, 61, 8, 2, false, images["door"]));
  doors.push(new Door(121, 70, 8, 2, true, images["door"]));
}
