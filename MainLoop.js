'use strict'
import {ImageLoader} from './ImageLoader'
import {GamePlayer} from './GamePlayer'
import {ControlState} from './GamePlayer'
let images = {};
let loadImages = (imageFiles) => {
  const loader = new ImageLoader(imageFiles);
  loader.load().then((names) => {
      images = Object.assign(images,loader.images);
  })
}
let Player = new GamePlayer(new ControlState(),new ControlState);
Player.x=100;
Player.y=100;
let ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

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
