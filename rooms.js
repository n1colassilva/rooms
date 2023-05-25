let field = {
	element: document.getElementById("game-field"),
	columns: 30,
	rows: 20,

	startField: function () {
		for (let row = 1; row <= this.rows; row++) {
			for (let column = 1; column <= this.columns; column++) {
				const cell = document.createElement("span");
				cell.textContent = "l";
				cell.dataset.x = column - 1; // i love starting from 0
				cell.dataset.y = row - 1; // t
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

	draw: {
		/**
		 * @param {string} char charachter you'll draw with
		 * 
		 */
		simpleLine: function (char, x1, y1, x2, y2) {},
		line: function (char, xStart, yStart, xEnd, yEnd) {
			if (Math.abs(xStart) === Math.abs(xEnd) || Math.abs(yStart) === Math.abs(yEnd)) {
			}
			//Shoutout to my boy bresenham he is a real one

			// Convert coordinates to integers
			xStart = Math.floor(xStart);
			yStart = Math.floor(yStart);
			xEnd = Math.floor(xEnd);
			yEnd = Math.floor(yEnd);

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
