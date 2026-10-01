package com.prem.todo.swing;

import javax.swing.SwingUtilities;

public class Main {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TodoFrame().setVisible(true));
    }
}
