'use strict'

class Player {

  constructor (x, y,width,height, speed,sprite) {

    this.x=x;
    this.y=y;
    this.w=width;
    this.h=height;
    this.sprite=sprite;
    this.speed=speed;
    this.direction="Down";
    this.isFiring=false;

  }

  drawDirection() {

    if (this.direction == "Down") {
      ctx.drawImage (
          this.sprite.down.image,
          this.sprite.down.srcX,
          this.sprite.down.srcY,
          this.sprite.down.width,
          this.sprite.down.height,
          this.x,
          this.y,
          this.sprite.down.width,
          this.sprite.down.height
      );
    }

    if (this.direction == "Up") {
      ctx.drawImage (
          this.sprite.up.image,
          this.sprite.up.srcX,
          this.sprite.up.srcY,
          this.sprite.up.width,
          this.sprite.up.height,
          this.x,
          this.y,
          this.sprite.up.width,
          this.sprite.up.height
      );
    }

    if (this.direction == "Left") {
      ctx.drawImage (
          this.sprite.left.image,
          this.sprite.left.srcX,
          this.sprite.left.srcY,
          this.sprite.left.width,
          this.sprite.left.height,
          this.x,
          this.y,
          this.sprite.left.width,
          this.sprite.left.height
      );
    }

    if (this.direction == "Right") {
      ctx.drawImage (
          this.sprite.right.image,
          this.sprite.right.srcX,
          this.sprite.right.srcY,
          this.sprite.right.width,
          this.sprite.right.height,
          this.x,
          this.y,
          this.sprite.right.width,
          this.sprite.right.height
      );
    }

  }

  move() {

      if (downPressed) {
        this.y+=this.speed;
        this.sprite.down.x=this.x;
        this.sprite.down.y=this.y;
        this.direction = "Down";
        this.sprite.down.drawSprite();
      } else {
        if (upPressed) {
          this.y-=this.speed;
          this.sprite.up.x=this.x;
          this.sprite.up.y=this.y;
          this.direction = "Up";
          this.sprite.up.drawSprite();
        }
      }

      if (rightPressed) {
            this.x+=this.speed;
            this.sprite.right.x=this.x;
            this.sprite.right.y=this.y;
            this.direction = "Right";
            this.sprite.right.drawSprite();
          } else {
          if (leftPressed) {
            this.x-=this.speed;
            this.sprite.left.x=this.x;
            this.sprite.left.y=this.y;
            this.direction = "Left";
            this.sprite.left.drawSprite();
            }
          }
    }
}
