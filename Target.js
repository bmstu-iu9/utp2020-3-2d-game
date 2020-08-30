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
    this.st = 0;
    // 0 - ожидание
    // 1 - движение в укрытие
    this.visible = false;
    this.alive = true;
    this.speed = player.speed;
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
    this.plwalkXBlock = 0;
    this.plwalkXBlock = 0;
    this.seesPlayer = false;
    this.lastPlTime = 0;
    this.moving = false;
    this.onPosition = false;
    this.knowPlPos = false;
    this.underAttack = false;
    this.lastTimeSeen = 0;
    this.index = I;
    this.sprite = spritesForBots[I];
    this.angle = 0;
    this.w = realW;
    this.h = realH;
    this.rX = this.x - realOffsetX - this.w / 2;
    this.rY = this.y - realOffsetY - this.h / 2;

    this.sprite.bot.x = worldToCanvas(this.x, 0);
    this.sprite.bot.y = worldToCanvas(this.y, 1);
    this.sprite.shoot.x = worldToCanvas(this.x, 0);
    this.sprite.shoot.y = worldToCanvas(this.y, 1);
    this.sprite.right.x = worldToCanvas(this.x, 0);
    this.sprite.right.y = worldToCanvas(this.y, 1);
    this.sprite.shoot.speed = 10;
  }

  update() {
    if (this.alive) {
      this.sightX = player.realXCenter;
      this.sightY = player.realYCenter;
      this.analyzeSituation();
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
      }
    } else {
      if (this.weapon !== null) {
        controlPoints[this.point].bots -= 1;
        this.weapon.drop(this.x, this.y);
        this.weapon = null;
      }
    }
  }

  analyzeSituation() {
    this.seesPlayer = this.vis(player.realXCenter, player.realYCenter);
    if (this.seesPlayer) {
      this.lastPlTime = performance.now();
    }
    if (this.seesPlayer || performance.now() - this.lastPlTime < 1000) {
      this.knowPlPos = true;
      this.plwalkXBlock = player.walkXBlock;
      this.plwalkYBlock = player.walkYBlock;
      let angle = findAngle(player.realXCenter, player.realYCenter,
                            this.x, this.y,
                            canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1));
      this.underAttack = (angle < 0.7 && player.shooting) || angle < 0.35;
    } else {
      this.underAttack = false;
    }

    if (!this.moving || !(this.st === 3 || this.st === 1)) {
      if (dist(this.x, this.initialX, this.y, this.initialY) <= 10) {
        this.st = 0;
      } else {
        this.st = 5;
      }
      if (this.knowPlPos) {
        this.st = 4;
      }
      if (this.seesPlayer) {
        this.st = 2;
      }
      if (this.underAttack) {
        this.st = 1;
      }
      if (controlPoints[this.point].captured) {
        this.st = 3;
      }
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
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[XB][YB]);
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement(3);
    }
  }

  reconnoiter() {
    if (!this.moving) {
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[this.plwalkXBlock][this.plwalkYBlock]);
      this.routeP = this.route.length - 1;
      this.moving = true;
      this.recon = true;
    } else {
      this.movement(4);
    }
  }

  comeBack() {
    if (!this.moving && mesh[this.initXBlock][this.initYBlock] !== mesh[this.XBlock][this.YBlock]) {
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[this.initXBlock][this.initYBlock]);
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement(5);
    }
  }

  attack() {
    if (!this.moving) {
      this.sightX = player.realXCenter;
      this.sightY = player.realYCenter;
      if (dist(this.x, player.realXCenter, this.y, player.realYCenter) < 100) {
        this.onPosition = true;
      } else {
        this.onPosition = false;
      }
      if (this.onPosition) {
        this.weapon.shoot(this.x, this.y, this.sightX, this.sightY);
        let x1 = worldToCanvas(this.x, 0);
        let y1 = worldToCanvas(this.y, 1);
        let x2 = worldToCanvas(player.realXCenter, 0);
        let y2 = worldToCanvas(player.realYCenter, 1);
        let deg = 0;
        if (y2 > y1) {
          if (x2 < x1) {
            deg = Math.PI / 2 + Math.atan((x1 - x2) / (y2 - y1));
          } else {
            deg = Math.PI / 2 - Math.atan((x2 - x1) / (y2 - y1));
          }
        } else {
          if (x2 > x1) {
            deg = 2 * Math.PI - Math.atan((y1 - y2) / (x2 - x1));
          } else {
            deg = Math.PI + Math.atan((y1 - y2) / (x1 - x2));
          }
        }
        this.angle = deg;
        this.sprite.shoot.x = worldToCanvas(this.x, 0);
        this.sprite.shoot.y = worldToCanvas(this.y, 1);
        this.sprite.right.x = worldToCanvas(this.x, 0);
        this.sprite.right.y = worldToCanvas(this.y, 1);
        this.sprite.shoot.update();
        this.sprite.right.update();
      } else {
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[player.walkXBlock][player.walkYBlock]);
        this.routeP = this.route.length - 1;
        this.moving = true;
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
      //this.sightX = this.route[this.routeP].x;
      //this.sightY = this.route[this.routeP].y;
      this.dx = this.speed * (this.route[this.routeP].x - this.x) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
      this.dy = this.speed * (this.route[this.routeP].y - this.y) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));

      let x1 = worldToCanvas(this.x, 0);
      let y1 = worldToCanvas(this.y, 1);
      let x2 = worldToCanvas(this.x + this.dx, 0);
      let y2 = worldToCanvas(this.y + this.dy, 1);
      let deg = 0;
      if (y2 > y1) {
        if (x2 < x1) {
          deg = Math.PI / 2 + Math.atan((x1 - x2) / (y2 - y1));
        } else {
          deg = Math.PI / 2 - Math.atan((x2 - x1) / (y2 - y1));
        }
      } else {
        if (x2 > x1) {
          deg = 2 * Math.PI - Math.atan((y1 - y2) / (x2 - x1));
        } else {
          deg = Math.PI + Math.atan((y1 - y2) / (x1 - x2));
        }
      }
      this.angle = deg;
      this.sprite.bot.x = worldToCanvas(this.x, 0);
      this.sprite.bot.y = worldToCanvas(this.y, 1);
      this.sprite.right.x = worldToCanvas(this.x, 0);
      this.sprite.right.y = worldToCanvas(this.y, 1);
      this.sprite.bot.update();
      this.sprite.right.update();

      this.x += this.dx;
      this.y += this.dy;
      this.rX += this.dx;
      this.rY += this.dy;
      if (Math.sqrt(Math.pow(this.x - this.route[this.routeP].x, 2) + Math.pow(this.y - this.route[this.routeP].y, 2)) <= 4) {
        if (this.routeP - 1 === -1) {
          this.moving = false;

          this.XBlock = (this.route[this.routeP].x - (this.route[this.routeP].x % worldTileSize)) / worldTileSize;
          this.YBlock = (this.route[this.routeP].y - (this.route[this.routeP].y % worldTileSize)) / worldTileSize;

          if (key === 4) {
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
          this.XBlock = (this.route[this.routeP + 1].x - (this.route[this.routeP + 1].x % worldTileSize)) / worldTileSize;
          this.YBlock = (this.route[this.routeP + 1].y - (this.route[this.routeP + 1].y % worldTileSize)) / worldTileSize;
        }
      }
    }
  }

  draw(scale) {
    if (this.alive) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1), this.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(worldToCanvas(this.sightX, 0), worldToCanvas(this.sightY, 1), 3, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1), this.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }
    /*if (this.alive) {
      if (!this.underAttack && this.onPosition) {
        this.sprite.shoot.drawBot(this.angle, this.rX, this.rY);
        this.sprite.right.drawBot(this.angle, this.rX + 20, this.rY + 20);
      }
      else {
        if (this.moving) {
          this.sprite.bot.drawBot(this.angle, this.rX, this.rY);
          this.sprite.right.drawBot(this.angle, this.rX + 20, this.rY + 20);
      }
    }
  }*/
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
  return  Math.acos(((vx1) * (vx2) + (vy1) * (vy2)) /
                    (Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2)) *
                     Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2))));
}
