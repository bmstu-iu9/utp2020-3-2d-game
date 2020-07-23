'use strict'

const worldToCanvas = (t, type) => {
  if (type == 0) return Math.round((t - camera.x) / camera.scaleX);
  else return Math.round((t - camera.y) / camera.scaleY);
}

const canvasToWorld = (t, type) => {
  if (type == 0) return Math.round(t * camera.scaleX + camera.x);
  else return Math.round(t * camera.scaleY + camera.y);
}

let frames = 4;

const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

let cameraStartX = 0;
let cameraStartY = 0;
let cameraSpeed = 0.5;
const moveBorder = 150;

let sightWidth = 8;
let sightHeight = 2;

let bulletSpeed = 10;
let bullets = new Set();

let playerStartX = 100;
let playerStartY = 120;
let playerSpeed = cameraSpeed;
const spriteWKoef = 8;
const spriteHKoef = 10;

const map = new Image();
map.src = "map.png";
const visiblePart = 200;

const im = new Image();
im.src = "player.png";

const images = {};
images["map"] = map;
images["player"] = im;

const camera = new Camera(cameraStartX, cameraStartY, map, visiblePart, visiblePart, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const sprite = {
  up : new Sprite(im, 0,64*8, 64, 64, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), 8),
  down : new Sprite(im, 0, 64*10, 64, 64, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), 10),
  left : new Sprite(im, 0, 64*9, 64, 64, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), 9),
  right : new Sprite(im, 0, 64*11, 64, 64, worldToCanvas(playerStartX - spriteWKoef, 0), worldToCanvas(playerStartY - spriteHKoef, 1), 11),
};

const pl = new Player(playerStartX, playerStartY, 64, 64, playerSpeed, sprite);

const targets = [];
targets.push(new Target(10, 10, 5));
targets.push(new Target(50, 100, 5));
targets.push(new Target(100, 100, 5));
targets.push(new Target(200, 100, 5));
targets.push(new Target(150, 300, 5));
targets.push(new Target(10, 200, 5));
targets.push(new Target(200, 10, 5));
targets.push(new Target(200, 200, 5));
