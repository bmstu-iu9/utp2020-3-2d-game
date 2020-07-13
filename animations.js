'use strict'
import {Sprite} from './sprite';
class Anime extends Sprite{
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
