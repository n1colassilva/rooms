editor = {
  /**
   * Enables and disables editor
   * @param {boolean} enable
   */
  enable: false,

  /**
   * Object filled with the methods to draw stuff using the MOUSE
   */
  make: {
    // just a dot, a single cell
    dot: function () {
      field.setCellContent(listenForChar(), point, false);
    },

    // goes from A to B
    line: function () {
      point1 = listenForCellClick(); // todo: make this function
      point2 = listenForCellClick();
      draw.line(listenForChar(), point1, point2);
    },

    // its the one that is filled
    square: function () {
      point1 = listenForCellClick();
      point2 = listenForCellClick();
      draw.square(listenForChar(), point1, point2);
    },

    // this one is empty inside
    box: function () {
      point1 = listenForCellClick();
      point2 = listenForCellClick();
      draw.box(listenForChar(), point1, point2);
    },
  },

  listenForCellClick: function () {
    /*
      god help me for these promises i do not know
     */
    
  },
  listenForChar: function () {},
};
