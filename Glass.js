'use strict';

class Glass {
  constructor(x, y, w, h, angle, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = angle;
    this.img = img;
    this.broken = false;
    this.frame = 0;
    this.frames = 9;
    this.srcW = 50;
    this.srcH = 50;
    this.srcOffsetX = 20;
    this.srcOffsetY = 9;
    this.lastTime = 0;
    this.animTime = 0.2;
    this.deltaTime = this.animTime / 8;
    this.scaleX = 1/5; //door/tile
    this.scaleY = 32/this.srcH;
  }

  update() {
    if (this.broken && this.frame < this.frames - 1 &&
        (performance.now() - this.lastTime) / 1000 > this.deltaTime) {
      this.lastTime = performance.now();
      this.frame++;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(worldToCanvas(this.x + this.getW() / 2, 0),
                  worldToCanvas(this.y + this.getH() / 2, 1));
    ctx.rotate(-(this.angle - Math.PI / 2));
    ctx.drawImage(this.img,
                  this.srcOffsetX + this.frame * this.srcW, 0, this.srcW, this.srcH,
                  -this.h / this.scaleX / 2 / camera.scaleX, -this.w / this.scaleY / 2 / camera.scaleY,
                  this.h / this.scaleX / camera.scaleX,
                  this.w / this.scaleY / camera.scaleY);

    ctx.restore();

  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getW() {
    if (Math.abs(this.angle) === Math.PI / 2) {
      return this.h;
    } else {
      return this.w;
    }
  }

  getH() {
    if (Math.abs(this.angle) === Math.PI / 2) {
      return this.w;
    } else {
      return this.h;
    }
  }

  breakGlass() {
    this.broken = true;
    this.frame = 1;
    this.lastTime = performance.now();
    //звук
  }
}
