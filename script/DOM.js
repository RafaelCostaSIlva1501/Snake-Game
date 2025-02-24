export const DOM = {
  canvas: document.getElementById("canvas"),
  ctx: document.getElementById("canvas").getContext("2d"),

  startScreen: document.querySelector(".start-screen"),
  gameoverScreen: document.querySelector(".end-screen"),
  settingsScreen: document.querySelector(".settings-screen"),

  btnPlayGame: document.querySelector(".play-game"),
  btnPlayAgain: document.querySelector(".play-again"),

  btnOpenSettings: document.querySelector(".open-settings"),
  btnCloseSettings: document.querySelectorAll(".close-settings"),

  score: document.querySelector(".score"),
  finalScore: document.querySelector(".final-score"),

  buttonBackgroundColor: document.querySelectorAll(".button-background-color"),
  buttonSnakeColor: document.querySelectorAll(".button-snake-color"),
  buttonFoodColor: document.querySelectorAll(".button-food-color"),

  buttonGrid: document.querySelector(".button-grid"),
  buttonCollision: document.querySelector(".button-collision"),

  toggleButton: document.querySelectorAll(".toggle-button"),
  buttonSpeed: document.querySelectorAll(".button-speed"),
};
