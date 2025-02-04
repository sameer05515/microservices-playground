// src/selectors/colorSelectors.js

// Base selector for colors
export const selectColors = (state) => state.colors.data;

// Parameterized selector for fetching a color code by name
const selectColorCode = (state, colorName) => {
  const color = selectColors(state).find((color) => color.name.toLowerCase() === colorName.toLowerCase());
  return color ? color.code : null;
};

// Factory to create a reusable constant selector for a specific color name
export const getCodeForName = (colorName) => (state) => selectColorCode(state, colorName);
