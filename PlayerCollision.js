'use strict'

let lastRed = false;
let lastWater = false;

let collisionPlayer = (x, y, w, h) => {
  let xBlock = Math.floor(x / worldTileSize);
  let yBlock = Math.floor(y / worldTileSize);;
  let xBlock1 = Math.ceil((x + w) / worldTileSize);
  let yBlock1 = Math.ceil((y + h) / worldTileSize);
  let f = true;
  let nowRed = false;
  let nowWater = false;
  //console.log(lastRed);

  for (let i = xBlock; i != xBlock1; i++) {
    for (let j = yBlock; j != yBlock1; j++) {
      if ((i < 0) || (i >= tileMap[0].length) ||
          (j < 0) || (j >= tileMap.length) ||
          (tileMap[j][i] === "black") ||
          (tileMap[j][i] === "cover") ||
          tileMap[j][i] === "orange" ||
          tileMap[j][i] === "red") {

            if ((i >= 0) && (i < tileMap[0].length) &&
                (j >= 0) && (j < tileMap.length) && (tileMap[j][i] === "red")) {
              nowRed = true;
            }
            f = false;
        }
        else {
          if (tileMap[j][i] === "water") {
            nowWater = true;
            player.sound = "water";
          }
        }
    }
  }

  for (let i = 0; i < doors.length; i++) {
    let d = doors[i];
    if (collisionRect(x, y, h, w, d.getX(), d.getY(), d.getH(), d.getW())) {
      f = false;
    }
  }

  for (let i = 0; i < glass.length; i++) {
    let g = glass[i];
    if (!g.broken && collisionRect(x, y, h, w, g.getX(), g.getY(), g.getH(), g.getW())) {
      f = false;
    }
  }

  if ((f) && nowWater && (!lastWater)) {
    player.speed = playerSpeed/2;
    camera.dx = cameraSpeed/2;
    camera.dy = cameraSpeed/2;
  }
  else if ((f) && lastWater && !nowWater) {
    player.speed = playerSpeed;
    camera.dx = cameraSpeed;
    camera.dy = cameraSpeed;
    player.sound = "nothing";
  }

  if ((!lastRed) && nowRed) {
    player.subHp(barbedWireDmg);
  }

  lastRed = nowRed;
  lastWater = nowWater;
  return f;
}
