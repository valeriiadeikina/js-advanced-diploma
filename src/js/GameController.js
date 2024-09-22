import GamePlay from "./GamePlay.js";
import { generateTeam } from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import themes from "./themes.js";
import cursors from "./cursors.js";
import {
  isFourCellsNeighbor,
  isNeighborCell,
  isTwoCellsNeighbor,
} from "./helper.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTeam = [];
    this.computerTeam = [];
    this.selectedCaracter = null;
    this.prevSelectedCell = null
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.gamePlay = new GamePlay();
      const container = document.querySelector("#game-container");
      this.gamePlay.bindToDOM(container);
      this.gamePlay.drawUi("prairie");
      this.userTeam = generateTeam(["Bowman", "Swordsman", "Magician"], 1, 3);

      this.computerTeam = generateTeam(["Vampire", "Undead", "Daemon"], 1, 3);

      let userPositions = new Set();
      const boardSize = this.gamePlay.boardSize;
      while (userPositions.size < this.userTeam.team.length) {
        let position =
          Math.round(Math.random()) +
          boardSize * Math.floor(Math.random() * boardSize);
        userPositions.add(position);
      }
      const userPositionsArray = Array.from(userPositions);
      for (let i = 0; i < this.userTeam.team.length; i++) {
        const positionedCharacter = new PositionedCharacter(
          this.userTeam.team[i],
          userPositionsArray[i],
        );
        this.userTeam.team.splice(i, 1, positionedCharacter);
      }
      let computerPositions = new Set();
      while (computerPositions.size < this.computerTeam.team.length) {
        let position =
          Math.round(Math.random() + 6) +
          boardSize * Math.floor(Math.random() * boardSize);
        computerPositions.add(position);
      }

      const computerPositionsArray = Array.from(computerPositions);
      for (let i = 0; i < this.computerTeam.team.length; i++) {
        const positionedCharacter = new PositionedCharacter(
          this.computerTeam.team[i],
          computerPositionsArray[i],
        );
        this.computerTeam.team.splice(i, 1, positionedCharacter);
      }

      this.gamePlay.redrawPositions([
        ...this.userTeam.team,
        ...this.computerTeam.team,
      ]);

      this.showCharacterDescribe();
      this.usersAction();
    });

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  usersAction() {
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellClick = (index) => {
    const usersPositions = [];
    this.userTeam.team.forEach((character) =>
      usersPositions.push(character.position),
    );

    if (usersPositions.includes(index) && !this.selectedCaracter) {
      this.selectedCaracter = index;
      this.gamePlay.selectCell(index);
    } else if (usersPositions.includes(index) && !!this.selectedCaracter) {
      this.gamePlay.deselectCell(this.selectedCaracter);
      this.selectedCaracter = index;
      this.gamePlay.selectCell(index);
    } else {
      alert(GamePlay.showError("Выберите своего персонажа"));
    }
    // TODO: react to click
  };

  showCharacterDescribe() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);   
  }

  onCellEnter = (index) => {
    const playersPositions = [];
    const usersPositions = [];
    const enemiesPositions = [];
    this.prevSelectedCell = index
    this.userTeam.team.forEach((character) => {
      playersPositions.push(character.position);
      usersPositions.push(character.position);
    });
    this.computerTeam.team.forEach((character) => {
      playersPositions.push(character.position);
      enemiesPositions.push(character.position);
    });
    if (playersPositions.includes(index)) {
      const player = [...this.userTeam.team, ...this.computerTeam.team].find(
        (character) => character.position === index,
      );
      const tooltip = `🎖${player.character.level}⚔${player.character.attack}🛡${player.character.defence}❤${player.character.health}`;

      this.gamePlay.showCellTooltip(tooltip, index);
    }

    if (this.selectedCaracter) {
      const player = this.userTeam.team.find(
        (character) => character.position === this.selectedCaracter,
      );
      const standartConditions =
        index >= 0 && index < this.gamePlay.boardSize * this.gamePlay.boardSize;

      const cellHasEnemy = enemiesPositions.includes(index);
      const cellHasCharacter = usersPositions.includes(index);

      const allowedMoves = {
        magician: isNeighborCell(
          player.position,
          index,
          this.gamePlay.boardSize,
        ),
        bowman: isTwoCellsNeighbor(
          player.position,
          index,
          this.gamePlay.boardSize,
        ),
        swordsman: isFourCellsNeighbor(
          player.position,
          index,
          this.gamePlay.boardSize,
        ),
      };

      const allowedMove = allowedMoves[player.character.type];

      if (standartConditions && allowedMove) {
        this.gamePlay.setCursor(cursors.pointer);

        if (!cellHasEnemy && !cellHasCharacter) {
          this.gamePlay.selectCell(index, "green");
        }

        if (cellHasEnemy) {
          this.gamePlay.setCursor(cursors.crosshair);
        }
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
    }
    // TODO: react to mouse enter
  };

  onCellLeave = (index) => {
    this.gamePlay.deselectCell(this.prevSelectedCell);
    // TODO: react to mouse leave
  };
}
