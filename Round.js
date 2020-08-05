'use strict'

class Round {
  constructor(x, y, targetX, targetY, img) {
    this.img = img;
    this.ratio = 7 / 20; //w/h
    this.w = 2;
    this.h = this.w / this.ratio;
    this.x = x;
    this.y = y;
    let angle = -3 * Math.PI / 4;
    let normLen = Math.sin(angle);
    let mainLen = Math.cos(angle);
    let l1 = targetX - x;
    let l2 = targetY - y;
    let len = Math.sqrt(l1 * l1 + l2 * l2);
    let dxN = -l2 / len * normLen;
    let dyN = l1 / len * normLen;
    let dx = l1 / len * mainLen;
    let dy = l2 / len * mainLen;

    this.angle = -3 * Math.PI / 2 - Math.acos(dx / mainLen);
    if (l2 > 0) {
      if (l1 < 0) {
        this.angle = -this.angle - Math.PI;
      } else {
        this.angle = -this.angle + Math.PI;
      }
    }

    this.dxAngled = dx - dxN;
    this.dyAngled = dy - dyN;

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
