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
    //this.widthW = this.width * (1 / camera.scaleX); оставил на всякий случай
    this.widthW = this.width;
    this.heightW = this.height;
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
        this.widthW,
        this.heightW
    );
  }

  drawBodySprite() {
    let x = worldToCanvas(player.weaponX, 0);
    let y = worldToCanvas(player.weaponY, 1);
    ctx.save();
    ctx.translate(this.x, this.y);
    let deg = 3 * Math.PI / 2 + Math.acos((x - sight.x) / Math.sqrt(Math.pow((x - sight.x), 2) + Math.pow((y - sight.y), 2)));
    if (sight.y > y) {
      if (sight.x < x) {
        deg = -deg - 3 * Math.PI / 2;
      } else {
        deg = -deg + Math.PI / 2;
      }
    } else {
      deg -= Math.PI / 2;
    }
    ctx.rotate(deg);

    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        -this.widthW / 2 + this.k,
        -this.heightW / 2,
        this.widthW,
        this.heightW
    );

    ctx.restore();
  }
}
