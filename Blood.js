'use strict';

class Blood {
  constructor(x, y, dx, dy, damage, deadly) {
    this.x = x;
    this.y = y;
    let len = Math.sqrt(dx*dx + dy*dy);
    this.dx = dx / len;
    this.dy = dy / len;
    this.deadly = deadly;
    this.firstR = 2;
    this.lastR = 6;
    this.st = 0;
    this.speed = 3;
    this.animTime0 = 0.2;
    this.countTime0 = 0;
    this.deltaTime0 = 0.016;
    this.animTime1 = 2;
    this.countTime1 = 0;
    this.deltaTime1 = this.animTime1 / (this.lastR - this.firstR);
    this.animTime = this.animTime0 + this.animTime1 + 10;
    this.lastTime = performance.now();
    this.probability = 1 / (this.lastR - this.firstR);
  }

  //0 - полет
  //1 - круг
  //2

  update() {
    if (this.st === 0) {
      if (this.countTime0 < this.animTime0 &&
         (performance.now() - this.lastTime) / 1000 > this.deltaTime0) {
           this.x += this.dx * this.speed;
           this.y += this.dy * this.speed;
           this.speed *= 0.95;
           this.countTime0 += this.deltaTime0;
           this.lastTime = performance.now();
           if (this.countTime0 >= this.animTime0) {
             if (!this.deadly) {
               blood.splice(blood.indexOf(this), 1);
             } else {
               this.st = 1;
               this.generateCircle();
             }
           }
         }
    } else if (this.st === 1 && this.deadly) {
      if (this.countTime1 < this.animTime1 &&
         (performance.now() - this.lastTime) / 1000 > this.deltaTime1) {
           //this.firstR++;
           this.probability += 1 / (this.lastR - this.firstR);
           this.lastTime = performance.now();
           this.countTime1 += this.deltaTime1;
           if (this.countTime1 >= this.animTime1) {
             this.st = 2;
             this.countTime1 = 0;
             this.deltaTime1 = 0.1;
           }
         }
    } else if (this.st === 2) {
      if (this.countTime1 < this.animTime - this.animTime0 - this.animTime1 &&
         (performance.now() - this.lastTime) / 1000 > this.deltaTime1) {
           this.lastTime = performance.now();
           this.countTime1 += this.deltaTime1;
           if (this.countTime1 >= this.animTime - this.animTime0 - this.animTime1) {
             blood.splice(blood.indexOf(this), 1);
           }
         }
    }
  }

  draw() {

    if (this.st === 0) {
      let dx = 0;
      let dy = 0;
      let norm1Dx = this.dy / this.speed; //орты нормалей
      let norm1Dy = -this.dx / this.speed;
      let norm2Dx = -this.dy / this.speed;
      let norm2Dy = this.dx / this.speed;
      let unitDx = this.dx / this.speed;  //орт главного направления
      let unitDy = this.dy / this.speed;

      let maxLen = 0.2;
      let mainStep = 1/2;
      let normStep = 1;
      let gap = 5.2;
      let mainLen = this.speed * gap; //поменять gap, чтобы увеличить расстояние
      let iterateLen = 0;

      while (iterateLen < mainLen){

        if (iterateLen > mainLen * 0.3) maxLen = 5.4;
        if (iterateLen > mainLen * 0.5) maxLen = 5.6;
        if (iterateLen > mainLen * 0.7) maxLen = 5.9;

        let normLen1 = Math.max(0, maxLen - Math.random());
        let normLen2 = Math.max(0, maxLen - Math.random());

        for (let pxX = 0, pxY = 0, iterateNorm1Len = 0; iterateNorm1Len < normLen1;
             pxX += norm1Dx * normStep, pxY += norm1Dy * normStep, iterateNorm1Len += normStep) {
            ctx.beginPath();
            ctx.rect(worldToCanvas(this.x + pxX + dx, 0), worldToCanvas(this.y + pxY + dy, 1), 1, 1);
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 0.5;
            //ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }

        for (let pxX = 0, pxY = 0, iterateNorm2Len = 0; iterateNorm2Len < normLen2;
             pxX += norm2Dx * normStep, pxY += norm2Dy * normStep, iterateNorm2Len += normStep) {
            ctx.beginPath();
            ctx.rect(worldToCanvas(this.x + pxX + dx, 0), worldToCanvas(this.y + pxY + dy, 1), 1, 1);
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 0.5;
            //ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
        dx += unitDx * mainStep;
        dy += unitDy * mainStep;
        iterateLen += mainStep;
      }
    } else {
      this.circle.forEach(c => {
        c.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = p.c;
          ctx.strokeStyle = "rgb(121, 0, 0)";
          ctx.stroke();
          ctx.fillRect(worldToCanvas(p.x, 0), worldToCanvas(p.y, 1), 1, 1);
          ctx.closePath();
        });

      });

    }
  }

  generateCircle() {
    this.circle = [];
    let step = 0.8;
    let i = 0;
    for (let pxY = this.y - this.lastR; pxY < this.y + this.lastR; pxY += step, i++) {
      this.circle.push([]);
      for (let pxX = this.x - this.lastR; pxX < this.x + this.lastR; pxX += step){
        let dist = Math.sqrt(Math.pow(pxX - this.x, 2) + Math.pow(pxY - this.y, 2)) +
                   Math.random() * (this.lastR - this.firstR);

        if (dist < this.lastR){
          if (Math.random() < 0.8) {
            this.circle[i].push({"c" : "red", "x" : pxX, "y" : pxY});
          } else {
            this.circle[i].push({"c" : "rgb(121, 0, 0)", "x" : pxX, "y" : pxY});
          }
        }
      }
    }
  }
}
