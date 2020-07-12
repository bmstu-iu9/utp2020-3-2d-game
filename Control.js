let rightPressed = false;
let leftPressed = false;

let keyUpHandler = (e) => {
  if (e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
            leftPressed = false;
        }
}

function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
