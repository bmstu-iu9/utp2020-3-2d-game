'use strict'

const update = () => {
  bullets.forEach(bullet => {
    bullet.updateCoordinates();
  });

  grenades.forEach(grenade => {
    grenade.update();
  });

  player.move();

  for (let i = 0; i < rounds.length; i++) {
    let round = rounds[i];
    if (i === 0 && round.deleteTime < performance.now()) {
      rounds.splice(0, 1);
    } else {
      round.update();
    }
  }

  targets.forEach(target => {
    target.update();
  });

  camera.updateCoordinates();
  collision();
}

const drawPosit = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Ammo: " + player.weapon.bullets + " / " +
               player.weapon.magazines.reduce( (accumulator, currentValue) => accumulator + currentValue, 0), 20, 20);
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
          ctx.fillText("wa", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "red":
          ctx.fillText("r", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "door":
          ctx.fillText("d", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "black":
          ctx.fillText("b", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "orange":
          ctx.fillText("o", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "white":
          ctx.fillText("w", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "glass":
          ctx.fillText("g", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
        case "cover":
          ctx.fillText("c", worldToCanvas(j * worldTileSize + 5, 0), worldToCanvas(i * worldTileSize + 5, 1));
          break;
      }
    }
  }
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  camera.drawVisibleMap();
  rounds.forEach(round => {
    round.draw();
  });

  weapons.forEach(weapon => {
    weapon.draw();
  });

  player.drawDirection();

  bullets.forEach(bullet => {
    bullet.draw();
  });

  targets.forEach(target => {
    if (player.vis(target.x, target.y)) {
      target.draw(1 / camera.scaleX);
    }
  });

  grenades.forEach(grenade => {
    grenade.draw();
  });

  if (!throwGrenade && throwTime){
    Grenade.drawProgress(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset, throwTime);
  }

  ctx.beginPath();
  ctx.rect(worldToCanvas(player.realX, 0), worldToCanvas(player.realY, 1), player.realW / camera.scaleX, player.realH / camera.scaleY);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(worldToCanvas(player.x, 0), worldToCanvas(player.y, 1), player.w, player.h);
  ctx.strokeStyle = "blue";
  ctx.stroke();
  ctx.closePath();

  sight.draw();
  drawPosit();
}

const loop = () => {
  now = performance.now();
  dt += Math.min(1, (now - lastTime) / 1000);

  while (dt > gameStep) {
    dt -= gameStep;
    update();
  }

  draw();
  lastTime = now;

  requestId = RAF(loop);
}

let lastTime = performance.now();
let now = 0;
let dt = 0;
let fps = 60;
let gameStep = 1 / fps;

let requestId = RAF(loop);
