'use strict'

class Camera {
  constructor(initX, initY, img, visibleWidth, visibleHeight, speed) {
    this.x = initX;
    this.y = initY;
    this.map = img;
    this.dx = speed;
    this.dy = speed;
    this.visibleWidth = visibleWidth;
    this.visibleHeight = visibleHeight;
    this.scaleX = visibleWidth / canvas.width;
    this.scaleY = visibleHeight / canvas.height;
  }

  drawVisibleMap() {
    ctx.drawImage(this.map, this.x, this.y,
                  this.visibleWidth, this.visibleHeight,
                  0, 0,
                  canvas.width, canvas.height);
  }

  updateCoordinates(){

    if (leftPressed && worldToCanvas(pl.x, 0) <= 150) {
      this.x -= this.dx;
    } else if (rightPressed && worldToCanvas(pl.x, 0) >= canvas.width - 150) {
      this.x += this.dx;
    }

    if (downPressed && worldToCanvas(pl.y, 1) >= canvas.height - 150){
      this.y += this.dy;
    } else if (upPressed && worldToCanvas(pl.y, 1) <= 150) {
      this.y -= this.dy;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.visibleWidth > this.map.naturalWidth) {
      this.x = this.map.naturalWidth - this.visibleWidth;
    }

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.visibleHeight > this.map.naturalHeight){
      this.y = this.map.naturalHeight - this.visibleHeight;
    }

  }

}
