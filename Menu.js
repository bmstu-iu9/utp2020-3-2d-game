'use strict';

let firstStart = true;
const intro = new Intro(images["intro_text"], sounds["uh1"]);
const menuMusic = new Sound(sounds["menu_music"], 0, sounds["menu_music"].duration, 0.5);
const outro = new Outro(sounds["outro_music"]);

const play = document.createElement("button");
const playDiv = document.createElement("div");
playDiv.className = "in";
const playText = document.createTextNode("Играть");
play.className = "btnplay";
playDiv.append(playText);
play.append(playDiv);
play.onclick = () => {
  closeMenu();
  intro.start();
};

const resume = document.createElement("button");
const resumeDiv = document.createElement("div");
resumeDiv.className = "in";
const resumeText = document.createTextNode("Продолжить");
resume.className = "btnplay";
resumeDiv.append(resumeText);
resume.append(resumeDiv);
resume.onclick = () => {
  closeMenu();
  startGame();
};

const about = document.createElement("button");
const aboutName = document.createTextNode("Об игре");
about.className = "btnabout";
about.append(aboutName);
const aboutText = "<h1 class='header1'> \"Вьетнамские флешбеки\" </h1>" +
    "<h2 class='header'>Об игре:</h2>" +
    "<h3 class='header'> Геймплей </h3> " +
    "<p class='aboutText'>Игра представляет собой 2D шутер с видом сверху. По лору игры действие происходит во времена войны во Вьетнаме, игроку предстоит исследовать карту, представляющую собой джунгли с деревней, и уничтожать всех встреченных противников, что в конечном итоге и является целью главного героя. </p>" +
    "<h3 class='header'>Жизни</h3>" +
    "<p class='aboutText'>Наша игра задумывалась как шутер с высокой сложностью, поэтому игрок имеет всего четыре жизни, а каждая попавшая в него пуля снимает две из них. Еще одной опасностью будет колючая проволока. Игрок может замедлиться, чтобы было удобнее обойти ее, при этом став более уязвимым.</p>" +
    "<h3 class='header'>Зрение</h3>" +
    "<p class='aboutText'>Также мы хотели добавить немного тактической составляющей в нашу игру, следствием этого стало введение \"зрения\". Оно действует как для игрока, так и для ботов. Так, например, игрок не видит противников за большинством препятствий, или когда угол между прицелом и ботом с вершиной в точке, в которой находится игрок, становится тупым.</p>" +
    "<h3 class='header'>Динамические блоки</h3>\n" +
    "<p class='aboutText'>На карте присутствуют блоки, с которыми можно взаимодействовать. Так стекло можно разбить, чтобы пройти, выстрелив из оружия, а дверь можно открыть. Также присутствуют укрытия, которыми можно воспользоваться, нажав соответствующую клавишу, в таком случае игрок виден за укрытием, но попасть в него не получится.</p>" +
    "<h3 class='header'>Вооружение</h3>" +
    "<p class='aboutText'>В распоряжении игрока находятся М16 с тремя магазинами на 20 патронов каждый и 2 гранаты. Также оружие можно подбирать в определенных местах на карте. Так, можно найти М16, АК47 и дробовик Remington 870. Каждое оружие обладает своими уникальными характеристиками: время перезарядки, скорострельность, точность, скорость пули. Дробовик стреляет по площадям, а автоматическое оружие имеет одиночный и автоматический режимы стрельбы.</p>" +
    "<h3 class='header'>Интерфейс</h3>" +
    "<p class='aboutText'>В верхнем левом углу игрок может увидеть оставшееся количество жизней, чуть ниже находится количество патронов в магазине, еще ниже еще ниже находятся индикаторы остальных магазинов. Справа от них находится индикатор оставшихся гранат. Под индикаторами боезапаса находится переключатель режима стрельбы. В правом нижнем углу расположена миникарта, белый квадрат означает текущую видимую зону. Если на видимой части карты нет противников, то направление к ближайшему из них укажет красная точка на краю экрана.</p>" +
    "<p class='aboutText'>В игре используются следующие музыкальные композиции:</p>" +
    "<p class='aboutText'>The Doors - The End </p>" +
    "<p class='aboutText'>Creedence Clearwater Revival - Fortunate Son</p>" +
    "<h2 class='header'> Управление: </h2>" +
    "<ul> <li> WASD - перемещение </li>" +
     "<li>ЛКМ - стрельба</li>" +
     "<li>СКМ - изменение режима стрельбы</li>" +
     "<li>R - перезарядка</li>" +
     "<li>E - подобрать оружие</li>" +
     "<li>G - бросить гранату</li>" +
     "<li>F - открыть/закрыть дверь</li>" +
     "<li>Q - занять/выйти из укрытия</li>" +
     "<li>SHIFT - замедлиться</li>" +
     "<li>ESC - пауза/пропустить заставку</li></ul>" +
     "<h2 class='header'> Разработчики: </h2>" +
     "<ul> <li> Антон Серегин - <a href=\"https://github.com/frussian\">https://github.com/frussian </a></li>" +
      "<li>Александр Штейников - <a href=\"https://github.com/Snake5932\">https://github.com/Snake5932 </a></li>" +
      "<li>Алексей Мартынов - <a href=\"https://github.com/AlexMartpr\">https://github.com/AlexMartpr </a></li>" +
      "<li>Степан Фураев - <a href=\"https://github.com/furstepnik\">https://github.com/furstepnik</li> </a></ul>";
