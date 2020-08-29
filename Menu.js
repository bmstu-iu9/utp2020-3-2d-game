'use strict';

let firstStart = true;

const play = document.createElement("button");
const playDiv = document.createElement("div");
playDiv.className = "in";
const playText = document.createTextNode("Играть");
play.className = "btnplay";
playDiv.append(playText);
play.append(playDiv);
play.onclick = () => {
  closeMenu();
  const preprocess = document.createElement("script");
  preprocess.src = "Preprocess.js";
  document.body.append(preprocess);
}

const resume = document.createElement("button");
const resumeDiv = document.createElement("div");
resumeDiv.className = "in";
const resumeText = document.createTextNode("Продолжить");
resume.className = "btnplay";
resumeDiv.append(resumeText);
resume.append(resumeDiv);
resume.onclick = () => {
  closeMenu();
}

const menu = document.createElement("button");
const div = document.createElement("div");
div.className = "in";
const menuText = document.createTextNode("Меню");
menu.className = "back";
div.append(menuText);
menu.append(div);
menu.onclick = () => {
  openMenu();
}

const about = document.createElement("button");
const aboutName = document.createTextNode("Об игре");
about.className = "btnabout";
about.append(aboutName);
const aboutText = "<p> 2d шутер в сеттинге Вьетнама </p>";
const aboutDiv = document.createElement("div");
aboutDiv.className = "in";
aboutDiv.insertAdjacentHTML("beforeend", aboutText);

let aboutOpened = false;
about.onclick = () => {
  if (!aboutOpened) {
    aboutOpened = true;
    divMenu.append(aboutDiv);
  } else {
    aboutOpened = false;
    aboutDiv.remove();
  }
}

const settings = document.createElement("button");
settings.className = "btnsettings";
const settingsDiv = document.createElement("div");
settingsDiv.className = "in";
const settingsText = document.createTextNode("Настройки");
settingsDiv.append(settingsText);
settings.append(settingsDiv);
settings.onclick = () => {
  toggleSettings();
}
const restart = document.createElement("button");
restart.className = "btnrestart";
const restartDiv = document.createElement("div");
restartDiv.className = "in";
const restartText = document.createTextNode("Заново");
restartDiv.append(restartText);
restart.append(restartDiv);
restart.onclick = () => {
  init();
  closeMenu();
}

const divMenu = document.createElement("div");
divMenu.className = "menu";
divMenu.append(play);
divMenu.append(settings);
divMenu.append(about);

const soundContainer = document.createElement("div");
soundContainer.className = "slidercontainer";
const soundRange = document.createElement("input");
soundRange.setAttribute("type", "range");
soundRange.className = "slider";
soundRange.setAttribute("min", "0");
soundRange.setAttribute("max", "100");
soundRange.setAttribute("value", "100");
const soundText = document.createTextNode("Звук:");
soundContainer.append(soundText);
soundContainer.append(soundRange);
let settingsOpened = false;

const deadInfo = document.createElement("div");
deadInfo.className = "in";
deadInfo.style.fontSize = "50px";
deadInfo.style.position = "relative";
deadInfo.style.top = "10%";
const deadText = document.createTextNode("Вас убили!");
deadInfo.append(deadText);

const toggleSettings = () => {
  if (!settingsOpened) {
    settingsOpened = true;
    if (firstStart) {
      about.style.bottom = "5%";
    } else {
      restart.style.bottom = "5%";
    }
    divMenu.append(soundContainer);
  } else {
    settingsOpened = false;
    if (firstStart) {
      about.style.bottom = "15%";
    } else {
      restart.style.bottom = "15%";
    }
    saveSettings();
    soundContainer.remove();
  }
}

const saveSettings = () => {
  Sound.globalVolume = soundRange.value;
}

const openMenu = () => {
  if (!firstStart) {
    cancelRAF(requestId);
  }
  paused = true;
  document.body.append(divMenu);
  menu.remove();
}

const closeMenu = () => {
  if (firstStart) {
    play.remove()
    about.remove();
    divMenu.append(resume);
    divMenu.append(restart);
  }
  divMenu.remove();
  if (settingsOpened) {
    toggleSettings();
  }
  document.body.append(menu);

  if (!firstStart) {
    lastTime = performance.now();
    requestId = RAF(loop);
  }
  if (dead) {
    dead = false;
    divMenu.append(resume);
    divMenu.append(settings);
    deadInfo.remove();
    restart.style.bottom = "15%";
  }
  paused = false;
  firstStart = false;
}

const gameOver = () => {
  dead = true;
  resume.remove();
  settings.remove();
  divMenu.append(deadInfo);
  restart.style.bottom = "50%";
  openMenu();
}

openMenu();
