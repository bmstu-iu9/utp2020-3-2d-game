'use strict'
// import {ImageLoader} from './ImageLoader'
// import {GamePlayer} from './GamePlayer'
// import {ControlState} from './GamePlayer'
// let images = {};
// let loadImages = (imageFiles) => {
//   const loader = new ImageLoader(imageFiles);
//   loader.load().then((names) => {
//       images = Object.assign(images,loader.images);
//   })
// }
// let Player = new GamePlayer(new ControlState(),new ControlState);
// Player.x=100;
// Player.y=100;
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

let cameraStartX = 20;
let cameraStartY = 20;

let sightWidth = 8;
let sightHeight = 2;

const map = new Image();
map.src = "map.png";

const images = new Array();
images.push(map);

const camera = new Camera(cameraStartX, cameraStartY, map);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const worldToCanvas = (x, y) => {
  return {x: x - camera.x, y: y - camera.y};
}

const canvasToWorld = (x, y) => {
  return {x: x + camera.x, y: y + camera.y};
}

const update = () => {
  if (needResize) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    needResize = false;
    resized = true;
  }

  camera.updateCoordinates();
  sight.updateCoordinates();


}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.drawVisibleMap();
  sight.draw();

}

const loop = () => {
  draw();

  update();

  requestAnimationFrame(loop);
}

const onImagesLoaded = (images) => {
  let notLoaded = images.length;

  for (let i = 0; i < images.length; i++) {
    if (images[i].complete) {
      notLoaded--;
    } else {
      images[i].addEventListener("load", () => {
        notLoaded--;
        if (notLoaded == 0){
          notLoaded = -1;
          loop();
        }
      });

      if (notLoaded == 0) {
        notLoaded = -1;
        loop();
      }
    }
  }
}

onImagesLoaded(images);
