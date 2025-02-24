export const snake = {
    // Corpo da cobra
  body: [
    { x: 10, y: 10 },
    { x: 20, y: 10 },
  ],

  // Cabeça da cobra
  head: function () {
    const head = this.body[this.body.length - 1];
    return head;
  },

  // Cores da cobra
  color: {
    head: "#77c21c", // Cor da cabeça
    body: "#83d420", // Cor do corpo
  },

  // Função que desenha a cobra
  draw: function () {
    // Desenha a cobra dentro do canvas
    ctx.fillStyle = this.color.body; // Define a cor do corpo

    this.body.forEach((position, index) => {
      if (index === this.body.length - 1) {
        ctx.fillStyle = this.color.head;
      }

      ctx.fillRect(position.x, position.y, size, size); // Desenha cada segmento
    });
  },

  // Função que move a cobra
  move: function (direction) {
    if (!direction) return; // Se a direção não for definida, não faz nada.

    const headSnake = this.body[this.body.length - 1]; // Acessa a cabeça da cobrinha.

    // Remove o último segmento da cobra
    this.body.shift();

    // Adiciona um novo segmento dependendo da direção
    if (direction === "right") {
      this.body.push({ x: headSnake.x + size, y: headSnake.y });
    } else if (direction === "down") {
      this.body.push({ x: headSnake.x, y: headSnake.y + size });
    } else if (direction === "left") {
      this.body.push({ x: headSnake.x - size, y: headSnake.y });
    } else if (direction === "up") {
      this.body.push({ x: headSnake.x, y: headSnake.y - size });
    }
  },

  // Direção da cobra
  direction: "",
};
