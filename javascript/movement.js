/**
 * Represents a player character with movement controls.
 */
class Player {
  /**
   * Creates a new Player instance.
   * @param {Field} gameField - The game field instance.
   * @param {boolean} [allowMovement=true] - Indicates if player movement is allowed.
   * @param {string} [playerChar="█"] - The character representing the player on the game field.
   */
  constructor(gameField, allowMovement = true, playerChar = "█") {
    /**
     * The game field instance.
     * @type {Field}
     */
    this.gameField = gameField;

    /**
     * Indicates if player movement is allowed.
     * @type {boolean}
     */
    this.allowMovement = allowMovement;

    /**
     * The character representing the player on the game field.
     * @type {string}
     */
    this.playerChar = playerChar;

    /**
     * The position of the player on the game field.
     * @type {{x: number, y: number, backgroundChar: string}}
     */
    this.position = {
      x: 0,
      y: 0,
      backgroundChar: " ",
    };

    // Initialize player controls
    this.listenForArrowKeys();

    // Ensure the game field element is focused on mouse down
    this.gameField.element.addEventListener("mousedown", () => {
      this.gameField.element.focus();
    });

    // Set the initial position of the player
    this.setPosition(0, 0);
  }

  /**
   * Sets the position of the player on the game field.
   * @param {number} xPos - The x-coordinate of the new position.
   * @param {number} yPos - The y-coordinate of the new position.
   */
  setPosition(xPos, yPos) {
    const cell = this.gameField.getCell({ x: xPos, y: yPos });
    this.position.backgroundChar = cell.char;
    this.gameField.setCellContent(this.playerChar, cell);
    this.position.x = xPos;
    this.position.y = yPos;
  }

  /**
   * Moves the player in the specified direction.
   * @param {string} direction - The direction in which to move the player ("north", "east", "south", or "west").
   */
  move(direction) {
    if (!this.allowMovement) {
      return;
    }

    const pos = this.position;
    switch (direction) {
      case "north":
        this.moveTo(pos.x, pos.y + 1);
        break;
      case "east":
        this.moveTo(pos.x + 1, pos.y);
        break;
      case "south":
        this.moveTo(pos.x, pos.y - 1);
        break;
      case "west":
        this.moveTo(pos.x - 1, pos.y);
        break;
      default:
        break;
    }
  }

  /**
   * Move the player to a specified position on the game field.
   * @param {number} x - The x-coordinate of the target position.
   * @param {number} y - The y-coordinate of the target position.
   */
  moveTo(x, y) {
    if (
      x < -this.gameField.columns / 2 ||
      x > this.gameField.columns / 2 ||
      y < -this.gameField.rows / 2 ||
      y >= this.gameField.rows / 2 + 1
    ) {
      throw new Error("Trying to move out of bounds eh?");
    } else if (this.gameField.getCell({ x: x, y: y }).playerCollision) {
      // No action when there's a player collision
    } else {
      this.gameField.setCellContent(
        this.position.backgroundChar,
        this.position
      );
      this.position.backgroundChar = this.gameField.getCell({
        x: x,
        y: y,
      }).char;
      this.gameField.setCellContent(this.playerChar, { x: x, y: y });
      this.position.x = x;
      this.position.y = y;
    }
  }

  /**
   * Listens for arrow key presses to control player movement.
   */
  listenForArrowKeys() {
    const movementInterval = 60;
    let movementTimer = null;
    const activeDirections = {};

    const startMovement = (direction, keyCode) => {
      activeDirections[direction] = keyCode;
      if (!movementTimer) {
        movementTimer = setInterval(() => {
          for (const direction in activeDirections) {
            if (activeDirections.hasOwnProperty(direction)) {
              this.move(direction);
            }
          }
        }, movementInterval);
      }
    };

    const stopMovement = (direction, keyCode) => {
      delete activeDirections[direction];
      if (Object.keys(activeDirections).length === 0) {
        if (movementTimer) {
          clearInterval(movementTimer);
          movementTimer = null;
        }
      }
    };

    document.addEventListener("keydown", (event) => {
      const key = event.key;
      const shouldUseArrowKeys = this.gameField.element.matches(":focus");

      if (shouldUseArrowKeys) {
        // Prevent arrow key scrolling when the game field is focused
        event.preventDefault();

        switch (key) {
          case "ArrowUp":
            startMovement("north", key);
            break;
          case "ArrowDown":
            startMovement("south", key);
            break;
          case "ArrowLeft":
            startMovement("west", key);
            break;
          case "ArrowRight":
            startMovement("east", key);
            break;
          default:
            break;
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key;

      if (key.startsWith("Arrow")) {
        for (const direction in activeDirections) {
          if (activeDirections[direction] === key) {
            stopMovement(direction, key);
            break;
          }
        }
      }
    });
  }

  /**
   * Hides the player character.
   */
  hide() {
    this.allowMovement = false;
    this.playerChar = "";
    this.gameField.setCellContent("", this.position);
  }

  /**
   * Shows the player character.
   */
  show() {
    this.allowMovement = true;
    this.playerChar = "█";
  }
}

const player = new Player(gameField);
gameField.element.addEventListener("mousedown", () => {
  gameField.element.focus();
});