const aboutDiv = document.createElement("div");
aboutDiv.className = "about";
aboutDiv.insertAdjacentHTML("beforeend", aboutText);
aboutDiv.append(about);

const menu = document.createElement("button");
menu.className = "btnmenu";
const menuDiv = document.createElement("div");
menuDiv.className = "in";
const menuText = document.createTextNode("Меню");
menuDiv.append(menuText);
menu.append(menuDiv);
menu.onclick = () => {
  aboutDiv.remove();
  menu.remove();
}

about.onclick = () => {
  document.body.append(aboutDiv);
  document.body.append(menu);
};

const settings = document.createElement("button");
settings.className = "btnsettings";
const settingsDiv = document.createElement("div");
settingsDiv.className = "in";
const settingsText = document.createTextNode("Настройки");
settingsDiv.append(settingsText);
settings.append(settingsDiv);
settings.onclick = () => {
  toggleSettings();
};
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
  startGame();
};

const divMenu = document.createElement("div");
divMenu.className = "menu";
const divText = document.createTextNode("\"Вьетнамские флешбеки\"");
divMenu.append(divText);
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

const winInfo = document.createElement("div");
winInfo.className = "in";
winInfo.style.fontSize = "50px";
winInfo.style.position = "relative";
winInfo.style.top = "10%";
const winText = document.createTextNode("Вы победили!");
winInfo.append(winText);

const soundOnBttn = document.createElement("button");
const soundOnDiv = document.createElement("div");
soundOnDiv.className = "in";
const soundOnText = document.createTextNode("Музыка");
soundOnBttn.className = "btnmusic";
soundOnDiv.append(soundOnText);
soundOnBttn.append(soundOnDiv);
soundOnBttn.onclick = () => {
  if (menuMusic.onPause()) {
    menuMusic.play(false);
  } else {
    menuMusic.pause();
  }
};

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
};

const saveSettings = () => {
  Sound.globalVolume = soundRange.value;
};

const openMenu = () => {
  document.body.append(divMenu);
};

const closeMenu = () => {
  if (firstStart) {
    play.remove();
    about.remove();
    divText.remove();
    divMenu.append(resume);
    divMenu.append(restart);
    soundOnBttn.remove();
    menuMusic.pause();
  }
  divMenu.remove();
  if (settingsOpened) {
    toggleSettings();
  }

  if (dead) {
    dead = false;
    divMenu.append(resume);
    divMenu.append(settings);
    deadInfo.remove();
    restart.style.bottom = "15%";
  } else if (win) {
    win = false;
    divMenu.append(resume);
    divMenu.append(settings);
    winInfo.remove();
    restart.style.bottom = "15%";
    outro.stop();
  }

  firstStart = false;
};

const gameOver = (type) => {
  stopGame();
  resume.remove();
  settings.remove();
  if (type === "dead") {
    dead = true;
    divMenu.append(deadInfo);
    restart.style.bottom = "50%";
  } else {
    win = true;
    divMenu.append(winInfo);
    restart.style.bottom = "50%";
  }

  openMenu();
};

const startGame = () => {
  paused = false;
  lastTime = performance.now();
  requestId = RAF(loop);
};

const stopGame = () => {
  paused = true;
  cancelRAF(requestId);
};

document.body.append(soundOnBttn);
openMenu();
