const canvas = document.getElementById("canvas"); //Canvas
const ctx = canvas.getContext("2d"); //Contexto do canvas

const containerScreen = document.querySelector(".game");

const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");
const gameoverScreen = document.querySelector(".gameover-screen");
const settingsScreen = document.querySelector(".settings-screen");

const btnPlayGame = document.getElementById("btnPlayGame"); //Botão que inicia o jogo
const btnPlayAgain = document.querySelectorAll(".play-again"); //Botão que reinicia o jogo

const btnPauseGame = document.getElementById("btnPauseGame"); //Botão para pausar o jogo
const pauseIcon = document.querySelector(".change-pause-icon"); //Botão para pausar o jogo

const btnOpenSettings = document.querySelectorAll(".open-settings"); //Botão para abrir o modal de configurações
const btnCloseSettings = document.querySelectorAll(".close-settings"); //Botão para fecha o modal de configurações

const Dpad = document.getElementById("Dpad");
const btnUp = document.getElementById("btnUp");
const btnRight = document.getElementById("btnRight");
const btnDown = document.getElementById("btnDown");
const btnLeft = document.getElementById("btnLeft");

const buttonSpeed = document.querySelectorAll(".button-speed");
const buttonGrid = document.querySelector(".button-grid");
const gridIcon = document.querySelector(".grid-icon");

const buttonBackgroundColor = document.querySelectorAll(
  ".button-background-color"
);

const buttonSnakeColor = document.querySelectorAll(".button-snake-color");

/*-----Configurações do canvas-----*/
const size = 10; //Tamanho dos elementos no jogo

// Tamanho do canvas
let canvasSize = {
  x: canvas.width,
  y: canvas.height,
};

// Função para ajustar o tamanho da tela de game
const setGameScreen = () => {
  let windowX = window.innerWidth;
  let windowY = window.innerHeight;

  if (windowX > windowY) {
    horizontalScreen(windowX, windowY);
    setHorizontalCanvas(windowX, windowY);
    Dpad.style.display = "none";
  } else {
    verticalScreen(windowX);
    setVerticalCanvas(windowX);
    Dpad.style.display = "grid";
  }
};

const horizontalScreen = (numX, numY) => {
  containerScreen.style.width = `${numX - 100}px`;
  containerScreen.style.height = `${numY - 100}px`;
};

const setHorizontalCanvas = (numX, numY) => {
  let horizontalX = Math.round(numX / 10) * 10 - 200;
  let horizontalY = Math.round(numY / 10) * 10 - 200;

  canvas.width = horizontalX;
  canvas.height = horizontalY;

  canvasSize.x = horizontalX;
  canvasSize.y = horizontalY;
};

const verticalScreen = (numX) => {
  containerScreen.style.width = `${numX / 2 + 100}px`;
  containerScreen.style.height = `${numX / 2 + 100}px`;
};

const setVerticalCanvas = (numX) => {
  let horizontalX = Math.round(numX / 10) * 10;
  let horizontalY = Math.round(numX / 10) * 10 - 100;

  canvas.width = horizontalX;
  canvas.height = horizontalY;

  canvasSize.x = horizontalX;
  canvasSize.y = horizontalY;
};

setGameScreen();

window.addEventListener("resize", setGameScreen);

const canvasLimitX = canvasSize.x - size; //Limite horizontal do canvas
const canvasLimitY = canvasSize.y - size; //Limite vertical do canvas

//Cor de fundo do jogo
let colorGame = {
  color1: "#1a2625",
  color2: "#1d803b",
  color3: "#1a2625",
};

const drawBackground = () => {
  //Define a cor de fundo do canvas
  const gradient = ctx.createLinearGradient(0, 0, canvasSize.x, canvasSize.y);

  gradient.addColorStop(0, colorGame.color1);
  gradient.addColorStop(0.5, colorGame.color2);
  gradient.addColorStop(1, colorGame.color3);

  // Define o gradiente como estilo de preenchimento
  ctx.fillStyle = gradient;

  // Desenha um retângulo preenchido com o gradiente
  ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
};

