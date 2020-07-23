'use strict'

class Sight {
  constructor(initX, initY, width, height) {
    this.x = initX;           //canvas coordinates;
    this.y = initY;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x - 0.5, this.y - 0.5, 1, 1);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x + 2, this.y - 1, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x - 2 - this.width, this.y - 1, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x - 1, this.y + 2, this.height, this.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x - 1, this.y - 2 - this.width, this.height, this.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

}
