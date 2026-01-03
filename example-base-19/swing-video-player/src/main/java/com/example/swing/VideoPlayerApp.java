package com.example.swing;

import javafx.application.Platform;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.media.MediaView;
import javafx.util.Duration;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

/**
 * Swing Video Player Application using JavaFX MediaPlayer
 */
public class VideoPlayerApp extends JFrame {
    private JButton openButton;
    private JButton playButton;
    private JButton pauseButton;
    private JButton stopButton;
    private JLabel currentFileLabel;
    private JLabel timeLabel;
    private JProgressBar progressBar;
    private JSlider volumeSlider;
    private JLabel volumeLabel;
    private JFXPanel jfxPanel;
    
    private File currentFile;
    private MediaPlayer mediaPlayer;
    private Media media;
    private boolean isPlaying = false;
    private Timer progressTimer;

    private static final String DEFAULT_TIME = "00:00 / 00:00";

    public VideoPlayerApp() {
        // Initialize JavaFX
        Platform.setImplicitExit(false);
        initializeGUI();
    }

    private void initializeGUI() {
        setTitle("Video Player");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // Create main panel
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Top panel - File selection and current file display
        JPanel topPanel = createTopPanel();
        mainPanel.add(topPanel, BorderLayout.NORTH);

        // Center panel - Video display
        JPanel centerPanel = createCenterPanel();
        mainPanel.add(centerPanel, BorderLayout.CENTER);

        // Bottom panel - Controls, progress, and volume
        JPanel bottomPanel = createBottomPanel();
        mainPanel.add(bottomPanel, BorderLayout.SOUTH);

        add(mainPanel, BorderLayout.CENTER);

        pack();
        setLocationRelativeTo(null);
        setSize(800, 600);
        setMinimumSize(new Dimension(640, 480));
    }

    private JPanel createTopPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        
        // Open file button
        openButton = new JButton("Open Video File");
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
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Video Display"));
        panel.setPreferredSize(new Dimension(800, 450));
        panel.setBackground(Color.BLACK);

