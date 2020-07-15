'use strict'

class Camera {
  constructor(initX, initY, img) {
    this.x = initX;
    this.y = initY;
    this.map = img;
    if (canvas.width > canvas.height) {
      this.dx = canvas.height/canvas.width;
      this.dy = 1;
    } else {
      this.dy = canvas.width/canvas.height;
      this.dx = 1;
    }
  }

  drawVisibleMap() {
    ctx.drawImage(this.map, this.x, this.y,
                  200, 200,
                  0, 0,
                  canvas.width, canvas.height);
  }

  updateCoordinates(){
    if (resized) {
      resized = false;

      if (canvas.width > canvas.height) {
        this.dx = canvas.height/canvas.width;
        this.dy = 1;
      } else {
        this.dy = canvas.width/canvas.height;
        this.dx = 1;
      }

    }

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
    } else if (this.x + 200 > this.map.naturalWidth) {
      this.x = this.map.naturalWidth - 200;
    }

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + 200 > this.map.naturalHeight){
      this.y = this.map.naturalHeight - 200;
    }

  }

}
