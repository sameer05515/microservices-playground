package com.example.swing;

import javazoom.jl.decoder.JavaLayerException;
import javazoom.jl.player.Player;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Swing MP3 Player Application
 */
public class MP3PlayerApp extends JFrame {
    private JButton openButton;
    private JButton playButton;
    private JButton pauseButton;
    private JButton stopButton;
    private JLabel currentFileLabel;
    private JLabel timeLabel;
    private JProgressBar progressBar;
    private JSlider volumeSlider;
    private JLabel volumeLabel;
    
    private File currentFile;
    private Player player;
    private Thread playbackThread;
    private boolean isPlaying = false;
    private boolean isPaused = false;
    private long pausePosition = 0;
    private long totalLength = 0;
    private Timer progressTimer;
    
    private static final String DEFAULT_TIME = "00:00 / 00:00";

    public MP3PlayerApp() {
        initializeGUI();
    }

    private void initializeGUI() {
        setTitle("MP3 Player");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        setResizable(false);

        // Create main panel
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Top panel - File selection and current file display
        JPanel topPanel = createTopPanel();
        mainPanel.add(topPanel, BorderLayout.NORTH);

        // Center panel - Progress bar and time
        JPanel centerPanel = createCenterPanel();
        mainPanel.add(centerPanel, BorderLayout.CENTER);

        // Bottom panel - Control buttons and volume
        JPanel bottomPanel = createBottomPanel();
        mainPanel.add(bottomPanel, BorderLayout.SOUTH);

        add(mainPanel, BorderLayout.CENTER);

        pack();
        setLocationRelativeTo(null);
        setSize(500, 250);
    }

    private JPanel createTopPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        
        // Open file button
        openButton = new JButton("Open MP3 File");
        openButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        openButton.addActionListener(new OpenFileListener());
        panel.add(openButton, BorderLayout.WEST);