        // JavaFX panel for video
        jfxPanel = new JFXPanel();
        jfxPanel.setPreferredSize(new Dimension(800, 450));
        panel.add(jfxPanel, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createBottomPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));

        // Progress and time panel
        JPanel progressPanel = new JPanel(new BorderLayout(5, 5));
        
        // Progress bar
        progressBar = new JProgressBar(0, 100);
        progressBar.setStringPainted(false);
        progressBar.setPreferredSize(new Dimension(0, 20));
        progressBar.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                if (mediaPlayer != null && mediaPlayer.getMedia() != null) {
                    int x = e.getX();
                    double percent = (double) x / progressBar.getWidth();
                    Duration seekTime = mediaPlayer.getTotalDuration().multiply(percent);
                    mediaPlayer.seek(seekTime);
                }
            }
        });
        progressPanel.add(progressBar, BorderLayout.CENTER);

        // Time label
        timeLabel = new JLabel(DEFAULT_TIME);
        timeLabel.setHorizontalAlignment(SwingConstants.CENTER);
        timeLabel.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        progressPanel.add(timeLabel, BorderLayout.SOUTH);

        panel.add(progressPanel, BorderLayout.CENTER);

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

        panel.add(buttonPanel, BorderLayout.NORTH);

        // Volume control panel
        JPanel volumePanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 5));
        volumeLabel = new JLabel("Volume:");
        volumePanel.add(volumeLabel);
        
        volumeSlider = new JSlider(0, 100, 50);
        volumeSlider.setPreferredSize(new Dimension(150, 30));
        volumeSlider.setMajorTickSpacing(50);
        volumeSlider.setPaintTicks(true);
        volumeSlider.setPaintLabels(true);
        volumeSlider.addChangeListener(e -> {
            if (mediaPlayer != null) {
                double volume = volumeSlider.getValue() / 100.0;
                mediaPlayer.setVolume(volume);
            }
        });
        volumePanel.add(volumeSlider);
        
        panel.add(volumePanel, BorderLayout.SOUTH);

        return panel;
    }

    private void openFile() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter(
            "Video Files", "mp4", "avi", "mov", "mkv", "wmv", "flv", "webm", "m4v"));
        fileChooser.setDialogTitle("Select Video File");

        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            currentFile = fileChooser.getSelectedFile();
            currentFileLabel.setText("File: " + currentFile.getName());
            loadVideo(currentFile);
        }
    }

    private void loadVideo(File file) {
        stopCurrentPlayback();
        
        Platform.runLater(() -> {
            try {
                String mediaUrl = file.toURI().toString();
                media = new Media(mediaUrl);
                mediaPlayer = new MediaPlayer(media);
                
                MediaView mediaView = new MediaView(mediaPlayer);
                Scene scene = new Scene(new javafx.scene.Group(mediaView), 800, 450);
                jfxPanel.setScene(scene);

                // Set up media player event handlers
                mediaPlayer.setOnReady(() -> {
                    SwingUtilities.invokeLater(() -> {
                        updateButtonStates();
                        startProgressTimer();
                    });
                });

                mediaPlayer.setOnEndOfMedia(() -> {
                    SwingUtilities.invokeLater(() -> {
                        stopCurrentPlayback();
                    });
                });

                mediaPlayer.setOnError(() -> {
                    SwingUtilities.invokeLater(() -> {
                        String errorMessage = "Unknown error";
                        if (mediaPlayer.getError() != null) {
                            errorMessage = mediaPlayer.getError().getMessage();
                        }
                        
                        // Check for native library issues
                        if (errorMessage.contains("glib") || errorMessage.contains("UnsatisfiedLinkError")) {
                            errorMessage = "JavaFX native libraries not found. " +
                                    "Please ensure JavaFX SDK native libraries are in your library path. " +
                                    "See README for setup instructions.\n\nOriginal error: " + errorMessage;
                        }
                        
                        JOptionPane.showMessageDialog(VideoPlayerApp.this,
                                "Error playing video: " + errorMessage,
                                "Playback Error",
                                JOptionPane.ERROR_MESSAGE);
                        stopCurrentPlayback();
                    });
                });

                // Set initial volume
                double volume = volumeSlider.getValue() / 100.0;
                mediaPlayer.setVolume(volume);

            } catch (UnsatisfiedLinkError e) {
                SwingUtilities.invokeLater(() -> {
                    String errorMsg = "JavaFX native libraries not found.\n\n" +
                            "This usually means JavaFX native libraries (glib-lite, etc.) are missing.\n\n" +
                            "Solutions:\n" +
                            "1. Download JavaFX SDK from https://openjfx.io/\n" +
                            "2. Add JavaFX native libraries to your library path\n" +
                            "3. Or use JavaFX runtime that includes native libraries\n\n" +
                            "See README.md for detailed setup instructions.\n\n" +
                            "Original error: " + e.getMessage();
                    JOptionPane.showMessageDialog(VideoPlayerApp.this,
                            errorMsg,
                            "JavaFX Native Library Error",
                            JOptionPane.ERROR_MESSAGE);
                });
            } catch (Exception e) {
                SwingUtilities.invokeLater(() -> {
                    String errorMsg = "Error loading video: " + e.getMessage();
                    if (e.getCause() != null) {
                        errorMsg += "\n\nCause: " + e.getCause().getMessage();
                    }
                    JOptionPane.showMessageDialog(VideoPlayerApp.this,
                            errorMsg,
                            "File Error",
                            JOptionPane.ERROR_MESSAGE);
                });
            }
        });
    }

    private void playVideo() {
        if (mediaPlayer == null) {
            JOptionPane.showMessageDialog(this,
                    "Please select a video file first.",
                    "No File Selected",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        Platform.runLater(() -> {
            mediaPlayer.play();
            isPlaying = true;
            updateButtonStates();
            startProgressTimer();
        });
    }

    private void pauseVideo() {
        if (mediaPlayer != null && isPlaying) {
            Platform.runLater(() -> {
                mediaPlayer.pause();
                isPlaying = false;
                updateButtonStates();
                stopProgressTimer();
            });
        }
    }

    private void stopCurrentPlayback() {
        isPlaying = false;
        stopProgressTimer();
        
        if (mediaPlayer != null) {
            Platform.runLater(() -> {
                mediaPlayer.stop();
            });
        }
        
        progressBar.setValue(0);
        timeLabel.setText(DEFAULT_TIME);
        updateButtonStates();
    }

    private void startProgressTimer() {
        stopProgressTimer();
        progressTimer = new Timer(100, e -> {
            if (mediaPlayer != null && isPlaying) {
                Platform.runLater(() -> {
                    Duration currentTime = mediaPlayer.getCurrentTime();
                    Duration totalDuration = mediaPlayer.getTotalDuration();
                    
                    if (totalDuration != null && !totalDuration.isUnknown()) {
                        double progress = currentTime.toMillis() / totalDuration.toMillis();
                        progressBar.setValue((int) (progress * 100));
                        
                        String currentTimeStr = formatTime((int) currentTime.toSeconds());
                        String totalTimeStr = formatTime((int) totalDuration.toSeconds());
                        timeLabel.setText(currentTimeStr + " / " + totalTimeStr);
                    }
                });
            }
        });
        progressTimer.start();
    }

    private void stopProgressTimer() {
        if (progressTimer != null) {
            progressTimer.stop();
            progressTimer = null;
        }
    }

    private String formatTime(int seconds) {
        int hours = seconds / 3600;
        int minutes = (seconds % 3600) / 60;
        int secs = seconds % 60;
        
        if (hours > 0) {
            return String.format("%d:%02d:%02d", hours, minutes, secs);
        } else {
            return String.format("%02d:%02d", minutes, secs);
        }
    }

    private void updateButtonStates() {
        playButton.setEnabled(mediaPlayer != null && !isPlaying);
        pauseButton.setEnabled(mediaPlayer != null && isPlaying);
        stopButton.setEnabled(mediaPlayer != null && (isPlaying || mediaPlayer.getCurrentTime().toMillis() > 0));
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
            playVideo();
        }
    }

    private class PauseButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            pauseVideo();
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
            new VideoPlayerApp().setVisible(true);
        });
    }
}

