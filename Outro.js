"use strict";

class Outro {
  constructor(snd) {
    this.snd = new Sound(snd, 3, snd.duration, 0.8);
  }

  play() {
    this.snd.play();
    gameOver("win");
  }

  stop() {
    this.snd.pause();

  }
}
