'use strict'
let frames=4;
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

let cameraStartX = 20;
let cameraStartY = 20;

let sightWidth = 8;
let sightHeight = 2;

//test
let bulletSpeed = 50;
let testBullet = null;
//test

const map = new Image();
map.src = "map.png";

const images = {};
images["map"] = map;

const camera = new Camera(cameraStartX, cameraStartY, map);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const worldToCanvas = (x, y) => {
  return {x: x - camera.x, y: y - camera.y};
}

const canvasToWorld = (x, y) => {
  return {x: x + camera.x, y: y + camera.y};
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
    testBullet = new Bullet(50, 50, sight.x, sight.y, bulletSpeed);
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
