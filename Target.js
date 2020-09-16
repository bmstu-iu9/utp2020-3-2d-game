class Target {
  constructor(X, Y, P, I) {
    this.x = X;
    this.y = Y;
    this.initialX = X;
    this.initialY = Y;
    this.point = P;
    this.r = 18;
    this.route = null;
    this.routeP = 0;
    this.hp = 2;
    this.lastUpd = 0;
    this.st = 0;
    // 0 - ожидание
    // 1 - движение в укрытие
    // 2 - атака
    // 3 - отступление
    // 4 - поиск игрока
    // 5 - возвращение
    // 6 - возвращение в радиус действия
    this.visible = false;
    this.alive = true;
    this.speed = player.speed;
    this.turnSpeed = 0;
    this.turning = false;
    this.dx = 0;
    this.dy = 0;
    this.sx = 0;
    this.sy = 0;
    this.weapon = new Weapon(0);
    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;
    this.initXBlock = (X - (X % worldTileSize)) / worldTileSize;
    this.initYBlock = (Y - (Y % worldTileSize)) / worldTileSize;
    this.sightX = 0;
    this.sightY = 0;
    this.expSightX = 0;
    this.expSightY = 0;
    this.plwalkXBlock = 0;
    this.plwalkXBlock = 0;
    this.plUpdX = 0;
    this.plUpdY = 0;
    this.plUpdSX = 0;
    this.plUpdSY = 0;
    this.wX = this.x;
    this.wY = this.y + 9;
    this.shootSightX = this.x + 30;
    this.shootSightY = this.wY;
    this.seesPlayer = false;
    this.lastPlTime = 0;
    this.moving = false;
    this.priority = 0;
    this.onPosition = false;
    this.knowPlPos = false;
    this.underAttack = false;
    this.shooting = false;
    this.justShooted = false;
    this.lastTimeSeen = 0;
    this.upd = true;
    this.index = I;
    switch (I) {
      case 0:
      let sprite = {
        bot : new Sprite(images["bot1"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(0, 0), worldToCanvas(0, 1), [0,1]),
        shoot : new Sprite(images["botshoot"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(0, 0), worldToCanvas(0, 1), [0]),
        right : new Sprite(images["walk_RL"], 0, 0, spriteFeetW, spriteFeetH, worldToCanvas(0, 0), worldToCanvas(0, 1), [0]),
        death : new Sprite(images["death"], 0, spriteTileH, spriteTileW, spriteTileH, worldToCanvas(0, 0), worldToCanvas(0, 1), [1]),
      };
      sprite.bot.setWorldSize(playerWidth, playerHeight);
      sprite.shoot.setWorldSize(playerWidth, playerHeight);
      sprite.death.setWorldSize(playerWidth, playerHeight);
      sprite.right.setWorldSize(FeetW, FeetH);
      this.sprite = sprite;
        break;
      case 1:
      this.upd = false;
      let sprite1 = {
        bot : new Sprite(images["bot2"], 0, 0, spriteTileW, spriteTileH, worldToCanvas(0, 0), worldToCanvas(0, 1), [0,1]),
        shoot : new Sprite(images["botshoot"], 0, spriteTileH, spriteTileW, spriteTileH, worldToCanvas(0, 0), worldToCanvas(0, 1), [1]),
        right : new Sprite(images["walk_RL"], 0, 0, spriteFeetW, spriteFeetH, worldToCanvas(0, 0), worldToCanvas(0, 1), [0]),
        death : new Sprite(images["death"], 0, spriteTileH * 2, spriteTileW, spriteTileH, worldToCanvas(0, 0), worldToCanvas(0, 1), [2]),
      };
      sprite1.bot.setWorldSize(playerWidth, playerHeight);
      sprite1.shoot.setWorldSize(playerWidth, playerHeight);
      sprite1.death.setWorldSize(playerWidth, playerHeight);
      sprite1.right.setWorldSize(FeetW, FeetH);
      this.sprite = sprite1;
        break;

    }
    this.angle = 0;
    this.w = realW;
    this.h = realH;
    this.rX = this.x - realOffsetX - this.w / 2;
    this.rY = this.y - realOffsetY - this.h / 2;

    this.shootingPause = 1000;
    this.shootingTime = 500;
    this.firstShoot = 0;
    this.lastShoot = 0;

    this.sprite.bot.x = worldToCanvas(this.x, 0);
    this.sprite.bot.y = worldToCanvas(this.y, 1);
    this.sprite.death.x = worldToCanvas(this.rX, 0);
    this.sprite.death.y = worldToCanvas(this.rY, 1);
    this.sprite.shoot.x = worldToCanvas(this.x, 0);
    this.sprite.shoot.y = worldToCanvas(this.y, 1);
    this.sprite.right.x = worldToCanvas(this.rX + realOffsetX - 3, 0);
    this.sprite.right.y = worldToCanvas(this.rY + realOffsetY + 10, 1);
    this.sprite.shoot.speed = 7;
  }

  update() {
    if (this.alive) {
      this.turn();
      if (this.upd) {
        this.analyzeSituation();
        if (this.checkPl() && performance.now() - this.lastUpd > 1000) {
          this.lastUpd = performance.now();
          this.moving = false;
          if (this.route !== null) {
            for (let node of this.route) {
              node.used = false;
            }
          }
        }
      }
      this.angle = checkAngle(
                   worldToCanvas(this.sightX, 0),
                   worldToCanvas(this.sightY, 1),
                   worldToCanvas(this.wX, 0),
                   worldToCanvas(this.wY, 1),
                   worldToCanvas(this.x, 0),
                   worldToCanvas(this.y, 1)
      )
      this.upd = !this.upd;
      switch(this.st) {
        case 1:
          this.hide();
          break;
        case 2:
          this.attack();
          break;
        case 3:
          this.retreat();
          break;
        case 4:
          this.reconnoiter();
          break;
        case 5:
          this.comeBack();
          break;
        case 6:
          this.return();
          break;
      }
      let x1 = worldToCanvas(this.x, 0);
      let y1 = worldToCanvas(this.y, 1);
      this.sprite.bot.x = x1;
      this.sprite.bot.y = y1;
      this.sprite.shoot.x = x1;
      this.sprite.shoot.y = y1;
      this.sprite.right.x = worldToCanvas(this.rX - 3, 0);
      this.sprite.right.y = worldToCanvas(this.rY + 10, 1);

      if (this.weapon.emptyMagazine() && !this.weapon.isReloading()) {
        this.weapon.reload();
        if (this.weapon.isReloading()) {
          this.sprite.bot.indexFrameY = 1;
          this.sprite.bot.currentFrame[1] = 0;
        }
      }

      if (this.moving || this.weapon.isReloading()) {
        if (!this.weapon.isReloading()) {
          this.sprite.bot.indexFrameY = 0;
          this.sprite.right.update();
        }
        this.sprite.bot.update();
      }

      if (this.shooting) {
        if (!this.weapon.isReloading()) {
          if (!this.weapon.emptyMagazine()) {
            this.sprite.shoot.update();
          }
      }
    }

    } else {
      if (this.weapon !== null) {
        controlPoints[this.point].bots -= 1;
        //this.weapon.drop(this.x, this.y);
        this.weapon = null;
      }
      let x1 = worldToCanvas(this.rX, 0);
      let y1 = worldToCanvas(this.rY, 1);
      this.sprite.death.x = x1;
      this.sprite.death.y = y1;
    }
  }

  analyzeSituation() {
    this.seesPlayer = this.vis(player.realXCenter, player.realYCenter);
    if (this.seesPlayer) {
      this.lastPlTime = performance.now();
    }
    this.seesPlayer = this.seesPlayer || performance.now() - this.lastPlTime < 200;
    if (this.seesPlayer) {
      this.knowPlPos = true;
      this.plwalkXBlock = player.walkXBlock;
      this.plwalkYBlock = player.walkYBlock;
      let angle = findAngle(player.realXCenter, player.realYCenter,
                            this.x, this.y,
                            canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1));
      this.underAttack = (angle < 1.05 && player.shooting);
    } else {
      this.underAttack = false;
    }
    if (!this.seesPlayer && player.shooting &&
        dist(controlPoints[this.point].x, player.realXCenter, controlPoints[this.point].y, player.realYCenter) < controlPoints[this.point].r * 2) {
      this.knowPlPos = true;
      this.plwalkXBlock = player.walkXBlock;
      this.plwalkYBlock = player.walkYBlock;
    }
    let oldSt = this.st;
    if (!this.moving) {
      this.priority = 0;
    }
    if (this.priority < 3) {
      if (this.priority < 1) {
        if (dist(this.x, this.initialX, this.y, this.initialY) <= 10) {
          this.st = 0;
        } else {
          this.st = 5;
        }
        if (this.knowPlPos && dist(player.realXCenter, controlPoints[this.point].x,
                                   player.realYCenter, controlPoints[this.point].y) < controlPoints[this.point].r * 1.5) {
          this.st = 4;
        }
      }
      if (this.priority < 2) {
        if (this.seesPlayer && dist(player.realXCenter, controlPoints[this.point].x,
                                   player.realYCenter, controlPoints[this.point].y) < controlPoints[this.point].r * 1.5) {
          this.priority = 1
          this.st = 2;
        }
      }
      if (dist(this.x, controlPoints[this.point].x,
               this.y, controlPoints[this.point].y) > controlPoints[this.point].r * 2) {
        this.priority = 2
        this.st = 6;
      }
      if (this.underAttack) {
        this.priority = 3;
        this.st = 1;
      }
      if (controlPoints[this.point].captured) {
        this.priority = 3;
        this.st = 3;
      }
    }
    if (this.st !== oldSt) {
      this.moving = false;
      if (this.route !== null) {
        for (let node of this.route) {
          node.used = false;
        }
      }
    }
  }

  return() {
    if (!this.moving) {
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[this.initXBlock][this.initYBlock], this);
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement(6);
    }
  }

  retreat() {
    if (!this.moving) {
      let x1 = 0;
      let y1 = 0;
      let XB = (x1 - (x1 % worldTileSize)) / worldTileSize;
      let YB = (y1 - (y1 % worldTileSize)) / worldTileSize;
      while (!mesh[XB][YB].walk || mesh[XB][YB].color !== 0) {
        let nextPoint = controlPoints[controlPoints[this.point].next];
        x1 = nextPoint.x + (Math.random() > 0.5 ? nextPoint.r * Math.random() : -nextPoint.r * Math.random());
        y1 = nextPoint.y + (Math.random() > 0.5 ? nextPoint.r * Math.random() : -nextPoint.r * Math.random());
        XB = (x1 - (x1 % worldTileSize)) / worldTileSize;
        YB = (y1 - (y1 % worldTileSize)) / worldTileSize;
      }
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[XB][YB], this);
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement(3);
    }
  }

  reconnoiter() {
    if (!this.moving) {
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[this.plwalkXBlock][this.plwalkYBlock], this);
      this.routeP = this.route.length - 1;
      this.moving = true;
      this.recon = true;
    } else {
      this.movement(4);
    }
  }

  comeBack() {
    if (!this.moving && mesh[this.initXBlock][this.initYBlock] !== mesh[this.XBlock][this.YBlock]) {
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[this.initXBlock][this.initYBlock], this);
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement(5);
    }
  }

  attack() {
    if (!this.moving) {
      this.expSightX = player.realXCenter;
      this.expSightY = player.realYCenter;
      if (dist(this.x, player.realXCenter, this.y, player.realYCenter) < 150) {
        this.onPosition = true;
      } else {
        this.onPosition = false;
      }
      if (this.onPosition) {
        if (this.checkSight() < 0.17) {
          this.shoot(this.x, this.y, this.sightX, this.sightY);
        }
      } else {
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[player.walkXBlock][player.walkYBlock], this);
        this.routeP = this.route.length - 1;
        this.moving = true;
        this.shooting = false;
      }
    } else {
      this.movement(2);
    }
  }

  hide() {
    if (!this.moving) {
      this.route = BFS(mesh[this.XBlock][this.YBlock]);
      bfscount += 1;
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement(1);
    }
  }

  movement(key) {
    if (this.moving) {
      if (this.seesPlayer) {
        this.expSightX = player.realXCenter;
        this.expSightY = player.realYCenter;
        let d = dist(this.x, player.realXCenter, this.y, player.realYCenter);
        if (d < 250) {
          let koef1 = Math.random() > 0.5 ? (Math.random() > 0.1 ? Math.random() * 15 + 40 : Math.random() * 40) :
                                            (Math.random() > 0.1 ? (Math.random() * 15 + 40) * -1 : Math.random() * -40);
          let koef2 = Math.random() > 0.5 ? (Math.random() > 0.1 ? Math.random() * 15 + 40 : Math.random() * 40) :
                                            (Math.random() > 0.1 ? (Math.random() * 15 + 40) * -1 : Math.random() * -40);

          if (this.checkSight() < 0.17 && player.vis(this.x, this.y, 0)) {
            this.singleShoot(this.x, this.y, this.sightX + koef1, this.sightY + koef2);
          } else {
            this.shooting = false;
          }
        }
      } else {
        this.expSightX = this.x + 5 * (this.route[this.routeP].x - this.x);
        this.expSightY = this.y + 5 * (this.route[this.routeP].y - this.y);
      }
      this.dx = this.speed * (this.route[this.routeP].x - this.x) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
      this.dy = this.speed * (this.route[this.routeP].y - this.y) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));

      this.x += this.dx;
      this.y += this.dy;
      this.rX += this.dx;
      this.rY += this.dy;
      this.wX += this.dx;
      this.wY += this.dy;
      this.shootSightX += this.dx;
      this.shootSightY += this.dy;

      if (Math.sqrt(Math.pow(this.x - this.route[this.routeP].x, 2) + Math.pow(this.y - this.route[this.routeP].y, 2)) <= 4) {
        if (this.routeP - 1 === -1 ||
            (key === 2 && this.seesPlayer &&
             dist(this.x, player.realXCenter, this.y, player.realYCenter) < 120) ||
            (key === 6 && dist(this.x, controlPoints[this.point].x,
                               this.y, controlPoints[this.point].y) < controlPoints[this.point].r / 2)) {
          this.moving = false;
          if (this.route !== null) {
            for (let node of this.route) {
              node.used = false;
            }
          }
          if (!(key == 2 || key === 4)) {
            if (this.routeP + 1 < this.route.length) {
              this.expSightX = this.x + 5 * (this.route[this.routeP + 1].x - this.x);
              this.expSightY = this.y + 5 * (this.route[this.routeP + 1].y - this.y);
            }
          }
          this.XBlock = (this.route[this.routeP].x - (this.route[this.routeP].x % worldTileSize)) / worldTileSize;
          this.YBlock = (this.route[this.routeP].y - (this.route[this.routeP].y % worldTileSize)) / worldTileSize;

          if (key === 4 || key === 6) {
            this.knowPlPos = false;
          } else if (key === 3) {
            controlPoints[this.point].bots -= 1;
            this.point = controlPoints[this.point].next;
            controlPoints[this.point].bots += 1;
            this.initialX = this.x;
            this.initialY = this.y;
            this.initXBlock = this.XBlock;
            this.initYBlock = this.YBlock;
          }
        } else {
          this.routeP -= 1;
          if (this.routeP + 1 < this.route.length) {
            for (let door of doors) {
              if (collisionLineRect(this.route[this.routeP + 1].x, this.route[this.routeP + 1].y,
                                    this.route[this.routeP].x, this.route[this.routeP].y,
                                    door.getX(), door.getY(),
                                    door.getX() + door.getW(), door.getY() + door.getH())) {
                if (!door.moving) {
                  door.toggle();
                }
              }
            }
            for (let gl of glass) {
              let breakGL = null;
              if (this.routeP - 3 <= - 1) {
                breakGL = collisionLineRect(this.route[this.routeP + 1].x, this.route[this.routeP + 1].y,
                                            this.route[this.routeP].x, this.route[this.routeP].y,
                                            gl.getX(), gl.getY(),
                                            gl.getX() + gl.getW(), gl.getY() + gl.getH());
              } else {
                breakGL = collisionLineRect(this.route[this.routeP + 1].x, this.route[this.routeP + 1].y,
                                            this.route[this.routeP - 3].x, this.route[this.routeP - 3].y,
                                            gl.getX(), gl.getY(),
                                            gl.getX() + gl.getW(), gl.getY() + gl.getH());
              }
              if (breakGL) {
                if (!gl.broken) {
                  this.shoot(this.x, this.y, (this.sightX + (gl.getX() + gl.getW() / 2)) / 2, (this.sightY + (gl.getY() + gl.getH() / 2)) / 2);
                } else {
                  this.shooting = false;
                }
              }
            }
          }
          if (this.routeP + 1 < this.route.length) {
            this.XBlock = (this.route[this.routeP + 1].x - (this.route[this.routeP + 1].x % worldTileSize)) / worldTileSize;
            this.YBlock = (this.route[this.routeP + 1].y - (this.route[this.routeP + 1].y % worldTileSize)) / worldTileSize;
          }
        }
      }
    }
  }

  checkPl() {
    if (dist(player.realXCenter, this.plUpdX, player.realYCenter, this.plUpdY) > 100) {
      this.plUpdX = player.realXCenter;
      this.plUpdY = player.realYCenter;
      this.plUpdSX = canvasToWorld(sight.x, 0);
      this.plUpdSY = canvasToWorld(sight.y, 1);
      return true;
    }
    if (findAngle(player.realXCenter, player.realYCenter,
                  this.plUpdSX, this.plUpdSY,
                  canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1)) > 1.5) {
      this.plUpdX = player.realXCenter;
      this.plUpdY = player.realYCenter;
      this.plUpdSX = canvasToWorld(sight.x, 0);
      this.plUpdSY = canvasToWorld(sight.y, 1);
      return true;
    }
    return false;
  }

  draw() {
    if (this.alive) {
      this.sprite.right.drawFeet(this.angle, worldToCanvas(this.x, 0), worldToCanvas(this.y, 1));
      if (this.shooting && !this.weapon.isReloading()) {
        this.sprite.shoot.drawBodySprite(this.rX, this.rY, this.angle);
      } else this.sprite.bot.drawBodySprite(this.rX, this.rY, this.angle);
    } else {
      this.sprite.death.drawSprite();
    }
  }

  singleShoot(x, y, tx, ty) {
    if (!this.justShooted) {
      this.weapon.singleShoot = true;
      let x1 = worldToCanvas(this.x, 0);
      let y1 = worldToCanvas(this.y, 1);
      let x2 = worldToCanvas(this.shootSightX, 0);
      let y2 = worldToCanvas(this.shootSightY, 1);
      let point = {
        "x" : (x2 - x1)*Math.cos(this.angle) - (y2 - y1)*Math.sin(this.angle) + x1,
        "y" : (x2 - x1)*Math.sin(this.angle) + (y2 - y1)*Math.cos(this.angle) + y1,
      }
      this.weapon.shoot(canvasToWorld(point.x, 0),
                        canvasToWorld(point.y, 1),
                        tx,
                        ty);
      this.shooting = true;
      this.lastShoot = performance.now();
      this.justShooted = true;
    } else if (performance.now() - this.lastShoot >= 1000) {
      this.weapon.singleShoot = false;
      this.justShooted = false;
      this.shooting = false;
    }
  }

  shoot(x, y, tx, ty) { //centr, prizel
    if (performance.now() - this.firstShoot < this.shootingTime) {
      let x = worldToCanvas(this.wX, 0);
      let y = worldToCanvas(this.wY, 1);
      let x1 = worldToCanvas(this.x, 0);
      let y1 = worldToCanvas(this.y, 1);
      let x2 = worldToCanvas(this.shootSightX, 0);
      let y2 = worldToCanvas(this.shootSightY, 1);
      let point1 = {
        "x" : (x - x1)*Math.cos(this.angle) - (y - y1)*Math.sin(this.angle) + x1,
        "y" : (x - x1)*Math.sin(this.angle) + (y - y1)*Math.cos(this.angle) + y1,
      }
      let point2 = {
        "x" : (x2 - x1)*Math.cos(this.angle) - (y2 - y1)*Math.sin(this.angle) + x1,
        "y" : (x2 - x1)*Math.sin(this.angle) + (y2 - y1)*Math.cos(this.angle) + y1,
      }
      this.weapon.shoot(canvasToWorld(point1.x, 0),
                        canvasToWorld(point1.y, 1),
                        canvasToWorld(point2.x, 0),
                        canvasToWorld(point2.y, 1));
      //this.weapon.shoot(x, y, tx, ty);
      this.shooting = true;
      this.lastShoot = performance.now()
    } else if (performance.now() - this.lastShoot >= this.shootingPause) {
      this.firstShoot = performance.now();
      this.shooting = false;
    }
  }

  checkSight() {
    return findAngle(this.x, this.y, this.sightX, this.sightY, this.expSightX, this.expSightY);
  }

  turn() {
    if (dist(this.sightX, this.expSightX, this.sightY, this.expSightY) <= this.turnSpeed) {
      this.sightX = this.expSightX;
      this.sightY = this.expSightY;
      this.turning = false;
    } else {
      if (!this.turning) {
        this.turnSpeed = dist(this.sightX, this.expSightX, this.sightY, this.expSightY) / 7;
        this.turning = true;
      }
      let tdx = this.turnSpeed * (this.expSightX - this.sightX) / Math.sqrt(Math.pow(this.expSightX - this.sightX, 2) + Math.pow(this.expSightY - this.sightY, 2));
      let tdy = this.turnSpeed * (this.expSightY - this.sightY) / Math.sqrt(Math.pow(this.expSightX - this.sightX, 2) + Math.pow(this.expSightY - this.sightY, 2));
      this.sightX += tdx;
      this.sightY += tdy;
    }
  }

  subHP(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      targetsCount--;
    }
  }

  vis(tx, ty) {
    let vx = (tx - this.x) / 2;
    let vy = (ty - this.y) / 2;
    let visCenterX = this.x + vx;
    let visCenterY = this.y + vy;

    let vx1 = this.sightX - this.x;
    let vx2 = tx - this.x;
    let vy1 = this.sightY - this.y;
    let vy2 = ty - this.y;
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
    return visAngle < Math.PI / 2 &&
           doorCheck &&
           player.vis(this.x, this.y, 1);
  }
}

