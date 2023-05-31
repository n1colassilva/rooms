let field = {
	/**
	 * The DOM element representing the game field.
	 * @type {HTMLElement}
	 */
	element: document.getElementById("game-field"),

	//! make sure anything that changes this sets it as an even

	/**
	 * The number of columns in the field.
	 * @type {number}
	 * !Make sure it's an even number so 0,0 is centered
	 */
	columns: 40,

	/**
	 * The number of rows in the field.
	 * @type {number}
	 * !Make sure it's an even number so 0,0 is centered
	 */
	rows: 20,

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
		//DONE: Make the center be 0,0
		//TODO: Allow expansion or widening support (conserve or move 0,0 accordingly)

		function createCell(row, column) {
			const cell = document.createElement("span");
			cell.textContent = "'";

			// Calculate the adjusted x and y coordinates
			const adjustedX = column - Math.ceil(this.columns / 2);
			const adjustedY = row - Math.ceil(this.rows / 2);

			cell.dataset.x = adjustedX;
			cell.dataset.y = -adjustedY; // Invert the y-coordinate to have negative values

			//EPIC CELL DATA STUFF
			//CHAPTER NAME: UNFORESEEN CONSEQUENCES

			cell.cellData = {
				x: parseInt(cell.dataset.x),
				y: parseInt(cell.dataset.y),
				char: cell.textContent, // god i hope this allows the cell to get modified
				element: cell, // so the functions that find it can just grab this object and are ablre to reference the dom
			};

			this.element.appendChild(cell); //Appends the cell to the field element (it took me embarrasingly long to re-remember what this was)
		}

		for (let row = 1; row <= this.rows; row++) {
			for (let column = 1; column <= this.columns; column++) {
				createCell.call(this, row, column);
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
	setCellContent: function (char, coordinates) {
		let locatedCellData = field.getCell(coordinates);

		if (Math.abs(locatedCellData.x) > field.rows / 2 || Math.abs(locatedCellData.y) > field.columns || typeof char != "string") {
			console.log(`Error: cell x:${locatedCellData.x},y:${locatedCellData.y} doesn't exist, uh oh`);
			// DONE: Add error handling if the locatedCell is not found.
		} else if (locatedCellData) {
			locatedCellData.element.textContent = char[0]; //[0] so no multichar malarkey happens
		} else {
			console.log("You're gonna have a bad time"); // DoN'T iNcLuDe LoGs iN pRoD
		}
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
	 * Draws a line on the field using the Bresenham algorithm.
	 * @param {string} char - The character used to draw the line.
	 * @param {Object} startPoint - The starting point of the line.
	 * @param {number} startPoint.x - The x-coordinate of the starting point.
	 * @param {number} startPoint.y - The y-coordinate of the starting point.
	 * @param {Object} endPoint - The ending point of the line.
	 * @param {number} endPoint.x - The x-coordinate of the ending point.
	 * @param {number} endPoint.y - The y-coordinate of the ending point.
	 */

	// TODO?: return all the elements used for the line for setting classes
	line: function (char, startPoint, endPoint) {
		let affectedCells; // variable to return modified cells as an array of objects
		// usefull for graphics, gameplay etc

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

			affectedCells.push(field.getCell({ x: x, y: y }));
		}

		// Set the content for the end point
		field.setCellContent(char, endPoint);

		return affectedCells;
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
	square: function (char, startPoint, endPoint) {
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

		draw.line(char, startPoint, topRightPoint); // Top side
		draw.line(char, topRightPoint, endPoint); // Right side
		draw.line(char, endPoint, bottomLeftPoint); // Bottom side
		draw.line(char, bottomLeftPoint, startPoint); // Left side
	},

	//todo: make filled box >:(
	//filledBox: function (char, startPoint, endPoint) {

	// let inde
	// 	for (let index.x = 0; index.x < ; index.x++) {
	// 		const element = array[index.x];

	// 	}
	// },
};

/**
 * Functions to handle messy inputs *
 *
 * !(TRY TO USE THEM ONLY) FOR DEBUGGING PURPOSES!
 */
let inputSanitizer = {
	/**
	 * recieves x y
	 * returns object with those as properties
	 */
	coords: function (x, y) {
		const coordsOBJ = {
			x: x,
			y: y,
		};
		return coordsOBJ;
	},

	integer: function () {},
};

let rootStyle = document.documentElement.style;
rootStyle.setProperty("--columns", field.columns);
rootStyle.setProperty("--rows", field.rows);
field.startField();
