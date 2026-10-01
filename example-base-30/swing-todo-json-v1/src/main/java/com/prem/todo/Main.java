package com.prem.todo;

import com.prem.todo.repository.TodoRepository;
import com.prem.todo.service.TodoService;
import com.prem.todo.ui.TodoFrame;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            TodoRepository repository = new TodoRepository();
            TodoService service = new TodoService(repository);
            TodoFrame frame = new TodoFrame(service);
            frame.setVisible(true);
        });
    }
}
