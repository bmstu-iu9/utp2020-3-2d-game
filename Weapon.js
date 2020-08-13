class Weapon {
  constructor(id, x = 0, y = 0) {
    switch (id) {
      case 0:
        this.fireRate = 1/10; //sec for 1 round
        this.bullets = 30;
        this.maxBullets = 30;
        this.magazines = [];
        this.magazines.push(30);
        this.magazines.push(30);
        this.bulletSpeed = 12;
        this.reloadTime = 1.5; //sec
        this.image = images["ak47"];
        this.width = 13;
        this.roundImage = images["7.62gauge"];
        this.shotSound = new Sound(sounds["shot_ak47"], 1.095, 2, 0.3, 1.5);
        break;
      case 1:
        this.fireRate = 1/11.6;
        this.bullets = 30;
        this.maxBullets = 30;
        this.magazines = [];
        this.magazines.push(30);
        this.magazines.push(30);
        this.bulletSpeed = 16;
        this.reloadTime = 1.2;
        this.image = images["m16"];
        this.width = 14;
        this.roundImage = images["5.56gauge"];
        this.shotSound = new Sound(sounds["shot_m16"], 6.21, 7.33, 0.8, 6.7);
        break;
      case 2:
        this.fireRate = 1;
        this.bullets = 6;
        this.maxBullets = 6;
        this.magazines = [];
        this.magazines.push(6);
        this.magazines.push(6);
        this.bulletSpeed = 15;
        this.reloadTime = 3.5;
        this.image = images["remington870"];
        this.width = 15;
        this.roundImage = images["12gauge"];
        this.shotSound = new Sound(sounds["shot_remington"], 1, 2.2, 0.3, 1.4);
        break;
    }

    this.id = id;
    this.x = x;
    this.y = y;
    this.offsetY = 0;
    this.maxOffsetY = 2;
    this.step = Math.PI / 16;
    this.stepTime = 0.05; //sec
    this.stepId = null;
    this.nullId = null;
    this.ratio = 1/4; //h/w
    this.height = this.ratio * this.width;
    this.lastBulletTime = 0;   //millisec
    this.reloading = false;
    this.reloadId = null;
    this.lastReloadTime = 0;  //millisec
    this.singleShoot = false;
    this.shootingEnabled = true;
    this.shootExecuted = 0;
    this.emptyMagazineSound = new Sound(sounds["empty"], 0.6, 1);
  }
  //0 - ak
  //1 - m16
  //2 - remington shotgun

  //возвращает true, если был произведен выстрел
  shoot(x, y, targetX, targetY) {
    let now = performance.now();

    if (this.singleShoot && this.shootExecuted !== 0) {
      this.shootingEnabled = false;
    } else {
      this.shootingEnabled = true;
    }

    if (!this.reloading && this.bullets > 0 &&
       (now - this.lastBulletTime) / 1000 > this.fireRate &&
        this.shootingEnabled) {
      bullets.add(new Bullet(x, y, targetX, targetY, this.bulletSpeed));
      this.bullets--;

      let k1 = targetX - x;
      let k2 = targetY - y;
      let len = Math.sqrt(k1 * k1 + k2 * k2);
      let offsetLen = 3/5 * this.width;
      rounds.push(new Round(x - k1 / len * offsetLen, y - k2 / len * offsetLen,
                            targetX, targetY, this.roundImage));

      this.lastBulletTime = performance.now();
      this.shotSound.play();

      return true;
    } else if (this.bullets <= 0 && this.shootExecuted === 0) {
      this.emptyMagazineSound.play();
    }

    return false;
  }

  reload() {
    if (this.magazines.length !== 0 && this.bullets != this.maxBullets &&
        this.reloading === false) {
      this.reloading = true;
      this.lastReloadTime = performance.now();
      if (this.id === 2) {  //перезарядка дробовика
        let loaded = 0;
        this.reloadId = setInterval(() => {
          if (loaded !== this.maxBullets - this.bullets && this.enoughAmmo(loaded + 1)) {
            loaded++;
          } else {
            clearInterval(this.reloadId);
            this.reloadId = null;
            this.reloading = false;
            this.load(loaded);
          }
        }, this.reloadTime / this.maxBullets * 1000);
      } else {
        this.reloadId = setTimeout(() => {
          clearTimeout(this.reloadId);
          this.reloadId = null;
          this.reloading = false;
          let neededBullets = this.maxBullets - this.bullets;
          this.load(neededBullets);
        }, this.reloadTime * 1000);
      }
    };
  }

  enoughAmmo(neededBullets) {
    for (let i = 0; i < this.magazines.length; i++)
      if (this.magazines[i] >= neededBullets) return true;
      else neededBullets -= this.magazines[i];

    return false;

  }

  stopReload() {
    if (this.reloadId != null) {
      if (this.id === 2) {
        clearInterval(this.reloadId);
      } else {
        clearTimeout(this.reloadId);
      }
      this.reloading = false;
      let delta = (performance.now() - this.lastReloadTime) / 1000;
      let bulletReloadTime = this.reloadTime / this.maxBullets;
      let neededBullets = Math.floor(delta / bulletsReloadTime);
      load(neededBullets);
    }
  }

  load(neededBullets) {
    let loadedBullets = 0;
    for (let i = this.magazines.length - 1; i >= 0 && neededBullets != 0; i--) {
      if (this.magazines[i] > neededBullets) {
        this.magazines[i] -= neededBullets;
        loadedBullets += neededBullets;
        break;
      } else {
        loadedBullets += this.magazines[i];
        neededBullets -= this.magazines[i];
        this.magazines.pop();
      }
    }
    this.bullets += loadedBullets;
  }

  drawReload(x, y, r) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "gray";
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.arc(x, y, r + 1.25, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(x, y, r, 0, 2 * Math.PI * (performance.now() - this.lastReloadTime) / 1000 / this.reloadTime, false);
    ctx.stroke();
    ctx.closePath();
  }

  draw() {
    if (!this.stepId){
      this.stepId = setInterval(() => {
        this.offsetY += this.step;
      }, this.stepTime * 1000);
      this.nullId = setInterval(() => {
        this.offsetY = 0;
      }, this.stepTime * 1000 * 10000 / this.step); //offsetY не более 10 тыс
    }

    ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight,
                  worldToCanvas(this.x, 0),
                  worldToCanvas(this.y + Math.sin(this.offsetY) * this.maxOffsetY / 2 + this.maxOffsetY / 2, 1),
                  this.width / camera.scaleX, this.height / camera.scaleY);
  }

  pickUp() {
    clearInterval(this.stepId);
    clearInterval(this.nullId);
    weapons.delete(this);
  }

  drop(x, y) { //передаются координаты мира
    this.x = x;
    this.y = y;
    this.offsetY = 0;
    weapons.add(this);
  }

  emptyMagazine() { return this.bullets === 0 };
  isReloading() { return this.reloading };
  switchShootingMode() { this.singleShoot = !this.singleShoot; }

}
