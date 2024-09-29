export const allowedMoves = (
  playerPosition,
  cursorIndex,
  gameBoardSize,
  steps,
) => {
  const columnCursor = cursorIndex % gameBoardSize;
  const rowCursor = Math.floor(cursorIndex / gameBoardSize);

  const columnPlayerPosition = playerPosition % gameBoardSize;
  const rowPlayerPosition = Math.floor(playerPosition / gameBoardSize);

  const condition =
    Math.abs(columnPlayerPosition - columnCursor) -
    Math.abs(rowPlayerPosition - rowCursor);

  if (
    columnCursor === columnPlayerPosition &&
    rowPlayerPosition - steps <= rowCursor &&
    rowCursor <= rowPlayerPosition + steps
  ) {
    return true;
  }

  if (
    rowCursor === rowPlayerPosition &&
    columnPlayerPosition - steps <= columnCursor &&
    columnCursor <= columnPlayerPosition + steps
  ) {
    return true;
  }

  if (
    columnPlayerPosition - steps <= columnCursor &&
    columnCursor <= columnPlayerPosition + steps &&
    rowPlayerPosition - steps <= rowCursor &&
    rowCursor <= rowPlayerPosition + steps &&
    condition === 0
  ) {
    return true;
  } else {
    return false;
  }
};

export const allowedAttack = (
  playerPosition,
  cursorIndex,
  gameBoardSize,
  steps,
) => {
  const columnCursor = cursorIndex % gameBoardSize;
  const rowCursor = Math.floor(cursorIndex / gameBoardSize);

  const columnPlayerPosition = playerPosition % gameBoardSize;
  const rowPlayerPosition = Math.floor(playerPosition / gameBoardSize);

  if (
    rowPlayerPosition - steps <= rowCursor &&
    rowCursor <= rowPlayerPosition + steps &&
    columnPlayerPosition - steps <= columnCursor &&
    columnCursor <= columnPlayerPosition + steps
  ) {
    return true;
  }
  return false;
};

export const allowedComputerAttack = (
  computerPosition,
  gameBoardSize,
  steps,
) => {
  const columnPosition = computerPosition % gameBoardSize;
  const rowPosition = Math.floor(computerPosition / gameBoardSize);

  const allowedForAttackCoordinates = [];

  const minRow = Math.max(0, rowPosition - steps);
  const maxRow = Math.min(gameBoardSize - 1, rowPosition + steps);
  const minCol = Math.max(0, columnPosition - steps);
  const maxCol = Math.min(gameBoardSize - 1, columnPosition + steps);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (!(r === rowPosition && c === columnPosition)) {
        allowedForAttackCoordinates.push([r, c]);
      }
    }
  }

  return allowedForAttackCoordinates;
};

export const allowedComputerMoves = (
  computerPosition,
  gameBoardSize,
  steps,
  userPosition,
  positions,
) => {
  const columnPosition = computerPosition % gameBoardSize;
  const rowPosition = Math.floor(computerPosition / gameBoardSize);

  let allowedCoordinates = [];

  for (let rowOffset = -steps; rowOffset <= steps; rowOffset++) {
    for (let colOffset = -steps; colOffset <= steps; colOffset++) {
      const newRow = rowPosition + rowOffset;
      const newCol = columnPosition + colOffset;

      if (rowOffset === 0 && colOffset === 0) continue;

      if (
        newRow >= 0 &&
        newRow < gameBoardSize &&
        newCol >= 0 &&
        newCol < gameBoardSize
      ) {
        if (
          Math.abs(rowOffset) === Math.abs(colOffset) ||
          rowOffset === 0 ||
          colOffset === 0
        ) {
          allowedCoordinates.push([newRow, newCol]);
        }
      }
    }
  }

  let allowedForAttackCoordinates = [];

  const minRow = Math.max(0, rowPosition - steps);
  const maxRow = Math.min(gameBoardSize - 1, rowPosition + steps);
  const minCol = Math.max(0, columnPosition - steps);
  const maxCol = Math.min(gameBoardSize - 1, columnPosition + steps);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (!(r === rowPosition && c === columnPosition)) {
        allowedForAttackCoordinates.push([r, c]);
      }
    }
  }

  allowedForAttackCoordinates.map((coordinates, i) => {
    const position = coordinates[0] * gameBoardSize + coordinates[1];
    allowedForAttackCoordinates.splice(i, 1, position);
  });

  const coordinateForAttack = allowedForAttackCoordinates.find(
    (coordinate) => coordinate === userPosition,
  );

  if (coordinateForAttack) {
    return { attack: coordinateForAttack };
  } else {
    allowedCoordinates = allowedCoordinates.filter(
      (coordinate) =>
        !positions.includes(coordinate[0] * gameBoardSize + coordinate[1]),
    );

    const rowUserPosition = Math.floor(userPosition / gameBoardSize);
    const columnUserPosition = userPosition % gameBoardSize;

    let closestCoordinate = null;
    let minDistance = Infinity;
    for (const [x, y] of allowedCoordinates) {
      if (x === rowUserPosition && y === columnUserPosition) {
        continue;
      }

      const distance = Math.sqrt(
        (x - rowUserPosition) ** 2 + (y - columnUserPosition) ** 2,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCoordinate = [x, y];
        closestCoordinate =
          closestCoordinate[0] * gameBoardSize + closestCoordinate[1];
      }
      return { move: closestCoordinate };
    }
  }
};
