# 1. Base image with JDK 21
FROM eclipse-temurin:21-jdk-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy jar (replace with your jar name)
COPY target/*.jar app.jar

# 4. Expose port
EXPOSE 8080

# 5. Run app
ENTRYPOINT ["java","-jar","app.jar"]
