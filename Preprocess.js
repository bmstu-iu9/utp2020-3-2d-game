'use strict'

let promises = [ {"name": "map", "src" : "resources/map.png"}, {"name":"player", "src" : "resources/player.png"},
                 {"name" : "12gauge", "src" : "resources/12gauge_pixelized.png"} ];

promises = promises.map( el => new Promise( (resolve, reject) => {
  let img = new Image();
  img.src = el["src"];
  let obj = {};
  obj[el["name"]] = img;
  img.onload = () => resolve(obj);
  img.onerror = () => reject(`some problems with loading ${el["name"]} image or other images`);
}) );

const images = {};

const loadScript = src => {
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Error loading script ${src}`));

    document.body.appendChild(script);
  });
}

Promise.all(promises).then(
  (result) => {
    result.forEach(img => {
      images[Object.keys(img)[0]] = Object.values(img)[0];
    });

    loadScript("Init.js").
    then(script => loadScript("MainLoop.js")).
    then(script => console.log("all scripts are loaded"));

  },
  (error) => {
    console.log(error);
  }
);