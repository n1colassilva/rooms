// =======================start of control interface i guess?=========================
// Center game field when clicked
// Add a click event listener to the game field
// ! grab clicks from the field's own click registry
/**
 * Center the game field when clicked.
 */
function centerGameFieldOnClick() {
  const fieldWrappers = document.querySelectorAll(".field-wrapper");

  fieldWrappers.forEach((fieldWrapper) => {
    fieldWrapper.addEventListener("click", () => {
      const fieldWrapperHeight = fieldWrapper.offsetHeight;
      const screenHeight = window.innerHeight;
      const currentScrollTop =
        window.scrollY || document.documentElement.scrollTop;

      // Calculate the target scroll position
      const targetScrollTop =
        currentScrollTop +
        fieldWrapper.getBoundingClientRect().top -
        (screenHeight - fieldWrapperHeight) / 2;

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
  });
}

centerGameFieldOnClick();

const fieldClickHandler = {
  // TBD
};
