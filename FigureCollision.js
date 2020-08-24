'use strict'


let pointInRect = (x, y, xR, yR, h, w) => {
  return (x >= xR) && (x <= xR + w) && (y >= yR) && (y <= xR + h);
}


let collisionCircle = (x1, y1, r1, x2, y2, r2) => {
  return r1 + r2 >= dist(x1, x2, y1, y2);
}


let collisionRect = (x1, y1, h1, w1, x2, y2, h2, w2) => {
  let f = false;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      f = pointInRect (x1 + w1 * i, y1 + h1 * j, x2, y2, h2, w2);
      if (f) break;
    }
    if (f) break;
  }

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      f = pointInRect (x2 + w2 * i, y2 + h2 * j, x1, y1, h1, w1);
      if (f) break;
    }
    if (f) break;
  }

  return f;
}


let collisionCircleRect = (xC, yC, r, xR, yR, h, w) => {
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
