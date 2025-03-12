// Importando módulos
import { DOM } from "./DOM.js";
import { canvas } from "./canvas.js";
import { settings } from "./settings.js";
import { env } from "./settings.js";
import { snake } from "./snake.js";
import { food } from "./food.js";

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

// Função para mostrar ou ocultar elementos da interface de forma simplificada
const display = (section, display) => {
  DOM[section].style.display = display;
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

// Se a chave 'updateVerification' ainda não existir no localStorage, inicializa como "false".
// Isso garante que o anúncio de atualização será exibido na primeira execução do jogo.
if (localStorage.getItem("updateVerification") === null) {
  localStorage.setItem("updateVerification", "false");
}

// Adiciona um evento de clique a cada botão para vizualizar a atualização.
DOM.btnUpdate.forEach((e) => {
  e.addEventListener("click", () => {
    // Alterna a visibilidade da seção de atualização.
    env.updateDisplay = !env.updateDisplay;

    // Se 'env.updateDisplay' for true, exibe a seção; caso contrário, esconde.
    env.updateDisplay ? display("update", "flex") : display("update", "none");

    // Registra no localStorage que o usuário já viu a atualização.
    localStorage.setItem("updateVerification", "true");
  });
});

// Se 'updateVerification' estiver como "false", significa que o usuário ainda não viu a atualização.
// Então, a seção de atualização será exibida automaticamente.
if (localStorage.getItem("updateVerification") === "false") {
  DOM.update.style.display = "flex";
}

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

// Adiciona eventos de clique aos botões de tema
DOM.btnTheme.forEach((e, i) => {
  e.addEventListener("click", () => {
    env.themeIndex = i; // Atualiza o índice do tema selecionado

    // Remove o destaque de todos os botões antes de aplicar ao selecionado
    DOM.btnTheme.forEach((element) => {
      element.style.background = "none"; // Reseta o estilo de fundo
    });

    // Aplica o destaque ao botão clicado
    e.style.backgroundColor = "#ffffff3a";
  });
});

// Função responsável por aplicar o tema selecionado ao jogo
const theme = () => {
  DOM.gameHeader.style.backgroundColor = settings.themes[env.themeIndex][1]; // Cor do cabeçalho
  DOM.gameScreen.style.backgroundColor = settings.themes[env.themeIndex][2]; // Cor do fundo do jogo
  canvas.color[0] = settings.themes[env.themeIndex][3]; // Cor primária do canvas
  canvas.color[1] = settings.themes[env.themeIndex][4]; // Cor secundária do canvas
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

// Controla o movimento da cobra
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && snake.direction.prev !== "down") {
    snake.direction.current = "up";
  } else if (event.key === "ArrowDown" && snake.direction.prev !== "up") {
    snake.direction.current = "down";
  } else if (event.key === "ArrowLeft" && snake.direction.prev !== "right") {
    snake.direction.current = "left";
  } else if (event.key === "ArrowRight" && snake.direction.prev !== "left") {
    snake.direction.current = "right";
  }

  snake.direction.prev = snake.direction.current;
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

// Encapsula a lógica de colisão
const collision = () => {
  foodCollision();
  wallCollision();
  selfCollision();
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
  clearInterval(env.gameInterval); // Limpa o intervalo de jogo
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

  snake.direction.current = "";
};

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

/*-~-~--~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-*/

// Loop do jogo
const loopGame = () => {
  env.gameInterval = setInterval(() => {
    snake.move();
    collision();
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

DOM.btnSettings.forEach((e) => {
  e.addEventListener("click", () => {
    env.settingsDisplay = !env.settingsDisplay;

    env.settingsDisplay
      ? display("settingsScreen", "flex")
      : display("settingsScreen", "none");
  });
});
