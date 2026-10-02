mvn clean package
if ($LASTEXITCODE -eq 0) {
    java -jar target/swing-ques-ans-ui-1.0.0.jar
}
