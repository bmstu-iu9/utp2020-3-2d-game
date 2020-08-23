'use strict'
const generateTileMap = () => {
  const map = [];

  let blockRealWidth = 10;
  let blockRealHeight = 10;

  let row = (images["map"].height - images["map"].height % blockRealHeight) / blockRealHeight;
  let col = (images["map"].width - images["map"].width % blockRealWidth) / blockRealWidth;
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
  const findDominant = (x, y, w, h) => {
    let distinctRGB = [ [0, 162, 232], [237, 28, 36], [185, 122, 87], [0, 0, 0], [255, 127, 39], [255, 255, 255], [153, 217, 234],
                        [255, 242, 0] ];
    let distinctColors = ["water", "red", "door", "black", "orange", "white", "glass", "cover"];
    let count = [0, 0, 0, 0, 0, 0, 0, 0];
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
  console.log(str);

  return map;
}

generateTileMap();
