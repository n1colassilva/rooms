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
      if (editor.enable == false) {
        return alert("Editor not enabled");
      }
      const point = await editor.listenForCellClick();
      const char = prompt("Enter the character to draw:");
      if (char) {
        draw.point(point, char);
      }
    },

    // goes from A to B
    line: async function () {
      if (editor.enable == false) {
        return alert("Editor not enabled");
      }
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const char = prompt("Enter the character to draw:");
      if (char) {
        draw.line(point1, point2, char);
      }
    },

    // its the one that is filled
    square: async function () {
      if (editor.enable == false) {
        return alert("Editor not enabled");
      }
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const char = prompt("Enter the character to draw:");
      if (char) {
        draw.square(point1, point2, char);
      }
    },

    // this one is empty inside
    filledSquare: async function () {
      if (editor.enable == false) {
        return alert("Editor not enabled");
      }
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const char = prompt("Enter the character to draw:");
      if (char) {
        draw.filledSquare(point1, point2, char);
      }
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
    // Step 1: Make the cells editable
    cells.forEach((cell) => {
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

  /**
   * Saves the current field matrix of cellDatae
   * into a JSON file
   *
   * If other places need a download function move this to classes.js
   * and make this just call the function with whatever modifications needed
   */
  save: () => {
    /**
     * Downloads a JSON object as a file.
     * Prompts the user to enter a filename and initiates the download.
     *
     * @param {Object} jsonContent - The JSON object to be downloaded.
     */
    function _downloadJSON(jsonContent) {
      const jsonStr = JSON.stringify(jsonContent);
      const blob = new Blob([jsonStr], { type: "application/json" });

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);

      const filename = prompt("Enter a filename for the JSON file:");
      if (filename) {
        downloadLink.download = `${filename}.json`;
        downloadLink.click();
      } else {
        alert("Filename cannot be empty. Save cancelled.");
      }
    }

    const copyMatrix = [];
    const originalMatrix = field.cellMatrix.matrix;

    originalMatrix.forEach((row, rowIndex) => {
      copyMatrix[rowIndex] = [];

      row.forEach((element, columnIndex) => {
        copyMatrix[rowIndex][columnIndex] = JSON.parse(
          JSON.stringify(originalMatrix[rowIndex][columnIndex])
        );
        copyMatrix[rowIndex][columnIndex].element = null;
      });
    });

    _downloadJSON(copyMatrix);
  },
};
