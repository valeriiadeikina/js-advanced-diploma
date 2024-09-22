import Character from "../Character.js";

export default class Bowman extends Character {
  constructor(level, attack = 25, defence = 25) {
    super(level, "bowman");
    this.attack = attack;
    this.defence = defence;
  }
}
