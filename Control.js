'use strict';

let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;
let mouseDown = false;
let changeShootingMode = false;
let reloadPending = false;

const keyUpHandler = (e) => {
  if (e.keyCode === 68) {     //d
    rightPressed = false;
  } else if (e.keyCode === 65) {  //a
    leftPressed = false;
  } else if (e.keyCode === 83) { //s
    downPressed = false;
  } else if (e.keyCode === 87) { //w
    upPressed = false;
  } else if (e.keyCode === 82) { //r
    reloadPending = true;
  }
}

const keyDownHandler = (e) => {
  if (e.keyCode === 68) {     //d
    rightPressed = true;
  } else if(e.keyCode === 65) {  //a
    leftPressed = true;
  } else if (e.keyCode === 83) { //s
    downPressed = true;
  } else if (e.keyCode === 87) { //w
    upPressed = true;
  }
}

const mouseMoveHandler = (e) => {
  const tmpX = e.clientX - canvas.offsetLeft;
  const tmpY = e.clientY - canvas.offsetTop;
  if (tmpX > 0 && tmpX < canvas.width && tmpY > 0 && tmpY < canvas.height) {
    sight.x = tmpX;
    sight.y = tmpY;
  }
}

const mouseDownHandler = (e) => {
  const tmpX = e.clientX - canvas.offsetLeft;
  const tmpY = e.clientY - canvas.offsetTop;
  if (tmpX > 0 && tmpX < canvas.width && tmpY > 0 && tmpY < canvas.height) {
    if (e.which === 1) {
      mouseDown = true;
    }
    if (e.which === 2) {
      changeShootingMode = true;
    }
  }
}

const mouseUpHandler = (e) => {
  mouseDown = false;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
