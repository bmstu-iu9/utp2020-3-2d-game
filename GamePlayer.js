'use strict'
import {CharacterSheet} from "./sprite"
export class Vector {
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
          this.y=speed;
        break;
       case "Left" :
            this.x=-speed;
          break;
        case "Right" :
            this.x=speed;
          break;

    }
  }
}
export class ControlState{
  constructor(){
    this.up=false;
    this.down=false;
    this.left=false;
    this.right=false;
    this.fire=false;
    this.keyMap = new Map([
      [37 ,'Left'],[38,'Up'],[39,'Right'],[40,'Down']
    ]);
    this.fire= new Map([
      [0,'fireLeft']
    ]);
    document.addEventListener('keydown',(event) => this.update(event,true));
    document.addEventListener('keyup',(event) => this.update(event,false));
    document.addEventListener('mousedown',(event) => this.updateM(event,true));
    document.addEventListener('mouseup',(event) => this.updateM(event,false));
    }
    update(event,pressed) {
      if(this.keyMap.has(event.keyCode)){
        event.preventDefault();
        event.stopPropagation();
        this.[this.keyMap.get(event.keyCode)]=pressed;
      }
    }
    updateM(event,pressed){
      if (this.fire.has(event.button)){
        event.preventDefault();
        event.stopPropagation();
        this.[this.fire.get(event.button)]=pressed;
      }
    }
}
export class BasicPlayer {
  constructor({imgName,speed}) {
    this.x=0;
    this.y=0;
    this.speed=speed;
    this.vec=new Vector("Down",0);
    this.lastTime=0;
    this.animations={};
    this.isFiring=false;
    const anime = new CharacterSheet({imgName : imgName});
    "walkDown,walkUp,walkLeft,walkRight".split(",").forEach(name => {
      this.animations[name] = anime.getAnime(name);
    })
  }
  walk(direction){
    this.vec.setDirection(direction,this.speed);
    this.view=this.animations["walk" + direction];
    this.view.run();
  }
  stand(direction){
    this.vec.setDirection(direction,0);
    this.view = this.animations("walk" + direction);
    this.view.stop();
  }
  update(time){
    if (this.lastTime===0){
      this.lastTime=time;
      return;
    }
    this.x += (time - this.lastTime) * (this.vec.x / 1000);
    this.y += (time - this.lastTime) * (this.vec.y / 1000);
    this.lastTime=time;
    this.view.setXY(Math.trunc(this.x),Math.trunc(this.y));
    this.view.update(time);
  }
}
export class GamePlayer extends BasicPlayer{
  constructor(control1,control2){
    super({imgName :"player",speed:50});
      this.control1=control1;
      this.control2=control2;
    }
    update(time){
      if(this.control1.up) {
            this.walk("Up");
        } else if(this.control1.down) {
            this.walk("Down");
        } else if(this.control1.left) {
            this.walk("Left");
        } else if(this.control1.right) {
            this.walk("Right");
        } else this.stand(this.velocity.direction);

        super.update(time);
    }
}
