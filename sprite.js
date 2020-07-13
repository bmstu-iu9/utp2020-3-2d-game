'use strict'
import {Anime} from './animations';
class Sprite{
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
class SpriteSheet {
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
