/* eslint-disable no-unused-vars */
/**
 * Specific class for Popup Fields, mostly menus outside of the main game field
 */
class PopupField {
  /**
   * @param {number} sizeX - Width of field
   * @param {number} sizeY - Height of field
   * @param {HTMLid} fieldName - id of field
   */
  constructor(sizeX, sizeY, fieldName) {
    this.popupfield = new Field(sizeX, sizeY, fieldName);
  }

  /**
   * Starts up the popup field
   *
   * activated manually to avoid unintended behaviour.
   * @return {Field} Returns field element in case you want it for some reason.
   */
  startField() {
    return this.popupfield.startField();
  }

  /**
   *
   * @param {string} fileName - Name of JSON file to be loaded
   */
  loadFieldFile(fileName) {
    saveManager.load(this.popupfield, fileName);
  }

  /**
   * Saves field data into json file and downloads it
   * * The save function from the save manager already has it's own native prompt for a file name
   */
  saveFieldFile() {
    saveManager.save(this.popupfield);
  }
}
