class Target {
  constructor(X, Y, P) {
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
    this.plX = 0;
    this.plY = 0;
    this.seesPlayer = false;
    this.lastPlTime = 0;
    this.priorityRoute = false;
    this.moving = false;
    this.onPosition = false;
    this.knowPlPos = false;
    this.underAttack = false;
    this.recon = false;
  }

  update() {
    if (this.alive) {
      this.sightX = player.realXCenter;
      this.sightY = player.realYCenter;
      /*if (this.vis(player.realXCenter, player.realYCenter)) {
      //if (player.vis(this.x, this.y, 1)) {
        this.hide();
      }*/
      this.analyzeSituation();
      if (this.underAttack) {
        this.hide()
      } else {
        this.attack();
      }
      //A_Star(mesh[2][2], mesh[15][54]);
      /*if (this.priorityRoute) {
        this.movement();
      } else if (this.seesPlayer) {
        if (this.underAttack) {
          this.hide();
        } else {
          this.attack();
        }
      } else if (this.underAttack) {
        this.hide();
      } else if (this.knowPlPos) {
        //this.reconnoiter();
      } else {
        //this.comeBack();
      }*/
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

      this.plX = player.realXCenter;
      this.plY = player.realYCenter;
      let angle = findAngle(this.plX, this.plY,
                            this.x, this.y,
                            canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1));
      this.underAttack = this.underAttack || (angle < 0.939 && player.shooting); //|| angle < 0.985;
    } else {
      //this.knowPlPos = true;
      this.underAttack = false;
    }

    if (this.recon && !this.moving) {
      this.knowPlPos = false;
    }

    /*if (controlPoints[this.point].captured && !this.priorityRoute) {
      if (controlPoints[this.point].next !== null) {
        this.priorityRoute = true;
        let XB = controlPoints[controlPoints[this.point].next].XBlock;
        let YB = controlPoints[controlPoints[this.point].next].XBlock;
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[XB][YB]);
        this.routeP = this.route.length - 1;
        this.moving = true;
      } else if (!this.moving) {
        let tx = Math.random() * controlPoints[this.point].r;
        let ty = Math.random() * controlPoints[this.point].r;
        if (Math.random() > 0.5) {
          tx = controlPoints[this.point].x + tx;
        } else {
          tx = controlPoints[this.point].x - tx;
        }
        if (Math.random() > 0.5) {
          ty = controlPoints[this.point].y + ty;
        } else {
          ty = controlPoints[this.point].y - ty;
        }
        let XB = (tx - (tx % worldTileSize)) / worldTileSize;
        let YB = (ty - (ty % worldTileSize)) / worldTileSize;
        while (mesh[XB][YB].color === 1) {
          tx = Math.random() * controlPoints[this.point].r;
          ty = Math.random() * controlPoints[this.point].r;
          if (Math.random() > 0.5) {
            tx = controlPoints[this.point].x + tx;
          } else {
            tx = controlPoints[this.point].x - tx;
          }
          if (Math.random() > 0.5) {
            ty = controlPoints[this.point].y + ty;
          } else {
            ty = controlPoints[this.point].y - ty;
          }
          XB = (tx - (tx % worldTileSize)) / worldTileSize;
          YB = (ty - (ty % worldTileSize)) / worldTileSize;
        }
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[XB][YB]);
        this.routeP = this.route.length - 1;
        this.moving = true;
      } else {
        this.movement();
      }
    }
    if (!this.moving && this.priorityRoute) {
      this.priorityRoute = false;
      controlPoints[this.point].bots -= 1;
      this.point = controlPoints[this.point].next;
      controlPoints[this.point].bots += 1;
    }*/
  }

  reconnoiter() {
    if (!this.moving) {
      let XB = (this.plX - (this.plX % worldTileSize)) / worldTileSize;
      let YB = (this.plY - (this.plY % worldTileSize)) / worldTileSize;
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[XB][YB]);
      this.routeP = this.route.length - 1;
      this.moving = true;
      this.recon = true;
    } else {
      this.movement();
    }
  }

  comeBack() {
    if (!this.moving && mesh[this.initXBlock][this.initYBlock] !== mesh[this.XBlock][this.YBlock]) {
      this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[this.initXBlock][this.initYBlock]);
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement();
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
      } else {
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[player.walkXBlock][player.walkYBlock]);
        this.routeP = this.route.length - 1;
        this.moving = true;
      }
    } else {
      this.movement();
    }
  }

  hide() {
    if (!this.moving) {
      this.route = BFS(mesh[this.XBlock][this.YBlock]);
      bfscount += 1;
      this.routeP = this.route.length - 1;
      this.moving = true;
    } else {
      this.movement();
    }
  }

  movement() {
    if (this.moving) {
      //this.sightX = this.route[this.routeP].x;
      //this.sightY = this.route[this.routeP].y;
      this.dx = this.speed * (this.route[this.routeP].x - this.x) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
      this.dy = this.speed * (this.route[this.routeP].y - this.y) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
      this.x += this.dx;
      this.y += this.dy;
      if (Math.sqrt(Math.pow(this.x - this.route[this.routeP].x, 2) + Math.pow(this.y - this.route[this.routeP].y, 2)) <= 4) {
        if (this.routeP - 1 === -1) {
          this.moving = false;
        } else {
          this.routeP -= 1;
        }
      }
      this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
      this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;
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
  let vy1 = y2 - x1;
  let vy2 = y3 - x1;
  return  Math.acos(((vx1) * (vx2) + (vy1) * (vy2)) /
                    (Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2)) *
                     Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2))));
}
