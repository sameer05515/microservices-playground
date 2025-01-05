// src/reducers/colorReducer.js
const initialState = {
  data: [
    { name: "red", code: "#FF0000" },
    { name: "green", code: "#00FF00" },
    { name: "blue", code: "#0000FF" },
    { name: "yellow", code: "#FFFF00" },
    { name: "black", code: "#000000" },
    { name: "white", code: "#FFFFFF" },
  ],
};

const colorReducer = (state = initialState, action) => {
  switch (action.type) {
    // No dynamic actions for this reducer as it's static data
    default:
      return state;
  }
};

export default colorReducer;
