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

let cameraStartX = 0;
let cameraStartY = 0;
const moveBorder = 150;
const visiblePart = 200;
let cameraSpeed = 1;

const worldTileSize = 10;
const canvasTileSize = worldTileSize / (visiblePart / canvas.width);


let sightWidth = 8;
let sightHeight = 2;

let bulletSpeed = 10;
let bullets = new Set();
let rounds = [];

let playerStartX = 150;
let playerStartY = 150;
let playerSpeed = cameraSpeed;
let spritePlW = 96;
let spritePlH = 64;
let spriteFeetH = 38;
let spriteFeetW = 53;
const spriteHKoef = 9;

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
targets.push(new Target(10, 10, 5, [{x: 10, y: 10}, {x: 50, y: 10}]));
targets.push(new Target(50, 100, 5, [{x: 50, y: 100}, {x: 100, y: 200}]));
targets.push(new Target(100, 100, 5, [{x: 100, y: 100}, {x: 50, y: 200}]));
targets.push(new Target(200, 100, 5, [{x: 200, y: 100}, {x: 10, y: 20}]));
