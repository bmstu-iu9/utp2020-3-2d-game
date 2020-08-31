'use strict';

let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;
let mouseDown = false;
let changeShootingMode = false;
let reloadPending = false;
let pickUp = false;
let throwGrenade = false;
let throwTime = 0;
let paused = true;
let dead = false;
let openDoor = false;
let getInCover = false;

const controlInit = () => {
  rightPressed = false;
  leftPressed = false;
  downPressed = false;
  upPressed = false;
  mouseDown = false;
  changeShootingMode = false;
  reloadPending = false;
  pickUp = false;
  throwGrenade = false;
  throwTime = 0;
  paused = true;
  openDoor = false;
  getInCover = false;
}

const keyUpHandler = (e) => {
  if (!paused) {
    if (e.keyCode === 68) { //d
      rightPressed = false;
    } else if (e.keyCode === 65) { //a
      leftPressed = false;
    } else if (e.keyCode === 83) { //s
      downPressed = false;
    } else if (e.keyCode === 87) { //w
      upPressed = false;
    } else if (e.keyCode === 71 && !throwGrenade) { //g
      throwGrenade = true;
      throwTime = performance.now() - throwTime;
    } else if (e.keyCode === 70) { //f
      openDoor = true;
    } else if (e.keyCode === 81) { //q
      getInCover = true;
    }
  }
  if (e.keyCode === 27 && !firstStart) { //esc
    if (paused) {
      closeMenu();
    } else {
      openMenu();
    }
  }
}

const keyDownHandler = (e) => {
  if (!paused) {
    if (e.keyCode === 68) { //d
      rightPressed = true;
    } else if (e.keyCode === 65) { //a
      leftPressed = true;
    } else if (e.keyCode === 83) { //s
      downPressed = true;
    } else if (e.keyCode === 87) { //w
      upPressed = true;
    } else if (e.keyCode === 69) { //e
      pickUp = true;
    } else if (e.keyCode === 82) { //r
      reloadPending = true;
    } else if (e.keyCode === 71 && !throwTime) { //g
      throwTime = performance.now();
    }
  }
}

const mouseMoveHandler = (e) => {
  const tmpX = e.clientX - canvas.offsetLeft;
  const tmpY = e.clientY - canvas.offsetTop;
  if (!paused && tmpX > 0 && tmpX < canvas.width && tmpY > 0 && tmpY < canvas.height) {
    sight.x = tmpX;
    sight.y = tmpY;
  }
}

const mouseDownHandler = (e) => {
  const tmpX = e.clientX - canvas.offsetLeft;
  const tmpY = e.clientY - canvas.offsetTop;
  if (!paused && tmpX > 0 && tmpX < canvas.width && tmpY > 0 && tmpY < canvas.height) {
    if (e.which === 1) {
      mouseDown = true;
    }
    if (e.which === 2) {
      changeShootingMode = true;
    }
  }
}

const mouseUpHandler = (e) => {
  if (!paused) {
    mouseDown = false;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
