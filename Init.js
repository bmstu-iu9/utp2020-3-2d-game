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


const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

const canvasTileSize = 20;
const worldTileSize = 4;

let cameraStartX = 0;
let cameraStartY = 0;
let cameraSpeed = 0.5;
const moveBorder = 150;
const visiblePart = 200;

let sightWidth = 8;
let sightHeight = 2;

let bulletSpeed = 10;
let bullets = new Set();
let rounds = [];

let playerStartX = 100;
let playerStartY = 120;
let playerSpeed = cameraSpeed;
let spriteIndex = [8,9,10,11];
let spritePlW = 96;
let spritePlH = 64;
let spriteFeetH = 38;
let spriteFeetW = 53;
const spriteHKoef = 9;

const camera = new Camera(cameraStartX, cameraStartY, images["map"], visiblePart, visiblePart, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const spritePl = {
  pl : new Sprite(images["player"], 0, 0, spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1,2,3]),
  shoot : new Sprite(images["shoot"], 0, 0, spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1]),
  up : new Sprite(images["walk_UD"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0]),
  down : new Sprite(images["walk_UD"], 0, spriteFeetW, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1]),
  right : new Sprite(images["walk_RL"], 0, 0, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0]),
  left : new Sprite(images["walk_RL"], 0, spriteFeetH, spriteFeetW, spriteFeetH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [1]),
  strafe : new Sprite(images["strafe"], 0, 0, spriteFeetH, spriteFeetW, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), [0,1]),
};

const player = new Player(playerStartX, playerStartY, spritePlW, spritePlH, playerSpeed, spritePl);

const targets = [];
targets.push(new Target(10, 10, 5, [{x: 10, y: 10}, {x: 50, y: 10}]));
targets.push(new Target(50, 100, 5, [{x: 50, y: 100}, {x: 100, y: 200}]));
targets.push(new Target(100, 100, 5, [{x: 100, y: 100}, {x: 50, y: 200}]));
targets.push(new Target(200, 100, 5, [{x: 200, y: 100}, {x: 10, y: 20}]));
