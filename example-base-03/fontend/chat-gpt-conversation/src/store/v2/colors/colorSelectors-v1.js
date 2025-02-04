// src/selectors/colorSelectors.js

export const selectColors = (state) => state.colors.data;

export const selectColorCode = (state, colorName) => {
  const color = state.colors.data.find((color) => color.name.toLowerCase() === colorName.toLowerCase());
  return color ? color.code : null;
};
