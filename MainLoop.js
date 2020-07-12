'use strict'

let ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let cameraStartX = 20;
let cameraStartY = 20;

let img = new Image();
img.src = "map.png";

let camera = new Camera(cameraStartX, cameraStartY);

let update = () => {
  camera.updateCoordinates();

}

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.drawVisibleMap();

}

let loop = () => {
  draw();

  update();

  requestAnimationFrame(loop);
}

img.addEventListener("load", () => {
  requestAnimationFrame(loop);
}, false);
