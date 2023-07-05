/**
 * This file contains several classes used throughout the app
 *
 * These are grouped together because they are intended to be reused and expanded
 * where necessary
 *
 * TODO: Eslint will complain about the classes not being used and i should do something about it
 * ? Maybe make eslint read all files as one
 */

/**
 * Represents a matrix with 0,0 as the center, allows negative values, must be pre defined
 */
class CenteredMatrix {
  /**
   * Constructs a new CenteredMatrix instance.
   * @param {number} width - The width of the matrix.
   * @param {number} height - The height of the matrix.
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.matrix = this.createMatrix(width, height);
  }

  /**
   * Creates a new matrix with the specified width and height.
   * @private
   * @param {number} width - The width of the matrix.
   * @param {number} height - The height of the matrix.
   * @return {Array<Array<any>>} - The created matrix.
   */
  createMatrix(width, height) {
    const matrix = [];
    const startX = -Math.floor(width / 2);
    const startY = -Math.floor(height / 2);
    const endX = Math.ceil(width / 2);
    const endY = Math.ceil(height / 2);

    for (let x = startX; x <= endX; x++) {
      const column = [];
      for (let y = startY; y <= endY; y++) {
        column.push(null);
      }
      matrix.push(column);
    }

    return matrix;
  }

  /**
   * Retrieves the value at the specified coordinates.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @return {any} - The value at the given coordinates.
   */
  get(x, y) {
    const adjustedX = x + Math.floor(this.width / 2);
    const adjustedY = y + Math.floor(this.height / 2);
    return this.matrix[adjustedX][adjustedY];
  }

  /**
   * Sets the value at the specified coordinates.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {any} value - The value to be set.
   */
  set(x, y, value) {
    const adjustedX = x + Math.floor(this.width / 2);
    const adjustedY = y + Math.floor(this.height / 2);
    this.matrix[adjustedX][adjustedY] = value;
  }
}

/**
 * Event registry
 * to handle event distribution
 */
class EventRegistry {
  /**
   * Sets up subscribers array
   */
  constructor() {
    this.subscribers = {};
  }
  // Could add a publisher registry

  /**
   * Subscribe to an event
   *
   * @param {string} event - Name of the event.
   * @param {Function} callback - Callback for when the event is published
   * @return {void}
   */
  subscribe(event, callback) {
    // Checks if there are subscribers to the specific event
    if (!this.subscribers[event]) {
      // If not make an array to store the subscribers
      this.subscribers[event] = [];
    }

    // Add the callback function to the subscribers array for the event
    this.subscribers[event].push(callback);
  }

  /**
   * Method to publish an event
   * @param {string} event - Name of event
   * @param {any} data - what to publish
   */
  publish(event, data) {
    // Check for subscribers
    if (this.subscribers[event]) {
      // Iterate over subscribers and run their callbacks
      this.subscribers[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}
