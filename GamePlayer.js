'use strict'

class Player {

  constructor (x, y, width, height, speed, sprite) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.X_Center = this.x + this.width / 2;
    this.Y_Center = this.y + this.height / 2;
    this.radius = (this.width / 2) + 1;
    this.sprite = sprite;
    this.speed = speed;
    this.direction = "Down";
    this.weapon = new Weapon(1);
  }

  drawDirection() {
    if (this.direction === "Down") {
      this.sprite.down.drawSprite();
    }

    if (this.direction === "Up") {
      this.sprite.up.drawSprite();
    }

    if (this.direction === "Left") {
      this.sprite.left.drawSprite();
    }

    if (this.direction === "Right") {
      this.sprite.right.drawSprite();
    }

    if (this.weapon.isReloading()) {
      this.weapon.drawReload(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset);
    }
  }

  move() {
    if (downPressed) {
      if (this.y < images["map"].naturalHeight) {
        this.y += this.speed;
        this.Y_Center += this.speed;
      }
      this.sprite.down.x = worldToCanvas(this.x, 0);
      this.sprite.down.y = worldToCanvas(this.y, 1);
      this.direction = "Down";
      this.sprite.down.update();
    } else if (upPressed) {
      if (this.y !== 0) {
        this.y -= this.speed;
        this.Y_Center -= this.speed;
      }
      this.sprite.up.x = worldToCanvas(this.x, 0);
      this.sprite.up.y = worldToCanvas(this.y, 1);
      this.direction = "Up";
      this.sprite.up.update();
    }

    if (rightPressed) {
      if (this.x < images["map"].naturalWidth) {
        this.x += this.speed;
        this.X_Center += this.speed;
      }
      this.sprite.right.x = worldToCanvas(this.x, 0);
      this.sprite.right.y = worldToCanvas(this.y, 1);
      this.direction = "Right";
      this.sprite.right.update();
    } else if (leftPressed) {
      if (this.x !== 0) {
        this.x -= this.speed;
        this.X_Center -= this.speed;
      }
      this.sprite.left.x = worldToCanvas(this.x, 0);
      this.sprite.left.y = worldToCanvas(this.y, 1);
      this.direction = "Left";
      this.sprite.left.update();
    }

    if (changeShootingMode) {
      this.weapon.switchShootingMode();
      changeShootingMode = false;
    }

    if (reloadPending){
      this.weapon.reload();
      reloadPending = false;
    }

    if (mouseDown){
      this.weapon.shoot(this.x, this.y, canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1));
      this.weapon.shootExecuted = 1;
    } else this.weapon.shootExecuted = 0;
  }

}
