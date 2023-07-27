const player = {
  playerChar: "█",

  position: {
    x: 0,
    y: 0,
    backgroundChar: "", // for when he moves away
  },

  allowMovement: true, // flag to control movement

  setPosition: function (xPos, yPos) {
    const cell = field.getCell({ x: xPos, y: yPos }); // get cell data
    player.position.backgroundChar = cell.char; // save background char
    field.setCellContent(player.playerChar, cell); // make the char be the player's

    // Update player's position
    player.position.x = xPos;
    player.position.y = yPos;
  },

  move: function (direction) {
    // Check if the player is hidden, and prevent movement if so
    if (!player.allowMovement) {
      return;
    }

    /**
     * Moves player to determined position
     * @param {Int} x
     * @param {Int} y
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
     * Starts the movement in the specified direction.
     * @param {string} direction - The cardinal direction in which the movement should occur.
     * @param {string} keyCode - The key code associated with the direction.
     */
    function startMovement(direction, keyCode) {
      activeDirections[direction] = keyCode; // Store the direction and its key code
      if (!movementTimer) {
        movementTimer = setInterval(function () {
          for (const direction in activeDirections) {
            if (activeDirections.hasOwnProperty(direction)) {
              player.move(direction);
            }
          }
        }, movementInterval);
      }
    }

    /**
     * Stops the movement in the specified direction.
     * @param {string} direction - The cardinal direction to stop the movement.
     * @param {string} keyCode - The key code associated with the direction.
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

  hide: () => {
    player.allowMovement = false; // Set the flag to prevent movement
    player.playerChar = "";
    field.setCellContent("", player.position);
  },

  show: () => {
    player.allowMovement = true; // Set the flag to allow movement again
    player.playerChar = "█";
  },
};

field.element.addEventListener("mousedown", function () {
  field.element.focus();
});

player.listenForArrowKeys();
player.setPosition(0, 0);
