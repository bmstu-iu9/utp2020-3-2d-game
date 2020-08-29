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
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        worldToCanvas(player.x, 0),
        worldToCanvas(player.y, 1),
        this.canvasW,
        this.canvasH
    );
    ctx.restore();
  }

  drawBot(deg, x, y) {
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
