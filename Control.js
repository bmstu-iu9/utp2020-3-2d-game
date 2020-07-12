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

function keyDownHandler(e) {
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

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
