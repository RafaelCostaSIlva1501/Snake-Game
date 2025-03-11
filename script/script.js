import { DOM } from "./DOM.js";
import { canvas } from "./canvas.js";
import { food } from "./food.js";
import { settings } from "./settings.js";
import { env } from "./settings.js";
import { snake } from "./snake.js";

const display = (section, display) => {
  DOM[section].style.display = display;
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

DOM.btnTheme.forEach((e, i) => {
  e.addEventListener("click", () => {
    env.themeIndex = i;

    // Reseta a escala de todos os botões antes de aplicar ao selecionado
    DOM.btnTheme.forEach((element) => {
      element.style.transform = "none";
      element.style.background = "none"
    });

    // Aplica o efeito ao botão clicado
    e.style.transform = "scale(1.2)";
    e.style.backgroundColor = "#ffffff3a"
  });
});

// Define o tema do jogo
const theme = () => {
  DOM.gameHeader.style.backgroundColor = settings.themes[env.themeIndex][1];
  DOM.gameScreen.style.backgroundColor = settings.themes[env.themeIndex][2];
  canvas.color[0] = settings.themes[env.themeIndex][3];
  canvas.color[1] = settings.themes[env.themeIndex][4];
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
let prevDirection = "";

// Controla o movimento da cobra
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && prevDirection !== "down") {
    snake.direction = "up";
  } else if (event.key === "ArrowDown" && prevDirection !== "up") {
    snake.direction = "down";
  } else if (event.key === "ArrowLeft" && prevDirection !== "right") {
    snake.direction = "left";
  } else if (event.key === "ArrowRight" && prevDirection !== "left") {
    snake.direction = "right";
  }

  prevDirection = snake.direction;
});

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
// Lógica de colisão da cobra com a comida
const foodCollision = () => {
  // Se a cobra pegar a comida ela cresce e uma nova comida é gerada
  if (snake.head().x == food.position.x && snake.head().y == food.position.y) {
    // Uma nova comida é gerada, mas nunca em cima da cobra
    while (
      snake.body.some(
        (position) =>
          position.x === food.position.x && position.y === food.position.y
      )
    ) {
      // Gera uma nova comida
      food.spawn();
    }

    // Aumenta o tamanho da cobra
    snake.grow();
    score();
  }
};

// Lógica de colisão com as paredes
const wallCollision = () => {
  const head = snake.head();

  // Verificando a colisão de maneira precisa
  if (
    head.x < 0 || // Se a cabeça da cobra passar do limite esquerdo
    head.y < 0 || // Se a cabeça da cobra passar do limite superior
    head.x >= DOM.canvas.width || // Se a cabeça da cobra ultrapassar o limite direito
    head.y >= DOM.canvas.height // Se a cabeça da cobra ultrapassar o limite inferior
  ) {
    gameOver(); // Aciona a função de Game Over
  }
};

// Lógica de colisão com a cobra
const selfCollision = () => {
  const head = snake.head();

  const check = snake.body.find((position, index) => {
    return (
      index < snake.body.length - 2 &&
      position.x === head.x &&
      position.y === head.y
    );
  });

  if (check) {
    gameOver();
  }
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
const score = () => {
  settings.score[0] = settings.score[0] + 1;
  DOM.score.innerHTML = settings.score[0];

  if (settings.score[0] > settings.score[1]) {
    settings.score[1] = settings.score[0];
    DOM.lastScore.innerHTML = settings.score[1];
  }
};

const resetScore = () => {
  DOM.finalScore.innerHTML = settings.score[0];

  settings.score[0] = 0;
  DOM.score.innerHTML = 0;
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

const draw = () => {
  canvas.drawBackground();
  snake.draw("border");
  food.draw();
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

const gameOver = () => {
  clearInterval(gameInterval); // Limpa o intervalo de jogo
  resetScore(); // Reseta o placar
  display("gameScreen", "none"); // Esconde a tela do jogo
  display("gameoverScreen", "flex"); // Exibe a tela de Game Over
};

const gameReset = () => {
  // Reinicia a cobra para o estado inicial
  snake.body = [
    { x: 20, y: 20 },
    { x: 40, y: 20 },
  ];

  snake.direction = "";
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

let gameInterval;

// Loop do jogo
const loopGame = () => {
  gameInterval = setInterval(() => {
    snake.move();
    foodCollision();
    wallCollision();
    selfCollision();
    theme();
    draw();
  }, settings.speed);
};

DOM.btnPlayGame.addEventListener("click", () => {
  display("startScreen", "none");
  display("gameScreen", "flex");

  food.spawn();

  loopGame();
});

DOM.btnPlayAgain.addEventListener("click", () => {
  display("gameoverScreen", "none");
  display("gameScreen", "flex");

  gameReset();

  food.spawn();

  loopGame();
});

let settingsDisplay = false;

DOM.btnSettings.forEach((e) => {
  e.addEventListener("click", () => {
    settingsDisplay = !settingsDisplay;

    settingsDisplay
      ? display("settingsScreen", "flex")
      : display("settingsScreen", "none");
  });
});

// Inicializa 'updateVerification' como "false" caso ainda não tenha sido definido
if (localStorage.getItem("updateVerification") === null) {
  localStorage.setItem("updateVerification", "false");
}

let updateDisplay = false;

DOM.btnUpdate.forEach((e) => {
  e.addEventListener("click", () => {
    updateDisplay = !updateDisplay;

    updateDisplay ? display("update", "flex") : display("update", "none");
    localStorage.setItem("updateVerification", "true");
  });
});

// Verifica se 'updateVerification' é "true" e esconde o anúncio
if (localStorage.getItem("updateVerification") === "true") {
  DOM.update.style.display = "none";
}
