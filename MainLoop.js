'use strict';

const update = (dt) => {
  bullets.forEach(bullet => {
    bullet.updateCoordinates();
  });

  grenades.forEach(grenade => {
    grenade.update();
  });
  clouds.forEach(cloud => {
    cloud.update();
  });
  glass.forEach(g => {
    g.update();
  });
  blood.forEach(b => {
    b.update();
  });


  player.grenades.forEach(grenade => {
    grenade.update();
  });


  player.move(dt);

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

  doors.forEach(door => {
    door.update();
  });

  controlPoints.forEach(point => {
    point.update();
  });

  camera.updateCoordinates();
  collision();
}

const drawData = () => {
  let step = 0;
  let sx = 0;
  let sy = 0;
  for (let i = 1; i < player.hp + 1; i++) {
    sx = i * Math.sqrt(i) * 1.3 * 30;
    sy = 16;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx, 14, sx, 10, sx - 10, 10);
    ctx.bezierCurveTo(sx - 22, 10, sx - 22, 26, sx - 22, 26);
    ctx.bezierCurveTo(sx - 22, 32, sx - 14, 40, sx, 48);
    ctx.bezierCurveTo(sx + 14, 40, sx + 22, 32, sx + 22, 26);
    ctx.bezierCurveTo(sx + 22, 26, sx + 22, 10, sx + 10, 10);
    ctx.bezierCurveTo(sx + 4, 10, sx, 14, sx, sy);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  sx = 15;
  sy = 60;
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(sx, sy, 120, 10);
  ctx.fillStyle = "yellow";
  ctx.fillRect(sx, sy, player.weapon.bullets / player.weapon.maxBullets * 120, 10);
  for (let i = 0; i < player.weapon.maxBullets; i++) {
    step = 120 / player.weapon.maxBullets;
    ctx.strokeRect(sx + i * step , sy, step, 10);
  }
  ctx.closePath();

  for (let i = 0; i < player.weapon.magazines.length; i++) {
    sy = i * 10 + 75;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(sx, sy, 90, 7);
    ctx.fillStyle = "yellow";
    ctx.fillRect(sx, sy, player.weapon.magazines[i] / player.weapon.maxBullets * 90, 7);
    for (let i = 0; i < player.weapon.maxBullets; i++) {
      step = 90 / player.weapon.maxBullets;
      ctx.strokeStyle = "black";
      ctx.strokeRect(sx + i * step , sy, step, 7);
    }
    ctx.closePath();
  }

  if (player.weapon.id !== 2) {
    ctx.font = "11px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("АВ", 15, 110);
    ctx.fillText("ОД", 15, 125);

    ctx.strokeStyle = "white";

    if (player.weapon.singleShoot) {
      ctx.beginPath();
      ctx.arc(100, 106, 7, 3 * Math.PI / 2 - 0.4, Math.PI / 2 - 0.4);
      ctx.lineTo(42, 124);
      ctx.lineTo(40, 117);
      ctx.lineTo(100 - 2, 106 - 7);
      ctx.fill();
      ctx.arc(100, 106, 5, 3 * Math.PI / 2 - 0.4, Math.PI / 2 - 0.4);
      ctx.lineTo(44, 122);
      ctx.lineTo(42, 119);
      ctx.lineTo(100, 106 - 5);
      ctx.stroke();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.arc(100, 106, 7, 3 * Math.PI / 2, Math.PI / 2);
      ctx.lineTo(40, 109);
      ctx.lineTo(40, 103);
      ctx.lineTo(100, 106 - 7);
      ctx.fill()
      ctx.arc(100, 106, 5, 3 * Math.PI / 2, Math.PI / 2);
      ctx.lineTo(42, 107);
      ctx.lineTo(42, 105);
      ctx.lineTo(100, 106 - 5);
      ctx.stroke();
      ctx.closePath();
    }
  }

  for (let i = 1; i < player.grenades.length + 1; i++) {
    sx = 124;
    sy = 60 + 30 * i;
    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#808000";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "gray";
    ctx.fillRect(sx - 2, sy - 4, 5, -10);
    ctx.strokeRect(sx - 2, sy - 4, 5, -10);
    ctx.font = "8px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("G", sx - 3, sy + 5);
    ctx.closePath();
  }

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

  glass.forEach(gl => {
    gl.draw();
  });

  rounds.forEach(round => {
    round.draw();
  });

  blood.forEach(b => {
    b.draw();
  });

  grenades.forEach(grenade => {
    grenade.draw();
  });

  weapons.forEach(weapon => {
    weapon.draw();
  });

  bullets.forEach(bullet => {
    bullet.draw();
  });

  player.drawDirection();

  targets.forEach(target => {
    let v = player.vis(target.x, target.y, 0);
    if (v) {
      target.lastTimeSeen = performance.now();
    }
    if (v || performance.now() - target.lastTimeSeen < 1000) {
      target.draw(1 / camera.scaleX);
    }
  });

  doors.forEach(door => {
    door.draw();
  });

  clouds.forEach(cloud => {
    cloud.draw();
  });

  trees.forEach(tree => {
    tree.draw();
  });



  if (!throwGrenade && throwTime && player.grenades.length) {
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

  ctx.beginPath();
  ctx.arc(worldToCanvas(player.realXCenter, 0), worldToCanvas(player.realYCenter, 1), player.actionRadius / camera.scaleX, 0, 2 * Math.PI, false);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();

  let door = doors[3];
  ctx.beginPath();
  ctx.rect(worldToCanvas(door.getX(), 0), worldToCanvas(door.getY(), 1), door.getW() / camera.scaleX, door.getH() / camera.scaleY);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();

  sight.draw();

  let g = glass[0];
  ctx.beginPath();
  ctx.rect(worldToCanvas(g.getX(), 0), worldToCanvas(g.getY(), 1), g.getW() / camera.scaleX, g.getH() / camera.scaleY)
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();

  drawData();
}

const loop = () => {
  requestId = RAF(loop);
  //if (paused) return;
  now = performance.now();
  dt += Math.min(1, (now - lastTime) / 1000);

  while (dt > gameStep) {
    dt -= gameStep;
    update(dt);
  }

  draw();
  lastTime = now;

  // requestId = RAF(loop);
}

let lastTime = performance.now();
let now = 0;
let dt = 0;
let fps = 60;
let gameStep = 1 / fps;
let requestId = RAF(loop);
