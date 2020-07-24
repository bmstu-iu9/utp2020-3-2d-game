'use strict'

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

let playerStartX = 100;
let playerStartY = 120;
let playerSpeed = cameraSpeed;
let spriteIndex = [8,9,10,11];
let spritePlW = 64;
let spritePlH = 64;
const spriteWKoef = 8;
const spriteHKoef = 10;

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
  up : new Sprite(playerImg, 0,spritePlH*spriteIndex[0], spritePlW, spritePlH, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), spriteIndex[0]),
  down : new Sprite(playerImg, 0, spritePlH*spriteIndex[2], spritePlW, spritePlH, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), spriteIndex[2]),
  left : new Sprite(playerImg, 0, spritePlH*spriteIndex[1], spritePlW, spritePlH, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), spriteIndex[1]),
  right : new Sprite(playerImg, 0, spritePlH*spriteIndex[3], spritePlW, spritePlH, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), spriteIndex[3]),
};

const player = new Player(playerStartX, playerStartY, 64, 64, playerSpeed, spritePl);

const targets = [];
targets.push(new Target(10, 10, 5));
targets.push(new Target(50, 100, 5));
targets.push(new Target(100, 100, 5));
targets.push(new Target(200, 100, 5));
targets.push(new Target(150, 300, 5));
targets.push(new Target(10, 200, 5));
targets.push(new Target(200, 10, 5));
targets.push(new Target(200, 200, 5));
