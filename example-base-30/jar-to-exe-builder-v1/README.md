# JAR to EXE Builder V1

Java 17 Swing GUI wrapper around Windows `jpackage`.

Run:
mvn clean package
java -jar target/jar-to-exe-builder-v1-1.0.0.jar

Requirements on Windows:
- JDK 17+ (not only JRE)
- `jpackage` available on PATH
- WiX Toolset may be required by your JDK/jpackage setup for EXE installer generation.


## V1.1 compile fixes

This package fixes:
- `java.awt.List` vs `java.util.List` ambiguity.
- Invalid empty `ActionListener` argument for the Application field.
