'use strict';

let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;

let keyUpHandler = (e) => {
  if(e.keyCode == 68) {     //d
      rightPressed = false;
  }
  else if(e.keyCode == 65) {  //a
      leftPressed = false;
  } else if (e.keyCode == 83){ //s
      downPressed = false;
  } else if (e.keyCode == 87){ //w
      upPressed = false;
    }

}

let keyDownHandler = (e) => {
  if(e.keyCode == 68) {     //d
      rightPressed = true;
  }
  else if(e.keyCode == 65) {  //a
      leftPressed = true;
  } else if (e.keyCode == 83){ //s
      downPressed = true;
  } else if (e.keyCode == 87){ //w
      upPressed = true;
    }

}

let mouseMoveHandler = (e) => {
  const tmpx = e.clientX - canvas.offsetLeft;
  const tmpy = e.clientY - canvas.offsetTop;
  if(tmpx > 0 && tmpx < canvas.width && tmpy > 0 && tmpy < canvas.height) {
      sight.x = tmpx;
      sight.y = tmpy;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
