'use strict'
let frames = 4;

const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

//let speedRatio = 0.65 / 0.2 //pl / cam
let cameraSpeed = 1;
let playerSpeed = cameraSpeed; //* speedRatio;

let cameraStartX = 0;
let cameraStartY = 0;

let sightWidth = 8;
let sightHeight = 2;

//test
let bulletSpeed = 10;
let testBullet = null;
let bullets = new Set();
//test

let playerStartX = 100;
let playerStartY = 120;


const map = new Image();
map.src = "map.png";
const im = new Image();
im.src = "player.png";

const images = {};
images["map"] = map;
images["player"] = im;

const camera = new Camera(cameraStartX, cameraStartY, map, 200, 200, cameraSpeed);
const sight = new Sight(canvas.width, canvas.height, sightWidth, sightHeight);

const worldToCanvas = (t, type) => {  //0 для x
  if (type == 0) return Math.round((t - camera.x) / camera.scaleX);
  else return Math.round((t - camera.y) / camera.scaleY);
}

const canvasToWorld = (t, type) => {
  if (type == 0) return Math.round(t * camera.scaleX + camera.x);
  else return Math.round(t * camera.scaleY + camera.y);
}

const sprite = {
  up : new Sprite(im, 0,64*8, 64, 64, worldToCanvas(playerStartX - 8, 0), worldToCanvas(playerStartY - 10, 1), 8),
  down : new Sprite(im, 0, 64*10, 64, 64, worldToCanvas(playerStartX - 8, 0), worldToCanvas(playerStartY - 10, 1), 10),
  left : new Sprite(im, 0, 64*9, 64, 64, worldToCanvas(playerStartX - 8, 0), worldToCanvas(playerStartY - 10, 1), 9),
  right : new Sprite(im, 0, 64*11, 64, 64, worldToCanvas(playerStartX - 8, 0), worldToCanvas(playerStartY - 10, 1), 11),
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

const update = () => {
  pl.move();
  camera.updateCoordinates();

  //test
  for (let bullet of bullets){
    bullet.updateCoordinates();
    for (let i = 0; i < 8; i++) {
      if (bullet.collide(targets[i].x, targets[i].y, targets[i].r)) {
        targets[i].shooted = false;
      }
    }
  }
  //test
}

const drawScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("x: " + worldToCanvas(pl.x, 0) + " y: " + worldToCanvas(pl.y, 1) + " / " + canvas.height, 20, 20);
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.drawVisibleMap();
  pl.drawDirection();

  //test, пишется в теле класса персонажей?
  if (clicked) {
    clicked = false;
    //pl.bulletsInMagazine--;
    if (pl.bulletsInMagazine === 0) {
      this.reload = true;
      if (pl.magazine != 0) {
        pl.bulletsInMagazine = 30;
        pl.magazine--;
        this.reload = false;
      } else {
        this.reload = false;
      }
    } else {
      pl.bulletsInMagazine--;
      bullets.add(new Bullet(pl.x, pl.y,
                              canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1),
                              bulletSpeed));
    }

  }

  if (pl.bulletsInMagazine != 0 || pl.magazine != 0) for (let bullet of bullets) bullet.draw();

  //test

  for (let i = 0; i < 8; i++) {
    targets[i].draw(1 / camera.scaleX);
  }
  sight.draw();
  drawScore();
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
