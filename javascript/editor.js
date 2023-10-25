const editor = {
  /**
   * Flag to store whether the editor is usable or not.
   * @type {boolean}
   */
  enable: false,

  /**
   * Function to enable the editor.
   */
  enableEditorSequence() {
    this.enable = true;
    console.log("Editor: online");
    // Anything else that needs to be run
  },

  /**
   * Object filled with the methods to draw stuff using the MOUSE.
   */
  make: {
    // just a dot, a single cell
    dot: async function () {
      if (editor.enable === false) {
        return alert("Editor not enabled");
      }
      const point = await editor.listenForCellClick();
      const char = editor.getInsertedChar();
      if (char) {
        draw.point(point, char);
        editor.btnVisualStateFlipper("dot");
      }
    },

    // goes from A to B
    line: async function () {
      if (editor.enable === false) {
        return alert("Editor not enabled");
      }
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const char = editor.getInsertedChar();
      if (char) {
        draw.line(point1, point2, char);
        editor.btnVisualStateFlipper("line");
      }
    },

    // its the one that is filled
    square: async function () {
      if (editor.enable === false) {
        return alert("Editor not enabled");
      }
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const char = editor.getInsertedChar();
      if (char) {
        draw.square(point1, point2, char);
        editor.btnVisualStateFlipper("square");
      }
    },

    // this one is empty inside
    filledSquare: async function () {
      if (editor.enable === false) {
        return alert("Editor not enabled");
      }
      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const char = editor.getInsertedChar();
      if (char) {
        draw.filledSquare(point1, point2, char);
        editor.btnVisualStateFlipper("filledsquare");
      }
    },

    dialogBox: async function () {
      if (editor.enable === false) {
        return alert("Editor not enabled");
      }

      const point1 = await editor.listenForCellClick();
      const point2 = await editor.listenForCellClick();
      const cornerChar = {
        topLeft: "┏",
        topRight: "┓",
        bottomLeft: "┗",
        bottomRight: "┛",
      };

      if (
        !cornerChar.topLeft ||
        !cornerChar.topRight ||
        !cornerChar.bottomLeft ||
        !cornerChar.bottomRight
      ) {
        return;
      }

      const startPoint = Object.assign({}, point1);
      const endPoint = Object.assign({}, point2);

      // Calculate the coordinates for the corners
      const topLeft = startPoint;
      const topRight = { x: endPoint.x, y: startPoint.y };
      const bottomLeft = { x: startPoint.x, y: endPoint.y };
      const bottomRight = endPoint;

      // Make sure the startPoint is the top left and the endPoint is the bottom right
      if (topRight.x < topLeft.x) {
        [topLeft.x, topRight.x] = [topRight.x, topLeft.x];
      }

      if (bottomRight.x < bottomLeft.x) {
        [bottomLeft.x, bottomRight.x] = [bottomRight.x, bottomLeft.x];
      }

      if (topLeft.y < bottomLeft.y) {
        [topLeft.y, bottomLeft.y] = [bottomLeft.y, topLeft.y];
      }

      if (topRight.y < bottomRight.y) {
        [topRight.y, bottomRight.y] = [bottomRight.y, topRight.y];
      }

      // Draw the horizontal lines
      const horizontalChar = "━";
      draw.line(topLeft, topRight, horizontalChar);
      draw.line(bottomLeft, bottomRight, horizontalChar);

      // Draw the vertical lines
      const verticalChar = "┃";
      draw.line(topLeft, bottomLeft, verticalChar);
      draw.line(topRight, bottomRight, verticalChar);

      // Draw the corners
      draw.point(topLeft, cornerChar.topLeft);
      draw.point(topRight, cornerChar.topRight);
      draw.point(bottomLeft, cornerChar.bottomLeft);
      draw.point(bottomRight, cornerChar.bottomRight);

      editor.btnVisualStateFlipper("dialogBox");
    },
  },

  /**
   * Starts the save manager UI
   *
   * @return {Field}
   */
  startSaveManager() {
    const saveManagerField = new PopupField(60, 40, "save-manager-field");
    saveManagerField.startField();

    return saveManagerField;
  },

  /**
   * Function to retrieve the inserted character from the input element.
   * @return {string} The inserted character.
   */
  getInsertedChar() {
    const charInput = document.getElementById("charInput");
    return charInput.value;
  },

  /**
   * Toggles the visual state of a button element based on its type.
   *
   * @param {string} btnType - The type of the button.
   * @throws {Error} If the button element with the specified type is not found.
   */
  btnVisualStateFlipper(btnType) {
    /**
     * Toggles the "editor-button-active" class on the button element with the specified type.
     *
     * If the button element is currently active, the class is removed; otherwise, it's added.
     *
     * @param {string} btnType - The type of the button.
     */
    const btnElement = document.getElementById(`editor-${btnType}`);

    if (!btnElement) {
      throw new Error(`Button element with type "${btnType}" not found.`);
    }

    if (!btnElement.classList.contains("editor-button-active")) {
      btnElement.classList.add("editor-button-active");
    } else {
      btnElement.classList.remove("editor-button-active");
    }
  },
  /**
   * Waits for a cell click via pub sub, used in draw
   * functions to allow mouse input.
   * @return {Promise} A promise that resolves with the clicked cell data.
   */
  listenForCellClick: async function () {
    return new Promise((resolve) => {
      const clickHandler = (event) => {
        const clickedCell = event;
        // Unsubscribe the click event listener
        // Replace 'gameField.clickRegistry' with your actual pub-sub implementation
        // You might want to use 'editor.clickRegistry' or a similar approach
        // depending on your implementation.
        gameField.clickRegistry.unsubscribe("click", clickHandler);
        resolve(clickedCell);
      };

      // Replace 'gameField.clickRegistry' with your actual pub-sub implementation
      // You might want to use 'editor.clickRegistry' or a similar approach
      // depending on your implementation.
      gameField.clickRegistry.subscribe("click", clickHandler);
    });
  },
};

// Registry to listen for when any cell is hovered over, use for preview

// Listen for button
// Wait for 2 valid mouse clicks
// If another button is pressed, cancel the action
// Read char box and use it to draw
// eslint-disable-next-line no-unused-vars
const _startHoverRegistry = () => {
  hoverRegistry = new EventRegistry();

  // eslint-disable-next-line no-unused-vars
  const publishHover = (cellData) => {
    hoverRegistry.publish("hover", cellData);
  };
};

// This will be jank but I really need that event listener for the editor button
document
  .getElementById("secret-editor-button")
  .addEventListener("click", function () {
    editor.enableEditorSequence();
  });
