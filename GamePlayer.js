'use strict'
// индексы для спрайтов действия игрока(в классе NewSprite для framesY)
// 0 - ходьба с ak-47
// 1 - reload ak-47
// 2 - ходьба с shotgun
// 3 - reload  shotgun

class Player {

  constructor (x, y, width, height, offsetX, offsetY, rW, rH, speed, sprite) {
    this.x = x;
    this.y = y;
    this.w_World = width; // размеры спрайта в мире
    this.h_World = height; //
    this.w = this.w_World * (1 / camera.scaleX);  //размеры на канвасе
    this.h = this.h_World * (1 / camera.scaleY); //
    this.realX = this.x + offsetX; //для коллизии
    this.realY = this.y + offsetY; //
    this.realW = rW; // размеры для коллизии
    this.realH = rH; //
    this.X_Center = this.x + this.w_World/2; // координаты центра в мире
    this.Y_Center = this.y + this.h_World/2;
    this.realXCenter = this.realX + this.realW/2;
    this.realYCenter = this.realY + this.realH/2;
    this.angle = 0;
    this.radius = 5;
    this.sprite = sprite;
    this.speed = speed;
    this.prevDirect = "Right";
    this.direction = "Right";
    this.hp = 2;
    this.dead = false;
    this.fire = false;
    this.shooting = false;
    this.weapon = new Weapon(0);
    this.grenades = new Array(new Grenade(0, 0), new Grenade(0, 0));

    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
    this.sprite.shoot.speed = 10;
    this.XBlock = (this.realXCenter - (this.realXCenter % worldTileSize)) / worldTileSize;
    this.YBlock = (this.realYCenter - (this.realYCenter % worldTileSize)) / worldTileSize;
  }

