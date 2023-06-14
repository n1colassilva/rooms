let player = {
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

	move: function (direction) {
		function moveTo(x, y) {
			// Check if the desired position is within the field boundaries
			if (x < -field.columns / 2 || x > field.columns / 2 || y < -field.rows / 2 - 1 || y >= field.rows / 2) {
				// Invalid cell position
				throw console.error("trying to move out of bounds eh?");
			}

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
			// case "northeast":
			// 	pos.x++;
			// 	pos.y++;
			// 	break;
			// case "southeast":
			// 	pos.x++;
			// 	pos.y--;
			// 	break;
			// case "southwest":
			// 	pos.x--;
			// 	pos.y--;
			// 	break;
			// case "northwest":
			// 	pos.x--;
			// 	pos.y++;
			// break;
			default:
				break;
		}
	},

	// Creating event listeners for movement
	listenForArrowKeys: function () {
		document.addEventListener("keydown", function (event) {
			const key = event.key;

			// Check if the arrow keys should be used for movement
			const shouldUseArrowKeys = field.element.matches(":focus");

			if (shouldUseArrowKeys) {
				switch (key) {
					case "ArrowUp":
						player.move("north");
						break;
					case "ArrowDown":
						player.move("south");
						break;
					case "ArrowLeft":
						player.move("west");
						break;
					case "ArrowRight":
						player.move("east");
						break;
					default:
						// Ignore other key presses
						break;
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