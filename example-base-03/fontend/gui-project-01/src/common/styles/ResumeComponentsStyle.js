import { COLORS } from '../utilities/constants';

export const generateStyle = (backgroundColor='White') => ({
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "10px", // Adding round borders
    backgroundColor: backgroundColor, // Set the background color dynamically
    marginBottom: "5px", // Adding vertical spacing of 5px
});

export const resumeItemStyle = generateStyle(COLORS.PALE_GREEN);
export const companyWidgetStyle = generateStyle(COLORS.ANTIQUE_WHITE);
export const companyItemStyle = generateStyle(COLORS.CYAN);
export const projectWidgetStyle = generateStyle(COLORS.DARK_ORANGE);
export const projectItemStyle = generateStyle(COLORS.HOT_PINK);
export const educationWidgetStyle = generateStyle(COLORS.ANTIQUE_WHITE);
export const educationItemStyle = generateStyle(COLORS.CYAN);