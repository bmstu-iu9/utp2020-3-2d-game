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
    ctx.rect(this.x-0.5, this.y-0.5, 1, 1);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x+2, this.y-1, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x-2-this.width, this.y-1, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x-1, this.y+2, this.height, this.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(this.x-1, this.y-2-this.width, this.height, this.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  updateCoordinates() {
    if (mouseMove !== null) {
      if (
        mouseMove.clientX >= (window.innerWidth - canvas.width) / 2 &&
        mouseMove.clientX <= (window.innerWidth - canvas.width) / 2 + canvas.width &&
        mouseMove.clientY >= (window.innerHeight - canvas.height) / 2 &&
        mouseMove.clientY <= (window.innerHeight - canvas.height) / 2 + canvas.height
      ) {
        this.x = mouseMove.clientX - (window.innerWidth - canvas.width) / 2;
        this.y = mouseMove.clientY - (window.innerHeight - canvas.height) / 2;
      }
      mouseMove = null;
    }

  }
}
