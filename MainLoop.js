'use strict'
let frames = 4;

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

let playerStartX = canvas.width / 2;
let playerStartY = canvas.height / 2;

const map = new Image();
map.src = "map.png";
const im = new Image();
im.src = "player.png";

const images = {};
images["map"] = map;
images["player"] = im;

const camera = new Camera(cameraStartX, cameraStartY, map, 200, 200);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const sprite = {
  up : new Sprite(im, 0,64*8, 64, 64, playerStartX, playerStartY, 8),
  down : new Sprite(im, 0, 64*10, 64, 64, playerStartX, playerStartY, 10),
  left : new Sprite(im, 0, 64*9, 64, 64, playerStartX, playerStartY, 9),
  right : new Sprite(im, 0, 64*11, 64, 64, playerStartX, playerStartY, 11),
};
const pl = new Player(canvas.width / 2, canvas.height / 2, 64, 64, 1, sprite);

const worldToCanvas = (t, type) => {  //0 для x
  if (type == 0) return (t - camera.x) / camera.scaleX;
  else return (t - camera.y) / camera.scaleY;
}

const canvasToWorld = (t, type) => {
  if (type == 0) return t * camera.scaleX + camera.x;
  else return t * camera.scaleY + camera.y;
}

const targets = [];
targets.push(new Target(10, 10, 5));
targets.push(new Target(50, 100, 5));
targets.push(new Target(100, 100, 5));
targets.push(new Target(200, 100, 5));
targets.push(new Target(150, 300, 5));
targets.push(new Target(10, 200, 5));
targets.push(new Target(200, 10, 5));
targets.push(new Target(200, 200, 5));

const update = () => {
  pl.move();
  camera.updateCoordinates();

  //test
  if (testBullet != null) {
    testBullet.updateCoordinates();
    for (let i = 0; i < 8; i++) {
      if (testBullet.collide(targets[i].x, targets[i].y, targets[i].r)) {
        targets[i].shooted = false;
      }
    }
  }
  //test
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.drawVisibleMap();
  pl.drawDirection();


  //test, пишется в теле класса персонажей?
  if (clicked) {
    clicked = false;
    testBullet = new Bullet(canvasToWorld(canvas.width / 2, 0), canvasToWorld(canvas.height / 2, 1),
                            canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1),
                            bulletSpeed);

  }

  if (testBullet != null) testBullet.draw();
  //test
  for (let i = 0; i < 8; i++) {
    targets[i].draw(1 / camera.scaleX);
  }
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
