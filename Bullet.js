'use strict';

class Bullet {
  constructor(x, y, sightX, sightY, speed) {
    this.x = x;
    this.y = y;
    this.flies = false;
    this.shooted = false;
    this.justShooted = true;
    this.bulletRadius = 5;           //нормирование и умножение на скорость \/
    this.dx = speed * (sightX - x) / Math.sqrt(Math.pow(sightX - x, 2) + Math.pow(sightY - y, 2));
    this.dy = speed * (sightY - y) / Math.sqrt(Math.pow(sightX - x, 2) + Math.pow(sightY - y, 2));
    this.speed = speed;
  }

  draw() {
    if (this.justShooted){
      this.drawRandomFire();
      this.justShooted = false;
    } else this.drawRandomTail();
  }

  drawRandomFire() {    //тут должна быть реализация выстрела
    let step = 0.5;     //как-то нужно отрисовать огонь
    let realLen = 4;    //открыт к вашим предложениям
    let angle = Math.PI / 12;
    let v1Len = this.speed / Math.cos(angle);
    let v2Len = v1Len;
    let normLen1 = Math.sin(angle) * v1Len;
    let normLen2 = normLen1;
    let norm1Dx = this.dy / this.speed * normLen1;
    let norm1Dy = -this.dx / this.speed * normLen1;
    let norm2Dx = -this.dy / this.speed * normLen2;
    let norm2Dy = this.dx / this.speed * normLen2;
    let dx1 = (this.dx + norm1Dx) / v1Len;
    let dy1 = (this.dy + norm1Dy) / v1Len;
    let dx2 = (this.dx + norm2Dx) / v2Len;
    let dy2 = (this.dy + norm2Dy) / v2Len;

    for (let pxX = 0, pxY = 0; Math.abs(pxX) < Math.abs(dx1 * realLen) &&
         Math.abs(pxY) < Math.abs(dy1 * realLen); pxX += dx1 * step, pxY += dy1 * step) {
        ctx.beginPath();
        ctx.rect(worldToCanvas(this.x + pxX, 0), worldToCanvas(this.y + pxY, 1), 1, 1);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
  }

  drawRandomTail() {
    let dx = 0;
    let dy = 0;
    let norm1Dx = this.dy / this.speed; //орты нормалей
    let norm1Dy = -this.dx / this.speed;
    let norm2Dx = -this.dy / this.speed;
    let norm2Dy = this.dx / this.speed;
    let unitDx = this.dx / this.speed;  //орт главного направления
    let unitDy = this.dy / this.speed;

    let maxLen = 0.4;
    let mainStep = 1/4;
    let normStep = 0.3;
    let gap = 0.8;

    while (Math.abs(dx) < Math.abs(this.dx * gap) &&  //поменять gap, чтобы увеличить расстояние
           Math.abs(dy) < Math.abs(this.dy * gap)) {
      if (Math.abs(dx) > Math.abs(this.dx * gap * 0.3)) maxLen = 0.8;
      if (Math.abs(dx) > Math.abs(this.dx * gap * 0.5)) maxLen = 1;
      if (Math.abs(dx) > Math.abs(this.dx * gap * 0.7)) maxLen = 1.3;

      let normLen1 = Math.max(0, maxLen - Math.random());
      let normLen2 = Math.max(0, maxLen - Math.random());

      for (let pxX = 0, pxY = 0; Math.abs(pxX) < Math.abs(norm1Dx * normLen1) && Math.abs(pxY) < Math.abs(norm1Dy * normLen1);
           pxX += norm1Dx * normStep, pxY += norm1Dy * normStep) {
          ctx.beginPath();
          ctx.rect(worldToCanvas(this.x + pxX + dx, 0), worldToCanvas(this.y + pxY + dy, 1), 1, 1);
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 0.5;
          //ctx.stroke();
          ctx.fill();
          ctx.closePath();
      }

      for (let pxX = 0, pxY = 0; Math.abs(pxX) < Math.abs(norm2Dx * normLen2) && Math.abs(pxY) < Math.abs(norm2Dy * normLen2);
           pxX += norm2Dx * normStep, pxY += norm2Dy * normStep) {
          ctx.beginPath();
          ctx.rect(worldToCanvas(this.x + pxX + dx, 0), worldToCanvas(this.y + pxY + dy, 1), 1, 1);
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 0.5;
          //ctx.stroke();
          ctx.fill();
          ctx.closePath();
      }
      dx += unitDx * mainStep;
      dy += unitDy * mainStep;
    }
  }

  updateCoordinates() {
    this.x += this.dx;
    this.y += this.dy;
  }

  collide(tX, tY, tR) {
    const dist = Math.sqrt(Math.pow(this.x - tX, 2) + Math.pow(this.y - tY, 2));
    return dist < tR;
  }
}
