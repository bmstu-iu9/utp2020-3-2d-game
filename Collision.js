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
                                    glass[g].getH(), glass[g].getW()) && bul.active) {

               glass[g].breakGlass();
            }
          }
        }

        if (!f) {
          let xBlock = (x1 - (x1 % worldTileSize)) / worldTileSize;
          let yBlock = (y1 - (y1 % worldTileSize)) / worldTileSize;
          if (tileMap[yBlock][xBlock] === "black") {
            f = true;
          }
          if (tileMap[yBlock][xBlock] === "cover") {
            bul.coverId = Cover.defineCover(xBlock, yBlock);
          }
        }

        if (!f) {
          if (bul.justShooted == false) {
            if (collisionCircleRect(x1, y1, bul.bulletRadius, player.realX, player.realY, player.realH, player.realW) &&
                !(player.coverId !== -1 && bul.coverId !== -1 && player.coverId === bul.coverId)) {
              console.log("hit");
              f = true;
              if (bul.active) {
                blood.push(new Blood(x1, y1, -bul.dx, -bul.dy, bul.damage, true));
                //player.subHp(bul.damage);
              }
            }
          }
        }

        if (!f) {
          if (bul.justShooted == false) {
            for (let j = 0; j < targets.length; j++) {
              if (bul.bulletRadius + targets[j].r >= dist(x1, targets[j].x, y1, targets[j].y) &&
                  targets[j].alive === true) {
                f = true;
                if (bul.active) {
                  targets[j].subHP(bul.damage);
                  blood.push(new Blood(x1, y1, -bul.dx, -bul.dy, bul.damage, true));
                }
              }
              if (f) {
                break;
              }
            }
          }
        }

        if (!f) {
          for (let j = 0; j < doors.length; j++) {
            if (collisionCircleRect(x1, y1, bul.bulletRadius,
                doors[j].getX(), doors[j].getY(), doors[j].getH(), doors[j].getW())) {
              f = true;
            }
          }
        }
        if (f) {
          if (i !== 0) {
            bul.x = x1 - bul.dx;
            bul.y = y1 - bul.dy;
            f = false;
            bul.active = false;
          }
          break;
        }
      }

    if (f) {
      bullets.delete(bul);
    }
  }
}
