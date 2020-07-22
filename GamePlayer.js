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
        if (this.y !== 320) {
            this.y += this.speed;
        }
        this.sprite.down.x = worldToCanvas(this.x - 8, 0);
        this.sprite.down.y = worldToCanvas(this.y - 10, 1);
        this.direction = "Down";
        this.sprite.down.update();
      } else if (upPressed) {
          if (this.y !== 0) {
              this.y -= this.speed;
          }
          this.sprite.up.x = worldToCanvas(this.x - 8, 0);
          this.sprite.up.y = worldToCanvas(this.y - 10, 1);
          this.direction = "Up";
          this.sprite.up.update();
        }

      if (rightPressed) {
        if (this.x !== 400) {
          this.x += this.speed;
        }
        this.sprite.right.x = worldToCanvas(this.x - 8, 0);
        this.sprite.right.y = worldToCanvas(this.y - 10, 1);
        this.direction = "Right";
        this.sprite.right.update();
      } else if (leftPressed) {
          if (this.x !== 0) {
            this.x -= this.speed;
          }
          this.sprite.left.x = worldToCanvas(this.x - 8, 0);
          this.sprite.left.y = worldToCanvas(this.y - 10, 1);
          this.direction = "Left";
          this.sprite.left.update();
          }
    }
}
