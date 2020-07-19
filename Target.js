class Target {
  constructor(X, Y, R) {
    this.x = X;
    this.y = Y;
    this.r = R;
    this.shooted = true;
  }

  draw(scale) {
    if (this.shooted) {
      ctx.beginPath();
      ctx.arc(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1), this.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.arc(worldToCanvas(this.x, 0), worldToCanvas(this.y, 1), this.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }
  }
}
