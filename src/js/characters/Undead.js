import Character from "../Character.js";

export default class Undead extends Character {
  constructor(level, attack = 40, defence = 10) {
    super(level, "undead");
    this.attack = attack;
    this.defence = defence;
  }
}
