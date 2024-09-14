import Team from "./Team.js";
import Bowman from "./characters/Bowman.js";
import Daemon from "./characters/Bowman.js";
import Magician from "./characters/Bowman.js";
import Swordsman from "./characters/Bowman.js";
import Undead from "./characters/Bowman.js";
import Vampire from "./characters/Bowman.js";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const randomType =
    allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

  const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
  let newCharacter;

  switch (randomType) {
    case "Bowman":
      newCharacter = new Bowman(randomLevel);
      break;
    case "Daemon":
      newCharacter = new Daemon(randomLevel);
      break;
    case "Magician":
      newCharacter = new Magician(randomLevel);
      break;
    case "Swordsman":
      newCharacter = new Swordsman(randomLevel);
      break;
    case "Undead":
      newCharacter = new Undead(randomLevel);
      break;
    case "Vampire":
      newCharacter = new Vampire(randomLevel);
      break;
  }

  yield newCharacter; // Здесь мы выдаем персонажа
  // TODO: write logic here
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    const newCharacter = characterGenerator(allowedTypes, maxLevel).next()
      .value;
    team.push(newCharacter);
  }

  const newTeam = new Team(team);
  return newTeam;
  // TODO: write logic here
}
