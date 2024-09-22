import Character from "../Character.js";

export default class Swordsman extends Character {
  constructor(level, attack = 40, defence = 10) {
    super(level, "swordsman");
    this.attack = attack;
    this.defence = defence;
  }
}
