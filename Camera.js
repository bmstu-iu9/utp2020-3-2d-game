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
    this.isFixedX = false;
    this.isFixedY = false;
  }

  drawVisibleMap() {
    ctx.drawImage(this.map, this.x, this.y,
                  this.visibleWidth, this.visibleHeight,
                  0, 0,
                  canvas.width, canvas.height);
  }

  updateCoordinates(){

    if (this.isFixedX && pl.x == canvas.width / 2)
      this.isFixedX = false;
    if (this.isFixedY && pl.y == canvas.height / 2)
      this.isFixedY = false;

    if (leftPressed && !this.isFixedX) {
      this.x -= this.dx;
    } else if (rightPressed && !this.isFixedX) {
      this.x += this.dx;
    }

    if (downPressed && !this.isFixedY){
      this.y += this.dy;
    } else if (upPressed && !this.isFixedY) {
      this.y -= this.dy;
    }

    if (this.x < 0) {
      this.x = 0;
      this.isFixedX = true;
    } else if (this.x + this.visibleWidth > this.map.naturalWidth) {
      this.x = this.map.naturalWidth - this.visibleWidth;
      this.isFixedX = true;
    }

    if (this.y < 0) {
      this.y = 0;
      this.isFixedY = true;
    } else if (this.y + this.visibleHeight > this.map.naturalHeight){
      this.y = this.map.naturalHeight - this.visibleHeight;
      this.isFixedY = true;
    }

  }

}
