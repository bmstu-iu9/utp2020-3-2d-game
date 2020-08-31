'use strict';
// индексы для спрайтов действия игрока(в классе NewSprite для framesY)
// 0 - ходьба с ak-47
// 1 - reload ak-47
// 2 - ходьба с shotgun
// 3 - reload  shotgun
// 4 - ходьба с m16
// 5 - reload m16
// sprites shoot :
// 0 - shoot ak47
// 1 - shoot shotgun
// 2 - shoot m16
let timeForOneBul = [1.5 * 1000 / 20, 1.2 * 1000 / 20, 3.5 * 1000 / 6];
let lTime = 0;
let dT = 0;
let noW = 0;
let change = false;
let steP = 0;

class Player {

  constructor (x, y, width, height, offsetX, offsetY, rW, rH, speed, sprite) {
    this.x = x;
    this.y = y;
    this.realX = this.x + offsetX; //для коллизии
    this.realY = this.y + offsetY; //
    this.realW = rW; // размеры для коллизии
    this.realH = rH; //
    this.X_Center = this.x + this.w_World/2; // координаты центра в мире
    this.Y_Center = this.y + this.h_World/2;
    this.realXCenter = this.realX + this.realW/2;
    this.realYCenter = this.realY + this.realH/2;
    this.action = false;
    this.angle = 0;
    this.actionRadius = rW;
    this.sprite = sprite;
    this.speed = speed;
    this.prevDirect = "Right";
    this.direction = "Right";
    this.hp = 2;
    this.dead = false;
    this.fire = false;
    this.shooting = false;
    this.reloadId = null;
    this.weapon = new Weapon(2);
    this.grenades = new Array(new Grenade(0, 0), new Grenade(0, 0));
    this.sound = "nothing";

    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
        this.sprite.shoot.indexFrameY = 0;
        break;
      case 1:
        this.sprite.pl.indexFrameY = 4;
        this.sprite.shoot.indexFrameY = 2;
        break;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        this.sprite.shoot.indexFrameY = 1;
        break;
    }
    this.sprite.pl.srcY = this.sprite.pl.height * this.sprite.pl.indexFrameY;
    this.sprite.shoot.srcY = this.sprite.shoot.height * this.sprite.shoot.indexFrameY;
    this.sprite.shoot.speed = 10;
    this.XBlock = (this.realXCenter - (this.realXCenter % worldTileSize)) / worldTileSize;
    this.YBlock = (this.realYCenter - (this.realYCenter % worldTileSize)) / worldTileSize;
    this.walkXBlock = this.XBlock;
    this.walkYBlock = this.YBlock;
    if (!mesh[this.XBlock][this.YBlock].walk) {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (mesh[this.XBlock + i][this.YBlock + j].walk) {
            this.walkXBlock = this.XBlock + i;
            this.walkYBlock = this.YBlock + j;
            break;
          }
        }
        if (mesh[this.walkXBlock][this.walkYBlock].walk) {
          break;
        }
      }
    }
  }

  init(x, y, speed) {
    this.speed = speed;
    let dx = x - this.x;
    let dy = y - this.y;
    this.x = x;
    this.y = y;
    this.realX += dx;
    this.realY += dy;
    this.X_Center += dx;
    this.Y_Center += dy;
    this.realXCenter += dx;
    this.realYCenter += dy;
    this.prevDirect = "Right";
    this.direction = "Right";
    this.hp = 2;
    this.angle = 0;
    this.dead = false;
    this.fire = false;
    this.shooting = false;
    this.weapon = new Weapon(2);
    this.grenades = new Array(new Grenade(0, 0), new Grenade(0, 0));
    this.XBlock = (this.realXCenter - (this.realXCenter % worldTileSize)) / worldTileSize;
    this.YBlock = (this.realYCenter - (this.realYCenter % worldTileSize)) / worldTileSize;
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
        break;
      case 1:
        this.sprite.pl.indexFrameY = 4;
        break;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
    this.sprite.pl.srcY = this.sprite.pl.height * this.sprite.pl.indexFrameY;
  }

  drawDirection() {
    if (this.direction === "Down") {
      this.sprite.down.drawBodySprite();
    }
    if (this.direction === "Up") {
      this.sprite.up.drawBodySprite();
    }
    if (this.direction === "Left") {
      this.sprite.left.drawBodySprite();
    }
    if (this.direction === "Right") {
      this.sprite.right.drawBodySprite();
    }
    if (this.shooting) {
      if (!this.weapon.isReloading()) {
        if (!this.weapon.emptyMagazine()) {
          this.sprite.shoot.drawBodySprite();
        } else {
          this.sprite.pl.drawBodySprite();
        }
      } else {
          this.sprite.pl.drawBodySprite();
          this.weapon.drawReload(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset);
      }
    }

    if (!this.shooting) {
      if (this.weapon.isReloading()) {
        this.sprite.pl.drawBodySprite();
        this.weapon.drawReload(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset);
      } else {
        switch (this.weapon.id) {
          case 0:
            this.sprite.pl.indexFrameY = 0;
            break;
          case 1:
            this.sprite.pl.indexFrameY = 4;
            break;
          case 2:
            this.sprite.pl.indexFrameY = 2;
            break;
        }
        this.sprite.pl.drawBodySprite();
      }
    }
  }

  move(dt) {
    if (downPressed && collisionPlayer(this.realX, this.realY + this.speed, this.realW, this.realH)) {
      this.realY += this.speed;
      this.realYCenter += this.speed;
      this.y += this.speed;
      this.Y_Center += this.speed;

      this.sprite.down.x = worldToCanvas(this.X_Center, 0);
      this.sprite.down.y = worldToCanvas(this.Y_Center, 1);
      this.sprite.pl.update();
      this.action = true;
      this.direction = "Down";
      this.sprite.down.update();

      if (this.sound === "water") {
        if (playerSounds[this.sound].onPause()) {
          playerSounds[this.sound].play();
        }
      }
    } else if (upPressed && collisionPlayer(this.realX, this.realY - this.speed, this.realW, this.realH)) {
      this.y -= this.speed;
      this.realY -= this.speed;
      this.realYCenter -= this.speed;
      this.Y_Center -= this.speed;

      this.sprite.up.x = worldToCanvas(this.X_Center, 0);
      this.sprite.up.y = worldToCanvas(this.Y_Center, 1);
      this.sprite.pl.update();
      this.direction = "Up";
      this.sprite.up.update();

      if (this.sound === "water") {
        if (playerSounds[this.sound].onPause()) {
          playerSounds[this.sound].play();
        }
      }
    }

    if (rightPressed && collisionPlayer(this.realX + this.speed, this.realY, this.realW, this.realH)) {
      this.x += this.speed;
      this.realX += this.speed;
      this.realXCenter += this.speed;
      this.X_Center += this.speed;

      this.sprite.right.x = worldToCanvas(this.X_Center, 0);
      this.sprite.right.y = worldToCanvas(this.Y_Center, 1);
      this.sprite.pl.update();
      this.direction = "Right";
      this.sprite.right.update();

      if (this.sound === "water") {
        if (playerSounds[this.sound].onPause()) {
          playerSounds[this.sound].play();
        }
      }
    } else if (leftPressed && collisionPlayer(this.realX - this.speed, this.realY, this.realW, this.realH)) {
      this.x -= this.speed;
      this.realX -= this.speed;
      this.realXCenter -= this.speed;
      this.X_Center -= this.speed;

      this.sprite.left.x = worldToCanvas(this.X_Center, 0);
      this.sprite.left.y = worldToCanvas(this.Y_Center, 1);
      this.sprite.pl.update();
      this.direction = "Left";
      this.sprite.left.update();

      if (this.sound === "water") {
        if (playerSounds[this.sound].onPause()) {
          playerSounds[this.sound].play();
        }
      }
    }

    if (this.hp === 0) {
      gameOver();
      return;
    }

    this.XBlock = (this.realXCenter - (this.realXCenter % worldTileSize)) / worldTileSize;
    this.YBlock = (this.realYCenter - (this.realYCenter % worldTileSize)) / worldTileSize;
    this.walkXBlock = this.XBlock;
    this.walkYBlock = this.YBlock;
    if (!mesh[this.XBlock][this.YBlock].walk) {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (mesh[this.XBlock + i][this.YBlock + j].walk) {
            this.walkXBlock = this.XBlock + i;
            this.walkYBlock = this.YBlock + j;
            break;
          }
        }
        if (mesh[this.walkXBlock][this.walkYBlock].walk) {
          break;
        }
      }
    }

    if (changeShootingMode) {
      this.weapon.switchShootingMode();
      changeShootingMode = false;
    }

    if (this.grenades.length){
      let grenade = this.grenades[this.grenades.length - 1];
      if (throwTime && !grenade.isActivated()) {
        grenade.activate();
      } else if (throwGrenade) {
        if (!grenade.exploded()) {
          grenade.throw(this.realXCenter, this.realYCenter,
                canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1), throwTime / 1000);
        }
        this.grenades.pop();
        throwGrenade = false;
        throwTime = null;
      }
    }

    if (reloadPending && !this.weapon.isReloading()) {
      this.weapon.reload();
      if (this.weapon.isReloading()) {
        switch (this.weapon.id) {
        case 0:
          this.sprite.pl.indexFrameY = 1;
          break;
        case 1:
          this.sprite.pl.indexFrameY = 5;
          break;
        case 2:
          this.sprite.pl.indexFrameY = 3;
          break;
        }
        this.sprite.pl.currentFrame[this.sprite.pl.indexFrameY] = 0;
        this.sprite.pl.counter = 0;
        lTime = this.weapon.lastReloadTime;
      }
      reloadPending = false;
    }

    this.sprite.pl.x = worldToCanvas(this.realXCenter, 0);
    this.sprite.pl.y = worldToCanvas(this.realYCenter, 1);
    if (this.weapon.isReloading()) {
     noW = performance.now();
      dT = (noW - lTime);
    //  console.log(dt);
        if (dT > timeForOneBul[this.weapon.id] / 20 && steP < 1) {
          steP += 1/20;
          this.sprite.pl.counter = this.sprite.pl.speed - 1;
          this.sprite.pl.update();
          //dT -= 0.001;
        }
        if (steP === 1) {
          steP = 0;
        }
  //  console.log(this.sprite.pl.currentFrame[3]);
      lTime = noW;
  } else {
    steP = 0;
  }

    if (mouseDown) {
      switch (this.weapon.id) {
        case 0:
          this.sprite.shoot.indexFrameY = 0;
          break;
        case 1:
          this.sprite.shoot.indexFrameY = 2;
          break;
        case 2:
          this.sprite.shoot.indexFrameY = 1;
          break;
      }
      this.sprite.shoot.x = this.sprite.pl.x;
      this.sprite.shoot.y = this.sprite.pl.y;
      this.sprite.shoot.update();
      let k1 = 30;
      let k2 = 0;
      let k3 = (canvasToWorld(sight.x, 0) - this.realXCenter);
      let k4 = (canvasToWorld(sight.y, 1) - this.realYCenter);
      let dist1 = Math.sqrt(k1*k1 + k2*k2);
      let dist2 = Math.sqrt(k3*k3 + k4*k4);
      let normLen = 5;
      let normX = -k4 / dist2 * normLen;
      let normY = k3 / dist2 * normLen;
      this.shooting = true;
      this.fire = this.weapon.shoot(
                  this.realXCenter + (canvasToWorld(sight.x, 0) - this.realXCenter) * dist1 / dist2 + normX,
                  this.realYCenter + (canvasToWorld(sight.y, 1) - this.realYCenter) * dist1 / dist2 + normY,
                  canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1));
      this.weapon.shootExecuted = 1;
    } else {
      this.shooting = false;
      this.fire = false;
      this.weapon.shootExecuted = 0;
    }

    if (pickUp) {
      for (let item of weapons) {
        let dv = Math.sqrt(Math.pow(this.realXCenter - (item.x + item.width/2), 2) + Math.pow(this.realYCenter - (item.y + item.height/2), 2));
        if (dv <= this.actionRadius + item.pickUpRadius) {
          let gun = item;
          item.pickUp();
          this.weapon.drop(gun.x, gun.y);
          this.changeWeapon(gun);
          this.sprite.pl.counter = this.sprite.pl.speed - 1;
          this.sprite.shoot.counter = this.sprite.shoot.speed - 1;
          this.sprite.pl.update();
          this.sprite.shoot.update();
          break;
        }
      }
      pickUp = false;
    }

    if (openDoor) {
      for (let i = 0; i < doors.length; i++) {
        let door = doors[i];
        if (collisionCircleRect(this.realXCenter, this.realYCenter, this.actionRadius,
                                door.getX(), door.getY(), door.getH(), door.getW())) {
          console.log("collision " + i);
          door.toggle();
          break;
        }
      }
      openDoor = false;
    }

  }

  changeWeapon(gun) {
    this.weapon = gun;
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
        this.sprite.shoot.indexFrameY = 0;
        break;
      case 1:
        this.sprite.pl.indexFrameY = 4;
        this.sprite.shoot.indexFrameY = 2;
        break;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        this.sprite.shoot.indexFrameY = 1;
        break;
    }
  }

  vis(tx, ty, key) {
    let vx = (tx - this.realXCenter) / 2;
    let vy = (ty - this.realYCenter) / 2;
    let visCenterX = this.realXCenter + vx;
    let visCenterY = this.realYCenter + vy;

    let vx1 = canvasToWorld(sight.x, 0) - this.realXCenter;
    let vx2 = tx - this.realXCenter;
    let vy1 = canvasToWorld(sight.y, 1) - this.realYCenter;
    let vy2 = ty - this.realYCenter;
    let dotProduct =  ((vx1) * (vx2) + (vy1) * (vy2)) /
                       (Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2)) *
                         Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2)));
    dotProduct = dotProduct > 1 ? 1 : dotProduct;
    dotProduct = dotProduct < -1 ? -1 : dotProduct;
    let visAngle = Math.acos(dotProduct);
    let doorCheck = true;
    for (let door of doors) {
      doorCheck = doorCheck && !collisionLineRect(player.realXCenter, player.realYCenter,
                                                  tx, ty,
                                                  door.getX(), door.getY(),
                                                  door.getX() + door.getW(), door.getY() + door.getH());
    }
    if (key === 0) {
      return visAngle < Math.PI / 2 &&
             doorCheck &&
             vision(visCenterX, visCenterY, tx, ty) &&
             vision(visCenterX, visCenterY, this.realXCenter, this.realYCenter);
    } else {
      return vision(visCenterX, visCenterY, tx, ty) &&
             vision(visCenterX, visCenterY, this.realXCenter, this.realYCenter);
    }

  }
}
