/**
 * This file is responsible for:
 * Handling graphics field and it's properties
 * Handling field modification
 * And finally handling drawing on the field
 */

const field = {
  /**
   * The DOM element representing the game field.
   * @type {HTMLElement}
   */
  element: document.getElementById("game-field"),
  /**
   * Indicates whether the game has focus or not.
   * @type {boolean}
   */
  focus: false,

  /**
   * The number of columns in the field.
   * @type {number}
   */
  columns: 40,

  /**
   * The number of rows in the field.
   * @type {number}
   */
  rows: 20,

  /**
   * Matrix containing the cell elements in the grid
   */
  cellMatrix: null,

  /**
   * Recieves only click events, publishes the cell that was clicked
   */
  clickRegistry: null,

  /**
   * Initializes the game field by populating it with cells.
   * Each cell is represented by a span element with coordinates.
   */
  startField: function () {
    this.cellMatrix = new CenteredMatrix(this.columns, this.rows);

    /**
     * Registry of what cells were clicked.
     *
     * Publishes the celldata!
     */
    this.clickRegistry = new EventRegistry();
    /**
     * Populates the game field with cells.
     * Each cell is represented by a span element.
     * @param {number} row - The row index of the cell.
     * @param {number} column - The column index of the cell.
     */
    const createCell = (row, column) => {
      const cell = document.createElement("span");
      cell.classList.add("cell");
      cell.textContent = " ";

      // Calculate the adjusted x and y coordinates
      const adjustedX = column - Math.floor(this.columns / 2) - 1;
      const adjustedY = Math.floor(this.rows / 2) - row + 1;

      cell.dataset.x = adjustedX;
      cell.dataset.y = adjustedY;

      // EPIC CELL DATA STUFF
      // CHAPTER NAME: UNFORESEEN CONSEQUENCES
      // 21/06/23 - this has actually been the best idea i had

      cell.cellData = {
        x: parseInt(cell.dataset.x),
        y: parseInt(cell.dataset.y),
        get char() {
          return cell.textContent;
        },
        set char(value) {
          cell.textContent = value;
        },
        element: cell,
      };

      // adds cell to appropriate matrix position
      this.cellMatrix.set(adjustedX, adjustedY, cell);

      // puts cell on grid
      this.element.appendChild(cell);

      const clickHandler = (event) => {
        // Unsubscribe the click event listener
        // field.clickRegistry.unsubscribe("click", clickHandler);

        // grab the element itself
        const clickedCell = event.target;

        // publishes the CELLDATA
        this.clickRegistry.publish("click", clickedCell.cellData);
      };

      cell.addEventListener("click", clickHandler);
    };

    for (let row = 0; row <= this.rows; row++) {
      for (let column = 0; column <= this.columns; column++) {
        createCell.call(this, row + 1, column + 1);
      }
    }
  },

  /**
   * Returns cellData object from cell dom object from desired cell
   * @param {object} coordinates coordinates object
   * @param {number} coordinates.x x coordinate of desired cell
   * @param {number} coordinates.y y coordinate of desired cell
   * @return {object} cell returns the cellData object found in cell dom object
   */
  getCell: function (coordinates) {
    // Select the cell element based on the provided coordinates
    // Grabs the celldata defined at cell creation
    const cell = field.element.querySelector(
      `[data-x="${coordinates.x}"][data-y="${coordinates.y}"]`
    ).cellData;

    return cell;
  },

  /**
   * Simple function to set the content of a specific cell in the game field.
   * @param {string} char The character to be displayed in the cell.
   * @param {object} position
   * @param {int} position.x x value of position
   * @param {int} position.y y value of position
   * @param {boolean} [returnCell=false] - Determines whether to return the modified cells.
   * @return {object} Optionally return the celldata of the desired cell
   */
  setCellContent: function (char, position, returnCell = false) {
    let x;
    let y;

    // Check if the position parameter is celldata or DOM element
    if (
      typeof position === "object" &&
      position.hasOwnProperty("x") &&
      position.hasOwnProperty("y")
    ) {
      // Extract x and y from celldata
      x = position.x;
      y = position.y;
    } else {
      // Assume position is a DOM element and retrieve x and y from its celldata
      x = parseInt(position.dataset.x);
      y = parseInt(position.dataset.y);
    }

    // Select the cell element based on the extracted coordinates
    const cellElement = this.element.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    );

    if (!cellElement) {
      throw new Error("Invalid cell position");
    }

    cellElement.textContent = char[0];

    if (returnCell === true) {
      return cellElement;
    }
  },
};

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
   * @return {object} - CellData object
   */
  point: function (point) {
    cell = field.getCell(point);
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
   * @return {Array|null} An array of cellData objects representing the chosen cells
   */
  line: function (startPoint, endPoint) {
    let affectedCells;

    const dx = Math.abs(endPoint.x - startPoint.x);
    const dy = Math.abs(endPoint.y - startPoint.y);
    const sx = startPoint.x < endPoint.x ? 1 : -1;
    const sy = startPoint.y < endPoint.y ? 1 : -1;
    let err = dx - dy;
    let x = startPoint.x;
    let y = startPoint.y;

    while (x !== endPoint.x || y !== endPoint.y) {
      affectedCells.push(field.getCell({ x: x, y: y }));
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
    affectedCells.push(field.getCell(endPoint));

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
   * @return {Array|null} Array of cellData objects affected
   */
  square: function (startPoint, endPoint) {
    const affectedCells = [];

    // Make the startPoint be the top left and endPoint be the bottom right
    if (endPoint.x < startPoint.x) {
      [startPoint.x, endPoint.x] = [endPoint.x, startPoint.x]; // Switch them around
    }

    if (endPoint.y < startPoint.y) {
      [startPoint.y, endPoint.y] = [endPoint.y, startPoint.y]; // Switch them around
    }

    /**
     * Epic square reference
     *    startPoint.x, startPoint.y___startPoint.x, endPoint.y
     *    		|							|
     *    	  |							|
     *    		|							|
     *    endPoint.x, startPoint.y___endPoint.x, endPoint.y
     */

    // Create coordinates for the other two points
    const topRightPoint = field.getCell({ x: endPoint.x, y: startPoint.y });
    const bottomLeftPoint = field.getCell({ x: startPoint.x, y: endPoint.y });

    affectedCells.push(select.line(startPoint, topRightPoint)); // Top side
    affectedCells.push(select.line(topRightPoint, endPoint)); // Right side
    affectedCells.push(select.line(endPoint, bottomLeftPoint)); // Bottom side
    affectedCells.push(select.line(bottomLeftPoint, startPoint)); // Left side

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
   * @return {Array<Object>} - An array of modified cellData objects if returnCells is true, otherwise undefined.
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
        const cell = field.getCell({ x: i, y: j }).element; // Capture the returned cellData object.
        modifiedCells.push(cell); // Add the cellData object to the modifiedCells array.
      }
    }

    return modifiedCells; // Return the array of selected cell elements.
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
      field.setCellContent(char, { x, y });
    });
  },

  /**
   * Draws a point on the field at the specified coordinates using the provided character.
   *
   * @param {object} point - An object that contains `x` and `y` properties representing the coordinates.
   * @param {char} char - The character used to draw the point.
   * @param {boolean} [shouldReturn=false] - Optional. Specifies whether to return the affected cell.
   *                                         Defaults to `false`. Here in case you want to do more to it
   * @return {object} The affected cell object, if `shouldReturn` is `true`.
   */
  point: (point, char, shouldReturn = false) => {
    cell = select.point(point);
    field.setCellContent(char);
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
   * @return {object} The affected cell object, if `shouldReturn` is `true`.
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
   * @return {object} The affected cells array, if `shouldReturn` is `true`.
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
   * @return {object} The affected cells array, if `shouldReturn` is `true`.
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

// startup sequence
// fix column amount to an even number
// will be rounded UP
if (field.columns % 2 != 0) {
  field.columns++;
}
if (field.rows % 2 != 0) {
  field.rows++;
}
const rootStyle = document.documentElement.style;
rootStyle.setProperty("--columns", field.columns + 1);
rootStyle.setProperty("--rows", field.rows + 1);
field.startField();
// End of startup sequence

// =======================start of control interface i guess?=========================
// Center game field when clicked
// Add a click event listener to the game field
field.element.addEventListener("click", () => {
  const fieldWrapper = document.getElementById("field-wrapper");
  const fieldHeight = fieldWrapper.offsetHeight;
  const screenHeight = window.innerHeight;
  const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

  // Calculate the target scroll position
  const targetScrollTop =
    currentScrollTop +
    fieldWrapper.getBoundingClientRect().top -
    (screenHeight - fieldHeight) / 2;

  // Check if the field is already centered
  if (Math.abs(currentScrollTop - targetScrollTop) < 1) {
    return; // No need to scroll
  }

  // Scroll the page to the calculated offset
  window.scrollTo({
    top: targetScrollTop,
    behavior: "smooth", // Optional: Add smooth scrolling effect
  });
});

const fieldClickHandler = {
  // TBD
};
