class Target {
  constructor(X, Y, R) {
    this.x = X;
    this.y = Y;
    this.r = R;
    this.o = 10 * R;
    this.s = 6 * R;
    this.route = null;
    this.p = 0;
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
  }

  update() {
    if (this.alive) {
      switch(this.st) {
        case 0:
        if (this.visible) {
          this.route = BFS(mesh[this.XBlock][this.YBlock]);
          bfscount += 1;
          this.p = this.route.length - 1;
          this.st = 1;
        }
        break;

        case 1:
        this.dx = this.speed * (this.route[this.p].x - this.x) / Math.sqrt(Math.pow(this.route[this.p].x - this.x, 2) + Math.pow(this.route[this.p].y - this.y, 2));
        this.dy = this.speed * (this.route[this.p].y - this.y) / Math.sqrt(Math.pow(this.route[this.p].x - this.x, 2) + Math.pow(this.route[this.p].y - this.y, 2));
        this.x += this.dx;
        this.y += this.dy;
        if (Math.sqrt(Math.pow(this.x - this.route[this.p].x, 2) + Math.pow(this.y - this.route[this.p].y, 2)) <= 2) {
          if (this.p - 1 === -1) {
            this.st = 2;
          } else {
            this.p -= 1;
          }
        }
        break;

        case 2:
        this.route = A_Star(mesh[this.XBlock][this.YBlock], mesh[player.XBlock][player.YBlock]);
        this.p = this.route.length - 1;
        this.st = 3;
        break;

        case 3:
        this.dx = this.speed * (this.route[this.p].x - this.x) / Math.sqrt(Math.pow(this.route[this.p].x - this.x, 2) + Math.pow(this.route[this.p].y - this.y, 2));
        this.dy = this.speed * (this.route[this.p].y - this.y) / Math.sqrt(Math.pow(this.route[this.p].x - this.x, 2) + Math.pow(this.route[this.p].y - this.y, 2));
        this.x += this.dx;
        this.y += this.dy;
        if (Math.sqrt(Math.pow(this.x - this.route[this.p].x, 2) + Math.pow(this.y - this.route[this.p].y, 2)) <= 2) {
          if (this.p - 1 === -1) {
            this.st = 0;
          } else {
            this.p -= 1;
          }
        }
        break;
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
    } else {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1), this.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }
  }
}
