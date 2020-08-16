class Sprite {

  constructor (img, srcX, srcY, srcW, srcH, x, y, framesY, koef) {
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
    this.k = koef;
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
    let gunOffset = Math.PI / 12;
    ctx.save();
    ctx.translate(this.x, this.y);
    let deg = 3 * Math.PI / 2 + Math.acos((this.x - sight.x) / Math.sqrt(Math.pow((this.x - sight.x), 2) + Math.pow((this.y - sight.y), 2)));
    if (sight.y > this.y) {
      if (sight.x < this.x) {
        deg = -deg - 3 * Math.PI / 2;
      } else {
        deg = -deg + Math.PI / 2;
      }
    } else {
      deg -= Math.PI / 2;
    }
    ctx.rotate(deg - gunOffset);

    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        -this.canvasW / 2 + this.k,
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
