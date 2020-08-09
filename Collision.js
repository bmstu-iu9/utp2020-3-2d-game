'use strict'

let dist = (x1, x2, y1, y2) => {
  let k1 = x1 - x2;
  let k2 = y1 - y2;
  return Math.sqrt(k1 * k1 + k2 * k2);
}


const collision = () => {

  for (let bul of bullets) {
    let f = false;

      for (let i = 0; i < 5; i++) {
        let x1 = bul.x + (bul.dx * i) / 5;
        let y1 = bul.y + (bul.dy * i) / 5;
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
            if (bul.bulletRadius + player.radius >= dist(bul.x + (bul.dx * i) / 5, player.x, bul.y + (bul.dy * i) / 5, player.y)) {
              f = true;
            }
          }
        }
        if (!f) {
          if (bul.justShooted == false) {
            for (let j = 0; j < targets.length; j++) {
              if (bul.bulletRadius + targets[j].r >= dist(x1, targets[j].x, y1, targets[j].y) &&
                  targets[j].shooted == true) {
                f = true;
                targets[j].shooted = false;
              }
              if (f) {
                break;
              }
            }
          }
        }
        if (f) {
          break;
        }
      }

    if (f) {
      bullets.delete(bul);
    }
  }
}
