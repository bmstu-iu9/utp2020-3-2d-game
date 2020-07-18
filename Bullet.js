'use strict';
//1 вариант
//пули хранятся в Set у каждого персонажа и удаляются, если
//this.shooted && !this.flies
//в функции обнаружения коллизии при столкновении пули this.flies
//необходимо поменять на false, если
//this.shooted (эта проверка в целом необязательна).
//при выстреле данной пули в объекте игрок и бот необходимо поставить
//this.shooted в true.
//draw вызывается в методе draw игрока и бота для каждой пули такой,
//что this.shooted && this.flies
//updateCoordinates вызывается в методе update игрока и бота для каждой пули такой,
//что this.shooted && this.flies.

//2 вариант
//все пули хранятся в специальном массиве (или в чем-то еще).
//Когда игрок или бот стреляет, создается пуля и записывается
//в массив. В таком случае обработка всех пуль происходит в mainloop.

//Если будем реализовывать несколько оружий,
//то нужно передавать в конструктор
//скорость полета пули в зависимости от оружия
//или строку с типом оружия, что даже предпочтительнее
//это будем реализовывать позже

class Bullet {      //передаются координаты карты, а не канваса
  constructor(x, y, sightX, sightY, speed){ //возможно еще bulletType
    this.x = x;     //center
    this.y = y;
    this.flies = false;
    this.shooted = false;
    this.justShooted = true;
    this.bulletRadius = 5;           //нормирование и умножение на скорость \/
    this.dx = speed * (sightX - x) / Math.sqrt(Math.pow(sightX - x, 2) + Math.pow(sightY - y, 2));
    this.dy = speed * (sightY - y) / Math.sqrt(Math.pow(sightX - x, 2) + Math.pow(sightY - y, 2));
    this.speed = speed;
  }

  draw() {
    if (this.justShooted) {
      this.justShooted = false;
      this.drawRandomBullet();  //сначала рисуем выстрел
    } else {
      this.drawRandomTail();   //потом полет
    }

  }

  drawRandomBullet() {
    for (let pxY = this.y - this.bulletRadius; pxY < this.y + this.bulletRadius; pxY++) {
      for (let pxX = this.x - this.bulletRadius; pxX < this.x + this.bulletRadius; pxX++){
        if (Math.sqrt(Math.pow(pxX - this.x, 2) + Math.pow(pxY - this.y, 2)) < this.bulletRadius &&
            Math.random() > 0.5) {
          ctx.beginPath();
          ctx.fillStyle = "yellow";
          ctx.fillRect(worldToCanvas(pxX, 0), worldToCanvas(pxY, 1), 1, 1);
          ctx.closePath();
        }
      }
    }
  }

  drawRandomTail() {
    let dx = 0;
    let dy = 0;
    let norm1Dx = this.dy / this.speed; //орты нормалей
    let norm1Dy = -this.dx / this.speed;
    let norm2Dx = -this.dy / this.speed;
    let norm2Dy = this.dx / this.speed;
    let unitDx = this.dx / this.speed;  //орт главного направления
    let unitDy = this.dy / this.speed;

    let probability = 0.5
    let normLen = 1;
    let gap = 0.8;

    while (Math.abs(dx) < Math.abs(this.dx * gap) &&  //поменять gap, чтобы увеличить расстояние
          Math.abs(dy) < Math.abs(this.dy * gap)) {

            for (let pxX = 0, pxY = 0; Math.abs(pxX) < Math.abs(norm1Dx * normLen) && Math.abs(pxY) < Math.abs(norm1Dy*normLen);
                pxX += norm1Dx, pxY += norm1Dy) {
              if (Math.random() < probability) {
                ctx.beginPath();
                ctx.fillStyle = "yellow";
                ctx.fillRect(worldToCanvas(this.x + pxX + dx, 0), worldToCanvas(this.y + pxY + dy, 1), 1, 1);
                ctx.closePath();
              }
            }

            for (let pxX = 0, pxY = 0; Math.abs(pxX) < Math.abs(norm2Dx * normLen) && Math.abs(pxY) < Math.abs(norm2Dy * normLen);
                pxX += norm2Dx, pxY += norm2Dy) {
              if (Math.random() < probability) {
                ctx.beginPath();
                ctx.fillStyle = "yellow";
                ctx.fillRect(worldToCanvas(this.x + pxX + dx, 0), worldToCanvas(this.y + pxY + dy, 1), 1, 1);
                ctx.closePath();
              }
            }

            dx += unitDx;
            dy += unitDy;
    }
  }

  updateCoordinates() {
    this.x += this.dx;
    this.y += this.dy;
  }
}
