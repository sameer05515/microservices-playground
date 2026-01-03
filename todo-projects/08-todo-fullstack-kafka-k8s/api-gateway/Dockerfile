FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/todo-api-gateway-1.0.0.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java","-jar","app.jar"]
