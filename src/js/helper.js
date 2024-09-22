export const isNeighborCell = (playerPosition, cursorIndex, gameBoardSize) => {
  const neighborOffsets = [
    -1,
    1,
    -gameBoardSize,
    gameBoardSize,
    -gameBoardSize - 1,
    -gameBoardSize + 1,
    gameBoardSize - 1,
    gameBoardSize + 1,
  ];

  return neighborOffsets.some(
    (offset) => cursorIndex === playerPosition + offset,
  );
};

export const isTwoCellsNeighbor = (
  playerPosition,
  cursorIndex,
  gameBoardSize,
) => {
  const neighborOffsets = [
    -1,
    1,
    -2,
    2,
    -gameBoardSize,
    gameBoardSize,
    -gameBoardSize * 2,
    gameBoardSize * 2,
    -gameBoardSize - 1,
    -gameBoardSize + 1,
    gameBoardSize - 1,
    gameBoardSize + 1,
    -gameBoardSize * 2 - 2,
    -gameBoardSize * 2 + 2,
    gameBoardSize * 2 - 2,
    gameBoardSize * 2 + 2,
  ];

  return neighborOffsets.some(
    (offset) => cursorIndex === playerPosition + offset,
  );
};

export const isFourCellsNeighbor = (
  playerPosition,
  cursorIndex,
  gameBoardSize,
) => {
  const neighborOffsets = [
    -1,
    1,
    -2,
    2,
    -3,
    3,
    -4,
    4,
    -gameBoardSize,
    gameBoardSize,
    -gameBoardSize * 2,
    gameBoardSize * 2,
    -gameBoardSize * 3,
    gameBoardSize * 3,
    -gameBoardSize * 4,
    gameBoardSize * 4,
    -gameBoardSize - 1,
    -gameBoardSize + 1,
    gameBoardSize - 1,
    gameBoardSize + 1,
    -gameBoardSize * 2 - 2,
    -gameBoardSize * 2 + 2,
    gameBoardSize * 2 - 2,
    gameBoardSize * 2 + 2,
    -gameBoardSize * 3 - 3,
    -gameBoardSize * 3 + 3,
    gameBoardSize * 3 - 3,
    gameBoardSize * 3 + 3,
    -gameBoardSize * 4 - 4,
    -gameBoardSize * 4 + 4,
    gameBoardSize * 4 - 4,
    gameBoardSize * 4 + 4,
  ];

  return neighborOffsets.some(
    (offset) => cursorIndex === playerPosition + offset,
  );
};
