export const DOM = {
  canvas: document.getElementById("canvas"),
  ctx: document.getElementById("canvas").getContext("2d"),

  main: document.querySelector(".main"),

  startScreen: document.querySelector(".start-screen"),
  gameScreen: document.querySelector(".game-screen"),
  canvasScreen: document.querySelector(".canvas-screen"),
  gameHeader: document.querySelector(".game-header"),
  gameoverScreen: document.querySelector(".end-screen"),
  settingsScreen: document.querySelector(".settings-screen"),

  btnPlayGame: document.querySelector(".play-game"),
  btnPlayAgain: document.querySelector(".play-again"),
  btnSettings: document.querySelectorAll(".open-settings"),

  score: document.querySelector(".score"),
  lastScore: document.querySelector(".last-score"),
  finalScore: document.querySelector(".final-score"),

  btnTheme: document.querySelectorAll(".btn-theme"),

  update: document.querySelector(".update"),
  btnUpdate: document.querySelectorAll(".btn-update"),
};
