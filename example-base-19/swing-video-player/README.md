# Swing Video Player

A Maven-based Java Swing application for playing video files using JavaFX MediaPlayer embedded in Swing.

## Features

- ✅ **File Selection** - Open and select video files (MP4, AVI, MOV, MKV, WMV, FLV, WebM, M4V)
- ✅ **Playback Controls** - Play, Pause, and Stop functionality
- ✅ **Progress Tracking** - Visual progress bar with click-to-seek
- ✅ **Time Display** - Current time and total duration
- ✅ **Volume Control** - Adjustable volume slider
- ✅ **Clean GUI** - User-friendly interface with video display area
- ✅ **File Information** - Display current playing file name

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use Maven wrapper)
- Video files for testing (MP4, AVI, MOV, MKV, WMV, FLV, WebM, M4V)

## Project Structure

```
swing-video-player/
├── pom.xml
├── README.md
├── run-with-javafx.bat    # Windows helper script (set JavaFX path)
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── swing/
                        └── VideoPlayerApp.java
```

## Building the Project

```bash
cd example-base-19/swing-video-player
mvn clean compile
```

## Running the Application

### Prerequisites for Running

**Important:** JavaFX requires native libraries that must be available at runtime. You have two options:

#### Option A: Download JavaFX SDK (Recommended)