let gridON = true; //Liga e desliga o grid

let colorGrid = "black"; //Cor do grid

/*-----Configurações da cobrinha-----*/

//Tamanho inicial da cobrinha
let snake = [
  { x: 10, y: 10 },
  { x: 20, y: 10 },
];

//Cor da cobrinha
let colorSnake = {
  colorBody: "#83d420",
  colorHead: "#77c21c",
};

const drawSnake = () => {
  //Desenha a cobrinha dentro do canvas
  ctx.fillStyle = colorSnake.colorBody;

  snake.forEach(function (position, index) {
    if (index == snake.length - 1) {
      ctx.fillStyle = colorSnake.colorHead;
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

/*-----Configurações de movimento-----*/

let moveON = true; //Liga e desliga o movimento da cobrinha

let direction = ""; //Direção da cobrinha

snakeSpeed = 150; //Velocidade da cobrinha

//Controla para qual direção a cobra deve se mover
const moveSnake = () => {
  if (!direction) return;

  const headSnake = snake[snake.length - 1];

  snake.shift();

  if (direction == "right") {
    snake.push({ x: headSnake.x + size, y: headSnake.y });
  } else if (direction == "down") {
    snake.push({ x: headSnake.x, y: headSnake.y + size });
  } else if (direction == "left") {
    snake.push({ x: headSnake.x - size, y: headSnake.y });
  } else if (direction == "up") {
    snake.push({ x: headSnake.x, y: headSnake.y - size });
  }
};

//Botão no D-pad para movimentar para cima
btnUp.addEventListener("click", () => {
  direction = "up";
});

//Botão no D-pad para movimentar para direita
btnRight.addEventListener("click", () => {
  direction = "right";
});

//Botão no D-pad para movimentar para baixo
btnDown.addEventListener("click", () => {
  direction = "down";
});

//Botão no D-pad para movimentar para esquerda
btnLeft.addEventListener("click", () => {
  direction = "left";
});

//Botões do teclado para movimentar a cobrinha
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
});

/*-----Configurações da comida-----*/

let colorFood = "red"; //Cor da comida

//Comida inicial
const numRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const numPositionX = () => {
  const num = numRandom(0, canvasSize.x - size);
  return Math.round(num / 10) * 10;
};

const numPositionY = () => {
  const num = numRandom(0, canvasSize.y - size);
  return Math.round(num / 10) * 10;
};

//Posição da comida
const food = {
  x: numPositionX(),
  y: numPositionY(),
};

//Desenha a comida dentro do canvas
const drawFood = () => {
  ctx.shadowColor = colorFood;
  ctx.shadowBlur = 20;
  ctx.fillStyle = colorFood;

  ctx.fillRect(food.x, food.y, size, size);

  ctx.shadowColor = colorSnake.colorBody;
  ctx.shadowBlur = 10;
};

/*-----Configurações de colisão-----*/

let selfCollisionON = true; //Liga e desliga a colisão consigo

const foodCollision = () => {
  //Define a cabeça da cobra para colisão
  const headSnake = snake[snake.length - 1];

  //Colisão com a comida
  const foodCollision = headSnake.x == food.x && headSnake.y == food.y;

  if (foodCollision) {
    checkEat();
  }
};

const wallCollision = () => {
  //Define a cabeça da cobra para colisão
  const headSnake = snake[snake.length - 1];

  //Define o limite do canvas
  const canvasLimitX = canvasSize.x - size;
  const canvasLimitY = canvasSize.y - size;

  //Colisão com as paredes
  const wallCollision =
    headSnake.x < 0 ||
    headSnake.x > canvasLimitX ||
    headSnake.y < 0 ||
    headSnake.y > canvasLimitY;

  if (wallCollision) {
    gameOver();
  }
};

const selfCollision = () => {
  //Define a cabeça da cobra para colisão
  const headSnake = snake[snake.length - 1];

  const selfCollision = snake.find((position, index) => {
    return (
      index < snake.length - 2 &&
      position.x == headSnake.x &&
      position.y == headSnake.y
    );
  });

  if (selfCollision && selfCollisionON) {
    gameOver();
  }
};

const collision = () => {
  foodCollision();
  wallCollision();
  selfCollision();
};

/*-----Resultados das colisões-----*/

//Atualiza posição da comida
const checkEat = () => {
  const headSnake = snake[snake.length - 1];
  snake.push(headSnake);

  let x = numPositionX();
  let y = numPositionY();

  while (snake.find((position) => position.x == x && position.y == y)) {
    x = numPositionX();
    y = numPositionY();
  }

  food.x = x;
  food.y = y;

  scoreUpdate();
};

//Score
const score = document.getElementById("score");

//Atualiza o score
const scoreUpdate = () => {
  let scoreAtual = parseInt(score.innerHTML, 10);

  scoreAtual += 10;

  score.innerHTML = "" + scoreAtual;

  console.log(scoreAtual);
};

//Termina o jogo
const gameOver = () => {
  moveON = false;
  direction = undefined;

  gameoverScreen.style.display = "flex";
};

//Botão para reiniciar o jogo
btnPlayAgain.forEach((e) => {
  e.addEventListener("click", () => {
    resetGame();
  });
});

//Reset do jogo
const resetGame = () => {
  clearInterval(gameInterval);

  canvas.style.filter = "none";

  moveON = true;

  snake = [
    { x: 10, y: 10 },
    { x: 20, y: 10 },
  ];

  food.x = numPositionX();
  food.y = numPositionY();

  startScreen.style.display = "flex";
  gameScreen.style.display = "none";
  gameoverScreen.style.display = "none";
};

/*-----Configurações para iniciar o jogo-----*/

//Desenha os elementos do canvas
const draw = () => {
  drawBackground();
  drawGrid();
  drawSnake();
  drawFood();
};

//intervalo do jogo
let gameInterval;

//Dá início ao jogo
const playGame = () => {
  const food = {
    x: numPositionX(),
    y: numPositionY(),
  };

  gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

    draw();

    if (moveON) {
      moveSnake();
    }
    collision();
  }, snakeSpeed);
};

