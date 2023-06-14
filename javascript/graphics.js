let field = {
	/**
	 * The DOM element representing the game field.
	 * @type {HTMLElement}
	 */
	element: document.getElementById("game-field"),
	/**
	 * Indicates whether the game has focus or not
	 * @type {boolean}
	 */
	focus: false,

	/**
	 * The number of columns in the field.
	 * @type {number}
	 */
	columns: 11,

	/**
	 * The number of rows in the field.
	 * @type {number}
	 */
	rows: 11,

	/**
	 * Initializes the game field by populating it with cells.
	 * Each cell is represented by a span element with coordinates.
	 */
	startField: function () {
		/**
		 * Populates the game field with cells.
		 * Each cell is represented by a span element.
		 * @param {number} row - The row index of the cell.
		 * @param {number} column - The column index of the cell.
		 */
		function createCell(row, column) {
			const cell = document.createElement("span");
			cell.textContent = "·";

			// Calculate the adjusted x and y coordinates
			const adjustedX = column - Math.floor(this.columns / 2) - 1;
			const adjustedY = Math.floor(this.rows / 2) - row + 1;

			cell.dataset.x = adjustedX;
			cell.dataset.y = adjustedY;

			// EPIC CELL DATA STUFF
			// CHAPTER NAME: UNFORESEEN CONSEQUENCES

			cell.cellData = {
				x: parseInt(cell.dataset.x),
				y: parseInt(cell.dataset.y),
				char: cell.textContent,
				element: cell,
			};

			this.element.appendChild(cell);
		}

		for (let row = 0; row <= this.rows; row++) {
			for (let column = 0; column <= this.columns; column++) {
				createCell.call(this, row + 1, column + 1);
			}
		}
	},

	/**
	 * Returns cellData object from cell dom object from desired cell
	 * @param {object} coordinates coordinates object
	 * @param {number} coordinates.x x coordinate of desired cell
	 * @param {number} coordinates.y y coordinate of desired cell
	 * @param {object} cell returns the cellData object found in cell dom object
	 */
	getCell: function (coordinates) {
		// Select the cell element based on the provided coordinates
		// Grabs the celldata defined at cell creation
		let cell = field.element.querySelector(`[data-x="${coordinates.x}"][data-y="${coordinates.y}"]`).cellData;

		return cell;
	},

	/**
	 * Simple function to set the content of a specific cell in the game field.
	 *
	 * @param {string} char - The character to be displayed in the cell.
	 * @param {number} coordinates.x - The x-coordinate of the cell.
	 * @param {number} coordinates.y - The y-coordinate of the cell.
	 */
	setCellContent: function (char, position) {
		const x = position.x;
		const y = position.y;

		// Select the cell element based on the provided coordinates
		const cellElement = this.element.querySelector(`[data-x="${x}"][data-y="${y}"]`);

		if (!cellElement) {
			throw new Error("Invalid cell position");
		}

		cellElement.textContent = char;
	},
};

