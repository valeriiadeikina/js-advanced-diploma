import Character from "../Character.js";

export default class Vampire extends Character {
  constructor(level) {
    super(level, attack, defence, health, type);
    this.attack = 25;
    this.defence = 25;
  }
}
