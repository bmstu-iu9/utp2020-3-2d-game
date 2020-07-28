class Sprite {

  constructor (img, srcX, srcY, srcW, srcH, x, y, framesY) {
    this.image = img;
    this.srcX = srcX;
    this.srcY = srcY;
    this.framesY = framesY;
    this.x = x;
    this.y = y;
    this.currentFrame = 0;
    this.tickCount = 9;
    this.width = srcW;
    this.height = srcH;
    this.run = false;
    this.speed = 5;
    this.counter = 0;
  }

  update() {
      if (this.counter === (this.speed - 1)) {
      this.currentFrame = ++this.currentFrame % this.tickCount;
      this.srcX = this.currentFrame * this.width;
      this.srcY = this.framesY * this.height;
    }

      this.counter = (this.counter + 1) % this.speed;
  }

  drawSprite() {
    ctx.save();
    ctx.translate(this.x, this.y);
    let deg = 3 * Math.PI / 2 + Math.acos((this.x - sight.x) / Math.sqrt(Math.pow((this.x - sight.x), 2) + Math.pow((this.y - sight.y), 2)));
    if (sight.y > this.y) {
      if (sight.x < this.x) {
        deg = -deg - Math.PI;
      } else {
        deg = -deg + Math.PI;
      }
    }
    ctx.rotate(deg);

    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        -this.width / 2,
        -this.height / 2 - spriteHKoef,
        this.width,
        this.height
    );

    ctx.restore();
  }
}
