'use strict'

class Camera {
  constructor(initX, initY, img, visibleWidth, visibleHeight, speed) {
    this.x = initX;
    this.y = initY;
    this.map = img;
    this.speed = speed;
    this.dx = speed;
    this.dy = speed;
    this.visibleWidth = visibleWidth;
    this.visibleHeight = visibleHeight;
    this.scaleX = visibleWidth / canvas.width;
    this.scaleY = visibleHeight / canvas.height;
  }

  init(x, y, speed, visibleWidth, visibleHeight) {
    this.x = x;
    this.y = y;
    this.speed = speed;
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
    if (creeping) {
      this.dx = this.speed / 2;
      this.dy = this.speed / 2;
    } else {
      this.dx = this.speed;
      this.dy = this.speed;
    }
    if (leftPressed && worldToCanvas(player.realXCenter, 0) <= moveBorder) {
      this.x -= this.dx;
    } else if (rightPressed && worldToCanvas(player.realXCenter, 0) >= canvas.width - moveBorder) {
      this.x += this.dx;
    }

    if (downPressed && worldToCanvas(player.realYCenter, 1) >= canvas.height - moveBorder){
      this.y += this.dy;
    } else if (upPressed && worldToCanvas(player.realYCenter, 1) <= moveBorder) {
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

  changeVisiblePart(dt) {
    this.visibleWidth += dt;
    this.visibleHeight += dt;
    this.scaleX = this.visibleWidth / canvas.width;
    this.scaleY = this.visibleHeight / canvas.height;
  }
}
