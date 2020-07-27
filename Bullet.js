'use strict';

class Bullet {
  constructor(x, y, sightX, sightY, speed) {
    this.x = x;
    this.y = y;
    this.flies = false;
    this.shooted = false;
    this.justShooted = true;
    this.bulletAnimationRadius = 1.2;
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

  drawRandomFire() {
    let bulletStep = 0.3;
    
    for (let pxY = this.y - this.bulletAnimationRadius; pxY < this.y + this.bulletAnimationRadius; pxY += bulletStep) {
      for (let pxX = this.x - this.bulletAnimationRadius; pxX < this.x + this.bulletAnimationRadius; pxX += bulletStep){
        let dist = Math.sqrt(Math.pow(pxX - this.x, 2) + Math.pow(pxY - this.y, 2));
        if (Math.random() < 0.8){
          if (dist < this.bulletAnimationRadius / 2) {
            ctx.beginPath();
            ctx.fillStyle = "yellow";
            ctx.fillRect(worldToCanvas(pxX, 0), worldToCanvas(pxY, 1), 1, 1);
            ctx.closePath();
          } else if (dist < this.bulletAnimationRadius) {
            ctx.beginPath();
            ctx.fillStyle = "rgb(255,127,80)";
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.fillRect(worldToCanvas(pxX, 0), worldToCanvas(pxY, 1), 1, 1);
            ctx.closePath();
          }
        }
      }
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

    let maxLen = 0.2;
    let mainStep = 1/4;
    let normStep = 0.3;
    let gap = 0.8;

    while (Math.abs(dx) < Math.abs(this.dx * gap) &&  //поменять gap, чтобы увеличить расстояние
           Math.abs(dy) < Math.abs(this.dy * gap)) {
      if (Math.abs(dx) > Math.abs(this.dx * gap * 0.3)) maxLen = 0.4;
      if (Math.abs(dx) > Math.abs(this.dx * gap * 0.5)) maxLen = 0.6;
      if (Math.abs(dx) > Math.abs(this.dx * gap * 0.7)) maxLen = 0.9;

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
