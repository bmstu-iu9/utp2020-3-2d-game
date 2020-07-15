'use strict'
export class Sprite{
  constructor({imgName,sX,sY,w=64,h=64}){
    this.imgName=imgName;
    this.sX=sX;
    this.sY=sY;
    this.w=w;
    this.h=h;
    this.x=0;
    this.y=0;
  }
  setXandY(x,y){
    this.x=x;
    this.y=y;
  }
}
export class Anime extends Sprite{
  constructor({imgName,frames,speed,repeat=true,auto=true,w=64,h=64}){
    super({
      imgName : imgName,
      sX : frames[0].sX,
      sY : frames[0].sY,
      w : w,
      h : h
    });
    this.frames=frames;
    this.speed=speed;
    this.repeat=repeat;
    this.run=auto;
    this.lastTime=0;
    this.currentFrame=0;
    this.totalFrames=this.frames.length;
    this.onEnd=null;
  }
  setFrame(ind){
    this.currentFrame=ind;
    this.sX=this.frames[ind].sX;
    this.sY=this.frames[ind].sY;
  }
  run(){
    if (!this.run){
      this.setFrame(0);
      this.run=true;
    }
  }
  stop(){
    this.run=false;
  }
  nextFrame(){
    if ((this.currentFrame + 1)==this.totalFrames){
      if (this.onEnd){
        this.onEnd();
      }
      if(this.repeat){
        this.setFrame(0);
        return;
      }
      this.stop();
      return;
    }
    this.setFrame(this.currentFrame + 1);
  }
  update(time){
    if (!this.run){
      return;
    }
    if (this.lastTime == 0){
      this.lastTime=time;
      return;
    }
    if ((time - this.lastTime) > this.speed){
      this.nextFrame();
      this.lastTime=time;
    }
  }
}
export class SpriteSheet {
  constructor({imgName,imgW,imgH,spriteW=64,spriteH=64}){
    this.imgName=imgName;
    this.imgW=imgW;
    this.imgH=imgH;
    this.spriteW=spriteW;
    this.spriteH=spriteH;
  }
  getAnime(inds,speed,repeat=true,auto=true){
    return new Anime({
      imgName : this.imgName,
      frames : inds.map(ind => ({
        sX: this.getSX(ind),
        sY: this.getSY(ind)
      })),
      speed : speed,
      repeat : repeat,
      auto : auto,
      w : this.spriteW,
      h : this.spriteH
    });
  }
  getSprite(ind){
    return new Sprite({
      imgName : this.imgName,
      sX : this.getSX(ind),
      sY : this.getSY(ind),
      w : this.spriteW,
      h : this.spriteH
    });
  }
  getSX(ind){
    return (--ind * this.spriteW) % this.imgW;
  }
  getSY(ind){
    return Math.trunc((--ind * this.spriteW) / this.imgW) * this.spriteH;
  }

}
export class CharacterSheet extends SpriteSheet{
  constructor({imgName}){
    super({
      imgName : imgName,
      imgW : 832,
      imgH : 1344
    });
    this.seq=this.getSeq();
  }
  getSeq(){
    const data=require('./playeranime.json');
    const seq = {};
    data.layers.forEach((layer) => {
      seq[layer.name] = layer.data.filter(i => i>0);
    });
    return seq;
  }
  getAnime(imgName,speed=100,repeat=true,auto=true){
    return super.getAnime(this.seq[imgName],speed,repeat,auto);
  }
}
