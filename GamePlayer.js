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
      case "up":
          this.y=-speed;
        break;
       case "down" :
          this.y=speed;
        break;
       case "left" :
            this.x=-speed;
          break;
        case "right" :
            this.x=speed;
          break;

    }
  }
}
class ControlState{
  constructor(){
    this.up=false;
    this.down=false;
    this.left=false;
    this.right=false;
    this.fire=false;
    this.keyMap = new Map([
      [37 ,'left'],[38,'up'],[39,'right'],[40,'down']
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
class BasicPlayer {
  constructor({imgName,speed}) {
    this.x=0;
    this.y=0;
    this.speed=speed;
    this.vec=new Vector("down",0);
    this.lastTime=0;
    this.animations={};
    this.isFiring=false;
  }
  walk(direction){
    this.vec.setDirection(direction,this.speed);
  }
  stand(direction){
    this.vec.setDirection(direction,0);
  }
  update(time){
    if (this.lastTime===0){
      this.lastTime=time;
      return;
    }
    this.lastTime=time;
    this.view.setXY(Math.trunc(this.x),Math.trunc(this.y));
    this.view.update(time);
  }
}
class GamePlayer extends BasicPlayer{
  constructor(control1,control2){
    super({imgName :"player",speed:50});
      this.control1=control1;
      this.control2=control2;
    }
    update(time){
      if(this.control1.up) {
            this.walk("up");
        } else if(this.control1.down) {
            this.walk("down");
        } else if(this.control1.left) {
            this.walk("left");
        } else if(this.control1.right) {
            this.walk("right");
        } else this.stand(this.velocity.direction);

        super.update(time);
    }
}
