package com.example.swing;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Swing application to calculate the sum of two integers
 */
public class SumCalculator extends JFrame {
    private JTextField firstNumberField;
    private JTextField secondNumberField;
    private JTextField resultField;
    private JButton calculateButton;

    public SumCalculator() {
        initializeGUI();
    }

    private void initializeGUI() {
        setTitle("Sum Calculator");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        setResizable(false);

        // Create main panel with padding
        JPanel mainPanel = new JPanel(new GridBagLayout());
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        // First number label and field
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.EAST;
        mainPanel.add(new JLabel("First Number:"), gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        firstNumberField = new JTextField(15);
        mainPanel.add(firstNumberField, gbc);

        // Second number label and field
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.NONE;
        gbc.weightx = 0;
        gbc.anchor = GridBagConstraints.EAST;
        mainPanel.add(new JLabel("Second Number:"), gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        secondNumberField = new JTextField(15);
        mainPanel.add(secondNumberField, gbc);

        // Calculate button
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(15, 5, 5, 5);
        calculateButton = new JButton("Calculate Sum");
        calculateButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 14));
        calculateButton.addActionListener(new CalculateButtonListener());
        mainPanel.add(calculateButton, gbc);

        // Result label and field
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        gbc.weightx = 0;
        gbc.anchor = GridBagConstraints.EAST;
        gbc.insets = new Insets(15, 5, 5, 5);
        mainPanel.add(new JLabel("Result:"), gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        resultField = new JTextField(15);
        resultField.setEditable(false);
        resultField.setBackground(Color.WHITE);
        mainPanel.add(resultField, gbc);

        add(mainPanel, BorderLayout.CENTER);

        // Pack and center the window
        pack();
        setLocationRelativeTo(null);
    }

    private class CalculateButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            try {
                // Get input values
                String firstText = firstNumberField.getText().trim();
                String secondText = secondNumberField.getText().trim();

                // Validate inputs
                if (firstText.isEmpty() || secondText.isEmpty()) {
                    JOptionPane.showMessageDialog(
                        SumCalculator.this,
                        "Please enter both numbers.",
                        "Input Error",
                        JOptionPane.WARNING_MESSAGE
                    );
                    return;
                }

                // Parse integers
                int firstNumber = Integer.parseInt(firstText);
                int secondNumber = Integer.parseInt(secondText);

                // Calculate sum
                int sum = firstNumber + secondNumber;

                // Display result
                resultField.setText(String.valueOf(sum));

            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(
                    SumCalculator.this,
                    "Please enter valid integers.",
                    "Invalid Input",
                    JOptionPane.ERROR_MESSAGE
                );
                resultField.setText("");
            }
        }
    }

    public static void main(String[] args) {
        // Set look and feel to system default
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Create and show the GUI
        SwingUtilities.invokeLater(() -> {
            new SumCalculator().setVisible(true);
        });
    }
}

