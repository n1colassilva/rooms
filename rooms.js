let field = {
	element: document.getElementById("game-field"),
	columns: 60,
	rows: 36,

	startField: function () {
		for (let row = 1; row <= this.rows; row++) {
			for (let column = 1; column <= this.columns; column++) {
				const cell = document.createElement("span");
				cell.textContent = "l";
				cell.dataset.x = column - 1; // i love starting from 0
				cell.dataset.y = row - 1; // yep from 0 yes yes
				this.element.appendChild(cell);
			}
		}
	},

	setCellContent: function (char, x, y) {
		let locatedCell = field.element.querySelector(`[data-x="${x}"][data-y="${y}"]`);
		if (locatedCell) {
			locatedCell.textContent = char;
		}
	},

	getCell: function (coordinates) {
		let cell = {
			element: field.element.querySelector(`[data-x="${coordinates.x}"][data-y="${coordinates.y}"]`),
			char: this.element.textContent,
			x: coordinates.x,
			y: coordinates.y,
		};
		return cell;
	},

	draw: {
		/**
		 * @param {string} char charachter you'll draw with
		 * @description simpler algorithm to draw lines, meant to work with the line
		 */
		_simpleLine: function (char, x1, y1, x2, y2) {
			if (Math.abs(x1 - x2) === 0) {
				// If the x-coordinates are the same, draw along the y-axis
				let minY = Math.min(y1, y2);
				let maxY = Math.max(y1, y2);

				for (let y = minY; y <= maxY; y++) {
					field.setCellContent(char, x1, y);
				}
			} else if (Math.abs(y1 - y2) === 0) {
				// If the y-coordinates are the same, draw along the x-axis
				let minX = Math.min(x1, x2);
				let maxX = Math.max(x1, x2);

				for (let x = minX; x <= maxX; x++) {
					field.setCellContent(char, x, y1);
				}
			} else {
				console.log("Invalid line coordinates");
			}
		},

		line: function (char, startPoint, endPoint) {
			// detection
			//Shoutout to my boy bresenham he is a real one

			// Convert coordinates to integers
			startPoint.x = Math.floor(startPoint.x);
			startPoint.y = Math.floor(startPoint.y);
			endPoint.x = Math.floor(endPoint.x);
			endPoint.y = Math.floor(endPoint.y);

			// Calculate differences and determine the direction
			let dx = Math.abs(xEnd - xStart);
			let dy = Math.abs(yEnd - yStart);
			let stepX = xStart < xEnd ? 1 : -1;
			let stepY = yStart < yEnd ? 1 : -1;

			// Calculate initial error
			let error = dx - dy;

			while (!(xStart === xEnd && yStart === yEnd)) {
				// Set coordinates of the current point
				field.setCellContent(char, xStart, yStart);

				// Calculate double the error
				let error2 = error << 1;

				// Update x coordinate if the error is greater than -dy
				if (error2 > -dy) {
					error -= dy;
					xStart += stepX;
				}

				// Update y coordinate if the error is less than dx
				if (error2 < dx) {
					error += dx;
					yStart += stepY;
				}
			}
		},

		square: function (char, x1, y1, x2, y2) {
			//make the 1 pair be the top left and 2 be the bottom right
			if (x2 > x1) {
				[x1, x2] = [x2, x1]; //switch them around
			}

			if (y2 > y1) {
				[y1, y2] = [y2, y1]; //switch around pt 2
			}
		},
	},
};

let rootStyle = document.documentElement.style;
rootStyle.setProperty("--columns", field.columns);
rootStyle.setProperty("--rows", field.rows);
field.startField();
