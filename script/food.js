import { canvas } from "./canvas.js";
import { DOM } from "./DOM.js";

export const food = {
  size: 20,
  color: ["#FB2C36", "#E7000B"],
  position: {
    x: 0,
    y: 0,
  },

  generate: function () {
    // Gera a posição aleatória dentro do tamanho do canvas
    const x =
      Math.floor(Math.random() * (DOM.canvas.width / canvas.block)) *
      canvas.block;
    const y =
      Math.floor(Math.random() * (DOM.canvas.height / canvas.block)) *
      canvas.block;

    return { x, y };
  },

  spawn: function () {
    this.position.x = this.generate().x;
    this.position.y = this.generate().y;
  },

  draw: function () {
    const radius = 8; // Raio da borda arredondada
    const x = this.position.x;
    const y = this.position.y;
    const width = this.size;
    const height = this.size;

    DOM.ctx.fillStyle = this.color[0]; // Cor de preenchimento
    DOM.ctx.strokeStyle = this.color[1]; // Cor da borda
    DOM.ctx.lineWidth = 2; // Espessura da borda

    // Inicia um novo caminho
    DOM.ctx.beginPath();

    // Canto superior esquerdo
    DOM.ctx.moveTo(x + radius, y);
    DOM.ctx.arcTo(x + width, y, x + width, y + height, radius);

    // Canto superior direito
    DOM.ctx.arcTo(x + width, y + height, x, y + height, radius);

    // Canto inferior direito
    DOM.ctx.arcTo(x, y + height, x, y, radius);

    // Canto inferior esquerdo
    DOM.ctx.arcTo(x, y, x + width, y, radius);

    // Preenche o quadrado
    DOM.ctx.fill();

    // Desenha a borda
    DOM.ctx.stroke();

    // Finaliza o caminho
    DOM.ctx.closePath();
  },
};
