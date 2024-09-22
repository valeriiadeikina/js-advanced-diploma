import Character from "../js/Character";
import Bowman from "../js/characters/Bowman";
import { characterGenerator } from "../js/generators";
import { calcTileType } from "../js/utils";

test("check styles of new field", () => {
  const result = calcTileType(0, 9);
  const result2 = calcTileType(7, 7);

  expect(result).toBe("top-left");
  expect(result2).toBe("left");
});

test("should throw an error when create a new Character", () => {
  expect(() => new Character(1, "generic")).toThrowError(
    "must not be called with new",
  );
});

test("should not throw an error when creating Bowman", () => {
  expect(() => {
    new Bowman(1);
  }).not.toThrow();
});

test("check Bowman", () => {
  const bowman = new Bowman(1);
  expect(bowman).toEqual({
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    type: "bowman",
  });
});

test("генератор выдаёт множество персонажей и генерирует уровни от 1 до 4", () => {
  const allowedTypes = [
    "Bowman",
    "Swordsman",
    "Magician",
    "Vampire",
    "Undead",
    "Daemon",
  ];
  const maxLevel = 4;
  let i = 0;
  while (i < 100) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    i++;
    expect(character.level).toBeLessThan(5);
    expect(character.level).toBeGreaterThan(0)
  }
  expect(i).toBe(100);
});
