import GamePlay from "./GamePlay.js";
import { generateTeam } from "./generators.js";
import themes from "./themes.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.gamePlay = new GamePlay();
      const container = document.querySelector("#game-container");
      this.gamePlay.bindToDOM(container);
      this.gamePlay.drawUi("prairie");
      const userTeam = generateTeam(["Bowman", "Swordsman", "Magician"], 1, 3);

      const computerTeam = generateTeam(["Vampire", "Undead", "Daemon"], 1, 3);
      
      console.log(userTeam);
      console.log(computerTeam);
      // this.gamePlay.redrawPositions();
    });

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
