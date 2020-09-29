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
let timeForOneBul = [1.5 * 1000 / 20, 1.2 * 1000 / 18.5, 3.5 * 1000 / 6 / 20];
let lTime = 0;
let dT = 0;
let noW = 0;

class Player {

  constructor (x, y, width, height, offsetX, offsetY, rW, rH, speed, sprite) {
    this.x = x;
    this.y = y;
    this.realX = this.x + offsetX; //для коллизии
    this.realY = this.y + offsetY; //
    this.realW = rW; // размеры для коллизии
    this.realH = rH; //
    this.realXCenter = this.realX + this.realW/2;
    this.realYCenter = this.realY + this.realH/2;
    this.weaponX = this.realXCenter;
    this.weaponY = this.realYCenter + 9;
    this.sX = this.realXCenter + 30; //координаты реального прицела(дуло оружия)
    this.sY = this.realYCenter + 9;
    this.prevX = this.realXCenter;
    this.prevY = this.realYCenter;
    this.moving = false;
    this.angle = 0;
    this.actionRadius = rW;
    this.sprite = sprite;
    this.speed = speed;
    this.normSpeed = speed;
    this.hp = 2;
    this.dead = false;
    this.shooting = false;
    this.inCover = false;
    this.coverId = -1;
    this.soundId = null;
    this.weapon = new Weapon(1);
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

    this.updateBlock();

  }

  init(x, y, speed) {
    this.normSpeed = speed;
    let dx = x - this.x;
    let dy = y - this.y;
    this.x = x;
    this.y = y;
    this.realX += dx;
    this.realY += dy;
    this.realXCenter += dx;
    this.realYCenter += dy;
    this.weaponX = this.realXCenter;
    this.weaponY = this.realYCenter + 9;
    this.sX = this.realXCenter + 30;
    this.sY = this.realYCenter + 9;
    this.prevX = this.realXCenter;
    this.prevY = this.realYCenter;
    this.sound = "nothing";
    this.hp = 2;
    this.angle = 0;
    this.dead = false;
    this.moving = false;
    this.shooting = false;
    this.inCover = false;
    this.coverId = -1;
    this.soundId = null;
    this.weapon = new Weapon(1);
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
    this.sprite.right.x = worldToCanvas(this.realX - 3, 0);
    this.sprite.right.y = worldToCanvas(this.realY + 10, 1);
  }

  drawDirection() {
    if (this.dead === true) {
      this.sprite.death.drawSprite();
    } else {
      this.sprite.right.drawFeet(this.angle, worldToCanvas(this.realXCenter, 0), worldToCanvas(this.realYCenter, 1));
    if (this.shooting) {
      if (!this.weapon.isReloading()) {
        if (!this.weapon.emptyMagazine()) {
          this.sprite.shoot.drawBodySprite(this.x, this.y, this.angle);
        } else {
          this.sprite.pl.drawBodySprite(this.x, this.y, this.angle);
        }
      } else {
          this.sprite.pl.drawBodySprite(this.x, this.y, this.angle);
      }
    }

    if (!this.shooting) {
      if (this.weapon.isReloading()) {
        this.sprite.pl.drawBodySprite(this.x, this.y, this.angle);
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
        this.sprite.pl.drawBodySprite(this.x, this.y, this.angle);
      }
    }
  }
}

  update() {
    if (!this.dead) {
      if (creeping) {
        this.speed = this.normSpeed / 2;
        this.sprite.right.speed = 5;
      } else {
        this.speed = this.normSpeed;
        this.sprite.right.speed = 3;
      }

      this.move();
      if ((!this.moving && creeping) || (!creeping)) {
        if (this.soundId != null) {
          clearInterval(this.soundId);
          this.soundId = null;
        }
      }
      this.checkAngle();

      this.updateBlock();
      this.setNewCoordinates();
      this.checkGrenade();
      this.reload();
      this.updateReloadingTile();
      this.shoot();
      this.pickUp();
      this.checkDoor();
      this.updateCover();
    } else {
      if (this.soundId != null) {
        clearInterval(this.soundId);
        this.soundId = null;
      }
      this.weapon.drop(this.realXCenter, this.realYCenter);
      gameOver("dead");
      return;
    }
  }

