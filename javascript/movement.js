const player = {
  playerChar: "█",
  position: {
    x: 0,
    y: 0,
    backgroundChar: "", // for when he moves away
  },

  setPosition: function (xPos, yPos) {
    const cell = field.getCell({ x: xPos, y: yPos }); // get cell data
    player.position.backgroundChar = cell.char; // save background char
    field.setCellContent(player.playerChar, cell); // make the char be the player

    // Update player's position
    player.position.x = xPos;
    player.position.y = yPos;
  },

  /**
   * Moves the charachter
   * @param {*} direction
   */
  move: function (direction) {
    /**
     * Helper function for the move function
     * checks for limits and moves the player
     * @param {*} x
     * @param {*} y
     */
    function moveTo(x, y) {
      // Check if the desired position is within the field boundaries
      if (
        x < -field.columns / 2 ||
        x > field.columns / 2 ||
        y < -field.rows / 2 ||
        y >= field.rows / 2 + 1
      ) {
        // Invalid cell position
        throw console.error("trying to move out of bounds eh?");
      } else if (field.getCell({ x: x, y: y }).playerCollision == true) {
        // yep that's right, nothing
      } else {
        // Take bgchar and set it as the char proper
        field.setCellContent(player.position.backgroundChar, player.position);

        // Take char of desired position and store it as bgchar
        player.position.backgroundChar = field.getCell({ x: x, y: y }).char;

        // Set char proper of desired position as the player
        field.setCellContent(player.playerChar, { x: x, y: y });

        // Update player's position
        player.position.x = x;
        player.position.y = y;
      }
    }

    const pos = player.position;
    switch (direction) {
      case "north":
        moveTo(pos.x, pos.y + 1);
        break;
      case "east":
        moveTo(pos.x + 1, pos.y);
        break;
      case "south":
        moveTo(pos.x, pos.y - 1);
        break;
      case "west":
        moveTo(pos.x - 1, pos.y);
        break;
      default:
        break;
    }
  },

  listenForArrowKeys: function () {
    const movementInterval = 60; // Interval between movements in milliseconds
    let movementTimer = null;
    const activeDirections = {}; // Track active movement directions and their key codes
    /**
     * Moves the player in the set direction
     * @param {string} direction What cardinal direction player is moving
     * @param {keyCode} keyCode Key that is pressed
     */
    function startMovement(direction, keyCode) {
      activeDirections[direction] = keyCode; // Store the direction and its key code
      if (!movementTimer) {
        movementTimer = setInterval(function () {
          Object.values(activeDirections).forEach((direction) => {
            player.move(direction);
          });
        }, movementInterval);
      }
    }

    /**
     * helper function that stops movement
     * @param {string} direction Direction as a string, based on compass directions
     * @param {keyCode} keyCode What key is pressed
     */
    function stopMovement(direction, keyCode) {
      delete activeDirections[direction]; // Remove the direction and its key code
      if (Object.keys(activeDirections).length === 0) {
        if (movementTimer) {
          clearInterval(movementTimer);
          movementTimer = null;
        }
      }
    }

    document.addEventListener("keydown", function (event) {
      const key = event.key;

      // Check if the arrow keys should be used for movement
      const shouldUseArrowKeys = field.element.matches(":focus");

      if (shouldUseArrowKeys) {
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
            // Ignore other key presses
            break;
        }
      }
    });

    document.addEventListener("keyup", function (event) {
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
  },
};

field.element.addEventListener("keydown", function (event) {
  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
    // Handle game movement
  }
});

field.element.addEventListener("mousedown", function () {
  field.element.focus();
});

player.listenForArrowKeys();
player.setPosition(0, 0);