1. Download JavaFX SDK 17.0.2 from [OpenJFX](https://openjfx.io/)
2. Extract it to a location (e.g., `C:\javafx-sdk-17.0.2`)
3. Add the native libraries to your system's library path or use the module path

#### Option B: Use JavaFX Runtime with Native Libraries

Ensure your JavaFX installation includes the native libraries for your platform.

### Option 1: Using Maven Exec Plugin (Windows - Easy Way)

**Windows users:** Use the provided batch script (recommended):

1. Edit `run-with-javafx.bat` and set `JAVA_FX_HOME` to your JavaFX SDK path
2. Run: `run-with-javafx.bat`

This script automatically adds JavaFX native libraries to your PATH.

**Manual way:**
```bash
cd example-base-19/swing-video-player
mvn exec:java
```

**If you get `UnsatisfiedLinkError: no glib-lite` error:**

You need to add JavaFX native libraries to your library path. Download JavaFX SDK and run:

**Windows:**
```bash
# Set JavaFX SDK path (adjust path as needed)
set JAVA_FX_HOME=C:\javafx-sdk-17.0.2

# Add native libraries to path
set PATH=%JAVA_FX_HOME%\bin;%PATH%

# Run the application
mvn exec:java
```

**Linux/Mac:**
```bash
export JAVA_FX_HOME=/path/to/javafx-sdk-17.0.2
export LD_LIBRARY_PATH=$JAVA_FX_HOME/lib:$LD_LIBRARY_PATH  # Linux
# or
export DYLD_LIBRARY_PATH=$JAVA_FX_HOME/lib:$DYLD_LIBRARY_PATH  # Mac

mvn exec:java
```

**Alternative: Using Module Path**

```bash
mvn exec:java -Dexec.mainClass="com.example.swing.VideoPlayerApp" \
  -Dexec.args="--module-path /path/to/javafx-sdk/lib --add-modules javafx.controls,javafx.media,javafx.swing"
```

### Option 2: Build JAR and Run

```bash
# Build the JAR
mvn clean package

# Run the JAR (requires JavaFX on module path)
java --module-path /path/to/javafx-sdk/lib \
     --add-modules javafx.controls,javafx.media,javafx.swing \
     -jar target/swing-video-player-1.0.0.jar
```

### Option 3: Run from IDE

Run the `VideoPlayerApp` class directly from your IDE (main method is in `src/main/java/com/example/swing/VideoPlayerApp.java`).

**IDE Setup:** Make sure your IDE is configured with JavaFX SDK and the required modules are added to the module path.

## Usage

1. **Open Video File**: Click the "Open Video File" button to select a video file from your computer
2. **Play**: Click the "▶ Play" button to start playback
3. **Pause**: Click the "⏸ Pause" button to pause playback
4. **Stop**: Click the "⏹ Stop" button to stop playback and reset
5. **Seek**: Click on the progress bar to jump to a specific position in the video
6. **Volume**: Adjust the volume slider to control playback volume (0-100%)

## Controls

- **Open Video File** - Opens a file dialog to select a video file
- **▶ Play** - Starts or resumes playback
- **⏸ Pause** - Pauses playback
- **⏹ Stop** - Stops playback and resets progress
- **Progress Bar** - Shows playback progress (click to seek)
- **Time Display** - Shows current time and total duration
- **Volume Slider** - Adjusts playback volume (0-100%)

## Supported Video Formats

The player supports common video formats:
- MP4 (H.264, H.265)
- AVI
- MOV (QuickTime)
- MKV
- WMV
- FLV
- WebM
- M4V

**Note:** Format support depends on the codecs installed on your system and JavaFX Media support.

## Dependencies

- **JavaFX Controls 17.0.2** - UI controls
- **JavaFX Media 17.0.2** - Media playback engine
- **JavaFX Swing 17.0.2** - JavaFX integration with Swing (JFXPanel)
- **Java Swing** - GUI framework (built-in)

## Troubleshooting

### UnsatisfiedLinkError: no glib-lite (Most Common Issue)

This error occurs because JavaFX Media requires native libraries that aren't automatically loaded. Here's how to fix it:

#### Quick Fix for Windows:

1. **Download JavaFX SDK:**
   - Visit https://openjfx.io/
   - Download JavaFX SDK 17.0.2 for Windows
   - Extract to a folder (e.g., `C:\javafx-sdk-17.0.2`)

2. **Add to System PATH:**
   ```cmd
   set PATH=C:\javafx-sdk-17.0.2\bin;%PATH%
   ```

3. **Run the application:**
   ```cmd
   mvn exec:java
   ```

#### Permanent Fix (Windows):

Add JavaFX bin directory to your system PATH environment variable:
1. Open System Properties → Environment Variables
2. Edit "Path" variable
3. Add: `C:\javafx-sdk-17.0.2\bin` (or your JavaFX SDK path)
4. Restart your terminal/IDE

#### Alternative: Use JavaFX Runtime with Native Libraries

Some Java distributions include JavaFX with native libraries. Check if your Java installation includes JavaFX.

### ClassNotFoundException or Module Issues

If you encounter module-related errors:

1. **Download JavaFX SDK**: Download JavaFX SDK 17.0.2 or compatible version from [OpenJFX](https://openjfx.io/)
2. **Set Module Path**: Add JavaFX modules to your module path when running
3. **IDE Configuration**: Configure your IDE to include JavaFX SDK in the module path

### Video Not Playing

- Ensure the file is a supported video format
- Check that the file path is correct and the file exists
- Verify the file is not corrupted
- Some codecs may not be supported - try a different video file
- Ensure your system has the necessary codecs installed

### Audio Issues

- Check your system's audio settings
- Ensure audio drivers are properly installed
- Try different video files to rule out file-specific issues

### JavaFX Initialization Errors

If you see JavaFX toolkit initialization errors:
- Make sure JavaFX dependencies are properly downloaded
- Verify JavaFX modules are accessible
- Check that you're using Java 17 or higher

### UnsatisfiedLinkError: no glib-lite

This error means JavaFX native libraries are missing. Solutions:

1. **Download JavaFX SDK:**
   - Go to https://openjfx.io/
   - Download JavaFX SDK 17.0.2 for your platform
   - Extract it to a directory

2. **Add Native Libraries to Path:**
   
   **Windows:**
   ```cmd
   set PATH=C:\javafx-sdk-17.0.2\bin;%PATH%
   ```
   
   **Linux:**
   ```bash
   export LD_LIBRARY_PATH=/path/to/javafx-sdk-17.0.2/lib:$LD_LIBRARY_PATH
   ```
   
   **Mac:**
   ```bash
   export DYLD_LIBRARY_PATH=/path/to/javafx-sdk-17.0.2/lib:$DYLD_LIBRARY_PATH
   ```

3. **Or Use JavaFX Runtime:**
   - Use a JavaFX runtime distribution that includes native libraries
   - Some IDEs bundle JavaFX with native libraries

4. **Alternative: Use jlink to create a custom runtime:**
   ```bash
   jlink --module-path $JAVA_FX_HOME/lib --add-modules javafx.controls,javafx.media,javafx.swing --output javafx-runtime
   ```

## Technical Notes

- The application uses JavaFX MediaPlayer embedded in Swing using `JFXPanel`
- JavaFX runs on its own thread (JavaFX Application Thread)
- All JavaFX operations must be performed on the JavaFX thread using `Platform.runLater()`
- The video display area uses a black background when no video is loaded

## Limitations

- **Codec Support**: Video playback depends on codecs supported by JavaFX Media
- **Performance**: Large video files may require more system resources
- **Format Support**: Not all video formats may be supported - depends on JavaFX Media capabilities

## Alternative Approaches

For more advanced video playback features, consider:
- **VLCJ** - VLC Java bindings (requires VLC installation)
- **FFmpeg** - Command-line video processing
- **GStreamer** - Multimedia framework bindings

## Notes

- The application uses JavaFX MediaPlayer which is part of OpenJFX
- Video playback requires JavaFX runtime to be available
- For production use, consider bundling JavaFX runtime with your application

