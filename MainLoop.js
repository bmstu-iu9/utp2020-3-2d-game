'use strict'

const update = () => {
  pl.move();
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
  ctx.fillText("x: " + pl.x + " y: " + pl.y + " / " + canvas.height, 20, 20);
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.drawVisibleMap();
  pl.drawDirection();

  if (clicked) {
    clicked = false;
    if (pl.bulletsInMagazine === 0) {
      this.reload = true;
      if (pl.magazine !== 0) {
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

  if (pl.bulletsInMagazine !== 0 || pl.magazine !== 0) for (let bullet of bullets) bullet.draw();

  for (let i = 0; i < targets.length; i++) {
    targets[i].draw(1 / camera.scaleX);
  }

  sight.draw();
  drawPosit();
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
