import { DOM } from "./DOM.js";

export const canvas = {
  size: { x: DOM.canvas.clientWidth, y: DOM.canvas.clientHeight },
  block: 20,
  color: ["", ""],

  drawBackground: function () {
    // Define o tamanho do canvas baseado na largura da tela (quadrado perfeito)
    let size = DOM.gameScreen.clientWidth - 120;
    size -= size % this.block; // Ajusta para ser múltiplo do bloco

    DOM.canvas.width = size;
    DOM.canvas.height = size;

    // Calcula o número exato de colunas e linhas sem sobras
    const numCells = size / this.block;
    const ctx = DOM.ctx; // Armazena o contexto para evitar acessos repetidos
    const [colorA, colorB] = this.color; // Desestruturação para facilitar leitura

    // Itera sobre todas as células do grid
    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? colorA : colorB;
        ctx.fillRect(
          col * this.block,
          row * this.block,
          this.block,
          this.block
        );
      }
    }
  },
};
