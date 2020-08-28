'use strict';
class Tree {
  constructor(x, y, w, h, srcX, srcY, srcW, srcH, img) {
    this.x = x; //center
    this.y = y;
    this.w = w;
    this.h = h;
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcW = srcW;
    this.srcH = srcH;
    this.img = img;
  }

  draw() {
    ctx.drawImage(this.img, this.srcX, this.srcY, this.srcW, this.srcH,
                  worldToCanvas(this.x - this.w / 2, 0), worldToCanvas(this.y - this.h / 2, 1),
                  this.w / camera.scaleX, this.h / camera.scaleY);
  }
}
