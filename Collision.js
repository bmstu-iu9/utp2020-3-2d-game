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
      let x1 = canvasToWorld(bul.x, 0);
      let y1 = canvasToWorld(bul.y, 1);
      let xBlock = (x1 - (x1 % worldTileSize)) / worldTileSize;
      let yBlock = (y1 - (y1 % worldTileSize)) / worldTileSize;
      if ((tileMap[xBlock][yBlock] == "cobblestone") || (tileMap[xBlock][yBlock] == "dark cobblestone")) {
        f = true;
      }
    }

    if (canvasToWorld(bul.x, 0) <= 0 || canvasToWorld(bul.x, 0) >= mapImg.naturalWidth ||
      canvasToWorld(bul.y, 1) <= 0 || canvasToWorld(bul.y, 1) >= mapImg.naturalHeight) {
      f = true;
    }

    if (f) {
      bullets.delete(bul);
    }
  }
}
