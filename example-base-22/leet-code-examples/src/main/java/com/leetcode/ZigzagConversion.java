package com.leetcode;

import java.util.ArrayList;
import java.util.List;

/**
 * LeetCode Problem: Zigzag Conversion
 * 
 * The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows.
 * Write the code that will take a string and make this conversion given a number of rows.
 * 
 * Time Complexity: O(n) where n is the length of the string
 * Space Complexity: O(n) for storing the result
 * 
 * Solution: Uses array of StringBuilder to simulate the zigzag pattern row by row
 */
public class ZigzagConversion {
    
    /**
     * Converts a string to zigzag pattern and returns it read line by line.
     * 
     * @param s Input string
     * @param numRows Number of rows in the zigzag pattern
     * @return Converted string read line by line
     */
    public static String convert(String s, int numRows) {
        // Edge case: if only one row, return original string
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }
        
        // Create a list of StringBuilder, one for each row
        List<StringBuilder> rows = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            rows.add(new StringBuilder());
        }
        
        int currentRow = 0;
        boolean goingDown = false;
        
        // Iterate through each character in the string
        for (char c : s.toCharArray()) {
            // Add character to current row
            rows.get(currentRow).append(c);
            
            // Change direction when we reach top or bottom
            if (currentRow == 0 || currentRow == numRows - 1) {
                goingDown = !goingDown;
            }
            
            // Move to next row based on direction
            currentRow += goingDown ? 1 : -1;
        }
        
        // Combine all rows
        StringBuilder result = new StringBuilder();
        for (StringBuilder row : rows) {
            result.append(row);
        }
        
        return result.toString();
    }
    
    /**
     * Alternative implementation using 2D array simulation.
     * Less efficient but more intuitive for understanding the pattern.
     * 
     * @param s Input string
     * @param numRows Number of rows in the zigzag pattern
     * @return Converted string read line by line
     */
    public static String convertAlternative(String s, int numRows) {
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }
        
        // Calculate number of columns needed
        int numCols = s.length();
        char[][] grid = new char[numRows][numCols];
        
        int row = 0;
        int col = 0;
        boolean goingDown = true;
        
        for (int i = 0; i < s.length(); i++) {
            grid[row][col] = s.charAt(i);
            
            if (goingDown) {
                if (row == numRows - 1) {
                    goingDown = false;
                    row--;
                    col++;
                } else {
                    row++;
                }
            } else {
                if (row == 0) {
                    goingDown = true;
                    row++;
                } else {
                    row--;
                    col++;
                }
            }
        }
        
        // Read line by line
        StringBuilder result = new StringBuilder();
        for (int r = 0; r < numRows; r++) {
            for (int c = 0; c < numCols; c++) {
                if (grid[r][c] != '\0') {
                    result.append(grid[r][c]);
                }
            }
        }
        
        return result.toString();
    }
    
    /**
     * Helper method to visualize the zigzag pattern (for debugging/understanding)
     * 
     * @param s Input string
     * @param numRows Number of rows
     * @return String representation of the zigzag pattern
     */
    public static String visualizeZigzag(String s, int numRows) {
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }
        
        // Calculate approximate number of columns
        int numCols = s.length();
        char[][] grid = new char[numRows][numCols];
        
        int row = 0;
        int col = 0;
        boolean goingDown = true;
        
        for (int i = 0; i < s.length(); i++) {
            grid[row][col] = s.charAt(i);
            
            if (goingDown) {
                if (row == numRows - 1) {
                    goingDown = false;
                    row--;
                    col++;
                } else {
                    row++;
                }
            } else {
                if (row == 0) {
                    goingDown = true;
                    row++;
                } else {
                    row--;
                    col++;
                }
            }
        }
        
        // Build visualization string
        StringBuilder visualization = new StringBuilder();
        for (int r = 0; r < numRows; r++) {
            for (int c = 0; c < numCols; c++) {
                if (grid[r][c] != '\0') {
                    visualization.append(grid[r][c]);
                } else {
                    visualization.append(' ');
                }
            }
            visualization.append('\n');
        }
        
        return visualization.toString();
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        String s1 = "PAYPALISHIRING";
        int numRows1 = 3;
        String result1 = convert(s1, numRows1);
        
        System.out.println("Example 1:");
        System.out.println("Input: s = \"" + s1 + "\", numRows = " + numRows1);
        System.out.println("Output: \"" + result1 + "\"");
        System.out.println("Zigzag Pattern:");
        System.out.println(visualizeZigzag(s1, numRows1));
        System.out.println();
        
        // Test Case 2: Example 2
        String s2 = "PAYPALISHIRING";
        int numRows2 = 4;
        String result2 = convert(s2, numRows2);
        
        System.out.println("Example 2:");
        System.out.println("Input: s = \"" + s2 + "\", numRows = " + numRows2);
        System.out.println("Output: \"" + result2 + "\"");
        System.out.println("Zigzag Pattern:");
        System.out.println(visualizeZigzag(s2, numRows2));
        System.out.println();
        
        // Test Case 3: Example 3
        String s3 = "A";
        int numRows3 = 1;
        String result3 = convert(s3, numRows3);
        
        System.out.println("Example 3:");
        System.out.println("Input: s = \"" + s3 + "\", numRows = " + numRows3);
        System.out.println("Output: \"" + result3 + "\"");
        System.out.println();
        
        // Additional test case: Two rows
        String s4 = "ABCD";
        int numRows4 = 2;
        String result4 = convert(s4, numRows4);
        
        System.out.println("Two rows:");
        System.out.println("Input: s = \"" + s4 + "\", numRows = " + numRows4);
        System.out.println("Output: \"" + result4 + "\"");
        System.out.println("Zigzag Pattern:");
        System.out.println(visualizeZigzag(s4, numRows4));
        System.out.println();
        
        // Additional test case: More rows than string length
        String s5 = "ABC";
        int numRows5 = 5;
        String result5 = convert(s5, numRows5);
        
        System.out.println("More rows than string length:");
        System.out.println("Input: s = \"" + s5 + "\", numRows = " + numRows5);
        System.out.println("Output: \"" + result5 + "\"");
        System.out.println();
        
        // Additional test case: Short string
        String s6 = "AB";
        int numRows6 = 1;
        String result6 = convert(s6, numRows6);
        
        System.out.println("Short string:");
        System.out.println("Input: s = \"" + s6 + "\", numRows = " + numRows6);
        System.out.println("Output: \"" + result6 + "\"");
    }
}
