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
        this.speed=7;
        this.count=0;

    }

    update() {

      if (this.count === this.speed) {
      this.currentFrame = ++this.currentFrame % this.tickCount;
      this.srcX = this.currentFrame * this.width;
      this.srcY = this.framesY * this.height;
      this.count=0;
    } else this.count++;

    }

    drawSprite(){

      ctx.drawImage(
          this.image,
          this.srcX,
          this.srcY,
          this.width,
          this.height,
          this.x,
          this.y,
          this.width,
          this.height
      );

    }
}
