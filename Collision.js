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
      if (bul.bulletRadius + player.radius >= dist(bul.x + (bul.dx * i) / 5, player.X_Center, bul.y + (bul.dy * i) / 5, player.Y_Center)) {
          f = true;
      }
    }

    if (bul.justShooted == false) {
      for (let i = 0; i < targets.length; i++) {
        for (let j = 0; j < 5; j++) {
          let x1 = bul.x + (bul.dx * j) / 5;
          let y1 = bul.y + (bul.dy * j) / 5;
          if (bul.bulletRadius + targets[i].r >= dist(x1, targets[i].x, y1, targets[i].y) &&
              targets[i].shooted == true) {
            f = true;
            targets[i].shooted = false;
          }
          if (f) {
            break;
          }
        }
        if (f) {
          break;
        }
      }
    }

    if (!f) {
      let x1 = bul.x;
      let y1 = bul.y;
      console.log(`${x1} ${y1}`);
      let xBlock = (x1 - (x1 % worldTileSize)) / worldTileSize;
      let yBlock = (y1 - (y1 % worldTileSize)) / worldTileSize;
      if ((tileMap[yBlock][xBlock] == "black") || (tileMap[yBlock][xBlock] == "cover")) {
        f = true;
      }
    }

    if (bul.x <= 0 || bul.x >= images["map"].naturalWidth ||
      bul.y <= 0 || bul.y >= images["map"].naturalHeight) {
      f = true;
    }

    if (f) {
      bullets.delete(bul);
    }
  }
}
