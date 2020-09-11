'use strict'

let explosionRadius = 120;
let grenadeCollision = () => {
  let step = 5;
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

        for (let j = 0; j < doors.length; j++) {
          let d = doors[j];
          if ((pointInRect(x1, y1, d.getX(), d.getY(), d.getH(), d.getW()) &&
               pointInRect(x1, y1 + Grenade.height, d.getX(), d.getY(), d.getH(), d.getW())) ||
              (pointInRect(x1 + Grenade.width, y1, d.getX(), d.getY(), d.getH(), d.getW()) &&
               pointInRect(x1 + Grenade.width, y1 + Grenade.height, d.getX(), d.getY(), d.getH(), d.getW()))) {
            grenade.speed *= Grenade.bounceKoef;
            grenade.dx = -grenade.dx;
            break;
          }
          if ((pointInRect(x1, y1, d.getX(), d.getY(), d.getH(), d.getW()) &&
               pointInRect(x1 + Grenade.width, y1, d.getX(), d.getY(), d.getH(), d.getW())) ||
              (pointInBlock(x1, y1 + Grenade.height, d.getX(), d.getY(), d.getH(), d.getW()) &&
               pointInBlock(x1 + Grenade.width, y1 + Grenade.height, d.getX(), d.getY(), d.getH(), d.getW()))) {
            grenade.speed *= Grenade.bounceKoef;
            grenade.dy = -grenade.dy;
            break;
          }
        }

        for (let j = 0; j < glass.length; j++) {
          let g = glass[j];
          if (!g.broken &&
              collisionCircleRect(x1 + Grenade.width / 2, y1 + Grenade.height / 2, Grenade.width / 2,
                                  g.getX(), g.getY(), g.getH(), g.getW())) {
            g.broken = true;
          }
        }
      }
    }
  }
}

let grenadeCheckRect = (x, y, h, w, g) => {
  let step = 20;
  let pointsX = [];
  let pointsY = [];
  pointsX.push(x);
  pointsX.push(x);
  pointsX.push(x + w);
  pointsX.push(x + w);

  pointsY.push(y);
  pointsY.push(y + h);
  pointsY.push(y);
  pointsY.push(y + h);

  pointsX.push(x + (w/ 2));
  pointsX.push(x);
  pointsX.push(x + w);
  pointsX.push(x + (w / 2));

  pointsY.push(y);
  pointsY.push(y + (h / 2));
  pointsY.push(y + (h / 2));
  pointsY.push(y + h);
  let hit = 0;

  if (collisionCircleRect(g.x, g.y, 120,
                          x, y, h, w)) {
    let f = false;
    for (let i = 0; i < pointsX.length; i++) {
      let x1 = pointsX[i];
      let y1 = pointsY[i];
      let fPoint = (dist(g.x, x1, g.y, y1) <= explosionRadius);
      let dx = x1 - g.x;
      let dy = y1 - g.y;
      console.log(x1, y1);

      if (fPoint) {
        for (let j = 0; j < step; j++) {
          let x2 = x1 + (dx * j) / step;
          let y2 = y1 + (dy * j) / step;

          for (let d of doors) {
            if (pointInRect(x2, y2, d.x, d.y, d.h, d.w)) {
              fPoint = false;
            }
            if (!fPoint) break;
          }

          let xBlock = (x2 - (x2 % worldTileSize)) / worldTileSize;
          let yBlock = (y2 - (y2 % worldTileSize)) / worldTileSize;
          if (tileMap[yBlock][xBlock] === "black" ||
              tileMap[yBlock][xBlock] === "cover") {
                fPoint = false;
                console.log(tileMap[yBlock][xBlock]);
          }
          if (!fPoint) break;
        }
      }
      f = f || fPoint;
      if (fPoint) {
        if ((dist(g.x, x1, g.y, y1) <= explosionRadius) && (dist(g.x, x1, g.y, y1) > explosionRadius / 2) && (hit != 2)) {
          hit = 1;
        }
        else
        if (dist(g.x, x1, g.y, y1) <= explosionRadius /2) {
          hit = 2;
          break;
        }
      }
    }
  }
  return hit;
}

let grenadeHit = (g) => {
  //player.subHp(grenadeCheckRect(player.realX, player.realY, player.realH, player.realW, g));
  for (let gl of glass) {
    if (grenadeCheckRect(gl.x, gl.y, gl.h, gl.w, g) > 0) {
      gl.breakGlass();
    }
  }
}
