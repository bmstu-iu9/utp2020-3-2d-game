'use strict';

let imagePromises = [ {"name": "map", "src" : "resources/jungle_carcass_v1.5.png"}, {"name":"player", "src" : "resources/Player.png"},
                 {"name" : "walk_RL", "src" : "resources/walk_RL.png"},
                 {"name" : "walk_UD", "src" : "resources/walk_UD.png"},  {"name" : "strafe", "src" : "resources/strafe.png"},
                 {"name" : "shoot", "src" : "resources/Shoot.png"},
                 {"name" : "bot1", "src" : "resources/bot1.png"},
                 {"name" : "bot2", "src" : "resources/bot2.png"},
                 {"name" : "botshoot", "src" : "resources/botshoot.png"},
                 {"name" : "12gauge", "src" : "resources/12gauge_pixelized.png"},
                 {"name" : "5.56gauge", "src" : "resources/5.56gauge_pixelized.png"},
                 {"name" : "7.62gauge", "src" : "resources/7.62gauge_pixelized.png"},
                 {"name" : "ak47", "src" : "resources/ak47_side_pixelized.png"},
                 {"name" : "m16", "src" : "resources/m16_side_pixelized.png"},
                 {"name" : "remington870", "src" : "resources/remington_side_pixelized.png"},
                 {"name" : "grenade", "src" : "resources/grenade_without_check_pixelized.png"},
                 {"name" : "door", "src" : "resources/door.png"},
                 {"name" : "glass", "src" : "resources/window.png"}, ];

let soundPromises = [ {"name" : "empty", "src" : "resources/shoot_empty_magazine.mp3" },
                      {"name" : "shot_ak47", "src" : "resources/shot_ak47.mp3"},
                      {"name" : "shot_m16", "src" : "resources/shot_m16.mp3"},
                      {"name" : "shot_remington", "src" : "resources/shot_remington.mp3"}, ];

imagePromises = imagePromises.map( el => new Promise( (resolve, reject) => {
  let img = new Image();
  img.src = el["src"];
  let obj = {};
  obj[el["name"]] = img;
  img.onload = () => resolve(obj);
  img.onerror = () => reject(new Error(`some problems with loading ${el["name"]} image or other images`));
}) );

soundPromises = soundPromises.map( el => new Promise( (resolve, reject) => {
  let audio = new Audio(el["src"]);
  let obj = {};
  obj[el["name"]] = audio;
  audio.addEventListener("canplaythrough", event => {
    resolve(obj);
  });
  audio.onerror = () => reject(new Error(`some problems with loading ${el["name"]} sound or other sounds`));
}) )

const images = {};
const sounds = {};

const loadScript = src => {
  return new Promise( (resolve, reject) => {
    let script = document.createElement('script');
    script.src = src;
    script.async = false;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Error loading script ${src}`));

    document.body.append(script);
  });
}

Promise.all(imagePromises.concat(soundPromises)).then(
  (result) => {
    result.forEach( (resource, i) => {
      if (i < imagePromises.length) images[Object.keys(resource)[0]] = Object.values(resource)[0];
      else sounds[Object.keys(resource)[0]] = Object.values(resource)[0];
    });

    loadScript("Grenade.js").
    then(script => loadScript("Init.js")).
    then(script => loadScript("MainLoop.js")).
    then(script => console.log("all scripts are loaded")).
    catch(error => console.log("Error:" + error.message));

  }
).catch(error => {
  console.log(error);
});
