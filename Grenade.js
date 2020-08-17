'use strict';

class Grenade {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.activated = false;
    this.explode = false;
    this.checked = false;
    this.speed = 0;
    this.dx = 0;
    this.dy = 0;
    //this.firstAnimTime = 0;
    this.animRadius = 10;
    this.transparency = 1;
  }

  update() {  //доработать физику скорости и отскоков от препятствий
    if (this.explode) {
      this.clouds.forEach(cloud => {
        cloud.update();
      });

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
      if (!this.speed) {
        this.x = player.x;
        this.y = player.y;
        grenades.add(this);
      }
      this.explode = true;
      this.clouds = [];
      this.clouds.push(new Cloud(this.x + 10, this.y + 5, Math.cos(-Math.PI / 4), Math.sin(-Math.PI / 4),
                                 0.05, 2, "49, 49, 49", 1, 1));
      this.clouds.push(new Cloud(this.x + 5, this.y + 10, Math.cos(Math.PI / 6), Math.sin(Math.PI / 6),
                                 0.05, 4, "208, 208, 208", 1, 3));
      this.clouds.push(new Cloud(this.x + 1, this.y + 3, Math.cos(Math.PI), Math.sin(Math.PI),
                                 0.07, 4, "208, 208, 208", 1, 3));
      this.clouds.push(new Cloud(this.x + 3, this.y + 6, Math.cos(-3 * Math.PI / 4), Math.sin(- 3 * Math.PI / 4),
                                 0.07, 4, "208, 208, 208", 1, 2.5));
      this.clouds.push(new Cloud(this.x + 3, this.y + 6, Math.cos(-Math.PI / 2), Math.sin(-Math.PI / 2),
                                 0.07, 5, "49, 49, 49", 1, 2.5));
      this.clouds.push(new Cloud(this.x + 3, this.y + 6, Math.cos(3 * Math.PI / 4), Math.sin(3 * Math.PI / 4),
                                 0.03, 4, "49, 49, 49", 1, 2))
      this.clouds.push(new Cloud(this.x + 3, this.y + 6, Math.cos(3 * Math.PI / 4), Math.sin(3 * Math.PI / 4),
                                 0.07, 4, "208, 208, 208", 1, 4));
      this.clouds.push(new Cloud(this.x + 3, this.y + 6, Math.cos(0), Math.sin(0),
                                 0.05, 4, "208, 208, 208", 1, 3));
      this.clouds.push(new Cloud(this.x + 3, this.y + 6, Math.cos(-3 * Math.PI / 4), Math.sin(- 3 * Math.PI / 4),
                                 0.07, 4, "192, 192, 192", 1, 4.5));
      this.clouds.push(new Cloud(this.x + 7, this.y + 2, Math.cos(-Math.PI), Math.sin(-Math.PI),
                                 0.1, 4, "192, 192, 192", 1, 4.5));
      this.clouds.push(new Cloud(this.x + 8, this.y + 8, Math.cos(0), Math.sin(0),
                                 0.09, 4, "192, 192, 192", 1, 4.5))

      setTimeout(() => {
        grenades.delete(this);
      }, Grenade.animTime * 1000);
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
      this.clouds.forEach(cloud => {
        cloud.draw();
      });

      if (!this.count){
      this.count = 1;
      let step = 0.6;
      let x = this.x + Grenade.width;
      let y = this.y + Grenade.height;

      for (let pxY = y - this.animRadius; pxY < y + this.animRadius; pxY += step) {
        for (let pxX = x - this.animRadius; pxX < x + this.animRadius; pxX += step){
          let dist = Math.sqrt(Math.pow(pxX - x, 2) + Math.pow(pxY - y, 2));
          if (Math.random() < 0.8) {
            if (dist < this.animRadius / 2) {
              ctx.beginPath();
              ctx.fillStyle = "red";
              ctx.fillRect(worldToCanvas(pxX, 0), worldToCanvas(pxY, 1), 1, 1);
              ctx.closePath();
            } else if (dist < this.animRadius) {
              ctx.beginPath();
              ctx.fillStyle = "orange";
              ctx.fillRect(worldToCanvas(pxX, 0), worldToCanvas(pxY, 1), 1, 1);
              ctx.closePath();
            }
          }
        }
      }
    }
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

class Cloud {
  constructor(x, y, dx, dy, speed, r, color, transparency, time) {
    this.x = x;
    this.y = y;
    this.dx = dx * speed;
    this.dy = dy * speed;
    this.r = r;
    this.color = color;
    this.animTime = time;
    this.transparency = transparency;
    this.dtTransparency = 1 / (this.animTime * 60 / transparency);
    let lastRadius = 7;
    this.dtRadius = 0.3 / (this.animTime * 60 / (this.r - lastRadius));
    this.shapeOffset = 0;
    this.lastShapeOffset = performance.now();
    this.deltaShapeOffset = 0.06;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.transparency -= this.dtTransparency;
    if (this.transparency < 0){
      this.transparency = 0;
    }
    this.r -= this.dtRadius;
    let now = performance.now();
    if (this.deltaShapeOffset < (now - this.lastShapeOffset) / 1000) {
      this.shapeOffset += 1;
      this.lastShapeOffset = now;
    }
  }

  draw() {
    let step = 0.3;
    for (let pxY = this.y - this.r; pxY < this.y + this.r; pxY += step) {
      for (let pxX = this.x - this.r; pxX < this.x + this.r; pxX += step){
        let dist = Math.sqrt(Math.pow(pxX - this.x, 2) + Math.pow(pxY - this.y, 2)) +
                   Math.random() * this.shapeOffset;
        if (dist < this.r){
          if (pxY < this.y){
            if (Math.random() > 0.1) {
              //ctx.fillStyle = "rgb(192, 192, 192)";
              ctx.fillStyle = `rgba(${this.color}, ${this.transparency})`;
            } else {
              ctx.fillStyle = `rgba(192, 192, 192, ${this.transparency})`;
            }
          } else {
            if (Math.random() > 0.9) {
              //ctx.fillStyle = "rgb(192, 192, 192)";
              ctx.fillStyle = `rgba(${this.color}, ${this.transparency})`;
            } else {
              ctx.fillStyle = `rgba(192, 192, 192, ${this.transparency})`;
            }
          }
          ctx.fillRect(worldToCanvas(pxX, 0), worldToCanvas(pxY, 1), 1, 1);
        }
      }
    }
  }
}

Grenade.maxSpeed = 5;
Grenade.maxTime = 2; //sec
Grenade.image = images["grenade"];
Grenade.width = 4;
Grenade.height = 4;
Grenade.explosionTime = 5; //sec
Grenade.animTime = 4; //sec
Grenade.explosionRadius = 20;
Grenade.damage = 2;
