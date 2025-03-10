import { DOM } from "./DOM.js";

export const canvas = {
  size: function () {
    let sizeX = DOM.canvasScreen.clientWidth - this.block * 2;
    let sizeY = DOM.canvasScreen.clientHeight - this.block * 2;

    sizeX -= sizeX % this.block;
    sizeY -= sizeY % this.block;

    // Define as novas dimensões do canvas
    DOM.canvas.width = sizeX;
    DOM.canvas.height = sizeY;
    DOM.canvas.style.width = `${sizeX}px`;
    DOM.canvas.style.height = `${sizeY}px`;

    return { x: sizeX, y: sizeY };
  },

  block: 20,
  color: ["", ""],

  drawBackground: function () {
    const cellX = this.size().x / this.block;
    const cellY = this.size().y / this.block;

    for (let row = 0; row < cellY; row++) {
      for (let col = 0; col < cellX; col++) {
        DOM.ctx.fillStyle =
          (row + col) % 2 === 0 ? this.color[0] : this.color[1];
        DOM.ctx.fillRect(
          col * this.block,
          row * this.block,
          this.block,
          this.block
        );
      }
    }
  },
};
