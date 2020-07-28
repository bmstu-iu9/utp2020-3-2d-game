'use strict'
let RFA =
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
let singleShoot = true;
let shootEnable = true;

let playerStartX = 100;
let playerStartY = 120;
let playerSpeed = cameraSpeed;
let spriteIndex = [8,9,10,11];
let spritePlW = 64;
let spritePlH = 64;
const spriteHKoef = 9;

const mapImg = new Image();
mapImg.src = "map.png";

const playerImg = new Image();
playerImg.src = "player.png";

const images = {};
images["map"] = mapImg;
images["player"] = playerImg;

const camera = new Camera(cameraStartX, cameraStartY, mapImg, visiblePart, visiblePart, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const spritePl = {
  up : new Sprite(playerImg, 0,spritePlH*spriteIndex[0], spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), spriteIndex[0]),
  down : new Sprite(playerImg, 0, spritePlH*spriteIndex[2], spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), spriteIndex[2]),
  left : new Sprite(playerImg, 0, spritePlH*spriteIndex[1], spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), spriteIndex[1]),
  right : new Sprite(playerImg, 0, spritePlH*spriteIndex[3], spritePlW, spritePlH, worldToCanvas(playerStartX, 0), worldToCanvas(playerStartY, 1), spriteIndex[3]),
};

const player = new Player(playerStartX, playerStartY, 64, 64, playerSpeed, spritePl);

const targets = [];
targets.push(new Target(10, 10, 5, [{x: 10, y: 10}, {x: 50, y: 10}]));
targets.push(new Target(50, 100, 5, [{x: 50, y: 100}, {x: 100, y: 200}]));
targets.push(new Target(100, 100, 5, [{x: 100, y: 100}, {x: 50, y: 200}]));
targets.push(new Target(200, 100, 5, [{x: 200, y: 100}, {x: 10, y: 20}]));