//Botão para iniciar o jogo
btnPlayGame.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";

  playGame();
});

/*-----Configurações de jogo-----*/

//Botão para pausar e despausar o jogo
btnPauseGame.addEventListener("click", () => {
  if (moveON) {
    moveON = false;
    pauseIcon.innerHTML = "play_arrow";
  } else {
    moveON = true;
    pauseIcon.innerHTML = "pause";
  }
});

//Botão para abriro menu de configurações
btnOpenSettings.forEach((e) => {
  e.addEventListener("click", () => {
    moveON = false;

    settingsScreen.style.display = "flex";
    startScreen.style.display = "none";
  });
});

btnCloseSettings.forEach((e) => {
  e.addEventListener("click", () => {
    moveON = true;

    settingsScreen.style.display = "none";
    startScreen.style.display = "flex";
  });
});

//Altera a velocidade da cobrinha
buttonSpeed.forEach((e, i) => {
  e.addEventListener("click", () => {
    clearInterval(gameInterval);

    snakeSpeed = parseInt(e.dataset.speed);

    buttonSpeed.forEach((e) => {
      e.style.backgroundColor = "#7ff26d";
      e.style.color = "#1a2625";
    });

    e.style.backgroundColor = "#1d803b";
  });
});

const drawGrid = () => {
  //Tamanho das linhas e cor do grid
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = colorGrid;

  if (gridON) {
    for (let i = size; i < canvasSize.x; i += size) {
      //Desenha linhas na vertical
      ctx.beginPath();
      ctx.lineTo(i, 0);
      ctx.lineTo(i, canvasSize.x);
      ctx.stroke();
    }

    for (let i = size; i < canvasSize.x; i += size) {
      //Desenha linhas na vertical
      ctx.beginPath();
      ctx.lineTo(0, i);
      ctx.lineTo(canvasSize.x, i);
      ctx.stroke();
    }
  }
};

