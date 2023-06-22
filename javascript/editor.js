editor = {
  /**
   * Enables and disables editor
   * @param {boolean} enable
   */
  enable: false,

  //* using imaginary mouse input wizardry, this is just groundwork to then make the mouse interface later

  /**
   * Object filled with the methods to draw stuff using the MOUSE
   */
  make: {
    // just a dot, a single cell
    dot: function () {
      field.setCellContent(CHOOSE_CHAR, point, false);
    },

    // goes from A to B
    line: function () {
      point1 = MOUSE_GRAB_SELECTED_CELL(); // todo: make this function
      point2 = MOUSE_GRAB_SELECTED_CELL();
      draw.line(CHOOSE_CHAR, point1, point2);
    },

    // its the one that is filled
    square: function () {
      point1 = MOUSE_GRAB_SELECTED_CELL(); // todo: make this function
      point2 = MOUSE_GRAB_SELECTED_CELL();
      draw.square(CHOOSE_CHAR, point1, point2);
    },

    // this one is empty inside
    box: function () {
      point1 = MOUSE_GRAB_SELECTED_CELL(); // todo: make this function
      point2 = MOUSE_GRAB_SELECTED_CELL();
      draw.box(CHOOSE_CHAR, point1, point2);
    },
  },

  MOUSE_GRAB_SELECTED_CELL: function () {},
};
