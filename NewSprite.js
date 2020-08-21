class Sprite {

  constructor (img, srcX, srcY, srcW, srcH, x, y, framesY) {
    this.image = img;
    this.srcX = srcX;
    this.srcY = srcY;
    this.framesY = framesY;
    this.indexFrameY = 0;
    this.x = x;
    this.y = y;
    this.currentFrame = 0;
    this.tickCount = img.width / srcW;
    this.countIndexY = img.height / srcH;
    this.width = srcW;
    this.height = srcH;
    this.speed = 5;
    this.counter = 0;
  }

  update() {
      if (this.counter === (this.speed - 1)) {
      this.currentFrame = ++this.currentFrame % this.tickCount;
      this.srcX = this.currentFrame * this.width;
      this.srcY = this.framesY[this.indexFrameY] * this.height;
    }

      this.counter = (this.counter + 1) % this.speed;
  }

  drawSprite() {
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

  drawBodySprite() {
    ctx.save();
    ctx.translate(this.x, this.y);
    let deg = 0;
    if (sight.y > this.y) {
      if (sight.x < this.x) {
        deg = Math.PI / 2 + Math.atan((this.x - sight.x) / (sight.y - this.y)) - gunOffset;
      } else {
        deg = Math.PI / 2 - Math.atan((sight.x - this.x) / (sight.y - this.y)) - gunOffset;
      }
    } else {
      if (sight.x > this.x) {
        deg = 2 * Math.PI - Math.atan((this.y - sight.y) / (sight.x - this.x)) - gunOffset;
      } else {
        deg = Math.PI + Math.atan((this.y - sight.y) / (this.x - sight.x)) - gunOffset;
      }
    }
    player.angle = deg;
    ctx.rotate(deg);
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        -this.canvasW / 2,
        -this.canvasH / 2,
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