let draw = {
	//!BAD! - PERFORMANCE IMPACT NEGLIGIBLE
	//! DEPRECATED UNTILL FURTHER NOTICE
	/**
	 * Draws a line using a simple algorithm.
	 *
	 * @param {string} char - The character used to draw the line.
	 * @param {Object} startPoint - The starting point of the line.
	 * @param {number} startPoint.x - The x-coordinate of the starting point.
	 * @param {number} startPoint.y - The y-coordinate of the starting point.
	 * @param {Object} endPoint - The ending point of the line.
	 * @param {number} endPoint.x - The x-coordinate of the ending point.
	 * @param {number} endPoint.y - The y-coordinate of the ending point.
	 *
	 * @description
	 * This function draws a line between the given start and end points using a simple algorithm.
	 * The line can be drawn vertically (along the y-axis) or horizontally (along the x-axis).
	 * If the x-coordinates of the start and end points are the same, the line is drawn along the y-axis.
	 * If the y-coordinates are the same, the line is drawn along the x-axis.
	 * The function sets the specified character in each cell along the line path using the `setCellContent` function.
	 * If the start and end points do not align along any axis, an "Invalid line coordinates" message is logged to the console.
	 */
	// _simpleLine: function (char, startPoint, endPoint) {
	// 	// Convert coordinates to integers
	// 	startPoint.x = Math.floor(startPoint.x);
	// 	startPoint.y = Math.floor(startPoint.y);
	// 	endPoint.x = Math.floor(endPoint.x);
	// 	endPoint.y = Math.floor(endPoint.y);

	// 	if (Math.abs(startPoint.x - endPoint.x) === 0) {
	// 		// If the x-coordinates are the same, draw along the y-axis
	// 		let minY = Math.min(startPoint.y, endPoint.y);
	// 		let maxY = Math.max(startPoint.y, endPoint.y);

	// 		for (let y = minY; y <= maxY; y++) {
	// 			field.setCellContent(char, startPoint.x, y);
	// 		}
	// 	} else if (Math.abs(startPoint.y - endPoint.y) === 0) {
	// 		// If the y-coordinates are the same, draw along the x-axis
	// 		let minX = Math.min(startPoint.x, endPoint.x);
	// 		let maxX = Math.max(startPoint.x, endPoint.x);

	// 		for (let x = minX; x <= maxX; x++) {
	// 			field.setCellContent(char, x, startPoint.y);
	// 		}
	// 	} else {
	// 		console.log("Invalid line coordinates");
	// 	}
	// },

	/**
	 * Draws a line on the game field between the start and end points,
	 * and returns the modified cells as an array of objects if specified.
	 * Useful for graphics, gameplay, etc.
	 *
	 * @param {string} char - The character to represent the line.
	 * @param {Object} startPoint - The starting point of the line.
	 * @param {number} startPoint.x - The x-coordinate of the starting point.
	 * @param {number} startPoint.y - The y-coordinate of the starting point.
	 * @param {Object} endPoint - The ending point of the line.
	 * @param {number} endPoint.x - The x-coordinate of the ending point.
	 * @param {number} endPoint.y - The y-coordinate of the ending point.
	 * @param {boolean} [returnCells=false] - Determines whether to return the modified cells.
	 * @returns {Array|null} An array of objects representing the modified cells if `returnCells` is `true`, or `null` otherwise.
	 */

	line: function (char, startPoint, endPoint, returnCells = false) {
		let affectedCells;

		const dx = Math.abs(endPoint.x - startPoint.x);
		const dy = Math.abs(endPoint.y - startPoint.y);
		const sx = startPoint.x < endPoint.x ? 1 : -1;
		const sy = startPoint.y < endPoint.y ? 1 : -1;
		let err = dx - dy;
		let x = startPoint.x;
		let y = startPoint.y;

		while (x !== endPoint.x || y !== endPoint.y) {
			field.setCellContent(char, { x: x, y: y });
			const err2 = 2 * err;
			if (err2 > -dy) {
				err -= dy;
				x += sx;
			}
			if (err2 < dx) {
				err += dx;
				y += sy;
			}

			if (returnCells === true) {
				affectedCells.push(field.getCell({ x: x, y: y }));
			}
		}

		// Set the content for the end point
		field.setCellContent(char, endPoint);

		if (returnCells) {
			return affectedCells;
		} else {
			return null;
		}
	},

	/**
	 * Draws a square on the field using the provided character.
	 * @param {string} char - The character used to draw the square.
	 * @param {Object} startPoint - The top-left point of the square.
	 * @param {number} startPoint.x - The x-coordinate of the top-left point.
	 * @param {number} startPoint.y - The y-coordinate of the top-left point.
	 * @param {Object} endPoint - The bottom-right point of the square.
	 * @param {number} endPoint.x - The x-coordinate of the bottom-right point.
	 * @param {number} endPoint.y - The y-coordinate of the bottom-right point.
	 */
	square: function (char, startPoint, endPoint, returnAffectedCells = false) {
		let affectedCells = [];

		// Make the startPoint be the top left and endPoint be the bottom right
		if (endPoint.x < startPoint.x) {
			[startPoint.x, endPoint.x] = [endPoint.x, startPoint.x]; // Switch them around
		}

		if (endPoint.y < startPoint.y) {
			[startPoint.y, endPoint.y] = [endPoint.y, startPoint.y]; // Switch them around
		}

		/**
		 * Epic square reference
		 *    startPoint.x, startPoint.y___startPoint.x, endPoint.y
		 *    		|							|
		 *    	   	|							|
		 *    		|							|
		 *    endPoint.x, startPoint.y___endPoint.x, endPoint.y
		 */

		// Create coordinates for the other two points
		let topRightPoint = field.getCell({ x: endPoint.x, y: startPoint.y });
		let bottomLeftPoint = field.getCell({ x: startPoint.x, y: endPoint.y });

		if (returnAffectedCells === true) {
			affectedCells += draw.line(char, startPoint, topRightPoint, true); // Top side
			affectedCells += draw.line(char, topRightPoint, endPoint, true); // Right side
			affectedCells += draw.line(char, endPoint, bottomLeftPoint, true); // Bottom side
			affectedCells += draw.line(char, bottomLeftPoint, startPoint, true); // Left side

			return affectedCells;
		} else {
			draw.line(char, startPoint, topRightPoint); // Top side
			draw.line(char, topRightPoint, endPoint); // Right side
			draw.line(char, endPoint, bottomLeftPoint); // Bottom side
			draw.line(char, bottomLeftPoint, startPoint); // Left side
		}
	},

	/**
	 * Fills a rectangular box on the game field with a specified character.
	 * Optionally returns the modified cells as an array of cell objects.
	 * @param {string} char - The character to fill the box with.
	 * @param {Object} startPoint - The starting point of the box.
	 * @param {number} startPoint.x - The x-coordinate of the starting point.
	 * @param {number} startPoint.y - The y-coordinate of the starting point.
	 * @param {Object} endPoint - The ending point of the box.
	 * @param {number} endPoint.x - The x-coordinate of the ending point.
	 * @param {number} endPoint.y - The y-coordinate of the ending point.
	 * @param {boolean} [returnCells=true] - Optional. Specifies whether to return the modified cells as an array.
	 * @returns {Array<Object>} - An array of modified cell objects if returnCells is true, otherwise undefined.
	 */
	filledBox: function (char, startPoint, endPoint, returnCells = true) {
		const adjustedStartX = startPoint.x - Math.floor(this.columns / 2);
		const adjustedStartY = Math.floor(this.rows / 2) - startPoint.y;
		const adjustedEndX = endPoint.x - Math.floor(this.columns / 2);
		const adjustedEndY = Math.floor(this.rows / 2) - endPoint.y;

		let affectedCells = [];

		// Iterate over each cell within the box boundaries
		for (let y = adjustedStartY; y <= adjustedEndY; y++) {
			for (let x = adjustedStartX; x <= adjustedEndX; x++) {
				// Set the content of the cell
				field.setCellContent(char, { x, y });

				// Store the modified cell in the affectedCells array
				affectedCells.push(field.getCell({ x, y }));
			}
		}

		// Return affectedCells array if returnCells is true
		if (returnCells) {
			return affectedCells;
		}
	},
};

