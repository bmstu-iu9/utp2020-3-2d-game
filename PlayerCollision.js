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
          }
        }
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
  }

  if ((!lastRed) && nowRed) {
    player.hp -= 0.5;
    if (player.hp < 0) {
      player.hp = 0;
    }
  }

  lastRed = nowRed;
  lastWater = nowWater;
  return f;
}
