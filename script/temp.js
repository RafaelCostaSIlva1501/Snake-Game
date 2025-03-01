import { DOM } from "./DOM.js";
import { snake } from "./snake.js";

/*-----Configurações da cobrinha-----*/

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

let colorFood = "#cc1d1d"; //Cor da comida

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

  playAudio();
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

let scoreAtual = 0;

//Atualiza o score
const scoreUpdate = () => {
  scoreAtual += 10;

  score.innerHTML = "" + scoreAtual;
};

//Termina o jogo
const gameOver = () => {
  moveON = false;
  direction = undefined;

  score.innerHTML = "0";
  finalScore.innerHTML = scoreAtual;

  canvas.style.display = "none";
  gameoverScreen.style.display = "flex";
};

//Botão para reiniciar o jogo
btnPlayAgain.addEventListener("click", () => {
  clearInterval(gameInterval);
  moveON = true;

  snake = [
    { x: 10, y: 10 },
    { x: 20, y: 10 },
  ];

  gameoverScreen.style.display = "none";
  startScreen.style.display = "flex";
});

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
  scoreAtual = 0;

  if (window.innerHeight > window.innerWidth) {
    Dpad.style.display = "grid";
  }

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
  canvas.style.display = "flex";

  playGame();
});

/*-----Configurações de jogo-----*/

//Botão para abrir o menu de configurações
btnOpenSettings.addEventListener("click", () => {
  settingsScreen.style.display = "flex";
  startScreen.style.display = "none";
});

btnCloseSettings.forEach((e) => {
  e.addEventListener("click", () => {
    moveON = true;

    settingsScreen.style.display = "none";
    startScreen.style.display = "flex";
  });
});

//Altera a cor de fundo
buttonBackgroundColor.forEach((e) => {
  e.addEventListener("click", () => {
    colorGame.color1 = e.dataset.color1;
    colorGame.color2 = e.dataset.color2;
    colorGame.color3 = e.dataset.color3;
  });
});

//Altera a cor da cobrinha
buttonSnakeColor.forEach((e) => {
  e.addEventListener("click", () => {
    colorSnake.colorHead = e.dataset.color1;
    colorSnake.colorBody = e.dataset.color2;
  });
});

//Altera a cor da comida
buttonFoodColor.forEach((e) => {
  e.addEventListener("click", () => {
    colorFood = e.dataset.color;
  });
});

buttonGrid.addEventListener("click", () => {
  grid.state = !grid.state; // Alterna o valor de gridON

  toggleButton[0].innerHTML = grid.state ? "toggle_on" : "toggle_off";
  toggleButton[0].style.color = grid.state ? "#53d831" : "#747474";
});

buttonCollision.addEventListener("click", () => {
  selfCollisionON = !selfCollisionON; // Alterna o valor de selfCollisionON

  toggleButton[1].innerHTML = selfCollisionON ? "toggle_on" : "toggle_off";
  toggleButton[1].style.color = selfCollisionON ? "#53d831" : "#747474";
});

// Altera a velocidade da cobrinha
buttonSpeed.forEach((e, index) => {
  // Define uma cor específica para o segundo botão ao iniciar
  if (index === 1) {
    e.style.backgroundColor = "#368a20"; // Cor inicial para o segundo botão
  }

  e.addEventListener("click", () => {
    clearInterval(gameInterval);
    snakeSpeed = parseInt(e.dataset.speed);

    // Reseta as cores de todos os botões
    buttonSpeed.forEach((e) => {
      e.style.backgroundColor = "#53d831";
    });

    // Destaca o botão clicado
    e.style.backgroundColor = "#368a20";
  });
});

/*-----Efeitos sonoros-----*/

const playAudio = (audioFile, elementClass, event) => {
  const buttons = document.querySelectorAll(`.${elementClass}`);

  buttons.forEach((button) => {
    button.addEventListener(event, () => {
      const audio = new Audio(`../audio/${audioFile}.wav`);
      audio.play();
    });
  });
};

playAudio("sound-hover-button", "play-game", "mouseover");
playAudio("sound-hover-button", "open-settings", "mouseover");
playAudio("sound-hover-button", "play-again", "mouseover");
