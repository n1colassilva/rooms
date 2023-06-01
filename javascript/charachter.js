let player = {
	playerChar: "█",
	position: {
		x: 0,
		y: 0,
		backgroundChar: "", // for when he moves away
	},

	setPosition: function (xPos, yPos) {
		const cell = field.getCell({ x: xPos, y: yPos }); //get celldata
		player.position.backgroundChar = cell.char; //save bg char
		field.setCellContent(player.playerChar, cell); // make the char be the player
	},

	move: function (direction) {
		function moveTo(x, y) {
			// take bgchar and set it as the char proper
			field.setCellContent(player.position.backgroundChar, player.position);

			// take char of desired position and store as bgchar
			player.position.backgroundChar = field.getCell({ x: x, y: y }).char;

			// set char proper of desired position as the player
			
		}

		const pos = player.position;
		switch (direction) {
			case "north":
				pos.y++;
				break;
			case "east":
				pos.x++;
				break;
			case "south":
				pos.y--;
				break;
			case "west":
				pos.x--;
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
		});
	},
};

player.listenForArrowKeys();
