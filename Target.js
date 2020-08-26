class Target {
  constructor(X, Y, P) {
    this.x = X;
    this.y = Y;
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
    this.sightX = 0;
    this.sightY = 0;
  }

  update() {
    if (this.alive) {
      /*switch(this.st) {
        case 0:
        if (this.visible) {
          this.route = BFS(mesh[this.XBlock][this.YBlock]);
          bfscount += 1;
          this.routeP = this.route.length - 1;
          this.st = 1;
        }
        break;

        case 1:
        this.dx = this.speed * (this.route[this.routeP].x - this.x) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
        this.dy = this.speed * (this.route[this.routeP].y - this.y) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
        this.x += this.dx;
        this.y += this.dy;
        if (Math.sqrt(Math.pow(this.x - this.route[this.routeP].x, 2) + Math.pow(this.y - this.route[this.routeP].y, 2)) <= 2) {
          if (this.routeP - 1 === -1) {
            this.st = 2;
          } else {
            this.routeP -= 1;
          }
        }
        break;

        case 2:
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[player.XBlock][player.YBlock]);
        this.routeP = this.route.length - 1;
        this.st = 3;
        break;

        case 3:
        this.dx = this.speed * (this.route[this.routeP].x - this.x) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
        this.dy = this.speed * (this.route[this.routeP].y - this.y) / Math.sqrt(Math.pow(this.route[this.routeP].x - this.x, 2) + Math.pow(this.route[this.routeP].y - this.y, 2));
        this.x += this.dx;
        this.y += this.dy;
        if (Math.sqrt(Math.pow(this.x - this.route[this.routeP].x, 2) + Math.pow(this.y - this.route[this.routeP].y, 2)) <= 2) {
          if (this.routeP - 1 === -1) {
            this.st = 0;
          } else {
            this.routeP -= 1;
          }
        }
        break;
      }*/
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

    let vx1 = canvasToWorld(this.sightX, 0) - this.x;
    let vx2 = tx - this.x;
    let vy1 = canvasToWorld(this.sightY, 1) - this.y;
    let vy2 = ty - this.y;
    let visAngle = Math.acos(((vx1) * (vx2) + (vy1) * (vy2)) /
                              (Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2)) *
                               Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2))));
    let doorCheck = true;
    for (let door of doors) {
      doorCheck = doorCheck && !collisionLineRect(player.realXCenter, player.realYCenter,
                                                  tx, ty,
                                                  door.getX(), door.getY(),
                                                  door.getX() + door.getW(), door.getY() + door.getH());
    }
    return visAngle < Math.PI / 2 &&
           doorCheck &&
           vision(visCenterX, visCenterY, tx, ty) &&
           vision(visCenterX, visCenterY, this.x, this.y);
  }
}

class ControlPoint {
  constructor(X, Y, R, botNum, incid, n) {
    this.x = X;
    this.y = Y;
    this.r = R;
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
        this.bots <= 0 &&
        Math.sqrt(Math.pow(player.realXCenter - this.x, 2) +
                  Math.pow(player.realYCenter - this.y, 2)) < this.r) {
      this.captured = true;
    }
  }
}
