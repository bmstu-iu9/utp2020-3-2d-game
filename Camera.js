'use strict'

class Camera {
  constructor(initX, initY, img, visibleWidth, visibleHeight) {
    this.x = initX;
    this.y = initY;
    this.map = img;
    this.dx = 1;
    this.dy = 1;
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

    if (leftPressed) {
      this.x -= this.dx;
    } else if (rightPressed) {
      this.x += this.dx;
    }

    if (downPressed){
      this.y += this.dy;
    } else if (upPressed) {
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
