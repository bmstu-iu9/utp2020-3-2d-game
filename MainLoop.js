'use strict'
let frames=4;
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

let cameraStartX = 20;
let cameraStartY = 20;

let sightWidth = 8;
let sightHeight = 2;
const im=new Image();
im.src="player.png";
var sprite = {
  up : new Sprite(im,0,64*8,64,64,100,100,8),
  down : new Sprite(im,0,64*10,64,64,100,100,10),
  left : new Sprite(im,0,64*9,64,64,100,100,9),
  right : new Sprite(im,0,64*11,64,64,100,100,11),
};
var pl=new Player(100,100,64,64,1, sprite);

const map = new Image();
map.src = "map.png";

const images = {};
images["map"] = map;
images["player"] = im;

const camera = new Camera(cameraStartX, cameraStartY, map);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const worldToCanvas = (x, y) => {
  return {x: x - camera.x, y: y - camera.y};
}

const canvasToWorld = (x, y) => {
  return {x: x + camera.x, y: y + camera.y};
}

const update = () => {
  pl.move();
  camera.updateCoordinates();


}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.drawVisibleMap();
  pl.drawDirection();
  sight.draw();

}

const loop = () => {
  draw();

  update();

  requestAnimationFrame(loop);
}

const onImagesLoaded = (images) => {
  let notLoaded = Object.keys(images).length;

  for (let x in images) {
    if (images[x].complete) {
      notLoaded--;
    } else {
      images[x].addEventListener("load", () => {
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
