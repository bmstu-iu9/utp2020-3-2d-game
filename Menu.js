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

const divMenu = document.createElement("div");
divMenu.className = "menu";
divMenu.append(play);
divMenu.append(about);

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
// const settings

// const restart = document
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
  }
  divMenu.remove();
  document.body.append(menu);

  if (!firstStart) {
    lastTime = performance.now();
    requestId = RAF(loop);
  }
  paused = false;
  if (firstStart) firstStart = false;
}

openMenu();
