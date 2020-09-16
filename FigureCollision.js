'use strict'


const pointInRect = (x, y, xR, yR, h, w) => {
  return (x >= xR) && (x <= xR + w) && (y >= yR) && (y <= yR + h);
}


const collisionCircle = (x1, y1, r1, x2, y2, r2) => {
  return r1 + r2 >= dist(x1, x2, y1, y2);
}


const collisionRect = (x1, y1, h1, w1, x2, y2, h2, w2) => {
  let f = false;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (pointInRect (x1 + w1 * i, y1 + h1 * j, x2, y2, h2, w2)) {
        f = true;
      }
      if (f) break;
    }
    if (f) break;
  }

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (pointInRect (x2 + w2 * i, y2 + h2 * j, x1, y1, h1, w1)) {
        f = true;
      }
      if (f) break;
    }
    if (f) break;
  }

  if (!f && (x1 >= x2) && (x1 + w1 <= x2 + w2) && (y1 <= y2) && (y1 + h1 >= y2 + h2)) {
    f = true;
  }
  if (!f && (x2 >= x1) && (x2 + w2 <= x1 + w1) && (y2 <= y1) && (y2 + h2 >= y1 + h1)) {
    f = true;
  }

  return f;
}


const collisionCircleRect = (xC, yC, r, xR, yR, h, w) => {
  let f = pointInRect (xC, yC, xR, yR, h, w);

  if ((!f) && (xC >= xR) && (xC <= xR + w) && (yC < yR) && (r >= yR - yC)) {
    f = true;
  }
  if ((!f) && (xC >= xR) && (xC <= xR + w) && (yC > yR + h) && (r >= yC - yR - h)) {
    f = true;
  }
  if ((!f) && (yC >= yR) && (yC <= yR + h) && (xC < xR) && (r >= xR - xC)) {
    f = true;
  }
  if ((!f) && (yC >= yR) && (yC <= yR + h) && (xC > xR + w) && (r >= xC - xR - w)) {
    f = true;
  }

  if (!f) {
    if ((r >= dist(xC, xR, yC, yR)) ||
        (r >= dist(xC, xR + w, yC, yR)) ||
        (r >= dist(xC, xR, yC, yR + h)) ||
        (r >= dist(xC, xR + w, yC, yR + h))) {
          f = true;
        }
  }

  return f;
}

const collisionLineRect = (sx, sy, tx, ty, LUx, LUy, RLx, RLy) => {
  return collisionSegment(sx, sy, tx, ty, LUx, LUy, LUx, RLy) ||
         collisionSegment(sx, sy, tx, ty, LUx, LUy, RLx, LUy) ||
         collisionSegment(sx, sy, tx, ty, RLx, LUy, RLx, RLy) ||
         collisionSegment(sx, sy, tx, ty, LUx, RLy, RLx, RLy);
}

const collisionSegment = (seg11x, seg11y, seg12x, seg12y, seg21x, seg21y, seg22x, seg22y) => {
  return crossProduct(seg12x - seg11x, seg12y - seg11y, seg21x - seg11x, seg21y - seg11y) *
         crossProduct(seg12x - seg11x, seg12y - seg11y, seg22x - seg11x, seg22y - seg11y) < 0 &&
         crossProduct(seg22x - seg21x, seg22y - seg21y, seg11x - seg21x, seg11y - seg21y) *
         crossProduct(seg22x - seg21x, seg22y - seg21y, seg12x - seg21x, seg12y - seg21y) < 0;
}

const crossProduct = (x1, y1, x2, y2) => {
  return x1 * y2 - x2 * y1;
}

const pointInBlock = (x, y) => {
  let xBlock = (x - (x % worldTileSize)) / worldTileSize;
  let yBlock = (y - (y % worldTileSize)) / worldTileSize;
  return (tileMap[yBlock][xBlock] === "black") || (tileMap[yBlock][xBlock] === "cover");
}
