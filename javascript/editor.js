editor = {
  /**
   * flag to store wether the editor is usable or not
   * @param {boolean} enable
   */
  enable: false,

  /**
   * Function to enable the editor
   */
  enableEditorSequence() {
    this.enable = true;
    editor._getInsertedChar();
    console.log("Editor: online");
    // Anything else that needs to be run
  },

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
      const char = insertedChar;
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
      const char = insertedChar;
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
      const char = insertedChar;
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
      const char = insertedChar;
      if (char) {
        draw.filledSquare(point1, point2, char);
      }
    },
  },

  // variable to store most recently typed char
  insertedChar: "",

  // function that creates the listener to update said char
  _getInsertedChar() {
    // Get a reference to the input element by its ID
    const charInput = document.getElementById("charInput");

    // Add an event listener for the 'input' event
    charInput.addEventListener("input", function (event) {
      // When the user types a character, this function will be called
      const userInput = event.target.value;
      // You can now use 'userInput' as the character entered by the user
      // For example, you can store it in a variable or process it further.

      insertedChar = userInput;
      console.log(insertedChar);
    });
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
        gameField.clickRegistry.unsubscribe("click", clickHandler);
        resolve(clickedCell);
      };

      gameField.clickRegistry.subscribe("click", clickHandler);
    });
  },

  /**
   * Saves the current gameField matrix of cellDatae
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

    // Saving the game grid to include it map package
    const copyMatrix = [];
    const originalMatrix = gameField.cellMatrix.matrix;

    originalMatrix.forEach((row, rowIndex) => {
      copyMatrix[rowIndex] = [];

      row.forEach((element, columnIndex) => {
        copyMatrix[rowIndex][columnIndex] = JSON.parse(
          JSON.stringify(originalMatrix[rowIndex][columnIndex])
        );
        copyMatrix[rowIndex][columnIndex].element = null;
      });
    });

    // saving other miscellaneous data

    const collisionGrid = {};

    // Load player data, could include more stuff later on
    const playerStatus = {
      movementAllow: player.allowMovement,
      visibilityAllow: player.show,
      spawn: null, // TODO: Figure this out
    };

    // Filling out the save package (there's a better name but this one sounds cooler)
    const saveData = {
      matrix: copyMatrix,
      collisionGrid: collisionGrid,
      player: playerStatus,
    };
    _downloadJSON(saveData);
  },

  load: () => {
    fetch("menu.json")
      .then((response) => response.json())
      .then((saveData) => {
        /**
         * Here the "saveData" is the save, duh
         *
         * i later on will do the fancy jdoc @typedef
         *
         * it contains, as of when this was written:
         * @param {matrix} matrix - the game matrix, it's only the visuals and their coordinates
         * @param {matrix} collisionGrid - A grid detailing the collisions
         * @param {object} player - contains if the player is visible, movable and where he spawns
         * Todo: Fix this documentation (intellisense my beloved)
         */

        // Here, the 'data' variable contains the parsed JSON object.
        // Now we use the data to rebuild your map.

        // 2-dimensional array parser 2000
        // Reads the matrix in data, writes to the game's gameField
        // ? maybe modify the gameField's matrix to just be references? are they references?
        gameGrid = saveData.matrix;
        for (let row = 0; row < gameGrid.length; row++) {
          for (let column = 0; column < gameGrid[row].length; column++) {
            const loadedCell = gameGrid[row][column];
            const realCell = gameField.getCell({
              x: loadedCell.x,
              y: loadedCell.y,
            });
            gameField.setCellContent(loadedCell.char, realCell);
          }
        }

        // Now we apply the collision data
        // see this is funny because it isnt here yet

        // Now we apply the attributes of the player
        player.visibilityAllow = saveData.player.visibilityAllow;
        player.allowMovement = saveData.player.movementAllow;
        // the intellisense can't keep up with my genius ////nonsense
      })
      .catch((error) => {
        console.error("Error fetching the JSON file:", error);
      });
  },
};

// continuoous thignmajirg

// listen for button
// wait for 2 valid mouse clicks
// if another button is pressed cancel the action
// read char box and use it to draw
const _startHoverRegistry = () => {
  hoverRegistry = new EventRegistry();

  const publishHover = (cellData) => {
    hoverRegistry.publish("hover", cellData);
  };
};

// This will be jank but i really need that event listener
document
  .getElementById("secret-editor-button")
  .addEventListener("click", function () {
    editor.enableEditorSequence();
    console.log("j"); // Call the enable sequence when the button is clicked
  });
