'use strict'
// индексы для спрайтов действия игрока(в классе NewSprite для framesY)
// 0 - ходьба с ak-47
// 1 - reload ak-47
// 2 - ходьба с shotgun
// 3 - reload  shotgun

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
    this.prevDirect = "Down";
    this.direction = "Down";
    this.reload = false;
    this.hp = 2;
    this.dead = false;
    this.fire = false;
    this.weapon = new Weapon(1);
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
  }

  drawDirection() {
    if (this.fire) {
      switch (this.weapon.id) {
        case 0:
          this.sprite.shoot.drawSprite();
          break;
        case 2:
          this.sprite.shoot.drawSprite();
          break;
      }
    }

      if (this.direction === "Down") {
        this.drawPlayerBody();
        this.sprite.down.drawSprite();
      }

      if (this.direction === "Up") {
        this.drawPlayerBody();
        this.sprite.up.drawSprite();
      }

      if (this.direction === "Left") {
        this.drawPlayerBody();
        this.sprite.left.drawSprite();
      }

      if (this.direction === "Right") {
        this.drawPlayerBody();
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
      this.sprite.down.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Down";
      this.sprite.down.update();
    } else if (upPressed) {
      if (this.y !== 0) {
        this.y -= this.speed;
        this.Y_Center -= this.speed;
      }
      this.sprite.up.x = worldToCanvas(this.x, 0);
      this.sprite.up.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Up";
      this.sprite.up.update();
    }

    if (rightPressed) {
      if (this.x < images["map"].naturalWidth) {
        this.x += this.speed;
        this.X_Center += this.speed;
      }
      this.sprite.right.x = worldToCanvas(this.x, 0);
      this.sprite.right.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Right";
      this.sprite.right.update();
    } else if (leftPressed) {
      if (this.x !== 0) {
        this.x -= this.speed;
        this.X_Center -= this.speed;
      }
      this.sprite.left.x = worldToCanvas(this.x, 0);
      this.sprite.left.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Left";
      this.sprite.left.update();
    }

    if (changeShootingMode) {
      this.weapon.switchShootingMode();
      changeShootingMode = false;
    }

    if (reloadPending) {  // додумать спрайт перезарядки
      /*this.weapon.reload();
      while (this.weapon.isReloading()){
        switch (this.weapon.id) {
          case 0:
            this.sprite.pl.indexFrameY = 1;
            this.sprite.pl.x = this.x;
            this.sprite.pl.y = this.y;
            break;
          case 2:
            this.sprite.pl.indexFrameY = 3;
            this.sprite.pl.x = this.x;
            this.sprite.pl.y = this.y;
            break;
        }
      }*/

      reloadPending = false;
    }

    if (mouseDown){
      this.fire = true;
      switch (this.weapon.id) {
        case 0:
          this.sprite.shoot.indexFrameY = 0;
          this.sprite.shoot.x = this.x;
          this.sprite.shoot.y = this.y;
          break;
        case 2:
          this.sprite.shoot.indexFrameY = 1;
          this.sprite.shoot.x = this.x;
          this.sprite.shoot.y = this.y;
          break;
      }
      this.weapon.shoot(this.x, this.y, canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1));
      this.weapon.shootExecuted = 1;
    } else {
      this.fire = false;
      this.weapon.shootExecuted = 0;
    }
  }

  drawPlayerBody() {
    ctx.save();
    ctx.translate(this.x, this.y);
    let deg = 3 * Math.PI / 2 + Math.acos((this.x - sight.x) / Math.sqrt(Math.pow((this.x - sight.x), 2) + Math.pow((this.y - sight.y), 2)));
    if (sight.y > this.y) {
      if (sight.x < this.x) {
        deg = -deg - Math.PI;
      } else {
        deg = -deg + Math.PI;
      }
    }
    ctx.rotate(deg);
    ctx.drawImage(
        this.sprite.pl.image,
        this.sprite.pl.srcX,
        this.sprite.pl.srcY,
        this.sprite.pl.width,
        this.sprite.pl.height,
        -this.sprite.pl.width / 2,
        -this.sprite.pl.height / 2 - spriteHKoef,
        this.sprite.pl.width,
        this.sprite.pl.height
    );

    ctx.restore();
  }

  changeWeapon(id) {
    this.weapon = new Weapon(id);
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
  }

}
