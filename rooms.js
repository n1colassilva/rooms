let field = {
	element: document.getElementById("game-field"),
	columns: 30,
	rows: 20,

	startField: function () {
		for (let row = 1; row <= this.rows; row++) {
			for (let column = 1; column <= this.columns; column++) {
				const cell = document.createElement("span");
				cell.textContent = "l";
				cell.dataset.x = column;
				cell.dataset.y = row;
				this.element.appendChild(cell);
			}
		}
	},

	drawLine: function (char, xStart, yStart, xEnd, yEnd) {
		xStart = Math.floor(xStart);
		yStart = Math.floor(yStart);
		xEnd = Math.floor(xEnd);
		yEnd = Math.floor(yEnd);

		let dx = Math.abs(xEnd - xStart);
		let dy = Math.abs(yEnd - yStart);
		let sx = xStart < xEnd ? 1 : -1;
		let sy = yStart < yEnd ? 1 : -1;
		let err = dx - dy;

		while (!(xStart === xEnd && yStart === yEnd)) {
			let e2 = err << 1;
			if (e2 > -dy) {
				err -= dy;
				xStart += sx;
			}
			if (e2 < dx) {
				err += dx;
				yStart += sy;
			}
			console.log(xStart);
			console.log(yStart);
			let locatedCell = this.element.querySelector(`[data-x="${xStart}"][data-y="${yStart}"]`);
			locatedCell.textContent = char;
		}
	},
};

let rootStyle = document.documentElement.style;
rootStyle.setProperty("--columns", field.columns);
rootStyle.setProperty("--rows", field.rows);
field.startField();
