'use strict';

class Bullet {
  constructor(character){
    this.x = character.x;
    this.y = character.y;
    this.belongsTo = character;
    this.flies = false;
    this.shooted = false;
  }                 //полет - линия желтого цвета
                    //+ три желтых пикселя у ствола
  draw() {
    
  }

  update() {

  }
}
