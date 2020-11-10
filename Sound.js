"use strict";

class Sound { //fadeout start in sec
  constructor(audioBuffer, start, end, volume = 1, fadeout = end) {
    this.audioBuffer = audioBuffer;
    this.gain = audCtx.createGain();
    this.gain.gain.value = volume;
    this.gain.connect(audCtx.destination);
    this.panner = audCtx.createPanner();
    this.refDistance = 55;
    this.panner.maxDistance = 300;
    this.panner.rolloffFactor = 2;
    this.panner.distanceModel = "linear";
    this.panner.connect(this.gain);
    this.volume = volume;
    this.start = start;
    this.end = end;
    this.fadeout = fadeout - start; //waiting for fadeout
    this.fadeoutStep = 0.01; //sec
    this.dt = volume / (end - fadeout) * this.fadeoutStep;
    this.played = false;
    this.paused = true;
  }

  play(start = true, src = null) {
    this.gain.gain.value = this.volume * Sound.globalVolume / 100;
    clearTimeout(this.fadeoutTimeout);
    clearInterval(this.fadeoutSteps);

    if (!this.paused) {
      this.pause();
    }
    this.source = audCtx.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.panner);
    this.panner.positionX.setValueAtTime(0, audCtx.currentTime);
    this.panner.positionZ.setValueAtTime(0, audCtx.currentTime);
    this.source.onended = () => {
      this.paused = true;
    };

    if (src) {
      let v = rotate(src.x - player.realXCenter, src.y - player.realYCenter, 3 * Math.PI / 2 - player.angle);
      this.panner.positionZ.setValueAtTime(-v.y, audCtx.currentTime);
      this.panner.positionX.setValueAtTime(v.x, audCtx.currentTime);
    }

    if (start) {
      this.source.start(0, this.start, this.end - this.start);
    } else {
      this.source.start(0, 0, this.end - this.start);
    }
    this.paused = false;

    this.fadeoutTimeout = setTimeout(() => {
      this.fadeoutSteps = setInterval(() => {
        if (this.gain.gain.value - this.dt > 0) this.gain.gain.value -= this.dt * Sound.globalVolume / 100;
        else clearInterval(this.fadeoutSteps);
      }, this.fadeoutStep * 1000)
    }, this.fadeout * 1000);
  }

  onPause() { return this.paused }

  pause() {
    if (!this.paused) {
      this.source.stop();
      this.paused = true;
      this.source.disconnect();
    }
  }
}

Sound.globalVolume = 100;
