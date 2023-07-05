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
      const point = await editor.listenForCellClick();
      const cell = field.setCellContent("|", point, true); // Use 'const' instead of 'cell:'
      editor.MODIFY_CHAR([cell]); // Pass the cell as an array to MODIFY_CHAR
    },

    // goes from A to B
    line: async function () {
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      draw.line(await editor.MODIFY_CHAR(), point1, point2);
    },

    // its the one that is filled
    square: async function () {
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      draw.square(await editor.MODIFY_CHAR(), point1, point2);
    },

    // this one is empty inside
    box: async function () {
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      draw.box(await editor.MODIFY_CHAR(), point1, point2);
    },
  },

  /**
   * waits for a cell click via pub sub, used in draw
   * functions to allow mouse input
   */
  listenForCellClick: async function () {
    return (
      await new Promise((resolve) =>
        field.clickRegistry.subscribe("click", resolve)
      )
    ).cellData;
  },

  /**
   * Allows you to type on the selected cells
   *
   * @param {Array} cells  - Array of cells to be modified
   */
  MODIFY_CHAR: (cells) => {
    // Step 1: Make the cells editable
    cells.forEach((cell) => {
      cell.contentEditable = "true";
    });

    // Step 2: Handle simultaneous typing
    // Add event listener for the "input" event on each cell
    cells.forEach((cell) => {
      cell.addEventListener("input", _handleCellInput);
    });

    // Step 3: Disable editing on Enter key press
    // Add event listener for the "keydown" event on each cell
    cells.forEach((cell) => {
      cell.addEventListener("keydown", handleCellKeyDown);
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
