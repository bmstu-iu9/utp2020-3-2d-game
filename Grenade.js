'use strict';

class Grenade {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.activated = false;
    this.explode = false;
    this.speed = 0;
    this.dx = 0;
    this.dy = 0;
    this.firstAnimTime = 0;
  }

  static maxSpeed = 5;
  static maxTime = 2; //sec
  static image = images["grenade"];
  static width = 4;
  static height = 4;
  static explosionTime = 5; //sec
  static animTime = 1; //sec

  update() {  //доработать физику скорости и отскоков от препятствий
    if (this.explode) {
      setTimeout(() => {
        grenades.delete(this);
      }, Grenade.animTime * 1000);
    } else {
      this.x += this.dx * this.speed;
      this.y += this.dy * this.speed;
      this.speed *= 0.95;  //как-то назвать переменную
    }
  }

  throw(x, y, targetX, targetY, time) {
    grenades.add(this);
    this.x = x;
    this.y = y;
    let realTime = Math.min(time, Grenade.maxTime);
    this.speed = Grenade.maxSpeed * realTime / Grenade.maxTime;
    let k1 = targetX - x;
    let k2 = targetY - y;
    let dist = Math.sqrt(k1 * k1 + k2 * k2);
    this.dx = k1 / dist;
    this.dy = k2 / dist;
  }

  activate() {
    this.activated = true;
    setTimeout(() => {
      this.explode = true;
      if (!grenades.has(this)) {
        this.x = player.x;
        this.y = player.y;
        grenades.add(this);
      }
    }, Grenade.explosionTime * 1000);
  }

  isActivated() {
    return this.activated;
  }

  exploded() {
    return this.explode;
  }

  draw() {
    if (this.explode) {
      ctx.beginPath();
      ctx.arc(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1), Grenade.width / 2 / camera.scaleX, 0, 2 * Math.PI, false);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.drawImage(Grenade.image, 0, 0, Grenade.image.naturalWidth, Grenade.image.naturalHeight,
                    worldToCanvas(this.x, 0), worldToCanvas(this.y, 1),
                    Grenade.width / camera.scaleX, Grenade.height / camera.scaleY);
    }
  }

  static drawProgress(x, y, r, time) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "blue";
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.arc(x, y, r + 1.25, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 2;
    let angle = 2 * Math.PI * (performance.now() - time) / 1000 / Grenade.maxTime;
    angle = Math.min(angle, 2 * Math.PI);
    ctx.arc(x, y, r, 0, angle, false);
    ctx.stroke();
    ctx.closePath();
  }
}
