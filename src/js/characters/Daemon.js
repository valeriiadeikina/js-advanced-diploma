import Character from "../Character.js";

export default class Daemon extends Character {
  constructor(level, attack = 10, defence = 10) {
    super(level, "daemon");
    this.attack = attack;
    this.defence = defence;
  }
}
