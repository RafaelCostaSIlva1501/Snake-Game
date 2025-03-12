import { DOM } from "./DOM.js";
import { canvas } from "./canvas.js";

export const snake = {
  // Corpo da cobra
  body: [
    { x: 20, y: 20 },
    { x: 40, y: 20 },
  ],

  // Cabeça da cobra
  head: function () {
    const head = this.body[this.body.length - 1];
    return head;
  },

  size: 20,

  // Cores da cobra
  color: {
    head: "#7CCF00", // Cor da cabeça
    body: "#9AE600", // Cor do corpo
    border: "#3C6300", // Cor da borda
  },

  // Direção da cobra
  direction: {
    current: "",
    prev: "",
  },

  // Função que desenha a cobra
  draw: function (style) {
    if (style === "border") {
      this.body.forEach((position, index) => {
        // Define a cor da cabeça e do corpo
        DOM.ctx.fillStyle =
          index === this.body.length - 1 ? this.color.head : this.color.body;

        // Desenha o corpo/cabeça com borda
        DOM.ctx.fillRect(position.x, position.y, this.size, this.size);

        // Adiciona borda preta para separar os segmentos
        DOM.ctx.strokeStyle = this.color.border;
        DOM.ctx.lineWidth = 2;
        DOM.ctx.strokeRect(position.x, position.y, this.size, this.size);
      });
    }

    if (style === "lgbt") {
      this.body.forEach((position, index) => {
        const colors = [
          "#FF0000",
          "#FF7F00",
          "#FFFF00",
          "#00FF00",
          "#0000FF",
          "#4B0082",
          "#9400D3",
        ];
        DOM.ctx.fillStyle = colors[index % colors.length]; // Alterna entre as cores do arco-íris
        DOM.ctx.fillRect(position.x, position.y, this.size, this.size);
      });
    }
  },

  // Função que move a cobra
  move: function () {
    if (!this.direction.current) return; // Se a direção não for definida, não faz nada.

    const headSnake = this.body[this.body.length - 1]; // Acessa a cabeça da cobrinha.

    // Adiciona um novo segmento dependendo da direção
    if (this.direction.current === "right") {
      this.body.push({ x: headSnake.x + canvas.block, y: headSnake.y });
    } else if (this.direction.current === "down") {
      this.body.push({ x: headSnake.x, y: headSnake.y + canvas.block });
    } else if (this.direction.current === "left") {
      this.body.push({ x: headSnake.x - canvas.block, y: headSnake.y });
    } else if (this.direction.current === "up") {
      this.body.push({ x: headSnake.x, y: headSnake.y - canvas.block });
    }

    // Remove o último segmento da cobra
    this.body.shift();
  },

  grow: function () {
    const headSnake = { ...this.head() }; // Faz uma cópia real da cabeça
    this.body.push(headSnake);
  },

  reduce: function () {
    snake.body.shift();
  },
};
