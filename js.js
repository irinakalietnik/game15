document.addEventListener("DOMContentLoaded", function () {
  class BlueTheme {
    setcolor() {
      document.documentElement.style.setProperty("--main-dark", "#356794");
      document.documentElement.style.setProperty("--main-light", "#b1cafc");
      document.documentElement.style.setProperty("--border", "#b4bacc");
      document.documentElement.style.setProperty("--container", "#dee0c2");
    }
  }

  class BrownTheme {
    setcolor() {
      document.documentElement.style.setProperty("--main-dark", "#796c4a");
      document.documentElement.style.setProperty("--main-light", "#fcd875");
      document.documentElement.style.setProperty("--border", "#ac9d9d");
      document.documentElement.style.setProperty("--container", "#e7e1ad");
    }
  }

  class Theme {
    constructor() {
      this.blue = new BlueTheme();
      this.brown = new BrownTheme();
    }

    changeColor(color) {
      if (color === "blue") {
        return this.blue.setcolor();
      }
      if (color === "brown") {
        return this.brown.setcolor();
      }
    }
  }

  class RandomArr {
    constructor(numbOfCells) {
      this.numbOfCells = numbOfCells;
      this.arrNumb = [];
    }
    getRanomNumb() {
      return Math.floor(Math.random() * this.numbOfCells);
    }
    createArrNumb() {
      if (this.arrNumb.length === 0) {
        this.arrNumb.push(this.getRanomNumb());
      }

      outer: while (true) {
        let r = this.getRanomNumb();
        for (let n of this.arrNumb) {
          if (n === r) continue outer;
        }
        this.arrNumb.push(r);
        if (this.arrNumb.length + 1 === this.numbOfCells + 1) break;
      }
      return this.arrNumb;
    }
  }

  class BoxCells {
    constructor() {
      this.mainBox = document.getElementsByClassName("main-box")[0];
      this.elements = {};
    }

    createElem(numbOfCells) {
      this.mainBox.innerHTML = "";

      let numb = new RandomArr(numbOfCells).createArrNumb();

      if (numbOfCells === 16) {
        this.mainBox.style.gridTemplateColumns = "repeat(4, 1fr)";
        this.mainBox.style.gridTemplateRows = "repeat(4, 1fr)";
      }
      if (numbOfCells === 9) {
        this.mainBox.style.gridTemplateColumns = "repeat(3, 1fr)";
        this.mainBox.style.gridTemplateRows = "repeat(3, 1fr)";
      }
      if (numbOfCells === 25) {
        this.mainBox.style.gridTemplateColumns = "repeat(5, 1fr)";
        this.mainBox.style.gridTemplateRows = "repeat(5, 1fr)";
      }

      let fragment = document.createDocumentFragment();
      for (let i = 0; i < numbOfCells; i++) {
        this.elements[i] = document.createElement("div");
        this.elements[i].textContent = numb[i];

        if (numb[i] === 0) {
          this.elements[i].classList.add("hidden");
        } else {
          this.elements[i].classList.add("numb-box");
        }

        fragment.appendChild(this.elements[i]);
      }
      this.mainBox.appendChild(fragment);
    }

    onclickUser(result) {
      let clicks = 0;

      this.mainBox.addEventListener("click", function (event) {
        if (!stopFunc) return false;
        if (result === "time" && result !== "click") {
          document.getElementById("resultC").textContent = 0;
        }
        if (result === "click" && result !== "time") {
          clicks++;
          document.getElementById("resultC").textContent = clicks;
        }
        let eventHeight = event.target.offsetHeight;
        let eventWidth = event.target.offsetWidth;
        let emptyCell = document.getElementsByClassName("hidden")[0];
        let eventX = event.target.offsetLeft;
        let eventY = event.target.offsetTop;

        if (
          (emptyCell.offsetLeft === eventX &&
            emptyCell.offsetTop + eventHeight + 8 === eventY) ||
          (emptyCell.offsetLeft === eventX &&
            emptyCell.offsetTop - eventHeight - 8 === eventY) ||
          (emptyCell.offsetTop === eventY &&
            emptyCell.offsetLeft + eventWidth + 8 === eventX) ||
          (emptyCell.offsetTop === eventY &&
            emptyCell.offsetLeft - eventWidth - 8 === eventX)
        ) {
          emptyCell.textContent = event.target.textContent;
          event.target.classList = "hidden";
          event.target.classList.remove("numb-box");

          emptyCell.classList.remove("hidden");

          emptyCell.classList.add("numb-box");
          event.target.textContent = 0;
        }

        new EndGame().finishGame();
      });
    }
  }

  function chooseOptions() {
    let input = document.querySelectorAll("input");
    for (let i = 0; i < input.length; i++) {
      if (input[i].checked == true) {
        return input[i].id;
      }
    }
  }

  class SettingTheme {
    constructor() {
      this.theme = new Theme();
      this.select = document.getElementById("theme");
    }

    chooseTheme() {
      let option = this.select.children;
      for (let i = 0; i < option.length; i++) {
        if (option[i].selected == true) {
          return this.theme.changeColor(option[i].value);
        }
      }
    }
  }

  class EndGame {
    constructor() {
      this.sizefield = new BoxCells();
    }
    finishGame() {
      let options = chooseOptions();
      audio.preload = "auto";
      audio.src = "./audio/a2.mp3";

      let numbersBox = mainBox.children;
      for (let i = 1; i < numbersBox.length; i++) {
        if (numbersBox[i - 1].textContent != i) {
          return false;
        }
        // if (numbersBox[0].textContent != 5) {
        //   return false;
        // }
      }
      audio.play();
      if (options === "click") {
        resultGame.textContent = `Your result: ${resultClicks.textContent} clicks`;
      }
      if (options === "time") {
        resultGame.textContent = `Your game time : ${resultTime.textContent} `;
        stopInterval();
      }

      resultModal.classList.remove("is-hidden");
      resultTime.textContent = 0;
      resultClicks.textContent = 0;
      this.sizefield.createElem(Number(size.value));
      btnStart.style.backgroundColor = "#b4bacc";
      stopFunc = false;
      btnClose.onclick = function () {
        resultModal.classList.add("is-hidden");
      };
    }
  }

  min = 0;
  hour = 0;
  sec = 0;
  let intervalid;
  function tick() {
    resultClicks.textContent = 0;

    sec++;
    if (sec >= 60) {
      min++;
      sec = sec - 60;
    }
    if (min >= 60) {
      hour++;
      min = min - 60;
    }
    if (sec < 10) {
      if (min < 10) {
        if (hour < 10) {
          resultTime.textContent = "0" + hour + ":0" + min + ":0" + sec;
        } else {
          resultTime.textContent = hour + ":0" + min + ":0" + sec;
        }
      } else {
        if (hour < 10) {
          resultTime.textContent = "0" + hour + ":" + min + ":0" + sec;
        } else {
          resultTime.textContent = hour + ":" + min + ":0" + sec;
        }
      }
    } else {
      if (min < 10) {
        if (hour < 10) {
          resultTime.textContent = "0" + hour + ":0" + min + ":" + sec;
        } else {
          resultTime.textContent = hour + ":0" + min + ":" + sec;
        }
      } else {
        if (hour < 10) {
          resultTime.textContent = "0" + hour + ":" + min + ":" + sec;
        } else {
          resultTime.textContent = hour + ":" + min + ":" + sec;
        }
      }
    }
  }
  function stopInterval() {
    clearInterval(intervalid);
    sec = 0;
    hour = 0;
    min = 0;
  }
  function startInterval() {
    intervalid = setInterval(() => {
      tick();
    }, 1000);
  }
  const resultTime = document.getElementById("resultT");
  const resultClicks = document.getElementById("resultC");
  const btnClose = document.getElementById("btnClose");
  const resultModal = document.getElementsByClassName("result-modal")[0];
  const resultGame = document.getElementById("resultGame");
  const mainBox = document.getElementsByClassName("main-box")[0];
  const btnStart = document.getElementById("start");
  const bottomPanel = document.getElementsByClassName("bottom-panel")[0];

  const audio = new Audio();

  const settingTheme = new SettingTheme();

  const boxNambers = new BoxCells();

  boxNambers.createElem(Number(size.value));

  btnStart.addEventListener("click", startGame);

  function startGame() {
    let options = chooseOptions();

    stopInterval();
    btnStart.style.backgroundColor = "#dee0c2";
    if (options === "time") {
      startInterval();
    }
    if (options === "click") {
      document.getElementById("resultT").textContent = 0;
    }
    stopFunc = true;
    boxNambers.onclickUser(options);
  }

  document.getElementById("refresh").onclick = function () {
    btnStart.style.backgroundColor = "#b4bacc";
    resultTime.textContent = 0;
    resultClicks.textContent = 0;
    stopFunc = false;
    stopInterval();
    boxNambers.createElem(Number(size.value));
  };

  document.addEventListener("change", function (event) {
    stopInterval();
    btnStart.style.backgroundColor = "#b4bacc";
    stopFunc = false;
    if (event.target.id === "size") {
      boxNambers.createElem(Number(size.value));
    }
    if (event.target.id === "theme") {
      settingTheme.chooseTheme();
    }
  });
});
