/**
 * This file is responsible for:
 * Handling graphics field and it's properties
 * Handling field modification
 * And finally handling drawing on the field
 */

/**
 * Represents data associated with a cell element.
 *
 * @typedef {Object} CellData
 * @property {number} x - The x-coordinate of the cell.
 * @property {number} y - The y-coordinate of the cell.
 * @property {string} char - The character content of the cell.
 * @property {function(string): void} setChar - Sets the character content of the cell.
 */

/**
 * Starts a new field instance
 */
const gameField = new Field(40, 20, "game-field");
gameField.startField();

/**
 * Interface for selecting cells
 */
const select = {
  /**
   * Selects a single cell, or a point, whatever you want to call it
   *
   * @param {object} point - Any object that cointains:
   * @param {number} point.x - x coordinate
   * @param {number} point.y - y coordinate
   * @return {CellData} - CellData object
   */
  point: function (point) {
    cell = gameField.getCell(point);
    return cell;
  },

  /**
   * selects a line on the game field between the start and end points,
   * and returns the cells as an array of objects.
   * Useful for graphics, gameplay, etc.
   *
   * @param {Object} startPoint - The starting point of the line.
   * @param {number} startPoint.x - The x-coordinate of the starting point.
   * @param {number} startPoint.y - The y-coordinate of the starting point.
   * @param {Object} endPoint - The ending point of the line.
   * @param {number} endPoint.x - The x-coordinate of the ending point.
   * @param {number} endPoint.y - The y-coordinate of the ending point.
   * @return {Array|CellData} An array of cellData objects representing the chosen cells
   */
  line: function (startPoint, endPoint) {
    const affectedCells = [];

    const dx = Math.abs(endPoint.x - startPoint.x);
    const dy = Math.abs(endPoint.y - startPoint.y);
    const sx = startPoint.x < endPoint.x ? 1 : -1;
    const sy = startPoint.y < endPoint.y ? 1 : -1;
    let err = dx - dy;
    let x = startPoint.x;
    let y = startPoint.y;

    while (x !== endPoint.x || y !== endPoint.y) {
      affectedCells.push(gameField.getCell({ x: x, y: y }));
      const err2 = 2 * err;
      if (err2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (err2 < dx) {
        err += dx;
        y += sy;
      }
    }

    // Includes the end point
    affectedCells.push(gameField.getCell(endPoint));

    return affectedCells;
  },

  /**
   * selects a square on the field.
   * @param {Object} startPoint - The top-left point of the square.
   * @param {number} startPoint.x - The x-coordinate of the top-left point.
   * @param {number} startPoint.y - The y-coordinate of the top-left point.
   * @param {Object} endPoint - The bottom-right point of the square.
   * @param {number} endPoint.x - The x-coordinate of the bottom-right point.
   * @param {number} endPoint.y - The y-coordinate of the bottom-right point.
   * @return {Array|CellData} Array of cellData objects affected
   */
  square: function (startPoint, endPoint) {
    const affectedCells = [];

    const startPointCPY = Object.assign({}, startPoint);
    const endPointCPY = Object.assign({}, endPoint);

    // Make the startPoint be the top left and endPoint be the bottom right
    if (endPointCPY.x < startPointCPY.x) {
      [startPointCPY.x, endPointCPY.x] = [endPointCPY.x, startPointCPY.x]; // Switch them around
    }

    if (endPointCPY.y < startPointCPY.y) {
      [startPointCPY.y, endPointCPY.y] = [endPointCPY.y, startPointCPY.y]; // Switch them around
    }

    /**
     * Epic square reference
     *    startPoint.x, startPoint.y---startPoint.x, endPoint.y
     *    		|						                    	|
     *    	  |							                    |
     *    		|							                    |
     *    endPoint.x, startPoint.y---endPoint.x, endPoint.y
     */

    // Create coordinates for the other two points
    const topRightPoint = gameField.getCell({ x: endPoint.x, y: startPoint.y });
    const bottomLeftPoint = gameField.getCell({
      x: startPoint.x,
      y: endPoint.y,
    });

    affectedCells.push(...select.line(startPoint, topRightPoint)); // Top side
    affectedCells.push(...select.line(topRightPoint, endPoint)); // Right side
    affectedCells.push(...select.line(endPoint, bottomLeftPoint)); // Bottom side
    affectedCells.push(...select.line(bottomLeftPoint, startPoint)); // Left side

    return affectedCells;
  },

  /**
   * Selects a rectangular box on the game field.
   * @param {Object} startPoint - The starting point of the box.
   * @param {number} startPoint.x - The x-coordinate of the starting point.
   * @param {number} startPoint.y - The y-coordinate of the starting point.
   * @param {Object} endPoint - The ending point of the box.
   * @param {number} endPoint.x - The x-coordinate of the ending point.
   * @param {number} endPoint.y - The y-coordinate of the ending point.
   * @return {Array<CellData>} - An array of modified cellData objects if returnCells is true, otherwise undefined.
   */
  filledSquare: function (startPoint, endPoint) {
    const startPointCPY = Object.assign({}, startPoint);
    const endPointCPY = Object.assign({}, endPoint);

    // Make the startPoint be the top left and endPoint be the bottom right
    if (endPointCPY.x < startPointCPY.x) {
      [startPointCPY.x, endPointCPY.x] = [endPointCPY.x, startPointCPY.x]; // Switch them around
    }

    if (endPointCPY.y < startPointCPY.y) {
      [startPointCPY.y, endPointCPY.y] = [endPointCPY.y, startPointCPY.y]; // Switch them around
    }

    /**
     * Epic square reference
     *    startPoint.x, startPoint.y___startPoint.x, endPoint.y
     *         |                          |
     *         |                          |
     *         |                          |
     *    endPoint.x, startPoint.y___endPoint.x, endPoint.y
     */

    const modifiedCells = []; // Array to store the modified cells

    for (let j = startPointCPY.y; j <= endPointCPY.y; j++) {
      for (let i = startPointCPY.x; i <= endPointCPY.x; i++) {
        const cell = gameField.getCell({ x: i, y: j }); // Capture the returned cellData object.
        modifiedCells.push(cell); // Add the cellData object to the modifiedCells array.
      }
    }

    // Set the char property of the modified cells to the desired character
    modifiedCells.forEach((cell) => {
      cell.char = gameField.selectedChar;
    });

    return modifiedCells; // Return the array of modified cellData objects.
  },
};

/**
 * Interface for drawing on the field using the select interface and an internal function
 * separated from select to allow reuse of that code for other stuff, like invisible walls
 */
const draw = {
  /**
   * Internal helper method to loop through and modify coordinates in the grid.
   * @param {Array} cells - Array of objects with `x` and `y` properties.
   * @param {string} char - The character to modify the coordinates with.
   */
  _setCellsContent: function (cells, char) {
    cells.forEach((cell) => {
      const { x, y } = cell;
      gameField.setCellContent(char, { x, y });
    });
  },

  /**
   * Draws a point on the field at the specified coordinates using the provided character.
   *
   * @param {object} point - An object that contains `x` and `y` properties representing the coordinates.
   * @param {char} char - The character used to draw the point.
   * @param {boolean} [shouldReturn=false] - Optional. Specifies whether to return the affected cell.
   *                                         Defaults to `false`. Here in case you want to do more to it
   * @return {CellData} The affected cell object, if `shouldReturn` is `true`.
   */
  point: (point, char, shouldReturn = false) => {
    cell = select.point(point);
    gameField.setCellContent(char, point);
    if (shouldReturn) {
      return cell;
    }
  },

  /**
   * Draws a line on the field at the specified coordinates using the provided character.
   *
   * @param {object} startPoint - An object that contains `x` and `y` properties
   *                              representing the coordinates for the start of the line.
   * @param {object} endPoint - An object that contains `x` and `y` properties
   *                            representing the coordinates for the end of the line.
   * @param {char} char - The character used to draw the line.
   * @param {boolean} [shouldReturn=false] - Optional. Specifies whether to return the affected cells.
   *                                         Defaults to `false`. Here in case you want to do more to it
   * @return {CellData} The affected cell object, if `shouldReturn` is `true`.
   */
  line: (startPoint, endPoint, char, shouldReturn = false) => {
    selectedLine = select.line(startPoint, endPoint);
    draw._setCellsContent(selectedLine, char);
    if (shouldReturn) {
      return cells;
    }
  },

  /**
   * Draws a square on the field at the specified coordinates using the provided character.
   *
   * @param {object} startPoint - An object that contains `x` and `y` properties
   *                              representing the coordinates for the start of the square.
   * @param {object} endPoint - An object that contains `x` and `y` properties
   *                            representing the coordinates for the end of the square.
   * @param {char} char - The character used to draw the line.
   * @param {boolean} [shouldReturn=false] - Optional. Specifies whether to return the affected cells.
   *                                         Defaults to `false`. Here in case you want to do more to it
   * @return {Array<CellData>} The affected cells array, if `shouldReturn` is `true`.
   */
  square: (startPoint, endPoint, char, shouldReturn = false) => {
    selectedSquare = select.square(startPoint, endPoint);
    draw._setCellsContent(selectedSquare, char);
    if (shouldReturn) {
      return cells;
    }
  },

  /**
   * Draws a filled square on the field at the specified coordinates using the provided character.
   *
   * @param {object} startPoint - An object that contains `x` and `y` properties
   *                              representing the coordinates for the start of the square.
   * @param {object} endPoint - An object that contains `x` and `y` properties
   *                            representing the coordinates for the end of the square.
   * @param {char} char - The character used to draw the line.
   * @param {boolean} [shouldReturn=false] - Optional. Specifies whether to return the affected cells.
   *                                         Defaults to `false`. Here in case you want to do more to it
   * @return {Array<CellData>} The affected cells array, if `shouldReturn` is `true`.
   */
  filledSquare: (startPoint, endPoint, char, shouldReturn = false) => {
    selectedFilledSquare = select.filledSquare(startPoint, endPoint);
    draw._setCellsContent(selectedFilledSquare, char);
    if (shouldReturn) {
      return cells;
    }
  },
};

/**
 * Utility functions to handle input sanitization.
 */
const inputUtil = {
  /**
   * Sanitizes coordinates input and returns an object with x and y properties.
   * @param {number} x - The x-coordinate value.
   * @param {number} y - The y-coordinate value.
   * @return {Object} - An object with x and y properties.
   */
  coords: function (x, y) {
    return {
      x: x,
      y: y,
    };
  },

  /**
   * Converts the input into an array. If the input is already an array, it is returned as is.
   * If the input is not an array, it is wrapped in an array and returned.
   *
   * @param {*} input - The input value to convert into an array.
   * @return {Array} - The input value converted into an array.
   */
  arrayer: function (input) {
    if (Array.isArray(input) == true) {
      return input;
    } else {
      const output = [input];
      return output;
    }
  },
};

const propertySetter = {
  /**
   * Sets the 'playerCollision' property to true for the specified cells.
   *
   * @param {Array|*} cells - An array of cells or a single cell to set the 'playerCollision' property for.
   */
  playerCollision: function (cells) {
    cells = inputUtil.arrayer(cells); // Update the 'cells' variable with the converted array

    cells.forEach((element) => {
      element.playerCollision = true;
    });
  },
};
