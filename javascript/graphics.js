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

  clickRegistry: null,

  /**
   * Initializes the game field by populating it with cells.
   * Each cell is represented by a span element with coordinates.
   */
  startField: function () {
    this.cellMatrix = new CenteredMatrix(this.columns, this.rows);
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

      cell.addEventListener("click", (event) => {
        // grab the element itself
        const clickedCell = event.target;

        this.clickRegistry.publish("click", clickedCell);
      });
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
    const x = position.x;
    const y = position.y;

    // Select the cell element based on the provided coordinates
    const cellElement = this.element.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    );

    if (!cellElement) {
      throw new Error("Invalid cell position");
    }

    cellElement.textContent = char;

    if (returnCell == true) {
      return cellElement.cellData;
    }
  },
};

const draw = {
  // !BAD! - PERFORMANCE IMPACT NEGLIGIBLE
  // ! DEPRECATED UNTILL FURTHER NOTICE
  /**
   * Draws a line using a simple algorithm.
   *
   * @param {string} char - The character used to draw the line.
   * @param {Object} startPoint - The starting point of the line.
   * @param {number} startPoint.x - The x-coordinate of the starting point.
   * @param {number} startPoint.y - The y-coordinate of the starting point.
   * @param {Object} endPoint - The ending point of the line.
   * @param {number} endPoint.x - The x-coordinate of the ending point.
   * @param {number} endPoint.y - The y-coordinate of the ending point.
   *
   * @description
   * This function draws a line between the given start and end points using a simple algorithm.
   * The line can be drawn vertically (along the y-axis) or horizontally (along the x-axis).
   * If the x-coordinates of the start and end points are the same, the line is drawn along the y-axis.
   * If the y-coordinates are the same, the line is drawn along the x-axis.
   * The function sets the specified character in each cell along the line path using the `setCellContent` function.
   * If the start and end points do not align along any axis, an "Invalid line coordinates" message is logged to the console.
   */
  // _simpleLine: function (char, startPoint, endPoint) {
  // 	// Convert coordinates to integers
  // 	startPoint.x = Math.floor(startPoint.x);
  // 	startPoint.y = Math.floor(startPoint.y);
  // 	endPoint.x = Math.floor(endPoint.x);
  // 	endPoint.y = Math.floor(endPoint.y);

  // 	if (Math.abs(startPoint.x - endPoint.x) === 0) {
  // 		// If the x-coordinates are the same, draw along the y-axis
  // 		let minY = Math.min(startPoint.y, endPoint.y);
  // 		let maxY = Math.max(startPoint.y, endPoint.y);

  // 		for (let y = minY; y <= maxY; y++) {
  // 			field.setCellContent(char, startPoint.x, y);
  // 		}
  // 	} else if (Math.abs(startPoint.y - endPoint.y) === 0) {
  // 		// If the y-coordinates are the same, draw along the x-axis
  // 		let minX = Math.min(startPoint.x, endPoint.x);
  // 		let maxX = Math.max(startPoint.x, endPoint.x);

  // 		for (let x = minX; x <= maxX; x++) {
  // 			field.setCellContent(char, x, startPoint.y);
  // 		}
  // 	} else {
  // 		console.log("Invalid line coordinates");
  // 	}
  // },

  /**
   * Draws a line on the game field between the start and end points,
   * and returns the modified cells as an array of objects if specified.
   * Useful for graphics, gameplay, etc.
   *
   * @param {string} char - The character to represent the line.
   * @param {Object} startPoint - The starting point of the line.
   * @param {number} startPoint.x - The x-coordinate of the starting point.
   * @param {number} startPoint.y - The y-coordinate of the starting point.
   * @param {Object} endPoint - The ending point of the line.
   * @param {number} endPoint.x - The x-coordinate of the ending point.
   * @param {number} endPoint.y - The y-coordinate of the ending point.
   * @param {boolean} [returnCells=false] - Determines whether to return the modified cells.
   * @returns {Array|null} An array of objects representing the modified cells if `returnCells` is `true`, or `null` otherwise.
   */

  line: function (char, startPoint, endPoint, returnCells = false) {
    let affectedCells;

    const dx = Math.abs(endPoint.x - startPoint.x);
    const dy = Math.abs(endPoint.y - startPoint.y);
    const sx = startPoint.x < endPoint.x ? 1 : -1;
    const sy = startPoint.y < endPoint.y ? 1 : -1;
    let err = dx - dy;
    let x = startPoint.x;
    let y = startPoint.y;

    while (x !== endPoint.x || y !== endPoint.y) {
      field.setCellContent(char, { x: x, y: y });
      const err2 = 2 * err;
      if (err2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (err2 < dx) {
        err += dx;
        y += sy;
      }

      if (returnCells === true) {
        affectedCells.push(field.getCell({ x: x, y: y }));
      }
    }

    // Set the content for the end point
    field.setCellContent(char, endPoint);

    if (returnCells) {
      return affectedCells;
    } else {
      return null;
    }
  },

  /**
   * Draws a square on the field using the provided character.
   * @param {string} char - The character used to draw the square.
   * @param {Object} startPoint - The top-left point of the square.
   * @param {number} startPoint.x - The x-coordinate of the top-left point.
   * @param {number} startPoint.y - The y-coordinate of the top-left point.
   * @param {Object} endPoint - The bottom-right point of the square.
   * @param {number} endPoint.x - The x-coordinate of the bottom-right point.
   * @param {number} endPoint.y - The y-coordinate of the bottom-right point.
   * @param {boolean} [returnAffectedCells=false] - Determines whether to return the modified cells.
   * @return {Array|null} Array of objects affected
   */
  square: function (char, startPoint, endPoint, returnAffectedCells = false) {
    let affectedCells = [];

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
     *    	   	|							|
     *    		|							|
     *    endPoint.x, startPoint.y___endPoint.x, endPoint.y
     */

    // Create coordinates for the other two points
    const topRightPoint = field.getCell({ x: endPoint.x, y: startPoint.y });
    const bottomLeftPoint = field.getCell({ x: startPoint.x, y: endPoint.y });

    if (returnAffectedCells === true) {
      affectedCells += draw.line(char, startPoint, topRightPoint, true); // Top side
      affectedCells += draw.line(char, topRightPoint, endPoint, true); // Right side
      affectedCells += draw.line(char, endPoint, bottomLeftPoint, true); // Bottom side
      affectedCells += draw.line(char, bottomLeftPoint, startPoint, true); // Left side

      return affectedCells;
    } else {
      draw.line(char, startPoint, topRightPoint); // Top side
      draw.line(char, topRightPoint, endPoint); // Right side
      draw.line(char, endPoint, bottomLeftPoint); // Bottom side
      draw.line(char, bottomLeftPoint, startPoint); // Left side
    }
  },

  /**
   * Fills a rectangular box on the game field with a specified character.
   * Optionally returns the modified cells as an array of cell objects.
   * @param {string} char - The character to fill the box with.
   * @param {Object} startPoint - The starting point of the box.
   * @param {number} startPoint.x - The x-coordinate of the starting point.
   * @param {number} startPoint.y - The y-coordinate of the starting point.
   * @param {Object} endPoint - The ending point of the box.
   * @param {number} endPoint.x - The x-coordinate of the ending point.
   * @param {number} endPoint.y - The y-coordinate of the ending point.
   * @param {boolean} [returnCells=true] - Optional. Specifies whether to return the modified cells as an array.
   * @return {Array<Object>} - An array of modified cell objects if returnCells is true, otherwise undefined.
   */
  square: function (char, startPoint, endPoint, returnCells = false) {
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
        const cell = field.setCellContent(char, { x: i, y: j }, true); // Capture the returned cellData object
        modifiedCells.push(cell); // Add the cellData object to the modifiedCells array
      }
    }

    if (returnCells) {
      return modifiedCells; // Return the array of modified cellData objects
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
