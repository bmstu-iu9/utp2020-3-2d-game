"use strict";

class Intro {
  constructor(img, snd) {
    this.img = img;
    this.srcW = img.width;
    this.srcH = 420;
    this.y = 0;
    this.step = 16.6;
    this.lineH = 20;
    this.timeForOneLine = 1;
    let k = 1000 / this.step;
    this.dy = this.lineH / this.timeForOneLine / k;
    let end = (img.naturalHeight - this.srcH) / this.lineH * this.timeForOneLine;
    this.snd = new Sound(snd, 0, end, 1, end * 0.9);
    this.playing = false;
  }

  play() {
    if (this.y + this.srcH >= this.img.naturalHeight) {
      clearInterval(this.id);
      this.playing = false;
      startGame();
      return;
    }
    let now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.img, 0, this.y,
                            this.srcW, this.srcH,
                            0, 0,
                            canvas.width, canvas.height);
    this.y += this.dy;
  }

  start() {
    this.id = setInterval(this.play.bind(this), this.step);
    this.snd.play();
    this.playing = true;
  }

  stop() {
    this.playing = false;
    this.snd.pause();
    clearInterval(this.id);
    startGame();
  }
}
