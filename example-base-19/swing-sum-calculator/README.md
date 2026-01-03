# Swing Sum Calculator

A simple Maven-based Java Swing application that calculates the sum of two integers.

## Features

- Clean and intuitive GUI
- Two input fields for integers
- Calculate button to compute the sum
- Result display field
- Input validation with error messages
- System look and feel

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use Maven wrapper)

## Building the Project

```bash
cd example-base-19/swing-sum-calculator
mvn clean compile
```

## Running the Application

### Option 1: Using Maven Exec Plugin

**Important:** Make sure you're in the `swing-sum-calculator` directory and the project is compiled first.

```bash
cd example-base-19/swing-sum-calculator
mvn exec:java
```

Or explicitly specify the main class:

```bash
mvn exec:java -Dexec.mainClass="com.example.swing.SumCalculator"
```

### Option 2: Build JAR and Run

```bash
# Build the JAR
mvn clean package

# Run the JAR
java -jar target/swing-sum-calculator-1.0.0.jar
```

### Option 3: Run from IDE

Run the `SumCalculator` class directly from your IDE (main method is in `src/main/java/com/example/swing/SumCalculator.java`).

## Project Structure

```
example-base-19/
└── swing-sum-calculator/
    ├── pom.xml
    ├── README.md
    └── src/
        └── main/
            └── java/
                └── com/
                    └── example/
                        └── swing/
                            └── SumCalculator.java
```

## Troubleshooting

### ClassNotFoundException

If you encounter `ClassNotFoundException: com.example.swing.SumCalculator`, make sure:

1. You're in the correct directory: `example-base-19/swing-sum-calculator`
2. The project has been compiled: `mvn clean compile`
3. You're using the correct command: `mvn exec:java`

## Usage

1. Enter the first integer in the "First Number" field
2. Enter the second integer in the "Second Number" field
3. Click the "Calculate Sum" button
4. The result will be displayed in the "Result" field

## Error Handling

- If either field is empty, a warning dialog will appear
- If invalid input (non-integer) is entered, an error dialog will appear