/**
 * Utility functions to handle input sanitization.
 * Note: Use these functions only for debugging purposes!
 */
let inputSanitizer = {
	/**
	 * Sanitizes coordinates input and returns an object with x and y properties.
	 * @param {number} x - The x-coordinate value.
	 * @param {number} y - The y-coordinate value.
	 * @returns {Object} - An object with x and y properties.
	 */
	coords: function (x, y) {
		return {
			x: x,
			y: y,
		};
	},
};

// startup sequence
// fix column amount to an even number
// will be rounded UP
if (field.columns % 2 != 0) {
	field.columns++;
}
if (field.rows % 2 != 0) {
	field.rows++;
}
let rootStyle = document.documentElement.style;
rootStyle.setProperty("--columns", field.columns + 1);
rootStyle.setProperty("--rows", field.rows + 1);
field.startField();

// Center game field when clicked

// Add a click event listener to the game field
field.element.addEventListener("click", () => {
	const fieldWrapper = document.getElementById("field-wrapper");
	const fieldHeight = fieldWrapper.offsetHeight;
	const screenHeight = window.innerHeight;
	const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

	// Calculate the target scroll position
	const targetScrollTop = currentScrollTop + fieldWrapper.getBoundingClientRect().top - (screenHeight - fieldHeight) / 2;

	// Check if the field is already centered
	if (Math.abs(currentScrollTop - targetScrollTop) < 1) {
		return; // No need to scroll
	}

	// Scroll the page to the calculated offset
	window.scrollTo({
		top: targetScrollTop,
		behavior: "smooth", // Optional: Add smooth scrolling effect
	});
});
