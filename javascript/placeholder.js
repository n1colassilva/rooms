/**
 * Represents a centered matrix with customizable dimensions.
 * The matrix is centered at (0, 0), and the size provided is divided by 2 (rounded up) to determine the number of elements in each direction.
 */
class CenteredMatrix {
  /**
   * Creates a new instance of the centered matrix.
   * @param {number} width - Width of the matrix.
   * @param {number} height - Height of the matrix.
   */
  constructor(width, height) {
    this.width = Math.ceil(width / 2) * 2;

    this.height = Math.ceil(height / 2) * 2;

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
