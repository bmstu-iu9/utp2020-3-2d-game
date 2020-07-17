class Sprite {
    constructor(img,srcX,srcY,srcW,srcH,x,y,framesY) {
        this.image = img;
        this.srcX=srcX;
        this.srcY=srcY;
        this.framesY=framesY;
        this.x=x;
        this.y=y;
        this.currentFrame = 0;
        this.tickCount = 9;
        this.width = srcW;
        this.height = srcH;
        this.run=false;
    }

    update() {
        this.currentFrame= ++this.currentFrame % 9;
        this.srcX=this.currentFrame * this.width;
        this.srcY=this.framesY * this.height;
        ctx.clearRect(
          this.x,
          this.y,
          this.width,
          this.height
        );
    }
    drawSprite(){
      update();
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
    stop(){
      this.run=true;
    }
    start() {
        let loop = () => {
            this.drawSprite();
            if (!this.run) window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
  }
}



var gpImage = new Image();
gpImage.src = 'playeranimation.jpg';

//let sprite = new Sprite({
  //image: gpImage,
  //srcX : 0,
  //srcY : 0,
  //srcW: 64,
  //srcH: 64,
  //x : 0,
  //y : 0,
  //framesY : 0
//})
