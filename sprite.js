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
