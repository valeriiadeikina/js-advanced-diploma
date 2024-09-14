import Character from "../Character.js";

export default class Magician extends Character{
    constructor(level, attack, defence, health, type) {
        super(level, attack, defence, health, type);
        this.attack = 10;  
        this.defence = 40;
    }
}