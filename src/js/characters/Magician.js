import Character from "../Character.js";

export default class Magician extends Character {
  constructor(level, attack = 10, defence = 40) {
    super(level, "magician");
    this.attack = attack;
    this.defence = defence;
  }
}
