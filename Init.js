'use strict'
let RAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback){ window.setTimeout(callback, 1000 / 60) };

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
const visiblePart = 200;
let cameraSpeed = 1;

const worldTileSize = 10;
const canvasTileSize = worldTileSize / (visiblePart / canvas.width);


let sightWidth = 8;
let sightHeight = 2;

const bullets = new Set();
const rounds = [];

const playerStartX = 150;
const playerStartY = 150;
let playerSpeed = cameraSpeed;
const spritePlW = 96;
const spritePlH = 64;
const spriteFeetH = 38;
const spriteFeetW = 53;

const camera = new Camera(cameraStartX, cameraStartY, images["map"], visiblePart, visiblePart, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const spritePl = {
  pl : new Sprite(images["player"], 0, 0, spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2,3], 16),
  shoot : new Sprite(images["shoot"], 0, 0, spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1], 16),
  up : new Sprite(images["walk_UD"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0], 0),
  down : new Sprite(images["walk_UD"], 0, spriteFeetW, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1], 0),
  right : new Sprite(images["walk_RL"], 0, 0, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0], 0),
  left : new Sprite(images["walk_RL"], 0, spriteFeetH, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1], 0),
  strafe : new Sprite(images["strafe"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1], 0),
};

const player = new Player(playerStartX, playerStartY, spritePlW, spritePlH, playerSpeed, spritePl);

const targets = [];
targets.push(new Target(15, 30, 5, [{x: 15, y: 30}, {x: 15, y: 195}]));
targets.push(new Target(220, 100, 5, [{x: 220, y: 100}, {x: 120, y: 25}]));
targets.push(new Target(85, 285, 5, [{x: 85, y: 285}, {x: 130, y: 205}, {x: 215, y: 205}, {x: 215, y: 295}]));
targets.push(new Target(200, 100, 5, [{x: 260, y: 115}, {x: 260, y: 185}]));

const weapons = new Set();
weapons.add(new Weapon(1, 50, 50)).add(new Weapon(2, 50, 90)).add(new Weapon(0, 80, 80));
