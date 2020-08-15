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
    this.w_World = width;
    this.h_World = height;
    this.w = this.w_World * (1 / camera.scaleX);  //размеры на канвасе
    this.h = this.h_World; //
    this.X_Center = this.x + this.w_World/2; // координаты центра в мире
    this.Y_Center = this.y + this.h_World/2;
    this.weaponX = this.X_Center - (this.w_World / 4); // координаты в мире
    this.weaponY = this.Y_Center + (this.h_World / 8);
    this.radius = 5;
    this.sprite = sprite;
    this.speed = speed;
    this.prevDirect = "Down";
    this.direction = "Left";
    this.hp = 2;
    this.dead = false;
    this.fire = false;
    this.weapon = new Weapon(2);
    this.grenades = new Array(new Grenade(0, 0), new Grenade(0, 0));

    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
    this.sprite.shoot.speed = 10;
    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;
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
    if (this.fire) {
      if (!this.weapon.emptyMagazine()) {
        this.sprite.shoot.drawBodySprite();
      } else {
        this.sprite.pl.drawBodySprite();
      }
    }

    if (!this.fire) {
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
    if ((downPressed) && (collisionPlayer(this.x, this.y + this.speed, this.w_World, this.h_World))) {
      if (this.y < images["map"].naturalHeight) {
        this.y += this.speed;
        this.weaponY += this.speed;
        this.Y_Center += this.speed;
        // временный костыль, связанный с недоработкой сетки навигации
        if (this.y >= images["map"].naturalHeight) {
          this.y = images["map"].naturalHeight - 1;
          this.weaponY -= this.speed - 1;
          this.Y_Center -= this.speed - 1;
        }
        //
      }
      this.sprite.down.x = worldToCanvas(this.x, 0);
      this.sprite.down.y = worldToCanvas(this.y, 1);
      this.direction = "Down";
      this.sprite.down.update();
    } else if (upPressed && (collisionPlayer(this.x, this.y - this.speed, this.w_World, this.h_World))) {
      if (this.y !== 0) {
        this.y -= this.speed;
        this.Y_Center -= this.speed;
        this.weaponY -= this.speed;
      }
      this.sprite.up.x = worldToCanvas(this.x, 0);
      this.sprite.up.y = worldToCanvas(this.y, 1);
      this.direction = "Up";
      this.sprite.up.update();
    }

    if (rightPressed && (collisionPlayer(this.x + this.speed, this.y, this.w_World, this.h_World))) {
      if (this.x < images["map"].naturalWidth) {
        this.x += this.speed;
        this.X_Center += this.speed;
        this.weaponX += this.speed;
        if (this.x >= images["map"].naturalWidth) {
          this.x = images["map"].naturalWidth - 1;
          this.X_Center -= this.speed - 1;
          this.weaponX -= this.speed - 1;
        }
      }
      this.sprite.right.x = worldToCanvas(this.x, 0);
      this.sprite.right.y = worldToCanvas(this.y, 1);
      this.direction = "Right";
      this.sprite.right.update();
    } else if (leftPressed && (collisionPlayer(this.x - this.speed, this.y, this.w_World, this.h_World))) {
      if (this.x !== 0) {
        this.x -= this.speed;
        this.weaponX -= this.speed;
        this.X_Center -= this.speed;
      }
      this.sprite.left.x = worldToCanvas(this.x, 0);
      this.sprite.left.y = worldToCanvas(this.y, 1);
      this.direction = "Left";
      this.sprite.left.update();
    }


    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;

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
          grenade.throw(this.x, this.y,
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

    this.sprite.pl.x = worldToCanvas(this.x, 0);
    this.sprite.pl.y = worldToCanvas(this.y, 1);
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

      let k1 = 12.5;
      let k2 = 0;
      let k3 = (canvasToWorld(sight.x, 0) - this.x);
      let k4 = (canvasToWorld(sight.y, 1) - this.y);
      let dist1 = Math.sqrt(k1*k1 + k2*k2);
      let dist2 = Math.sqrt(k3*k3 + k4*k4);
      let normLen = 3;
      let normX = -k4 / dist2 * normLen;
      let normY = k3 / dist2 * normLen;

      this.fire = this.weapon.shoot(
                  this.x + (canvasToWorld(sight.x, 0) - this.x) * dist1 / dist2 + normX,
                  this.y + (canvasToWorld(sight.y, 1) - this.y) * dist1 / dist2 + normY,
                  canvasToWorld(sight.x, 0) + normX, canvasToWorld(sight.y, 1) + normY);
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
    let degRad = Math.acos((tx - mesh[this.XBlock][this.YBlock].x) /
                 Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) +
                 Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2)));
    if (ty < mesh[this.XBlock][this.YBlock].y) {
      degRad = 2 * Math.PI - degRad;
    }
    let deg = degRad * 180 / Math.PI / 10
    let deg1 = Math.floor(deg);
    let deg2 = Math.ceil(deg) % 36;
    let vx = this.x - mesh[this.XBlock][this.YBlock].x;
    let vy = this.y - mesh[this.XBlock][this.YBlock].y;
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
    let tempRes1 = ((blocks[3].x - this.x) * visDist[0] + (this.x - blocks[0].x) * visDist[2]) / 10;
    let tempRes2 = ((blocks[3].x - this.x) * visDist[1] + (this.x - blocks[0].x) * visDist[3]) / 10;
    let res = ((blocks[3].y - this.y) * tempRes1 + (this.y - blocks[0].y) * tempRes2) / 10;
    let dist = Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) +
                         Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2));
    return res > dist;
  }
}
