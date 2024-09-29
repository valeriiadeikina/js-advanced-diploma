import GamePlay from "./GamePlay.js";
import { generateTeam } from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import themes from "./themes.js";
import cursors from "./cursors.js";
import { allowedAttack, allowedComputerMoves, allowedMoves } from "./helper.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTeam = [];
    this.computerTeam = [];
    this.selectedCaracter = null;
    this.userPositions = [];
    this.computerPositions = [];
    this.isAllowedMove = false;
    this.isAllowedAttack = false;
    this.isUserTurn = true;
    this.computerTarget = null;
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
      this.userPositions = Array.from(userPositions);
      for (let i = 0; i < this.userTeam.team.length; i++) {
        const positionedCharacter = new PositionedCharacter(
          this.userTeam.team[i],
          this.userPositions[i],
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

      this.computerPositions = Array.from(computerPositions);
      for (let i = 0; i < this.computerTeam.team.length; i++) {
        const positionedCharacter = new PositionedCharacter(
          this.computerTeam.team[i],
          this.computerPositions[i],
        );
        this.computerTeam.team.splice(i, 1, positionedCharacter);
      }

      this.gamePlay.redrawPositions([
        ...this.userTeam.team,
        ...this.computerTeam.team,
      ]);

      this.showCharacterDescribe();
      this.usersAction();
      this.onCellLeaveMethod();
    });

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  usersAction() {
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellClick = (index) => {
    const cellHasEnemy = this.computerPositions.includes(index);
    const cellHasCharacter = this.userPositions.includes(index);

    if (this.userPositions.includes(index) && this.selectedCaracter === null) {
      this.selectedCaracter = index;
      this.gamePlay.selectCell(index);
    } else if (
      this.userPositions.includes(index) &&
      this.selectedCaracter !== null
    ) {
      this.gamePlay.deselectCell(this.selectedCaracter);
      this.selectedCaracter = index;
      this.gamePlay.selectCell(index);
    } else if (
      this.selectedCaracter !== null &&
      this.isAllowedMove &&
      !cellHasEnemy &&
      !cellHasCharacter
    ) {
      const character = this.userTeam.team.find(
        (character) => character.position === this.selectedCaracter,
      );

      const positionedCharacter = new PositionedCharacter(
        character.character,
        index,
      );

      const filteredIndex = this.userTeam.team.findIndex(
        (character) => character.position === this.selectedCaracter,
      );

      if (filteredIndex !== -1) {
        this.userTeam.team[filteredIndex] = positionedCharacter;
      }

      this.gamePlay.redrawPositions([
        ...this.userTeam.team,
        ...this.computerTeam.team,
      ]);

      this.userPositions = this.userPositions.filter(
        (position) => position !== this.selectedCaracter,
      );

      this.userPositions.push(index);

      this.gamePlay.deselectCell(this.selectedCaracter);
      this.selectedCaracter = null;
      this.isUserTurn = false;
      this.computerAction();
    } else if (
      this.selectedCaracter !== null &&
      cellHasEnemy &&
      this.isAllowedAttack
    ) {
      const character = this.userTeam.team.find(
        (character) => character.position === this.selectedCaracter,
      );
      let enemy = this.computerTeam.team.find(
        (enemy) => enemy.position === index,
      );
      const damage = Math.max(
        character.character.attack - enemy.character.defence,
        character.character.attack * 0.1,
      );

      enemy.character.health = enemy.character.health - damage;

      this.computerTeam.team = this.computerTeam.team.filter(
        (enemy) => enemy.position !== index,
      );

      if (enemy.character.health > 0) {
        this.computerTeam.team.push(enemy);
      }

      this.gamePlay.showDamage(index, damage);

      setTimeout(() => {
        this.gamePlay.redrawPositions([
          ...this.userTeam.team,
          ...this.computerTeam.team,
        ]);
      }, 500);

      this.gamePlay.deselectCell(this.selectedCaracter);
      this.selectedCaracter = null;
      this.isUserTurn = false;
      this.computerAction();
    } else if (
      this.selectedCaracter &&
      !this.isAllowedMove &&
      !this.isAllowedMove
    ) {
      GamePlay.showError("Недопустимое действие");
    } else if (!this.selectedCaracter) {
      GamePlay.showError("Выберите своего персонажа");
    }

    // TODO: react to click
  };

  computerAction() {
    if (this.userTeam.team.length) {
      this.computerTarget = this.userTeam.team[0];
    }

    let computerCharacter =
      this.computerTeam.team[
        Math.floor(Math.random() * this.computerTeam.team.length)
      ];
    let coordinates;
    if (computerCharacter.character.type === "daemon") {
      coordinates = allowedComputerMoves(
        computerCharacter.position,
        this.gamePlay.boardSize,
        1,
        this.computerTarget.position,
        [...this.userPositions, ...this.computerPositions],
      );
    }
    if (computerCharacter.character.type === "vampire") {
      coordinates = allowedComputerMoves(
        computerCharacter.position,
        this.gamePlay.boardSize,
        2,
        this.computerTarget.position,
        [...this.userPositions, ...this.computerPositions],
      );
    }

    if (computerCharacter.character.type === "undead") {
      coordinates = allowedComputerMoves(
        computerCharacter.position,
        this.gamePlay.boardSize,
        4,
        this.computerTarget.position,
        [...this.userPositions, ...this.computerPositions],
      );
    }

    if (Object.keys(coordinates)[0] === "move") {
      const character = this.computerTeam.team.find(
        (character) => character.position === computerCharacter.position,
      );

      const positionedCharacter = new PositionedCharacter(
        character.character,
        coordinates.move,
      );

      const filteredIndex = this.computerTeam.team.findIndex(
        (character) => character.position === computerCharacter.position,
      );

      if (filteredIndex !== -1) {
        this.computerTeam.team[filteredIndex] = positionedCharacter;
      }

      this.gamePlay.redrawPositions([
        ...this.userTeam.team,
        ...this.computerTeam.team,
      ]);

      this.computerPositions = this.computerPositions.filter(
        (position) => position !== computerCharacter.position,
      );

      this.computerPositions.push(coordinates.move);
    }
    if (Object.keys(coordinates)[0] === "attack") {
      const character = this.computerTeam.team.find(
        (character) => character.position === computerCharacter.position,
      );

      const damage = Math.max(
        character.character.attack - this.computerTarget.character.defence,
        character.character.attack * 0.1,
      );

      this.computerTarget.character.health =
        this.computerTarget.character.health - damage;

      this.userTeam.team = this.userTeam.team.filter(
        (user) => user.position !== this.computerTarget.position,
      );

      if (this.computerTarget.character.health > 0) {
        this.userTeam.team.push(this.computerTarget);
      }

      this.gamePlay.showDamage(this.computerTarget.position, damage);

      setTimeout(() => {
        this.gamePlay.redrawPositions([
          ...this.userTeam.team,
          ...this.computerTeam.team,
        ]);
      }, 700);

      this.isUserTurn = true;
    }
  }

  showCharacterDescribe() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
  }

  onCellEnter = (index) => {
    if ([...this.computerPositions, ...this.userPositions].includes(index)) {
      const player = [...this.userTeam.team, ...this.computerTeam.team].find(
        (character) => character.position === index,
      );
      const tooltip = `🎖${player.character.level}⚔${player.character.attack}🛡${player.character.defence}❤${player.character.health}`;

      this.gamePlay.showCellTooltip(tooltip, index);
    }

    const cellHasEnemy = this.computerPositions.includes(index);
    const cellHasCharacter = this.userPositions.includes(index);

    if (cellHasCharacter) {
      this.gamePlay.setCursor(cursors.pointer);
    }

    if (!cellHasCharacter) {
      this.gamePlay.setCursor(cursors.auto);
    }

    if (this.selectedCaracter !== null) {
      const player = this.userTeam.team.find(
        (character) => character.position === this.selectedCaracter,
      );

      const allowedMovesForCharacters = {
        magician: allowedMoves(
          player.position,
          index,
          this.gamePlay.boardSize,
          1,
        ),
        bowman: allowedMoves(
          player.position,
          index,
          this.gamePlay.boardSize,
          2,
        ),
        swordsman: allowedMoves(
          player.position,
          index,
          this.gamePlay.boardSize,
          4,
        ),
      };

      this.isAllowedMove = allowedMovesForCharacters[player.character.type];

      const allowedAttackForCharacters = {
        magician: allowedAttack(
          player.position,
          index,
          this.gamePlay.boardSize,
          4,
        ),
        bowman: allowedAttack(
          player.position,
          index,
          this.gamePlay.boardSize,
          2,
        ),
        swordsman: allowedAttack(
          player.position,
          index,
          this.gamePlay.boardSize,
          1,
        ),
      };

      this.isAllowedAttack = allowedAttackForCharacters[player.character.type];

      if (cellHasEnemy && this.isAllowedAttack) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red");
      }
      if (!this.isAllowedAttack && !cellHasEnemy) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      if (this.isAllowedAttack && !cellHasEnemy && !this.isAllowedMove) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      if (!this.isAllowedAttack && cellHasEnemy) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      if (cellHasCharacter) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if (this.isAllowedMove && !cellHasCharacter && !cellHasEnemy) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, "green");
      }
    }

    // TODO: react to mouse enter
  };

  onCellLeaveMethod() {
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
  }

  onCellLeave = (index) => {
    if (index !== this.selectedCaracter) {
      this.gamePlay.deselectCell(index);
      // TODO: react to mouse leave}
    }
  };
}