  move() {
    this.prevX = this.realXCenter;
    this.prevY = this.realYCenter;
    if (downPressed && !this.inCover && collisionPlayer(this.realX, this.realY + this.speed, this.realW, this.realH)) {
      this.realY += this.speed;
      this.realYCenter += this.speed;
      this.y += this.speed;
      this.weaponY += this.speed;
      this.sY += this.speed;

      this.sprite.pl.update();
      this.sprite.right.update();
      if (this.sound === "water" || this.sound === "dirt" || this.sound === "tile") {
        if (creeping) {
          if (this.soundId == null) {
            if (playerSounds[this.sound].onPause()) {
              playerSounds[this.sound].play();
            }
          this.soundId = setInterval (() => {
              if (playerSounds[this.sound].onPause()) {
                playerSounds[this.sound].play();
              }
          }, 0.7*1000);
        }
        } else {
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
        }
      }
    } else if (upPressed && !this.inCover && collisionPlayer(this.realX, this.realY - this.speed, this.realW, this.realH)) {
      this.y -= this.speed;
      this.realY -= this.speed;
      this.realYCenter -= this.speed;
      this.weaponY -= this.speed;
      this.sY -= this.speed;

      this.sprite.pl.update();
      this.sprite.right.update();

      if (this.sound === "water" || this.sound === "dirt" || this.sound === "tile") {
        if (creeping) {
          if (this.soundId == null) {
            if (playerSounds[this.sound].onPause()) {
              playerSounds[this.sound].play();
            }
          this.soundId = setInterval (() => {
              if (playerSounds[this.sound].onPause()) {
                playerSounds[this.sound].play();
              }
          }, 0.7*1000);
        }
        } else {
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
        }
      }
    }

    if (rightPressed && !this.inCover && collisionPlayer(this.realX + this.speed, this.realY, this.realW, this.realH)) {
      this.x += this.speed;
      this.realX += this.speed;
      this.realXCenter += this.speed;
      this.weaponX += this.speed;
      this.sX += this.speed;

      this.sprite.pl.update();
      this.sprite.right.update();

      if (this.sound === "water" || this.sound === "dirt" || this.sound === "tile") {
        if (creeping) {
          if (this.soundId == null) {
            if (playerSounds[this.sound].onPause()) {
              playerSounds[this.sound].play();
            }
          this.soundId = setInterval (() => {
              if (playerSounds[this.sound].onPause()) {
                playerSounds[this.sound].play();
              }
          }, 0.7*1000);
        }
        } else {
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
        }
      }
    } else if (leftPressed && !this.inCover && collisionPlayer(this.realX - this.speed, this.realY, this.realW, this.realH)) {
      this.x -= this.speed;
      this.realX -= this.speed;
      this.realXCenter -= this.speed;
      this.weaponX -= this.speed;
      this.sX -= this.speed;

      this.sprite.pl.update();
      this.sprite.right.update();

      if (this.sound === "water" || this.sound === "dirt" || this.sound === "tile") {
        if (creeping) {
          if (this.soundId == null) {
            if (playerSounds[this.sound].onPause()) {
              playerSounds[this.sound].play();
            }
          this.soundId = setInterval (() => {
              if (playerSounds[this.sound].onPause()) {
                playerSounds[this.sound].play();
              }
          }, 0.7*1000);
        }
        } else {
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
        }
      }
    }

    if (this.prevX == this.realXCenter && this.prevY == this.realYCenter) {
      this.moving = false;
    } else {
      this.moving = true;
    }
  }

