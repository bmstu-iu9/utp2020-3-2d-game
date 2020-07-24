'use strict'

const update = () => {
  player.move();
  camera.updateCoordinates();

  for (let bullet of bullets) {
    bullet.updateCoordinates();
    for (let i = 0; i < targets.length; i++) {
      if (bullet.collide(targets[i].x, targets[i].y, targets[i].r)) {
        targets[i].shooted = false;
      }
    }
  }
}

const drawPosit = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("x: " + player.x + " y: " + player.y + " / " + canvas.height, 20, 20);
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.drawVisibleMap();
  player.drawDirection();

  if (clicked) {
    clicked = false;
    if (player.bulletsInMagazine === 0) {
      this.reload = true;
      if (player.magazine !== 0) {
        player.bulletsInMagazine = 30;
        player.magazine--;
        this.reload = false;
      } else {
        this.reload = false;
      }
    } else {
      player.bulletsInMagazine--;
      bullets.add(new Bullet(player.x, player.y,
                             canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1),
                             bulletSpeed));
    }
  }

  if (player.bulletsInMagazine !== 0 || player.magazine !== 0) for (let bullet of bullets) bullet.draw();

  for (let i = 0; i < targets.length; i++) {
    targets[i].draw(1 / camera.scaleX);
  }

  sight.draw();
  drawPosit();
}

let lastTime = performance.now();
let now = 0;
let dt = 0;
let fps = 1 / 60;

const loop = () => {
  now = performance.now();
  dt += (now - lastTime) / 1000;

  while (dt > fps) {
    dt -= fps;
    update();
  }

  draw();

  lastTime = now;

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
        if (notLoaded === 0){
          notLoaded = -1;
          loop();
        }
      });

      if (notLoaded === 0) {
        notLoaded = -1;
        loop();
      }
    }
  }
}

onImagesLoaded(images);
