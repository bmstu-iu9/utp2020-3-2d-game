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
          for (let g = 0; g < glass.length; g++) {
            if (!glass[g].broken && collisionCircleRect(x1, y1, bul.bulletRadius,
                                    glass[g].getX(), glass[g].getY(),
                                    glass[g].getH(), glass[g].getW())) {
               glass[g].breakGlass();
            }
          }
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