        // Current file label
        currentFileLabel = new JLabel("No file selected");
        currentFileLabel.setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));
        panel.add(currentFileLabel, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createCenterPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createTitledBorder("Progress"));

        // Progress bar
        progressBar = new JProgressBar(0, 100);
        progressBar.setStringPainted(false);
        progressBar.setPreferredSize(new Dimension(0, 25));
        panel.add(progressBar, BorderLayout.CENTER);

        // Time label
        timeLabel = new JLabel(DEFAULT_TIME);
        timeLabel.setHorizontalAlignment(SwingConstants.CENTER);
        timeLabel.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        panel.add(timeLabel, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createBottomPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));

        // Control buttons panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        
        playButton = new JButton("▶ Play");
        playButton.setEnabled(false);
        playButton.addActionListener(new PlayButtonListener());
        buttonPanel.add(playButton);

        pauseButton = new JButton("⏸ Pause");
        pauseButton.setEnabled(false);
        pauseButton.addActionListener(new PauseButtonListener());
        buttonPanel.add(pauseButton);

        stopButton = new JButton("⏹ Stop");
        stopButton.setEnabled(false);
        stopButton.addActionListener(new StopButtonListener());
        buttonPanel.add(stopButton);

        panel.add(buttonPanel, BorderLayout.CENTER);

        // Volume control panel
        JPanel volumePanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 5));
        volumeLabel = new JLabel("Volume:");
        volumePanel.add(volumeLabel);
        
        volumeSlider = new JSlider(0, 100, 50);
        volumeSlider.setPreferredSize(new Dimension(100, 30));
        volumeSlider.setMajorTickSpacing(50);
        volumeSlider.setPaintTicks(true);
        volumeSlider.setPaintLabels(true);
        volumePanel.add(volumeSlider);
        
        panel.add(volumePanel, BorderLayout.SOUTH);

        return panel;
    }

    private void openFile() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("MP3 Files", "mp3"));
        fileChooser.setDialogTitle("Select MP3 File");

        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            currentFile = fileChooser.getSelectedFile();
            currentFileLabel.setText("File: " + currentFile.getName());
            playButton.setEnabled(true);
            stopCurrentPlayback();
        }
    }

    private void playFile() {
        if (currentFile == null || !currentFile.exists()) {
            JOptionPane.showMessageDialog(this,
                    "Please select a valid MP3 file first.",
                    "No File Selected",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (isPaused && player != null) {
            // Resume playback (JLayer doesn't support pause/resume natively)
            // So we'll restart from the beginning
            stopCurrentPlayback();
        }

        try {
            FileInputStream fileInputStream = new FileInputStream(currentFile);
            BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
            totalLength = currentFile.length();
            
            player = new Player(bufferedInputStream);
            isPlaying = true;
            isPaused = false;
            
            updateButtonStates();

            // Start playback in a separate thread
            playbackThread = new Thread(() -> {
                try {
                    startProgressTimer();
                    player.play();
                } catch (JavaLayerException e) {
                    SwingUtilities.invokeLater(() -> {
                        JOptionPane.showMessageDialog(MP3PlayerApp.this,
                                "Error playing file: " + e.getMessage(),
                                "Playback Error",
                                JOptionPane.ERROR_MESSAGE);
                        stopCurrentPlayback();
                    });
                }
            });
            playbackThread.start();

        } catch (FileNotFoundException | JavaLayerException e) {
            JOptionPane.showMessageDialog(this,
                    "Error opening file: " + e.getMessage(),
                    "File Error",
                    JOptionPane.ERROR_MESSAGE);
            stopCurrentPlayback();
        }
    }

    private void pausePlayback() {
        if (isPlaying && player != null) {
            isPaused = true;
            isPlaying = false;
            stopProgressTimer();
            
            // JLayer doesn't support pause, so we close the player
            if (player != null) {
                player.close();
            }
            
            updateButtonStates();
        }
    }

    private void stopCurrentPlayback() {
        isPlaying = false;
        isPaused = false;
        pausePosition = 0;
        stopProgressTimer();
        
        if (player != null) {
            player.close();
            player = null;
        }
        
        if (playbackThread != null && playbackThread.isAlive()) {
            playbackThread.interrupt();
        }
        
        progressBar.setValue(0);
        timeLabel.setText(DEFAULT_TIME);
        updateButtonStates();
    }

    private void startProgressTimer() {
        stopProgressTimer();
        progressTimer = new Timer();
        progressTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                if (isPlaying && player != null) {
                    // JLayer doesn't provide position info, so we simulate progress
                    SwingUtilities.invokeLater(() -> {
                        int currentValue = progressBar.getValue();
                        if (currentValue < 100) {
                            progressBar.setValue(currentValue + 1);
                            updateTimeDisplay();
                        } else {
                            stopCurrentPlayback();
                        }
                    });
                }
            }
        }, 0, 100); // Update every 100ms
    }

    private void stopProgressTimer() {
        if (progressTimer != null) {
            progressTimer.cancel();
            progressTimer = null;
        }
    }

    private void updateTimeDisplay() {
        int progress = progressBar.getValue();
        // Estimate time based on progress (this is approximate since JLayer doesn't provide position)
        int totalSeconds = (int) (totalLength / 1000); // Rough estimate
        int currentSeconds = (int) (totalSeconds * progress / 100.0);
        
        String currentTime = formatTime(currentSeconds);
        String totalTime = formatTime(totalSeconds);
        timeLabel.setText(currentTime + " / " + totalTime);
    }

    private String formatTime(int seconds) {
        int minutes = seconds / 60;
        int secs = seconds % 60;
        return String.format("%02d:%02d", minutes, secs);
    }

    private void updateButtonStates() {
        playButton.setEnabled(currentFile != null && !isPlaying);
        pauseButton.setEnabled(isPlaying);
        stopButton.setEnabled(isPlaying || isPaused);
    }

    private class OpenFileListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            openFile();
        }
    }

    private class PlayButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            playFile();
        }
    }

    private class PauseButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            pausePlayback();
        }
    }

    private class StopButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            stopCurrentPlayback();
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
            new MP3PlayerApp().setVisible(true);
        });
    }
}