  init(x, y) {
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
    this.weapon = new Weapon(0);
    this.grenades = new Array(new Grenade(0, 0), new Grenade(0, 0));
    this.XBlock = (this.realXCenter - (this.realXCenter % worldTileSize)) / worldTileSize;
    this.YBlock = (this.realYCenter - (this.realYCenter % worldTileSize)) / worldTileSize;
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
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
          case 2:
            this.sprite.pl.indexFrameY = 2;
            break;
        }
        this.sprite.pl.drawBodySprite();
      }
    }
  }

  move() {
    if (downPressed && collisionPlayer(this.realX, this.realY + this.speed, this.realW, this.realH)) {
      this.realY += this.speed;
      this.realYCenter += this.speed;
      this.y += this.speed;
      this.Y_Center += this.speed;

      this.sprite.down.x = worldToCanvas(this.X_Center, 0);
      this.sprite.down.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Down";
      this.sprite.down.update();
    } else if (upPressed && collisionPlayer(this.realX, this.realY - this.speed, this.realW, this.realH)) {
      this.y -= this.speed;
      this.realY -= this.speed;
      this.realYCenter -= this.speed;
      this.Y_Center -= this.speed;

      this.sprite.up.x = worldToCanvas(this.X_Center, 0);
      this.sprite.up.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Up";
      this.sprite.up.update();
    }

    if (rightPressed && collisionPlayer(this.realX + this.speed, this.realY, this.realW, this.realH)) {
      this.x += this.speed;
      this.realX += this.speed;
      this.realXCenter += this.speed;
      this.X_Center += this.speed;

      this.sprite.right.x = worldToCanvas(this.X_Center, 0);
      this.sprite.right.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Right";
      this.sprite.right.update();
    } else if (leftPressed && collisionPlayer(this.realX - this.speed, this.realY, this.realW, this.realH)) {
      this.x -= this.speed;
      this.realX -= this.speed;
      this.realXCenter -= this.speed;
      this.X_Center -= this.speed;

      this.sprite.left.x = worldToCanvas(this.X_Center, 0);
      this.sprite.left.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Left";
      this.sprite.left.update();
    }


    this.XBlock = (this.realXCenter - (this.realXCenter % worldTileSize)) / worldTileSize;
    this.YBlock = (this.realYCenter - (this.realYCenter % worldTileSize)) / worldTileSize;

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

    if (reloadPending) {
      this.weapon.reload();
      if (this.weapon.isReloading()) {
        switch (this.weapon.id) {
        case 0:
          this.sprite.pl.indexFrameY = 1;
        case 2:
          this.sprite.pl.indexFrameY = 3;
          break;
        }
      }
      reloadPending = false;
    }

    this.sprite.pl.x = worldToCanvas(this.X_Center, 0);
    this.sprite.pl.y = worldToCanvas(this.Y_Center, 1);
    this.sprite.pl.update();

    if (mouseDown) {
      switch (this.weapon.id) {
        case 0:
          this.sprite.shoot.indexFrameY = 0;
          this.sprite.shoot.x = this.sprite.pl.x;
          this.sprite.shoot.y = this.sprite.pl.y;
          break;
        case 2:
          this.sprite.shoot.indexFrameY = 1;
          this.sprite.shoot.x = this.sprite.pl.x;
          this.sprite.shoot.y = this.sprite.pl.y;
          break;
      }
      this.sprite.shoot.update();

      let k1 = 6;
      let k2 = 0;
      let k3 = (canvasToWorld(sight.x, 0) - this.realXCenter);
      let k4 = (canvasToWorld(sight.y, 1) - this.realYCenter);
      let dist1 = Math.sqrt(k1*k1 + k2*k2);
      let dist2 = Math.sqrt(k3*k3 + k4*k4);
      let normLen = 2;
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
      let radius = 10;
      for (let item of weapons) {
        let dv = Math.sqrt(Math.pow(this.realX - item.x, 2) + Math.pow(this.realY - item.y, 2));
        if (dv <= radius) {
          let gun = item;
          item.pickUp();
          this.weapon.drop(gun.x, gun.y);
          this.weapon = gun;
          switch (this.weapon.id) {
            case 0:
              this.sprite.pl.indexFrameY = 0;
            case 2:
              this.sprite.pl.indexFrameY = 2;
              break;
          }
          break;
        }
      }
      pickUp = false;
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
    let degRad = Math.acos((tx - mesh[this.XBlock][this.YBlock].x) /
                 Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) +
                           Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2)));
    if (ty < mesh[this.XBlock][this.YBlock].y) {
      degRad = 2 * Math.PI - degRad;
    }
    let deg = degRad * 180 / Math.PI / 10
    let deg1 = Math.floor(deg);
    let deg2 = Math.ceil(deg) % 36;
    let vx = this.realXCenter - mesh[this.XBlock][this.YBlock].x;
    let vy = this.realYCenter - mesh[this.XBlock][this.YBlock].y;
    let blocks = [];
    if (vx > 0) {
      if (vy > 0) {
        blocks.push(mesh[this.XBlock][this.YBlock]);
        blocks.push((this.YBlock + 1 > mesh[0].length - 1 ||
                     mesh[this.XBlock][this.YBlock + 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock][this.YBlock + 1]);
        blocks.push((this.XBlock + 1 > mesh.length - 1 ||
                     mesh[this.XBlock + 1][this.YBlock].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock + 1][this.YBlock]);
        blocks.push((this.YBlock + 1 > mesh[0].length - 1 ||
                     this.XBlock + 1 > mesh.length - 1 ||
                     mesh[this.XBlock + 1][this.YBlock + 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                           mesh[this.XBlock + 1][this.YBlock + 1]);
      } else {
        blocks.push((this.YBlock - 1 < 0 ||
                     mesh[this.XBlock][this.YBlock - 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock][this.YBlock - 1]);
        blocks.push(mesh[this.XBlock][this.YBlock]);
        blocks.push((this.XBlock + 1 > mesh.length - 1 ||
                     this.YBlock - 1 < 0 ||
                     mesh[this.XBlock + 1][this.YBlock - 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                           mesh[this.XBlock + 1][this.YBlock - 1]);
        blocks.push((this.XBlock + 1 > mesh.length - 1 ||
                     mesh[this.XBlock + 1][this.YBlock].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock + 1][this.YBlock]);
      }
    } else {
      if (vy > 0) {
        blocks.push((this.XBlock - 1 < 0 ||
                     mesh[this.XBlock - 1][this.YBlock].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock - 1][this.YBlock]);
        blocks.push((this.XBlock - 1 < 0 ||
                     this.YBlock + 1 > mesh[0].length - 1 ||
                     mesh[this.XBlock - 1][this.YBlock + 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                           mesh[this.XBlock - 1][this.YBlock + 1]);
        blocks.push(mesh[this.XBlock][this.YBlock]);
        blocks.push((this.YBlock + 1 > mesh[0].length - 1 ||
                     mesh[this.XBlock][this.YBlock + 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock][this.YBlock + 1]);
      } else {
        blocks.push((this.XBlock - 1 < 0 ||
                     this.YBlock - 1 < 0 ||
                     mesh[this.XBlock - 1][this.YBlock - 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                           mesh[this.XBlock - 1][this.YBlock - 1]);
        blocks.push((this.XBlock - 1 < 0 ||
                     mesh[this.XBlock - 1][this.YBlock].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock - 1][this.YBlock]);
        blocks.push((this.YBlock - 1 < 0 ||
                     mesh[this.XBlock][this.YBlock - 1].color === 1) ? mesh[this.XBlock][this.YBlock] :
                                                                       mesh[this.XBlock][this.YBlock - 1]);
        blocks.push(mesh[this.XBlock][this.YBlock]);
      }
    }
    let visDist = [];
    for (let i = 0; i < 4; i++) {
      visDist.push(blocks[i].vision[deg1] + (blocks[i].vision[deg2] - blocks[i].vision[deg1]) * (deg - deg1));
    }
    let tempRes1 = ((blocks[3].x - this.realXCenter) * visDist[0] + (this.realXCenter - blocks[0].x) * visDist[2]) / 10;
    let tempRes2 = ((blocks[3].x - this.realXCenter) * visDist[1] + (this.realXCenter - blocks[0].x) * visDist[3]) / 10;
    let res = ((blocks[3].y - this.realYCenter) * tempRes1 + (this.realYCenter - blocks[0].y) * tempRes2) / 10;
    //let res = mesh[this.XBlock][this.YBlock].vision[deg1] + (mesh[this.XBlock][this.YBlock].vision[deg2] - mesh[this.XBlock][this.YBlock].vision[deg1]) * (deg - deg1);
    let dist = Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) +
                         Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2));
    let vx1 = canvasToWorld(sight.x) - this.realXCenter;
    let vx2 = tx - this.realXCenter;
    let vy1 = canvasToWorld(sight.y) - this.realYCenter;
    let vy2 = ty - this.realYCenter;
    let visAngle = Math.acos(((vx1) * (vx2) + (vy1) * (vy2)) /
                             (Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2)) *
                              Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2))));
    return res > dist && visAngle < Math.PI / 2;
  }
}