  reload() {
    if (reloadPending && !this.weapon.isReloading()) {
      this.weapon.reload();
      if (this.weapon.isReloading()) {
        switch (this.weapon.id) {
        case 0:
          this.sprite.pl.indexFrameY = 1;
          this.sound = "ak_reload";
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
          break;
        case 1:
          this.sprite.pl.indexFrameY = 5;
          this.sound = "m16_reload";
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
          break;
        case 2:
          this.sprite.pl.indexFrameY = 3;
          this.sound = "shotgun_reload";
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          }
          break;
        }
        this.sprite.pl.currentFrame[this.sprite.pl.indexFrameY] = 0;
        this.sprite.pl.counter = 0;
        lTime = this.weapon.lastReloadTime;
      }
      reloadPending = false;
    }
  }

  updateReloadingTile() {
    if (this.weapon.isReloading()) {
      noW = performance.now();
      dT += (noW - lTime);
      if (dT > timeForOneBul[this.weapon.id]) {
        this.sprite.pl.counter = this.sprite.pl.speed - 1;
        this.sprite.pl.update();
        lTime = noW - (dT - timeForOneBul[this.weapon.id]);
        dT = 0;
        } else {
          lTime = noW;
        }
      if (this.weapon.id === 2) {
        this.sound = "shotgun_reload";
        if (playerSounds[this.sound].onPause()) {
          playerSounds[this.sound].play();
        }
      }
      } else {
        dT = 0;
    }
  }

  shoot() {
    if (changeShootingMode) {
      this.weapon.switchShootingMode();
      changeShootingMode = false;
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

      this.sprite.shoot.update();
      this.shooting = true;
      let x = worldToCanvas(this.weaponX, 0);
      let y = worldToCanvas(this.weaponY, 1);
      let x1 = worldToCanvas(this.realXCenter, 0);
      let y1 = worldToCanvas(this.realYCenter, 1);
      let x2 = worldToCanvas(this.sX, 0);
      let y2 = worldToCanvas(this.sY, 1);
      let point1 = {
        "x" : (x - x1)*Math.cos(this.angle) - (y - y1)*Math.sin(this.angle) + x1,
        "y" : (x - x1)*Math.sin(this.angle) + (y - y1)*Math.cos(this.angle) + y1,
      }
      let point2 = {
        "x" : (x2 - x1)*Math.cos(this.angle) - (y2 - y1)*Math.sin(this.angle) + x1,
        "y" : (x2 - x1)*Math.sin(this.angle) + (y2 - y1)*Math.cos(this.angle) + y1,
      }
      this.weapon.shoot(
                canvasToWorld(point1.x, 0),
                canvasToWorld(point1.y, 1),
                canvasToWorld(point2.x, 0),
                canvasToWorld(point2.y, 1));
      this.weapon.shotExecuted = true;
    } else {
      this.shooting = false;
      this.weapon.shotExecuted = false;
    }
  }

  updateCover() {
    if (getInCover) {
      if (this.inCover) {
        this.inCover = false;
        this.coverId = -1;
        this.sprite.pl.worldW *= 1.1;
        this.sprite.pl.worldH *= 1.1;
        this.sprite.right.worldW *= 1.1;
        this.sprite.right.worldH *= 1.1;

      } else {
        let blocks = this.getBlocksByRadius();
        for (let block of blocks) {
          let coverId = Cover.defineCover(block.x, block.y);
          if (coverId !== -1) {
            this.inCover = true;
            this.coverId = coverId;
          }
        }
        if (this.inCover) {
          this.sprite.pl.worldW /= 1.1;
          this.sprite.pl.worldH /= 1.1;
          this.sprite.right.worldW /= 1.1;
          this.sprite.right.worldH /= 1.1;
        }
      }
      getInCover = false;
    }
  }

  pickUp() {
    if (pickUp) {
      for (let item of weapons) {
        let dv = Math.sqrt(Math.pow(this.realXCenter - (item.x + item.width/2), 2) + Math.pow(this.realYCenter - (item.y + item.height/2), 2));
        if (dv <= this.actionRadius + item.pickUpRadius) {
          this.sound = "switch_weapon";
          if (playerSounds[this.sound].onPause()) {
            playerSounds[this.sound].play();
          } else {
            playerSounds[this.sound].pause();
            playerSounds[this.sound].play();
          }
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
  }

  checkDoor() {
    if (openDoor) {
      for (let i = 0; i < doors.length; i++) {
        let door = doors[i];
        if (collisionCircleRect(this.realXCenter, this.realYCenter, this.actionRadius,
                                door.getX(), door.getY(), door.getH(), door.getW())) {
          door.toggle();
          if (door.opened) {
            if (!playerSounds["door_open"].paused) {
              playerSounds["door_open"].pause();
            }
            this.sound = "door_close";
            playerSounds[this.sound].play();
            door.opened = false;
          } else {
            if (!playerSounds["door_close"].paused) {
              playerSounds["door_close"].pause();
            }
            this.sound = "door_open";
            playerSounds[this.sound].play();
            door.opened = true;
          }
          break;
        }
      }
      openDoor = false;
    }
  }

  checkGrenade() {
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
  }

  updateBlock() {
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

  getBlocksByRadius() {
    let step = Math.PI / 4;
    let blocks = [];
    for (let angle = 0; angle < 2 * Math.PI; angle += step) {
      let end = Math.ceil(this.actionRadius / 2 / worldTileSize);
      for (let i = 0; i < end; i++) {
        let v = rotate(i * worldTileSize + this.actionRadius / 2, 0, angle);
        let xBlock = Math.floor((this.realXCenter + v.x) / worldTileSize);
        let yBlock = Math.floor((this.realYCenter + v.y) / worldTileSize);
        blocks.push({"x" : xBlock, "y" : yBlock});
      }
    }
    return blocks;
  }

  setNewCoordinates() {
    this.sprite.pl.x = worldToCanvas(this.realXCenter, 0);
    this.sprite.pl.y = worldToCanvas(this.realYCenter, 1);
    this.sprite.death.x = this.sprite.pl.x;
    this.sprite.death.y = this.sprite.pl.y;
    this.sprite.shoot.x = this.sprite.pl.x;
    this.sprite.shoot.y = this.sprite.pl.y;
    this.sprite.right.x = worldToCanvas(this.realX - 3, 0);
    this.sprite.right.y = worldToCanvas(this.realY + 10, 1);
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

    let visAngle = findAngle(this.realXCenter, this.realYCenter, canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1), tx, ty);
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

  subHp(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }
  }

  checkAngle() {
    let x = worldToCanvas(player.weaponX, 0);
    let y = worldToCanvas(player.weaponY, 1);
    let deg = 0;
    let x1 = worldToCanvas(this.realXCenter, 0);
    let y1 = worldToCanvas(this.realYCenter, 1);
    let len1 = Math.sqrt(Math.pow(sight.x - x1, 2) + Math.pow(sight.y - y1, 2));
    let vec1 = [(sight.x - x1) / len1, (sight.y - y1) / len1];

    if (sight.x < x1) {
      if (sight.y > y1) {
        deg = Math.PI / 2 + Math.acos(vec1[1]);
      } else {
        deg = Math.PI + Math.acos(-vec1[0])
      }
    } else {
      if (sight.y > y1) {
        deg = Math.acos(vec1[0]);
      } else {
        deg = 3 * Math.PI / 2 + Math.acos(-vec1[1]);
      }
    }

    let point = {
      "x" : (x - x1)*Math.cos(deg) - (y - y1)*Math.sin(deg) + x1,
      "y" : (x - x1)*Math.sin(deg) + (y - y1)*Math.cos(deg) + y1,
    }
    let L = Math.sqrt(Math.pow(sight.x - point.x, 2) + Math.pow(sight.y - point.y, 2));
    let X = (sight.x - point.x) / L;
    let Y = (sight.y - point.y) / L;
    deg -= Math.acos(X * vec1[0] + Y * vec1[1]);
    this.angle = deg;
  }
}