buttonBackgroundColor.forEach((e) => {
  e.addEventListener("click", () => {
    colorGame.color1 = e.dataset.color1;
    colorGame.color2 = e.dataset.color2;
    colorGame.color3 = e.dataset.color3;
  });
});

buttonGrid.addEventListener("click", () => {
  gridON = !gridON; // Alterna o valor de gridON

  gridIcon.innerHTML = gridON ? "toggle_on" : "toggle_off";
  gridIcon.style.color = gridON ? "#7ff26d" : "#e3eed9";
});

buttonSnakeColor.forEach((e) => {
  e.addEventListener("click", () => {
    colorSnake.colorHead = e.dataset.color1;
    colorSnake.colorBody = e.dataset.color2;
  });
});

const gameSettings = () => {
  //Botão para ativar e desativar o grid
  const gridOnOff = document.getElementById("gridOnOff");

  //Verifica se está ligado ou desligado
  if (gridOnOff.checked) {
    gridON = true;
  } else {
    gridON = false;
  }

  const selfCollisionOnOff = document.getElementById("selfCollisionOnOff");

  if (selfCollisionOnOff.checked) {
    selfCollisionON = true;
  } else {
    selfCollisionON = false;
  }

  const btnSnakeColor = document.getElementsByClassName("btnSnakeColor");

  for (let i = 0; i < btnSnakeColor.length; i++) {
    btnSnakeColor[i].addEventListener("click", function () {
      if (this === btnSnakeColor[0]) {
        colorSnake.colorBody = "#d82b2b";
        colorSnake.colorHead = "#ff0000";
      } else if (this === btnSnakeColor[1]) {
        colorSnake.colorBody = "#9c39c4";
        colorSnake.colorHead = "#6c2b86";
      } else if (this === btnSnakeColor[2]) {
        colorSnake.colorBody = "#eeee5a";
        colorSnake.colorHead = "#ffff00";
      } else if (this === btnSnakeColor[3]) {
        colorSnake.colorBody = "#4090f8";
        colorSnake.colorHead = "#006eff";
      } else if (this === btnSnakeColor[4]) {
        colorSnake.colorBody = "#f8642e";
        colorSnake.colorHead = "#ff4500";
      } else if (this === btnSnakeColor[5]) {
        colorSnake.colorBody = "#4dc942";
        colorSnake.colorHead = "#1b9c0f";
      }
    });
  }

  const btnFoodColor = document.getElementsByClassName("btnFoodColor");

  for (let i = 0; i < btnFoodColor.length; i++) {
    btnFoodColor[i].addEventListener("click", function () {
      if (this === btnFoodColor[0]) {
        colorFood = "#9c0000";
      } else if (this === btnFoodColor[1]) {
        colorFood = "#71009e";
      } else if (this === btnFoodColor[2]) {
        colorFood = "#afaf00";
      } else if (this === btnFoodColor[3]) {
        colorFood = "#00459e";
      } else if (this === btnFoodColor[4]) {
        colorFood = "#b12f00";
      } else if (this === btnFoodColor[5]) {
        colorFood = "#096800";
      }
    });
  }

  const btnControls = document.getElementsByClassName("btnControls");

  for (let i = 0; i < btnControls.length; i++) {
    btnControls[i].addEventListener("click", function () {
      const Dpad = document.getElementById("Dpad").style;

      if (this === btnControls[0]) {
        Dpad.display = "grid";
        Dpad.marginTop = "5px";
        Dpad.gap = "5px";
      } else if (this === btnControls[1]) {
        Dpad.display = "flex";
        Dpad.marginTop = "15px";
        Dpad.gap = "10px";
      } else if (this === btnControls[2]) {
        Dpad.display = "none";
      }
    });
  }
};
