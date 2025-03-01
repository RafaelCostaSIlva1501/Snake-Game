import { DOM } from "./DOM.js";
import { canvas } from "./canvas.js";
import { food } from "./food.js";
import { settings } from "./settings.js";
import { snake } from "./snake.js";

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
// Define o tema do jogo
const theme = (num) => {
  DOM.main.style.background = `linear-gradient(to bottom, ${settings.themes[num][3]}, ${settings.themes[num][4]}, ${settings.themes[num][3]})`;
  DOM.gameHeader.style.backgroundColor = settings.themes[num][1];
  DOM.gameScreen.style.backgroundColor = settings.themes[num][2];
  canvas.color[0] = settings.themes[num][3];
  canvas.color[1] = settings.themes[num][4];
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
// Controla o movimento da cobra
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && snake.direction !== "down") {
    snake.direction = "up";
  } else if (event.key === "ArrowDown" && snake.direction !== "up") {
    snake.direction = "down";
  } else if (event.key === "ArrowLeft" && snake.direction !== "right") {
    snake.direction = "left";
  } else if (event.key === "ArrowRight" && snake.direction !== "left") {
    snake.direction = "right";
  }
});

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
// Lógica de colisão da cobra com a comida
const collisionFood = () => {
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

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/
const score = () => {
  settings.score[0] = settings.score[0] + 1;
  settings.score[1] = settings.score[0];

  DOM.score.innerHTML = settings.score[0];
  DOM.lastScore.innerHTML = settings.score[1];
};

const resetScore = () => {
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

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

// Inicia o jogo
const loopGame = () => {
  draw();
  snake.move();
  collisionFood();
  theme(0);
};

DOM.btnPlayGame.addEventListener("click", () => {
  DOM.startScreen.style.display = "none";

  food.spawn();

  // Loop para rodar o jogo
  const intervalo = setInterval(() => {
    loopGame();
  }, 100);
});
