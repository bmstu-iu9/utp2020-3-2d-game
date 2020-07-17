'use strict'
class Vector {
  constructor(direction,speed){
    this.setDirection(direction, speed);
  }
  setDirection(direction,speed){
    this.direction=direction;
    this.speed=speed;
    this.x=0;
    this.y=0;
    switch (direction) {
      case "Up":
          this.y=-speed;
        break;
       case "Down" :
          this.y+=speed;
        break;
       case "Left" :
            this.x=-speed;
          break;
        case "Right" :
            this.x+=speed;
          break;

    }
  }
}
var pl=new Player(100,100,0.5,
sprite{
  up : new Sprite(gpImage,0,64*8,64,64,pl.x,pl.y,8),
  down : new Sprite(gpImage,0,64*10,64,64,pl.x,pl.y,10),
  left : new Sprite(gpImage,0,64*9,64,64,pl.x,pl.y,9),
  right : new Sprite(gpImage,0,64*11,64,64,pl.x,pl.y,11),
})
class Player {
  constructor(x, y, speed,sprite) {
    this.x=x;
    this.y=y;
    this.sprite=sprite;
    this.speed=speed;
    this.direction="Down";
    //this.vec=new Vector("Down",0);
    this.isFiring=false;
  }
  move(){
    if (this.direction == "Down"){
      ctx.drawImage(
          this.sprite.down.image,
          this.sprite.down.srcX,
          this.sprite.down.srcY,
          this.sprite.down.width,
          this.sprite.down.height,
          this.x,
          this.y,
          this.sprite.down.width,
          this.sprite.down.height
      );
      //this.sprite.down.start();
      //this.sprite.run=true;
    } else{
      if (downPressed){
        this.y+=speed;
        this.sprite.down.y=this.y;
        if (this.sprite.down.run == true) this.sprite.down.run=false;
        this.sprite.down.start();
      } else{
        if (downPressed===false){
          this.sprite.down.stop();
        }
      }
        if (upPressed){
          this.y-=speed;
          this.sprite.up.y=this.y;
          if (this.sprite.up.run == true) this.sprite.up.run=false;
          this.sprite.up.start();
        } else{
          if (upPressed===false){
            this.sprite.up.stop();
          }
        }
          if (rightPressed){
            this.x+=speed;
            this.sprite.right.x=this.x;
            if (this.sprite.right.run == true) this.sprite.right.run=false;
            this.sprite.right.start();
          } else{
            if (rightPressed===false){
              this.sprite.right.stop();
            }
          } if (leftPressed){
            this.x-=speed;
            this.sprite.left.x=x;
            if (this.sprite.left.run == true) this.sprite.left.run=false;
            this.sprite.left.start();
          } else{
            if (leftPressed===false){
              this.sprite.left.stop();
            }
          }
          }
        }
  //walk(direction){
    //this.vec.setDirection(direction,this.speed);
    //this.view=this.animations["walk" + direction];
    //this.view.run();
  //}
  //stand(direction){
    //this.vec.setDirection(direction,0);
    //this.view = this.animations("walk" + direction);
    //this.view.stop();
  //}
  //update(time){
    //if (this.lastTime===0){
      //this.lastTime=time;
      //return;
    //}
    //this.x += (time - this.lastTime) * (this.vec.x / 1000);
    //this.y += (time - this.lastTime) * (this.vec.y / 1000);
    //this.lastTime=time;
    //this.view.setXY(Math.trunc(this.x),Math.trunc(this.y));
    //this.view.update(time);
  //}
}
