package com.p.parctice.product;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        // Combine strings
        String s1 = "Premendra", s2 = "Kumar";
        String combined = String.join(" ", s1, s2);
        System.out.println(combined);

        // Input array of characters
        String[] chars = new String[]{"1", "2", "3", "-1", "-2", "$", "&", "-3", "-2", "-1", "3", "4", "5", "8"};

        // Filter and parse numeric values
        List<Integer> integers = Arrays.stream(chars)
                .filter(Main::isNumeric)
                .map(Integer::parseInt)
                .collect(Collectors.toList());
        System.out.println("Filtered Integers: " + integers);

        // Extract consecutive series
        List<List<Integer>> consecutiveSeries = extractConsecutiveSeries(integers);
        System.out.println("Consecutive Series: " + consecutiveSeries);
    }

    /**
     * Method to validate if a string is numeric
     */
    private static boolean isNumeric(String s) {
        try {
            Integer.parseInt(s);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Method to extract consecutive series from a list of integers
     */
    private static List<List<Integer>> extractConsecutiveSeries(List<Integer> integers) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> currentSeries = new ArrayList<>();

        for (int i = 0; i < integers.size(); i++) {
            // Add the current number to the series
            if (currentSeries.isEmpty() || Math.abs(integers.get(i) - currentSeries.get(currentSeries.size() - 1)) == 1) {
                currentSeries.add(integers.get(i));
            } else {
                // Add completed series to the result and start a new one
                result.add(new ArrayList<>(currentSeries));
                currentSeries.clear();
                currentSeries.add(integers.get(i));
            }
        }

        // Add the last series to the result
        if (!currentSeries.isEmpty()) {
            result.add(currentSeries);
        }

        return result;
    }
}
