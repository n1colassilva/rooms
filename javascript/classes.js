/**
 * This file contains several classes and other stuffs used throughout the app
 *
 * These are grouped together because they are intended to be reused and expanded
 * where necessary
 *
 * TODO: Eslint will complain about the classes not being used and i should do something about it
 * ? Maybe make eslint read all files as one
 */

// Define the custom CellData type
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
 * The game field, now made to be reused!
 */
class Field {
  /**
   * Constructs a new Field instance.
   * @param {number} columns - The number of columns in the field.
   * @param {number} rows - The number of rows in the field.
   * @param {string} field - The DOM id of the element to contain the field.
   */
  constructor(columns, rows, field) {
    this.element = document.getElementById(field);
    this.focus = false;
    this.columns = columns;
    this.rows = rows;
    this.cellMatrix = null;
    this.clickRegistry = null;
  }

  /**
   * Initializes the game field by populating it with cells.
   * Each cell is represented by a span element with coordinates.
   */
  startField() {
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

      /**
       * A lot will be done using this Celldata object instead of the element, this is done to simplify and avoid access
       * to things we dont need accessed
       *
       * The intention is basically to just hide the html wizardry
       */
      cell.cellData = {
        x: parseInt(cell.dataset.x),
        y: parseInt(cell.dataset.y),
        get char() {
          return cell.textContent;
        },
        set char(value) {
          cell.textContent = value;
        },
        // element: cell,
      };

      // adds cell to appropriate matrix position
      this.cellMatrix.set(adjustedX, adjustedY, cell.cellData);

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

    if (gameField.columns % 2 != 0) {
      gameField.columns++;
    }
    if (gameField.rows % 2 != 0) {
      gameField.rows++;
    }

    /**
     * Dynamically creates CSS rules for a grid and applies them to an HTML element with a specific ID.
     *
     * @param {HTMLElement} gridElement - The ID of the HTML element where the CSS rules will be applied.
     * @return {void}
     */
    function createGridStyles(gridElement) {
      // Define the CSS rule text with the specified variable prefix
      const cssRule = `
      grid-template-columns: repeat(
        var(--${gridElement.id}-columns),
        1fr
      );
      grid-template-rows: repeat(
        var(--${gridElement.id}-rows),
        1ch
      );
      `;
      // Create a <style> element if it doesn't exist
      let styleElement = document.getElementById("dynamic-styles");
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "dynamic-styles";
        document.head.appendChild(styleElement);
      }

      // Create a CSS rule with the specified ID and insert it into the <style> element
      const styleSheet = styleElement.sheet;
      styleSheet.insertRule(
        `#${gridElement.id} { ${cssRule} }`,
        styleSheet.cssRules.length
      );

      // actually set the value
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty(
        `--${gridElement.id}-columns`,
        gameField.columns + 1
      );
      rootStyle.setProperty(`--${gridElement.id}-rows`, gameField.rows + 1);
    }
    createGridStyles(this.element);
  }

  /**
   * Returns cellData object from cell dom object from desired cell
   * @param {object} coordinates coordinates object
   * @param {number} coordinates.x - x coordinate of desired cell
   * @param {number} coordinates.y - y coordinate of desired cell
   * @return {CellData} - cell returns the cellData object found in cell dom object
   */
  getCell(coordinates) {
    // Select the cell element based on the provided coordinates
    // Grabs the celldata defined at cell creation
    const cell = gameField.element.querySelector(
      `[data-x="${coordinates.x}"][data-y="${coordinates.y}"]`
    ).cellData;
    return cell;
  }

  /**
   * Simple function to set the content of a specific cell in the game field.
   * @param {string} char The character to be displayed in the cell.
   * @param {object} position
   * @param {int} position.x x value of position
   * @param {int} position.y y value of position
   * @param {boolean} [returnCell=false] - Determines whether to return the modified cells.
   * @return {CellData} Optionally return the celldata of the desired cell
   */
  setCellContent(char, position, returnCell = false) {
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
    const cellData = gameField.getCell({ x: x, y: y });

    if (!cellData) {
      throw new Error("Invalid cell position");
    }

    cellData.char = char[0];

    if (returnCell === true) {
      return cellData;
    }
  }
}

/**
 * Represents a matrix with 0,0 as the center, allows negative values, must be pre defined
 */
class CenteredMatrix {
  /**
   * Constructs a new CenteredMatrix instance.
   * @param {number} width - The width of the matrix.
   * @param {number} height - The height of the matrix.
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.matrix = this.createMatrix(width, height);
  }

  /**
   * Creates a new matrix with the specified width and height.
   * @private
   * @param {number} width - The width of the matrix.
   * @param {number} height - The height of the matrix.
   * @return {Array<Array<any>>} - The created matrix.
   */
  createMatrix(width, height) {
    const matrix = [];
    const startX = -Math.floor(width / 2);
    const startY = -Math.floor(height / 2);
    const endX = Math.ceil(width / 2);
    const endY = Math.ceil(height / 2);

    for (let x = startX; x <= endX; x++) {
      const column = [];
      for (let y = startY; y <= endY; y++) {
        column.push(null);
      }
      matrix.push(column);
    }

    return matrix;
  }

  /**
   * Retrieves the value at the specified coordinates.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @return {any} - The value at the given coordinates.
   */
  get(x, y) {
    const adjustedX = x + Math.floor(this.width / 2);
    const adjustedY = y + Math.floor(this.height / 2);
    return this.matrix[adjustedX][adjustedY];
  }

  /**
   * Sets the value at the specified coordinates.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {any} value - The value to be set.
   */
  set(x, y, value) {
    const adjustedX = x + Math.floor(this.width / 2);
    const adjustedY = y + Math.floor(this.height / 2);
    this.matrix[adjustedX][adjustedY] = value;
  }
}

/**
 * Event registry
 * to handle event distribution
 */
class EventRegistry {
  /**
   * Sets up subscribers array
   */
  constructor() {
    this.subscribers = {};
  }
  // Could add a publisher registry

  /**
   * Subscribe to an event
   *
   * @param {string} event - Name of the event.
   * @param {Function} callback - Callback for when the event is published
   * @return {void}
   */
  subscribe(event, callback) {
    // Checks if there are subscribers to the specific event
    if (!this.subscribers[event]) {
      // If not make an array to store the subscribers
      this.subscribers[event] = [];
    }

    // Add the callback function to the subscribers array for the event
    this.subscribers[event].push(callback);
  }
  /**
   * Unsubscribe from an event.
   *
   * @param {string} event - Name of the event.
   * @param {Function} callback - Callback function to unsubscribe.
   * @return {void}
   */
  unsubscribe(event, callback) {
    if (this.subscribers[event]) {
      this.subscribers[event] = this.subscribers[event].filter(
        (subscriber) => subscriber !== callback
      );
    }
  }

  /**
   * Method to publish an event
   * @param {string} event - Name of event
   * @param {any} data - what to publish
   */
  publish(event, data) {
    // Check for subscribers
    if (this.subscribers[event]) {
      // Iterate over subscribers and run their callbacks
      this.subscribers[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}
