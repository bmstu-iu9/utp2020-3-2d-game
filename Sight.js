'use strict'

class Sight {
  constructor(initX, initY, width, height) {
    this.x = initX;           //canvas coordinates;
    this.y = initY;
    this.width = width;
    this.height = height;
    this.dotSize = 1;
    this.offset = 2;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x - this.dotSize / 2, this.y - this.dotSize / 2, this.dotSize, this.dotSize);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x + this.offset + this.dotSize / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x - this.offset - this.dotSize / 2 - this.width, this.y - this.height / 2, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x - this.height / 2, this.y + this.offset + this.dotSize / 2, this.height, this.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x - this.height / 2, this.y - this.offset - this.dotSize / 2 - this.width, this.height, this.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

}
