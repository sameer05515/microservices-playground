# Swing MP3 Player

A Maven-based Java Swing application for playing MP3 audio files.

## Features

- ✅ **File Selection** - Open and select MP3 files
- ✅ **Playback Controls** - Play, Pause, and Stop functionality
- ✅ **Progress Display** - Visual progress bar and time display
- ✅ **Volume Control** - Adjustable volume slider
- ✅ **Clean GUI** - User-friendly interface
- ✅ **File Information** - Display current playing file name

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use Maven wrapper)
- MP3 audio files for testing

## Project Structure

```
swing-mp3-player/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── swing/
                        └── MP3PlayerApp.java
```

## Building the Project

```bash
cd example-base-19/swing-mp3-player
mvn clean compile
```

## Running the Application

### Option 1: Using Maven Exec Plugin

```bash
cd example-base-19/swing-mp3-player
mvn exec:java
```

### Option 2: Build JAR and Run

```bash
# Build the JAR
mvn clean package

# Run the JAR
java -jar target/swing-mp3-player-1.0.0.jar
```

### Option 3: Run from IDE

Run the `MP3PlayerApp` class directly from your IDE (main method is in `src/main/java/com/example/swing/MP3PlayerApp.java`).

## Usage

1. **Open MP3 File**: Click the "Open MP3 File" button to select an MP3 file from your computer
2. **Play**: Click the "▶ Play" button to start playback
3. **Pause**: Click the "⏸ Pause" button to pause playback (note: JLayer doesn't support true pause, so it will stop)
4. **Stop**: Click the "⏹ Stop" button to stop playback and reset
5. **Volume**: Adjust the volume slider to control playback volume (note: JLayer volume control is limited)

## Controls

- **Open MP3 File** - Opens a file dialog to select an MP3 file
- **▶ Play** - Starts or resumes playback
- **⏸ Pause** - Pauses playback (restarts from beginning when resumed)
- **⏹ Stop** - Stops playback and resets progress
- **Volume Slider** - Adjusts playback volume (0-100%)

## Dependencies

- **JLayer 1.0.1** - MP3 audio playback library
- **Java Swing** - GUI framework (built-in)

## Limitations

- **Pause/Resume**: The JLayer library doesn't support true pause/resume functionality. When paused, playback stops and will restart from the beginning when played again.
- **Position Tracking**: JLayer doesn't provide precise position information, so the progress bar and time display are estimated.
- **Volume Control**: JLayer has limited volume control capabilities.

## Troubleshooting

### ClassNotFoundException

If you encounter `ClassNotFoundException`, make sure:
1. You're in the correct directory: `example-base-19/swing-mp3-player`
2. The project has been compiled: `mvn clean compile`
3. You're using the correct command: `mvn exec:java`

### MP3 File Not Playing

- Ensure the file is a valid MP3 format
- Check that the file path is correct and the file exists
- Verify the file is not corrupted
- Some MP3 encodings may not be fully supported by JLayer

### Audio Issues

- Check your system's audio settings
- Ensure audio drivers are properly installed
- Try different MP3 files to rule out file-specific issues

## Notes

- The application uses JLayer library for MP3 playback, which is a pure Java implementation
- Progress tracking is approximate since JLayer doesn't provide precise position information
- For production use, consider using more advanced audio libraries like JavaFX Media or VLCJ for better features

