'use strict';

class Sprite {

  constructor (img, srcX, srcY, srcW, srcH, x, y, framesY) {
    this.image = img;
    this.srcX = srcX;
    this.srcY = srcY;
    this.framesY = framesY;
    this.indexFrameY = 0;
    this.x = x;
    this.y = y;
    this.currentFrame = [];
    this.tickCount = img.width / srcW;
    this.countIndexY = img.height / srcH;
    this.width = srcW;
    this.height = srcH;
    this.speed = 5;
    this.counter = 0;
    for (let i = 0; i!=framesY.length; i++){
      this.currentFrame[i] = 0;
    }
  }

  update() {
      if (this.counter === (this.speed - 1)) {
      this.currentFrame[this.indexFrameY] = ++this.currentFrame[this.indexFrameY] % this.tickCount;
      this.srcX = this.currentFrame[this.indexFrameY] * this.width;
      this.srcY = this.framesY[this.indexFrameY] * this.height;
    }

      this.counter = (this.counter + 1) % this.speed;
  }

  reverseUpdate() {
    this.srcX -= this.width;
    this.srcY = this.framesY[this.indexFrameY] * this.height;
    if (this.srcX < 0) this.srcX = 0;
  }

  drawSprite() {
    this.setWorldSize(this.worldW, this.worldH);
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.canvasW,
        this.canvasH
    );
  }

  drawFeet(deg, x, y) {
    this.setWorldSize(this.worldW, this.worldH);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(deg);
    ctx.translate(-x, -y);
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.canvasW,
        this.canvasH
    );
    ctx.restore();
  }

  drawBodySprite(x, y, deg) {
    this.setWorldSize(this.worldW, this.worldH);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(deg);
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
          this.image,
          this.srcX,
          this.srcY,
          this.width,
          this.height,
          worldToCanvas(x, 0),
          worldToCanvas(y, 1),
          this.canvasW,
          this.canvasH
        );
    ctx.restore();
  }

  setWorldSize(W , H) {
    this.worldW = W;
    this.worldH = H;
    this.canvasW = W * (1 / camera.scaleX);
    this.canvasH = H * (1 / camera.scaleY);
  }

}