class ControlPoint {
  constructor(X, Y, R, botNum, incid, n) {
    this.x = X;
    this.y = Y;
    this.r = R;
    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;
    this.bots = botNum;
    this.incidence = incid;
    this.captured = false;
    this.next = n;
  }

  update() {
    let captureEnable = true;
    for (let incid of this.incidence) {
      if (incid === null) {
        break;
      }
      captureEnable = captureEnable && incid.captured;
    }
    if (!this.captured &&
        this.next !== null &&
        captureEnable &&
        this.bots <= 1 &&
        Math.sqrt(Math.pow(player.realXCenter - this.x, 2) +
                  Math.pow(player.realYCenter - this.y, 2)) < this.r) {
      this.captured = true;
    }
  }
}

const findAngle = (x1, y1, x2, y2, x3, y3) => {
  let vx1 = x2 - x1;
  let vx2 = x3 - x1;
  let vy1 = y2 - y1;
  let vy2 = y3 - y1;
  let dotProduct = ((vx1) * (vx2) + (vy1) * (vy2)) /
                   (Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2)) *
                    Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2)));
  dotProduct = dotProduct > 1 ? 1 : dotProduct;
  dotProduct = dotProduct < -1 ? -1 : dotProduct;
  return Math.acos(dotProduct);
}


let checkAngle = (sightX, sightY, wX, wY, x, y) => {
  let deg = 0;
  let len1 = Math.sqrt(Math.pow(sightX - x, 2) + Math.pow(sightY - y, 2));
  let vec1 = [(sightX - x) / len1, (sightY - y) / len1];

  if (sightX < x) {
    if (sightY > y) {
      deg = Math.PI / 2 + Math.acos(vec1[1]);
    } else {
      deg = Math.PI + Math.acos(-vec1[0]);
      }
  } else {
    if (sightY > y) {
      deg = Math.acos(vec1[0]);
      } else {
      deg = 3 * Math.PI / 2 + Math.acos(-vec1[1]);
      }
    }

  let point = {
    "x" : (wX - x)*Math.cos(deg) - (wY - y)*Math.sin(deg) + x,
    "y" : (wX - x)*Math.sin(deg) + (wY - y)*Math.cos(deg) + y,
      }
  let L = Math.sqrt(Math.pow(sightX - point.x, 2) + Math.pow(sightY - point.y, 2));
  let X = (sightX - point.x) / L;
  let Y = (sightY - point.y) / L;
  deg -= Math.acos(X * vec1[0] + Y * vec1[1]);
  return deg;
}
