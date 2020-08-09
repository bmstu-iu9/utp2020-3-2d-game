class Sound {                                //fadeout start in sec
  constructor(audio, start, end, volume = 1, fadeout = end) {
    this.audio = audio;
    this.volume = volume;
    this.audio.volume = volume;
    this.start = start;
    this.end = end;
    this.fadeout = fadeout - start;  //waiting for fadeout
    this.fadeoutStep = 0.1;  //sec
    this.dt = volume / (end - fadeout) * this.fadeoutStep;
  }

  play() {
    this.audio.volume = this.volume;
    this.audio.pause();
    clearTimeout(this.timeout);
    clearTimeout(this.fadeoutTimeout);
    clearInterval(this.fadeoutSteps);
    this.audio.currentTime = this.start;
    this.audio.play();

    this.timeout = setTimeout(() => {
      this.audio.pause();
      clearTimeout(this.timeout);
    }, (this.end - this.start) * 1000);

    this.fadeoutTimeout = setTimeout(() => {
      this.fadeoutSteps = setInterval(() => {
        if (this.audio.volume - this.dt > 0) this.audio.volume -= this.dt;
        else clearInterval(this.fadeoutSteps);

        }, this.fadeoutStep * 1000)
    }, this.fadeout * 1000)
  }
}
