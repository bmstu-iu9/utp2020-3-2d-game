'use strict';

class Cover {
  constructor(x, y, w, h, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.xBlock1 = Math.floor(x / worldTileSize);
    this.xBlock2 = Math.floor((x + w) / worldTileSize);
    this.yBlock1 = Math.floor(y / worldTileSize);
    this.yBlock2 = Math.floor((y + h) / worldTileSize);
  }

  static defineCover(xBlock, yBlock) {
    for (let cover of covers) {
      if (cover.xBlock1 <= xBlock && cover.xBlock2 >= xBlock &&
          cover.yBlock1 <= yBlock && cover.yBlock2 >= yBlock) {
          return cover.id;
      }
    }
    return -1;
  }
}
