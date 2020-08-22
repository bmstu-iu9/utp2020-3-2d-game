'use strict';

class Door {
  constructor(x, y, w, h, horizontal, img) {
    this.x = x; //левый центр двери
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = Math.sqrt(w*w + h*h) / 2;
    this.horizontal = horizontal;
    this.opened = false;
    this.img = img;
    this.time = 2; //sec
    this.delta = 0.1 //sec
    if (horizontal) {
     this.direction = "down";
     this.angle = 0;
     this.maxAngle = Math.PI / 2;
     this.minAngle = -Math.PI / 2;
     this.offsetX = 0;
     this.offsetY = -h/2;
    }
    else {
      this.direction = "left";
      this.angle = Math.PI / 2;
      this.maxAngle = Math.PI ;
      this.minAngle = 0;
      this.offsetX = -h/2;
      this.offsetY = 0;
    }
    this.dt = 0;
    this.count = 0;
    this.lastAngle = 0;
    this.offsetAngle = Math.atan(h / w);
  }

  draw() {
    let centerX = this.x + this.offsetX + this.r * Math.cos(this.angle - this.offsetAngle);
    let centerY = this.y + this.offsetY - this.r * Math.sin(this.angle - this.offsetAngle);

    if (this.offsetX > 0 || this.offsetY > 0) {
      centerX = this.x + this.offsetX + this.r * Math.cos(this.angle + this.offsetAngle);
      centerY = this.y + this.offsetY - this.r * Math.sin(this.angle + this.offsetAngle);
    }

    ctx.save();
    ctx.translate(worldToCanvas(centerX, 0), worldToCanvas(centerY, 1));
    ctx.rotate(-this.angle);
    ctx.drawImage(this.img,
                  0, 0, this.img.naturalWidth, this.img.naturalHeight,
                  -this.w / 2 / camera.scaleX, -this.h / 2 / camera.scaleY,
                  this.w / camera.scaleX, this.h / camera.scaleY);
    ctx.restore();
  }

  update() {
    if (this.dt && (performance.now() - this.lastTime) / 1000 > this.delta && this.count < this.time) {
      this.angle += this.dt;
      this.count += this.delta;
      if (this.count >= this.time) {
        if (this.lastAngle === this.maxAngle ||
            this.lastAngle === this.minAngle) {
          this.angle = (this.maxAngle + this.minAngle) / 2;
          this.offsetX *= -1;
          this.offsetY *= -1;
        } else {
          if (this.dt > 0) {
            this.angle = this.maxAngle
          } else {
            this.angle = this.minAngle;
          }
        }
        this.dt = 0;
      }
    }
  }

  getCenter() {

  }

  toggle() {
    if (this.angle === this.maxAngle) {
      this.dt = -(this.maxAngle - this.minAngle) / 2 * this.delta / this.time;
      this.lastAngle = this.maxAngle;
    } else if (this.angle === this.minAngle) {
      this.dt = (this.maxAngle - this.minAngle) / 2 * this.delta / this.time;
      this.lastAngle = this.minAngle;
    } else {
      if (this.offsetX < 0 || this.offsetY < 0) {
        this.dt = (this.maxAngle - this.angle) * this.delta / this.time;
      } else {
        this.dt = (this.minAngle - this.angle) * this.delta / this.time;
      }
      this.lastAngle = this.angle;
    }
    this.lastTime = performance.now();
    this.animStart = this.lastTime;
    this.count = 0;
  }
}
