"use strict";

class Outro {
  constructor(snd) {
    this.snd = new Sound(snd, 2, snd.duration, 0.8);
  }

  play() {
    this.playing = true;
    this.snd.play();
    setTimeout(gameOver, 15000, "win");
  }

  stop() {
    this.playing = false;
    this.snd.pause();
  }
}
