editor = {
  /**
   * Enables and disables editor
   * @param {boolean} enable
   */
  enable: false,

  /**
   * Object filled with the methods to draw stuff using the MOUSE
   */
  make: {
    // just a dot, a single cell
    dot: async function () {
      const point = await editor.listenForCellClick(); // Gets the cell that was clicked
      console.log("Clicked Cell:", point);

      await editor._editCell(inputUtil.arrayer(point)); // since `_editCell` only recieves array we use the arrayer₢
    },

    // goes from A to B
    line: async function () {
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const lineArray = select.line(point1, point2);
      editor._editCell(lineArray);
    },

    // its the one that is filled
    square: async function () {
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const squareArray = select.square(point1, point2);
      editor._editCell(squareArray);
    },

    // this one is empty inside
    filledSquare: async function () {
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const filledSquareArray = select.filledSquare(point1, point2);
      editor._editCell(filledSquareArray);
    },
  },

  /**
   * waits for a cell click via pub sub, used in draw
   * functions to allow mouse input
   */
  listenForCellClick: async function () {
    return new Promise((resolve) => {
      const clickHandler = (event) => {
        const clickedCell = event;
        // Unsubscribe the click event listener
        field.clickRegistry.unsubscribe("click", clickHandler);
        resolve(clickedCell);
      };

      field.clickRegistry.subscribe("click", clickHandler);
    });
  },

  /**
   * Allows you to type on the selected cells
   *
   * @param {Array} cells  - Array of cells to be modified
   */
  _editCell: (cells) => {
    console.log("Cells:", cells);

    // Step 1: Make the cells editable
    cells.forEach((cell) => {
      console.log("Cell:", cell);
      cell.contentEditable = "true";
    });

    // Step 2: Handle simultaneous typing
    // Add event listener for the "input" event on each cell
    cells.forEach((cell) => {
      cell.element.addEventListener("input", _handleCellInput);
    });

    // Step 3: Disable editing on Enter key press
    // Add event listener for the "keydown" event on each cell
    cells.forEach((cell) => {
      cell.element.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.target.contentEditable = "false";
        }
      });
    });

    /**
     * Event handler for simultaneous typing
     * @param {*} event
     */
    function _handleCellInput(event) {
      // Get the typed value
      const typedValue = event.target.textContent;

      // Update the content of all other cells with the typed value
      cells.forEach((cell) => {
        if (cell !== event.target) {
          cell.textContent = typedValue;
        }
      });
    }
  },
};
