'use strict'

class Round {
  constructor(x, y, targetX, targetY, img) {
    this.img = img;
    this.ratio = 7 / 20; //w/h
    this.w = 1;
    this.h = this.w / this.ratio;
    this.deleteTime = performance.now() + 6 * 1000; //патрон лежит 6 секунд
    this.x = x;
    this.y = y;
    let angle = 3 * Math.PI / 4;
    let l1 = targetX - x;
    let l2 = targetY - y;
    let len = Math.sqrt(l1 * l1 + l2 * l2);
    let dx = l1 / len;
    let dy = l2 / len;

    this.angle = -3 * Math.PI / 2 - Math.acos(dx);
    if (l2 > 0) {
      if (l1 < 0) {
        this.angle = -this.angle - Math.PI;
      } else {
        this.angle = -this.angle + Math.PI;
      }
    }

    let v = rotate(dx, dy, angle);
    this.dxAngled = v.x;
    this.dyAngled = v.y;

    this.len = 10;
  }
  update() {
    if (this.len >= 0){
      this.x += this.dxAngled;
      this.y += this.dyAngled;
      this.len--;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1));
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height,
                            0, 0, this.w / camera.scaleX , this.h / camera.scaleY);

    ctx.restore();
  }

}
