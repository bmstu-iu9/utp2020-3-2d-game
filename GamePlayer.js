'use strict'

class Player {

  constructor (x, y, width, height, speed, sprite) {

    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.sprite = sprite;
    this.speed = speed;
    this.direction = "Down";
    this.bulletsInMagazine = 30;
    this.magazine = 1;
    this.reload = false;

  }

  drawDirection() {

    if (this.direction == "Down") {
      this.sprite.down.drawSprite();
    }

    if (this.direction == "Up") {
      this.sprite.up.drawSprite();
    }

    if (this.direction == "Left") {
      this.sprite.left.drawSprite();
    }

    if (this.direction == "Right") {
      this.sprite.right.drawSprite();
    }

  }

  move() {

      if (downPressed) {
        if (camera.isFixedY)
            this.y += this.speed;
        this.sprite.down.x = this.x;
        this.sprite.down.y = this.y;
        this.direction = "Down";
        this.sprite.down.update();
      } else if (upPressed) {
          if (camera.isFixedY)
              this.y -= this.speed;
          this.sprite.up.x = this.x;
          this.sprite.up.y = this.y;
          this.direction = "Up";
          this.sprite.up.update();
        }

      if (rightPressed) {
        if (camera.isFixedX)
          this.x += this.speed;
        this.sprite.right.x = this.x;
        this.sprite.right.y = this.y;
        this.direction = "Right";
        this.sprite.right.update();
      } else if (leftPressed) {
          if (camera.isFixedX)
            this.x -= this.speed;
          this.sprite.left.x = this.x;
          this.sprite.left.y = this.y;
          this.direction = "Left";
          this.sprite.left.update();
          }
    }
}
