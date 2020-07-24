'use strict'
const generateTileMap = () => {
  const map = [];

  let blockRealWidth = canvasToWorld(20, 0)
  let blockRealHeight = canvasToWorld(20, 1);

  let row = images["map"].height / blockRealHeight;
  let col = images["map"].width / blockRealWidth;
  console.log(row + " " + col + " " + images["map"].height);
  let mapCanvas = document.createElement("canvas");
  mapCanvas.width = images["map"].width;
  mapCanvas.height = images["map"].height;
  mapCanvas.getContext("2d").drawImage(images["map"],
                                       0, 0,
                                       images["map"].width,
                                       images["map"].height);

  let pixelData = mapCanvas.getContext("2d").
                  getImageData(0, 0, mapCanvas.width, mapCanvas.height).data;
  console.log(pixelData);
  const findDominant = (x, y, w, h) => {
    let distinctRGB = [[212, 191, 111], [14, 42, 75], [0, 94, 184], [52, 101, 21], [26, 56, 8], [51, 51, 51], [18, 18, 18]];
    let distinctColors = ["sand", "dark ocean", "ocean", "grass", "dark grass", "cobblestone", "dark cobblestone"];
    let count = [0, 0, 0, 0, 0, 0, 0]
    const checkColor = (r, g, b) => {
      //https://stackoverflow.com/questions/44189508/finding-which-color-is-the-closest-to-the-given-rgb-values-in-c
      let res = 0;
      let biggestDifference = 1000;

      for (let c = 0; c < count.length; c++) {
        let dist = Math.sqrt( Math.pow(r - distinctRGB[c][0], 2) + Math.pow(g - distinctRGB[c][1], 2) +
                       Math.pow(b - distinctRGB[c][2], 2) )
        if (dist < biggestDifference) {
            res = c;
            biggestDifference = dist;
        }
      }

      return res;
    }

    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        let pixel = i * mapCanvas.width * 4 + j * 4;
        count[checkColor(pixelData[pixel], pixelData[pixel + 1], pixelData[pixel + 2])]++;
      }
    }

    let max = 0;
    let id = 0;
    for (let c = 0; c < count.length; c++)
    if (count[c] > max){
      max = count[c];
      id = c;
    }

    return distinctColors[id];
  }

  for (let i = 0; i < row; i++) {
    map[i] = [];
    for (let j = 0; j < col; j++){
      map[i][j] = findDominant(j * blockRealWidth, i * blockRealHeight, blockRealWidth, blockRealHeight);
    }
  }

  let str = JSON.stringify(map);
  str = JSON.stringify(map, null, 4);
  console.log(str);

  return map;
}
