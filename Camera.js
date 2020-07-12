'use strict'

class Camera {
  constructor(initX, initY) {
    this.x = initX;
    this.y = initY;
    if (canvas.width > canvas.height) {
      this.dx = canvas.height/canvas.width;
      this.dy = 1;
    } else {
      this.dy = canvas.width/canvas.height;
      this.dx = 1;
    }
  }

  drawVisibleMap() {
    ctx.drawImage(img, this.x, this.y,
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
    } else if (this.x + 200 > img.naturalWidth) {
      this.x = img.naturalWidth - 200;
    }

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + 200 > img.naturalHeight){
      this.y = img.naturalHeight - 200;
    }

  }

}
