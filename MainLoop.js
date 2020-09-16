'use strict';

const update = () => {

  if (outro.playing) {
    camera.changeVisiblePart(0.5);
  }

  camera.updateCoordinates();

  if (targetsCount === 0 && !outro.playing) {
    outro.play();
  }

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

  player.move();

  for (let i = 0; i < rounds.length; i++) {
    let round = rounds[i];
    if (i === 0 && round.deleteTime < performance.now()) {
      rounds.splice(0, 1);
    } else {
      round.update();
    }
  }

  targetOnCanvas = false;
  distCT = 5000;
  targets.forEach(target => {
    target.update();
    if (target.alive) {
      if (pointInRect(worldToCanvas(target.x, 0), worldToCanvas(target.y, 1), 0, 0, canvas.width, canvas.height)) {
        targetOnCanvas = true;
      } else if (dist(player.realXCenter, target.x, player.realYCenter, target.y) < distCT) {
        distCT = dist(player.realXCenter, target.x, player.realYCenter, target.y);
        closestTarget = target;
      }
    }
  });

  doors.forEach(door => {
    door.update();
  });

  controlPoints.forEach(point => {
    point.update();
  });

  //camera.updateCoordinates();
  collision();
  grenadeCollision();
}

const drawUI = () => {
  let Px = 0;
  let Py = 0;
  if (!targetOnCanvas) {
    if (collisionSegment(player.realXCenter, player.realYCenter, closestTarget.x, closestTarget.y,
                         canvasToWorld(0, 0), canvasToWorld(0, 1), canvasToWorld(canvas.width, 0), canvasToWorld(0, 1))) {
      Px = canvasToWorld(0, 0) + (canvasToWorld(canvas.width, 0) - canvasToWorld(0, 0)) *
                                 Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                       canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter)) /
                                 Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                       canvasToWorld(canvas.width, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter) -
                                          crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                       canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter));
      Py = canvasToWorld(0, 1);
      Px = worldToCanvas(Px, 0);
      Py = worldToCanvas(Py, 1);
    }
    if (collisionSegment(player.realXCenter, player.realYCenter, closestTarget.x, closestTarget.y,
                         canvasToWorld(0, 0), canvasToWorld(canvas.height, 1), canvasToWorld(canvas.width, 0), canvasToWorld(canvas.height, 1))) {
      Px = canvasToWorld(canvas.width, 0) + (canvasToWorld(0, 0) - canvasToWorld(canvas.width, 0)) *
                                            Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                  canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(canvas.height, 1) - player.realYCenter)) /
                                            Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                  canvasToWorld(canvas.width, 0) - player.realXCenter, canvasToWorld(canvas.height, 1) - player.realYCenter) -
                                                     crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                           canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(canvas.height, 1) - player.realYCenter));
      Py = canvasToWorld(canvas.height, 1);
      Px = canvas.width - worldToCanvas(Px, 0);
      Py = worldToCanvas(Py, 1);
    }
    if (collisionSegment(player.realXCenter, player.realYCenter, closestTarget.x, closestTarget.y,
                         canvasToWorld(0, 0), canvasToWorld(0, 1), canvasToWorld(0, 0), canvasToWorld(canvas.height, 1))) {
      Px = canvasToWorld(0, 0);
      Py = canvasToWorld(canvas.height, 1) + (canvasToWorld(0, 1) - canvasToWorld(canvas.height, 1)) *
                                             Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                   canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter)) /
                                             Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                   canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(canvas.height, 1) - player.realYCenter) -
                                                      crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                            canvasToWorld(0, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter));
      Px = worldToCanvas(Px, 0);
      Py = canvas.height - worldToCanvas(Py, 1);
    }
    if (collisionSegment(player.realXCenter, player.realYCenter, closestTarget.x, closestTarget.y,
                         canvasToWorld(canvas.width, 0), canvasToWorld(0, 1), canvasToWorld(canvas.width, 0), canvasToWorld(canvas.height, 1))) {
      Px = canvasToWorld(canvas.width, 0);
      Py = canvasToWorld(0, 1) + (canvasToWorld(canvas.height, 1) - canvasToWorld(0, 1)) *
                                 Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                       canvasToWorld(canvas.width, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter)) /
                                 Math.abs(crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                       canvasToWorld(canvas.width, 0) - player.realXCenter, canvasToWorld(canvas.height, 1) - player.realYCenter) -
                                          crossProduct(closestTarget.x - player.realXCenter, closestTarget.y - player.realYCenter,
                                                                canvasToWorld(canvas.width, 0) - player.realXCenter, canvasToWorld(0, 1) - player.realYCenter));
      Px = worldToCanvas(Px, 0);
      Py = worldToCanvas(Py, 1);
    }
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(Px - 5, Py - 5, 10, 10);
    ctx.closePath();
  }

  ctx.lineWidth = 1;
  let step = 0;
  let sx = 0;
  let sy = 0;
  for (let i = 0.5; i < player.hp + 0.5; i += 0.5) {
    sx = i * 80 - 15;
    sy = 12;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx - 1, 11, sx - 1, 8, sx - 9, 8);
    ctx.bezierCurveTo(sx - 16, 8, sx - 16, 19, sx - 16, 19);
    ctx.bezierCurveTo(sx - 16, 24, sx - 11, 30, sx, 36);
    ctx.bezierCurveTo(sx + 11, 30, sx + 16, 24, sx + 16, 19);
    ctx.bezierCurveTo(sx + 16, 19, sx + 16, 8, sx + 8, 8);
    ctx.bezierCurveTo(sx + 3, 8, sx, 11, sx, sy);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }

  sx = 10;
  sy = 50;
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(sx, sy, 150, 10);
  ctx.fillStyle = "yellow";
  ctx.fillRect(sx, sy, player.weapon.bullets / player.weapon.maxBullets * 150, 10);
  for (let i = 0; i < player.weapon.maxBullets; i++) {
    step = 150 / player.weapon.maxBullets;
    ctx.strokeStyle = "red";
    ctx.strokeRect(sx + i * step , sy, step, 10);
  }
  ctx.closePath();

  for (let i = 0; i < player.weapon.magazines.length; i++) {
    sy = i * 15 + 70;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(sx, sy, 100, 7);
    ctx.fillStyle = "yellow";
    ctx.fillRect(sx, sy, player.weapon.magazines[i] / player.weapon.maxBullets * 100, 7);
    for (let i = 0; i < player.weapon.maxBullets; i++) {
      step = 100 / player.weapon.maxBullets;
      ctx.strokeStyle = "black";
      ctx.strokeRect(sx + i * step , sy, step, 7);
    }
    ctx.closePath();
  }

  if (player.weapon.id !== 2) {
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("АВ", 14, 111);
    ctx.fillText("ОД", 14, 126);

    ctx.fillStyle = "black";


    if (player.weapon.singleShoot) {
      ctx.beginPath();
      ctx.arc(100, 106, 7, 3 * Math.PI / 2 - 0.4, Math.PI / 2 - 0.4);
      ctx.lineTo(42, 124);
      ctx.lineTo(40, 117);
      ctx.lineTo(100 - 2, 106 - 7);
      ctx.fill();
      ctx.arc(100, 106, 5, 3 * Math.PI / 2 - 0.4, Math.PI / 2 - 0.4);
      ctx.lineTo(43.5, 122);
      ctx.lineTo(42.5, 118.5);
      ctx.lineTo(100, 106 - 5);
      ctx.strokeStyle = "white";
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
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.closePath();
    }
  }

  for (let i = 1; i < player.grenades.length + 1; i++) {
    sx = 100 + 25 * i;
    sy = 83;
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

  let mapXY = canvas.height - 10 - images["map"].naturalHeight / 10;
  let koef = null;
  if (player.realXCenter < images["map"].naturalHeight / 2) {
    ctx.drawImage(images["map"], 0, 0, images["map"].naturalHeight, images["map"].naturalHeight,
                  mapXY, mapXY, images["map"].naturalHeight / 10, images["map"].naturalHeight / 10);
    koef = 0;
  } else if (player.realXCenter > images["map"].naturalWidth - images["map"].naturalHeight / 2) {
    ctx.drawImage(images["map"], images["map"].naturalWidth - images["map"].naturalHeight, 0, images["map"].naturalHeight, images["map"].naturalHeight,
                  mapXY, mapXY, images["map"].naturalHeight / 10, images["map"].naturalHeight / 10);
    koef = images["map"].naturalWidth - images["map"].naturalHeight;
  } else {
    ctx.drawImage(images["map"], player.realXCenter - images["map"].naturalHeight / 2, 0, images["map"].naturalHeight, images["map"].naturalHeight,
                  mapXY, mapXY, images["map"].naturalHeight / 10, images["map"].naturalHeight / 10);
    koef = player.realXCenter - images["map"].naturalHeight / 2;
  }
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeRect(mapXY, mapXY, images["map"].naturalHeight / 10, images["map"].naturalHeight / 10);
  ctx.strokeStyle = "white";
  ctx.strokeRect(mapXY + (camera.x - koef) / 10, mapXY + camera.y / 10, visiblePart / 10, visiblePart / 10);
  ctx.closePath();

  sight.draw();

  if (!throwGrenade && throwTime && player.grenades.length) {
    Grenade.drawProgress(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset, throwTime);
  }

  if (player.weapon.isReloading()) {
    player.weapon.drawReload(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset);
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
    if (v || performance.now() - target.lastTimeSeen < 200) {
      target.draw();
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

  drawUI();
}

const loop = () => {
  requestId = RAF(loop);
  now = performance.now();
  dt += Math.min(1, (now - lastTime) / 1000);

  while (dt > gameStep) {
    dt -= gameStep;
    update();
  }

  draw();
  lastTime = now;
}

let lastTime;
let now = 0;
let dt = 0;
let fps = 60;
let gameStep = 1 / fps;
let requestId;
