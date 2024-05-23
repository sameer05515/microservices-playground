# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the application JAR file to the container
COPY target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway.jar

# Copy the application.yml file to the container
#COPY src/main/resources/application_for_docker.yml /app/application.yml
COPY src/main/resources/application.yml /app/application.yml

# Copy the backup directory to the container
#COPY src/main/resources/backup /app/backup

# Make the backup directory a volume to persist data
#VOLUME /app/backup

# Expose the port the application runs on
EXPOSE 8070

# Set the entry point to run the application
# ENTRYPOINT ["java", "-jar", "studentapp.jar"]

# Set the entry point to run the application with application.yml
ENTRYPOINT ["java", "-Dspring.config.location=file:/app/application.yml", "-jar", "api-gateway.jar"]
