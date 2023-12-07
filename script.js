const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const score = document.getElementById("score")

const telaGameOver = document.querySelector(".game-over-menu")

const size = 10

//Desenha o grid dentro do canvas
const drawGrid = function() {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#788a9c48'

    for (let i = 10; i < canvas.width; i += 10) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 300)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(300, i)
        ctx.stroke()
    }
}

//Cobrinha inicial
let snake = [
    {x: 10, y:10},
    {x: 20, y:10},
]

//Desenha a cobra dentro do canvas
const drawSnake = function() {
    ctx.fillStyle = '#A7EB72'

    snake.forEach(function(position, index) {
        if(index == snake.length -1) {
            ctx.fillStyle = '#87eb3b';
        }

        ctx.fillRect(position.x, position.y, size, size)
    });
};

//Comida inicial
const numRandom = function(min, max) {
    return Math.round(Math.random() * (max -min) + min)
}

const numPosition = function() {
    const num = numRandom(0, canvas.width - size)
    return Math.round(num / 10) * 10
}

const food = {
    x: numPosition(),
    y: numPosition(),
    color: "red"
}

//Desenha a comida dentro do canvas
const drawFood = function() {

    ctx.shadowColor = food.color
    ctx.shadowBlur = 10
    ctx.fillStyle = food.color

    ctx.fillRect(food.x, food.y, size, size)

    ctx.shadowBlur = 0
}

function playAudio(sound) {
    const audio = new Audio(sound);
    
    audio.play();
}

const checkEat = function() {
    const headSnake = snake[snake.length -1]

    if ( headSnake.x == food.x && headSnake.y == food.y) {
        snake.push(headSnake)

        let x = numPosition()
        let y = numPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = numPosition()
            y = numPosition()
        }

        food.x = x
        food.y = y

        playAudio('audio/checkEat.mp3')

        let scoreAtual = parseInt(score.innerHTML, 10);
        
        scoreAtual += 1;

        score.innerHTML = '' + scoreAtual;
    }
} 

const collision = function() {
    const headSnake = snake[snake.length -1]
    const canvasLimit = canvas.width - size

    const wallCollision = headSnake.x < 0 || headSnake.x > canvasLimit || headSnake.y < 0 || headSnake.y > canvasLimit 

    const selfColision = snake.find((position, index) => {
        return index < snake.length -2 && position.x == headSnake.x && position.y == headSnake.y
    })

    if (wallCollision || selfColision)  {
        gameOver()
    }
}

const gameOver = function() {
    direction = undefined

    telaGameOver.style.display = "flex"

    let scoreFinal = document.querySelector(".score-final")

    scoreFinal.innerHTML = parseInt(score.innerHTML)

    canvas.style.filter = "blur(2px)"

    snake = [
        {x: 0, y: 0},
        {x: 0, y: 0},
    ]

    playAudio('audio/gameOver.mp3')
}

//Função para orientar as direções em que a cobra vai andar
let direction = ''
const moveSnake = function () {
    if (!direction) return

    const headSnake = snake[snake.length -1];
    
    snake.shift()

    if (direction == 'right') {
        snake.push({x: headSnake.x + size, y: headSnake.y})
    } else if (direction == 'down') {
        snake.push({x: headSnake.x, y: headSnake.y + size})
    } else if (direction == 'left') {
        snake.push({x: headSnake.x - size, y: headSnake.y})
    } else if (direction == 'up') {
        snake.push({x: headSnake.x, y: headSnake.y - size})
    }
}

const btnUp = document.getElementById("btnUp");
btnUp.addEventListener("click", function() {
    direction = 'up'
})

const btnRight = document.getElementById("btnRight");
btnRight.addEventListener("click", function() {
    direction = 'right'
})

const btnLeft = document.getElementById("btnLeft");
btnLeft.addEventListener("click", function() {
    direction = 'left'
})

const btnDown = document.getElementById("btnDown");
btnDown.addEventListener("click", function() {
    direction = 'down'
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

function playGame() {

    playAudio('audio/play.mp3')

    setInterval(function() {
        ctx.clearRect(0, 0, 300, 300)
    
        drawGrid()
        moveSnake()
        drawSnake()
        drawFood()
        checkEat()
        collision()
    }, 150);
}

//Inicia o jogo
let btnPlayGame = document.getElementById('btnPlayGame');
btnPlayGame.addEventListener('click', function() {
    playGame();

    var menuInicial = document.querySelector(".tela-inicial")
    menuInicial.style.display = "none"
})

//Pausa o jogo
let btnStopGame = document.getElementById('btnStopGame');
btnStopGame.addEventListener('click', function() {
    direction = ''
    playAudio('audio/stop.mp3')
})

//Jogar de novo
let btnPlayAgain = document.getElementById("btnPlayAgain");
btnPlayAgain.addEventListener("click", function() {

    score.innerHTML = "0"

    telaGameOver.style.display = "none"
    canvas.style.filter = "none"

    snake = [
        {x: 10, y:10},
        {x: 20, y:10},
    ]
})