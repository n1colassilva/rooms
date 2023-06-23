/**
 * Represents a centered matrix with customizable dimensions.
 * The matrix is centered at (0, 0), and the size provided is divided by 2 (rounded up) to determine the number of elements in each direction.
 */
class CenteredMatrix {
  /**
   * Creates a new instance of the centered matrix.
   * @param {number} size - The size of the matrix (number of elements in each direction).
   */
  constructor(size) {
    this.width = Math.ceil(size / 2) * 2;

    this.height = Math.ceil(size / 2) * 2;

    this.data = [];

    // Calculate the starting and ending indices for x and y
    const startX = -Math.floor(this.width / 2);
    const endX = Math.floor(this.width / 2);
    const startY = -Math.floor(this.height / 2);
    const endY = Math.floor(this.height / 2);

    // Initialize the matrix with null values
    for (let y = startY; y <= endY; y++) {
      const row = [];
      for (let x = startX; x <= endX; x++) {
        row.push(null);
      }
      this.data.push(row);
    }

    // Override the getter and setter for the matrix to allow accessing elements using centeredMatrix[y][x] syntax
    this.data = new Proxy(this.data, {
      get(target, prop) {
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
          const rowIndex = parseInt(prop);
          return target[rowIndex - startY];
        }
        return target[prop];
      },
      set(target, prop, value) {
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
          const rowIndex = parseInt(prop);
          target[rowIndex - startY] = value;
        } else {
          target[prop] = value;
        }
        return true;
      },
    });
  }
}

// Usage:
const matrixSize = 5;
const centeredMatrix = new CenteredMatrix(matrixSize);
centeredMatrix[-2][1] = "Hello!";
console.log(centeredMatrix[-2][1]); // Output: 'Hello!'
