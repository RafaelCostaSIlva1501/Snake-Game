const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Tamanho dos elementos no jogo
const size = 10;

//Controla o movimento da cobrinha (Liga e Desliga)
let moveON = true;

//Tamanho horizontal e vertical do Canvas
const canvasSize = {
    x: canvas.width,
    y: canvas.height,
};

//Menu de configurações
const settings = document.getElementById("settings");

//Botão para abrir o menu de configurações
document.getElementById("openSettings").addEventListener("click", function () {
    settings.style.display = "flex";
    moveON = false;
});

//Botão para fechar o menu de configurações
document.getElementById("closeSettings").addEventListener("click", function () {
    moveON = true;
    settings.style.display = "none";
    gameSettings();
});

//Configurações de estilo
let gridON = true;

let selfCollisionON = true;

snakeSpeed = 150;

let colorGame = {
    color1: "black",
    color2: "#111111",
    color3: "black",
};

let colorGrid = "#0000002d";

let colorSnake = {
    colorBody: "#ffffffd3",
    colorHead: "white",
};

let colorFood = "white";

const gameStyle = () => {
    //Define a cor de fundo do canvas
    const gradient = ctx.createLinearGradient(0, 0, canvasSize.x, canvasSize.y);
    gradient.addColorStop(0, colorGame.color1);
    gradient.addColorStop(0.5, colorGame.color2);
    gradient.addColorStop(1, colorGame.color3);

    // Define o gradiente como estilo de preenchimento
    ctx.fillStyle = gradient;

    // Desenha um retângulo preenchido com o gradiente
    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);

    //Tamanho das linhas e cor do grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = colorGrid;

    //Desenha o Grif (caso gridON esteja ativado)
    if (gridON) {
        for (let i = size; i < canvasSize.x; i += size) {
            //Desenha linhas na vertical
            ctx.beginPath();
            ctx.lineTo(i, 0);
            ctx.lineTo(i, canvasSize.x);
            ctx.stroke();

            //Desenha linhas na horizontal
            ctx.beginPath();
            ctx.lineTo(0, i);
            ctx.lineTo(canvasSize.x, i);
            ctx.stroke();
        }
    }
};

const gameSettings = () => {
    //Muda a velocidade da cobra para o minimo
    document.getElementById("minSpeed").addEventListener("click", function () {
        clearInterval(gameInterval);
        snakeSpeed = 210;
        playGame();
    });

    //Muda a velocidade da cobra para padrão
    document
        .getElementById("defaultSpeed")
        .addEventListener("click", function () {
            clearInterval(gameInterval);
            snakeSpeed = 150;
            playGame();
        });

    //Muda a velocidade da cobra para o máximo
    document.getElementById("maxSpeed").addEventListener("click", function () {
        clearInterval(gameInterval);
        snakeSpeed = 90;
        playGame();
    });

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
                Dpad.display = "grid"
                Dpad.marginTop = "5px"
                Dpad.gap = "5px"
            } else if (this === btnControls[1]) {
                Dpad.display = "flex"
                Dpad.marginTop = "15px"
                Dpad.gap = "10px"
            } else if (this === btnControls[2]) {
                Dpad.display = "none"
            }
        });
    }
};

//Cobrinha inicial
let snake = [
    { x: 10, y: 10 },
    { x: 20, y: 10 },
];

//Desenha a cobrinha dentro do canvas
const drawSnake = function () {
    ctx.fillStyle = colorSnake.colorBody;

    snake.forEach(function (position, index) {
        if (index == snake.length - 1) {
            ctx.fillStyle = colorSnake.colorHead;
            ctx.shadowColor = colorSnake.colorHead;
            ctx.shadowBlur = 10;
        }

        ctx.fillRect(position.x, position.y, size, size);

        ctx.shadowColor = colorSnake.colorBody;
        ctx.shadowBlur = 10;
    });
};

//Movimentação da cobrinha
let direction = "";

const moveSnake = function () {
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

document.getElementById("btnRight").addEventListener("click", function () {
    direction = "right";
});

document.getElementById("btnDown").addEventListener("click", function () {
    direction = "down";
});

document.getElementById("btnLeft").addEventListener("click", function () {
    direction = "left";
});

document.getElementById("btnUp").addEventListener("click", function () {
    direction = "up";
});

//Definindo botões para movimentar a cobrinha
document.addEventListener("keydown", function (event) {
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

//Comida inicial
const numRandom = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

const numPositionX = function () {
    const num = numRandom(0, canvasSize.x - size);
    return Math.round(num / 10) * 10;
};

const numPositionY = function () {
    const num = numRandom(0, canvasSize.y - size);
    return Math.round(num / 10) * 10;
};

//Comida
const food = {
    x: numPositionX(),
    y: numPositionY(),
};

//Desenha a comida dentro do canvas
const drawFood = function () {
    ctx.shadowColor = colorFood;
    ctx.shadowBlur = 20;
    ctx.fillStyle = colorFood;

    ctx.fillRect(food.x, food.y, size, size);

    ctx.shadowColor = colorSnake.colorBody;
    ctx.shadowBlur = 10;
};

const collision = () => {
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

    //Collisão em si mesmo
    const selfCollision = snake.find((position, index) => {
        return (
            index < snake.length - 2 &&
            position.x == headSnake.x &&
            position.y == headSnake.y
        );
    });

    //Colisão com a comida
    const foodCollision = headSnake.x == food.x && headSnake.y == food.y;

    if (wallCollision) {
        gameOver();
    } else if (selfCollision && selfCollisionON) {
        gameOver();
    } else if (foodCollision) {
        checkEat();
        scoreUpdate();
    } else if (selfCollision && selfCollisionON === false) {
        console.log("Foi!");
    }
};

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
};

const score = document.getElementById("score");

const scoreUpdate = () => {
    let scoreAtual = parseInt(score.innerHTML, 10);

    scoreAtual += 1;

    score.innerHTML = "" + scoreAtual;
};

const gameOver = () => {
    direction = undefined;
    canvas.style.filter = "blur(2px)";
    moveON = false;

    document.getElementById("GameOverDisplay").style.display = "flex";
};

document.getElementById("btnPlayAgain").addEventListener("click", function () {
    resetGame();
    playGame();
});

const draw = () => {
    drawSnake();
    drawFood();
};

const resetGame = () => {
    document.getElementById("StartGameDisplay").style.display = "none";
    document.getElementById("GameOverDisplay").style.display = "none";

    clearInterval(gameInterval);

    canvas.style.filter = "none";

    score.innerHTML = 0;

    moveON = true;

    snake = [
        { x: 10, y: 10 },
        { x: 20, y: 10 },
    ];

    food.x = numPositionX();
    food.y = numPositionY();
};

let gameInterval;

const playGame = () => {
    document.getElementById("StartGameDisplay").style.display = "none";
    document.getElementById("GameOverDisplay").style.display = "none";

    const food = {
        x: numPositionX(),
        y: numPositionY(),
    };

    gameInterval = setInterval(function () {
        ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

        gameStyle();
        draw();
        if (moveON) {
            moveSnake();
        }
        collision();
    }, snakeSpeed);
};

gameSettings();

let pauseGame = document.getElementById("pauseGame");
pauseGame.addEventListener("click", function () {
    moveON = false;
    unpauseGame.style.display = "inline-block";
    pauseGame.style.display = "none";
});

let unpauseGame = document.getElementById("unpauseGame");
unpauseGame.addEventListener("click", function () {
    moveON = true;
    unpauseGame.style.display = "none";
    pauseGame.style.display = "inline-block";
});
