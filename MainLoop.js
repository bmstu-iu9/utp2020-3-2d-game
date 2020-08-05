'use strict'

const update = () => {
  for (let bullet of bullets) {
    bullet.updateCoordinates();
  }

  player.move();
  rounds.forEach((item) => {
    item.update();
  });

  for (let i = 0; i < targets.length; i++) {
    targets[i].update();
  }
  camera.updateCoordinates();
  collision();
}

const drawPosit = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("x: " + player.x + " y: " + player.y + " / " + "x: " + sight.x + " y: " + sight.y + " / " + bullets.size +
  " Ammo: " + player.weapon.bullets + " / " + player.weapon.magazines.reduce( (accumulator, currentValue) => accumulator + currentValue, 0), 20, 20);
}

const drawTileTypes = () => {
  ctx.font = "8px Arial";
  ctx.fillStyle = "red";

  let minX = Math.floor(camera.x / worldTileSize);
  let maxX = Math.ceil((camera.x + camera.visibleWidth) / worldTileSize);
  let minY = Math.floor(camera.y / worldTileSize);
  let maxY = Math.ceil((camera.y + camera.visibleHeight) / worldTileSize);

  for (let i = minY; i < maxY; i++) {
    for (let j = minX; j < maxX; j++) {
      switch (tileMap[i][j]) {
        case "water":
          ctx.fillText("wa", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "red":
          ctx.fillText("r", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "door":
          ctx.fillText("d", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "black":
          ctx.fillText("b", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "orange":
          ctx.fillText("o", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "white":
          ctx.fillText("w", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "glass":
          ctx.fillText("g", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "cover":
          ctx.fillText("c", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
      }
    }
  }
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  camera.drawVisibleMap();
  //drawTileTypes();
  rounds.forEach((item) => {
    item.draw();
  });
  player.drawDirection();

  for (let bullet of bullets) bullet.draw();

  for (let i = 0; i < targets.length; i++) {
    targets[i].draw(1 / camera.scaleX);
  }

  sight.draw();
  drawPosit();
}

let lastTime = performance.now();
let now = 0;
let dt = 0;
let fps = 60;
let gameStep = 1 / fps;

const loop = () => {
  now = performance.now();
  dt += Math.min(1, (now - lastTime) / 1000);

  while (dt > gameStep) {
    dt -= gameStep;
    update();
  }

  draw();
  lastTime = now;

  RAF(loop);
}

loop();
