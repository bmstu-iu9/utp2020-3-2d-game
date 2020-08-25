'use strict'

const generateMesh = () => {

  const degNum = 72;
  const step = 5;
  const blockCenter = 5;
  const blockSize = 10;
  let x = 0, y = 0, sx = 0, sy = 0, tx = 0, ty = 0, dx = 0, dy = 0, xBlock = 0, yBlock = 0;

  const mesh = [];
  for (let i = 0; i < tileMap[0].length; i++) {
    mesh[i] = [];
    for (let j = 0; j < tileMap.length; j++) {
      x = i * blockSize + blockCenter;
      y = j * blockSize + blockCenter;
      if (tileMap[j][i] == "white") {
        mesh[i][j] = {x: x, y: y, color : 0, bfs: 0, vision: [], def: 4, incidence: []};
      } else {
        mesh[i][j] = {x: x, y: y, color : 1, bfs: 0, vision: [], def: 4, incidence: []};
      }
      for (let k = 0; k < degNum; k++) {
        if (mesh[i][j].color === 0) {
          tx = Math.cos(k * step * Math.PI / 180) + x;
          ty = Math.sin(k * step * Math.PI / 180) + y;
          dx = (tx - x) / Math.sqrt(Math.pow(tx - x, 2) + Math.pow(ty - y, 2));
          dy = (ty - y) / Math.sqrt(Math.pow(tx - x, 2) + Math.pow(ty - y, 2));
          xBlock = i;
          yBlock = j;
          sx = x;
          sy = y;
          while (tileMap[yBlock][xBlock] !== "black" && sx > 0 && sy > 0 && sx < images["map"].naturalWidth && sy < images["map"].naturalHeight) {
            xBlock = (sx - (sx % blockSize)) / blockSize;
            yBlock = (sy - (sy % blockSize)) / blockSize;
            sx += dx;
            sy += dy;
          }
          mesh[i][j].vision[k] = Math.round(Math.sqrt(Math.pow(sx - x, 2) + Math.pow(sy - y, 2)));
        }
      }
    }
  }

  for (let i = 0; i < mesh.length; i++) {
    for (let j = 0; j < mesh[0].length; j++) {
      if (i !== 0 && mesh[i - 1][j].color !== 1) {
        mesh[i][j].incidence.push({i: i - 1, j: j});
        if () {

        }
      } else {
        mesh[i][j].def -= 1;
      }
      if (j !== 0 && mesh[i][j - 1].color !== 1) {
        mesh[i][j].incidence.push({i: i, j: j - 1});
        if () {

        }
      } else {
        mesh[i][j].def -= 1;
      }
      if (i !== mesh.length - 1 && mesh[i + 1][j].color !== 1) {
        mesh[i][j].incidence.push({i: i + 1, j: j});
        if () {

        }
      } else {
        mesh[i][j].def -= 1;
      }
      if (j !== mesh[0].length - 1 && mesh[i][j + 1].color !== 1) {
        mesh[i][j].incidence.push({i: i, j: j + 1});
        if () {

        }
      } else {
        mesh[i][j].def -= 1;
      }
    }
  }
  let str = JSON.stringify(mesh);
  console.log(str);
}

generateMesh();
