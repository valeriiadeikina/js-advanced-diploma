import { calcTileType } from "../js/utils";

test("check styles of new field", () => {
  const result = calcTileType(0, 9);
  const result2 = calcTileType(7, 7);

  expect(result).toBe("top-left");
  expect(result2).toBe("left");
});
