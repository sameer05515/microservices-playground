# /microservices/eureka/Dockerfile
FROM openjdk:8-jre-alpine

# Set the version of Eureka server
ARG EUREKA_VERSION=1.10.11

# Download the Eureka server JAR file
RUN wget -O /eureka-server.jar https://repo1.maven.org/maven2/com/netflix/eureka/eureka-server/${EUREKA_VERSION}/eureka-server-${EUREKA_VERSION}.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "/eureka-server.jar"]
