'use strict'
// 1 - reload ak-47
// 2 - ходьба с shotgun
// 3 - reload  shotgun

class Player {

  constructor (x, y, width, height, speed, sprite) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.X_Center = this.x + this.width / 2;
    this.Y_Center = this.y + this.height / 2;
    this.radius = (this.width / 2) + 1;
    this.sprite = sprite;
    this.speed = speed;
    this.prevDirect = "Down";
    this.direction = "Down";
    this.bulletsInMagazine = 30;
    this.magazine = 1;
    this.reload = false;
    this.hp = 2;
    this.dead = false;
    this.fire = false;
  }

  drawDirection() {
    if (this.dead) {
      this.sprite.dead.drawSprite();
    } else {
      if (this.direction === "Down") {
        this.drawPlayerBody();
        this.sprite.down.drawSprite();
      }

      if (this.direction === "Up") {
        this.drawPlayerBody();
        this.sprite.up.drawSprite();
      }

      if (this.direction === "Left") {
        this.drawPlayerBody();
        this.sprite.left.drawSprite();
      }

      if (this.direction === "Right") {
        this.drawPlayerBody();
        this.sprite.right.drawSprite();
      }
    }
  }

  move() {
    if (downPressed) {
      if (this.y < mapImg.naturalHeight) {
        this.y += this.speed;
        this.Y_Center += this.speed;
      }
      this.sprite.down.x = worldToCanvas(this.X_Center, 0);
      this.sprite.down.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Down";
      this.sprite.down.update();
    } else if (upPressed) {
      if (this.y !== 0) {
        this.y -= this.speed;
        this.Y_Center -= this.speed;
      }
      this.sprite.up.x = worldToCanvas(this.X_Center, 0);
      this.sprite.up.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Up";
      this.sprite.up.update();
    }

    if (rightPressed) {
      if (this.x < mapImg.naturalWidth) {
        this.x += this.speed;
        this.X_Center += this.speed;
      }
      this.sprite.right.x = worldToCanvas(this.X_Center, 0);
      this.sprite.right.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Right";
      this.sprite.right.update();
    } else if (leftPressed) {
      if (this.x !== 0) {
        this.x -= this.speed;
        this.X_Center -= this.speed;
      }
      this.sprite.left.x = worldToCanvas(this.X_Center, 0);
      this.sprite.left.y = worldToCanvas(this.Y_Center, 1);
      this.direction = "Left";
      this.sprite.left.update();
    }

    if (mouseDown) {
      if (shootEnable) {
        if (player.bulletsInMagazine === 0) {
          this.reload = true;
          if (player.magazine !== 0) {
            player.bulletsInMagazine = 30;
            player.magazine--;
            this.reload = false;
            timeBullet = 30;
          } else {
            this.reload = false;
            timeBullet = 30;
          }
        } else {
          player.bulletsInMagazine--;
            bullets.add(new Bullet(player.x, player.y,
                                 canvasToWorld(sight.x, 0), canvasToWorld(sight.y, 1),
                                 bulletSpeed));

          if (singleShoot) {
            shootEnable = false;
          }
        }
      }
    }

  }

  checkBullets() {
    return player.bulletsInMagazine !== 0 || player.magazine !== 0;
  }

  drawPlayerBody() {
    ctx.save();
    ctx.translate(this.x, this.y);
    let deg = 3 * Math.PI / 2 + Math.acos((this.x - sight.x) / Math.sqrt(Math.pow((this.x - sight.x), 2) + Math.pow((this.y - sight.y), 2)));
    if (sight.y > this.y) {
      if (sight.x < this.x) {
        deg = -deg - Math.PI;
      } else {
        deg = -deg + Math.PI;
      }
    }
    ctx.rotate(deg);
    if (!this.fire) {
      if (this.weapon.id === 0) {
       this.sprite.pl.indexFrameY = 0;
     } else if (this.weapon.id === 2) {
       this.sprite.pl.indexFrameY = 2;
     }
   }
    ctx.drawImage(
        this.sprite.pl.image,
        this.sprite.pl.srcX,
        this.sprite.pl.srcY,
        this.sprite.pl.width,
        this.sprite.pl.height,
        -this.sprite.pl.width / 2,
        -this.sprite.pl.height / 2 - spriteHKoef,
        this.sprite.pl.width,
        this.sprite.pl.height
    );

    ctx.restore();
  }
  }
}
