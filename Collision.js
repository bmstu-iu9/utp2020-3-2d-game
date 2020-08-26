'use strict'

const dist = (x1, x2, y1, y2) => {
  let k1 = x1 - x2;
  let k2 = y1 - y2;
  return Math.sqrt(k1 * k1 + k2 * k2);
}

const collision = () => {
  const step = 5;

  for (let bul of bullets) {
    let f = false;

      for (let i = 0; i < step; i++) {
        let x1 = bul.x + (bul.dx * i) / step;
        let y1 = bul.y + (bul.dy * i) / step;
        if (x1 <= 0 || x1 >= images["map"].naturalWidth ||
            y1 <= 0 || y1 >= images["map"].naturalHeight) {
          f = true;
        }
        if (!f) {
          let xBlock = (x1 - (x1 % worldTileSize)) / worldTileSize;
          let yBlock = (y1 - (y1 % worldTileSize)) / worldTileSize;
          if ((tileMap[yBlock][xBlock] === "black") ||
              (tileMap[yBlock][xBlock] === "cover")) {
            f = true;
          }
          if (f) {
            break;
          }
        }
        if (!f) {
          if (bul.justShooted == false) {
            if (collisionCircleRect(x1, y1, bul.bulletRadius, player.realX, player.realY, player.realH, player.realW)){
              f = true;
            }
          }
        }
        if (!f) {
          if (bul.justShooted == false) {
            for (let j = 0; j < targets.length; j++) {
              if (bul.bulletRadius + targets[j].r >= dist(x1, targets[j].x, y1, targets[j].y) &&
                  targets[j].alive == true) {
                f = true;
                targets[j].alive = false;
              }
              if (f) {
                break;
              }
            }
          }
        }
        if (f) {
          if (i != 0) {
            bul.x = x1;
            bul.y = y1;
          }
          break;
        }
      }

    if (f) {
      bullets.delete(bul);
    }
  }

  for (let grenade of grenades) {
    for (let i = 0; i < step; i++) {
      let x1 = grenade.x + (grenade.dx * i) / step;
      let y1 = grenade.y + (grenade.dy * i) / step;
      if (x1 <= 0 ||
          y1 <= 0 ||
          x1 + Grenade.width >= images["map"].naturalWidth ||
          y1 + Grenade.height >= images["map"].naturalHeight) {
        grenades.delete(grenade);
      } else {
        if ((pointInBlock(x1, y1) && pointInBlock(x1, y1 + Grenade.height)) || (pointInBlock(x1 + Grenade.width, y1) && pointInBlock(x1 + Grenade.width, y1 + Grenade.height))) {
          grenade.speed *= Grenade.bounceKoef;
          grenade.dx = -grenade.dx;
          break;
        }
        if ((pointInBlock(x1, y1) && pointInBlock(x1 + Grenade.width, y1)) || (pointInBlock(x1, y1 + Grenade.height) && pointInBlock(x1 + Grenade.width, y1 + Grenade.height))) {
          grenade.speed *= Grenade.bounceKoef;
          grenade.dy = -grenade.dy;
          break;
        }
      }
    }
  }
}

let lastRed = false;
let collisionPlayer = (x, y, w, h) => {
  let xBlock = Math.floor(x / worldTileSize);
  let yBlock = Math.floor(y / worldTileSize);;
  let xBlock1 = Math.ceil((x + w) / worldTileSize);
  let yBlock1 = Math.ceil((y + h) / worldTileSize);
  let f = true;
  let nowRed = false;
  //console.log(lastRed);

  for (let i = xBlock; i != xBlock1; i++) {
    for (let j = yBlock; j != yBlock1; j++) {
      if ((i < 0) || (i >= tileMap[0].length) ||
          (j < 0) || (j >= tileMap.length) ||
          (tileMap[j][i] === "black") ||
          (tileMap[j][i] === "cover") ||
          tileMap[j][i] === "orange" ||
          tileMap[j][i] === "red") {

            if (tileMap[j][i] === "red") {
              nowRed = true;
            }
            f = false;
        }
    }
  }

  if ((!lastRed) && nowRed) {
    player.hp -= 0.5;
    if (player.hp < 0) {
      player.hp = 0;
    }
  }

  lastRed = nowRed;
  return f;
}
