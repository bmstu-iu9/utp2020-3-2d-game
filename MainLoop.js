'use strict'
let frames=4;
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

let cameraStartX = 0;
let cameraStartY = 0;

let sightWidth = 8;
let sightHeight = 2;

//test
let bulletSpeed = 10;
let testBullet = null;
//test

const map = new Image();
map.src = "map.png";

const images = {};
images["map"] = map;

const camera = new Camera(cameraStartX, cameraStartY, map, 200, 200);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const worldToCanvas = (t, type) => {  //0 для x
  if (type == 0) return (t - camera.x) / camera.scaleX;
  else return (t - camera.y) / camera.scaleY;
}

const canvasToWorld = (t, type) => {
  if (type == 0) return t * camera.scaleX + camera.x;
  else return t * camera.scaleY + camera.y;
}

const update = () => {
  camera.updateCoordinates();

  //test
  if (testBullet != null) testBullet.updateCoordinates();
  //test
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.drawVisibleMap();
  sight.draw();

  //test, пишется в теле класса персонажей?
  if (clicked) {
    clicked = false;
    testBullet = new Bullet(canvasToWorld(50, 0), canvasToWorld(50, 1),
                            canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1),
                            bulletSpeed);
  
  }

  if (testBullet != null) testBullet.draw();
  //test

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
