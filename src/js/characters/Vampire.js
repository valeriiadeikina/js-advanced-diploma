import Character from "../Character.js";

export default class Vampire extends Character {
  constructor(level, attack = 25, defence = 25) {
    super(level, "vampire");
    this.attack = attack;
    this.defence = defence;
  }
}
