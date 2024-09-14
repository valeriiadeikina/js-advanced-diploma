import Character from "../Character.js";

export default class Swordsman extends Character{
    constructor(level, attack, defence, health, type) {
        super(level, attack, defence, health, type);
        this.attack = 40;  
        this.defence = 10;
    }
}