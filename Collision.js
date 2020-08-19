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
          if ((tileMap[yBlock][xBlock] == "black") || (tileMap[yBlock][xBlock] == "cover")) {
            f = true;
          }
          if (f) {
            break;
          }
        }
        if (!f) {
          if (bul.justShooted == false) {
            if (collisionCircleRect(x1, y1, bul.bulletRadius, player.x, player.y, player.h_World, player.w_World )){
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
}

let collisionPlayer = (x, y, w, h) => {
  let xBlock = Math.floor(x / worldTileSize);
  let yBlock = Math.floor(y / worldTileSize);;
  let xBlock1 = Math.ceil((x + w) / worldTileSize);
  let yBlock1 = Math.ceil((y + h) / worldTileSize);
  let f = true;

  for (let i = xBlock; i != xBlock1; i++) {
    for (let j = yBlock; j != yBlock1; j++) {
      if ((i < 0) || (i >= tileMap[0].length) ||
          (j < 0) || (j >= tileMap.length) ||
          (tileMap[j][i] == "black") ||
          (tileMap[j][i] == "cover")) {
            f = false;
          }
      if (!f) break;
    }
    if (!f) break;
  }
  return f;
}
