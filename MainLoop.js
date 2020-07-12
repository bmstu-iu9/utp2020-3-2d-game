'use strict'

let ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let cameraStartX = 20;
let cameraStartY = 20;

let sightWidth = 8;
let sightHeight = 2;

let img = new Image();
img.src = "map.png";

let camera = new Camera(cameraStartX, cameraStartY);
let sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

// let setCanvasSize(w, h) {
//   if (w > h) {
//
//   }
// }

let worldToCanvas = (x, y) => {
  return {x: x - camera.x, y: y - camera.y};
}

let canvasToWorld = (x, y) => {
  return {x: x + camera.x, y: y + camera.y};
}

let update = () => {
  if (needResize) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    needResize = false;
    resized = true;
  }

  camera.updateCoordinates();
  sight.updateCoordinates();


}

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.drawVisibleMap();
  sight.draw();

}

let loop = () => {
  draw();

  update();

  requestAnimationFrame(loop);
}

img.addEventListener("load", () => {
  requestAnimationFrame(loop);
}, false);
