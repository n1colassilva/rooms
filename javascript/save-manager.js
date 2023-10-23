// eslint-disable-next-line no-unused-vars
const saveManager = {
  /**
   * Saves the current field matrix of cellDatae
   * into a JSON file
   *
   * @param {field} field - a field that already exists
   */
  save(field) {
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

  /**
   * Loads data from json into field object
   * @param {field} field - Field object
   * @param {json} fileName - File to be loaded into specified field object
   */
  load(field, fileName) {
    fetch(fileName)
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
        // Reads the matrix in data, writes to the game's field
        // ? maybe modify the field's matrix to just be references? are they references?
        gameGrid = saveData.matrix;
        for (let row = 0; row < gameGrid.length; row++) {
          for (let column = 0; column < gameGrid[row].length; column++) {
            const loadedCell = gameGrid[row][column];
            const realCell = field.getCell({
              x: loadedCell.x,
              y: loadedCell.y,
            });
            field.setCellContent(loadedCell.char, realCell);
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
