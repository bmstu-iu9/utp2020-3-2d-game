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
    this.radius = 5;
    this.sprite = sprite;
    this.speed = speed;
    this.prevDirect = "Down";
    this.direction = "Down";
    this.reload = false;
    this.hp = 2;
    this.dead = false;
    this.fire = false;
    this.weapon = new Weapon(0);
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;
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
    this.sprite.pl.drawSprite();

    if (this.weapon.isReloading()) {
      this.weapon.drawReload(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset);
    }
  }

  move() {
    if (downPressed) {
      if (this.y < images["map"].naturalHeight) {
        this.y += this.speed;
        // временный костыль, связанный с недоработкой сетки навигации
        if (this.y >= 300) {
          this.y = 299;
        }
        //
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
        if (this.x >= 300) {
          this.x = 299;
        }
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

    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;

    this.sprite.pl.x = worldToCanvas(this.x, 0);
    this.sprite.pl.y = worldToCanvas(this.y, 1);
    this.sprite.pl.update();

    if (changeShootingMode) {
      this.weapon.switchShootingMode();
      changeShootingMode = false;
    }

    if (reloadPending) {  // додумать спрайт перезарядки
      this.weapon.reload();
      reloadPending = false;
    }

    if (mouseDown) {
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

  vis(tx, ty) {
    let degRad = Math.acos((tx - mesh[this.XBlock][this.YBlock].x) / Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) + Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2)));
    if (ty > mesh[this.XBlock][this.YBlock].y) {
      degRad += Math.PI;
    } else {
      degRad = Math.PI - degRad;
    }
    let deg = degRad * 180 / Math.PI;
    deg = (deg - (deg % 10)) / 10;
    let dist = Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) + Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2));
    return mesh[(tx - (tx % worldTileSize)) / worldTileSize][(ty - (ty % worldTileSize)) / worldTileSize].vision[deg] > dist;
  }
}
